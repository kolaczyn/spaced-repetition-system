import { getWhenToReview } from "./get_when_to_review.ts";

export type Card = {
  id: number;
  question: string;
  answer: string;
  whenReview: number;
  currentFib: number;
};

export class CardDb {
  #cards: Card[] = [];

  constructor(cards: Card[], private getNow = Date.now) {
    this.#cards = cards;
  }

  importData(cards: Card[]) {
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
    const now = this.getNow();
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
      now: this.getNow(),
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
