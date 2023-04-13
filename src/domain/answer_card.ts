import { ONE_DAY } from "../constants.ts";
import { getNextFib } from "../fib/fib.ts";
import { getIsAnswerCorrect } from "./get_is_answer_correct.ts";
import { CardDomain } from "./types.ts";

type Args = {
  card: CardDomain;
  answer: string;
  getNow: () => number;
};

export const answerCard = (
  { answer, card, getNow = Date.now }: Args,
): CardDomain => {
  const isCorrect = getIsAnswerCorrect({ card, answer });
  const nextFib = isCorrect ? getNextFib(card.currentFib) : 1;
  const whenNextReview = isCorrect
    ? getNow() + card.currentFib * ONE_DAY
    : getNow();
  return {
    ...card,
    currentFib: nextFib,
    whenReview: whenNextReview,
  };
};
