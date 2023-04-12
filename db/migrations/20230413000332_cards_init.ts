import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    await this.client.queryArray(`
        CREATE TABLE IF NOT EXISTS cards (
            id SERIAL PRIMARY KEY,
            question VARCHAR(255) NOT NULL,
            answer VARCHAR(255) NOT NULL,
            when_review BIGINT NOT NULL,
            current_fib INT NOT NULL
        )
    `);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray(`
        DROP TABLE IF EXISTS cards
        `);
  }
}
