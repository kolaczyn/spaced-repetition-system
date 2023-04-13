import { assertEquals } from "https://deno.land/std@0.183.0/testing/asserts.ts";
import { CardDomain } from "./types.ts";
import { answerCard } from "./answer_card.ts";
import { createCard } from "./create_card.ts";
import { ONE_DAY } from "../constants.ts";

const NOW = 0;
const correct = "correct";
const incorrect = "wrong";

Deno.test("correct answer of a new card", () => {
  const card: CardDomain = {
    ...createCard(
      {
        question: "question",
        answer: correct,
        getNow: () => NOW,
      },
    ),
    id: 1,
  };
  const newCard = answerCard({
    card,
    getNow: () => NOW,
    answer: correct,
  });
  const expected = {
    question: "question",
    answer: correct,
    whenReview: 1 * ONE_DAY,
    currentFib: 2,
    id: 1,
  };
  assertEquals(newCard, expected);
});

Deno.test("correct answer of an old card", () => {
  const card: CardDomain = {
    question: "question",
    answer: correct,
    whenReview: NOW,
    currentFib: 8,
    id: 1,
  };
  const newCard = answerCard({
    card,
    getNow: () => NOW,
    answer: correct,
  });
  const expected = {
    question: "question",
    answer: correct,
    whenReview: 8 * ONE_DAY,
    currentFib: 13,
    id: 1,
  };
  assertEquals(newCard, expected);
});

Deno.test("incorrect answer of an old card", () => {
  const card: CardDomain = {
    question: "question",
    answer: correct,
    whenReview: NOW,
    currentFib: 8,
    id: 1,
  };
  const newCard = answerCard({
    card,
    getNow: () => NOW,
    answer: incorrect,
  });
  const expected = {
    question: "question",
    answer: correct,
    whenReview: NOW,
    currentFib: 1,
    id: 1,
  };
  assertEquals(newCard, expected);
});
