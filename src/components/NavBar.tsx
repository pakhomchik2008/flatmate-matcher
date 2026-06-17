"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const LINKS = [
  { href: "/matches", label: "Matches" },
  { href: "/messages", label: "Messages" },
  { href: "/profile/me", label: "My Profile" },
];

const STARS = [1, 2, 3, 4, 5];

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating]     = useState(0);
  const [hover, setHover]       = useState(0);
  const [text, setText]         = useState("");
  const [saving, setSaving]     = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function submit() {
    if (!rating) { setError("Please select a star rating."); return; }
    setSaving(true); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); setError("Not signed in."); return; }

    const { error: err } = await supabase.from("user_feedback").upsert(
      { user_id: user.id, rating, feedback: text.trim() || null },
      { onConflict: "user_id" },
    );
    setSaving(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(onClose, 1800);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-slide-up">

        {done ? (
          <div className="text-center py-4 space-y-2">
            <div className="text-4xl">🎉</div>
            <p className="font-semibold text-slate-900 text-lg">Thanks for your feedback!</p>
            <p className="text-sm text-slate-500">It helps us improve Flatmate Matcher.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Evaluate the programme</h2>
                <p className="text-sm text-slate-500 mt-0.5">Give feedback · takes 30 seconds</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition p-1 -mr-1 -mt-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Stars */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Overall rating</p>
              <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
                {STARS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={rating === s}
                    aria-label={`${s} star${s !== 1 ? "s" : ""}`}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                  >
                    <svg
                      className={`w-9 h-9 transition-colors duration-100 ${s <= (hover || rating) ? "text-yellow-400" : "text-slate-200"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="self-center ml-2 text-sm text-slate-500">
                    {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Text */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="fb-text">
                Short explanation <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="fb-text"
                rows={3}
                className="input resize-none text-sm"
                placeholder="What did you like or what could be better?"
                maxLength={300}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="text-xs text-slate-400 text-right">{text.length}/300</div>
            </div>

            {error && <p className="text-xs text-bad">{error}</p>}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button onClick={submit} disabled={saving} className="btn-primary flex-1">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Saving…
                  </span>
                ) : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function NavBar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 px-6 h-14 items-center justify-between">
        <Link href="/matches" className="font-bold text-lg text-brand">flatmate<span className="text-slate-900">.</span></Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3 py-1.5 rounded-md text-sm font-medium ${active ? "bg-brand/10 text-brand" : "text-slate-700 hover:bg-slate-100"}`}
              >
                {l.label}
                {l.href === "/messages" && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-bad" />
                )}
              </Link>
            );
          })}

          {/* Feedback button */}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Give feedback
          </button>

          <button onClick={signOut} className="ml-2 text-sm text-slate-500 hover:text-slate-900">Sign out</button>
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex justify-around py-2">
        {LINKS.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`relative flex flex-col items-center text-xs px-3 py-1 ${active ? "text-brand" : "text-slate-600"}`}
            >
              {l.label}
              {l.href === "/messages" && unreadCount > 0 && (
                <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-bad" />
              )}
            </Link>
          );
        })}
        {/* Feedback tab on mobile */}
        <button
          onClick={() => setFeedbackOpen(true)}
          className="relative flex flex-col items-center text-xs px-3 py-1 text-slate-600"
        >
          <svg className="w-4 h-4 text-yellow-400 mb-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Rate
        </button>
      </nav>

      {/* Modal */}
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </>
  );
}
