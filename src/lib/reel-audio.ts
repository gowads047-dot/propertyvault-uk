import type { ReelFormat } from "./reel-calendar";

/**
 * The music bed under each Reel, and the ffmpeg arguments that put it there.
 *
 * The videos were rendered silent. A silent Reel is treated as one by the
 * feed — the sound-on toggle does nothing, and the audio track is one of the
 * signals that separates a video from a slideshow. Two beds, two moods: the
 * calm pulse under the explainers, the tense tick under the ones where the
 * number gets worse.
 *
 * Both beds are ElevenLabs Music generations on the owner's account; their
 * licence records are the seed rows in social_assets (supabase/social-ops.sql).
 *
 * This is a pure function so the command line can be asserted in a test
 * without running ffmpeg. scripts/generate-reels.tsx is the only caller.
 */

export const MUSIC_DIR = "assets/music";

export const BEDS = {
  calm: "bed-a-calm-pulse.mp3",
  tense: "bed-b-tense-tick.mp3",
} as const;

/** Which bed each format gets. Exhaustive, so a new format cannot ship silent. */
const BED_FOR: Record<ReelFormat, keyof typeof BEDS> = {
  autopsy: "calm",
  "the-gap": "calm",
  "the-cash": "calm",
  "the-bill": "tense",
  "the-stress": "tense",
  "the-tax": "tense",
};

export function musicBedFor(format: ReelFormat): string {
  return BEDS[BED_FOR[format]];
}

/** Loudness target. -20 LUFS integrated, -2 dBTP, so speech-free music sits under, not over, the feed. */
export const LOUDNORM = "loudnorm=I=-20:TP=-2:LRA=7";
export const FADE_IN_S = 0.6;
export const FADE_OUT_S = 1.2;

/**
 * The audio filter chain for a video of the given length.
 *
 *   atrim      the bed is looped on input; cut it to the video's length
 *   asetpts    restart timestamps after the trim so the fade times line up
 *   loudnorm   normalise before fading, or the fade is normalised away
 *   aresample  loudnorm upsamples to 192 kHz; bring it back to 48 kHz for AAC
 *   afade x2   0.6 s in, 1.2 s out, ending exactly at the video's end
 */
export function audioFilter(seconds: number): string {
  const s = seconds.toFixed(3);
  const outStart = Math.max(0, seconds - FADE_OUT_S).toFixed(3);
  return [
    `[1:a]atrim=0:${s}`,
    "asetpts=PTS-STARTPTS",
    LOUDNORM,
    "aresample=48000",
    `afade=t=in:st=0:d=${FADE_IN_S}`,
    `afade=t=out:st=${outStart}:d=${FADE_OUT_S}[a]`,
  ].join(",");
}

/** The complete ffmpeg argument list for one Reel. */
export function renderArgs(opts: {
  framesPattern: string;
  bedPath: string;
  out: string;
  fps: number;
  seconds: number;
}): string[] {
  return [
    "-y", "-loglevel", "error",
    "-framerate", String(opts.fps),
    "-i", opts.framesPattern,
    // Loop the bed indefinitely on input; atrim cuts it to length.
    "-stream_loop", "-1",
    "-i", opts.bedPath,
    "-filter_complex", audioFilter(opts.seconds),
    "-map", "0:v",
    "-map", "[a]",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    // Flat graphics compress hard; 24 keeps text crisp at a fraction of the size.
    "-crf", "24",
    "-preset", "slow",
    "-movflags", "+faststart",
    "-r", String(opts.fps),
    "-c:a", "aac",
    "-b:a", "128k",
    // Belt and braces: even if the filter produced more audio than video,
    // the file ends with the last frame.
    "-shortest",
    opts.out,
  ];
}
