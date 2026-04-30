import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { AuthComponent } from './components/auth/auth.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthComponent],
  animations: [
    trigger('routeTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
  template: `
    <div @routeTransition>
      <ng-container *ngIf="supabase.user$ | async; else login">
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
        <nav class="bottom-nav">
          <a *ngFor="let item of navItems" [routerLink]="item.link" class="nav-item">
            <span class="nav-icon">
              <!-- Home icon -->
              <svg *ngIf="item.link === '/'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>

              <!-- Calendar icon -->
              <svg *ngIf="item.link === '/calendar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>

              <!-- History icon -->
              <svg *ngIf="item.link === '/history'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>

              <!-- Stats icon -->
              <svg *ngIf="item.link === '/stats'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>

              <!-- More icon -->
              <svg *ngIf="item.link === '/more'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </nav>
      </ng-container>
      <ng-template #login>
        <app-auth></app-auth>
      </ng-template>
    </div>
  `,
  styles: [`
    main { min-height: 100vh; background: #ffffff; display: flex; flex-direction: column; }
    .page-content { flex: 1; padding-bottom: 80px; }
    .bottom-nav {
      display: flex; justify-content: space-around; align-items: center;
      padding: 0.75rem 1rem; background: #ffffff; border-top: 1px solid #e9ecef;
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
    }
    .nav-item {
      display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
      text-decoration: none; color: #6c757d; transition: color 0.2s; min-width: 48px;
    }
    .nav-icon { line-height: 1; display: flex; align-items: center; justify-content: center; }
    .nav-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .nav-item:hover { color: #f97316; }
    @media (max-width: 768px) { .nav-label { font-size: 0.65rem; } }
  `]
})
export class AppComponent {
  supabase = inject(SupabaseService);
  navItems = [
    { label: 'Home', link: '/' },
    { label: 'Calendario', link: '/calendar' },
    { label: 'Storico', link: '/history' },
    { label: 'Statistiche', link: '/stats' },
    { label: 'Altro', link: '/more' }
  ];
}