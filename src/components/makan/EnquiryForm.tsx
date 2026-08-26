"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { isMissingTable } from "@/lib/makan-inventory";
import {
  medianReplyMinutes,
  relative,
  responsivenessLabel,
  threadStateLabel,
  validateEnquiry,
  type EnquiryStatus,
} from "@/lib/makan-enquiry";

/**
 * The enquiry box on a room page.
 *
 * Sending an enquiry on a portal today is posting into a void: you get "your
 * message has been sent" and never learn whether a human read it. Once sent,
 * this shows the real state of the thread — sent, read, replied — because the
 * landlord's client records it, not because we assume it.
 *
 * The line above the button is the one to be careful with. Portals show
 * "usually replies within 3 hours" because it lifts enquiry rates. Here it
 * comes from makan_org_responsiveness, which returns nothing until there are
 * at least three replied threads, and when it returns nothing this renders
 * nothing at all.
 */

interface Props {
  spaceId: string;
  orgId: string;
  /**
   * Whether this listing is open to a company let. The consent notes used to
   * live in the listing form, where they read as a warning to a landlord who
   * had not asked for one and who mostly already knows the process. They
   * belong here instead: at the point two parties are actually about to talk,
   * addressed to whoever needs them.
   */
  acceptsCompanies?: boolean;
}

type Existing = { id: string; status: EnquiryStatus; readAt: string | null; repliedAt: string | null };

