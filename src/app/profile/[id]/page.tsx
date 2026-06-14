import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import Avatar from "@/components/Avatar";
import CompatibilityBadge from "@/components/CompatibilityBadge";
import { calculateCompatibility, computeTraitScores, TRAIT_LABELS, WEIGHTS } from "@/lib/matching";

export default async function ProfileViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  if (params.id === user.id) redirect("/profile/me");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, quiz_answers(*)")
    .eq("id", params.id)
    .maybeSingle();
  if (!profile) notFound();

  const { data: myAnswers } = await supabase.from("quiz_answers").select("*").eq("user_id", user.id).maybeSingle();

  const otherAnswers = (profile as any).quiz_answers;
  const score = myAnswers && otherAnswers ? calculateCompatibility(myAnswers, otherAnswers) : null;
  const breakdown = myAnswers && otherAnswers ? computeTraitScores(myAnswers, otherAnswers) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="card p-6 flex flex-col md:flex-row gap-6 items-start">
        <Avatar url={profile.avatar_url} name={profile.name} size={120} />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold">{profile.name}{profile.age ? `, ${profile.age}` : ""}</h1>
          <div className="text-slate-600">{profile.university} · {profile.city}</div>
          {profile.bio && <p className="text-slate-700">{profile.bio}</p>}
          <div className="flex flex-wrap gap-2 text-xs pt-2">
            {profile.move_in_date && (
              <span className="px-2 py-1 rounded-md bg-slate-100">
                Move-in {new Date(profile.move_in_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
            {profile.budget_min != null && profile.budget_max != null && (
              <span className="px-2 py-1 rounded-md bg-slate-100">£{profile.budget_min}–£{profile.budget_max}/mo</span>
            )}
            <span className="px-2 py-1 rounded-md bg-slate-100 capitalize">Looking for: {profile.looking_for}</span>
          </div>
        </div>
        {score != null && <CompatibilityBadge score={score} size="lg" />}
      </div>

      {breakdown && myAnswers && otherAnswers && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Compatibility breakdown</h2>
          <div className="space-y-3">
            {(Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).map((k) => {
              const pct = Math.round(breakdown[k] * 100);
              const yours = (myAnswers as any)[k];
              const theirs = (otherAnswers as any)[k];
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

      <Link href={`/messages?to=${profile.id}`} className="btn-primary w-full md:w-auto">Send message</Link>
    </div>
  );
}
