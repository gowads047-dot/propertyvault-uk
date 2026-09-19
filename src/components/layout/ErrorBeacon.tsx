"use client";

import { useEffect } from "react";
import { installErrorBeacon } from "@/lib/error-beacon";

/** Reports uncaught browser errors to /api/errors/. See lib/error-beacon.ts. */
export function ErrorBeacon() {
  useEffect(() => installErrorBeacon(), []);
  return null;
}
