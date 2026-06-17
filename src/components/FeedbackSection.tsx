"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface FeedbackRow {
  id: string;
  name: string;
  university: string | null;
  rating: number;
  message: string;
  created_at: string;
}

const STARS = [1, 2, 3, 4, 5];

export default function FeedbackSection() {
  const [reviews, setReviews] = useState<FeedbackRow[]>([]);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function loadReviews() {
    const supabase = createClient();
    const { data } = await supabase
      .from("feedback")
      .select("id, name, university, rating, message, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (data) setReviews(data);
  }

  useEffect(() => { loadReviews(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (message.trim().length < 10) {
      setError("Please write at least 10 characters."); return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("feedback").insert({
      name: name.trim(),
      university: university.trim() || null,
      rating,
      message: message.trim(),
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    await loadReviews();
  }

  return (
    <section className="px-6 py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What students say</h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">Real feedback from students who used Flatmate Matcher.</p>
        </div>

        {/* Reviews grid */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="card p-5 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {STARS.map((s) => (
                    <svg key={s} className={`w-4 h-4 ${s <= r.rating ? "text-yellow-400" : "text-slate-200"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 text-sm flex-1">&ldquo;{r.message}&rdquo;</p>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{r.name}</div>
                  {r.university && <div className="text-xs text-slate-500">{r.university}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA / form toggle */}
        <div className="text-center">
          {!showForm && !done && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary"
            >
              Share your experience →
            </button>
          )}
        </div>

        {/* Feedback form */}
        {showForm && !done && (
          <form onSubmit={handleSubmit} className="card p-6 max-w-xl mx-auto space-y-4">
            <h3 className="font-semibold text-lg">Leave a review</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Your name</label>
                <input
                  required
                  className="input"
                  placeholder="e.g. Sophie W."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="label">University (optional)</label>
                <input
                  className="input"
                  placeholder="e.g. University of Leeds"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Rating</label>
              <div className="flex gap-1 mt-1">
                {STARS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    className="p-0.5"
                    aria-label={`${s} star${s !== 1 ? "s" : ""}`}
                  >
                    <svg className={`w-7 h-7 transition-colors ${s <= (hover || rating) ? "text-yellow-400" : "text-slate-200"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Your experience</label>
              <textarea
                required
                rows={3}
                className="input resize-none"
                placeholder="What did you think? Did you find a flatmate?"
                minLength={10}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="text-xs text-slate-400 text-right">{message.length}/500</div>
            </div>
            {error && <p className="text-sm text-bad">{error}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button disabled={submitting} className="btn-primary flex-1">{submitting ? "Submitting…" : "Submit review"}</button>
            </div>
          </form>
        )}

        {done && (
          <div className="text-center card p-6 max-w-sm mx-auto">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-semibold text-slate-900">Thank you for your feedback!</p>
            <p className="text-sm text-slate-600 mt-1">Your review is now live.</p>
          </div>
        )}
      </div>
    </section>
  );
}
