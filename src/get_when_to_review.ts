import { ONE_DAY } from "./constants.ts";
import { getNextFib } from "./fib.ts";

type Args = {
  isAnswerCorrect: boolean;
  now: number;
  currentFib: number;
};

export const getWhenToReview = ({
  isAnswerCorrect,
  currentFib,
  now,
}: Args): { nextFib: number; whenReview: number } => {
  const nextFib = isAnswerCorrect ? getNextFib(currentFib) : 1;
  return {
    nextFib,
    whenReview: now + ONE_DAY * nextFib,
  };
};
