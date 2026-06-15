"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { looksLikeUniversityEmail } from "@/lib/universities";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Create account — Flatmate Matcher"; }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setInfo("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-slate-600">Use your university email (.ac.uk or .edu) for verification.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              autoComplete="email"
              required
              type="email"
              className="input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setWarning(e.target.value && !looksLikeUniversityEmail(e.target.value)
                  ? "This doesn't look like a university email. You can still sign up, but verification helps build trust."
                  : null);
              }}
            />
            {warning && <p className="text-xs text-warn mt-1">{warning}</p>}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              autoComplete="new-password"
              required
              type="password"
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-bad">{error}</p>}
          {info && <p className="text-sm text-good">{info}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading ? "Creating…" : "Create account"}</button>
        </form>
        <p className="text-sm text-slate-600">
          Already have an account? <Link href="/auth/login" className="text-brand font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
