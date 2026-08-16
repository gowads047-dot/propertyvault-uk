import { createClient } from "@supabase/supabase-js";

// Strip BOM (U+FEFF) that PowerShell piping can inject into NEXT_PUBLIC_ env var values
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co").replace(/^\uFEFF/, "");
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder").replace(/^\uFEFF/, "");

export const supabase = createClient(supabaseUrl, supabaseKey);