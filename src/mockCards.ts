import { Card } from "./card_db.ts";
import { ONE_DAY } from "./constants.ts";

export const NOW = 1681329989583;

export const cardOne = {
  id: 1,
  question: "What is the capital of France?",
  answer: "Paris",
  whenReview: NOW - ONE_DAY * 2,
  currentFib: 3,
};

export const cardTwo = {
  id: 2,
  question: "What is the capital of Germany?",
  answer: "Berlin",
  whenReview: NOW - ONE_DAY,
  currentFib: 5,
};

export const cardThree = {
  id: 3,
  question: "What is the capital of Italy?",
  answer: "Rome",
  whenReview: NOW + ONE_DAY * 2,
  currentFib: 8,
};

export const initialCards: Card[] = [
  cardOne,
  cardTwo,
  cardThree,
];
