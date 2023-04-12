import { Application, Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";
import { CardDb } from "./db/card_db.ts";
import { pingRoute } from "./routes/ping.ts";
import { cardRoute } from "./routes/card.ts";

export const getApp = (getNow = Date.now) => {
  const cardDb = new CardDb([], getNow);
  const router = new Router();

  router.use("/ping", pingRoute().routes());
  router.use("/cards", cardRoute(cardDb).routes());

  return new Application().use(router.routes()).use(router.allowedMethods());
};
