"use client";

export default function QuizSlider({
  value,
  onChange,
  left,
  right,
}: { value: number; onChange: (v: number) => void; left: string; right: string }) {
  return (
    <div className="space-y-3">
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-brand"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-full border text-sm font-medium ${value === n ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200 hover:border-brand"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
