import { Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { DbClient } from "../db/card_postgres.db.ts";
import z from "https://deno.land/x/zod@v3.21.4/index.ts";

export const cardV2Route = (
  dbClient: DbClient,
  getNow: () => number,
) => {
  const router = new Router();

  router.delete("/", async (ctx) => {
    const _result = await dbClient.trunkate();
    ctx.response.body = {
      message: "Deleted all cards",
    };
  });

  router.post("/", async (ctx) => {
    const body = await ctx.request.body().value;
    const result = z.object({
      question: z.string(),
      answer: z.string(),
    })
      .safeParse({
        question: body.question,
        answer: body.answer,
      });
    if (!result.success) {
      ctx.response.status = 400;
      ctx.response.body = result.error;
      return;
    }

    const lol = {
      answer: result.data.answer,
      currentFib: 0,
      question: result.data.question,
      whenReview: getNow(),
    };
    const insertResult = await dbClient.insert(lol);
    const createdCard = insertResult.rows[0];
    ctx.response.status = 201;
    ctx.response.body = createdCard;
  });

  router.get("/", async (ctx) => {
    const result = await dbClient.getById(1);
    const foundCard = result.rows[0];
    console.log(foundCard);
    ctx.response.body = foundCard;
  });

  return router;
};
