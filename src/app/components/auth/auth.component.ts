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
        <p>{{ isSignUp ? 'Crea un account per iniziare' : 'Bentornato! Accedi ai tuoi dati' }}</p>
        
        <form (ngSubmit)="handleAuth()">
          <div class="input-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="esempio@email.it" 
              required
            />
          </div>
          
          <div class="input-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••" 
              required
            />
          </div>

          <div *ngIf="errorMessage" class="error-msg">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="loading" class="auth-btn">
            {{ loading ? 'Elaborazione...' : (isSignUp ? 'Registrati' : 'Accedi') }}
          </button>
        </form>

        <div class="toggle-mode">
          {{ isSignUp ? 'Hai già un account?' : 'Non hai un account?' }}
          <button (click)="toggleMode()">
            {{ isSignUp ? 'Accedi' : 'Registrati ora' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #fff7ed;
      padding: 1rem;
    }
    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .logo { font-size: 3rem; margin-bottom: 1rem; }
    h1 { color: #9a3412; margin-bottom: 0.5rem; font-size: 2rem; font-weight: 800; }
    p { color: #9a3412; opacity: 0.6; margin-bottom: 2rem; font-size: 0.95rem; }
    
    .input-group { text-align: left; margin-bottom: 1.25rem; }
    .input-group label { display: block; font-size: 0.75rem; font-weight: 700; color: #9a3412; text-transform: uppercase; margin-bottom: 0.5rem; margin-left: 0.5rem; }
    
    input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #fed7aa;
      border-radius: 1rem;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
      background: #fffcf9;
    }
    input:focus { border-color: #f97316; background: white; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1); }
    
    .error-msg { color: #dc2626; background: #fef2f2; padding: 0.75rem; border-radius: 0.75rem; font-size: 0.85rem; margin-bottom: 1.25rem; border: 1px solid #fee2e2; }

    .auth-btn {
      width: 100%;
      padding: 1rem;
      background: #f97316;
      color: white;
      border: none;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }
    .auth-btn:hover { transform: translateY(-2px); background: #ea580c; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3); }
    .auth-btn:disabled { opacity: 0.5; transform: none; }

    .toggle-mode { margin-top: 2rem; font-size: 0.9rem; color: #9a3412; opacity: 0.8; }
    .toggle-mode button { background: none; border: none; color: #f97316; font-weight: 700; cursor: pointer; padding: 0 0.25rem; text-decoration: underline; }
  `]
})
export class AuthComponent {
  email = '';
  password = '';
  loading = false;
  isSignUp = false;
  errorMessage = '';

  constructor(private supabase: SupabaseService) {}

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }

  async handleAuth() {
    if (!this.email || !this.password) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const { error } = this.isSignUp 
        ? await this.supabase.signUp(this.email, this.password)
        : await this.supabase.signIn(this.email, this.password);

      if (error) {
        if (error.message === 'Invalid login credentials') {
          this.errorMessage = 'Email o password errati.';
        } else {
          this.errorMessage = error.message;
        }
      }
    } catch (error: any) {
      this.errorMessage = 'Si è verificato un errore imprevisto.';
    } finally {
      this.loading = false;
    }
  }
}