import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Menu, X } from 'lucide-angular';
import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, CalendarComponent],
  template: `
    <div class="page-container">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="isSidebarOpen">
        <div class="sidebar-header">
          <h2>Menu</h2>
          <button class="close-btn" (click)="toggleSidebar()">
            <lucide-icon [name]="closeIcon" size="24"></lucide-icon>
          </button>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-link active">Dashboard</a>
          <a class="nav-link">Calendario</a>
          <a class="nav-link">Note</a>
          <div class="divider"></div>
          <a class="nav-link" routerLink="/">Torna alla Home</a>
        </nav>
      </aside>

      <!-- Overlay -->
      @if (isSidebarOpen) {
        <div class="overlay" (click)="toggleSidebar()"></div>
      }

      <!-- Main Content -->
      <main class="main-content">
        <header class="styled-header">
          <button class="menu-trigger" (click)="toggleSidebar()">
            <lucide-icon [name]="menuIcon" size="24"></lucide-icon>
          </button>
          <h1 class="title">Area Operativa</h1>
        </header>

        <div class="content-body">
          <app-calendar></app-calendar>
          
          <div class="quick-actions">
            <p class="hint">Seleziona un giorno per aggiungere una nota o visualizzare gli eventi.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      height: 100vh;
      display: flex;
      overflow: hidden;
      background-color: var(--bg-color);
    }

    /* Sidebar Styles */
    .sidebar {
      position: fixed;
      top: 0;
      left: -280px;
      width: 280px;
      height: 100%;
      background-color: var(--header-bg);
      color: white;
      z-index: 1000;
      transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 15px rgba(0,0,0,0.1);
    }

    .sidebar.open {
      left: 0;
    }

    .sidebar-header {
      padding: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
    }

    .sidebar-nav {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .nav-link {
      padding: 12px 15px;
      border-radius: 12px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-link:hover, .nav-link.active {
      background-color: rgba(255,255,255,0.15);
      color: white;
    }

    .divider {
      height: 1px;
      background-color: rgba(255,255,255,0.1);
      margin: 10px 0;
    }

    /* Overlay */
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.4);
      backdrop-filter: blur(2px);
      z-index: 999;
      animation: fadeIn 0.3s ease;
    }

    /* Main Content Styles */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow-y: auto;
    }

    .styled-header {
      background-color: var(--header-bg);
      border-radius: 50px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: var(--header-text);
      margin-bottom: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      flex-shrink: 0;
    }

    .menu-trigger {
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

    .content-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .quick-actions {
      text-align: center;
      padding: 20px;
    }

    .hint {
      font-size: 0.9rem;
      color: var(--text-color);
      opacity: 0.6;
      font-weight: 600;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class MainComponent {
  readonly menuIcon = Menu;
  readonly closeIcon = X;
  readonly backIcon = ArrowLeft;

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}