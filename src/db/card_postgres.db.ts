import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

export const runDb = async () => {
  const client = new Client({
    // TODO read from env
    user: "kolaczyn",
    database: "postgres",
    hostname: "localhost",
    port: 5432,
  });
  await client.connect();

  const array_result = await client.queryArray("SELECT id FROM users");
  console.log(array_result.rows); // [[1, 'Carlos'], [2, 'John'], ...]

  await client.end();
};
