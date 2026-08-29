import { NextResponse } from "next/server";
import {
  CALENDAR,
  CAMPAIGN_START,
  INSTAGRAM_USER_ID,
  campaignDay,
  reelForDay,
  fullCaption,
} from "@/lib/reel-calendar";
import { publishReel } from "@/lib/instagram";
import { canonical } from "@/lib/site";

/**
 * Posts one Reel a day from the 30-day calendar.
 *
 * Which video goes out is decided by the date, not by a counter: day one is
 * CAMPAIGN_START, and each day after that advances by one. A failed run
 * therefore skips its day rather than shifting the whole schedule, which is the
 * right trade for a dated campaign — a missed Monday should not push everything
 * else back a day forever. The failure is loud either way.
 *
 * Only the access token comes from the environment. The schedule and the
 * account id are content decisions and live in the repo, where they can be read
 * and changed in a commit rather than in a dashboard; both still accept an
 * environment override for shifting things without a deploy.
 *
 * Three other crons on this site once reported success while sending nothing,
 * because a missing key was treated as a no-op. This one returns 500 with the
 * reason, so a silent campaign shows up as a failing cron in Vercel.
 */
export const maxDuration = 300;

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { posted: false, error: "INSTAGRAM_ACCESS_TOKEN is not configured — nothing was posted." },
      { status: 500 },
    );
  }

  const igUserId = process.env.INSTAGRAM_USER_ID ?? INSTAGRAM_USER_ID;
  const start = process.env.REEL_CAMPAIGN_START ?? CAMPAIGN_START;

  const day = campaignDay(new Date(), start);
  if (day === null) {
    return NextResponse.json(
      { posted: false, error: `Campaign start is not a YYYY-MM-DD date: "${start}"` },
      { status: 500 },
    );
  }

  const spec = reelForDay(day);

  // Running past the end of the calendar is a real outcome, not a failure. A
  // cron that returns 500 every day after day 30 is a cron nobody reads.
  if (!spec) {
    return NextResponse.json({
      posted: false,
      reason: day > CALENDAR.length ? "campaign complete" : "campaign has not started",
      day,
      calendarLength: CALENDAR.length,
    });
  }

  const videoUrl = canonical(`/reels/day-${String(spec.day).padStart(2, "0")}-${spec.id}.mp4`);

  const result = await publishReel(
    { igUserId, accessToken: token, videoUrl, caption: fullCaption(spec) },
    // The global fetch, narrowed to the shape lib/instagram.ts needs so the
    // publishing sequence can be tested without a network.
    (url, init) => fetch(url, init).then(r => ({ ok: r.ok, status: r.status, json: () => r.json() })),
  );

  if (!result.ok) {
    return NextResponse.json(
      { posted: false, day, id: spec.id, videoUrl, error: result.error, containerId: result.containerId },
      { status: 500 },
    );
  }

  return NextResponse.json({
    posted: true,
    day,
    id: spec.id,
    format: spec.format,
    mediaId: result.mediaId,
    polls: result.polls,
    remaining: CALENDAR.length - day,
  });
}
