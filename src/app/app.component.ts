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
      <div *ngIf="!supabase.isConfigured" class="setup-warning">
        <div class="warning-card">
          <h2>Configurazione Richiesta</h2>
          <p>Per far funzionare l'app, clicca sul pulsante <strong>"Add Supabase"</strong> sopra la chat per collegare il tuo database.</p>
        </div>
      </div>

      <ng-container *ngIf="supabase.isConfigured">
        <ng-container *ngIf="supabase.user$ | async as user; else login">
          <div class="dashboard">
            <header>
              <h1>Le mie Attività</h1>
              <button (click)="supabase.signOut()" class="logout-btn">Esci</button>
            </header>
            
            <div class="content">
              <p>Benvenuto, <strong>{{ user.email }}</strong>!</p>
              <div class="placeholder-card">
                <h3>Database Pronto</h3>
                <p>Ora puoi creare una tabella chiamata <code>todos</code> su Supabase con le colonne <code>task</code> (text) e <code>user_id</code> (uuid).</p>
              </div>
            </div>
          </div>
        </ng-container>
        
        <ng-template #login>
          <app-auth></app-auth>
        </ng-template>
      </ng-container>
    </main>
  `,
  styles: [`
    .setup-warning {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #fff1f2;
      padding: 1rem;
    }
    .warning-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      text-align: center;
      border: 2px solid #f43f5e;
    }
    .warning-card h2 { color: #9f1239; margin-bottom: 1rem; }
    .dashboard { max-width: 800px; margin: 0 auto; padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .logout-btn { padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; }
    .placeholder-card { background: #f1f5f9; padding: 2rem; border-radius: 1rem; border: 2px dashed #cbd5e1; text-align: center; color: #64748b; margin-top: 2rem; }
    .placeholder-card h3 { color: #1e293b; margin-bottom: 0.5rem; }
  `]
})
export class AppComponent {
  supabase = inject(SupabaseService);
}