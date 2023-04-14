import "https://deno.land/std@0.182.0/dotenv/load.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/src/superoak.ts";
import { getApp } from "../src/app.ts";
import { cardOne, NOW } from "./mock_cards.ts";

const app = await getApp(() => NOW);

Deno.test("delete cards", async () => {
  const request = await superoak(app);
  await request.delete("/v2/cards").expect(200);
});

Deno.test("insert card", async () => {
  const request = await superoak(app);
  await request.post("/v2/cards").send({
    question: cardOne.question,
    answer: cardOne.answer,
  }).expect(201).expect((x) => {
    return x.body.answer === cardOne.answer &&
      x.body.question === cardOne.question;
  });
});

Deno.test("insert invalid", async () => {
  const request = await superoak(app);
  await request.post("/v2/cards").send({
    question: 20000,
    answer: {
      garbage: "data",
    },
  }).expect(400);
});
