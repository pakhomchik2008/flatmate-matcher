"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import StepProgress from "@/components/StepProgress";
import QuizSlider from "@/components/QuizSlider";
import { UK_UNIVERSITIES } from "@/lib/universities";
import { QUESTIONS } from "@/lib/quiz-questions";
import type { LookingFor, QuizAnswers } from "@/lib/types";

type ProfileForm = {
  name: string;
  age: string;
  university: string;
  city: string;
  bio: string;
  avatarFile: File | null;
  googleAvatarUrl: string | null;
  looking_for: LookingFor;
  move_in_date: string;
  budget_min: string;
  budget_max: string;
};

const EMPTY: ProfileForm = {
  name: "", age: "", university: "", city: "", bio: "", avatarFile: null,
  googleAvatarUrl: null,
  looking_for: "both", move_in_date: "", budget_min: "", budget_max: "",
};

type AnswersForm = Omit<QuizAnswers, "user_id" | "updated_at">;
const DEFAULT_ANSWERS: AnswersForm = {
  sleep_schedule: 3, cleanliness: 3, noise_level: 3, guests_frequency: 3,
  study_location: 3, smoking: false, pets: false, cooking_frequency: 3,
  temperature_preference: 3, work_schedule: 3,
};

/* ── Skeleton loader ─────────────────────────────────────────── */
function OnboardingSkeleton() {
  return (
    <div className="max-w-xl mx-auto px-6 py-10 animate-fade-in">
      {/* progress bar skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-2 flex-1 skeleton" />
        ))}
      </div>
      <div className="card p-6 space-y-5">
        <div className="skeleton h-6 w-28" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-10 w-full" />
          </div>
        ))}
        <div className="skeleton h-10 w-full mt-2 rounded-lg" />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId]     = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [step, setStep]         = useState(1);
  const [quizIndex, setQuizIndex] = useState(0);
  const [form, setForm]         = useState<ProfileForm>(EMPTY);
  const [answers, setAnswers]   = useState<AnswersForm>(DEFAULT_ANSWERS);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => { document.title = "Onboarding — Flatmate Matcher"; }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);

      /* Google / OAuth metadata — pre-fill name + avatar */
      const meta = user.user_metadata ?? {};
      const socialName: string = meta.full_name ?? meta.name ?? "";
      const socialAvatar: string | null = meta.avatar_url ?? meta.picture ?? null;

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (profile) {
        setForm((f) => ({
          ...f,
          name:         profile.name ?? socialName,
          age:          profile.age?.toString() ?? "",
          university:   profile.university ?? "",
          city:         profile.city ?? "",
          bio:          profile.bio ?? "",
          looking_for:  (profile.looking_for as LookingFor) ?? "both",
          move_in_date: profile.move_in_date ?? "",
          budget_min:   profile.budget_min?.toString() ?? "",
          budget_max:   profile.budget_max?.toString() ?? "",
          googleAvatarUrl: profile.avatar_url ?? socialAvatar,
        }));
      } else {
        /* Brand-new Google user — seed what we know */
        setForm((f) => ({
          ...f,
          name: socialName,
          googleAvatarUrl: socialAvatar,
        }));
      }

      setLoading(false);
    })();
  }, [router, supabase]);

  function update<K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function saveScreen1() {
    if (!userId) return;
    if (!form.name.trim() || !form.university.trim() || !form.city.trim()) {
      setError("Name, university, and city are required."); return;
    }
    setSaving(true); setError(null);

    let avatar_url: string | null = form.googleAvatarUrl ?? null;

    /* User picked a file → upload it, overriding the Google avatar */
    if (form.avatarFile) {
      const ext = form.avatarFile.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, form.avatarFile, { upsert: true });
      if (upErr) { setSaving(false); setError(upErr.message); return; }
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      avatar_url = pub.publicUrl;
    }

    const { error: upErr } = await supabase.from("profiles").upsert({
      id:         userId,
      name:       form.name.trim(),
      age:        form.age ? parseInt(form.age, 10) : null,
      university: form.university.trim(),
      city:       form.city.trim(),
      bio:        form.bio.trim() || null,
      ...(avatar_url ? { avatar_url } : {}),
      looking_for: form.looking_for,
    });
    setSaving(false);
    if (upErr) return setError(upErr.message);
    setStep(2);
  }

  async function saveScreen2() {
    if (!userId) return;
    setSaving(true); setError(null);
    const { error } = await supabase.from("profiles").update({
      looking_for:  form.looking_for,
      move_in_date: form.move_in_date || null,
      budget_min:   form.budget_min ? parseInt(form.budget_min, 10) : null,
      budget_max:   form.budget_max ? parseInt(form.budget_max, 10) : null,
    }).eq("id", userId);
    setSaving(false);
    if (error) return setError(error.message);
    setStep(3);
  }

  async function finishQuiz() {
    if (!userId) return;
    setSaving(true); setError(null);
    const { error: aErr } = await supabase.from("quiz_answers").upsert({ user_id: userId, ...answers }, { onConflict: "user_id" });
    if (aErr) { setSaving(false); setError(aErr.message); return; }
    const { error: pErr } = await supabase.from("profiles").update({ quiz_completed: true }).eq("id", userId);
    setSaving(false);
    if (pErr) return setError(pErr.message);
    router.push("/matches");
    router.refresh();
  }

  const currentQ = QUESTIONS[quizIndex];

  /* ── Show skeleton while fetching ───────────────────────────── */
  if (loading) return <OnboardingSkeleton />;

  return (
    <div className="max-w-xl mx-auto px-6 py-10 animate-fade-in">
      <StepProgress current={step} total={3} />
      <div className="card mt-6 p-6 space-y-5">
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold">About you</h2>

            {/* Google avatar preview */}
            {form.googleAvatarUrl && !form.avatarFile && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.googleAvatarUrl} alt="Google profile picture" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Using your Google photo</p>
                  <p className="text-xs text-slate-500">Upload a photo below to replace it</p>
                </div>
              </div>
            )}

            <div>
              <label className="label">Full name *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your display name"
              />
              {form.name && (
                <p className="text-xs text-slate-400 mt-1">
                  This is what other students will see on your profile.
                </p>
              )}
            </div>
            <div>
              <label className="label">Age</label>
              <input className="input" type="number" min={16} max={100} value={form.age} onChange={(e) => update("age", e.target.value)} />
            </div>
            <div>
              <label className="label">University *</label>
              <input className="input" list="uni-list" value={form.university} onChange={(e) => update("university", e.target.value)} />
              <datalist id="uni-list">{UK_UNIVERSITIES.map((u) => <option key={u} value={u} />)}</datalist>
            </div>
            <div>
              <label className="label">City *</label>
              <input className="input" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div>
              <label className="label">Short bio</label>
              <textarea
                maxLength={200}
                rows={3}
                placeholder="Tell future flatmates about yourself"
                className="input resize-none"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
              <div className="text-xs text-slate-400 text-right">{form.bio.length}/200</div>
            </div>
            <div>
              <label className="label">Profile photo {form.googleAvatarUrl ? "(optional — you already have one)" : ""}</label>
              <input type="file" accept="image/*" onChange={(e) => update("avatarFile", e.target.files?.[0] ?? null)} className="text-sm" />
            </div>
            {error && <p className="text-sm text-bad">{error}</p>}
            <button onClick={saveScreen1} disabled={saving} className="btn-primary w-full">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Saving…
                </span>
              ) : "Continue"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold">Your flatmate situation</h2>
            <div>
              <label className="label">Looking for</label>
              <div className="grid grid-cols-3 gap-2">
                {(["room", "flatmate", "both"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update("looking_for", opt)}
                    className={`py-2 rounded-lg border text-sm capitalize ${form.looking_for === opt ? "bg-brand text-white border-brand" : "bg-white border-slate-200"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Move-in date</label>
              <input type="date" className="input" value={form.move_in_date} onChange={(e) => update("move_in_date", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Budget min (£/mo)</label>
                <input type="number" min={0} className="input" value={form.budget_min} onChange={(e) => update("budget_min", e.target.value)} />
              </div>
              <div>
                <label className="label">Budget max (£/mo)</label>
                <input type="number" min={0} className="input" value={form.budget_max} onChange={(e) => update("budget_max", e.target.value)} />
              </div>
            </div>
            {error && <p className="text-sm text-bad">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button onClick={saveScreen2} disabled={saving} className="btn-primary flex-1">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Saving…
                  </span>
                ) : "Continue"}
              </button>
            </div>
          </>
        )}

        {step === 3 && currentQ && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Compatibility quiz</h2>
              <span className="text-xs text-slate-500">{quizIndex + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${((quizIndex + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <div className="py-2">
              <p className="text-lg font-medium text-slate-900 mb-6">{currentQ.prompt}</p>
              {currentQ.kind === "scale" ? (
                <QuizSlider
                  value={answers[currentQ.key] as number}
                  onChange={(v) => setAnswers((a) => ({ ...a, [currentQ.key]: v }))}
                  left={currentQ.left}
                  right={currentQ.right}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {([
                    [currentQ.no, false],
                    [currentQ.yes, true],
                  ] as const).map(([label, val]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [currentQ.key]: val }))}
                      className={`py-3 rounded-lg border text-sm font-medium transition-colors ${answers[currentQ.key] === val ? "bg-brand text-white border-brand" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-sm text-bad">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => quizIndex === 0 ? setStep(2) : setQuizIndex(quizIndex - 1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              {quizIndex < QUESTIONS.length - 1 ? (
                <button onClick={() => setQuizIndex(quizIndex + 1)} className="btn-primary flex-1">Next</button>
              ) : (
                <button onClick={finishQuiz} disabled={saving} className="btn-primary flex-1">
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Saving…
                    </span>
                  ) : "Finish"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
