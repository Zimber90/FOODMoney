import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { LucideAngularModule, Plus, Trash2, ShieldCheck, WifiOff } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(LucideAngularModule.pick({ Plus, Trash2, ShieldCheck, WifiOff }))
  ]
};