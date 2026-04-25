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
      <ng-container *ngIf="supabase.user$ | async as user; else login">
        <div class="dashboard">
          <header>
            <h1>Le mie Attività</h1>
            <button (click)="supabase.signOut()" class="logout-btn">Esci</button>
          </header>
          
          <div class="content">
            <p>Benvenuto, {{ user.email }}!</p>
            <!-- Qui aggiungeremo la lista dei todo -->
            <div class="placeholder-card">
              Il tuo database Supabase è pronto. Crea una tabella 'todos' per iniziare!
            </div>
          </div>
        </div>
      </ng-container>
      
      <ng-template #login>
        <app-auth></app-auth>
      </ng-template>
    </main>
  `,
  styles: [`
    .dashboard {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .logout-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .placeholder-card {
      background: #f1f5f9;
      padding: 2rem;
      border-radius: 1rem;
      border: 2px dashed #cbd5e1;
      text-align: center;
      color: #64748b;
    }
  `]
})
export class AppComponent {
  supabase = inject(SupabaseService);
}