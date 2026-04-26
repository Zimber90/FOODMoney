import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="more-page">
      <h1 class="page-title">Altro</h1>

      <!-- Menu Navigation -->
      <div class="menu-navigation">
        <button 
          class="menu-item" 
          [class.active]="selectedMenu === 'menu'"
          (click)="selectMenu('menu')"
        >
          Menu
        </button>
        <button 
          class="menu-item" 
          [class.active]="selectedMenu === 'settings'"
          (click)="selectMenu('settings')"
        >
          Impostazioni        </button>
        <button 
          class="menu-item" 
          [class.active]="selectedMenu === 'restaurant-management'"
          (click)="selectMenu('restaurant-management')"
        >
          Gestione Ristorante
        </button>
        <button 
          class="menu-item" 
          [class.active]="selectedMenu === 'user'"
          (click)="selectMenu('user')"
        >
          Utente
        </button>
        <button 
          class="menu-item" 
          [class.active]="selectedMenu === 'app-info'"
          (click)="selectMenu('app-info')"
        >
          Info App
        </button>
      </div>

      <!-- Content based on selected menu -->
      <div class="content-area">
        <!-- Menu Section -->
        <div *ngIf="selectedMenu === 'menu'" class="section">
          <h2 class="section-title">Menu</h2>
          <p class="section-subtitle">Qui puoi accedere alle principali funzionalità dell'applicazione.</p>
          <!-- Additional menu content can be added here -->
        </div>

        <!-- Settings Section -->
        <div *ngIf="selectedMenu === 'settings'" class="section">
          <h2 class="section-title">Impostazioni</h2>
          <p class="section-subtitle">Personalizza l'esperienza utente secondo le tue preferenze.</p>
          <!-- Settings form or content would go here -->
        </div>

        <!-- Restaurant Management Section -->
        <div *ngIf="selectedMenu === 'restaurant-management'" class="section restaurant-management-section">
          <h2 class="section-title">Gestione Ristorante</h2>
          <p class="section-subtitle">Salva i tuoi ristoranti preferiti con il loro colore identificativo</p>

          <!-- Add / Edit Form -->
          <div class="restaurant-form">
            <div class="form-group">
              <label for="rest-name">Nome Ristorante</label>
              <input
                type="text"
                id="rest-name"
                [(ngModel)]="restForm.name"
                placeholder="Es. GG, McDonald's"
                class="form-input"
                required              />
            </div>

            <div class="form-group">
              <label for="rest-color">Colore Identificativo</label>
              <div class="color-picker-wrapper">
                <input
                  type="color"
                  id="rest-color"
                  [(ngModel)]="restForm.color"
                  class="form-input color-picker"
                />
                <span class="color-preview" [style.background-color]="restForm.color"></span>
              </div>
            </div>

            <div class="form-actions">
              @if (editingRestaurantId) {
                <button class="btn-save" (click)="updateRestaurant()">Aggiorna</button>
                <button class="btn-close" (click)="cancelEdit()">Annulla</button>
              } @else {
                <button class="btn-save" (click)="addRestaurant()">Aggiungi Ristorante</button>
              }
            </div>
          </div>

          <!-- List of Saved Restaurants -->
          <div class="restaurants-list">
            @if (restaurants.length === 0) {
              <div class="empty-state">Nessun ristorante salvato. Aggiungine uno sopra!</div>
            }

            @for (restaurant of restaurants; track restaurant.id) {
              <div class="restaurant-item">
                <div class="restaurant-info">
                  <span class="color-swatch" [style.background-color]="restaurant.color"></span>
                  <span class="restaurant-name">{{ restaurant.name }}</span>
                </div>
                <div class="restaurant-actions">
                  <button class="edit-btn" (click)="startEdit(restaurant)">✏️</button>
                  <button class="delete-btn" (click)="deleteRestaurant(restaurant.id)">🗑️</button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- User Section -->
        <div *ngIf="selectedMenu === 'user'" class="section">
          <h2 class="section-title">Utente</h2>
          <p class="section-subtitle">Gestisci le informazioni del tuo profilo.</p>
          <!-- User management content would go here -->
        </div>

        <!-- App Info Section -->
        <div *ngIf="selectedMenu === 'app-info'" class="section">
          <h2 class="section-title">Info App</h2>
          <p class="section-subtitle">Informazioni sull'applicazione e le sue funzionalità.</p>
          <!-- App information content would go here -->
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .more-page {
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
        margin-bottom: 2rem;
      }

      /* Menu Navigation */
      .menu-navigation {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding: 0.5rem 0;
        margin-bottom: 1.5rem;
        width: 100%;
        max-width: 600px;
        justify-content: center;
      }
      .menu-item {
        padding: 0.6rem 1.2rem;
        border: 2px solid #fed7aa;
        border-radius: 1rem;
        background: white;
        color: #9a3412;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .menu-item.active {
        background: #f97316;
        color: white;
        border-color: #f97316;
      }
      .menu-item:hover:not(.active) {
        background: #fffcf9;
      }

      /* Content Area */
      .content-area {
        width: 100%;
        max-width: 600px;
      }

      /* Section styling */
      .section {
        background: white;
        border-radius: 2rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #9a3412;
        margin-bottom: 0.5rem;
      }

      .section-subtitle {
        font-size: 0.9rem;
        color: #9a3412;
        opacity: 0.7;
        margin-bottom: 1.5rem;
      }

      /* Restaurant Form */
      .restaurant-form {
        margin-bottom: 2rem;
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
        box-shadow: 0 0 0 4px rgba(249,115,22,0.1);
      }

      .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .color-picker {
        flex: 1;
        height: 50px;
        padding: 0.5rem;
        cursor: pointer;
      }

      .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 0.5rem;
        border: 2px solid #fed7aa;
        flex-shrink: 0;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
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

      /* Restaurants List */
      .restaurants-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .empty-state {
        text-align: center;
        color: #9a3412;
        opacity: 0.6;
        padding: 1.5rem 0;
        font-size: 0.95rem;
      }

      .restaurant-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #fff7ed;
        border-radius: 1rem;
        transition: background 0.2s;
      }
      .restaurant-item:hover {
        background: #fff0e6;
      }
      .restaurant-item:last-child {
        border-bottom: none;
      }

      .restaurant-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .color-swatch {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .restaurant-name {
        font-size: 1rem;
        color: #333;
        font-weight: 500;
      }

      .restaurant-actions {
        display: flex;
        gap: 0.75rem;
      }

      .edit-btn, .delete-btn {
        background: none;
        border: none;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.25rem;
        transition: transform 0.2s;
      }
      .edit-btn:hover, .delete-btn:hover {
        transform: scale(1.1);
      }

      @media (max-width: 768px) {
        .menu-navigation {
          flex-direction: column;
          align-items: flex-start;
        }
        .menu-item {
          width: 100%;
          text-align: left;
        }
        .content-area {
          max-width: 90%;
        }
      }
    `
  ]
})
export class MoreComponent implements OnInit {
  private supabase = inject(SupabaseService);
  restaurants: any[] = [];
  restForm = { name: '', color: '#f97316' };
  editingRestaurantId: string | null = null;

  selectedMenu: string = 'menu'; // Default selected menu

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

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }

  async addRestaurant() {
    if (!this.restForm.name.trim()) return;

    try {
      const { error } = await this.supabase.addRestaurant(
        this.restForm.name.trim(),
        this.restForm.color
      );

      if (error) {
        console.error('Errore aggiunta ristorante:', error);
        return;
      }

      this.restForm = { name: '', color: '#f97316' };
      this.loadRestaurants();
    } catch (error) {
      console.error('Errore aggiunta ristorante:', error);
    }
  }

  startEdit(restaurant: any) {
    this.editingRestaurantId = restaurant.id;
    this.restForm = {
      name: restaurant.name,
      color: restaurant.color
    };
  }

  async updateRestaurant() {
    if (!this.editingRestaurantId || !this.restForm.name.trim()) return;

    try {
      const { error } = await this.supabase.updateRestaurant(
        this.editingRestaurantId,
        this.restForm.name.trim(),
        this.restForm.color
      );

      if (error) {
        console.error('Errore aggiornamento ristorante:', error);
        return;
      }

      this.cancelEdit();
      this.loadRestaurants();
    } catch (error) {
      console.error('Errore aggiornamento ristorante:', error);
    }
  }

  cancelEdit() {
    this.editingRestaurantId = null;
    this.restForm = { name: '', color: '#f97316' };
  }

  async deleteRestaurant(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo ristorante?')) return;

    try {
      const { error } = await this.supabase.deleteRestaurant(id);
      if (error) {
        console.error('Errore eliminazione ristorante:', error);
        return;
      }
      this.loadRestaurants();
    } catch (error) {
      console.error('Errore eliminazione ristorante:', error);
    }
  }
}