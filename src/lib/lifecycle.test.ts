import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LIFECYCLE, LIFECYCLE_LABEL, CLOSED_STAGES, NEXT_STEP,
  STAGES_PENDING_MIGRATION, STORABLE_STAGES, ALL_STAGES, STAGE_LABEL,
  isClosed, isStorable, lifecycleOf, progressOf, reachableToday,
} from "./lifecycle";
import type { DealStage } from "./property";

/**
 * The deal stages the database actually accepts, read out of the schema rather
 * than retyped. The check constraint is the authority on what can be stored,
 * and a list copied by hand here would agree with it only until someone
 * changed one of them.
 */
const schema = readFileSync(
  join(process.cwd(), "supabase", "pv-property-schema.sql"),
  "utf8",
);

const storedStages: DealStage[] = (() => {
  const block = schema.match(/stage\s+text not null default 'screening'\s*check \(stage in \(([\s\S]*?)\)\)/);
  if (!block) throw new Error("could not find the stage check constraint in pv-property-schema.sql");
  return [...block[1].matchAll(/'([a-z_]+)'/g)].map(m => m[1]) as DealStage[];
})();

describe("the schema is readable", () => {
  it("finds the stage values the database accepts", () => {
    // Without this the tests below would pass vacuously against an empty list.
    expect(storedStages.length).toBeGreaterThan(5);
    expect(storedStages).toContain("screening");
    expect(storedStages).toContain("purchased");
  });
});

describe("every stored stage has a place", () => {
  it("maps to a lifecycle stage, or is explicitly closed", () => {
    for (const stage of storedStages) {
      if (isClosed(stage)) {
        expect(lifecycleOf(stage), stage).toBeNull();
      } else {
        expect(LIFECYCLE, stage).toContain(lifecycleOf(stage));
      }
    }
  });

  it("tells the person what to do next, whatever stage they are at", () => {
    // A property sitting on a stage with no next line is a dead end in the UI.
    for (const stage of storedStages) {
      expect(NEXT_STEP[stage], stage).toBeTruthy();
      expect(NEXT_STEP[stage].length, stage).toBeGreaterThan(20);
    }
  });

  it("labels every lifecycle stage", () => {
    for (const stage of LIFECYCLE) {
      expect(LIFECYCLE_LABEL[stage], stage).toBeTruthy();
    }
  });

  it("gives every stage words a person would use", () => {
    // STAGE_LABEL is what the vault list and the stage control print. A stage
    // without one renders as an empty string, which reads as a broken row
    // rather than as a missing label.
    for (const stage of ALL_STAGES) {
      expect(STAGE_LABEL[stage], stage).toBeTruthy();
      expect(STAGE_LABEL[stage], stage).not.toContain("_");
    }
  });
});

