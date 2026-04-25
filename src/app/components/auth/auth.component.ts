import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Benvenuto</h1>
        <p>Inserisci la tua email per accedere con un Magic Link</p>
        <form (ngSubmit)="handleLogin()">
          <input 
            type="email" 
            [(ngModel)]="email" 
            name="email" 
            placeholder="tua@email.it" 
            required
          />
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Invio in corso...' : 'Invia Magic Link' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f8fafc;
    }
    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    h1 { color: #1e293b; margin-bottom: 0.5rem; }
    p { color: #64748b; margin-bottom: 2rem; }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #2563eb; }
    button:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class AuthComponent {
  email = '';
  loading = false;

  constructor(private supabase: SupabaseService) {}

  async handleLogin() {
    this.loading = true;
    try {
      await this.supabase.signIn(this.email);
      alert('Controlla la tua email per il link di accesso!');
    } catch (error) {
      alert('Errore durante l\'invio del link');
    } finally {
      this.loading = false;
    }
  }
}