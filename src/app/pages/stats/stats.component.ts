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
      
      <div class="expenses-list">
        <h2 class="section-title">Ordini recenti</h2>
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
    .expenses-list {
      width: 100%;
      max-width: 400px;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #9a3412;
      margin-bottom: 0.5rem;
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
    }
    .expense-restaurant {
      font-weight: 500;
      color: #333;
    }
    .expense-amount {
      font-weight: 700;
      color: #9a3412;
    }
    @media (max-width: 768px) {
      .total-spent {
        max-width: 90%;
      }
    }
  `]
})
export class StatsComponent implements OnInit {
  private supabase = inject(SupabaseService);
  loading = true;
  filteredExpenses: any[] = [];

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    try {
      const { data, error } = await this.supabase.getExpenses();
      if (error) throw error;
      this.filteredExpenses = data || [];
    } catch (err) {
      console.error('Errore caricamento spese:', err);
    } finally {
      this.loading = false;
    }
  }
}