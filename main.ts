import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { cardDb } from "./card_db.ts";

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
