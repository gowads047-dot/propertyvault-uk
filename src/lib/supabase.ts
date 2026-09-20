import { createClient } from "@supabase/supabase-js";
import { reportingFetch } from "@/lib/supabase-fetch";

// Strip BOM (U+FEFF) that PowerShell piping can inject into NEXT_PUBLIC_ env var values
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co").replace(/^\uFEFF/, "");
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder").replace(/^\uFEFF/, "");

// Every response goes through reportingFetch: a refused query is reported
// to /api/errors/ rather than returned as a value nobody reads.
export const supabase = createClient(supabaseUrl, supabaseKey, { global: { fetch: reportingFetch } });
