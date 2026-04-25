import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { 
  startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, format, parseISO,
  startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, addYears
} from 'date-fns';
import { it } from 'date-fns/locale';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stats-page">
      <h1 class="page-title">Statistiche</h1>

      <!-- Period Selector -->
      <div class="period-selector">
        @for (period of periods; track period.value) {
          <button 
            class="period-pill"
            [class.active]="selectedPeriod === period.value"
            (click)="selectPeriod(period.value)"
          >
            {{ period.label }}
          </button>
        }
      </div>

      <!-- Restaurant Search Section -->
      <div class="restaurant-search-section">
        <h2 class="section-title">Cerca Ristorante</h2>
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Cerca ristorante..." 
            [(ngModel)]="searchQuery"
            (input)="onRestaurantSearch()"
            class="search-input"
          >
          @if (filteredRestaurants.length > 0 && searchQuery.trim()) {
            <div class="search-dropdown">
              @for (restaurant of filteredRestaurants; track restaurant) {
                <div class="search-item" (click)="selectRestaurant(restaurant)">
                  {{ restaurant }}
                </div>
              }
            </div>
          }
        </div>

        @if (selectedRestaurant) {
          <div class="selected-restaurant-banner">
            <span>Statistiche per: <strong>{{ selectedRestaurant }}</strong></span>
            <button class="clear-btn" (click)="clearRestaurantSelection()">✕</button>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (loading) {
        <div class="loading-state">Caricamento statistiche...</div>
      }

      <!-- Empty State -->
      @if (!loading && filteredExpenses.length === 0) {
        <div class="empty-state">Nessun dato disponibile per il periodo selezionato</div>
      }

      <!-- Main Stats Content -->
      @if (!loading && filteredExpenses.length > 0) {
        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-label">Totale Speso</div>
            <div class="summary-value">€ {{ totalSpent | number:'1.2-2' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Media per Ordine</div>
            <div class="summary-value">€ {{ averageSpend | number:'1.2-2' }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Numero Ordini</div>
            <div class="summary-value">{{ orderCount }}</div>
          </div>
        </div>

        <!-- Top Restaurants -->
        <div class="section">
          <h2 class="section-title">Top Ristoranti</h2>
          <div class="top-restaurants">
            @for (restaurant of topRestaurants; track restaurant.name) {
              <div class="restaurant-item" (click)="selectRestaurant(restaurant.name)">
                <div class="restaurant-info">
                  <span class="color-swatch" [style.background-color]="restaurant.color"></span>
                  <div class="restaurant-details">
                    <div class="restaurant-name">{{ restaurant.name }}</div>
                    <div class="restaurant-meta">{{ restaurant.count }} ordini · {{ restaurant.percentage | number:'1.0-0' }}%</div>
                  </div>
                </div>
                <div class="restaurant-amount">€ {{ restaurant.total | number:'1.2-2' }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Monthly Trend -->
        <div class="section">
          <h2 class="section-title">Andamento Mensile</h2>
          <div class="monthly-chart">
            @for (month of monthlyData; track month.month) {
              <div class="chart-bar-container">
                <div class="chart-amount">€ {{ month.total | number:'1.0-0' }}</div>
                <div class="chart-bar" [style.height.%]="month.heightPercent" [style.background-color]="'#f97316'"></div>
                <div class="chart-label">{{ month.shortMonth }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Selected Restaurant Detail Section -->
        @if (selectedRestaurant) {
          <div class="section restaurant-detail-section">
            <h2 class="section-title">Dettagli: {{ selectedRestaurant }}</h2>
            
            <!-- Restaurant Summary Cards -->
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-label">Totale Speso (Periodo)</div>
                <div class="summary-value">€ {{ restaurantTotalSpent | number:'1.2-2' }}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Media per Ordine</div>
                <div class="summary-value">€ {{ restaurantAvgSpend | number:'1.2-2' }}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Numero Ordini</div>
                <div class="summary-value">{{ restaurantOrderCount }}</div>
              </div>
            </div>

            <!-- Weekly Spend Breakdown -->
            @if (restaurantWeeklyData.length > 0) {
              <div class="section">
                <h3 class="sub-section-title">Spesa Settimanale</h3>
                <div class="weekly-chart">
                  @for (week of restaurantWeeklyData; track week.label) {
                    <div class="chart-bar-container">
                      <div class="chart-amount">€ {{ week.total | number:'1.0-0' }}</div>
                      <div class="chart-bar" [style.height.%]="week.heightPercent" [style.background-color]="'#f97316'"></div>
                      <div class="chart-label">{{ week.label }}</div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Monthly Spend Breakdown for Restaurant -->
            @if (restaurantMonthlyData.length > 0) {
              <div class="section">
                <h3 class="sub-section-title">Spesa Mensile</h3>
                <div class="monthly-chart">
                  @for (month of restaurantMonthlyData; track month.month) {
                    <div class="chart-bar-container">
                      <div class="chart-amount">€ {{ month.total | number:'1.0-0' }}</div>
                      <div class="chart-bar" [style.height.%]="month.heightPercent" [style.background-color]="'#f97316'"></div>
                      <div class="chart-label">{{ month.shortMonth }}</div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Yearly Spend Breakdown for Restaurant -->
            @if (restaurantYearlyData.length > 0) {
              <div class="section">
                <h3 class="sub-section-title">Spesa Annuale</h3>
                <div class="monthly-chart">
                  @for (year of restaurantYearlyData; track year.year) {
                    <div class="chart-bar-container">
                      <div class="chart-amount">€ {{ year.total | number:'1.0-0' }}</div>
                      <div class="chart-bar" [style.height.%]="year.heightPercent" [style.background-color]="'#f97316'"></div>
                      <div class="chart-label">{{ year.year }}</div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .stats-page {
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
      margin-bottom: 1.5rem;
    }

    /* Period Selector */
    .period-selector {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 0.5rem 0;
      margin-bottom: 2rem;
      width: 100%;
      max-width: 400px;
      justify-content: center;
    }
    .period-pill {
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
    .period-pill.active {
      background: #f97316;
      color: white;
      border-color: #f97316;
    }
    .period-pill:hover:not(.active) {
      background: #fffcf9;
    }

    /* Restaurant Search Section */
    .restaurant-search-section {
      width: 100%;
      max-width: 400px;
      margin-bottom: 2rem;
    }
    .search-container {
      position: relative;
      width: 100%;
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
    .search-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #fed7aa;
      border-top: none;
      border-radius: 0 0 1rem 1rem;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .search-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: background 0.2s;
      color: #333;
      font-size: 0.95rem;
    }
    .search-item:hover {
      background: #fff7ed;
    }
    .selected-restaurant-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: white;
      border: 2px solid #f97316;
      border-radius: 1rem;
      margin-top: 1rem;
      color: #9a3412;
      font-size: 0.95rem;
    }
    .clear-btn {
      background: none;
      border: none;
      color: #f97316;
      font-weight: 700;
      cursor: pointer;
      padding: 0 0.5rem;
    }

    /* Loading & Empty States */
    .loading-state, .empty-state {
      text-align: center;
      color: #9a3412;
      opacity: 0.6;
      padding: 3rem 0;
      font-size: 0.95rem;
    }

    /* Summary Cards */
    .summary-cards {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      width: 100%;
      max-width: 400px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 2rem;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
      flex: 1;
      min-width: 120px;
      text-align: center;
    }
    .summary-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #9a3412;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .summary-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: #9a3412;
    }

    /* Sections */
    .section {
      width: 100%;
      max-width: 400px;
      margin-bottom: 2rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #9a3412;
      margin-bottom: 1rem;
      padding-left: 0.5rem;
    }
    .sub-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #9a3412;
      margin-bottom: 1rem;
      padding-left: 0.5rem;
    }

    /* Top Restaurants */
    .top-restaurants {
      background-color: #fff;
      border-radius: 2rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
    }
    .restaurant-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #fed7aa;
      cursor: pointer;
      transition: background 0.2s;
      border-radius: 0.5rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .restaurant-item:hover {
      background: #fff7ed;
    }
    .restaurant-item:last-child {
      border-bottom: none;
    }
    .restaurant-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }
    .color-swatch {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .restaurant-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .restaurant-name {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
    }
    .restaurant-meta {
      font-size: 0.75rem;
      color: #9a3412;
      opacity: 0.8;
    }
    .restaurant-amount {
      font-size: 1rem;
      color: #9a3412;
      font-weight: 700;
      margin-left: 1rem;
    }

    /* Charts (Monthly, Weekly, Yearly) */
    .monthly-chart, .weekly-chart {
      background-color: #fff;
      border-radius: 2rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
      display: flex;
      align-items: flex-end;
      gap: 0.75rem;
      height: 200px;
      overflow-x: auto;
    }
    .chart-bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
      min-width: 40px;
      height: 100%;
      justify-content: flex-end;
    }
    .chart-amount {
      font-size: 0.7rem;
      color: #9a3412;
      font-weight: 600;
    }
    .chart-bar {
      width: 100%;
      border-radius: 0.5rem 0.5rem 0 0;
      transition: height 0.3s ease;
      min-height: 4px;
    }
    .chart-label {
      font-size: 0.75rem;
      color: #9a3412;
      font-weight: 600;
      text-transform: capitalize;
    }

    /* Restaurant Detail Section */
    .restaurant-detail-section {
      background: white;
      border-radius: 2rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.1);
    }

    @media (max-width: 768px) {
      .summary-cards {
        flex-direction: column;
        align-items: center;
      }
      .summary-card {
        width: 100%;
      }
      .period-selector {
        justify-content: flex-start;
      }
    }
  `]
})
export class StatsComponent implements OnInit {
  private supabase = inject(SupabaseService);
  loading = true;
  allExpenses: any[] = [];
  filteredExpenses: any[] = [];
  selectedPeriod = 'this-month';

  // Period filter dates
  startDate: Date | null = null;
  endDate: Date | null = null;

  periods = [
    { label: 'Questo mese', value: 'this-month' },
    { label: 'Ultimo mese', value: 'last-month' },
    { label: 'Ultimi 3 mesi', value: 'last-3-months' },
    { label: 'Quest\'anno', value: 'this-year' },
    { label: 'Tutto', value: 'all' }
  ];

  // Main summary stats
  totalSpent = 0;
  averageSpend = 0;
  orderCount = 0;

  // Top restaurants
  topRestaurants: any[] = [];

  // Main monthly data
  monthlyData: any[] = [];

  // Restaurant search
  searchQuery = '';
  selectedRestaurant: string | null = null;
  filteredRestaurants: string[] = [];

  // Selected restaurant stats
  restaurantExpenses: any[] = [];
  restaurantTotalSpent = 0;
  restaurantAvgSpend = 0;
  restaurantOrderCount = 0;
  restaurantWeeklyData: any[] = [];
  restaurantMonthlyData: any[] = [];
  restaurantYearlyData: any[] = [];

  ngOnInit() {
    this.loadExpenses();
  }

  async loadExpenses() {
    this.loading = true;
    try {
      const { data, error } = await this.supabase.getExpenses();
      if (error) throw error;
      this.allExpenses = data || [];
      this.filterExpenses();
    } catch (err) {
      console.error('Errore caricamento spese:', err);
    } finally {
      this.loading = false;
    }
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    this.filterExpenses();
    if (this.selectedRestaurant) {
      this.calculateRestaurantStats();
    }
  }

  filterExpenses() {
    const now = new Date();
    this.startDate = null;
    this.endDate = null;

    switch (this.selectedPeriod) {
      case 'this-month':
        this.startDate = startOfMonth(now);
        this.endDate = endOfMonth(now);
        break;
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        this.startDate = startOfMonth(lastMonth);
        this.endDate = endOfMonth(lastMonth);
        break;
      case 'last-3-months':
        this.startDate = startOfMonth(subMonths(now, 2));
        this.endDate = endOfMonth(now);
        break;
      case 'this-year':
        this.startDate = startOfYear(now);
        this.endDate = endOfYear(now);
        break;
      case 'all':
      default:
        this.startDate = null;
        this.endDate = null;
        break;
    }

    this.filteredExpenses = this.allExpenses.filter(expense => {
      const expenseDate = parseISO(expense.created_at);
      if (isNaN(expenseDate.getTime())) return false;
      if (!this.startDate || !this.endDate) return true;
      return expenseDate >= this.startDate && expenseDate <= this.endDate;
    });

    this.calculateStats();
  }

  calculateStats() {
    // Main summary stats
    this.orderCount = this.filteredExpenses.length;
    this.totalSpent = this.filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.averageSpend = this.orderCount > 0 ? this.totalSpent / this.orderCount : 0;

    // Top restaurants
    const restaurantMap = new Map<string, { total: number, count: number, color: string }>();
    this.filteredExpenses.forEach(exp => {
      const name = exp.description;
      const existing = restaurantMap.get(name) || { total: 0, count: 0, color: exp.restaurant_color || '#f97316' };
      existing.total += exp.amount;
      existing.count += 1;
      restaurantMap.set(name, existing);
    });

    this.topRestaurants = Array.from(restaurantMap.entries())
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
        color: data.color,
        percentage: this.totalSpent > 0 ? (data.total / this.totalSpent) * 100 : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Main monthly data
    this.calculateMainMonthlyData();
  }

  calculateMainMonthlyData() {
    const monthMap = new Map<string, number>();
    this.filteredExpenses.forEach(exp => {
      const expenseDate = parseISO(exp.created_at);
      if (isNaN(expenseDate.getTime())) return;
      const monthKey = format(expenseDate, 'yyyy-MM');
      const existing = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, existing + exp.amount);
    });

    const monthEntries = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const maxMonthTotal = Math.max(...monthEntries.map(e => e[1]), 1);

    this.monthlyData = monthEntries.map(([monthKey, total]) => ({
      month: monthKey,
      total,
      shortMonth: format(parseISO(monthKey + '-01'), 'MMM', { locale: it }),
      heightPercent: (total / maxMonthTotal) * 100
    }));
  }

  // Restaurant search methods
  onRestaurantSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredRestaurants = [];
      return;
    }
    const allRestaurants = [...new Set(this.allExpenses.map(exp => exp.description))];
    this.filteredRestaurants = allRestaurants.filter(name => 
      name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectRestaurant(restaurantName: string) {
    this.selectedRestaurant = restaurantName;
    this.searchQuery = restaurantName;
    this.filteredRestaurants = [];
    this.calculateRestaurantStats();
  }

  clearRestaurantSelection() {
    this.selectedRestaurant = null;
    this.searchQuery = '';
    this.restaurantExpenses = [];
    this.restaurantWeeklyData = [];
    this.restaurantMonthlyData = [];
    this.restaurantYearlyData = [];
  }

  calculateRestaurantStats() {
    if (!this.selectedRestaurant) return;

    // Filter expenses for selected restaurant and current period
    this.restaurantExpenses = this.allExpenses.filter(exp => {
      if (exp.description !== this.selectedRestaurant) return false;
      const expenseDate = parseISO(exp.created_at);
      if (isNaN(expenseDate.getTime())) return false;
      if (!this.startDate || !this.endDate) return true;
      return expenseDate >= this.startDate && expenseDate <= this.endDate;
    });

    // Restaurant summary
    this.restaurantOrderCount = this.restaurantExpenses.length;
    this.restaurantTotalSpent = this.restaurantExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    this.restaurantAvgSpend = this.restaurantOrderCount > 0 ? this.restaurantTotalSpent / this.restaurantOrderCount : 0;

    // Weekly breakdown
    this.calculateRestaurantWeeklyData();
    // Monthly breakdown
    this.calculateRestaurantMonthlyData();
    // Yearly breakdown
    this.calculateRestaurantYearlyData();
  }

  calculateRestaurantWeeklyData() {
    if (this.restaurantExpenses.length === 0) {
      this.restaurantWeeklyData = [];
      return;
    }

    const dates = this.restaurantExpenses.map(exp => parseISO(exp.created_at)).filter(d => !isNaN(d.getTime()));
    if (dates.length === 0) {
      this.restaurantWeeklyData = [];
      return;
    }

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const weeks = eachWeekOfInterval({ start: minDate, end: maxDate }, { weekStartsOn: 1 }); // Monday start for Italy

    const weekMap = new Map<string, number>();
    weeks.forEach(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const total = this.restaurantExpenses.filter(exp => {
        const expDate = parseISO(exp.created_at);
        return expDate >= weekStart && expDate <= weekEnd;
      }).reduce((sum, exp) => sum + exp.amount, 0);

      const weekLabel = format(weekStart, 'dd/MM');
      weekMap.set(weekLabel, total);
    });

    const weekEntries = Array.from(weekMap.entries());
    const maxWeekTotal = Math.max(...weekEntries.map(e => e[1]), 1);

    this.restaurantWeeklyData = weekEntries.map(([label, total]) => ({
      label,
      total,
      heightPercent: (total / maxWeekTotal) * 100
    }));
  }

  calculateRestaurantMonthlyData() {
    const monthMap = new Map<string, number>();
    this.restaurantExpenses.forEach(exp => {
      const expenseDate = parseISO(exp.created_at);
      if (isNaN(expenseDate.getTime())) return;
      const monthKey = format(expenseDate, 'yyyy-MM');
      const existing = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, existing + exp.amount);
    });

    const monthEntries = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const maxMonthTotal = Math.max(...monthEntries.map(e => e[1]), 1);

    this.restaurantMonthlyData = monthEntries.map(([monthKey, total]) => ({
      month: monthKey,
      total,
      shortMonth: format(parseISO(monthKey + '-01'), 'MMM', { locale: it }),
      heightPercent: (total / maxMonthTotal) * 100
    }));
  }

  calculateRestaurantYearlyData() {
    const yearMap = new Map<string, number>();
    this.restaurantExpenses.forEach(exp => {
      const expenseDate = parseISO(exp.created_at);
      if (isNaN(expenseDate.getTime())) return;
      const yearKey = format(expenseDate, 'yyyy');
      const existing = yearMap.get(yearKey) || 0;
      yearMap.set(yearKey, existing + exp.amount);
    });

    const yearEntries = Array.from(yearMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const maxYearTotal = Math.max(...yearEntries.map(e => e[1]), 1);

    this.restaurantYearlyData = yearEntries.map(([year, total]) => ({
      year,
      total,
      heightPercent: (total / maxYearTotal) * 100
    }));
  }
}