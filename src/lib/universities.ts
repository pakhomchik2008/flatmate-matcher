export const UK_UNIVERSITIES = [
  "University of Warwick",
  "University of Oxford",
  "University of Cambridge",
  "Imperial College London",
  "University College London",
  "King's College London",
  "London School of Economics",
  "University of Edinburgh",
  "University of Manchester",
  "University of Bristol",
  "University of Birmingham",
  "University of Leeds",
  "University of Nottingham",
  "University of Sheffield",
  "University of Southampton",
  "University of York",
  "University of Glasgow",
  "Durham University",
  "University of St Andrews",
  "University of Exeter",
  "Cardiff University",
  "Newcastle University",
  "Queen Mary University of London",
  "University of Bath",
  "Lancaster University",
  "Loughborough University",
  "University of Liverpool",
  "University of Reading",
  "University of Surrey",
  "University of Sussex",
  "University of East Anglia",
  "Queen's University Belfast",
];

const UNI_DOMAINS = [".ac.uk", ".edu"];
export function looksLikeUniversityEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  return UNI_DOMAINS.some((d) => lower.endsWith(d));
}
