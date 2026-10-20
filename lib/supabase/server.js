import { createClient } from "@supabase/supabase-js";

export function createServerClient(
  url = process.env.SUPABASE_URL,
  key = process.env.SUPABASE_SECRET_KEY
) {
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createAdminClient = createServerClient;
export const createClientServer = createServerClient;
export default createServerClient;

