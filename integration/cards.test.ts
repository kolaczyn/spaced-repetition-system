import "https://deno.land/std@0.182.0/dotenv/load.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/src/superoak.ts";
import { getApp } from "../src/app.ts";
import { Card, cardOne, cardThree, cardTwo, NOW } from "./mock_cards.ts";
import { timeSimulation } from "../src/test/time_simulation.ts";
import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";

const app = await getApp(() => NOW);

const deleteCards = async () => {
  const request = await superoak(app);
  await request.delete("/v2/cards").expect(200);
};

Deno.test("delete cards to have a clean slate", async () => {
  await deleteCards();
});

Deno.test("insert and get card", async () => {
  const request1 = await superoak(app);
  const response = await request1.post("/v2/cards").send({
    question: cardOne.question,
    answer: cardOne.answer,
  }).expect(201).expect((x) => {
    assertEquals(x.body.answer, cardOne.answer);
    assertEquals(x.body.question, cardOne.question);
  });

  const card = response.body as Card;
  const request2 = await superoak(app);
  await request2.get(`/v2/cards/${card.id}`).expect(200).expect((x) => {
    assertEquals(x.body.answer, cardOne.answer);
    assertEquals(x.body.question, cardOne.question);
  });
});

Deno.test("get not existing card", async () => {
  const request = await superoak(app);
  await request.get("/v2/cards/9999").expect(404);
});

Deno.test("card with id which is not a number", async () => {
  const request = await superoak(app);
  await request.get("/v2/cards/abc").expect(400);
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

Deno.test("delete cards to have a clean slate", async () => {
  await deleteCards();
});

const { getNow } = timeSimulation();
const anotherApp = await getApp(getNow);

Deno.test("get all cards", async () => {
  const request1 = await superoak(anotherApp);
  await request1.post("/v2/cards").send(cardOne).expect(201);

  const request2 = await superoak(app);
  await request2.post("/v2/cards").send(cardTwo).expect(201);

  const request3 = await superoak(app);
  await request3.post("/v2/cards").send(cardThree).expect(201);

  const request4 = await superoak(app);
  await request4.get("/v2/cards?active").expect(200).expect((x) =>
    x.body.length === 3
  );

  const request5 = await superoak(app);
  await request5.get("/v2/cards?active").expect(200).expect((x) => {
    assertEquals(x.body.length, 3);
  });

  const request6 = await superoak(app);
  await request6.get("/v2/cards").expect(200).expect((x) => {
    assertEquals(x.body.length, 3);
  });
});
