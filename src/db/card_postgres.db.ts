import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

type CardDb = {
  id: number;
  question: string;
  answer: string;
  whenReview: number;
  currentFib: number;
};

export type DbClient = Awaited<ReturnType<typeof getClient>>;

export const getClient = async () => {
  const client = new Client({
    // TODO read from env
    database: "postgres",
    hostname: "localhost",
    port: 5432,
    user: "kolaczyn",
  });
  await client.connect();

  const trunkate = async () => {
    const result = await client.queryObject<CardDb>(
      `
      TRUNCATE TABLE cards RESTART IDENTITY
      `,
    );
    return result;
  };

  const insert = async (card: Omit<CardDb, "id">) => {
    const result = await client.queryObject<
      CardDb
    >(
      `
      INSERT INTO cards (question, answer, when_review, current_fib)
      VALUES ($1, $2, $3, $4)
      RETURNING id, question, answer, when_review, current_fib
      `,
      [
        card.question,
        card.answer,
        card.whenReview,
        card.currentFib,
      ],
    );
    return result;
  };

  const getById = async (id: number) => {
    const result = await client.queryObject<CardDb>(
      "SELECT id, question, answer, when_review, current_fib FROM cards WHERE id = $1",
      [id],
    );
    return result;
  };

  return {
    getById,
    insert,
    trunkate,
  };
};
