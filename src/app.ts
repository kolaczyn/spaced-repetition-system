import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { CardDb } from "./db/card_db.ts";

export const getApp = (getNow = Date.now) => {
  const cardDb = new CardDb([], getNow);

  const router = new Router();

  router.get("/ping", (ctx) => {
    ctx.response.body = "Pong";
  });

  router.put("/cards", async (ctx) => {
    // TODO add proper validation
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

  router.get("/cards/:id", (ctx) => {
    const id = Number(ctx.params.id);
    const card = cardDb.getCard(id);
    if (!card) {
      ctx.response.status = 404;
      return;
    }
    ctx.response.body = card;
  });

  router.patch("/cards/:id", async (ctx) => {
    const id = Number(ctx.params.id);
    // TODO add validation
    const { answer } = await ctx.request.body().value;
    const card = cardDb.submitAnswer(id, answer);
    ctx.response.body = card;
  });

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
};
