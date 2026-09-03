"use client";

import { supabase } from "@/lib/supabase";

/**
 * fetch, with proof of who is asking.
 *
 * The pages that need a signed-in identity were telling the server who they
 * were in a query string — `?userId=…`, `?landlordId=…` — which the server
 * then believed. An identifier is not a credential: anyone holding somebody
 * else's user id could ask for their records.
 *
 * The session lives in localStorage, because this app signs in with
 * supabase-js rather than the cookie-based SSR client, so there is nothing for
 * the server to read unless the client sends it. This attaches the access
 * token, which the server verifies with the auth server before trusting a
 * single field of it.
 */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}
