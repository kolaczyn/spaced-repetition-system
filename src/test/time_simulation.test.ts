import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";
import { timeSimulation } from "./time_simulation.ts";
import { ONE_DAY } from "../constants.ts";

Deno.test("start with now at 0", () => {
  const { getNow } = timeSimulation();

  assertEquals(getNow(), 0);
});

Deno.test("passing a day", () => {
  const { getNow, passDay } = timeSimulation();

  passDay();
  assertEquals(getNow(), ONE_DAY);
});

Deno.test("passing a week", () => {
  const { getNow, passDay } = timeSimulation();

  passDay();
  passDay();
  passDay();
  passDay();
  passDay();
  passDay();
  passDay();

  assertEquals(getNow(), 7 * ONE_DAY);
});
