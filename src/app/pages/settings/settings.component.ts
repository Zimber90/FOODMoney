import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronLeft } from 'lucide-angular';

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
        <div class="setting-item">
          <div class="circle blue"></div>
          <span>Tema</span>
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
      background-color: #ffffff;
      padding: 20px;
    }

    .settings-header {
      background-color: #5d7a99;
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: white;
      margin-bottom: 40px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .back-btn {
      background: none;
      border: none;
      color: white;
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
      margin-right: 34px; /* Compensa la larghezza del tasto back per centrare il testo */
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
      padding-left: 10px;
    }

    .setting-item {
      display: flex;
      align-items: center;
      gap: 20px;
      cursor: pointer;
      transition: transform 0.1s;
    }

    .setting-item:active {
      transform: scale(0.98);
    }

    .setting-item span {
      font-size: 1.1rem;
      font-weight: 700;
      color: #000;
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
  `]
})
export class SettingsComponent {
  readonly backIcon = ChevronLeft;
}