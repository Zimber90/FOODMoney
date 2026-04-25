import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sandwich-container">
      <svg class="sandwich-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10H4V10Z" />
        <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        <path d="M9 14h6" />
        <path d="M9 18h6" />
      </svg>
      
      <h1>FoodMoney</h1>
      <p>Gestisci le tue spese quotidiane</p>
      
      <button class="create-btn" (click)="openOrderPopup()">
        + Crea Ordine
      </button>
    </div>

    <!-- Order creation popup -->
    <div *ngIf="isOrderPopupOpen" class="popup-overlay" (click)="closeOrderPopup()">
      <div class="popup-modal" (click)="$event.stopPropagation()">
        <h2 class="popup-title">Crea Ordine</h2>
        
        <form (ngSubmit)="saveOrder()" #orderFormRef="ngForm">
          <div class="form-group">
            <label for="ristorante">Ristorante</label>
            <select
              id="ristorante"
              name="ristorante"
              [(ngModel)]="orderForm.restaurantId"
              required
              class="form-input"
              (change)="onRestaurantSelect()"
            >
              <option value="" disabled>Scegli un ristorante</option>
              @for (restaurant of restaurants; track restaurant.id) {
                <option [value]="restaurant.id">
                  {{ restaurant.name }}
                </option>
              }
            </select>
            @if (selectedRestaurantColor) {
              <div class="selected-color">
                <span class="color-swatch" [style.background-color]="selectedRestaurantColor"></span>
                <span>Colore: {{ selectedRestaurantColor }}</span>
              </div>
            }
          </div>
          
          <div class="form-group">
            <label for="data">Data</label>
            <input
              type="date"
              id="data"
              name="data"
              [(ngModel)]="orderForm.data"
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="importo">Importo</label>
            <input
              type="number"
              id="importo"
              name="importo"
              [(ngModel)]="orderForm.importo"
              required
              min="0"
              step="0.01"
              class="form-input"
              placeholder="0.00"
            />
          </div>
          
          <div class="popup-actions">
            <button type="button" class="btn-close" (click)="closeOrderPopup()">Chiudi</button>
            <button type="submit" class="btn-save">Salva Ordine</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .sandwich-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: #fff7ed;
    }
    .sandwich-icon {
      width: 300px;
      height: 300px;
      color: #f97316;
      filter: drop-shadow(0 10px 15px rgba(249,115,22,0.2));
      transition: transform 0.3s ease;
    }
    .sandwich-icon:hover { transform: scale(1.05); }

    h1 { color: #9a3412; font-size: 2.5rem; font-weight: 800; margin: 1rem 0 0.5rem; }
    p { color: #9a3412; opacity: 0.6; margin-bottom: 2rem; font-size: 1rem; }

    .create-btn {
      padding: 1rem 2rem;
      background: #f97316;
      color: white;
      border: none;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .create-btn:hover {
      background: #ea580c;
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(249,115,22,0.3);
    }

    .popup-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .popup-modal {
      background: white;
      border-radius: 2rem;
      padding: 2rem;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }

    .popup-title {
      text-align: center;
      color: #9a3412;
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
    }

    .form-group { margin-bottom: 1.25rem; }

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
      box-shadow: 0 0 0 4px rgba(249,115,22,0.1);
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
    .btn-close:hover { background: #e0e0e0; }

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
      .sandwich-icon { width: 200px; height: 200px; }
      .create-btn { margin-top: 1rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  isOrderPopupOpen = false;
  orderForm = { restaurantId: '', data: '', importo: 0 };
  supabase = inject(SupabaseService);
  restaurants: any[] = [];
  selectedRestaurantColor = '';

  ngOnInit() {
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

  onRestaurantSelect() {
    const selected = this.restaurants.find(r => r.id === this.orderForm.restaurantId);
    this.selectedRestaurantColor = selected?.color || '';
  }

  openOrderPopup() {
    this.isOrderPopupOpen = true;
    this.orderForm = {
      restaurantId: '',
      data: new Date().toISOString().split('T')[0],
      importo: 0
    };
    this.selectedRestaurantColor = '';
  }

  closeOrderPopup() {
    this.isOrderPopupOpen = false;
  }

  async saveOrder() {
    if (!this.orderForm.restaurantId || !this.orderForm.data || !this.orderForm.importo) {
      return;
    }

    const selectedRestaurant = this.restaurants.find(r => r.id === this.orderForm.restaurantId);
    if (!selectedRestaurant) return;

    try {
      const { error } = await this.supabase.addExpense(
        parseFloat(this.orderForm.importo.toString()),
        selectedRestaurant.name,
        'Ristorante',
        this.orderForm.data,
        selectedRestaurant.color
      );

      if (error) {
        console.error('Errore nel salvataggio:', error);
        return;
      }

      this.closeOrderPopup();
    } catch (error) {
      console.error('Errore:', error);
    }
  }
}