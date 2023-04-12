import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

export const patchCardValidation = z.object({
  id: z.coerce.number(),
  answer: z.string(),
});
