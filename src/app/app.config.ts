import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LucideAngularModule, Settings, Sandwich, ArrowLeft, ChevronLeft, ChevronRight, Info, ShieldCheck, Code2, Menu, X } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ Settings, Sandwich, ArrowLeft, ChevronLeft, ChevronRight, Info, ShieldCheck, Code2, Menu, X })
    )
  ]
};