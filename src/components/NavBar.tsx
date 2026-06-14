"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const LINKS = [
  { href: "/matches", label: "Matches" },
  { href: "/messages", label: "Messages" },
  { href: "/profile/me", label: "My Profile" },
];

export default function NavBar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <>
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
          <button onClick={signOut} className="ml-2 text-sm text-slate-500 hover:text-slate-900">Sign out</button>
        </nav>
      </header>

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
      </nav>
    </>
  );
}
