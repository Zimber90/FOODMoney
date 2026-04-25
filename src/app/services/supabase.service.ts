import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();
  
  public isConfigured = false;

  constructor() {
    const supabaseUrl = (window as any).env?.SUPABASE_URL;
    const supabaseKey = (window as any).env?.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '') {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isConfigured = true;
        
        this.supabase.auth.onAuthStateChange((event, session) => {
          this._user.next(session?.user ?? null);
        });
      } catch (e) {
        console.error('Errore inizializzazione Supabase:', e);
      }
    }
  }

  async signIn(email: string) {
    if (!this.supabase) throw new Error('Supabase non configurato');
    return await this.supabase.auth.signInWithOtp({ email });
  }

  async signOut() {
    if (!this.supabase) return;
    return await this.supabase.auth.signOut();
  }

  async getTodos() {
    if (!this.supabase) return { data: [], error: 'Non configurato' };
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async addTodo(task: string) {
    const user = this._user.value;
    if (!user || !this.supabase) return;
    
    return await this.supabase
      .from('todos')
      .insert([{ task, user_id: user.id }]);
  }
}