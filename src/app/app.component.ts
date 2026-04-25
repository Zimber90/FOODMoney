"use client";

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from './services/supabase.service';
import { AuthComponent } from './components/auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthComponent, FormsModule],
  template: `
    <main>
      <ng-container *ngIf="supabase.user$ | async; else login">
        <div class="sandwich-container">
          <!-- Grande icona stilizzata di panino -->
          <svg class="sandwich-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10H4V10Z" />
            <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            <path d="M9 14h6" />
            <path d="M9 18h6" />
          </svg>
        </div>

        <!-- Navbar inferiore -->
        <nav class="bottom-nav">
          <a *ngFor="let item of navItems" [routerLink]="item.link" class="nav-item">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </nav>
      </ng-container>

      <ng-template #login>
        <app-auth></app-auth>
      </ng-template>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      background: #ffffff;
      display: flex;
      flex-direction: column;
    }

    .sandwich-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    .sandwich-icon {
      width: 300px;
      height: 300px;
      color: #f97316;
      filter: drop-shadow(0 10px 15px rgba(249, 115, 22, 0.2));
      transition: transform 0.3s ease;
    }

    .sandwich-icon:hover {
      transform: scale(1.05);
    }

    /* Navbar inferiore */
    .bottom-nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #ffffff;
      border-top: 1px solid #e9ecef;
      position: sticky;
      bottom: 0;
      z-index: 100;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
      color: var(--nav-text, #6c757d);
      transition: color 0.2s;
      min-width: 48px;
    }

    .nav-item .nav-icon {
      font-size: 1.35rem;
      line-height: 1;
    }

    .nav-item .nav-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-item:hover {
      color: var(--accent, #f97316);
    }

    .nav-item.active .nav-icon {
      color: var(--accent, #f97316);
    }

    .nav-item.active .nav-label {
      color: var(--accent, #f97316);
    }

    @media (max-width: 768px) {
      .sandwich-icon {
        width: 200px;
        height: 200px;
      }

      .nav-item .nav-label {
        font-size: 0.65rem;
      }
    }
  `]
})
export class AppComponent {
  supabase = inject(SupabaseService);

  navItems = [
    { icon: '🏠', label: 'Home', link: ['/'] },
    { icon: '📅', label: 'Calendario', link: ['/calendar'] },
    { icon: '📜', label: 'Storico', link: ['/history'] },
    { icon: '📊', label: 'Statistiche', link: ['/stats'] },
    { icon: '⋮', label: 'Altro', link: ['/more'] }
  ];
}