import "std/dotenv/load.ts";
import { superoak } from "superoak/mod.ts";
import { getApp } from "../src/app.ts";

const app = await getApp();

Deno.test("ping pong", async () => {
  const request = await superoak(app);
  await request.get("/v1/ping").expect(200).expect("Pong");
});
