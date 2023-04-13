import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";
import "https://deno.land/std@0.182.0/dotenv/load.ts";

const client = new ClientPostgreSQL({
  database: Deno.env.get("POSTGRES_DATABASE"),
  hostname: Deno.env.get("POSTGRES_HOSTNAME"),
  password: Deno.env.get("POSTGRES_PASSWORD"),
  port: Deno.env.get("POSTGRES_PORT"),
  user: Deno.env.get("POSTGRES_USER"),
});

const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
