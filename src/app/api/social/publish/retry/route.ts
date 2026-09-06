/**
 * The 18:40 retry slot.
 *
 * Same handler as /api/social/publish under a second path, because a cron
 * entry is a path and a schedule and two schedules for one path is not a
 * shape worth relying on. The publisher finds the day already published and
 * returns without touching Meta when the first run worked.
 */
export { GET, maxDuration } from "../route";
