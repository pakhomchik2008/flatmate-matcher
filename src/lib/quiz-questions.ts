import type { QuizAnswers } from "./types";

type NumericKey = Exclude<keyof QuizAnswers, "user_id" | "updated_at" | "smoking" | "pets">;
type BooleanKey = "smoking" | "pets";

export interface NumericQuestion {
  kind: "scale";
  key: NumericKey;
  prompt: string;
  left: string;
  right: string;
}
export interface BooleanQuestion {
  kind: "boolean";
  key: BooleanKey;
  prompt: string;
  yes: string;
  no: string;
}

export type Question = NumericQuestion | BooleanQuestion;

export const QUESTIONS: Question[] = [
  { kind: "scale", key: "sleep_schedule", prompt: "When do you go to sleep?", left: "9pm (very early)", right: "3am+ (very late)" },
  { kind: "scale", key: "cleanliness", prompt: "How clean do you keep shared spaces?", left: "Very relaxed", right: "Spotless always" },
  { kind: "scale", key: "noise_level", prompt: "How noisy/social is your home life?", left: "Very quiet", right: "Very social" },
  { kind: "scale", key: "guests_frequency", prompt: "How often do you have guests over?", left: "Never", right: "Almost every day" },
  { kind: "scale", key: "study_location", prompt: "Where do you prefer to study?", left: "Always at home", right: "Always at library" },
  { kind: "boolean", key: "smoking", prompt: "Do you smoke or vape?", yes: "Yes", no: "No" },
  { kind: "boolean", key: "pets", prompt: "Do you have or want pets?", yes: "Yes", no: "No" },
  { kind: "scale", key: "cooking_frequency", prompt: "How often do you cook at home?", left: "Never (takeaway)", right: "Cook every meal" },
  { kind: "scale", key: "temperature_preference", prompt: "Temperature preference", left: "Like it cold", right: "Like it warm" },
  { kind: "scale", key: "work_schedule", prompt: "When are you most active at home?", left: "Early mornings", right: "Late nights" },
];
