import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* =====================================================
   SUPABASE CONFIG
   Replace with your real Supabase project URL and anon key.
   You can find them in your Supabase dashboard → Settings → API.
   ===================================================== */

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️ Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

/*
  SQL to create the leads table in Supabase:

  CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('achat', 'fournisseur', 'emploi')),
    full_name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT,
    plant_type TEXT,
    request_type TEXT,
    project_stage TEXT,
    product_service TEXT,
    position TEXT,
    experience TEXT,
    message TEXT,
    confirmation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Enable Row Level Security
  ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

  -- Allow anonymous inserts (for form submissions)
  CREATE POLICY "Allow anonymous inserts" ON leads
    FOR INSERT WITH CHECK (true);

  -- Allow authenticated reads (for admin dashboard)
  CREATE POLICY "Allow authenticated reads" ON leads
    FOR SELECT USING (true);
*/
