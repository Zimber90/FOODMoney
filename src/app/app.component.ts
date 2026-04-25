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
        <div class="dashboard-container">
          <!-- Header -->
          <header class="dashboard-header">
            <div class="logo-container">
              <div class="logo-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10H4V10Z" />
                  <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                  <path d="M9 14h6" />
                  <path d="M9 18h6" />
                </svg>
              </div>
              <h1>FoodMoney</h1>
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.email?.split('@')[0] || 'Utente' }}</span>
              <button (click)="supabase.signOut()" class="logout-btn">Esci</button>
            </div>
          </header>

          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <span class="stat-label">Totale Speso</span>
                <span class="stat-value">€ {{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🛒</div>
              <div class="stat-info">
                <span class="stat-label">Spese Totali</span>
                <span class="stat-value">{{ expenses.length }}</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🍽️</div>
              <div class="stat-info">
                <span class="stat-label">Media per spesa</span>
                <span class="stat-value">€ {{ avgAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Add Expense Card -->
          <div class="add-expense-card">
            <div class="card-header">
              <h3>Aggiungi Nuova Spesa</h3>
            </div>
            <div class="form-grid">
              <div class="input-group">
                <label>Importo (€)</label>
                <input type="number" [(ngModel)]="newAmount" placeholder="0.00" step="0.01" (keyup.enter)="saveExpense()">
              </div>
              <div class="input-group">
                <label>Categoria</label>
                <select [(ngModel)]="newCategory">
                  <option *ngFor="let cat of categories" [value]="cat.name">
                    {{ cat.emoji }} {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="input-group full-width">
                <label>Descrizione</label>
                <input type="text" [(ngModel)]="newDesc" placeholder="Cosa hai comprato?" (keyup.enter)="saveExpense()">
              </div>
            </div>
            <button (click)="saveExpense()" [disabled]="loading || !newAmount || !newDesc" class="save-btn">
              {{ loading ? 'Aggiunta...' : 'Aggiungi Spesa' }}
            </button>
          </div>

          <!-- Error Banner -->
          <div *ngIf="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <!-- Recent Expenses -->
          <div class="expenses-section">
            <div class="section-header">
              <h3>Spese Recenti</h3>
              <span class="count">{{ expenses.length }} totali</span>
            </div>

            <div *ngIf="expenses.length === 0 && !loading" class="empty-state">
              <div class="empty-icon">🍽️</div>
              <p>Nessuna spesa registrata oggi</p>
              <p class="empty-sub">Aggiungi la tua prima spesa per iniziare</p>
            </div>

            <div class="expenses-list">
              <div *ngFor="let exp of expenses" class="expense-item">
                <div class="exp-icon" [style.background]="getCategoryColor(exp.category)">
                  {{ getCategoryEmoji(exp.category) }}
                </div>
                <div class="exp-details">
                  <span class="exp-title">{{ exp.description }}</span>
                  <span class="exp-meta">{{ exp.category }} • {{ exp.created_at | date:'dd/MM HH:mm' }}</span>
                </div>
                <div class="exp-right">
                  <span class="exp-amount">€ {{ exp.amount.toFixed(2) }}</span>
                  <button (click)="deleteExpense(exp.id)" class="delete-btn" title="Elimina">🗑️</button>
                </div>
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
    :host {
      --bg-white: #ffffff;
      --bg-card: #f8f9fa;
      --border: #e9ecef;
      --text: #212529;
      --text-muted: #6c757d;
      --accent: #f97316;
      --accent-hover: #ea580c;
      --positive: #10b981;
      --danger: #ef4444;
    }

    main {
      min-height: 100vh;
      background: var(--bg-white);
      color: var(--text);
      font-family: 'Inter', system-ui, sans-serif;
    }

    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid var(--border);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-icon {
      color: var(--accent);
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-name {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .logout-btn {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.2s;
    }

    .stat-card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      background: white;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      display: block;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text);
      line-height: 1.1;
    }

    /* Add Expense Card */
    .add-expense-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
    }

    .card-header {
      margin-bottom: 2rem;
    }

    .card-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .full-width {
      grid-column: span 3;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .input-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-group input,
    .input-group select {
      padding: 1rem 1.25rem;
      background: white;
      border: 2px solid var(--border);
      border-radius: 1rem;
      color: var(--text);
      font-size: 1.1rem;
      outline: none;
      transition: all 0.2s;
    }

    .input-group input:focus,
    .input-group select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
    }

    .save-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.25rem;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .save-btn:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3);
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Error Banner */
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #dc2626;
      padding: 1.25rem;
      border-radius: 1rem;
      margin-bottom: 2.5rem;
      text-align: center;
      font-weight: 600;
    }

    /* Expenses Section */
    .expenses-section {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-bottom: 1px solid var(--border);
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }

    .count {
      font-size: 0.9rem;
      color: var(--text-muted);
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      border: 1px solid var(--border);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-sub {
      font-size: 1rem;
      margin-top: 1rem;
      opacity: 0.7;
    }

    .expenses-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .expense-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border);
      transition: all 0.2s;
    }

    .expense-item:hover {
      background: white;
    }

    .expense-item:last-child {
      border-bottom: none;
    }

    .exp-icon {
      width: 56px;
      height: 56px;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .exp-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .exp-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text);
    }

    .exp-meta {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .exp-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .exp-amount {
      font-weight: 800;
      font-size: 1.25rem;
      color: var(--text);
    }

    .delete-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.75rem;
      border-radius: 0.75rem;
      transition: all 0.2s;
      opacity: 0;
      font-size: 1.25rem;
    }

    .expense-item:hover .delete-btn {
      opacity: 1;
    }

    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
    }

    /* Scrollbar */
    .expenses-list::-webkit-scrollbar {
      width: 8px;
    }

    .expenses-list::-webkit-scrollbar-track {
      background: var(--bg-card);
    }

    .expenses-list::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .dashboard-header {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .full-width {
        grid-column: span 1;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  supabase = inject(SupabaseService);
  expenses: any[] = [];
  totalAmount = 0;
  monthlyChange = 12.5;
  avgAmount = 0;
  
  newAmount: number | null = null;
  newDesc = '';
  newCategory = 'Spesa';
  
  loading = false;
  errorMessage = '';
  
  today = new Date().toLocaleDateString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  categories = [
    { name: 'Spesa', emoji: '🛒' },
    { name: 'Ristorante', emoji: '🍝' },
    { name: 'Delivery', emoji: '🛵' },
    { name: 'Bar/Caffè', emoji: '☕' },
    { name: 'Altro', emoji: '🍕' }
  ];

  categoryColors: { [key: string]: string } = {
    'Spesa': '#f59e0b',
    'Ristorante': '#ef4444',
    'Delivery': '#8b5cf6',
    'Bar/Caffè': '#06b6d4',
    'Altro': '#6b7280'
  };

  ngOnInit() {
    this.supabase.user$.subscribe(user => {
      if (user) {
        this.loadExpenses();
      } else {
        this.expenses = [];
        this.totalAmount = 0;
        this.avgAmount = 0;
      }
    });
  }

  getCategoryEmoji(categoryName: string) {
    return this.categories.find(c => c.name === categoryName)?.emoji || '🍕';
  }

  getCategoryColor(categoryName: string) {
    const color = this.categoryColors[categoryName];
    return color ? `${color}20` : '#333333';
  }

  async loadExpenses() {
    this.loading = true;
    const { data, error } = await this.supabase.getExpenses();
    if (error) {
      this.errorMessage = 'Errore nel caricamento dei dati.';
    } else {
      this.expenses = data || [];
      this.calculateStats();
    }
    this.loading = false;
  }

  calculateStats() {
    this.totalAmount = this.expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    this.avgAmount = this.expenses.length > 0 ? this.totalAmount / this.expenses.length : 0;
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