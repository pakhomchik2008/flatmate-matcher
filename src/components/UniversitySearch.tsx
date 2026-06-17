"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { University } from "@/lib/types";

export type { University };

interface Props {
  /** Currently selected university_id (uuid) */
  value: string | null;
  /** Text shown in the input */
  displayValue: string;
  onSelect: (u: University) => void;
  placeholder?: string;
  required?: boolean;
}

export default function UniversitySearch({
  value: _value,
  displayValue,
  onSelect,
  placeholder = "Search universities…",
  required,
}: Props) {
  const [query, setQuery]       = useState(displayValue);
  const [results, setResults]   = useState<University[]>([]);
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync when parent changes displayValue externally */
  useEffect(() => { setQuery(displayValue); }, [displayValue]);

  /* Close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function triggerSearch(q: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("universities")
        .select("id, name, abbreviation, city, country, qs_rank")
        .or(`name.ilike.%${q}%,abbreviation.ilike.%${q}%,city.ilike.%${q}%`)
        .order("qs_rank", { ascending: true, nullsFirst: false })
        .limit(8);
      setResults((data ?? []) as University[]);
      setOpen(true);
      setActiveIdx(-1);
      setLoading(false);
    }, 250);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    triggerSearch(e.target.value);
  }

  function handleSelect(u: University) {
    setQuery(u.name);
    setResults([]);
    setOpen(false);
    setActiveIdx(-1);
    onSelect(u);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative">
        <input
          className="input pr-8"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        {loading ? (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          </span>
        ) : (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slide-up"
          role="listbox"
        >
          {results.map((u, i) => (
            <li
              key={u.id}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(u); }}
              onMouseEnter={() => setActiveIdx(i)}
              className={`px-3 py-2.5 cursor-pointer flex items-start justify-between gap-3 ${
                i === activeIdx
                  ? "bg-brand/5 border-l-[3px] border-brand pl-[calc(0.75rem-3px)]"
                  : "hover:bg-slate-50"
              } ${i < results.length - 1 ? "border-b border-slate-100" : ""}`}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{u.name}</div>
                <div className="text-xs text-slate-500">{u.city}, {u.country}</div>
              </div>
              {u.qs_rank && (
                <span className="shrink-0 self-center text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                  QS #{u.qs_rank}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {open && !loading && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-500">
          No universities found for &ldquo;{query}&rdquo;. You can still type your university name freely.
        </div>
      )}
    </div>
  );
}
