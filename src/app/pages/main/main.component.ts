import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="page">
      <header>
        <button class="back-btn" routerLink="/">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1>Area Operativa</h1>
      </header>
      <div class="content">
        <div class="empty-state">
          <p>Questa pagina è pronta per le tue funzionalità.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 20px; }
    header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
    .back-btn { background: none; border: none; cursor: pointer; padding: 5px; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .empty-state { 
      height: 60vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: #999;
      text-align: center;
    }
  `]
})
export class MainComponent {
  readonly backIcon = ArrowLeft;
}