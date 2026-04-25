import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-page">
      <h2>Storico</h2>
    </div>
  `,
  styles: [`
    .history-page {
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: white;
    }
  `]
})
export class HistoryComponent {}