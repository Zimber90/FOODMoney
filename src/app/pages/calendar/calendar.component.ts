import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-page">
      <!-- Calendario SVG nella metà superiore -->
      <div class="calendar-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-24 h-24 text-green-600">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <line x1="1" y1="1" x2="23" y2="1" />
        </svg>
      </div>
      <!-- Contenuto della pagina (ancora vuoto) -->
      <div class="calendar-content">
        <h2>Calendario</h2>
        <!-- Aggiungi qui il contenuto del calendario -->
      </div>
    </div>
  `,
  styles: [`
    .calendar-page {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 80px);
      background: white;
      padding: 0;
      margin: 0;
    }

    .calendar-header {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 2rem;
    }

    .calendar-content {
      flex: 1;
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    h2 {
      margin-top: 1rem;
      color: #333;
    }

    @media (max-width: 768px) {
      .calendar-header {
        padding-top: 1rem;
      }
      .calendar-content {
        padding: 1rem;
      }
    }
  `]
})
export class CalendarComponent {}