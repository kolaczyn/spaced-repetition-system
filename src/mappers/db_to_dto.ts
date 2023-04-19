import { CardDb } from "../db/card_db.ts";
import { CardDto } from "../routes/dto.ts";

export const dbToDto = (db: CardDb): CardDto => ({
  id: db.id,
  question: db.question,
  answer: db.answer,
  whenReview: db.whenReview,
});
