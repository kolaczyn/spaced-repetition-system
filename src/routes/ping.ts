import { Router } from "oak/mod.ts";

export const pingRoute = () => {
  const router = new Router();

  router.get("/", (ctx) => {
    ctx.response.body = "Pong";
  });
  return router;
};
