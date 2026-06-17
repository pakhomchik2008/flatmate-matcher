"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import Avatar from "@/components/Avatar";
import UniversitySearch from "@/components/UniversitySearch";
import type { LookingFor, Profile, University } from "@/lib/types";

export default function MyProfileClient({ profile, email }: { profile: Profile; email: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [p, setP] = useState(profile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true); setErr(null); setMsg(null);
    let avatar_url = p.avatar_url;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop() ?? "jpg";
      const path = `${p.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (upErr) { setSaving(false); setErr(upErr.message); return; }
      avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from("profiles").update({
      name:          p.name,
      nickname:      p.nickname?.trim() || null,
      age:           p.age,
      university:    p.university,
      university_id: p.university_id,
      city:          p.city,
      bio:           p.bio,
      avatar_url,
      move_in_date:  p.move_in_date,
      budget_min:    p.budget_min,
      budget_max:    p.budget_max,
      looking_for:   p.looking_for,
    }).eq("id", p.id);
    setSaving(false);
    if (error) return setErr(error.message);
    setMsg("Saved.");
    router.refresh();
  }

  async function deleteAccount() {
    if (!confirm("This will delete your profile and all your data. Continue?")) return;
    await supabase.from("profiles").delete().eq("id", p.id);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <h1 className="text-2xl font-bold">My profile</h1>

      <div className="card p-6 space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar url={p.avatar_url} name={p.name} size={80} />
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="text-sm" />
        </div>

        {/* Name + Nickname */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Nickname <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              className="input"
              value={p.nickname ?? ""}
              onChange={(e) => setP({ ...p, nickname: e.target.value || null })}
              placeholder="Shown instead of full name"
              maxLength={30}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Age</label>
            <input
              className="input"
              type="number"
              value={p.age ?? ""}
              onChange={(e) => setP({ ...p, age: e.target.value ? parseInt(e.target.value, 10) : null })}
            />
          </div>
          <div>
            <label className="label">Move-in date</label>
            <input
              className="input"
              type="date"
              value={p.move_in_date ?? ""}
              onChange={(e) => setP({ ...p, move_in_date: e.target.value || null })}
            />
          </div>
        </div>

        {/* University search */}
        <div>
          <label className="label">University</label>
          <UniversitySearch
            value={p.university_id}
            displayValue={p.university}
            onSelect={(u: University) => {
              setP({ ...p, university: u.name, university_id: u.id, city: p.city || u.city });
            }}
          />
          {p.university_id && (
            <p className="text-xs text-brand mt-1">✓ Linked to university database</p>
          )}
        </div>

        <div>
          <label className="label">City</label>
          <input className="input" value={p.city} onChange={(e) => setP({ ...p, city: e.target.value })} />
        </div>

        <div>
          <label className="label">Bio</label>
          <textarea
            maxLength={200}
            rows={3}
            className="input resize-none"
            value={p.bio ?? ""}
            onChange={(e) => setP({ ...p, bio: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Budget min (£)</label>
            <input
              className="input"
              type="number"
              value={p.budget_min ?? ""}
              onChange={(e) => setP({ ...p, budget_min: e.target.value ? parseInt(e.target.value, 10) : null })}
            />
          </div>
          <div>
            <label className="label">Budget max (£)</label>
            <input
              className="input"
              type="number"
              value={p.budget_max ?? ""}
              onChange={(e) => setP({ ...p, budget_max: e.target.value ? parseInt(e.target.value, 10) : null })}
            />
          </div>
        </div>

        <div>
          <label className="label">Looking for</label>
          <div className="grid grid-cols-3 gap-2">
            {(["room", "flatmate", "both"] as LookingFor[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setP({ ...p, looking_for: opt })}
                className={`py-2 rounded-lg border text-sm capitalize ${p.looking_for === opt ? "bg-brand text-white border-brand" : "bg-white border-slate-200"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {err && <p className="text-sm text-bad">{err}</p>}
        {msg && <p className="text-sm text-good">{msg}</p>}
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Saving…
              </span>
            ) : "Save changes"}
          </button>
          <Link href="/onboarding" className="btn-secondary">Retake quiz</Link>
        </div>
      </div>

      <div className="card p-6 space-y-3">
        <h2 className="font-semibold">Account</h2>
        <div className="text-sm text-slate-600">Email: {email}</div>
        <button onClick={deleteAccount} className="btn-ghost text-bad hover:bg-bad/10">Delete my account</button>
      </div>
    </div>
  );
}
