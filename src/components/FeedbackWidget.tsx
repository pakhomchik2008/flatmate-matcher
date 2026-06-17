"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Props { userId: string; }

const CACHE_KEY = (id: string) => `fm_fb_done_${id}`;

export default function FeedbackWidget({ userId }: Props) {
  const [visible, setVisible]     = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [rating, setRating]       = useState(0);
  const [hover, setHover]         = useState(0);
  const [text, setText]           = useState("");
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [toast, setToast]         = useState(false);
  const [toastOut, setToastOut]   = useState(false);

  /* ── Check if already submitted ─────────────────────────────── */
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(CACHE_KEY(userId))) return;

    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_feedback")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        // Already submitted — cache it and stay hidden
        localStorage.setItem(CACHE_KEY(userId), "1");
      } else {
        // Show widget after a short delay so it doesn't compete with page load
        setTimeout(() => setVisible(true), 1800);
      }
    })();
  }, [userId]);

  /* ── Save feedback ───────────────────────────────────────────── */
  async function handleSave() {
    if (!rating) { setError("Please select a star rating."); return; }
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const { error: err } = await supabase.from("user_feedback").insert({
      user_id:  userId,
      rating,
      feedback: text.trim() || null,
    });

    setSaving(false);
    if (err) { setError(err.message); return; }

    // Persist so we never show again
    localStorage.setItem(CACHE_KEY(userId), "1");

    // Show toast, then hide
    setToast(true);
    setTimeout(() => {
      setToastOut(true);
      setTimeout(() => setVisible(false), 350);
    }, 2200);
  }

  if (!visible) return null;

  /* ── Minimised tab ───────────────────────────────────────────── */
  if (minimised) {
    return (
      <button
        onClick={() => setMinimised(false)}
        className="fixed bottom-[4.5rem] left-4 md:bottom-4 z-40 flex items-center gap-1.5 bg-brand text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg hover:bg-brand-dark transition animate-slide-up"
        aria-label="Open feedback"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        Feedback
      </button>
    );
  }

  /* ── Full widget ─────────────────────────────────────────────── */
  return (
    <div
      className="fixed bottom-[4.5rem] left-4 md:bottom-4 z-40 w-72 card shadow-xl animate-slide-up"
      role="dialog"
      aria-label="Share your feedback"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm font-semibold text-slate-900">Share your feedback</span>
        </div>
        <button
          onClick={() => setMinimised(true)}
          className="text-slate-400 hover:text-slate-600 transition"
          aria-label="Minimise"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Stars */}
        <div>
          <p className="text-xs text-slate-500 mb-1.5">How are we doing?</p>
          <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((s) => (
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
                  className={`w-7 h-7 transition-colors ${s <= (hover || rating) ? "text-yellow-400" : "text-slate-200"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <textarea
          rows={3}
          className="input resize-none text-sm"
          placeholder="Tell us about your experience..."
          maxLength={400}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Error */}
        {error && <p className="text-xs text-bad">{error}</p>}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full text-sm py-2"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Saving…
            </span>
          ) : "Save Feedback"}
        </button>
      </div>

      {/* Success toast */}
      {toast && (
        <div
          className={`absolute -top-12 left-0 right-0 mx-auto w-fit bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg flex items-center gap-1.5 ${toastOut ? "animate-toast-out" : "animate-toast-in"}`}
          role="status"
        >
          <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Thanks for your feedback!
        </div>
      )}
    </div>
  );
}
