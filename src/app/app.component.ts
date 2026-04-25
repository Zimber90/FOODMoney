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

          <div class="add-expense-card">
            <h3>Nuova Spesa</h3>
            <div class="form-grid">
              <div class="input-group">
                <label>Importo</label>
                <input type="number" [(ngModel)]="newAmount" placeholder="0.00" step="0.01">
              </div>
              <div class="input-group">
                <label>Categoria</label>
                <select [(ngModel)]="newCategory">
                  <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.emoji }} {{ cat.name }}</option>
                </select>
              </div>
              <div class="input-group full-width">
                <label>Descrizione</label>
                <input type="text" [(ngModel)]="newDesc" placeholder="Cosa hai mangiato?">
              </div>
            </div>
            <button (click)="saveExpense()" [disabled]="loading || !newAmount || !newDesc" class="save-btn">
              {{ loading ? 'Salvataggio...' : 'Aggiungi Spesa' }}
            </button>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <div class="expense-list">
            <div class="list-header">
              <h2>Ultime Spese</h2>
              <span>{{ expenses.length }} transazioni</span>
            </div>
            
            <div *ngIf="expenses.length === 0 && !loading" class="empty-state">
              <div class="empty-icon">🍽️</div>
              <p>Nessuna spesa registrata. Inizia ora!</p>
            </div>

            <div *ngFor="let exp of expenses" class="expense-item">
              <div class="exp-category-icon">
                {{ getCategoryEmoji(exp.category) }}
              </div>
              <div class="exp-info">
                <span class="exp-desc">{{ exp.description }}</span>
                <span class="exp-meta">{{ exp.category }} • {{ exp.created_at | date:'dd MMM, HH:mm' }}</span>
              </div>
              <div class="exp-actions">
                <div class="exp-amount">€ {{ exp.amount.toFixed(2) }}</div>
                <button (click)="deleteExpense(exp.id)" class="delete-btn" title="Elimina">
                  🗑️
                </button>
              </div>
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
    :host { --primary: #f97316; --primary-dark: #ea580c; --bg: #f8fafc; --text: #1e293b; --text-light: #64748b; }
    main { min-height: 100vh; background: var(--bg); }
    .dashboard { max-width: 600px; margin: 0 auto; padding: 2rem 1rem; font-family: 'Inter', system-ui, sans-serif; }
    
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .brand { font-weight: 800; font-size: 1.75rem; color: var(--primary); letter-spacing: -0.02em; }
    .logout-btn { background: #f1f5f9; border: none; color: var(--text-light); padding: 0.5rem 1rem; border-radius: 0.75rem; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .logout-btn:hover { background: #e2e8f0; color: var(--text); }
    
    .stats-card { background: linear-gradient(135deg, var(--primary), #fb923c); color: white; padding: 2.5rem; border-radius: 2rem; text-align: center; margin-bottom: 2rem; box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.2); }
    .stats-card .label { opacity: 0.9; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
    .stats-card .amount { font-size: 3.5rem; font-weight: 900; margin-top: 0.5rem; letter-spacing: -0.03em; }

    .add-expense-card { background: white; padding: 1.5rem; border-radius: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 2.5rem; border: 1px solid #f1f5f9; }
    .add-expense-card h3 { margin-bottom: 1.25rem; font-size: 1.1rem; color: var(--text); font-weight: 700; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
    .full-width { grid-column: span 2; }
    .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .input-group label { font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; }
    .input-group input, .input-group select { padding: 0.8rem; border: 2px solid #f1f5f9; border-radius: 0.75rem; outline: none; font-size: 1rem; transition: border-color 0.2s; background: #f8fafc; }
    .input-group input:focus, .input-group select:focus { border-color: var(--primary); background: white; }
    
    .save-btn { width: 100%; background: var(--text); color: white; border: none; padding: 1rem; border-radius: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, background 0.2s; font-size: 1rem; }
    .save-btn:hover { background: #000; transform: translateY(-2px); }
    .save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .error-banner { background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 1rem; margin-bottom: 1.5rem; font-size: 0.9rem; border: 1px solid #fecaca; text-align: center; }

    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .list-header h2 { font-size: 1.25rem; font-weight: 800; color: var(--text); }
    .list-header span { font-size: 0.875rem; color: var(--text-light); font-weight: 500; }

    .expense-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .empty-state { text-align: center; color: var(--text-light); padding: 3rem 1rem; background: white; border-radius: 1.5rem; border: 2px dashed #e2e8f0; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    
    .expense-item { display: flex; align-items: center; padding: 1rem; background: white; border-radius: 1.25rem; transition: all 0.2s; border: 1px solid #f1f5f9; }
    .expense-item:hover { transform: scale(1.01); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
    
    .exp-category-icon { width: 48px; height: 48px; background: #fff7ed; border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-right: 1rem; flex-shrink: 0; }
    .exp-info { flex: 1; }
    .exp-desc { display: block; font-weight: 700; color: var(--text); font-size: 1.05rem; }
    .exp-meta { font-size: 0.8rem; color: var(--text-light); margin-top: 0.1rem; display: block; }
    
    .exp-actions { display: flex; align-items: center; gap: 1rem; }
    .exp-amount { font-weight: 800; color: var(--primary); font-size: 1.1rem; white-space: nowrap; }
    .delete-btn { background: #fff1f2; border: none; width: 32px; height: 32px; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; opacity: 0; }
    .expense-item:hover .delete-btn { opacity: 1; }
    .delete-btn:hover { background: #ffe4e6; transform: scale(1.1); }
  `]
})
export class AppComponent implements OnInit {
  supabase = inject(SupabaseService);
  expenses: any[] = [];
  totalAmount = 0;
  
  newAmount: number | null = null;
  newDesc = '';
  newCategory = 'Spesa';
  
  loading = false;
  errorMessage = '';

  categories = [
    { name: 'Spesa', emoji: '🛒' },
    { name: 'Ristorante', emoji: '🍝' },
    { name: 'Delivery', emoji: '🛵' },
    { name: 'Bar/Caffè', emoji: '☕' },
    { name: 'Altro', emoji: '🍕' }
  ];

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

  getCategoryEmoji(categoryName: string) {
    return this.categories.find(c => c.name === categoryName)?.emoji || '🍕';
  }

  async loadExpenses() {
    this.loading = true;
    const { data, error } = await this.supabase.getExpenses();
    if (error) {
      this.errorMessage = 'Errore nel caricamento dei dati.';
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
      await this.supabase.addExpense(this.newAmount, this.newDesc, this.newCategory);
      this.newAmount = null;
      this.newDesc = '';
      await this.loadExpenses();
    } catch (error: any) {
      this.errorMessage = 'Errore nel salvataggio.';
    } finally {
      this.loading = false;
    }
  }

  async deleteExpense(id: string) {
    if (!confirm('Vuoi davvero eliminare questa spesa?')) return;
    
    try {
      await this.supabase.deleteExpense(id);
      await this.loadExpenses();
    } catch (error) {
      this.errorMessage = 'Errore durante l\'eliminazione.';
    }
  }
}