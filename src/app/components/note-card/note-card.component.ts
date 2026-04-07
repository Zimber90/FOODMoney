import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { LucideAngularModule, Trash2, Pencil } from 'lucide-angular';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card" [style.backgroundColor]="note.color">
      <div class="card-header">
        <h3>{{ note.restaurantName }}</h3>
        <div class="actions">
          <button (click)="onEdit.emit(note)" class="action-btn edit">
            <lucide-icon [name]="editIcon" size="18"></lucide-icon>
          </button>
          <button (click)="onDelete.emit(note.id)" class="action-btn delete">
            <lucide-icon [name]="trashIcon" size="18"></lucide-icon>
          </button>
        </div>
      </div>
      <div class="card-details">
        <p><strong>Data:</strong> {{ note.visitDate }}</p>
        <p class="amount"><strong>€</strong> {{ note.amount }}</p>
      </div>
      <span class="date-added">{{ note.timestamp | date:'short' }}</span>
    </div>
  `,
  styles: [`
    .card {
      padding: 1.5rem;
      border-radius: 20px;
      color: #1a1a1a;
      box-shadow: 0 8px 20px var(--card-shadow);
      transition: transform 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      border: 1px solid rgba(0,0,0,0.05);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      text-transform: uppercase;
    }
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
    }
    .amount {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .date-added {
      font-size: 0.7rem;
      opacity: 0.5;
      margin-top: 8px;
    }
    .action-btn {
      background: rgba(255,255,255,0.4);
      border: none;
      padding: 8px;
      border-radius: 12px;
      cursor: pointer;
      color: #1a1a1a;
      display: flex;
      transition: background 0.2s;
    }
    .action-btn:hover {
      background: rgba(255,255,255,0.6);
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<Note>();
  
  readonly trashIcon = Trash2;
  readonly editIcon = Pencil;
}