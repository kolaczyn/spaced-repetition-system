import { assertEquals } from "std/testing/asserts.ts";
import { getNextFib } from "./fib.ts";

Deno.test("getNextFib", () => {
  const tests: [number, number][] = [
    [1, 2],
    [2, 3],
    [3, 5],
    [5, 8],
    [8, 13],
    [13, 21],
    [21, 34],
    [34, 55],
    [987, 1597],
  ];

  tests.forEach(([input, expected]) => {
    assertEquals(getNextFib(input), expected);
  });
});
