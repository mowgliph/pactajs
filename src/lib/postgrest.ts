import { PostgrestClient } from "@supabase/postgrest-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL environment variable is required");
}

if (!SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_ANON_KEY environment variable is required");
}

export function createPostgrestClient(token?: string) {
  const url = `${SUPABASE_URL}/rest/v1`;
  const client = new PostgrestClient(url);

  client.headers.set("Content-Type", "application/json");
  client.headers.set("apikey", SUPABASE_ANON_KEY!);

  if (token) {
    client.headers.set("Authorization", `Bearer ${token}`);
  }

  return client;
}
