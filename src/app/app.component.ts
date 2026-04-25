"use client";

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './services/supabase.service';
import { AuthComponent } from './components/auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthComponent],
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
    }

    .sandwich-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
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

    @media (max-width: 768px) {
      .sandwich-icon {
        width: 200px;
        height: 200px;
      }
    }
  `]
})
export class AppComponent {
  supabase = inject(SupabaseService);
}