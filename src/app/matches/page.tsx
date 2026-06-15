import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import MatchesClient from "./MatchesClient";

export const metadata: Metadata = { title: "Your matches" };

export default async function MatchesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!me || !me.quiz_completed) redirect("/onboarding");

  const { data: myAnswers } = await supabase.from("quiz_answers").select("*").eq("user_id", user.id).maybeSingle();
  if (!myAnswers) redirect("/onboarding");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*, quiz_answers(*)")
    .eq("quiz_completed", true)
    .neq("id", user.id);

  if (!profiles || profiles.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-3">
        <h2 className="text-xl font-semibold">No matches yet</h2>
        <p className="text-slate-600">
          You're one of the first students from {me.university} — share the link to get matches!
        </p>
        <Link href="/" className="btn-secondary inline-flex">Back home</Link>
      </div>
    );
  }

  const others = profiles
    .filter((p: any) => p.quiz_answers)
    .map((p: any) => ({ profile: p, answers: p.quiz_answers as any }));

  return <MatchesClient me={me} myAnswers={myAnswers} others={others} />;
}
