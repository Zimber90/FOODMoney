import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-page">
      <h2>Statistiche</h2>
    </div>
  `,
  styles: [`
    .stats-page {
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: white;
    }
  `]
})
export class StatsComponent {}