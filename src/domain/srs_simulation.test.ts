import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { createCard } from "./create_card.ts";
import { isCardActive } from "./is_card_active.ts";
import { answerCard } from "./answer_card.ts";
import { ONE_DAY } from "../constants.ts";

Deno.test("Spaced Repetition System", () => {
  let currentTime = 0;
  const passDay = () => {
    currentTime += ONE_DAY;
  };
  const getNow = () => currentTime;

  const correctAnswer = "correct";
  const wrongAnswer = "wrong";

  let card = {
    ...createCard({
      question: "Question",
      answer: correctAnswer,
      getNow,
    }),
    id: 1,
  };
  // 0
  assertEquals(isCardActive({ card, getNow }), true);

  // 1
  card = answerCard({
    card,
    answer: correctAnswer,
    getNow,
  });
  assertEquals(isCardActive({ card, getNow }), false);
  passDay();
  assertEquals(isCardActive({ card, getNow }), true);

  // 2
  card = answerCard({
    card,
    answer: correctAnswer,
    getNow,
  });
  assertEquals(isCardActive({ card, getNow }), false);
  passDay();
  assertEquals(isCardActive({ card, getNow }), false);
  passDay();
  assertEquals(isCardActive({ card, getNow }), true);

  card = answerCard({
    card,
    answer: correctAnswer,
    getNow,
  });

  // 3
  card = answerCard({
    card,
    answer: wrongAnswer,
    getNow,
  });
  assertEquals(isCardActive({ card, getNow }), true);
  passDay();
  assertEquals(isCardActive({ card, getNow }), true);
  passDay();
  assertEquals(isCardActive({ card, getNow }), true);
  passDay();
  assertEquals(isCardActive({ card, getNow }), true);

  card = answerCard({
    card,
    answer: correctAnswer,
    getNow,
  });
  assertEquals(isCardActive({ card, getNow }), false);
  passDay();
  assertEquals(isCardActive({ card, getNow }), true);
});
