import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Menu, X, Plus } from 'lucide-angular';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { NoteCardComponent } from '../../components/note-card/note-card.component';
import { StorageService } from '../../services/storage.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, CalendarComponent, NoteCardComponent],
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
          <a class="nav-link" routerLink="/settings">Impostazioni</a>
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
          <section class="calendar-section">
            <app-calendar></app-calendar>
          </section>
          
          <section class="notes-section">
            <div class="section-header">
              <button class="add-btn" (click)="showForm = !showForm" [class.active]="showForm">
                <lucide-icon [name]="plusIcon" size="20"></lucide-icon>
                {{ showForm ? 'Chiudi' : 'Aggiungi Nota' }}
              </button>
            </div>

            @if (showForm) {
              <div class="note-form card-animation">
                <input [(ngModel)]="newTitle" placeholder="Titolo della nota..." class="form-input title-input">
                <textarea [(ngModel)]="newContent" placeholder="Scrivi qui i tuoi pensieri..." rows="3" class="form-input"></textarea>
                <button class="save-btn" (click)="addNote()" [disabled]="!newTitle || !newContent">
                  Salva Nota
                </button>
              </div>
            }

            <div class="notes-grid">
              @for (note of notes; track note.id) {
                <app-note-card [note]="note" (onDelete)="deleteNote($event)"></app-note-card>
              } @empty {
                <div class="empty-notes">
                  <p>Non ci sono note per oggi.</p>
                  <p class="sub">Clicca su "Aggiungi Nota" per iniziare.</p>
                </div>
              }
            </div>
          </section>
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

    .nav-link:hover {
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
      display: flex;
      flex-direction: column;
      gap: 30px;
      padding-bottom: 40px;
    }

    /* Notes Section Styles */
    .notes-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-header {
      display: flex;
      width: 100%;
    }

    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: var(--header-bg);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 16px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .add-btn.active {
      background-color: #ef4444;
    }

    .note-form {
      background: var(--card-bg);
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 10px 25px var(--card-shadow);
      display: flex;
      flex-direction: column;
      gap: 12px;
      border: 1px solid rgba(128, 128, 128, 0.1);
      transition: background-color 0.3s ease;
    }

    .form-input {
      width: 100%;
      padding: 12px;
      border: 1px solid rgba(128, 128, 128, 0.2);
      background: transparent;
      color: var(--text-color);
      border-radius: 12px;
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      border-color: var(--header-bg);
    }

    .title-input {
      font-weight: 700;
    }

    .save-btn {
      background-color: var(--text-color);
      color: var(--bg-color);
      border: none;
      padding: 12px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .save-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .empty-notes {
      text-align: center;
      padding: 40px 20px;
      background: rgba(128, 128, 128, 0.05);
      border-radius: 20px;
      border: 2px dashed rgba(128, 128, 128, 0.1);
    }

    .empty-notes p {
      margin: 0;
      font-weight: 700;
      color: var(--text-color);
      opacity: 0.6;
    }

    .empty-notes .sub {
      font-size: 0.85rem;
      font-weight: 600;
      margin-top: 5px;
    }

    .card-animation {
      animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (min-width: 768px) {
      .notes-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class MainComponent implements OnInit {
  private storage = inject(StorageService);

  readonly menuIcon = Menu;
  readonly closeIcon = X;
  readonly backIcon = ArrowLeft;
  readonly plusIcon = Plus;

  isSidebarOpen = false;
  showForm = false;
  notes: Note[] = [];
  
  newTitle = '';
  newContent = '';
  colors = ['#FFD1DC', '#D1EAFF', '#D1FFD7', '#FFF4D1', '#E8D1FF'];

  ngOnInit() {
    this.notes = this.storage.getNotes();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  addNote() {
    if (!this.newTitle.trim() || !this.newContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: this.newTitle,
      content: this.newContent,
      date: Date.now(),
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    };

    this.notes = [newNote, ...this.notes];
    this.storage.saveNotes(this.notes);
    
    this.newTitle = '';
    this.newContent = '';
    this.showForm = false;
  }

  deleteNote(id: string) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.storage.saveNotes(this.notes);
  }
}