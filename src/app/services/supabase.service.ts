import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  constructor() {
    // Queste variabili verranno popolate automaticamente dopo l'integrazione
    const supabaseUrl = (window as any).env?.SUPABASE_URL || '';
    const supabaseKey = (window as any).env?.SUPABASE_ANON_KEY || '';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._user.next(session?.user ?? null);
    });
  }

  async signIn(email: string) {
    return await this.supabase.auth.signInWithOtp({ email });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getTodos() {
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async addTodo(task: string) {
    const user = this._user.value;
    if (!user) return;
    
    return await this.supabase
      .from('todos')
      .insert([{ task, user_id: user.id }]);
  }
}