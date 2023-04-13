import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { cardOne, cardTwo, initialCards, NOW } from "./mock_cards.ts";
import { getApp } from "../src/app.ts";

const app = await getApp(() => NOW);

Deno.test("import", async () => {
  const request = await superoak(app);

  await request.put("/cards")
    .send(initialCards)
    .expect(201).expect({
      "message": "Cards imported",
      "amount": initialCards.length,
    });
});

Deno.test("import invalid cards", async () => {
  const request = await superoak(app);

  await request.put("/cards")
    .send({
      "garbage": "data",
    })
    .expect(400);
});

Deno.test("get currently available cards", async () => {
  const request = await superoak(app);
  const expected = [
    {
      id: 1,
      question: "What is the capital of France?",
      whenReview: 1681157189583,
      currentFib: 3,
    },
    {
      id: 2,
      question: "What is the capital of Germany?",
      whenReview: 1681243589583,
      currentFib: 5,
    },
  ];

  await request.get("/cards").expect(200).expect(expected);
});

Deno.test("get existing card by id", async () => {
  const request = await superoak(app);
  const expected = {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    whenReview: cardOne.whenReview,
    currentFib: 3,
  };

  await request.get("/cards/1").expect(200).expect(expected);
});

Deno.test("get not-existing card by id", async () => {
  const request = await superoak(app);

  await request.get("/cards/99999").expect(404);
});

Deno.test("submit an answer", async () => {
  const request = await superoak(app);

  await request.patch("/cards/1").send({
    answer: "Paris",
  }).expect(200).expect({
    id: 1,
    question: cardOne.question,
    answer: cardOne.answer,
    whenReview: 1681761989583,
    currentFib: 5,
  });
});

Deno.test("submit answer with bad body", async () => {
  const request = await superoak(app);

  await request.patch("/cards/2").send({
    "garbage": "data",
  }).expect(400);
});

Deno.test("submit an answer with wrong answer", async () => {
  const request = await superoak(app);

  await request.patch("/cards/2").send({
    answer: "wrong answer",
  }).expect(200).expect({
    id: 2,
    question: cardTwo.question,
    answer: cardTwo.answer,
    whenReview: 1681416389583,
    currentFib: 1,
  });
});
