import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { AuthComponent } from './components/auth/auth.component';
import { Home, Calendar, ScrollText, BarChart, MoreHorizontal } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthComponent, RouterModule, Home, Calendar, ScrollText, BarChart, MoreHorizontal],
  template: `
    <main>
      <ng-container *ngIf="supabase.user$ | async; else login">
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
        <nav class="bottom-nav">
          <a *ngFor="let item of navItems" [routerLink]="item.link" class="nav-item">
            <span class="nav-icon">
              <lucide-home *ngIf="item.link === '/'" size="22"></lucide-home>
              <lucide-calendar *ngIf="item.link === '/calendar'" size="22"></lucide-calendar>
              <lucide-scroll-text *ngIf="item.link === '/history'" size="22"></lucide-scroll-text>
              <lucide-bar-chart *ngIf="item.link === '/stats'" size="22"></lucide-bar-chart>
              <lucide-more-horizontal *ngIf="item.link === '/more'" size="22"></lucide-more-horizontal>
            </span>
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
    .page-content {
      flex: 1;
      padding-bottom: 80px;
    }
    .bottom-nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #ffffff;
      border-top: 1px solid #e9ecef;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
      color: #6c757d;
      transition: color 0.2s;
      min-width: 48px;
    }
    .nav-icon {
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-item:hover { color: #f97316; }
    @media (max-width: 768px) {
      .nav-label { font-size: 0.65rem; }
    }
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