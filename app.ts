import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { CardDb } from "./card_db.ts";
import { initialCards } from "./mockCards.ts";

const cardDb = new CardDb(initialCards);

const router = new Router();

router.get("/ping", (ctx) => {
  ctx.response.body = "Pong";
});

router.put("/cards", async (ctx) => {
  // TODO add proper validation
  console.log(ctx.request.headers);
  const cards = await ctx.request.body().value;

  if (!Array.isArray(cards)) {
    ctx.response.status = 400;
    return;
  }

  cardDb.importData(cards);
  ctx.response.status = 201;
  ctx.response.body = {
    message: "Cards imported",
    amount: cards.length,
  };
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

export const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
