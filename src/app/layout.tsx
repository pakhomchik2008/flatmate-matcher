import "./globals.css";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flatmate-matcher.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Flatmate Matcher — Find your perfect university flatmate",
    template: "%s — Flatmate Matcher",
  },
  description:
    "Take a 60-second quiz and get matched with compatible students at your university.",
  openGraph: {
    title: "Flatmate Matcher — Find your perfect university flatmate",
    description:
      "Take a 60-second quiz and get matched with compatible students at your university.",
    url: SITE_URL,
    siteName: "Flatmate Matcher",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Flatmate Matcher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flatmate Matcher — Find your perfect university flatmate",
    description:
      "Take a 60-second quiz and get matched with compatible students at your university.",
    images: ["/og.svg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let unreadCount = 0;
  if (user) {
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", user.id)
      .eq("read", false);
    unreadCount = count ?? 0;
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {user && <NavBar unreadCount={unreadCount} />}
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
