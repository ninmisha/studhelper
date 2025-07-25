// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ybddjodyeiunozllcjzj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZGRqb2R5ZWl1bm96bGxjanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDkxOTYsImV4cCI6MjA2ODQ4NTE5Nn0.ajiNgeFjfSHzmp_gCuuHu02D_9G0cRoqoyjESpBiG7I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});