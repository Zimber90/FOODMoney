"use client";

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from './services/supabase.service';
import { AuthComponent } from './components/auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthComponent, FormsModule],
  template: `
    <main>
      <ng-container *ngIf="supabase.user$ | async as user; else login">
        <div class="dashboard">
          <header>
            <div class="brand">🍔 FoodMoney</div>
            <button (click)="supabase.signOut()" class="logout-btn">Esci</button>
          </header>
          
          <div class="stats-card">
            <div class="label">Totale Speso</div>
            <div class="amount">€ {{ totalAmount.toFixed(2) }}</div>
          </div>

          <div class="add-expense">
            <input type="number" [(ngModel)]="newAmount" placeholder="0.00" step="0.01">
            <input type="text" [(ngModel)]="newDesc" placeholder="Cosa hai mangiato?">
            <button (click)="saveExpense()" [disabled]="loading">
              {{ loading ? '...' : 'Aggiungi' }}
            </button>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <div class="expense-list">
            <div *ngIf="expenses.length === 0 && !loading" class="empty-state">
              Nessuna spesa registrata. Inizia ora!
            </div>
            <div *ngFor="let exp of expenses" class="expense-item">
              <div class="exp-info">
                <span class="exp-desc">{{ exp.description }}</span>
                <span class="exp-date">{{ exp.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="exp-amount">€ {{ exp.amount.toFixed(2) }}</div>
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
    .dashboard { max-width: 500px; margin: 0 auto; padding: 2rem; font-family: 'Inter', sans-serif; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .brand { font-weight: 800; font-size: 1.5rem; color: #f97316; }
    .logout-btn { background: none; border: none; color: #94a3b8; cursor: pointer; font-weight: 600; }
    
    .stats-card { background: #f97316; color: white; padding: 2rem; border-radius: 1.5rem; text-align: center; margin-bottom: 2rem; box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3); }
    .stats-card .label { opacity: 0.8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .stats-card .amount { font-size: 2.5rem; font-weight: 800; margin-top: 0.5rem; }

    .add-expense { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    .add-expense input { padding: 0.75rem; border: 2px solid #fed7aa; border-radius: 0.75rem; outline: none; transition: border-color 0.2s; }
    .add-expense input:focus { border-color: #f97316; }
    .add-expense input[type="number"] { width: 100px; }
    .add-expense input[type="text"] { flex: 1; }
    .add-expense button { background: #1e293b; color: white; border: none; padding: 0 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .add-expense button:hover { background: #0f172a; }
    .add-expense button:disabled { opacity: 0.5; cursor: not-allowed; }

    .error-banner { background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; font-size: 0.9rem; border: 1px solid #fecaca; }

    .expense-list { display: flex; flex-direction: column; gap: 1rem; }
    .empty-state { text-align: center; color: #94a3b8; padding: 2rem; font-style: italic; }
    .expense-item { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
    .exp-desc { display: block; font-weight: 600; color: #1e293b; font-size: 1.1rem; }
    .exp-date { font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem; display: block; }
    .exp-amount { font-weight: 800; color: #f97316; font-size: 1.1rem; }
  `]
})
export class AppComponent implements OnInit {
  supabase = inject(SupabaseService);
  expenses: any[] = [];
  totalAmount = 0;
  newAmount: number | null = null;
  newDesc = '';
  loading = false;
  errorMessage = '';

  ngOnInit() {
    this.supabase.user$.subscribe(user => {
      if (user) {
        this.loadExpenses();
      } else {
        this.expenses = [];
        this.totalAmount = 0;
      }
    });
  }

  async loadExpenses() {
    this.loading = true;
    this.errorMessage = '';
    const { data, error } = await this.supabase.getExpenses();
    
    if (error) {
      this.errorMessage = 'Errore nel caricamento dei dati. Assicurati che il database sia configurato correttamente.';
    } else {
      this.expenses = data || [];
      this.calculateTotal();
    }
    this.loading = false;
  }

  calculateTotal() {
    this.totalAmount = this.expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }

  async saveExpense() {
    if (!this.newAmount || this.newAmount <= 0 || !this.newDesc) return;
    
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.supabase.addExpense(this.newAmount, this.newDesc);
      this.newAmount = null;
      this.newDesc = '';
      await this.loadExpenses();
    } catch (error: any) {
      this.errorMessage = 'Errore nel salvataggio. Riprova tra poco.';
    } finally {
      this.loading = false;
    }
  }
}