import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="page">
      <header>
        <button class="back-btn" routerLink="/">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1>Impostazioni</h1>
      </header>
      <div class="content">
        <p>Configura la tua app qui.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
    .back-btn { background: none; border: none; cursor: pointer; padding: 5px; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .content { color: #666; }
  `]
})
export class SettingsComponent {
  readonly backIcon = ArrowLeft;
}