import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-page">
      <h2>Calendario</h2>
      <!-- Pagina bianca, aggiungi contenuto in futuro -->
    </div>
  `,
  styles: [`
    .calendar-page {
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: white;
    }
  `]
})
export class CalendarComponent {}