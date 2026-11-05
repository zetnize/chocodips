import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const sample = {
  name: "Тест формы",
  phone: "+7 (999) 000-00-00",
  date: "",
  time: "",
  guests: "",
  website: "",
  consent: true,
};
let sequence = 0;
async function post(value, options = {}) {
  return fetch(`${base}/api/lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: new URL(base).origin,
      "X-Forwarded-For": `qa-${Date.now()}-${sequence++}`,
      ...options.headers,
    },
    body: typeof value === "string" ? value : JSON.stringify(value),
  });
}

// Run against a local demo instance only: a production Telegram channel must not receive fixtures.
const response = await post(sample);
assert.equal(response.status, 200);
assert.deepEqual(
  await response.json(),
  { ok: true, demo: true },
  "These checks require demo mode without Telegram credentials.",
);

const invalid = [
  ["name", { ...sample, name: "А" }],
  ["name", { ...sample, name: "А".repeat(61) }],
  ["phone", { ...sample, phone: "123" }],
  ["consent", { ...sample, consent: false }],
  ["website", { ...sample, website: "https://bot.invalid" }],
  ["date", { ...sample, date: "2026-02-30" }],
  ["time", { ...sample, time: "23:30" }],
  ["guests", { ...sample, guests: "13" }],
];
for (const [field, value] of invalid) {
  const result = await post(value);
  assert.equal(result.status, 400, field);
  assert.ok((await result.json()).errors[field], field);
}
assert.equal((await post("{broken")).status, 400);
assert.equal((await post({ ...sample, name: "A".repeat(5000) })).status, 400);
assert.equal(
  (await post(sample, { headers: { Origin: "https://other.invalid" } })).status,
  400,
);
const rateIp = `qa-rate-${Date.now()}`;
for (let index = 0; index < 5; index++)
  assert.equal(
    (
      await post(
        { ...sample, consent: false },
        { headers: { "X-Forwarded-For": rateIp } },
      )
    ).status,
    400,
  );
assert.equal(
  (await post(sample, { headers: { "X-Forwarded-For": rateIp } })).status,
  429,
);
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
  "PASS: demo lead, 8 field validation cases, malformed/oversized bodies, origin, rate limit, public routes and 404.\n",
);
