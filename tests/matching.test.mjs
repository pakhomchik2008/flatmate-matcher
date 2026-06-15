// Unit tests for the compatibility scoring engine.
// Run with: npm test  (uses Node's built-in test runner — no extra deps).

import { test } from "node:test";
import assert from "node:assert/strict";

// Inline copy of the production WEIGHTS + scoring functions so tests stay self-contained
// and don't pull TypeScript into the runner. Keep these in sync with src/lib/matching.ts.
const WEIGHTS = {
  sleep_schedule: 0.2,
  cleanliness: 0.2,
  noise_level: 0.15,
  smoking: 0.1,
  guests_frequency: 0.1,
  study_location: 0.08,
  pets: 0.07,
  cooking_frequency: 0.05,
  temperature_preference: 0.03,
  work_schedule: 0.02,
};

const scoreNumeric = (a, b) => 1 - Math.abs(a - b) / 4;
const scoreBoolean = (a, b) => (a === b ? 1 : 0);

function calculate(a, b) {
  const s = {
    sleep_schedule: scoreNumeric(a.sleep_schedule, b.sleep_schedule),
    cleanliness: scoreNumeric(a.cleanliness, b.cleanliness),
    noise_level: scoreNumeric(a.noise_level, b.noise_level),
    smoking: scoreBoolean(a.smoking, b.smoking),
    guests_frequency: scoreNumeric(a.guests_frequency, b.guests_frequency),
    study_location: scoreNumeric(a.study_location, b.study_location),
    pets: scoreBoolean(a.pets, b.pets),
    cooking_frequency: scoreNumeric(a.cooking_frequency, b.cooking_frequency),
    temperature_preference: scoreNumeric(a.temperature_preference, b.temperature_preference),
    work_schedule: scoreNumeric(a.work_schedule, b.work_schedule),
  };
  const w = Object.keys(WEIGHTS).reduce((sum, k) => sum + s[k] * WEIGHTS[k], 0);
  return Math.round(w * 100);
}

const identical = {
  sleep_schedule: 3, cleanliness: 4, noise_level: 2, smoking: false, guests_frequency: 2,
  study_location: 3, pets: false, cooking_frequency: 4, temperature_preference: 3, work_schedule: 3,
};

const opposite = {
  sleep_schedule: 5 + 1 - identical.sleep_schedule, // mirrored across the 1..5 range
  cleanliness: 5 + 1 - identical.cleanliness,
  noise_level: 5 + 1 - identical.noise_level,
  smoking: !identical.smoking,
  guests_frequency: 5 + 1 - identical.guests_frequency,
  study_location: 5 + 1 - identical.study_location,
  pets: !identical.pets,
  cooking_frequency: 5 + 1 - identical.cooking_frequency,
  temperature_preference: 5 + 1 - identical.temperature_preference,
  work_schedule: 5 + 1 - identical.work_schedule,
};

test("identical answers produce a perfect 100 score", () => {
  assert.equal(calculate(identical, identical), 100);
});

test("maximally opposite answers produce 0", () => {
  // All numeric traits differ by 4; both booleans mismatch. Each trait scores 0; weighted total = 0.
  const a = { sleep_schedule: 1, cleanliness: 1, noise_level: 1, smoking: false, guests_frequency: 1, study_location: 1, pets: false, cooking_frequency: 1, temperature_preference: 1, work_schedule: 1 };
  const b = { sleep_schedule: 5, cleanliness: 5, noise_level: 5, smoking: true, guests_frequency: 5, study_location: 5, pets: true, cooking_frequency: 5, temperature_preference: 5, work_schedule: 5 };
  assert.equal(calculate(a, b), 0);
});

test("symmetry: score(a,b) === score(b,a)", () => {
  const a = { sleep_schedule: 2, cleanliness: 5, noise_level: 3, smoking: true, guests_frequency: 4, study_location: 1, pets: false, cooking_frequency: 2, temperature_preference: 4, work_schedule: 5 };
  const b = { sleep_schedule: 4, cleanliness: 3, noise_level: 5, smoking: false, guests_frequency: 1, study_location: 2, pets: true, cooking_frequency: 5, temperature_preference: 1, work_schedule: 3 };
  assert.equal(calculate(a, b), calculate(b, a));
});

test("score stays in the 0..100 range for arbitrary valid inputs", () => {
  for (let i = 0; i < 100; i++) {
    const rand = () => ({
      sleep_schedule: 1 + Math.floor(Math.random() * 5),
      cleanliness: 1 + Math.floor(Math.random() * 5),
      noise_level: 1 + Math.floor(Math.random() * 5),
      smoking: Math.random() < 0.5,
      guests_frequency: 1 + Math.floor(Math.random() * 5),
      study_location: 1 + Math.floor(Math.random() * 5),
      pets: Math.random() < 0.5,
      cooking_frequency: 1 + Math.floor(Math.random() * 5),
      temperature_preference: 1 + Math.floor(Math.random() * 5),
      work_schedule: 1 + Math.floor(Math.random() * 5),
    });
    const s = calculate(rand(), rand());
    assert.ok(s >= 0 && s <= 100, `score ${s} out of range`);
  }
});

test("highest-weight trait dominates the score", () => {
  // Sleep schedule alone is 20% of the total weight. With a's sleep at 1 and b's at 5
  // (maximum disagreement), scoreNumeric = 0 and that trait contributes 0; all other traits
  // match, so the weighted total drops exactly by sleep's weight: 1.0 - 0.2 = 0.8 → 80.
  const a = { ...identical, sleep_schedule: 1 };
  const b = { ...identical, sleep_schedule: 5 };
  assert.equal(calculate(a, b), 80);
});

test("partial overlap produces a middling score", () => {
  const a = { ...identical };
  const b = { ...identical, sleep_schedule: 5, cleanliness: 1, noise_level: 5 }; // three biggest dimensions off
  const score = calculate(a, b);
  assert.ok(score > 30 && score < 80, `expected middling score, got ${score}`);
});
