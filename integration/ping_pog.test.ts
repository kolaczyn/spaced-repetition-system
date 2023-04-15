import "https://deno.land/std@0.182.0/dotenv/load.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { getApp } from "../src/app.ts";
import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";

const app = await getApp();

Deno.test("ping pong", async () => {
  const request = await superoak(app);
  await request.get("/v1/ping").expect(200).expect("Pong");
});

Deno.test("It should add CORS headers to the response", async () => {
  const request = await superoak(app);
  await request.get("/v1/ping").expect(200).expect((x) => {
    assertEquals(
      x.headers["access-control-allow-origin"],
      "http://localhost:4200",
    );
  });
});
