"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records utm_* / click ids from the URL so every form can carry them. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
