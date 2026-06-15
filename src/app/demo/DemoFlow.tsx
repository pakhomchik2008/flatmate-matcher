"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StepProgress from "@/components/StepProgress";
import QuizSlider from "@/components/QuizSlider";
import CompatibilityBadge from "@/components/CompatibilityBadge";
import Avatar from "@/components/Avatar";
import { QUESTIONS } from "@/lib/quiz-questions";
import { calculateCompatibility, computeTraitScores, TRAIT_LABELS, WEIGHTS } from "@/lib/matching";
import { DEMO_PEOPLE } from "@/lib/demo-data";
import type { QuizAnswers } from "@/lib/types";

type AnswersForm = Omit<QuizAnswers, "user_id" | "updated_at">;
const DEFAULT_ANSWERS: AnswersForm = {
  sleep_schedule: 3, cleanliness: 3, noise_level: 3, guests_frequency: 3,
  study_location: 3, smoking: false, pets: false, cooking_frequency: 3,
  temperature_preference: 3, work_schedule: 3,
};

type Stage = "intro" | "quiz" | "results";

export default function DemoFlow() {
  const [stage, setStage] = useState<Stage>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersForm>(DEFAULT_ANSWERS);
  const [selected, setSelected] = useState<string | null>(null);

  const q = QUESTIONS[qIndex];

  const ranked = useMemo(() => {
    const me = { ...answers, user_id: "you" } as QuizAnswers;
    return DEMO_PEOPLE
      .map((p) => ({ ...p, score: calculateCompatibility(me, { ...p.answers, user_id: p.id }) }))
      .sort((a, b) => b.score - a.score);
  }, [answers]);

  const selectedPerson = ranked.find((p) => p.id === selected) ?? null;

  if (stage === "intro") {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="card p-8 text-center space-y-4">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-brand/10 text-brand">Demo · no sign-up</span>
          <h1 className="text-2xl md:text-3xl font-bold">Try the matching engine</h1>
          <p className="text-slate-600">
            Answer 10 quick questions about how you live. We'll rank a sample of students at the University of Warwick by how well their habits match yours.
          </p>
          <p className="text-xs text-slate-500">Nothing is saved or sent anywhere. Refresh to reset.</p>
          <button onClick={() => setStage("quiz")} className="btn-primary w-full py-3">Start the quiz</button>
          <Link href="/auth/signup" className="block text-sm text-brand hover:underline">Or create a real account →</Link>
        </div>
      </div>
    );
  }

  if (stage === "quiz" && q) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <StepProgress current={qIndex + 1} total={QUESTIONS.length} />
        <div className="card mt-6 p-6 space-y-6">
          <p className="text-lg font-medium text-slate-900">{q.prompt}</p>
          {q.kind === "scale" ? (
            <QuizSlider
              value={answers[q.key] as number}
              onChange={(v) => setAnswers((a) => ({ ...a, [q.key]: v }))}
              left={q.left}
              right={q.right}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {([[q.no, false], [q.yes, true]] as const).map(([label, val]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: val }))}
                  className={`py-3 rounded-lg border text-sm font-medium ${answers[q.key] === val ? "bg-brand text-white border-brand" : "bg-white border-slate-200"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => qIndex === 0 ? setStage("intro") : setQIndex(qIndex - 1)}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            {qIndex < QUESTIONS.length - 1 ? (
              <button onClick={() => setQIndex(qIndex + 1)} className="btn-primary flex-1">Next</button>
            ) : (
              <button onClick={() => setStage("results")} className="btn-primary flex-1">See matches</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // results
  const me = { ...answers, user_id: "you" } as QuizAnswers;
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Your demo matches</h1>
          <p className="text-slate-600 text-sm">Five sample students from University of Warwick, ranked against your answers.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setStage("quiz"); setQIndex(0); }} className="btn-secondary">Retake quiz</button>
          <Link href="/auth/signup" className="btn-primary">Sign up to message them</Link>
        </div>
      </div>

      {!selectedPerson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ranked.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="card p-4 text-left flex flex-col gap-3 hover:shadow-md hover:border-brand/30 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar url={null} name={p.name} size={56} />
                  <div>
                    <div className="font-semibold text-slate-900">{p.name}, {p.age}</div>
                    <div className="text-xs text-slate-500">{p.university}</div>
                    <div className="text-xs text-slate-500">{p.city}</div>
                  </div>
                </div>
                <CompatibilityBadge score={p.score} />
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{p.bio}</p>
              <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 w-fit">{p.budget}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="text-sm text-slate-500 hover:text-slate-900">← Back to matches</button>
          <div className="card p-6 flex flex-col md:flex-row gap-6 items-start">
            <Avatar url={null} name={selectedPerson.name} size={120} />
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">{selectedPerson.name}, {selectedPerson.age}</h2>
              <div className="text-slate-600">{selectedPerson.university} · {selectedPerson.city}</div>
              <p className="text-slate-700">{selectedPerson.bio}</p>
              <div className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 w-fit">{selectedPerson.budget}</div>
            </div>
            <CompatibilityBadge score={selectedPerson.score} size="lg" />
          </div>
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold">Compatibility breakdown</h3>
            {(Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).map((k) => {
              const scores = computeTraitScores(me, { ...selectedPerson.answers, user_id: selectedPerson.id } as QuizAnswers);
              const pct = Math.round(scores[k] * 100);
              const yours = (me as any)[k];
              const theirs = (selectedPerson.answers as any)[k];
              return (
                <div key={k}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{TRAIT_LABELS[k]}</span>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    You: {typeof yours === "boolean" ? (yours ? "Yes" : "No") : yours} · Them: {typeof theirs === "boolean" ? (theirs ? "Yes" : "No") : theirs}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
