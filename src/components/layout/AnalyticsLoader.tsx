"use client";

import { useEffect } from "react";
import { loadGtagIfConsented } from "@/lib/analytics";

/** Loads Google Analytics for a visitor who has already accepted cookies. */
export function AnalyticsLoader() {
  useEffect(() => {
    loadGtagIfConsented();
  }, []);
  return null;
}
