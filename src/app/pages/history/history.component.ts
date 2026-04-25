import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { LucidePencil, LucideTrash } from '@supabase/ui'; // Importa gli iconi Lucide

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-page">
      <h1 class="title">Storico</h1>
      
      <!-- Barra di ricerca -->
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Cerca ordini..." 
          (input)="onSearch($event)"
          class="search-input"
        >
      </div>

      <!-- Rettangolo arrotondato con sfondo colorato per la lista ordini -->
      <div class="orders-rectangle">
        <div *ngIf="filteredOrders.length === 0" class="empty-state">
          Nessun ordine trovato
        </div>

        <div *ngFor="let order of filteredOrders" class="order-item">
          <div class="order-info">
            <div class="order-date">{{ order.created_at | date:'dd/MM/yyyy' }}</div>
            <div class="order-restaurant">{{ order.description }}</div>
          </div>
          <div class="order-amount">€ {{ order.amount | number:'1.2-2' }}</div>
          
          <!-- Icone di modifica -->
          <lucide-pencil 
            class="edit-icon" 
            (click)="editOrder(order)" 
            style="margin-left: 1rem; cursor: pointer;"
          ></lucide-pencil>
          
          <!-- Icone di eliminazione -->
          <lucide-trash 
            class="delete-icon" 
            (click)="deleteOrder(order.id)" 
            style="margin-left: 1rem; cursor: pointer;"
          ></lucide-trash>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-page {
      padding: 2rem 1rem;
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

    /* Stile per il rettangolo arrotondato con lista ordini */
    .orders-rectangle {
      background-color: #fff7ed;
      border-radius: 2rem;
      padding: 1.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #fed7aa;
    }
    .order-item:last-child {
      border-bottom: none;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .order-date {
      font-size: 0.75rem;
      font-weight: 600;
      color: #9a3412;
    }

    .order-restaurant {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
    }

    .order-amount {
      font-size: 1rem;
      color: #9a3412;
      font-weight: 700;
    }

    .empty-state {
      text-align: center;
      color: #9a3412;
      opacity: 0.6;
      padding: 2rem 0;
      font-size: 0.95rem;
    }

    /* Stile per le icone */
    .edit-icon, .delete-icon {
      font-size: 1.2rem;
      color: #f97316;
      transition: color 0.2s;
    }

    .edit-icon:hover, .delete-icon:hover {
      color: #ea580c;
    }

    @media (max-width: 768px) {
      .search-container, .orders-rectangle {
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
      this.orders = response.data || [];
      this.filteredOrders = this.orders;
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    
    this.filteredOrders = this.orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const formattedDate = orderDate.toLocaleDateString('it-IT');
      
      return (
        order.description.toLowerCase().includes(query) ||
        formattedDate.includes(query)
      );
    });
  }

  // Funzione per modificare un ordine
  editOrder(order: any) {
    // Qui puoi implementare la logica per modificare l'ordine
    // Esempio: apri un form per modificare i dettagli
    console.log('Modifica ordine:', order);
  }

  // Funzione per eliminare un ordine
  deleteOrder(id: string) {
    this.supabase.deleteExpense(id).then(() => {
      // Rimuovi l'ordine dalla lista
      this.orders = this.orders.filter(o => o.id !== id);
      this.filteredOrders = [...this.orders];
    });
  }
}