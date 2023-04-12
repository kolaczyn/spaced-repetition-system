import { Router } from "https://deno.land/x/oak@v12.1.0/mod.ts";

export const pingRoute = () => {
  const router = new Router();

  router.get("/", (ctx) => {
    ctx.response.body = "Pong";
  });
  return router;
};
