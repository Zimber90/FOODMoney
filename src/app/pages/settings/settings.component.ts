import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft } from 'lucide-angular';
import { ThemeService, ThemeType } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <button class="back-btn" routerLink="/">
          <lucide-icon [name]="backIcon" size="24"></lucide-icon>
        </button>
        <h1 class="title">Impostazioni</h1>
      </header>

      <div class="settings-list">
        <div class="menu-group">
          <div class="setting-item" (click)="toggleThemeMenu()">
            <div class="circle blue"></div>
            <span>Tema</span>
          </div>
          
          @if (isThemeMenuOpen) {
            <div class="theme-dropdown">
              <div class="theme-option" (click)="selectTheme('light')">Light</div>
              <div class="theme-option" (click)="selectTheme('dark')">Dark</div>
              <div class="theme-option" (click)="selectTheme('orange')">Orange</div>
              <div class="theme-option" (click)="selectTheme('green')">Green</div>
              <div class="theme-option" (click)="selectTheme('purple')">Purple</div>
            </div>
          }
        </div>
        
        <div class="setting-item">
          <div class="circle teal"></div>
          <span>Impostazione calendario</span>
        </div>
        
        <div class="setting-item">
          <div class="circle green"></div>
          <span>Altro</span>
        </div>
        
        <div class="setting-item">
          <div class="circle purple"></div>
          <span>Info app</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      height: 100vh;
      background-color: var(--bg-color);
      padding: 20px;
      transition: background-color 0.3s ease;
    }

    .settings-header {
      background-color: var(--header-bg);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: var(--header-text);
      margin-bottom: 40px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: background-color 0.3s ease;
    }

    .back-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0;
      margin-right: 10px;
    }

    .title {
      flex: 1;
      text-align: center;
      font-size: 1.4rem;
      font-weight: 800;
      margin: 0;
      margin-right: 34px;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
      padding-left: 10px;
    }

    .setting-item span {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-color);
      transition: color 0.3s ease;
    }

    .circle {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }

    .circle.blue { background-color: #5d7a99; }
    .circle.teal { background-color: #14918b; }
    .circle.green { background-color: #b8d0a0; }
    .circle.purple { background-color: #c596c5; }

    .theme-dropdown {
      margin-left: 10px;
      margin-right: 10px;
      border: 3px solid var(--border-color);
      border-radius: 15px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      animation: slideDown 0.2s ease-out;
    }

    .theme-option {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-color);
      cursor: pointer;
      padding: 4px 0;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
  readonly backIcon = ChevronLeft;
  isThemeMenuOpen = false;

  toggleThemeMenu() {
    this.isThemeMenuOpen = !this.isThemeMenuOpen;
  }

  selectTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }
}