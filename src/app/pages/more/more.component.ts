import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="more-page">
      <h2>Altro</h2>
    </div>
  `,
  styles: [`
    .more-page {
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: white;
    }
  `]
})
export class MoreComponent {}