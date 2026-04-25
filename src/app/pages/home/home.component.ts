import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sandwich-container">
      <svg class="sandwich-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10H4V10Z" />
        <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        <path d="M9 14h6" />
        <path d="M9 18h6" />
      </svg>
    </div>
  `,
  styles: [`
    .sandwich-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: calc(100vh - 80px);
    }
    .sandwich-icon {
      width: 300px;
      height: 300px;
      color: #f97316;
      filter: drop-shadow(0 10px 15px rgba(249, 115, 22, 0.2));
      transition: transform 0.3s ease;
    }
    .sandwich-icon:hover { transform: scale(1.05); }
    @media (max-width: 768px) {
      .sandwich-icon { width: 200px; height: 200px; }
    }
  `]
})
export class HomeComponent {}