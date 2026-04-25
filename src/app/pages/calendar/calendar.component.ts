import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { format, startOfMonth, endOfMonth, isToday, getDay, getMonth, getYear } from 'date-fns';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendar-page">
      <div class="calendar-nav">
        <button (click)="prevMonth()" class="nav-btn">◀</button>
        <div class="calendar-title">{{ currentMonth }} {{ currentYear }}</div>
        <button (click)="nextMonth()" class="nav-btn">▶</button>
      </div>

      <div class="calendar-container">
        <div class="calendar-grid">
          <div class="weekdays-row">
            <div *ngFor="let day of weekdays" class="weekday-cell">{{ day }}</div>
          </div>

          <div *ngFor="let week of calendarWeeks" class="week-row">
            <div 
              *ngFor="let day of week" 
              class="day-cell" 
              [class.today]="isToday(day.date)"
              [class.other-month]="isOtherMonth(day.date)"
              [style.background-color]="getDayColor(day.date)"
              [style.color]="getDayTextColor(day.date)"
            >
              {{ day.date | date:'d' }}
            </div>
          </div>
        </div>
      </div>

      <button class="fab" (click)="openOrderPopup()">
        <span class="fab-icon">+</span>
      </button>

      <div *ngIf="isOrderPopupOpen" class="popup-overlay" (click)="closeOrderPopup()">
        <div class="popup-modal" (click)="$event.stopPropagation()">
          <h2 class="popup-title">Crea Ordine</h2>
          
          <form (ngSubmit)="saveOrder()" #orderFormRef="ngForm">
            <div class="form-group">
              <label for="ristorante">Ristorante</label>
              <input 
                type="text" 
                id="ristorante" 
                name="ristorante" 
                [(ngModel)]="orderForm.ristorante" 
                required 
                class="form-input"
                placeholder="Nome ristorante"
              >
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
              >
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
              >
            </div>

            <div class="form-group">
              <label for="colore">Colore Ristorante</label>
              <input 
                type="color" 
                id="colore" 
                name="colore" 
                [(ngModel)]="orderForm.colore" 
                class="form-input color-picker"
              >
              <small class="color-hint">Scegli un colore per riconoscere il ristorante in calendario</small>
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
    .calendar-page {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 80px);
      background: #fff7ed;
      padding: 0;
      margin: 0;
      position: relative;
    }

    .calendar-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e9ecef;
    }

    .nav-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #16a34a;
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      transition: all 0.2s;
    }

    .nav-btn:hover {
      background: #f0fdf4;
    }

    .calendar-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #166534;
      text-transform: capitalize;
    }

    .calendar-container {
      background: white;
      padding: 1.5rem;
      flex: 1;
    }

    .calendar-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .weekdays-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .weekday-cell {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: #166534;
      text-transform: uppercase;
      padding: 0.5rem 0;
    }

    .week-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
    }

    .day-cell {
      text-align: center;
      padding: 0.75rem 0;
      border-radius: 1rem;
      font-size: 0.95rem;
      color: #333;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .day-cell:hover:not(.other-month) {
      background: #f0fdf4;
    }

    .day-cell.today {
      background-color: #f97316;
      color: white;
      font-weight: 700;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2);
    }

    .day-cell.other-month {
      color: #ccc;
      cursor: default;
      background-color: transparent !important;
    }

    .fab {
      position: fixed;
      bottom: 100px;
      right: 1.5rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #f97316;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.3);
      transition: all 0.2s;
      z-index: 101;
    }

    .fab:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
    }

    .fab-icon {
      font-size: 1.5rem;
      font-weight: 700;
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

    .color-picker {
      height: 50px;
      padding: 0.5rem;
      cursor: pointer;
    }

    .color-hint {
      display: block;
      font-size: 0.7rem;
      color: #9a3412;
      opacity: 0.7;
      margin-top: 0.25rem;
      margin-left: 0.5rem;
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
      .calendar-nav {
        padding: 0.75rem 1rem;
      }
      
      .day-cell {
        padding: 0.5rem 0;
        font-size: 0.85rem;
      }

      .fab {
        bottom: 90px;
        right: 1rem;
        width: 48px;
        height: 48px;
      }

      .fab-icon {
        font-size: 1.25rem;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  private supabase = inject(SupabaseService);
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  calendarWeeks: { date: Date }[][] = [];
  isOrderPopupOpen = false;
  orderForm = { ristorante: '', data: '', importo: 0, colore: '#f97316' };
  orders: any[] = [];

  ngOnInit() {
    this.loadOrders();
    this.generateCalendar();
  }

  async loadOrders() {
    try {
      const { data } = await this.supabase.getExpenses();
      this.orders = data || [];
    } catch (error) {
      console.error('Errore caricamento ordini:', error);
    }
  }

  generateCalendar() {
    this.currentMonth = format(this.currentDate, 'MMMM');
    this.currentYear = getYear(this.currentDate);

    const firstDayOfMonth = startOfMonth(this.currentDate);
    const lastDayOfMonth = endOfMonth(this.currentDate);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = getDay(firstDayOfMonth);

    const currentMonthDays = Array.from({ length: totalDaysInMonth }, (_, i) => ({
      date: new Date(getYear(this.currentDate), getMonth(this.currentDate), i + 1)
    }));

    const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => {
      const date = new Date(getYear(this.currentDate), getMonth(this.currentDate), 0);
      date.setDate(date.getDate() - (startDayOfWeek - 1 - i));
      return { date };
    });

    const totalCells = Math.ceil((startDayOfWeek + totalDaysInMonth) / 7) * 7;
    const nextMonthDaysCount = totalCells - (startDayOfWeek + totalDaysInMonth);
    const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => ({
      date: new Date(getYear(this.currentDate), getMonth(this.currentDate) + 1, i + 1)
    }));

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    const weeks: { date: Date }[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    this.calendarWeeks = weeks;
  }

  prevMonth() {
    this.currentDate = new Date(getYear(this.currentDate), getMonth(this.currentDate) - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(getYear(this.currentDate), getMonth(this.currentDate) + 1, 1);
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    return isToday(date);
  }

  isOtherMonth(date: Date): boolean {
    return getMonth(date) !== getMonth(this.currentDate) || getYear(date) !== getYear(this.currentDate);
  }

  getDayColor(date: Date): string {
    if (this.isOtherMonth(date)) return 'transparent';
    
    const order = this.orders.find(o => {
      const orderDate = new Date(o.created_at);
      return orderDate.toDateString() === date.toDateString();
    });
    
    return order?.restaurant_color || 'transparent';
  }

  getDayTextColor(date: Date): string {
    const bgColor = this.getDayColor(date);
    if (bgColor === 'transparent' || bgColor === '#FFFFFF' || bgColor === '#ffffff') {
      return '#333';
    }
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#333' : '#FFFFFF';
  }

  openOrderPopup() {
    this.isOrderPopupOpen = true;
    this.orderForm = { ristorante: '', data: new Date().toISOString().split('T')[0], importo: 0, colore: '#f97316' };
  }

  closeOrderPopup() {
    this.isOrderPopupOpen = false;
    this.orderForm = { ristorante: '', data: '', importo: 0, colore: '#f97316' };
  }

  async saveOrder() {
    if (!this.orderForm.ristorante || !this.orderForm.data || !this.orderForm.importo) {
      return;
    }

    try {
      const { error } = await this.supabase.addExpense(
        parseFloat(this.orderForm.importo.toString()),
        this.orderForm.ristorante,
        'Ristorante',
        this.orderForm.data,
        this.orderForm.colore
      );

      if (error) {
        console.error('Errore nel salvataggio ordine:', error);
        return;
      }

      this.closeOrderPopup();
      this.loadOrders();
    } catch (error) {
      console.error('Errore nel salvataggio ordine:', error);
    }
  }
}