export function EnquiryForm({ spaceId, orgId, acceptsCompanies = false }: Props) {
  const { user, loading: authLoading } = useAuth();

  const [existing, setExisting] = useState<Existing | null>(null);
  const [checked, setChecked] = useState(false);
  const [responsiveness, setResponsiveness] = useState<string | null>(null);

  const [body, setBody] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  const load = useCallback(async () => {
    // Aggregate only — RLS means a renter cannot see other people's threads,
    // so this cannot be computed client-side and must not be faked.
    const stats = await supabase.rpc("makan_org_responsiveness", { target_org: orgId });
    if (!stats.error && Array.isArray(stats.data) && stats.data[0]) {
      const { replied_count, median_minutes } = stats.data[0] as {
        replied_count: number; median_minutes: number | string;
      };
      const mins = Number(median_minutes);
      if (Number.isFinite(mins)) {
        // Rebuild the sample the shared helper expects, so the wording and the
        // minimum-sample rule live in one place rather than two.
        const fake = Array.from({ length: replied_count }, () => ({
          createdAt: new Date(0).toISOString(),
          repliedAt: new Date(mins * 60_000).toISOString(),
        }));
        if (medianReplyMinutes(fake) !== null) setResponsiveness(responsivenessLabel(fake));
      }
    }

    if (!user) { setChecked(true); return; }
    const { data, error: err } = await supabase
      .from("makan_enquiry")
      .select("id,status,read_at,replied_at")
      .eq("space_id", spaceId)
      .eq("sender_id", user.id)
      .maybeSingle();
    if (!err && data) {
      setExisting({ id: data.id, status: data.status, readAt: data.read_at, repliedAt: data.replied_at });
    }
    setNow(new Date());
    setChecked(true);
  }, [orgId, spaceId, user]);

  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; setState runs after the await
    load();
  }, [authLoading, load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const check = validateEnquiry({ body, phone });
    if (!check.ok) { setError(check.message); return; }
    if (!user) return;

    setSending(true);
    const { data, error: insErr } = await supabase
      .from("makan_enquiry")
      .insert({
        space_id: spaceId,
        sender_id: user.id,
        move_in: moveIn || null,
        phone: phone.trim() || null,
      })
      .select("id,status,read_at,replied_at")
      .single();

    if (insErr || !data) {
      setSending(false);
      setError(
        isMissingTable(insErr?.code)
          ? "Enquiries are not set up yet. Run supabase/makan-enquiry-schema.sql."
          : insErr?.message ?? "Could not send that. Try again."
      );
      return;
    }

    const msg = await supabase
      .from("makan_enquiry_message")
      .insert({ enquiry_id: data.id, author_id: user.id, body: body.trim() });
    setSending(false);

    if (msg.error) { setError(msg.error.message); return; }
    setNow(new Date());
    setExisting({ id: data.id, status: data.status, readAt: data.read_at, repliedAt: data.replied_at });
    setBody(""); setPhone(""); setMoveIn("");
  }

  if (authLoading || !checked) {
    return <Card><p style={{ color: "var(--h-muted)" }}>Loading…</p></Card>;
  }

  if (existing && now) {
    return (
      <Card>
        <h2 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>You have enquired</h2>
        <p className="text-sm mb-3" style={{ color: "var(--h-muted)" }}>
          {threadStateLabel(existing, now)}
        </p>
        <Link href="/makan/app/enquiries" className="h-btn h-btn-secondary w-full">
          View the conversation
        </Link>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <h2 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>Interested?</h2>
        <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>
          Message the landlord directly. No agent, no fee.
        </p>
        {responsiveness && (
          <p className="text-sm mb-4" style={{ color: "var(--h-green)" }}>✓ {responsiveness}</p>
        )}
        <Link href={`/makan/auth?next=/makan/space/${spaceId}`} className="h-btn h-btn-primary w-full">
          Sign in to enquire
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>Enquire about this room</h2>
      <p className="text-sm mb-3" style={{ color: "var(--h-muted)" }}>
        Straight to the landlord. No agent, no fee.
      </p>
      {responsiveness && (
        <p className="text-sm mb-3" style={{ color: "var(--h-green)" }}>✓ {responsiveness}</p>
      )}

      {acceptsCompanies && (
        <div className="mb-4 p-4 rounded-xl text-sm"
             style={{ background: "var(--h-warm)", border: "1px solid var(--h-border)" }}>
          <p className="font-bold mb-1.5" style={{ color: "var(--h-text)" }}>
            Enquiring as a company?
          </p>
          <p className="leading-relaxed mb-2" style={{ color: "var(--h-muted)" }}>
            Say so in your first message, with what the property is for, the lease length you are
            offering and your company number. A landlord can answer that in one reply instead of
            three.
          </p>
          <p className="leading-relaxed" style={{ color: "var(--h-muted)" }}>
            Both of you will want to confirm the lender, insurer and freeholder permit a company
            let before anything is signed —{" "}
            <Link href="/makan/company-lets" className="underline" style={{ color: "var(--h-accent-hover)" }}>
              what to check
            </Link>.
          </p>
        </div>
      )}

      <form onSubmit={send}>
        <label htmlFor="enq-body" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
          Your message
        </label>
        <textarea id="enq-body" className="h-input mb-3" rows={4} value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Hi — is this room still available? I'm looking to move in October and work locally." />

        <label htmlFor="enq-move" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
          Move-in date <span style={{ fontWeight: 400 }}>(optional)</span>
        </label>
        <input id="enq-move" type="date" className="h-input mb-3" value={moveIn}
               onChange={e => setMoveIn(e.target.value)} />

        <label htmlFor="enq-phone" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
          Phone <span style={{ fontWeight: 400 }}>(optional — shared with this landlord only)</span>
        </label>
        <input id="enq-phone" className="h-input mb-4" inputMode="tel" value={phone}
               onChange={e => setPhone(e.target.value)} placeholder="07700 900123" />

        {error && <p className="text-sm mb-3" role="alert" style={{ color: "var(--h-accent)" }}>{error}</p>}

        <button type="submit" className="h-btn h-btn-primary w-full" disabled={sending}>
          {sending ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </Card>
  );
}

/** Shown on the renter's own thread once a landlord has read it. */
export function readReceipt(readAt: string | null, now: Date): string | null {
  return readAt ? `Read ${relative(readAt, now)}` : null;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 mb-5"
         style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      {children}
    </div>
  );
}
