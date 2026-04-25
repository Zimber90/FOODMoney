import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Aggiunto FormsModule per ngModel
import { format, startOfMonth, endOfMonth, isToday, getDay, getMonth, getYear } from 'date-fns';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule], // Aggiunto FormsModule
  template: `
    <div class="history-page">
      <h1 class="title">Storico</h1>
      
      <div class="search-container">
        <input type="text" placeholder="Cerca..." (input)="onSearch((<HTMLInputElement>$event.target).value)">
      </div>
      
      <div class="filters">
        <select [(ngModel)]="selectedMonth" (change)="applyFilter()">
          <option value="">Mese</option>
          <option *ngFor="let month of months" [value]="month">{{ month }}</option>
        </select>
        <select [(ngModel)]="selectedYear" (change)="applyFilter()">
          <option value="">Anno</option>
          <option *ngFor="let year of years" [value]="year">{{ year }}</option>
        </select>
      </div>
      
      <div class="orders-container" [style.overflow-y]="'auto'">
        <div *ngFor="let order of filteredOrders" class="order-item">
          <div class="order-date">{{ order.date | date:'d/M/yyyy' }}</div>
          <div class="order-restaurant">{{ order.ristorante }}</div>
          <div class="order-amount">{{ order.importo | number:'1.2-2' }} €</div>
        </div>
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
      margin-bottom: 1.5rem;
    }

    .search-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .search-container input {
      padding: 0.75rem;
      border: 2px solid #f97316;
      border-radius: 1rem;
      font-size: 1rem;
      width: 300px;
      max-width: 80%;
    }

    .filters {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .filters select {
      padding: 0.75rem;
      border: 2px solid #f97316;
      border-radius: 1rem;
      font-size: 1rem;
    }

    .orders-container {
      width: 90%;
      max-width: 600px;
    }

    .order-item {
      background: #f0fdf4;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 0.5rem 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .order-date, .order-restaurant, .order-amount {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .order-amount {
      color: #f97316;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .search-container input {
        width: 100%;
        max-width: 100%;
      }
      
      .filters {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class HistoryComponent {
  private supabase = inject(SupabaseService);
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedMonth: string = '';
  selectedYear: number = 0;
  months: string[] = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  years: number[] = Array.from({length: 6}, (_, i) => 2023 - i); // Anni da 2018 a 2023

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.supabase.getExpenses().then(response => {
      this.orders = response.data;
      this.filteredOrders = this.orders;
      this.applyFilter();
    });
  }

  onSearch(query: string) {
    this.filteredOrders = this.orders.filter(order => 
      order.ristorante.toLowerCase().includes(query.toLowerCase()) ||
      order.date.toLowerCase().includes(query.toLowerCase())
    );
  }

  applyFilter() {
    this.filteredOrders = this.orders.filter(order => {
      const orderDate = new Date(order.date);
      const selectedDate = new Date(this.selectedYear, this.getMonthIndex(this.selectedMonth), 1);
      
      return (
        (!this.selectedMonth || this.getMonthName(orderDate) === this.selectedMonth) &&
        (!this.selectedYear || orderDate.getFullYear() === this.selectedYear)
      );
    });
  }

  getMonthIndex(monthName: string): number {
    return this.months.indexOf(monthName);
  }

  getMonthName(date: Date): string {
    return this.months[date.getMonth()];
  }
}