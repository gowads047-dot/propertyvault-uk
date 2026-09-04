import type { ReelSpec, ReelScene } from "./reel-calendar";

/**
 * One frame of a Reel.
 *
 * Kept separate from the generation script so it can be tested, and so the
 * design lives in one place rather than being retyped per format.
 *
 * Two things here are deliberate rather than decorative. The number counts
 * rather than appearing, because a still frame with a soundtrack is what the
 * first attempt at this was and it earned nothing. And every beat opens with a
 * short punch-in, so the frame is never completely static even mid-scene —
 * watch time is the ranking signal that matters most, and motion is what buys
 * the next second.
 */

export const FPS = 30;

/**
 * 1080x1920, and only the middle of it is actually visible.
 *
 * The canvas size was always right. What was wrong is that the frame used all
 * of it, while Instagram draws its own interface on top: a header and status
 * bar across the top, the caption, username and audio strip across the bottom,
 * and the like/comment/share rail down the right.
 *
 * Rendering a frame with that interface drawn over it showed two things sitting
 * entirely underneath it — the progress bar, and the propertyvaultuk.co.uk
 * mark. The one element whose whole job is sending people to the site was
 * invisible in every one of the thirty videos.
 *
 * These are Meta's published safe areas for a 1080x1920 Reel, with the right
 * margin set to clear the action rail rather than the nominal edge.
 */
export const WIDTH = 1080;
export const HEIGHT = 1920;
const SAFE_TOP = 260;
const SAFE_BOTTOM = 430;
const SAFE_LEFT = 72;
const SAFE_RIGHT = 200;
/** Everything must fit between the left margin and the action rail. */
const CONTENT_WIDTH = WIDTH - SAFE_LEFT - SAFE_RIGHT;

export const SAFE_AREA = {
  top: SAFE_TOP, bottom: SAFE_BOTTOM, left: SAFE_LEFT, right: SAFE_RIGHT, contentWidth: CONTENT_WIDTH,
};

const NAVY_DEEP = "#050912";
const NAVY = "#0f1b36";
const GOLD = "#f4d35e";
const WARN = "#f08a5d";
const BAD = "#ef6461";
const MUTED = "#97a5c5";
const WHITE = "#ffffff";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

function format(value: number, render: ReelScene["render"]): string {
  const r = Math.round(value);
  switch (render) {
    case "pct": return `${value.toFixed(1)}%`;
    case "int": return `${r}`;
    case "gbp-neg": return `-£${Math.abs(r).toLocaleString("en-GB")}`;
    case "gbp":
    default:
      return `${r < 0 ? "-" : ""}£${Math.abs(r).toLocaleString("en-GB")}`;
  }
}

function colourFor(tone: ReelScene["tone"]): string {
  if (tone === "bad") return BAD;
  if (tone === "warn") return WARN;
  return GOLD;
}

/** Which beat is on screen at time t, and how far through it we are. */
export function sceneAt(spec: ReelSpec, t: number): { scene: ReelScene; p: number; index: number } {
  let acc = 0;
  for (const [i, s] of spec.scenes.entries()) {
    if (t < acc + s.seconds) {
      return { scene: s, p: (t - acc) / s.seconds, index: i };
    }
    acc += s.seconds;
  }
  const last = spec.scenes[spec.scenes.length - 1];
  return { scene: last, p: 1, index: spec.scenes.length - 1 };
}

export function reelFrame(spec: ReelSpec, t: number, totalSeconds: number) {
  const { scene, p } = sceneAt(spec, t);

  // The count runs over the first 60% of the beat, so the finished number has
  // time to be read before the cut.
  const counted = scene.from + (scene.to - scene.from) * easeOutCubic(p / 0.6);
  // A punch-in over the first third of each beat.
  const scale = 1 + 0.04 * (1 - easeOutCubic(Math.min(1, p / 0.33)));
  const colour = colourFor(scene.tone);

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", width: "100%", height: "100%",
        background: `linear-gradient(165deg, ${NAVY_DEEP} 0%, ${NAVY} 50%, #1a2e5a 100%)`,
        padding: `${SAFE_TOP}px ${SAFE_RIGHT}px ${SAFE_BOTTOM}px ${SAFE_LEFT}px`,
        justifyContent: "space-between", fontFamily: "sans-serif",
      }}
    >
      {/* How far through, so a viewer knows there is an end coming */}
      <div style={{ display: "flex", width: "100%", height: "6px", background: "rgba(255,255,255,0.14)", borderRadius: "3px" }}>
        <div style={{
          display: "flex", width: `${Math.min(100, (t / totalSeconds) * 100)}%`,
          height: "6px", background: GOLD, borderRadius: "3px",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "26px", alignItems: "flex-start" }}>
        <div style={{ display: "flex", fontSize: "38px", fontWeight: 800, letterSpacing: "4px", color: MUTED }}>
          {scene.kicker}
        </div>
        <div style={{
          display: "flex", fontSize: `${Math.round(200 * scale)}px`, fontWeight: 800,
          color: colour, lineHeight: 1, letterSpacing: "-4px",
        }}>
          {format(counted, scene.render)}
        </div>
        <div style={{ display: "flex", fontSize: "44px", fontWeight: 700, color: WHITE, maxWidth: `${CONTENT_WIDTH}px`, lineHeight: 1.25 }}>
          {scene.sub}
        </div>
        {scene.foot ? (
          <div style={{ display: "flex", fontSize: "32px", color: MUTED, maxWidth: `${CONTENT_WIDTH}px`, lineHeight: 1.3 }}>
            {scene.foot}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{
          width: "58px", height: "58px", borderRadius: "14px", background: GOLD,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "32px", fontWeight: 800, color: NAVY,
        }}>P</div>
        <div style={{ display: "flex", fontSize: "30px", fontWeight: 800, color: WHITE }}>
          propertyvaultuk.co.uk
        </div>
      </div>
    </div>
  );
}
