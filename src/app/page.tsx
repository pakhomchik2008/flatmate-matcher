import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/matches");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
          Find a flatmate you'll <span className="text-brand">actually</span> get along with.
        </h1>
        <p className="text-slate-600 text-lg">
          Take a 60-second quiz and we'll match you with compatible students at your university.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/auth/signup" className="btn-primary px-6 py-3">Get started</Link>
          <Link href="/auth/login" className="btn-secondary px-6 py-3">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
