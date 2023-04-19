import "std/dotenv/load.ts";
import { superoak } from "superoak/mod.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { getApp } from "../src/app.ts";

const app = await getApp();

Deno.test("It should add CORS headers to the response", async () => {
  const request = await superoak(app);
  await request.get("/v1/ping").expect(200).expect((x) => {
    assertEquals(
      x.headers["access-control-allow-origin"],
      "*",
    );
  });
});
