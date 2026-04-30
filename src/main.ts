import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { supabase } from './integrations/supabase/client';

// Clear any stale Supabase auth data from localStorage
const SUPABASE_PROJECT_REF = 'xccigtseyhdmpwdlsijv';
const AUTH_STORAGE_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`;
localStorage.removeItem(AUTH_STORAGE_KEY);

// Also remove any other Supabase-related keys (optional)
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('sb-') || key.includes('supabase')) {
    localStorage.removeItem(key);
  }
});

// Ensure any invalid/expired JWT is cleared before the app boots
(async () => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error?.code === '5100') {
      await supabase.auth.signOut();
    }
  } catch (_) {
    // ignore any errors – the SupabaseService will handle session init later
  }

  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
})();