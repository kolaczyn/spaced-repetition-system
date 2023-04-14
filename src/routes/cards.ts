import { Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { DbClient } from "../db/card_postgres.db.ts";
import z from "https://deno.land/x/zod@v3.21.4/index.ts";
import { Status } from "https://deno.land/std@0.178.0/http/http_status.ts";

export const cardsRoute = (
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

    const insertResult = await dbClient.insert(
      {
        answer: result.data.answer,
        currentFib: 0,
        question: result.data.question,
        whenReview: getNow(),
      },
    );
    const createdCard = insertResult.rows[0];
    ctx.response.status = Status.Created;
    ctx.response.body = createdCard;
  });

  router.get("/:id", async (ctx) => {
    const result = z.coerce.number().safeParse(ctx.params.id);
    if (!result.success) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = result.error;
      return;
    }

    const id = result.data;
    const card = await dbClient.select(id);
    if (card.rows.length === 0) {
      ctx.response.status = Status.NotFound;
      return;
    }
    ctx.response.body = card.rows[0];
  });

  router.get("/", async (ctx) => {
    const active = ctx.request.url.searchParams.get("active") !== null;
    if (active) {
      const cards = await dbClient.getActiveCards();
      ctx.response.body = cards.rows;
      return;
    }
    const cards = await dbClient.getAllCards();
    ctx.response.body = cards.rows;
  });

  return router;
};
