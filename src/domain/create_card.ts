import { CardDomain } from "./types.ts";

type Args = {
  question: string;
  answer: string;
  getNow: () => number;
};

export const createCard = (
  { answer, question, getNow = Date.now }: Args,
): Omit<CardDomain, "id"> => ({
  answer,
  currentFib: 1,
  question,
  whenReview: getNow(),
});
