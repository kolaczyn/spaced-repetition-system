import { assertEquals } from "https://deno.land/std@0.183.0/testing/asserts.ts";
import { getWhenToReview } from "./get_when_to_review.ts";
import { ONE_DAY } from "./constants.ts";

Deno.test("review in 24 hours if answer incorrect", () => {
  assertEquals(
    getWhenToReview({ isAnswerCorrect: false, currentFib: 1, now: 0 }),
    { nextFib: 1, whenReview: ONE_DAY }
  );
});

Deno.test("review in 6 days if answer correct", () => {
  assertEquals(
    getWhenToReview({ isAnswerCorrect: true, currentFib: 3, now: 0 }),
    { nextFib: 5, whenReview: 5 * ONE_DAY }
  );
});
