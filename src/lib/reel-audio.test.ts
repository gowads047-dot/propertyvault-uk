import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { audioFilter, musicBedFor, renderArgs, BEDS, MUSIC_DIR } from "./reel-audio";
import { CALENDAR, type ReelFormat } from "./reel-calendar";

describe("which bed each format gets", () => {
  it("puts the calm bed under the explainers and the tense one under the bad news", () => {
    expect(musicBedFor("autopsy")).toBe(BEDS.calm);
    expect(musicBedFor("the-gap")).toBe(BEDS.calm);
    expect(musicBedFor("the-cash")).toBe(BEDS.calm);
    expect(musicBedFor("the-bill")).toBe(BEDS.tense);
    expect(musicBedFor("the-stress")).toBe(BEDS.tense);
    expect(musicBedFor("the-tax")).toBe(BEDS.tense);
  });

  it("has a bed for every format in the calendar", () => {
    const formats = new Set(CALENDAR.map(r => r.format as ReelFormat));
    for (const f of formats) expect(musicBedFor(f), f).toMatch(/\.mp3$/);
  });

  // The licence rows in supabase/social-ops.sql name these files. A rename
  // here without one there leaves a bed with no record of where it came from.
  it("ships both beds in the repository, and they are real files", () => {
    for (const name of Object.values(BEDS)) {
      const p = join(process.cwd(), MUSIC_DIR, name);
      expect(existsSync(p), p).toBe(true);
      expect(statSync(p).size, name).toBeGreaterThan(100_000);
    }
  });
});

describe("the ffmpeg command line", () => {
  const args = renderArgs({
    framesPattern: ".reel-frames/x/f%04d.jpg",
    bedPath: "assets/music/bed-a-calm-pulse.mp3",
    out: "public/reels/day-01-autopsy-1.mp4",
    fps: 30,
    seconds: 14,
  });
  const joined = args.join(" ");

  it("takes the bed as a looped second input", () => {
    const i = args.indexOf("-stream_loop");
    expect(args[i + 1]).toBe("-1");
    expect(args[i + 2]).toBe("-i");
    expect(args[i + 3]).toBe("assets/music/bed-a-calm-pulse.mp3");
  });

  it("includes the audio filter: trim, loudnorm, fades", () => {
    expect(joined).toContain("-filter_complex");
    const filter = args[args.indexOf("-filter_complex") + 1];
    expect(filter).toContain("[1:a]atrim=0:14.000");
    expect(filter).toContain("loudnorm=I=-20:TP=-2:LRA=7");
    expect(filter).toContain("afade=t=in:st=0:d=0.6");
    expect(filter).toContain("afade=t=out:st=12.800:d=1.2");
    expect(filter.endsWith("[a]")).toBe(true);
  });

  it("maps the frames as video and the filtered bed as audio, encoded AAC at 128k", () => {
    expect(joined).toContain("-map 0:v -map [a]");
    expect(joined).toContain("-c:a aac -b:a 128k");
    expect(joined).toContain("-shortest");
  });

  it("keeps the video settings the silent renders used", () => {
    expect(joined).toContain("-c:v libx264 -pix_fmt yuv420p -crf 24 -preset slow -movflags +faststart -r 30");
    expect(args[args.length - 1]).toBe("public/reels/day-01-autopsy-1.mp4");
  });

  it("normalises before fading, so the fade survives", () => {
    const f = audioFilter(12);
    expect(f.indexOf("loudnorm")).toBeLessThan(f.indexOf("afade"));
    expect(f.indexOf("aresample")).toBeGreaterThan(f.indexOf("loudnorm"));
  });

  it("never starts the fade-out before zero on a very short clip", () => {
    expect(audioFilter(1)).toContain("afade=t=out:st=0.000");
  });
});
