import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stats-page">
      <h1 class="page-title">Statistiche</h1>
      
      <div class="total-spent">
        <p>Spesa totale: <strong>€ {{ totalSpent | number:'1.2-2' }}</strong></p>
      </div>
      
      <div class="search-container">
        <input          type="text"
          placeholder="Cerca ristorante..."
          (input)="onSearch($event)"
          class="search-input"
        />
      </div>
      
      <div class="orders-header">
        <h2 class="section-title">Ordini recenti</h2>
        <div class="filter-container">
          <!-- Icona a 3 linee (come da allegato) -->
          <span class="filter-icon" (click)="dropdownOpen = !dropdownOpen;" title="Ordina per data">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#9a3412" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </span>
          
          <!-- Menu a discesa filtri -->
          <div class="filter-dropdown" *ngIf="dropdownOpen">
            <div 
              class="dropdown-item" 
              [class.active]="sortOption === 'newest'"
              (click)="setSortOption('newest')"
            >
              Più recenti
            </div>
            <div 
              class="dropdown-item" 
              [class.active]="sortOption === 'oldest'"
              (click)="setSortOption('oldest')"
            >
              Più vecchi
            </div>
            <div 
              class="dropdown-item" 
              [class.active]="sortOption === 'current_month'"
              (click)="setSortOption('current_month')"
            >
              Mese corrente
            </div>
            <div 
              class="dropdown-item" 
              [class.active]="sortOption === 'previous_month'"
              (click)="setSortOption('previous_month')"
            >
              Mese scorso
            </div>
          </div>
        </div>
      </div>
      
      <div class="expenses-list">
        <div *ngIf="filteredExpenses.length === 0" class="empty-state">
          Nessun ordine trovato
        </div>
        <div *ngFor="let expense of filteredExpenses" class="expense-item">
          <span class="expense-date">{{ expense.created_at | date:'dd/MM' }}</span>
          <span class="expense-restaurant">{{ expense.description }}</span>
          <span class="expense-amount">€ {{ expense.amount | number:'1.2-2' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      padding: 2rem 1rem;
      min-height: calc(100vh - 80px);
      background: #fff7ed;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .page-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      color: #9a3412;
      margin-bottom: 1.5rem;
    }
        .total-spent {
      background: white;
      padding: 1rem 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
      margin-bottom: 2rem;
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
        .total-spent strong {
      color: #f97316;
    }
    
    .search-container {
      width: 100%;
      max-width: 400px;
      margin-bottom: 1.5rem;
    }
    
    .search-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #fed7aa;
      border-radius: 1rem;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
      background: #fffcf9;
    }
    
    .search-input:focus {
      border-color: #f97316;
      background: white;
      box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
    }
    
    .orders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 400px;
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #9a3412;
      margin: 0;
    }
    
    .filter-container {
      position: relative;
    }
    
    .filter-icon {
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      border-radius: 0.5rem;
      transition: background 0.2s;
    }
    
    .filter-icon:hover {
      background: #fed7aa;
    }
    
    .filter-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10;
      min-width: 140px;
      overflow: hidden;
      border: 1px solid #fed7aa;
    }
        .dropdown-item {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      color: #333;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .dropdown-item:hover {
      background: #fff7ed;
    }
    
    .dropdown-item.active {
      color: #f97316;
      font-weight: 600;
      background: #fff7ed;
    }
    
    .expenses-list {
      width: 100%;
      max-width: 400px;
    }
    
    .expense-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #fed7aa;
    }
    
    .expense-item:last-child {
      border-bottom: none;
    }
    
    .expense-date {
      font-size: 0.85rem;
      color: #666;
      min-width: 40px;
    }
    
    .expense-restaurant {
      font-weight: 500;
      color: #333;
      flex: 1;
      margin: 0 1rem;
    }
    
    .expense-amount {
      font-weight: 700;
      color: #9a3412;
      min-width: 60px;
      text-align: right;
    }
    
    .empty-state {
      text-align: center;
      color: #9a3412;
      opacity: 0.6;
      padding: 2rem 0;
      font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
      .total-spent,
      .search-container,
      .expenses-list,
      .orders-header {
        max-width: 90%;
      }
    }
  `]
})
export class StatsComponent implements OnInit {
  private supabase = inject(SupabaseService);
  filteredExpenses: any[] = [];
  totalSpent = 0;
  allExpenses: any[] = [];
  sortOption: 'newest' | 'oldest' | 'current_month' | 'previous_month' = 'newest';
  dropdownOpen = false;

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    try {
      const { data, error } = await this.supabase.getExpenses();
      if (error) throw error;
      this.allExpenses = data || [];
      this.sortExpenses();
    } catch (err) {
      console.error('Errore caricamento spese:', err);
    }
  }

  calculateTotalSpent() {
    this.totalSpent = this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  sortExpenses() {
    // Clone expenses to avoid mutating original array
    let expensesToSort = [...this.allExpenses];
        // Apply month-based filtering if needed
    if (this.sortOption === 'current_month' || this.sortOption === 'previous_month') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Determine target month/year
      let targetMonth, targetYear;
      if (this.sortOption === 'current_month') {
        targetMonth = currentMonth;
        targetYear = currentYear;
      } else { // previous_month
        targetMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January -> December
        targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      }
      
      // Filter expenses to only those in the target month/year
      expensesToSort = expensesToSort.filter(exp => {
        const expDate = new Date(exp.created_at);
        return expDate.getMonth() === targetMonth && expDate.getFullYear() === targetYear;
      });
    }
    
    // Apply sorting
    expensesToSort.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      switch (this.sortOption) {
        case 'newest':
          return dateB.getTime() - dateA.getTime();
        case 'oldest':
          return dateA.getTime() - dateB.getTime();
        case 'current_month':
        case 'previous_month':
          // For month filters, sort newest first          return dateB.getTime() - dateA.getTime();
        default:
          return 0;
      }
    });
    
    this.filteredExpenses = expensesToSort;
    this.calculateTotalSpent();
  }

  setSortOption(option: 'newest' | 'oldest' | 'current_month' | 'previous_month') {
    this.sortOption = option;
    this.dropdownOpen = false; // Close dropdown
    this.sortExpenses();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredExpenses = this.allExpenses.filter(exp => 
      exp.description.toLowerCase().includes(query)
    );
    this.sortExpenses();
  }
}