import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card" [style.backgroundColor]="note.color">
      <div class="card-header">
        <h3>{{ note.title }}</h3>
        <button (click)="onDelete.emit(note.id)" class="delete-btn">
          <lucide-icon [name]="trashIcon" size="18"></lucide-icon>
        </button>
      </div>
      <p>{{ note.content }}</p>
      <span class="date">{{ note.date | date:'short' }}</span>
    </div>
  `,
  styles: [`
    .card {
      padding: 1.5rem;
      border-radius: 20px;
      color: #1a1a1a;
      box-shadow: 0 8px 20px rgba(0,0,0,0.05);
      transition: transform 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .card:active {
      transform: scale(0.98);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }
    p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      opacity: 0.9;
    }
    .date {
      font-size: 0.75rem;
      opacity: 0.6;
      margin-top: auto;
    }
    .delete-btn {
      background: rgba(255,255,255,0.3);
      border: none;
      padding: 8px;
      border-radius: 12px;
      cursor: pointer;
      color: #1a1a1a;
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() onDelete = new EventEmitter<string>();
  readonly trashIcon = Trash2;
}