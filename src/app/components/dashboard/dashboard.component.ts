import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Note } from '../../models/note.model';
import { NoteCardComponent } from '../note-card/note-card.component';
import { LucideAngularModule, Plus, ShieldCheck, WifiOff } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteCardComponent, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private storage = inject(StorageService);
  
  notes: Note[] = [];
  newTitle = '';
  newContent = '';
  showForm = false;

  readonly plusIcon = Plus;
  readonly shieldIcon = ShieldCheck;
  readonly offlineIcon = WifiOff;

  colors = ['#FFD1DC', '#D1EAFF', '#D1FFD7', '#FFF4D1', '#E8D1FF'];

  ngOnInit() {
    this.notes = this.storage.getNotes();
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