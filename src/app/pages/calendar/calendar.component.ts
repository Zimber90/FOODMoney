import { Component } from '@angular/core'; import { CommonModule } from '@angular/common'; import { format, startOfMonth, endOfMonth, isToday, getDay, getMonth, getYear } from 'date-fns'; 

@Component({ selector: 'app-calendar', standalone: true, imports: [CommonModule], template: ` <div class="calendar-page"> <!-- Calendario SVG nella metà superiore --> <div class="calendar-header"> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-24 h-24 text-green-600"> <rect x="3" y="4" width="18" height="18" rx="2" /> <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /> <line x1="1" y1="1" x2="23" y2="1" /> </svg> </div> <!-- Calendario interattivo --> <div class="calendar-grid"> <div class="calendar-nav"> <button (click)="prevMonth()" class="nav-btn">◀</button> <div class="calendar-title">{{ currentMonth }} {{ currentYear }}</div> <button (click)="nextMonth()" class="nav-btn">▶</button> </div> <div class="calendar-grid-container"> <div class="calendar-week"> <div *ngFor="let day of weekdays">{{ day }}</div> </div> <div class="calendar-days" *ngFor="let week of calendarWeeks"> <div *ngFor="let day of week" class="calendar-day" [class.today]="isToday(day.date)"> {{ day.date | date:'dd' }} </div> </div> </div> </div> `, styles: [` .calendar-page { display: flex; flex-direction: column; min-height: calc(100vh - 80px); background: white; padding: 0; margin: 0; } .calendar-header { flex: 1; display: flex; justify-content: center; align-items: center; padding-top: 2rem; } .calendar-content { flex: 1; padding: 2rem; text-align: center; color: #666; } h2 { margin-top: 1rem; color: #333; } .calendar-grid { display: flex; flex-direction: column; } .calendar-nav { display: flex; justify-content: space-between; padding: 1rem; background: #f0f0f0; } .nav-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; } .calendar-grid-container { display: flex; flex-direction: column; } .calendar-week { display: flex; justify-content: space-around; padding: 0.5rem; } .calendar-day { flex: 1; text-align: center; padding: 0.5rem; border: 1px solid #ddd; cursor: pointer; transition: background 0.3s; } .calendar-day.today { background-color: #f97316; color: white; border-radius: 50%; } `] }) export class CalendarComponent { currentDate = new Date(); currentMonth = format(currentDate, 'MMMM'); currentYear = getYear(currentDate); weekdays = ['Dom', 'Lun', 'Mar', 'Gio', 'Ven', 'Sab', 'Gio']; calendarWeeks: any[] = []; 

constructor() { this.generateCalendar(); } 

generateCalendar() { const startDate = startOfMonth(this.currentDate); const endDate = endOfMonth(this.currentDate); const firstDay = getDay(startDate); const lastDay = getDay(endDate); const totalDays = endOfMonth(this.currentDate).getDate(); 

// Calcola i giorni del mese corrente const days = Array.from({ length: totalDays }, (_, i) => { return { date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i + 1) }; }); 

// Calcola i giorni del mese precedente const prevMonthDays = Array.from({ length: firstDay }, () => { return { date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0) }; }); 

// Calcola i giorni del mese successivo const nextMonthDays = Array.from({ length: 6 - Math.ceil((firstDay + totalDays) / 7) }, () => { return { date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1) }; }); 

// Combina tutti i giorni const allDays = [...prevMonthDays, ...days, ...nextMonthDays]; 

// Raggruppa in settimane const weeks = []; for (let i = 0; i < allDays.length; i += 7) { weeks.push(allDays.slice(i, i + 7)); } 

this.calendarWeeks = weeks; } 

prevMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1); this.generateCalendar(); } 

nextMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1); this.generateCalendar(); } 

isToday(date: Date) { return isToday(date); } }