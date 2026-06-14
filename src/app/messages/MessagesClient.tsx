"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import MessageBubble from "@/components/MessageBubble";
import { createClient } from "@/lib/supabase-browser";
import type { Message } from "@/lib/types";

interface Contact { id: string; name: string; avatar_url: string | null; university: string | null }

interface Props {
  meId: string;
  initialMessages: Message[];
  contacts: Contact[];
  initialOpen: string | null;
}

export default function MessagesClient({ meId, initialMessages, contacts, initialOpen }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [openId, setOpenId] = useState<string | null>(initialOpen);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("messages-rt")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${meId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `sender_id=eq.${meId}` },
        (payload) => setMessages((prev) => prev.some((m) => m.id === (payload.new as Message).id) ? prev : [...prev, payload.new as Message]),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, meId]);

  const threads = useMemo(() => {
    const map = new Map<string, { contact: Contact; last: Message | null; unread: number }>();
    for (const c of contacts) map.set(c.id, { contact: c, last: null, unread: 0 });
    for (const m of messages) {
      const otherId = m.sender_id === meId ? m.receiver_id : m.sender_id;
      const entry = map.get(otherId);
      if (!entry) continue;
      if (!entry.last || m.created_at > entry.last.created_at) entry.last = m;
      if (m.receiver_id === meId && !m.read) entry.unread += 1;
    }
    return Array.from(map.values()).sort((a, b) => {
      const ta = a.last?.created_at ?? "";
      const tb = b.last?.created_at ?? "";
      return tb.localeCompare(ta);
    });
  }, [contacts, messages, meId]);

  const thread = useMemo(() => {
    if (!openId) return [];
    return messages
      .filter((m) => (m.sender_id === meId && m.receiver_id === openId) || (m.sender_id === openId && m.receiver_id === meId))
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }, [messages, openId, meId]);

  const openContact = contacts.find((c) => c.id === openId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread.length, openId]);

  useEffect(() => {
    if (!openId) return;
    const unread = thread.filter((m) => m.receiver_id === meId && !m.read).map((m) => m.id);
    if (unread.length === 0) return;
    supabase.from("messages").update({ read: true }).in("id", unread).then(() => {
      setMessages((prev) => prev.map((m) => unread.includes(m.id) ? { ...m, read: true } : m));
    });
  }, [openId, thread, supabase, meId]);

  async function send() {
    if (!openId || !draft.trim() || sending) return;
    setSending(true);
    const content = draft.trim();
    setDraft("");
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: meId, receiver_id: openId, content })
      .select()
      .single();
    setSending(false);
    if (error) { setDraft(content); alert(error.message); return; }
    if (data) setMessages((prev) => prev.some((m) => m.id === data.id) ? prev : [...prev, data as Message]);
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-3.5rem-1px)] md:h-[calc(100vh-3.5rem)] flex">
      <aside className={`w-full md:w-80 border-r border-slate-200 bg-white ${openId ? "hidden md:block" : "block"}`}>
        <div className="p-4 border-b border-slate-200 font-semibold">Messages</div>
        {threads.length === 0 && (
          <div className="p-6 text-sm text-slate-500">No conversations yet — open a profile and tap "Send message."</div>
        )}
        <ul>
          {threads.map(({ contact, last, unread }) => (
            <li key={contact.id}>
              <button
                onClick={() => setOpenId(contact.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-slate-50 ${openId === contact.id ? "bg-slate-50" : ""}`}
              >
                <Avatar url={contact.avatar_url} name={contact.name} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium text-sm truncate">{contact.name}</div>
                    {last && <div className="text-[10px] text-slate-400">{new Date(last.created_at).toLocaleDateString()}</div>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{last?.content ?? "Start the conversation"}</div>
                </div>
                {unread > 0 && <span className="text-xs bg-brand text-white rounded-full px-2">{unread}</span>}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className={`flex-1 flex flex-col ${openId ? "flex" : "hidden md:flex"}`}>
        {!openContact ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">Select a conversation</div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
              <button className="md:hidden text-slate-500" onClick={() => setOpenId(null)}>←</button>
              <Avatar url={openContact.avatar_url} name={openContact.name} size={36} />
              <div className="font-medium">{openContact.name}</div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {thread.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-8">Say hi 👋</div>
              ) : (
                thread.map((m) => (
                  <MessageBubble key={m.id} content={m.content} mine={m.sender_id === meId} time={m.created_at} />
                ))
              )}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 p-3 border-t border-slate-200 bg-white"
            >
              <input
                className="input"
                placeholder="Type a message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button disabled={sending || !draft.trim()} className="btn-primary">Send</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
