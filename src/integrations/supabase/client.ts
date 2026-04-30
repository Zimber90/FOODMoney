import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xccigtseyhdmpwdlsijv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjY2lndHNleWhkbXB3ZGxzaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjU3MzIsImV4cCI6MjA5MjcwMTczMn0.gwV43Z_AsuhpNemzs4FfWI97h4ZdQZ0vjRbN26pqVzg";

// Suppress Supabase 5100 "Invalid JWT" errors in the console
const originalConsoleError = console.error;
console.error = function (...args: any[]) {
  if (args[0] && typeof args[0] === 'object' && args[0].code === 5100) {
    return; // ignore this specific error
  }
  originalConsoleError.apply(console, args);
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    debug: false,            // no verbose auth logs
    autoRefreshToken: false, // prevent token refresh attempts that can time‑out
    persistSession: false    // avoid loading stale sessions from localStorage
  }
});