import type { QuizAnswers } from "./types";

export const WEIGHTS = {
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
} as const;

export const TRAIT_LABELS: Record<keyof typeof WEIGHTS, string> = {
  sleep_schedule: "Sleep schedule",
  cleanliness: "Cleanliness",
  noise_level: "Noise & social",
  smoking: "Smoking",
  guests_frequency: "Guests",
  study_location: "Study spot",
  pets: "Pets",
  cooking_frequency: "Cooking",
  temperature_preference: "Temperature",
  work_schedule: "Active hours",
};

function scoreNumericTrait(a: number, b: number): number {
  return 1 - Math.abs(a - b) / 4;
}

function scoreBooleanTrait(a: boolean, b: boolean): number {
  return a === b ? 1 : 0;
}

export type TraitScores = Record<keyof typeof WEIGHTS, number>;

export function computeTraitScores(a: QuizAnswers, b: QuizAnswers): TraitScores {
  return {
    sleep_schedule: scoreNumericTrait(a.sleep_schedule, b.sleep_schedule),
    cleanliness: scoreNumericTrait(a.cleanliness, b.cleanliness),
    noise_level: scoreNumericTrait(a.noise_level, b.noise_level),
    smoking: scoreBooleanTrait(a.smoking, b.smoking),
    guests_frequency: scoreNumericTrait(a.guests_frequency, b.guests_frequency),
    study_location: scoreNumericTrait(a.study_location, b.study_location),
    pets: scoreBooleanTrait(a.pets, b.pets),
    cooking_frequency: scoreNumericTrait(a.cooking_frequency, b.cooking_frequency),
    temperature_preference: scoreNumericTrait(a.temperature_preference, b.temperature_preference),
    work_schedule: scoreNumericTrait(a.work_schedule, b.work_schedule),
  };
}

export function calculateCompatibility(a: QuizAnswers, b: QuizAnswers): number {
  const scores = computeTraitScores(a, b);
  const weighted = (Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).reduce(
    (sum, k) => sum + scores[k] * WEIGHTS[k],
    0,
  );
  return Math.round(weighted * 100);
}

export function compatibilityColor(score: number): "good" | "warn" | "bad" {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}
