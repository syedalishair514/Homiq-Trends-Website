import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

// Initialize the Supabase client. Set up environment variables in your .env file to activate.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
