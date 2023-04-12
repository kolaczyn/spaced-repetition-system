import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { getApp } from "../app.ts";

const app = getApp();

Deno.test("ping pong", async () => {
  const request = await superoak(app);
  await request.get("/ping").expect(200).expect("Pong");
});
