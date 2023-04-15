import { assertEquals } from "std/testing/asserts.ts";
import { createCard } from "./create_card.ts";
import { isCardActive } from "./is_card_active.ts";
import { answerCard } from "./answer_card.ts";
import { timeSimulation } from "../test/time_simulation.ts";

Deno.test("Spaced Repetition System", () => {
  const { getNow, passDay } = timeSimulation();

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
