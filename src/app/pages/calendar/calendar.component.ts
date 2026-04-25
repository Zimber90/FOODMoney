import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format, startOfMonth, endOfMonth, isToday, getDay, getMonth, getYear } from 'date-fns';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-page">
      <!-- Calendario SVG nella metà superiore -->
      <div class="calendar-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="calendar-svg">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
      </div>

      <!-- Calendario interattivo -->
      <div class="calendar-container">
        <div class="calendar-nav">
          <button (click)="prevMonth()" class="nav-btn">◀</button>
          <div class="calendar-title">{{ currentMonth }} {{ currentYear }}</div>
          <button (click)="nextMonth()" class="nav-btn">▶</button>
        </div>

        <div class="calendar-grid">
          <!-- Intestazione giorni settimana -->
          <div class="weekdays-row">
            <div *ngFor="let day of weekdays" class="weekday-cell">{{ day }}</div>
          </div>

          <!-- Griglia giorni -->
          <div *ngFor="let week of calendarWeeks" class="week-row">
            <div 
              *ngFor="let day of week" 
              class="day-cell" 
              [class.today]="isToday(day.date)"
              [class.other-month]="isOtherMonth(day.date)"
            >
              {{ day.date | date:'d' }}
            </div>
          </div>
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
    }

    .calendar-header {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
      background: #fff7ed;
    }

    .calendar-svg {
      width: 120px;
      height: 120px;
      color: #16a34a;
      filter: drop-shadow(0 4px 6px rgba(22, 163, 74, 0.1));
    }

    .calendar-container {
      background: white;
      border-radius: 2rem 2rem 0 0;
      padding: 1.5rem;
      box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.05);
      flex: 1;
    }

    .calendar-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0 0.5rem;
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
    }

    @media (max-width: 768px) {
      .calendar-svg {
        width: 80px;
        height: 80px;
      }

      .day-cell {
        padding: 0.5rem 0;
        font-size: 0.85rem;
      }
    }
  `]
})
export class CalendarComponent {
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  calendarWeeks: { date: Date }[][] = [];

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    // Update month/year display
    this.currentMonth = format(this.currentDate, 'MMMM');
    this.currentYear = getYear(this.currentDate);

    const firstDayOfMonth = startOfMonth(this.currentDate);
    const lastDayOfMonth = endOfMonth(this.currentDate);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = getDay(firstDayOfMonth); // 0 = Sunday

    // Current month days
    const currentMonthDays = Array.from({ length: totalDaysInMonth }, (_, i) => ({
      date: new Date(getYear(this.currentDate), getMonth(this.currentDate), i + 1)
    }));

    // Previous month trailing days
    const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => {
      const date = new Date(getYear(this.currentDate), getMonth(this.currentDate), 0);
      date.setDate(date.getDate() - (startDayOfWeek - 1 - i));
      return { date };
    });

    // Next month leading days
    const totalCells = Math.ceil((startDayOfWeek + totalDaysInMonth) / 7) * 7;
    const nextMonthDaysCount = totalCells - (startDayOfWeek + totalDaysInMonth);
    const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => ({
      date: new Date(getYear(this.currentDate), getMonth(this.currentDate) + 1, i + 1)
    }));

    // Combine all days and group into weeks
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
}