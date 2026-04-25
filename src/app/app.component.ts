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
            <button (click)="saveExpense()">Aggiungi</button>
          </div>

          <div class="expense-list">
            <div *ngFor="let exp of expenses" class="expense-item">
              <div class="exp-info">
                <span class="exp-desc">{{ exp.description }}</span>
                <span class="exp-date">{{ exp.created_at | date:'shortDate' }}</span>
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
    
    .stats-card { background: #f97316; color: white; padding: 2rem; border-radius: 1.5rem; text-align: center; margin-bottom: 2rem; }
    .stats-card .label { opacity: 0.8; font-size: 0.9rem; }
    .stats-card .amount { font-size: 2.5rem; font-weight: 800; }

    .add-expense { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    .add-expense input { padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.75rem; outline: none; }
    .add-expense input[type="number"] { width: 100px; }
    .add-expense input[type="text"] { flex: 1; }
    .add-expense button { background: #1e293b; color: white; border: none; padding: 0 1.5rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; }

    .expense-list { display: flex; flex-direction: column; gap: 1rem; }
    .expense-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .exp-desc { display: block; font-weight: 600; color: #1e293b; }
    .exp-date { font-size: 0.8rem; color: #94a3b8; }
    .exp-amount { font-weight: 700; color: #f97316; }
  `]
})
export class AppComponent implements OnInit {
  supabase = inject(SupabaseService);
  expenses: any[] = [];
  totalAmount = 0;
  newAmount = 0;
  newDesc = '';

  ngOnInit() {
    this.supabase.user$.subscribe(user => {
      if (user) this.loadExpenses();
    });
  }

  async loadExpenses() {
    const { data } = await this.supabase.getExpenses();
    this.expenses = data || [];
    this.totalAmount = this.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }

  async saveExpense() {
    if (this.newAmount <= 0 || !this.newDesc) return;
    await this.supabase.addExpense(this.newAmount, this.newDesc);
    this.newAmount = 0;
    this.newDesc = '';
    this.loadExpenses();
  }
}