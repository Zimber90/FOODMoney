import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { supabase } from './integrations/supabase/client';

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