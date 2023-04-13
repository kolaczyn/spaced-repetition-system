import { getApp } from "./app.ts";

const port = 8000;
const app = await getApp();
app.addEventListener(
  "listen",
  () => console.log(`Server listening on http://localhost:${port}`),
);
await app.listen({ port });
