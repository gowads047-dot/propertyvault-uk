"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { isMissingTable } from "@/lib/makan-inventory";
import {
  WANTED_KINDS,
  KIND_LABEL,
  defaultChannel,
  expiryLabel,
  findMatches,
  isLive,
  matchSummary,
  postedLabel,
  sortPosts,
  toPosts,
  validate,
  type MatchableSpace,
  type WantedKind,
  type WantedPost,
  type WantedQueryRow,
} from "@/lib/makan-wanted";

/**
 * The Wanted board.
 *
 * This page used to post to /api/contact and email. Nothing was ever
 * displayed, so no landlord could answer and no poster could see they were not
 * the only one asking — which is a contact form wearing a marketplace's name.
 *
 * It matters more than search right now because it is the only surface that
 * works at zero supply. Search over nine rooms is worthless; a board of people
 * saying what they need is a reason for a landlord to turn up.
 *
 * Rules live in @/lib/makan-wanted. The one to be careful with is the copy
 * after posting: it says how many rooms exist and who can see the post, and it
 * does not promise anyone will be notified, because nothing notifies them yet.
 */

type Load =
  | { state: "loading" }
  | { state: "no-schema" }
  | { state: "error"; message: string }
  | { state: "ready"; posts: WantedPost[] };

export default function WantedPage() {
  const { user, loading: authLoading } = useAuth();

  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [now, setNow] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState<string | null>(null);

  const [kind, setKind] = useState<WantedKind>("room");
  const [areaText, setAreaText] = useState("");
  const [budget, setBudget] = useState("");
  const [neededFrom, setNeededFrom] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const fetchBoard = useCallback(async () => {
    const { data, error } = await supabase
      .from("makan_wanted")
      .select("id,kind,area_text,budget_max_pcm,needed_from,detail,channel,status,expires_at,created_at,created_by")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setLoad(isMissingTable(error.code)
        ? { state: "no-schema" }
        : { state: "error", message: error.message });
      return;
    }
    setNow(new Date());
    setLoad({ state: "ready", posts: toPosts((data ?? []) as WantedQueryRow[], user?.id ?? null) });
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; setState runs after the await
    fetchBoard();
  }, [authLoading, fetchBoard]);

  const posts = useMemo(() => (load.state === "ready" ? load.posts : []), [load]);
  const visible = useMemo(() => (now ? sortPosts(posts, now) : []), [posts, now]);
  const liveCount = useMemo(
    () => (now ? posts.filter(p => isLive(p, now)).length : 0),
    [posts, now]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const check = validate({ kind, areaText, budgetMaxPcm: budget });
    if (!check.ok) {
      setFormError(check.message);
      return;
    }
    if (!user) return;

    setSaving(true);
    const channel = defaultChannel(kind);
    const { data, error } = await supabase
      .from("makan_wanted")
      .insert({
        created_by: user.id,
        kind,
        area_text: areaText.trim(),
        budget_max_pcm: budget === "" ? null : Number(budget),
        needed_from: neededFrom || null,
        detail: detail.trim() || null,
        channel,
      })
      .select("id")
      .single();
    setSaving(false);

    if (error || !data) {
      setFormError(error?.message ?? "Could not save that. Try again.");
      return;
    }

    // Say what is true: how many rooms exist right now. Nothing is notified.
    const rooms = await supabase
      .from("makan_space")
      .select("id,label,rent_pcm,makan_unit!inner(makan_building!inner(city,postcode))")
      .eq("status", "available_now")
      .limit(200);

    type RoomRow = {
      id: string; label: string; rent_pcm: number | null;
      makan_unit: { makan_building: { city: string; postcode: string } | null } | null;
    };
    const matchable: MatchableSpace[] = ((rooms.data ?? []) as unknown as RoomRow[])
      .filter(r => r.makan_unit?.makan_building)
      .map(r => ({
        spaceId: r.id,
        label: r.label,
        rentPcm: r.rent_pcm,
        city: r.makan_unit!.makan_building!.city,
        postcode: r.makan_unit!.makan_building!.postcode,
        areaLabel: "",
      }));

    const found = findMatches(
      { areaText: areaText.trim(), budgetMaxPcm: budget === "" ? null : Number(budget) },
      matchable
    );

    setJustPosted(matchSummary(found.length, channel));
    setShowForm(false);
    setAreaText(""); setBudget(""); setNeededFrom(""); setDetail(""); setKind("room");
    await fetchBoard();
  }

  async function closePost(id: string) {
    const { error } = await supabase.from("makan_wanted").update({ status: "closed" }).eq("id", id);
    if (!error) await fetchBoard();
  }

  return (
    <>
      <section className="py-12" style={{ background: "var(--h-surface)" }}>
        <div className="h-container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-semibold"
                 style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
              Flip the script
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--h-text)" }}>
              Property Wanted
            </h1>
            <p style={{ color: "var(--h-muted)" }}>
              Can&apos;t find what you&apos;re looking for? Post what you need and let landlords come to
              you. Free to post, free to answer.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)", minHeight: "50vh" }}>
        <div className="h-container">

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm font-medium" style={{ color: "var(--h-muted)" }}>
              {load.state === "ready"
                ? liveCount === 0
                  ? "No open requests yet — be the first."
                  : `${liveCount} open request${liveCount === 1 ? "" : "s"}`
                : " "}
            </p>
            {user ? (
              <button onClick={() => { setShowForm(!showForm); setJustPosted(null); }}
                      className="h-btn h-btn-primary text-sm !py-2">
                {showForm ? "Cancel" : "Post what you need"}
              </button>
            ) : (
              <Link href="/makan/auth" className="h-btn h-btn-primary text-sm !py-2">Sign in to post</Link>
            )}
          </div>

          {justPosted && (
            <div className="mb-6 rounded-xl px-5 py-4"
                 style={{ background: "var(--h-green-light)", border: "1px solid var(--h-green)" }}>
              <p className="font-semibold mb-1" style={{ color: "var(--h-text)" }}>Posted.</p>
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>{justPosted}</p>
            </div>
          )}

          {showForm && user && (
            <form onSubmit={submit} className="mb-8 rounded-2xl p-6"
                  style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="w-kind" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>
                    What are you looking for?
                  </label>
                  <select id="w-kind" className="h-input" value={kind}
                          onChange={e => setKind(e.target.value as WantedKind)}>
                    {WANTED_KINDS.map(k => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
                  </select>
                  {defaultChannel(kind) === "landlords_only" && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--h-muted)" }}>
                      Placement requests are never shown publicly — only landlords and providers on
                      Makan will see this.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="w-area" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>
                    Where? <span style={{ color: "var(--h-accent)" }}>*</span>
                  </label>
                  <input id="w-area" className="h-input" value={areaText}
                         onChange={e => setAreaText(e.target.value)}
                         placeholder="Selly Oak, B29, near the QE…" />
                </div>

                <div>
                  <label htmlFor="w-budget" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>
                    Budget per month
                  </label>
                  <input id="w-budget" className="h-input" inputMode="numeric" value={budget}
                         onChange={e => setBudget(e.target.value)} placeholder="£ — optional" />
                </div>

                <div>
                  <label htmlFor="w-from" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>
                    Needed from
                  </label>
                  <input id="w-from" type="date" className="h-input" value={neededFrom}
                         onChange={e => setNeededFrom(e.target.value)} />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="w-detail" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>
                    Anything else
                  </label>
                  <textarea id="w-detail" className="h-input" rows={3} value={detail}
                            onChange={e => setDetail(e.target.value)}
                            placeholder="Bills included, ensuite, quiet house, parking…" />
                </div>
              </div>

              {formError && (
                <p className="text-sm mt-4" role="alert" style={{ color: "var(--h-accent)" }}>{formError}</p>
              )}

              <div className="mt-5 flex items-center gap-3">
                <button type="submit" className="h-btn h-btn-primary" disabled={saving}>
                  {saving ? "Posting…" : "Post it"}
                </button>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>
                  Expires automatically after 60 days.
                </p>
              </div>
            </form>
          )}

          {load.state === "loading" && (
            <p style={{ color: "var(--h-muted)" }}>Loading the board…</p>
          )}

          {load.state === "no-schema" && (
            <Panel title="The Wanted board is not set up yet">
              Run <code>supabase/makan-wanted-schema.sql</code> in the Supabase SQL editor, then
              reload. It only adds one table.
            </Panel>
          )}

          {load.state === "error" && (
            <Panel title="Could not load the board">{load.message}</Panel>
          )}

          {load.state === "ready" && now && visible.length === 0 && (
            <Panel title="Nothing here yet">
              This is the one part of Makan that works before there are any listings. Post what you
              are looking for and it sits here where landlords can find it.
            </Panel>
          )}

          {load.state === "ready" && now && visible.length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
              {visible.map(p => {
                const live = isLive(p, now);
                return (
                  <li key={p.id} className="rounded-2xl p-5"
                      style={{
                        background: "var(--h-surface)",
                        border: "1px solid var(--h-border)",
                        opacity: live ? 1 : 0.6,
                      }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                            style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
                        {KIND_LABEL[p.kind]}
                      </span>
                      {p.channel === "landlords_only" && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full"
                              style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}
                              title="Only landlords and providers can see this">
                          Private
                        </span>
                      )}
                    </div>

                    <p className="font-bold text-lg mb-1" style={{ color: "var(--h-text)" }}>{p.areaText}</p>

                    <p className="text-sm mb-3" style={{ color: "var(--h-muted)" }}>
                      {p.budgetMaxPcm !== null ? `Up to £${p.budgetMaxPcm.toLocaleString("en-GB")}/mo` : "No budget given"}
                      {p.neededFrom && ` · from ${new Date(p.neededFrom).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                    </p>

                    {p.detail && (
                      <p className="text-sm mb-3" style={{ color: "var(--h-muted)" }}>{p.detail}</p>
                    )}

                    <p className="text-xs" style={{ color: "var(--h-subtle)" }}>
                      Posted {postedLabel(p, now)}
                      {p.isMine && ` · ${expiryLabel(p, now)}`}
                    </p>

                    {p.isMine && live && (
                      <button onClick={() => closePost(p.id)}
                              className="h-btn h-btn-secondary !py-1.5 !px-3 !text-sm mt-3">
                        Mark as sorted
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
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
