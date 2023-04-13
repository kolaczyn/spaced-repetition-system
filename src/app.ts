import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { CardDbClient } from "./db/card_db.ts";
import { pingRoute } from "./routes/ping.ts";
import { cardRoute } from "./routes/card.ts";
import { cardV2Route } from "./routes/cards_v2.ts";
import { getClient } from "./db/card_postgres.db.ts";
import "./monkey_patch.ts";

export const getApp = async (getNow = Date.now) => {
  const inMemCardsDb = new CardDbClient([], getNow);
  const dbClient = await getClient();
  const router = new Router();

  router.use("/ping", pingRoute().routes());
  router.use("/cards", cardRoute(inMemCardsDb).routes());
  router.use("/v2/cards", cardV2Route(dbClient, getNow).routes());

  return new Application().use(router.routes()).use(router.allowedMethods());
};
