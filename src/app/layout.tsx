import "./globals.css";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Flatmate Matcher",
  description: "Find compatible flatmates at your university.",
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
      </body>
    </html>
  );
}
