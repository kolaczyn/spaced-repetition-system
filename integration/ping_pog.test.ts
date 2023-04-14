import "https://deno.land/std@0.182.0/dotenv/load.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { getApp } from "../src/app.ts";

const app = await getApp();

Deno.test("ping pong", async () => {
  const request = await superoak(app);
  await request.get("/v1/ping").expect(200).expect("Pong");
});
