import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

type CardDb = {
  id: number;
  question: string;
  answer: string;
  whenReview: number;
  currentFib: number;
};

export type DbClient = Awaited<ReturnType<typeof getClient>>;

type Args = {
  getNow?: () => number;
};

export const getClient = async ({ getNow = Date.now }: Args) => {
  const client = new Client({
    database: Deno.env.get("POSTGRES_DATABASE"),
    hostname: Deno.env.get("POSTGRES_HOSTNAME"),
    password: Deno.env.get("POSTGRES_PASSWORD"),
    port: Deno.env.get("POSTGRES_PORT"),
    user: Deno.env.get("POSTGRES_USER"),
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

  const update = async (card: CardDb) => {
    const result = await client.queryObject<
      CardDb
    >(
      {
        text: `
      UPDATE cards
      SET question = $1, answer = $2, when_review = $3, current_fib = $4
      WHERE id = $5
      RETURNING id, question, answer, when_review, current_fib
      `,
        camelcase: true,
        args: [
          card.question,
          card.answer,
          card.whenReview,
          card.currentFib,
          card.id,
        ],
      },
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

  const select = async (id: number) => {
    const result = await client.queryObject<CardDb>(
      {
        text: `
      SELECT id, question, answer, when_review, current_fib
      FROM cards
      WHERE id = $1
      `,
        // TODO convert all the other queries to use this
        camelcase: true,
        args: [id],
      },
    );
    return result;
  };

  const getActiveCards = () =>
    client.queryObject<CardDb>(
      `
      SELECT id, question, answer, when_review, current_fib
      FROM cards
      WHERE when_review <= $1
      `,
      [getNow()],
    );

  const getAllCards = () =>
    client.queryObject<CardDb>(
      `
      SELECT id, question, answer, when_review, current_fib
      FROM cards
      `,
    );

  return {
    insert,
    trunkate,
    select,
    getActiveCards,
    getAllCards,
    update,
  };
};
