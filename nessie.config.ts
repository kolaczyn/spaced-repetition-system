import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

const client = new ClientPostgreSQL({
  // TODO read from env
  database: "postgres",
  hostname: "localhost",
  port: 5432,
  user: "kolaczyn",
});

const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
