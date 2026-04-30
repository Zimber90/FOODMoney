import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="home-container">
      <div class="logo-container">
        <img src="assets/foodmoney512.png" alt="FoodMoney Logo" class="logo" />
      </div>
      <h1 class="home-title">FoodMoney</h1>
      <p class="home-description">Gestisci le tue spese quotidiane</p>

      <button class="create-btn" (click)="openOrderPopup()">
        + Crea Ordine
      </button>

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
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: calc(100vh - 80px);
      background: #fff7ed;
    }

    .logo-container {
      margin-bottom: 1.5rem;
    }

    .logo {
      width: 250px;
      height: auto;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.2);
    }

    .home-title {
      color: #9a3412;
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0.5rem 0;
      text-align: center;
    }

    .home-description {
      color: #9a3412;
      opacity: 0.7;
      font-size: 1rem;
      text-align: center;
      margin-bottom: 2rem;
    }

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
      box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
    }

    /* Popup styles */
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
      .home-container {
        padding: 1.5rem;
      }

      .logo {
        width: 200px;
      }

      .home-title {
        font-size: 2rem;
      }

      .home-description {
        font-size: 0.9rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  isOrderPopupOpen = false;
  orderForm = { restaurantId: '', data: '', importo: 0 };
  selectedRestaurantColor = '';
  supabase = inject(SupabaseService);
  restaurants: any[] = [];

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
    this.orderForm = { restaurantId: '', data: new Date().toISOString().split('T')[0], importo: 0 };
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
        console.error('Errore nel salvataggio ordine:', error);
        return;
      }

      this.closeOrderPopup();
    } catch (error) {
      console.error('Errore nel salvataggio ordine:', error);
    }
  }
}