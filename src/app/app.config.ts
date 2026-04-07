import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { LucideAngularModule, Settings, Sandwich, ArrowLeft, ChevronLeft, ChevronRight, Info, ShieldCheck, Code2, Menu, X, History, BarChart3, TrendingUp, Wallet, Search, Calendar, Filter } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        Settings, Sandwich, ArrowLeft, ChevronLeft, ChevronRight, 
        Info, ShieldCheck, Code2, Menu, X, History, 
        BarChart3, TrendingUp, Wallet, Search, Calendar, Filter
      })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};