describe("progress along the line", () => {
  it("increases, never going backwards", () => {
    const open = storedStages.filter(s => !isClosed(s));
    const values = open.map(s => progressOf(s)!);
    for (let i = 1; i < values.length; i++) {
      expect(values[i], `${open[i]} after ${open[i - 1]}`).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });

  it("stays inside 0 and 1", () => {
    for (const stage of storedStages) {
      const p = progressOf(stage);
      if (p === null) continue;
      expect(p, stage).toBeGreaterThan(0);
      expect(p, stage).toBeLessThanOrEqual(1);
    }
  });

  it("gives a closed property no position at all", () => {
    // A rejected property drawn at 20% of a progress bar is a lie about a
    // decision that has already been made.
    for (const stage of CLOSED_STAGES) {
      expect(progressOf(stage), stage).toBeNull();
    }
  });

  it("does not put a bought property at the end of the line", () => {
    // Buying it is the middle of the story, not the end. If completion reads
    // as 100% the whole premise of the lifecycle is lost.
    expect(progressOf("purchased")!).toBeLessThan(0.7);
  });
});

describe("the model runs ahead of the schema, and says so", () => {
  /**
   * The lifecycle covers ownership because the product does; the check
   * constraint stops at 'purchased' because the migration has not been run.
   * That is a deliberate gap, and this pins it so it cannot become an
   * accidental one — writing a pending stage would be rejected by Postgres at
   * runtime, which is the worst place to find out.
   */
  it("marks exactly the stages no stored deal stage maps to", () => {
    const mapped = new Set(storedStages.filter(s => !isClosed(s)).map(s => lifecycleOf(s)!));
    const unmapped = LIFECYCLE.filter(s => !mapped.has(s));
    expect([...STAGES_PENDING_MIGRATION].sort()).toEqual([...unmapped].sort());
  });

  it("reports the stages reachable today as everything else", () => {
    const today = reachableToday();
    expect(today.length + STAGES_PENDING_MIGRATION.length).toBe(LIFECYCLE.length);
    for (const s of STAGES_PENDING_MIGRATION) {
      expect(today, s).not.toContain(s);
    }
  });
});

describe("the migration and the model agree", () => {
  /**
   * supabase/pv-lifecycle.sql widens the check constraint to accept the
   * ownership stages. If it and STAGE_TO_LIFECYCLE ever disagree, the failure
   * is a runtime constraint violation on a write — the worst place to learn
   * that a stage name was spelled differently in two files.
   */
  const migration = readFileSync(join(process.cwd(), "supabase", "pv-lifecycle.sql"), "utf8");

  const migratedStages: string[] = (() => {
    const block = migration.match(/add constraint pv_property_stage_check\s*check \(stage in \(([\s\S]*?)\)\);/);
    if (!block) throw new Error("could not find the widened stage constraint in pv-lifecycle.sql");
    return [...block[1].matchAll(/'([a-z_]+)'/g)].map(m => m[1]);
  })();

  it("finds the widened constraint", () => {
    expect(migratedStages.length).toBeGreaterThan(10);
  });

  it("matches the schema file, now that it has been applied", () => {
    // Before it ran, the migration was the larger set and pv-property-schema
    // was behind. They describe the same constraint now, and a drift between
    // them would mean one of the two files is lying about the live database.
    expect([...migratedStages].sort()).toEqual([...storedStages].sort());
  });

  it("keeps every stage that is storable today", () => {
    // Dropping one would reject rows that already exist.
    for (const stage of storedStages) {
      expect(migratedStages, `${stage} is stored today but missing from the migration`).toContain(stage);
    }
  });

  it("accepts every stage the model can produce", () => {
    for (const stage of Object.keys(NEXT_STEP)) {
      expect(migratedStages, `the model knows "${stage}" but the migration would reject it`).toContain(stage);
    }
  });

  it("adds nothing the model does not understand", () => {
    // A stage the database accepts and the UI cannot label renders as blank.
    for (const stage of migratedStages) {
      expect(Object.keys(NEXT_STEP), `the database would accept "${stage}" but the model has no entry`)
        .toContain(stage);
    }
  });

  it("reaches every lifecycle stage once it has run", () => {
    const reached = new Set(
      migratedStages.filter(s => !isClosed(s as never)).map(s => lifecycleOf(s as never)),
    );
    for (const stage of LIFECYCLE) {
      expect(reached, `no stage maps to "${stage}" even after the migration`).toContain(stage);
    }
  });

  it("has been run, so nothing is pending", () => {
    // The inverse of what this asserted while the migration was outstanding.
    // Kept rather than deleted: the pending list is the mechanism for the next
    // time the model runs ahead of the schema, and an assertion that it is
    // currently empty is what makes a non-empty one deliberate.
    expect(STAGES_PENDING_MIGRATION).toEqual([]);
  });
});

describe("what the application will let you write", () => {
  /**
   * STORABLE_STAGES is the runtime guard on a stage change, and it is a
   * hand-written list because a serverless handler cannot read a .sql file.
   * That makes it exactly the kind of copy that drifts: this pins it to the
   * check constraint in both directions.
   *
   * Getting it wrong in either direction is silent. Too narrow, and a legal
   * stage becomes unreachable through the UI with no error anywhere. Too wide,
   * and the write reaches Postgres and comes back as a constraint violation
   * that reads like a bug in the caller.
   */
  it("accepts exactly the stages the database accepts", () => {
    expect([...STORABLE_STAGES].sort()).toEqual([...storedStages].sort());
  });

  it("can write every stage the model knows, now the constraint allows them", () => {
    // This asserted the opposite while the ownership stages were pending. The
    // rule underneath is unchanged — storable and stored must agree — so what
    // flipped is the state of the database, not the standard.
    for (const stage of ALL_STAGES) {
      expect(isStorable(stage), `the model knows ${stage} but will not write it`).toBe(true);
    }
  });

  it("knows a next step for every stage it will accept", () => {
    // A stage the user can select and the page cannot describe is a dead end.
    for (const stage of STORABLE_STAGES) {
      expect(NEXT_STEP[stage], stage).toBeTruthy();
    }
  });

  it("treats an unknown string as unstorable", () => {
    for (const junk of ["", "SCREENING", "purchased ", "drop table", "sold_"]) {
      expect(isStorable(junk), JSON.stringify(junk)).toBe(false);
    }
  });
});
