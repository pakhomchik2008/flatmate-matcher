export type LookingFor = "room" | "flatmate" | "both";

export interface University {
  id: string;
  name: string;
  abbreviation: string | null;
  city: string;
  country: string;
  qs_rank: number | null;
}

/** Returns nickname if set, otherwise the first word of name. */
export function displayName(profile: { name: string; nickname?: string | null }): string {
  return profile.nickname?.trim() || profile.name;
}

export interface Profile {
  id: string;
  name: string;
  nickname: string | null;
  age: number | null;
  university: string;
  university_id: string | null;
  city: string;
  bio: string | null;
  avatar_url: string | null;
  move_in_date: string | null;
  budget_min: number | null;
  budget_max: number | null;
  looking_for: LookingFor;
  quiz_completed: boolean;
  created_at: string;
}

export interface QuizAnswers {
  user_id: string;
  sleep_schedule: number;
  cleanliness: number;
  noise_level: number;
  guests_frequency: number;
  study_location: number;
  smoking: boolean;
  pets: boolean;
  cooking_frequency: number;
  temperature_preference: number;
  work_schedule: number;
  updated_at?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface ProfileWithAnswers extends Profile {
  quiz_answers: QuizAnswers | null;
}
