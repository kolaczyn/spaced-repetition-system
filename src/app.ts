import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { pingRoute } from "./routes/ping.ts";
import { cardsRoute } from "./routes/cards.ts";
import { getClient } from "./db/card_postgres.db.ts";
import "./monkey_patch.ts";

export const getApp = async (getNow = Date.now) => {
  const dbClient = await getClient({});
  const router = new Router();

  router.use("/v1/ping", pingRoute().routes());
  // TODO make this v1
  router.use("/v2/cards", cardsRoute(dbClient, getNow).routes());

  return new Application().use(router.routes()).use(router.allowedMethods());
};
