"use client";

import { useMemo, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { calculateCompatibility } from "@/lib/matching";
import type { Profile, QuizAnswers, LookingFor } from "@/lib/types";

type Other = { profile: Profile; answers: QuizAnswers };

interface Props {
  me: Profile;
  myAnswers: QuizAnswers;
  others: Other[];
}

export default function MatchesClient({ me, myAnswers, others }: Props) {
  const [university, setUniversity] = useState(me.university);
  const [city, setCity] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [moveBy, setMoveBy] = useState("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "any">("any");

  const scored = useMemo(() => {
    return others
      .map((o) => {
        const score = calculateCompatibility(myAnswers, o.answers);
        const myMax = me.budget_max ?? Infinity;
        const otherMin = o.profile.budget_min ?? 0;
        const budgetMisalign = myMax < otherMin;
        return { ...o, score, budgetMisalign };
      })
      .filter((o) => {
        if (university && !o.profile.university.toLowerCase().includes(university.toLowerCase())) return false;
        if (city && !o.profile.city.toLowerCase().includes(city.toLowerCase())) return false;
        if (lookingFor !== "any" && o.profile.looking_for !== "both" && o.profile.looking_for !== lookingFor) return false;
        if (moveBy && o.profile.move_in_date && o.profile.move_in_date > moveBy) return false;
        const min = budgetMin ? parseInt(budgetMin, 10) : null;
        const max = budgetMax ? parseInt(budgetMax, 10) : null;
        if (max != null && o.profile.budget_min != null && o.profile.budget_min > max) return false;
        if (min != null && o.profile.budget_max != null && o.profile.budget_max < min) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }, [others, myAnswers, university, city, budgetMin, budgetMax, moveBy, lookingFor, me.budget_max]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your matches</h1>
        <p className="text-slate-600 text-sm">Sorted by compatibility with your answers.</p>
      </div>

      <div className="card p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="col-span-2 md:col-span-1">
          <label className="label">University</label>
          <input className="input" value={university} onChange={(e) => setUniversity(e.target.value)} />
        </div>
        <div>
          <label className="label">City</label>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <label className="label">Min £</label>
          <input className="input" type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
        </div>
        <div>
          <label className="label">Max £</label>
          <input className="input" type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
        </div>
        <div>
          <label className="label">Move-in by</label>
          <input className="input" type="date" value={moveBy} onChange={(e) => setMoveBy(e.target.value)} />
        </div>
        <div>
          <label className="label">Looking for</label>
          <select className="input" value={lookingFor} onChange={(e) => setLookingFor(e.target.value as any)}>
            <option value="any">Any</option>
            <option value="room">Room</option>
            <option value="flatmate">Flatmate</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      {scored.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No profiles match your filters. Try widening them.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scored.map((m) => (
            <ProfileCard key={m.profile.id} profile={m.profile} score={m.score} budgetMisalign={m.budgetMisalign} />
          ))}
        </div>
      )}
    </div>
  );
}
