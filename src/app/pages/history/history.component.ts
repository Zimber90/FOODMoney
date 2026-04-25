import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-page">
      <h1 class="title">Storico</h1>
      
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Cerca ordini..." 
          (input)="onSearch($event)"
          class="search-input"
        >
      </div>
    </div>
  `,
  styles: [`
    .history-page {
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      color: #9a3412;
      margin-bottom: 2rem;
    }

    .search-container {
      width: 100%;
      max-width: 400px;
      margin-bottom: 2rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #f97316;
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

    @media (max-width: 768px) {
      .search-container {
        width: 90%;
      }
    }
  `]
})
export class HistoryComponent {
  private supabase = inject(SupabaseService);
  orders: any[] = [];
  filteredOrders: any[] = [];

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.supabase.getExpenses().then(response => {
      this.orders = response.data;
      this.filteredOrders = this.orders;
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    this.filteredOrders = this.orders.filter(order => 
      order.ristorante.toLowerCase().includes(query.toLowerCase()) ||
      order.date.toLowerCase().includes(query.toLowerCase())
    );
  }
}