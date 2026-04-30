import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="logo-wrapper">
        <img src="assets/FoodMoney_titolo.png" alt="FoodMoney Logo" class="title-image" />
        <img src="assets/foodmoney512.png" alt="FoodMoney Logo" class="logo" />
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 0 1rem;
      background: #fff7ed;
    }

    .logo-wrapper {
      text-align: center;
      margin-bottom: 1rem;
    }

    .title-image {
      width: 300px;
      height: auto;
      margin-bottom: 0.5rem;
    }

    .logo {
      width: 250px;
      height: auto;
      border-radius: 1rem;
      box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.2);
    }
  `]
})
export class HomeComponent implements OnInit {
  supabase = inject(SupabaseService);
  ngOnInit() {}
}