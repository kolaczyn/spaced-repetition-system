import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { getNextFib } from "./fib.ts";

type Card = {
  id: number;
  question: string;
  answer: string;
  whenReview: number;
  currentFib: number;
};

const ONE_DAY = 1000 * 60 * 60 * 24;

type Args = {
  isAnswerCorrect: boolean;
  now: number;
  currentFib: number;
};

const getWhenToReview = ({
  isAnswerCorrect,
  currentFib,
  now,
}: Args): { nextFib: number; whenReview: number } => {
  const nextFib = isAnswerCorrect ? getNextFib(currentFib) : 1;
  return {
    nextFib,
    whenReview: now + ONE_DAY * nextFib,
  };
};

class CardDb {
  #cards: Card[] = [];

  constructor(cards: Card[]) {
    this.#cards = cards;
  }

  addCard(card: Card) {
    this.#cards.push(card);
  }

  addCardList(card: Card[]) {
    this.#cards.push(...card);
  }

  getCard(id: number): Card | null {
    return this.#cards.find((card) => card.id === id) ?? null;
  }

  getCardsToReview(): Omit<Card, "answer">[] {
    const now = Date.now();
    return (
      this.#cards
        .filter((card) => card.whenReview < now)
        .map((x) => ({
          id: x.id,
          question: x.question,
          whenReview: x.whenReview,
          currentFib: x.currentFib,
        })) ?? null
    );
  }

  #setCard(card: Card): boolean {
    const { id } = card;
    const index = this.#cards.findIndex((card) => card.id === id);
    if (index === -1) return false;
    this.#cards[index] = card;
    return true;
  }

  submitAnswer(id: number, answer: string): Card | null {
    const card = this.getCard(id);
    if (!card) return null;
    const isAnswerCorrect =
      card.answer.toLocaleLowerCase() === answer.toLocaleLowerCase();
    const { nextFib, whenReview } = getWhenToReview({
      isAnswerCorrect,
      currentFib: card.currentFib,
      now: Date.now(),
    });
    const newCard: Card = {
      ...card,
      whenReview,
      currentFib: nextFib,
    };
    this.#setCard(newCard);
    return this.getCard(id);
  }
}

const cardDb = new CardDb([
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    whenReview: Date.now(),
    currentFib: 3,
  },
  {
    id: 2,
    question: "What is the capital of Germany?",
    answer: "Berlin",
    whenReview: Date.now() - ONE_DAY,
    currentFib: 5,
  },
  {
    id: 3,
    question: "What is the capital of Italy?",
    answer: "Rome",
    whenReview: Date.now() + ONE_DAY * 2,
    currentFib: 8,
  },
]);

const router = new Router();

router.get("/ping", (ctx) => {
  ctx.response.body = "Pong";
});

router.get("/cards", (ctx) => {
  ctx.response.body = cardDb.getCardsToReview();
});

router.post("/cards/:id", async (ctx) => {
  const id = Number(ctx.params.id);
  // TODO add validation
  const { answer } = await ctx.request.body().value;
  const card = cardDb.submitAnswer(id, answer);
  ctx.response.body = card;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Server running on port ${port}`);
await app.listen({ port });
