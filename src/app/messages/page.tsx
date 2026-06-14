import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage({ searchParams }: { searchParams: { to?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: true });

  const otherIds = new Set<string>();
  (messages ?? []).forEach((m) => {
    otherIds.add(m.sender_id === user.id ? m.receiver_id : m.sender_id);
  });
  if (searchParams.to) otherIds.add(searchParams.to);

  const ids = Array.from(otherIds);
  const { data: profiles } = ids.length
    ? await supabase.from("profiles").select("id, name, avatar_url, university").in("id", ids)
    : { data: [] as any[] };

  return (
    <MessagesClient
      meId={user.id}
      initialMessages={messages ?? []}
      contacts={profiles ?? []}
      initialOpen={searchParams.to ?? null}
    />
  );
}
