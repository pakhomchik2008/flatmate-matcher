// Static "what the app looks like" mockup for the landing page — no auth needed.
import Avatar from "./Avatar";
import CompatibilityBadge from "./CompatibilityBadge";

const SAMPLE = [
  { name: "Priya Patel", uni: "University of Warwick", bio: "Engineering, climber, cooks every meal.", score: 94, budget: "£500–£700" },
  { name: "Oliver Chen", uni: "University of Warwick", bio: "Maths PhD. Quiet, big into board games.", score: 88, budget: "£550–£800" },
  { name: "Aisha Khan", uni: "University of Warwick", bio: "Pre-med, gym at 6am, in bed by 11.", score: 81, budget: "£600–£850" },
];

export default function HomePreview() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="card p-3 md:p-5 bg-slate-50">
        <div className="flex items-center gap-1.5 px-2 pb-3">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-amber-400"></span>
          <span className="w-3 h-3 rounded-full bg-good"></span>
          <span className="text-xs text-slate-500 ml-3">flatmate-matcher.vercel.app/matches</span>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-bold">Your matches</div>
              <div className="text-xs text-slate-500">Sorted by compatibility</div>
            </div>
            <div className="hidden md:flex gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-slate-100">University of Warwick</span>
              <span className="px-2 py-1 rounded bg-slate-100">£400–£800</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE.map((p) => (
              <div key={p.name} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar url={null} name={p.name} size={48} />
                    <div>
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.uni}</div>
                    </div>
                  </div>
                  <CompatibilityBadge score={p.score} size="sm" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{p.bio}</p>
                <div className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 w-fit">{p.budget}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
