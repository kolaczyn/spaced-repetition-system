import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { app } from "../app.ts";
import { cardOne, cardTwo, initialCards } from "../mockCards.ts";

Deno.test("cards integration test", async () => {
  const request1 = await superoak(app);

  await request1.put("/cards")
    .send(initialCards)
    .expect(201).expect({
      "message": "Cards imported",
      "amount": initialCards.length,
    });

  const request2 = await superoak(app);
  const expected = [{
    id: 1,
    question: "What is the capital of France?",
    whenReview: 1681329989583,
    currentFib: 3,
  }, {
    id: 2,
    question: "What is the capital of Germany?",
    whenReview: 1681243589583,
    currentFib: 5,
  }];

  await request2.get("/cards").expect(200).expect(expected);
});
