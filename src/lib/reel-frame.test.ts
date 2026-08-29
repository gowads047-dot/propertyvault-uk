import { describe, it, expect } from "vitest";
import { sceneAt, FPS, WIDTH, HEIGHT } from "./reel-frame";
import { CALENDAR, durationOf } from "./reel-calendar";

describe("the canvas", () => {
  it("is a vertical 1080x1920 at 30fps", () => {
    expect(WIDTH).toBe(1080);
    expect(HEIGHT).toBe(1920);
    expect(FPS).toBe(30);
  });
});

describe("picking the beat for a moment in time", () => {
  const spec = CALENDAR[0];

  it("starts on the first beat", () => {
    const { index, p } = sceneAt(spec, 0);
    expect(index).toBe(0);
    expect(p).toBe(0);
  });

  it("advances a beat exactly on the boundary, not a frame late", () => {
    const firstEnd = spec.scenes[0].seconds;
    expect(sceneAt(spec, firstEnd - 0.001).index).toBe(0);
    expect(sceneAt(spec, firstEnd).index).toBe(1);
  });

  it("walks through every beat in order across the running time", () => {
    const seen: number[] = [];
    const total = durationOf(spec);
    for (let f = 0; f < Math.round(total * FPS); f++) {
      const { index } = sceneAt(spec, f / FPS);
      if (seen[seen.length - 1] !== index) seen.push(index);
    }
    expect(seen).toEqual(spec.scenes.map((_, i) => i));
  });

  // The encoder asks for one frame past the end on some durations; returning
  // undefined there would crash the render half way through a batch.
  it("holds the last beat rather than falling off the end", () => {
    const total = durationOf(spec);
    const { index, p } = sceneAt(spec, total + 5);
    expect(index).toBe(spec.scenes.length - 1);
    expect(p).toBe(1);
  });

  it("reports progress inside the beat from zero to one", () => {
    const s0 = spec.scenes[0].seconds;
    expect(sceneAt(spec, s0 / 2).p).toBeCloseTo(0.5, 5);
  });
});

describe("every video in the calendar", () => {
  it("resolves a beat for every frame that will be rendered", () => {
    for (const spec of CALENDAR) {
      const frames = Math.round(durationOf(spec) * FPS);
      for (let f = 0; f < frames; f++) {
        const r = sceneAt(spec, f / FPS);
        expect(r.scene, `${spec.id} frame ${f}`).toBeTruthy();
        expect(r.p, `${spec.id} frame ${f}`).toBeGreaterThanOrEqual(0);
        expect(r.p, `${spec.id} frame ${f}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("renders between 300 and 600 frames each — the encoder's %04d pattern caps at 9999", () => {
    for (const spec of CALENDAR) {
      const frames = Math.round(durationOf(spec) * FPS);
      expect(frames, spec.id).toBeGreaterThanOrEqual(300);
      expect(frames, spec.id).toBeLessThanOrEqual(600);
    }
  });
});
