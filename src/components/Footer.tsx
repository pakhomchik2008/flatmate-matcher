import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand">flatmate.</span>
          <span className="text-slate-400">© 2026 Flatmate Matcher</span>
        </div>
        <nav className="flex gap-5">
          <Link href="/demo" className="hover:text-slate-900">Try the demo</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <a href="https://github.com/pakhomchik2008/flatmate-matcher" target="_blank" rel="noreferrer" className="hover:text-slate-900">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}
