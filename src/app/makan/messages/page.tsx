"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type Enquiry = {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  listing: { title: string; city: string } | null;
  sender: { name: string } | null;
  recipient: { name: string } | null;
};

type Thread = {
  listingId: string;
  listingTitle: string;
  listingCity: string;
  otherId: string;
  otherName: string;
  messages: Enquiry[];
  unread: number;
  lastAt: string;
  isMine: boolean;
};

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    if (!user) return;
    const { data } = await supabase
      .from("enquiries")
      .select("*, listing:listings(title, city), sender:profiles!enquiries_sender_id_fkey(name), recipient:profiles!enquiries_recipient_id_fkey(name)")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: true });

    const map: Record<string, Thread> = {};
    for (const e of data || []) {
      const otherId = e.sender_id === user.id ? e.recipient_id : e.sender_id;
      const key = `${e.listing_id}__${otherId}`;
      if (!map[key]) {
        map[key] = {
          listingId: e.listing_id,
          listingTitle: e.listing?.title || "Unknown listing",
          listingCity: e.listing?.city || "",
          otherId,
          otherName: e.sender_id === user.id ? (e.recipient?.name || "Seller") : (e.sender?.name || "Buyer"),
          messages: [],
          unread: 0,
          lastAt: e.created_at,
          isMine: e.sender_id === user.id,
        };
      }
      map[key].messages.push(e);
      map[key].lastAt = e.created_at;
      if (!e.read && e.recipient_id === user.id) map[key].unread++;
    }

    const sorted = Object.values(map).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
    setThreads(sorted);
    setLoading(false);
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/makan/auth"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loadMessages is an async fetch; its setState calls run after the await, not during render
    loadMessages();
  }, [user, authLoading]); // eslint-disable-line

  async function markRead(thread: Thread) {
    if (!user) return;
    const unreadIds = thread.messages.filter(m => !m.read && m.recipient_id === user.id).map(m => m.id);
    if (unreadIds.length) {
      await supabase.from("enquiries").update({ read: true }).in("id", unreadIds);
    }
  }

  async function selectThread(t: Thread) {
    setSelected(t);
    await markRead(t);
    setThreads(ts => ts.map(x => x.listingId === t.listingId && x.otherId === t.otherId ? { ...x, unread: 0 } : x));
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selected || !reply.trim()) return;
    setSending(true);
    const { data: newMsg } = await supabase.from("enquiries").insert({
      listing_id: selected.listingId,
      sender_id: user.id,
      recipient_id: selected.otherId,
      message: reply.trim(),
    }).select("*, sender:profiles!enquiries_sender_id_fkey(name), recipient:profiles!enquiries_recipient_id_fkey(name), listing:listings(title, city)").single();

    if (newMsg) {
      const updated: Thread = { ...selected, messages: [...selected.messages, newMsg], lastAt: newMsg.created_at };
      setSelected(updated);
      setThreads(ts => ts.map(x => x.listingId === selected.listingId && x.otherId === selected.otherId ? updated : x));
    }
    setReply("");
    setSending(false);
  }

  if (loading || authLoading) return (
    <div className="py-20 text-center" style={{ color: "var(--h-muted)" }}>Loading…</div>
  );

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px 80px", fontFamily: "var(--font-family-body)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <Link href="/makan/dashboard" style={{ fontSize: 12, color: "var(--h-muted)", textDecoration: "none" }}>← Dashboard</Link>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>Messages</h1>
        {totalUnread > 0 && (
          <span style={{ fontSize: 10, fontWeight: 800, background: "#22c55e", color: "white", borderRadius: 20, padding: "2px 8px" }}>
            {totalUnread} new
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, height: 560 }}>
        {/* Thread list */}
        <div style={{ border: "1px solid var(--h-border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--h-border)", fontSize: 11, fontWeight: 700, color: "var(--h-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Conversations ({threads.length})
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {threads.length === 0 && (
              <p style={{ padding: 20, fontSize: 13, color: "var(--h-muted)", textAlign: "center" }}>No messages yet.<br />Enquire on a listing to start a conversation.</p>
            )}
            {threads.map(t => {
              const isActive = selected?.listingId === t.listingId && selected?.otherId === t.otherId;
              const lastMsg = t.messages[t.messages.length - 1];
              return (
                <button key={`${t.listingId}__${t.otherId}`} onClick={() => selectThread(t)}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 16px", background: isActive ? "var(--h-surface-2)" : "transparent", borderBottom: "1px solid var(--h-border)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: t.unread > 0 ? 800 : 600, color: "var(--h-text)" }}>{t.otherName}</span>
                    {t.unread > 0 && (
                      <span style={{ fontSize: 9, fontWeight: 800, background: "#22c55e", color: "white", borderRadius: 10, padding: "1px 6px" }}>{t.unread}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--h-muted)", marginBottom: 3, fontWeight: 500 }}>{t.listingTitle}</p>
                  <p style={{ fontSize: 12, color: "var(--h-muted)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lastMsg?.message}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--h-muted)", marginTop: 4, opacity: 0.6 }}>
                    {new Date(t.lastAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message view */}
        {selected ? (
          <div style={{ border: "1px solid var(--h-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--h-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "var(--h-text)" }}>{selected.otherName}</p>
                <Link href={`/makan/listing/${selected.listingId}`} style={{ fontSize: 11, color: "var(--h-accent)", textDecoration: "none" }}>
                  {selected.listingTitle} · {selected.listingCity}
                </Link>
              </div>
              <Link href={`/makan/listing/${selected.listingId}`} style={{ fontSize: 12, color: "var(--h-accent)", textDecoration: "none", border: "1px solid var(--h-border)", padding: "5px 12px", borderRadius: 8 }}>
                View listing
              </Link>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              {selected.messages.map(msg => {
                const mine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "70%", background: mine ? "var(--h-accent)" : "var(--h-surface-2)", borderRadius: mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px" }}>
                      <p style={{ fontSize: 13, color: mine ? "#fff" : "var(--h-text)", lineHeight: 1.5 }}>{msg.message}</p>
                      <p style={{ fontSize: 10, color: mine ? "rgba(255,255,255,0.6)" : "var(--h-muted)", marginTop: 4 }}>
                        {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {new Date(msg.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendReply} style={{ padding: "12px 16px", borderTop: "1px solid var(--h-border)", display: "flex", gap: 10 }}>
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type a message…"
                style={{ flex: 1, background: "var(--h-surface-2)", border: "1px solid var(--h-border)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--h-text)", outline: "none", fontFamily: "inherit" }} />
              <button type="submit" disabled={sending || !reply.trim()} style={{ background: "var(--h-accent)", color: "white", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", opacity: sending ? 0.6 : 1 }}>
                {sending ? "…" : "Send"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--h-border)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 14, color: "var(--h-muted)", textAlign: "center" }}>Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
