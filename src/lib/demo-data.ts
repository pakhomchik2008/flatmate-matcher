import type { QuizAnswers } from "./types";

export interface DemoPerson {
  id: string;
  name: string;
  age: number;
  university: string;
  city: string;
  bio: string;
  budget: string;
  answers: Omit<QuizAnswers, "user_id" | "updated_at">;
}

export const DEMO_PEOPLE: DemoPerson[] = [
  {
    id: "demo-1",
    name: "Priya Patel",
    age: 21,
    university: "University of Warwick",
    city: "Coventry",
    bio: "Engineering student. Climbs three times a week. Cooks most nights and loves a shared dinner.",
    budget: "£500–£700",
    answers: { sleep_schedule: 3, cleanliness: 4, noise_level: 3, guests_frequency: 2, study_location: 2, smoking: false, pets: false, cooking_frequency: 5, temperature_preference: 3, work_schedule: 3 },
  },
  {
    id: "demo-2",
    name: "Oliver Chen",
    age: 24,
    university: "University of Warwick",
    city: "Coventry",
    bio: "Maths PhD. Honestly just want quiet evenings, board games on Sundays, and decent wifi.",
    budget: "£550–£800",
    answers: { sleep_schedule: 2, cleanliness: 4, noise_level: 2, guests_frequency: 1, study_location: 1, smoking: false, pets: false, cooking_frequency: 3, temperature_preference: 3, work_schedule: 2 },
  },
  {
    id: "demo-3",
    name: "Aisha Khan",
    age: 20,
    university: "University of Warwick",
    city: "Coventry",
    bio: "Pre-med. Gym at 6am, in bed by 11. Tidy without being intense about it.",
    budget: "£600–£850",
    answers: { sleep_schedule: 1, cleanliness: 5, noise_level: 2, guests_frequency: 1, study_location: 3, smoking: false, pets: false, cooking_frequency: 4, temperature_preference: 4, work_schedule: 1 },
  },
  {
    id: "demo-4",
    name: "Mateo Garcia",
    age: 22,
    university: "University of Warwick",
    city: "Coventry",
    bio: "Architecture student — sometimes home, sometimes studio. Love a kitchen disco and a clean fridge.",
    budget: "£500–£750",
    answers: { sleep_schedule: 4, cleanliness: 3, noise_level: 4, guests_frequency: 3, study_location: 4, smoking: false, pets: true, cooking_frequency: 3, temperature_preference: 4, work_schedule: 5 },
  },
  {
    id: "demo-5",
    name: "Hannah O'Brien",
    age: 19,
    university: "University of Warwick",
    city: "Coventry",
    bio: "Politics, first year. Big on pub quizzes. Will absolutely respect the chore rota.",
    budget: "£400–£600",
    answers: { sleep_schedule: 4, cleanliness: 4, noise_level: 4, guests_frequency: 4, study_location: 4, smoking: false, pets: false, cooking_frequency: 2, temperature_preference: 3, work_schedule: 4 },
  },
];
