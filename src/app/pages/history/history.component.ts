import { Component, inject, OnInit } from '@angular/core';
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
        />
      </div>

      <div class="orders-rectangle">
        <div *ngIf="filteredOrders.length === 0" class="empty-state">
          Nessun ordine trovato
        </div>

        <div *ngFor="let order of filteredOrders" class="order-item">
          <div class="order-info">
            <div class="order-date">{{ order.created_at | date:'dd/MM/yyyy' }}</div>
            <div class="order-restaurant">
              <span class="color-swatch" [style.background-color]="order.restaurant_color"></span>
              {{ order.description }}
            </div>
          </div>
          <div class="order-amount">€ {{ order.amount | number:'1.2-2' }}</div>

          <span class="edit-icon" (click)="openEditPopup(order)" title="Modifica ordine">
            ✏️
          </span>

          <span class="delete-icon" (click)="deleteOrder(order.id)" title="Elimina ordine">
            🗑️
          </span>
        </div>
      </div>

      <div *ngIf="isEditPopupOpen" class="popup-overlay" (click)="closeEditPopup()">
        <div class="popup-modal" (click)="$event.stopPropagation()">
          <h2 class="popup-title">Modifica Ordine</h2>

          <form (ngSubmit)="saveEditedOrder()" #editFormRef="ngForm">
            <div class="form-group">
              <label for="edit-ristorante">Ristorante</label>
              <select
                id="edit-ristorante"
                name="ristorante"
                [(ngModel)]="editForm.restaurantId"
                required
                class="form-input"
                (change)="onEditRestaurantSelect()"
              >
                <option value="" disabled>Scegli un ristorante</option>
                @for (restaurant of restaurants; track restaurant.id) {
                  <option [value]="restaurant.id">
                    {{ restaurant.name }}
                  </option>
                }
              </select>
              @if (editSelectedRestaurantColor) {
                <div class="selected-color">
                  <span class="color-swatch" [style.background-color]="editSelectedRestaurantColor"></span>
                  <span>Colore: {{ editSelectedRestaurantColor }}</span>
                </div>
              }
            </div>

            <div class="form-group">
              <label for="edit-data">Data</label>
              <input
                type="date"
                id="edit-data"
                name="data"
                [(ngModel)]="editForm.data"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="edit-importo">Importo</label>
              <input
                type="number"
                id="edit-importo"
                name="importo"
                [(ngModel)]="editForm.importo"
                required
                min="0"
                step="0.01"
                class="form-input"
                placeholder="0.00"
              />
            </div>

            <div class="popup-actions">
              <button type="button" class="btn-close" (click)="closeEditPopup()">Chiudi</button>
              <button type="submit" class="btn-save">Salva Modifiche</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
        flex: 1;
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
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .color-swatch {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .order-amount {
        font-size: 1rem;
        color: #9a3412;
        font-weight: 700;
        margin: 0 1rem;
      }

      .empty-state {
        text-align: center;
        color: #9a3412;
        opacity: 0.6;
        padding: 2rem 0;
        font-size: 0.95rem;
      }

      .edit-icon,
      .delete-icon {
        font-size: 1.2rem;
        color: #f97316;
        cursor: pointer;
        margin-left: 0.5rem;
        transition: color 0.2s;
      }

      .edit-icon:hover,
      .delete-icon:hover {
        color: #ea580c;
      }

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 102;
      }

      .popup-modal {
        background: white;
        border-radius: 2rem;
        padding: 2rem;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }

      .popup-title {
        text-align: center;
        color: #9a3412;
        font-size: 1.5rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }

      .form-group label {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #9a3412;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        margin-left: 0.5rem;
      }

      .form-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #fed7aa;
        border-radius: 1rem;
        font-size: 1rem;
        outline: none;
        transition: all 0.2s;
        background: #fffcf9;
      }

      .form-input:focus {
        border-color: #f97316;
        background: white;
        box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
      }

      .selected-color {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: #9a3412;
        margin-left: 0.5rem;
      }

      .color-swatch {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .popup-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        gap: 1rem;
      }

      .btn-close {
        flex: 1;
        padding: 1rem;
        background: #f0f0f0;
        color: #666;
        border: none;
        border-radius: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-close:hover {
        background: #e0e0e0;
      }

      .btn-save {
        flex: 1;
        padding: 1rem;
        background: #f97316;
        color: white;
        border: none;
        border-radius: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-save:hover {
        background: #ea580c;
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .search-container,
        .orders-rectangle {
          width: 90%;
        }
      }
    `
  ]
})
export class HistoryComponent implements OnInit {
  private supabase = inject(SupabaseService);
  orders: any[] = [];
  filteredOrders: any[] = [];
  restaurants: any[] = [];

  isEditPopupOpen = false;
  editingOrder: any = null;
  editForm = { restaurantId: '', data: '', importo: 0 };
  editSelectedRestaurantColor = '';

  ngOnInit() {
    this.loadOrders();
    this.loadRestaurants();
  }

  async loadRestaurants() {
    try {
      const { data } = await this.supabase.getRestaurants();
      this.restaurants = data || [];
    } catch (error) {
      console.error('Errore caricamento ristoranti:', error);
    }
  }

  loadOrders() {
    this.supabase.getExpenses().then((response) => {
      this.orders = response.data || [];
      this.filteredOrders = this.orders;
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();

    this.filteredOrders = this.orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const formattedDate = orderDate.toLocaleDateString('it-IT');

      return (
        order.description.toLowerCase().includes(query) ||
        formattedDate.includes(query)
      );
    });
  }

  onEditRestaurantSelect() {
    const selected = this.restaurants.find((r) => r.id === this.editForm.restaurantId);
    this.editSelectedRestaurantColor = selected?.color || '';
  }

  openEditPopup(order: any) {
    this.editingOrder = order;
    const existingRestaurant = this.restaurants.find((r) => r.name === order.description);
    this.editForm = {
      restaurantId: existingRestaurant?.id || '',
      importo: order.amount,
      data: new Date(order.created_at).toISOString().split('T')[0],
    };
    this.editSelectedRestaurantColor = existingRestaurant?.color || order.restaurant_color || '#f97316';
    this.isEditPopupOpen = true;
  }

  closeEditPopup() {
    this.isEditPopupOpen = false;
    this.editingOrder = null;
    this.editForm = { restaurantId: '', data: '', importo: 0 };
    this.editSelectedRestaurantColor = '';
  }

  async saveEditedOrder() {
    if (!this.editingOrder || !this.editForm.restaurantId || !this.editForm.data || !this.editForm.importo) {
      return;
    }

    const selectedRestaurant = this.restaurants.find((r) => r.id === this.editForm.restaurantId);
    if (!selectedRestaurant) return;

    try {
      const { error } = await this.supabase.updateExpense(
        this.editingOrder.id,
        this.editForm.importo,
        selectedRestaurant.name,
        'Ristorante',
        this.editForm.data,
        selectedRestaurant.color
      );

      if (error) {
        console.error('Errore salvataggio modifiche:', error);
        return;
      }

      const index = this.orders.findIndex((o) => o.id === this.editingOrder.id);
      if (index !== -1) {
        this.orders[index] = {
          ...this.orders[index],
          description: selectedRestaurant.name,
          amount: this.editForm.importo,
          created_at: this.editForm.data,
          restaurant_color: selectedRestaurant.color,
        };
        this.filteredOrders = [...this.orders];
      }

      this.closeEditPopup();
    } catch (error) {
      console.error('Errore salvataggio modifiche:', error);
    }
  }

  deleteOrder(id: string) {
    this.supabase.deleteExpense(id).then(() => {
      this.orders = this.orders.filter((o) => o.id !== id);
      this.filteredOrders = [...this.orders];
    });
  }
}