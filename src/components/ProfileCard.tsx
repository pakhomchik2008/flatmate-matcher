import Link from "next/link";
import Avatar from "./Avatar";
import CompatibilityBadge from "./CompatibilityBadge";
import type { Profile } from "@/lib/types";
import { displayName } from "@/lib/types";

export default function ProfileCard({
  profile,
  score,
  budgetMisalign,
}: { profile: Profile; score: number; budgetMisalign?: boolean }) {
  return (
    <Link
      href={`/profile/${profile.id}`}
      className="card p-4 flex flex-col gap-3 hover:shadow-md hover:border-brand/30 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar url={profile.avatar_url} name={profile.name} size={56} />
          <div>
            <div className="font-semibold text-slate-900">{displayName(profile)}{profile.age ? `, ${profile.age}` : ""}</div>
            <div className="text-xs text-slate-500">{profile.university}</div>
            <div className="text-xs text-slate-500">{profile.city}</div>
          </div>
        </div>
        <CompatibilityBadge score={score} />
      </div>
      {profile.bio && <p className="text-sm text-slate-600 line-clamp-2">{profile.bio}</p>}
      <div className="flex flex-wrap gap-2 text-xs">
        {profile.move_in_date && (
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700">
            Move-in: {new Date(profile.move_in_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
        {profile.budget_min != null && profile.budget_max != null && (
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700">£{profile.budget_min}–£{profile.budget_max}</span>
        )}
        {budgetMisalign && (
          <span className="px-2 py-1 rounded-md bg-warn/10 text-warn">Budget may not align</span>
        )}
      </div>
    </Link>
  );
}
