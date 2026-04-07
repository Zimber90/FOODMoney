import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Menu, X, Plus, Pencil } from 'lucide-angular';
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
          <a class="nav-link" routerLink="/settings" (click)="toggleSidebar()">Impostazioni</a>
          <a class="nav-link" routerLink="/history" (click)="toggleSidebar()">Storico</a>
          <div class="divider"></div>
          <a class="nav-link" routerLink="/" (click)="toggleSidebar()">Torna alla Home</a>
        </nav>
      </aside>

      <!-- Overlay Sidebar -->
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
            <app-calendar [notes]="notes"></app-calendar>
          </section>
          
          <section class="notes-section">
            <button class="add-btn" (click)="openForm()">
              <lucide-icon [name]="plusIcon" size="20"></lucide-icon>
              Aggiungi Nota
            </button>

            <div class="notes-grid">
              @for (note of notes; track note.id) {
                <app-note-card 
                  [note]="note" 
                  (onDelete)="deleteNote($event)"
                  (onEdit)="openForm($event)">
                </app-note-card>
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

      <!-- Pop-up Modal -->
      @if (showForm) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="blue-container">
              <h2 class="modal-title">{{ editingNoteId ? 'MODIFICA NOTA' : 'NUOVA NOTA' }}</h2>
              
              <div class="input-wrapper">
                <input [(ngModel)]="restaurantName" placeholder="NOME RISTORANTE" class="styled-input bold">
              </div>
              
              <div class="input-wrapper">
                <div class="label-input">
                  <span class="label">Data:</span>
                  <input [(ngModel)]="visitDate" type="date" class="styled-input">
                </div>
              </div>

              <div class="input-wrapper">
                <div class="label-input">
                  <span class="label">€</span>
                  <input [(ngModel)]="amount" type="number" placeholder="0.00" class="styled-input">
                </div>
              </div>

              <div class="input-wrapper">
                <div class="color-selector">
                  @for (color of colors; track color) {
                    <div 
                      class="color-circle" 
                      [style.backgroundColor]="color"
                      [class.active]="selectedColor === color"
                      (click)="selectedColor = color">
                    </div>
                  }
                </div>
              </div>
            </div>
            
            <div class="modal-actions">
              <button class="cancel-btn" (click)="closeForm()">Annulla</button>
              <button class="save-btn" (click)="saveNote()" [disabled]="!restaurantName">
                {{ editingNoteId ? 'Aggiorna' : 'Salva' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      height: 100vh;
      display: flex;
      overflow: hidden;
      background-color: var(--bg-color);
    }

    /* Sidebar & Header Styles */
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
    .sidebar.open { left: 0; }
    .sidebar-header { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .sidebar-header h2 { margin: 0; font-size: 1.5rem; font-weight: 800; }
    .close-btn { background: none; border: none; color: white; cursor: pointer; padding: 5px; }
    .sidebar-nav { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
    .nav-link { padding: 12px 15px; border-radius: 12px; color: rgba(255,255,255,0.8); text-decoration: none; font-weight: 600; transition: all 0.2s; cursor: pointer; }
    .nav-link:hover { background-color: rgba(255,255,255,0.15); color: white; }
    .divider { height: 1px; background-color: rgba(255,255,255,0.1); margin: 10px 0; }

    .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 999; }

    .main-content { flex: 1; display: flex; flex-direction: column; padding: 20px; overflow-y: auto; }
    .styled-header { background-color: var(--header-bg); border-radius: 50px; display: flex; align-items: center; padding: 10px 20px; color: var(--header-text); margin-bottom: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); flex-shrink: 0; }
    .menu-trigger { background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; padding: 0; }
    .title { flex: 1; text-align: center; font-size: 1.4rem; font-weight: 800; margin: 0; margin-right: 24px; }

    .content-body { display: flex; flex-direction: column; gap: 30px; padding-bottom: 40px; }

    .add-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background-color: var(--header-bg); color: white; border: none; padding: 14px; border-radius: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 20px; }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      width: 100%;
      max-width: 400px;
      border-radius: 30px;
      padding: 25px;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .modal-title {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 800;
      color: #5d7a99;
      margin-bottom: 15px;
    }

    .blue-container {
      border: 4px solid #5d7a99;
      border-radius: 30px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .input-wrapper {
      width: 100%;
    }

    .styled-input {
      width: 100%;
      border: 3px solid #5d7a99;
      border-radius: 25px;
      padding: 12px 20px;
      font-family: inherit;
      font-size: 1rem;
      outline: none;
      color: #333;
      background: white;
    }

    .styled-input.bold {
      font-weight: 800;
      text-align: center;
    }

    .label-input {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .label {
      font-weight: 800;
      font-size: 1.1rem;
      color: #000;
      min-width: 40px;
    }

    .color-selector {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 5px;
    }

    .color-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.2s;
    }

    .color-circle.active {
      border-color: #5d7a99;
      transform: scale(1.2);
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .modal-actions button {
      flex: 1;
      padding: 12px;
      border-radius: 15px;
      font-weight: 700;
      cursor: pointer;
      border: none;
    }

    .cancel-btn { background: #eee; color: #666; }
    .save-btn { background: #5d7a99; color: white; }
    .save-btn:disabled { opacity: 0.5; }

    .notes-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
    .empty-notes { text-align: center; padding: 40px 20px; background: rgba(0,0,0,0.02); border-radius: 20px; border: 2px dashed rgba(0,0,0,0.05); }
    .empty-notes p { margin: 0; font-weight: 700; color: var(--text-color); opacity: 0.6; }
    .empty-notes .sub { font-size: 0.85rem; font-weight: 600; margin-top: 5px; }

    @keyframes popIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (min-width: 768px) {
      .notes-grid { grid-template-columns: 1fr 1fr; }
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
  
  editingNoteId: string | null = null;
  restaurantName = '';
  visitDate = '';
  amount = '';
  selectedColor = '#FFD1DC';
  
  colors = ['#FFD1DC', '#D1EAFF', '#D1FFD7', '#FFF4D1', '#E8D1FF', '#FFD1D1', '#E2E2E2'];

  ngOnInit() {
    this.notes = this.storage.getNotes();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openForm(note?: Note) {
    this.showForm = true;
    if (note) {
      this.editingNoteId = note.id;
      this.restaurantName = note.restaurantName;
      this.visitDate = note.visitDate;
      this.amount = note.amount;
      this.selectedColor = note.color;
    } else {
      this.editingNoteId = null;
      this.restaurantName = '';
      this.visitDate = new Date().toISOString().split('T')[0];
      this.amount = '';
      this.selectedColor = this.colors[0];
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingNoteId = null;
    this.restaurantName = '';
    this.visitDate = '';
    this.amount = '';
  }

  saveNote() {
    if (!this.restaurantName.trim()) return;

    if (this.editingNoteId) {
      // Aggiorna nota esistente
      this.notes = this.notes.map(n => n.id === this.editingNoteId ? {
        ...n,
        restaurantName: this.restaurantName,
        visitDate: this.visitDate,
        amount: this.amount || '0',
        color: this.selectedColor
      } : n);
    } else {
      // Crea nuova nota
      const newNote: Note = {
        id: Date.now().toString(),
        restaurantName: this.restaurantName,
        visitDate: this.visitDate,
        amount: this.amount || '0',
        timestamp: Date.now(),
        color: this.selectedColor
      };
      this.notes = [newNote, ...this.notes];
    }

    this.storage.saveNotes(this.notes);
    this.closeForm();
  }

  deleteNote(id: string) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.storage.saveNotes(this.notes);
  }
}