"use client";

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from './services/supabase.service';
import { AuthComponent } from './components/auth/auth.component';
import { 
  Home, 
  Wallet, 
  Settings, 
  TrendingUp, 
  ShoppingCart, 
  Utensils, 
  Coffee, 
  MoreVertical,
  Trash2,
  Plus
} from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthComponent, FormsModule, Home, Wallet, Settings, TrendingUp, ShoppingCart, Utensils, Coffee, MoreVertical, Trash2, Plus],
  template: `
    <main>
      <ng-container *ngIf="supabase.user$ | async as user; else login">
        <div class="app-shell">
          <!-- Sidebar -->
          <aside class="sidebar">
            <div class="sidebar-header">
              <div class="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1>FoodMoney</h1>
            </div>
            
            <nav class="sidebar-nav">
              <a href="#" class="nav-item active">
                <app-home [size]="20"></app-home>
                <span>Dashboard</span>
              </a>
              <a href="#" class="nav-item">
                <app-wallet [size]="20"></app-wallet>
                <span>Transazioni</span>
              </a>
              <a href="#" class="nav-item">
                <app-trending-up [size]="20"></app-trending-up>
                <span>Statistiche</span>
              </a>
              <a href="#" class="nav-item">
                <app-settings [size]="20"></app-settings>
                <span>Impostazioni</span>
              </a>
            </nav>

            <div class="sidebar-footer">
              <div class="user-profile">
                <div class="avatar">{{ user.email?.charAt(0).toUpperCase() || 'U' }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.email?.split('@')[0] || 'Utente' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
                <button (click)="supabase.signOut()" class="logout-btn" title="Esci">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main Content -->
          <div class="main-content">
            <!-- Header -->
            <header class="content-header">
              <div>
                <h2>Dashboard</h2>
                <p>Gestisci le tue spese in modo intelligente</p>
              </div>
              <div class="header-actions">
                <span class="date-display">{{ today }}</span>
              </div>
            </header>

            <!-- Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card primary">
                <div class="stat-icon">
                  <app-wallet [size]="24"></app-wallet>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Totale Speso</span>
                  <span class="stat-value">€ {{ totalAmount.toFixed(2) }}</span>
                </div>
                <div class="stat-trend positive">
                  <app-trending-up [size]="16"></app-trending-up>
                  <span>{{ monthlyChange }}%</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <app-shopping-cart [size]="24"></app-shopping-cart>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Spese Totali</span>
                  <span class="stat-value">{{ expenses.length }}</span>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <app-utensils [size]="24"></app-utensils>
                </div>
                <div class="stat-info">
                  <span class="stat-label">Media per spesa</span>
                  <span class="stat-value">€ {{ avgAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Add Expense Card -->
            <div class="add-expense-card">
              <div class="card-header">
                <h3><app-plus [size]="20"></app-plus> Nuova Spesa</h3>
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
                <app-plus [size]="18"></app-plus>
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
                    <button (click)="deleteExpense(exp.id)" class="delete-btn" title="Elimina">
                      <app-trash2 [size]="16"></app-trash2>
                    </button>
                  </div>
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
      --bg-dark: #0a0a0f;
      --bg-card: #141419;
      --bg-elevated: #1a1a24;
      --border: #2a2a3a;
      --text: #f0f0f0;
      --text-muted: #8a8a9a;
      --accent: #f97316;
      --accent-hover: #ea580c;
      --positive: #10b981;
      --danger: #ef4444;
    }

    main {
      min-height: 100vh;
      background: var(--bg-dark);
      color: var(--text);
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* App Shell Layout */
    .app-shell {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: var(--bg-card);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    .logo-icon {
      color: var(--accent);
    }

    .sidebar-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 0.75rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.2s;
      font-weight: 500;
    }

    .nav-item:hover {
      background: var(--bg-elevated);
      color: var(--text);
    }

    .nav-item.active {
      background: var(--accent);
      color: white;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent), #fb923c);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .user-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-email {
      font-size: 0.8rem;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .logout-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: var(--bg-elevated);
      color: var(--danger);
    }

    /* Main Content */
    .main-content {
      margin-left: 260px;
      padding: 2rem;
      width: calc(100% - 260px);
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .content-header h2 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }

    .content-header p {
      color: var(--text-muted);
    }

    .date-display {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.2s;
    }

    .stat-card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }

    .stat-card.primary {
      background: linear-gradient(135deg, var(--accent), #fb923c);
      border-color: var(--accent);
    }

    .stat-card.primary .stat-label,
    .stat-card.primary .stat-icon {
      color: rgba(255,255,255,0.8);
    }

    .stat-card.primary .stat-value {
      color: white;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: var(--bg-elevated);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      display: block;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .stat-trend.positive { color: var(--positive); }
    .stat-trend.negative { color: var(--danger); }

    /* Add Expense Card */
    .add-expense-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .card-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .full-width {
      grid-column: span 3;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-group input,
    .input-group select {
      padding: 0.875rem 1rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      color: var(--text);
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
    }

    .input-group input:focus,
    .input-group select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }

    .save-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .save-btn:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Error Banner */
    .error-banner {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 1rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    /* Expenses Section */
    .expenses-section {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    .section-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .count {
      font-size: 0.85rem;
      color: var(--text-muted);
      background: var(--bg-elevated);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-sub {
      font-size: 0.9rem;
      margin-top: 0.5rem;
      opacity: 0.6;
    }

    .expenses-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .expense-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      transition: all 0.2s;
    }

    .expense-item:hover {
      background: var(--bg-elevated);
    }

    .expense-item:last-child {
      border-bottom: none;
    }

    .exp-icon {
      width: 44px;
      height: 44px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .exp-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .exp-title {
      font-weight: 600;
      color: var(--text);
    }

    .exp-meta {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .exp-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .exp-amount {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text);
    }

    .delete-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      opacity: 0;
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
      width: 6px;
    }

    .expenses-list::-webkit-scrollbar-track {
      background: var(--bg-dark);
    }

    .expenses-list::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
        width: 100%;
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
  monthlyChange = 12.5; // Dato fittizio per il trend
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