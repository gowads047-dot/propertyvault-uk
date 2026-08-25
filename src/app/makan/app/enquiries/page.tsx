"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { isMissingTable } from "@/lib/makan-inventory";
import {
  ENQUIRY_STATUS_LABEL,
  relative,
  sortInbox,
  toEnquiries,
  unansweredCount,
  type Enquiry,
  type EnquiryQueryRow,
} from "@/lib/makan-enquiry";

/**
 * The landlord's side of an enquiry.
 *
 * Ordered so the person who has been waiting longest is served first, rather
 * than newest-on-top — which is what makes a renter's third day of silence
 * invisible.
 *
 * Opening a thread marks it read, and that is what the renter sees on the room
 * page. It is recorded because this client actually rendered it, never guessed
 * from delivery, so "Read 2 hours ago" means a person opened it.
 */

type Load =
  | { state: "loading" }
  | { state: "no-schema" }
  | { state: "no-org" }
  | { state: "error"; message: string }
  | { state: "ready"; list: Enquiry[] };

const SELECT =
  `id,space_id,sender_id,move_in,phone,status,read_at,replied_at,created_at,
   profiles!makan_enquiry_sender_id_fkey(name),
   makan_enquiry_message(id,author_id,body,created_at)`;

export default function EnquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [openId, setOpenId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const fetchInbox = useCallback(async () => {
    if (!user) return;

    const orgs = await supabase.from("makan_org_member").select("org_id").eq("user_id", user.id);
    if (orgs.error) {
      setLoad(isMissingTable(orgs.error.code)
        ? { state: "no-schema" }
        : { state: "error", message: orgs.error.message });
      return;
    }
    if ((orgs.data ?? []).length === 0) { setLoad({ state: "no-org" }); return; }

    // RLS already limits this to threads on rooms the caller's org owns, plus
    // any they sent themselves — which is what we want on this screen.
    const { data, error } = await supabase
      .from("makan_enquiry")
      .select(SELECT)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      setLoad(isMissingTable(error.code)
        ? { state: "no-schema" }
        : { state: "error", message: error.message });
      return;
    }
    setNow(new Date());
    setLoad({ state: "ready", list: toEnquiries((data ?? []) as unknown as EnquiryQueryRow[]) });
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/makan/auth"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; setState runs after the await
    fetchInbox();
  }, [user, authLoading, router, fetchInbox]);

  const list = useMemo(() => (load.state === "ready" ? sortInbox(load.list) : []), [load]);
  const waiting = useMemo(() => (load.state === "ready" ? unansweredCount(load.list) : 0), [load]);

  async function open(e: Enquiry) {
    setOpenId(openId === e.id ? null : e.id);
    setReply("");
    // Only ever new -> read. Never downgrade a replied thread.
    if (e.status === "new") {
      await supabase
        .from("makan_enquiry")
        .update({ status: "read", read_at: new Date().toISOString() })
        .eq("id", e.id);
      await fetchInbox();
    }
  }

  async function sendReply(e: Enquiry) {
    if (!user || !reply.trim()) return;
    setSending(true);
    const { error } = await supabase
      .from("makan_enquiry_message")
      .insert({ enquiry_id: e.id, author_id: user.id, body: reply.trim() });
    setSending(false);
    if (error) { setLoad({ state: "error", message: error.message }); return; }
    setReply("");
    // status flips to 'replied' via the database trigger, not from here.
    await fetchInbox();
  }

  if (authLoading || load.state === "loading") return <Shell><p style={{ color: "var(--h-muted)" }}>Loading…</p></Shell>;
  if (load.state === "no-schema") {
    return <Shell><Panel title="Enquiries are not set up yet">
      Run <code>supabase/makan-enquiry-schema.sql</code> in the Supabase SQL editor, then reload.
    </Panel></Shell>;
  }
  if (load.state === "no-org") {
    return <Shell><Panel title="You are not in an organisation yet">
      Enquiries arrive against rooms owned by an organisation.
    </Panel></Shell>;
  }
  if (load.state === "error") return <Shell><Panel title="Could not load enquiries">{load.message}</Panel></Shell>;
  if (!now) return <Shell><p style={{ color: "var(--h-muted)" }}>Loading…</p></Shell>;

  if (list.length === 0) {
    return <Shell><Panel title="No enquiries yet">
      When somebody messages you about a room, it lands here — and they can see
      when you have read it, so a quick reply is worth something.
    </Panel></Shell>;
  }

  return (
    <Shell>
      {waiting > 0 && (
        <p className="mb-4 text-sm px-4 py-3 rounded-xl"
           style={{ background: "#fff8e6", border: "1px solid #f0d9a0", color: "#6b4e0f" }}>
          <strong>{waiting}</strong> {waiting === 1 ? "person is" : "people are"} waiting on a reply.
          Longest wait first.
        </p>
      )}

      <ul className="list-none p-0 m-0 grid gap-3">
        {list.map(e => {
          const isOpen = openId === e.id;
          const last = e.messages[e.messages.length - 1];
          return (
            <li key={e.id} className="rounded-2xl overflow-hidden"
                style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <button
                onClick={() => open(e)}
                aria-expanded={isOpen}
                className="w-full text-left p-4"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <span className="font-bold" style={{ color: "var(--h-text)" }}>
                    {e.senderName ?? "Someone"}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: e.status === "new" ? "var(--h-accent-light)" : "var(--h-warm)",
                          color: e.status === "new" ? "var(--h-accent)" : "var(--h-muted)",
                        }}>
                    {ENQUIRY_STATUS_LABEL[e.status]}
                  </span>
                </div>
                <p className="text-sm mb-1" style={{ color: "var(--h-muted)" }}>
                  {last ? last.body.slice(0, 110) + (last.body.length > 110 ? "…" : "") : "No message"}
                </p>
                <p className="text-xs" style={{ color: "var(--h-subtle)" }}>
                  {relative(e.createdAt, now)}
                  {e.moveIn && ` · wants ${new Date(e.moveIn).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                  {e.phone && ` · ${e.phone}`}
                  {" · "}
                  <Link href={`/makan/space/${e.spaceId}`} style={{ color: "var(--h-accent)" }}>the room</Link>
                </p>
              </button>

              {isOpen && (
                <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--h-border)" }}>
                  <ul className="list-none p-0 my-4 grid gap-3">
                    {e.messages.map(m => {
                      const mine = m.authorId === user?.id;
                      return (
                        <li key={m.id} className="text-sm px-3 py-2 rounded-xl"
                            style={{
                              background: mine ? "var(--h-warm)" : "var(--h-bg)",
                              marginLeft: mine ? "2rem" : 0,
                              marginRight: mine ? 0 : "2rem",
                            }}>
                          <p className="m-0" style={{ color: "var(--h-text)" }}>{m.body}</p>
                          <p className="m-0 mt-1 text-xs" style={{ color: "var(--h-subtle)" }}>
                            {mine ? "You" : e.senderName ?? "Them"} · {relative(m.createdAt, now)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>

                  <label htmlFor={`reply-${e.id}`} className="sr-only">Reply to {e.senderName ?? "this enquiry"}</label>
                  <textarea id={`reply-${e.id}`} className="h-input mb-2" rows={3} value={reply}
                            onChange={ev => setReply(ev.target.value)}
                            placeholder="Yes, it is still available — viewings Thursday evening." />
                  <button onClick={() => sendReply(e)} disabled={sending || !reply.trim()}
                          className="h-btn h-btn-primary !py-2 !text-sm">
                    {sending ? "Sending…" : "Send reply"}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-10" style={{ background: "var(--h-bg)", minHeight: "100vh" }}>
      <div className="h-container">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--h-text)" }}>Enquiries</h1>
          <p className="text-sm" style={{ color: "var(--h-muted)" }}>
            People asking about your rooms. They can see when you have read them.
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-8 max-w-xl"
         style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      <h2 className="text-lg font-bold mb-2" style={{ color: "var(--h-text)" }}>{title}</h2>
      <p className="text-sm" style={{ color: "var(--h-muted)" }}>{children}</p>
    </div>
  );
}
