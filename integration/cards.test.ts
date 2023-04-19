import "std/dotenv/load.ts";
import { superoak } from "superoak/mod.ts";
import { getApp } from "../src/app.ts";
import { Card, cardOne, cardThree, cardTwo } from "./mock_cards.ts";
import { timeSimulation } from "../src/test/time_simulation.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { beforeEach, it } from "std/testing/bdd.ts";
import { assertObjectMatch } from "https://deno.land/std@0.160.0/testing/asserts.ts";

const deleteCards = async () => {
  const request = await superoak(app);
  await request.delete("/v2/cards").expect(200);
};

beforeEach(async () => {
  await deleteCards();
});

const { getNow } = timeSimulation();
const app = await getApp(getNow);

it("inserts a card and gets the card", async () => {
  const request1 = await superoak(app);
  const response = await request1.post("/v2/cards").send({
    question: cardOne.question,
    answer: cardOne.answer,
  }).expect(201).expect((x) => {
    assertObjectMatch(x.body, {
      question: cardOne.question,
      answer: cardOne.answer,
    });
  });

  const card = response.body as Card;
  const request2 = await superoak(app);
  await request2.get(`/v2/cards/${card.id}`).expect(200).expect((x) => {
    assertObjectMatch(x.body, {
      question: cardOne.question,
      answer: cardOne.answer,
    });
  });
});

it("get not existing card", async () => {
  const request = await superoak(app);
  await request.get("/v2/cards/9999").expect(404);
});

it("card with id which is not a number", async () => {
  const request = await superoak(app);
  await request.get("/v2/cards/abc").expect(400);
});

it("insert invalid", async () => {
  const request = await superoak(app);
  await request.post("/v2/cards").send({
    question: 20000,
    answer: {
      garbage: "data",
    },
  }).expect(400);
});

it("answers a card to make it not active", { only: true }, async () => {
  const request1 = await superoak(app);
  const response = await request1.post("/v2/cards").send({
    question: cardOne.question,
    answer: cardOne.answer,
  }).expect(201);

  const request2 = await superoak(app);
  await request2.get("/v2/cards?active").expect(200).expect((x) =>
    assertEquals(x.body.length, 1)
  );

  const card = response.body as Card;
  const request3 = await superoak(app);
  await request3.patch(`/v2/cards/${card.id}`).send({
    answer: cardOne.answer,
  }).expect(200);

  // TODO fix this test
  // const request4 = await superoak(app);
  // await request4.get("/v2/cards?active").expect(200).expect((x) =>
  //   assertEquals(x.body.length, 0)
  // );
});

it("gets all cards", async () => {
  const request0 = await superoak(app);
  await request0.get("/v2/cards").expect(200).expect((x) => {
    assertEquals(x.body.length, 0);
  });

  const request1 = await superoak(app);
  await request1.post("/v2/cards").send(cardOne).expect(201);

  const request2 = await superoak(app);
  await request2.post("/v2/cards").send(cardTwo).expect(201);

  const request3 = await superoak(app);
  await request3.post("/v2/cards").send(cardThree).expect(201);

  const request4 = await superoak(app);
  await request4.get("/v2/cards?active").expect(200).expect((x) => {
    assertEquals(x.body.length, 3);
  });

  const request5 = await superoak(app);
  await request5.get("/v2/cards").expect(200).expect((x) => {
    assertEquals(x.body.length, 3);
  });
});
