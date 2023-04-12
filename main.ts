import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";

type Card = {
  id: number;
  question: string;
  answer: string;
};

class CardDb {
  private cards: Card[] = [];

  addCard(card: Card) {
    this.cards.push(card);
  }

  addCardList(card: Card[]) {
    this.cards.push(...card);
  }

  getCard(id: number): Card | null {
    return this.cards.find((card) => card.id === id) ?? null;
  }
}

const router = new Router();
router.get("/ping", (ctx) => {
  ctx.response.body = "Pong";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Server running on port ${port}`);
await app.listen({ port });
