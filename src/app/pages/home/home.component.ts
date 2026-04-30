import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="logo-container">
        <img src="assets/foodmoney512.png" alt="FoodMoney Logo" class="logo" />
      </div>
      <h1 class="home-title">FoodMoney</h1>
      <p class="home-description">Gestisci le tue spese quotidiane</p>
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
  `]
})
export class HomeComponent implements OnInit {
  supabase = inject(SupabaseService);

  ngOnInit() {}
}