import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
assert.equal((await fetch(`${base}/api/lead`, { method: "POST" })).status, 404);

for (const path of [
  "/",
  "/menu",
  "/privacy",
  "/robots.txt",
  "/sitemap.xml",
  "/icon.svg",
  "/opengraph-image",
])
  assert.equal((await fetch(`${base}${path}`)).status, 200, path);
assert.equal((await fetch(`${base}/nonexistent-page`)).status, 404);
process.stdout.write(
  "PASS: booking endpoint removed, public routes and 404.\n",
);
