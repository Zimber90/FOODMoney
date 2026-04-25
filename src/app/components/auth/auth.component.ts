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
        <div class="logo">🍔💰</div>
        <h1>FoodMoney</h1>
        <p>Tieni traccia di quanto spendi per mangiare.</p>
        <form (ngSubmit)="handleLogin()">
          <input 
            type="email" 
            [(ngModel)]="email" 
            name="email" 
            placeholder="La tua email" 
            required
          />
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Invio...' : 'Accedi con Magic Link' }}
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
      background: #fff7ed;
    }
    .auth-card {
      background: white;
      padding: 3rem;
      border-radius: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .logo { font-size: 3rem; margin-bottom: 1rem; }
    h1 { color: #9a3412; margin-bottom: 0.5rem; font-size: 2rem; }
    p { color: #9a3412; opacity: 0.7; margin-bottom: 2rem; }
    input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #fed7aa;
      border-radius: 1rem;
      margin-bottom: 1rem;
      font-size: 1rem;
      outline: none;
    }
    input:focus { border-color: #f97316; }
    button {
      width: 100%;
      padding: 1rem;
      background: #f97316;
      color: white;
      border: none;
      border-radius: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover { transform: translateY(-2px); background: #ea580c; }
    button:disabled { opacity: 0.5; }
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
      alert('Controlla la tua email!');
    } catch (error) {
      alert('Errore!');
    } finally {
      this.loading = false;
    }
  }
}