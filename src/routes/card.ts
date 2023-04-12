import { Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { CardDb } from "../db/card_db.ts";
import { patchCardValidation } from "../validation/patch_card.ts";

export const cardRoute = (cardDb: CardDb) => {
  const router = new Router();

  router.put("/", async (ctx) => {
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

  router.get("/", (ctx) => {
    ctx.response.body = cardDb.getCardsToReview();
  });

  router.get("/:id", (ctx) => {
    const id = Number(ctx.params.id);
    const card = cardDb.getCard(id);
    if (!card) {
      ctx.response.status = 404;
      return;
    }
    ctx.response.body = card;
  });

  router.patch("/:id", async (ctx) => {
    const body = await ctx.request.body().value;
    const result = patchCardValidation.safeParse({
      id: ctx.params.id,
      answer: body.answer,
    });
    if (!result.success) {
      ctx.response.status = 400;
      ctx.response.body = result.error;
      return;
    }
    const { id, answer } = result.data;
    const card = cardDb.submitAnswer(id, answer);
    ctx.response.body = card;
  });

  return router;
};
