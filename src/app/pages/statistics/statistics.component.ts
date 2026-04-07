import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft, BarChart3, TrendingUp, Wallet } from 'lucide-angular';
import { StorageService } from '../../services/storage.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="stats-container">
      <header class="stats-header">
        <button class="back-btn" routerLink="/main">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1 class="title">Statistiche</h1>
      </header>

      <div class="stats-content">
        <div class="overview-cards">
          <div class="stat-card">
            <div class="icon-box blue">
              <lucide-icon [name]="walletIcon" size="24"></lucide-icon>
            </div>
            <div class="stat-info">
              <span class="label">Spesa Totale</span>
              <h2 class="value">€ {{ totalSpent | number:'1.2-2' }}</h2>
            </div>
          </div>

          <div class="stat-card">
            <div class="icon-box green">
              <lucide-icon [name]="chartIcon" size="24"></lucide-icon>
            </div>
            <div class="stat-info">
              <span class="label">Ordini Totali</span>
              <h2 class="value">{{ totalOrders }}</h2>
            </div>
          </div>
        </div>

        <div class="section-title">
          <lucide-icon [name]="trendingIcon" size="20"></lucide-icon>
          <h3>Riepilogo per Ristorante</h3>
        </div>

        <div class="restaurant-list">
          @for (item of restaurantStats; track item.name) {
            <div class="res-card" [style.borderLeftColor]="item.color">
              <div class="res-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.count }} ordini</p>
              </div>
              <div class="res-spent">
                <span>€ {{ item.spent | number:'1.2-2' }}</span>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <p>Nessun dato disponibile per le statistiche.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      height: 100vh;
      background-color: var(--bg-color);
      padding: 20px;
      transition: background-color 0.3s ease;
      overflow-y: auto;
    }

    .stats-header {
      background-color: var(--header-bg);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: var(--header-text);
      margin-bottom: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .back-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0;
    }

    .title {
      flex: 1;
      text-align: center;
      font-size: 1.4rem;
      font-weight: 800;
      margin: 0;
      margin-right: 24px;
    }

    .stats-content {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .overview-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .stat-card {
      background: var(--card-bg);
      padding: 20px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 20px var(--card-shadow);
    }

    .icon-box {
      width: 50px;
      height: 50px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .icon-box.blue { background-color: #5d7a99; }
    .icon-box.green { background-color: #15803d; }

    .stat-info .label {
      font-size: 0.85rem;
      font-weight: 600;
      opacity: 0.6;
      color: var(--text-color);
    }

    .stat-info .value {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-color);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-color);
      opacity: 0.8;
    }

    .section-title h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .restaurant-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 30px;
    }

    .res-card {
      background: var(--card-bg);
      padding: 15px 20px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 6px solid transparent;
      box-shadow: 0 4px 12px var(--card-shadow);
    }

    .res-info h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      text-transform: uppercase;
    }

    .res-info p {
      margin: 4px 0 0;
      font-size: 0.8rem;
      opacity: 0.6;
      color: var(--text-color);
    }

    .res-spent span {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text-color);
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      opacity: 0.5;
      color: var(--text-color);
    }

    @media (min-width: 768px) {
      .overview-cards { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  private storage = inject(StorageService);
  
  readonly backIcon = ChevronLeft;
  readonly chartIcon = BarChart3;
  readonly trendingIcon = TrendingUp;
  readonly walletIcon = Wallet;

  totalSpent = 0;
  totalOrders = 0;
  restaurantStats: { name: string, count: number, spent: number, color: string }[] = [];

  ngOnInit() {
    const notes = this.storage.getNotes();
    this.calculateStats(notes);
  }

  calculateStats(notes: Note[]) {
    this.totalOrders = notes.length;
    this.totalSpent = notes.reduce((acc, note) => acc + parseFloat(note.amount || '0'), 0);

    const statsMap = new Map<string, { count: number, spent: number, color: string }>();

    notes.forEach(note => {
      const name = note.restaurantName.toUpperCase();
      const current = statsMap.get(name) || { count: 0, spent: 0, color: note.color };
      statsMap.set(name, {
        count: current.count + 1,
        spent: current.spent + parseFloat(note.amount || '0'),
        color: current.color
      });
    });

    this.restaurantStats = Array.from(statsMap.entries()).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.spent - a.spent);
  }
}