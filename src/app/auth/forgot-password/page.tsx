"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/profile/me`,
    });
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        {sent ? (
          <p className="text-sm text-good">
            If an account with that email exists, we've sent a reset link. Check your inbox (and spam folder).
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-600">Enter your email and we'll send you a link to set a new password.</p>
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-bad">{error}</p>}
              <button disabled={loading} className="btn-primary w-full">{loading ? "Sending…" : "Send reset link"}</button>
            </form>
          </>
        )}
        <p className="text-sm text-slate-600">
          Remembered it? <Link href="/auth/login" className="text-brand font-medium">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
