import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../integrations/supabase/client';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();
  
  public isConfigured = true;

  constructor() {
    supabase.auth.onAuthStateChange((event, session) => {
      this._user.next(session?.user ?? null);
    });
  }

  async signIn(email: string) {
    return await supabase.auth.signInWithOtp({ email });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async getExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async addExpense(amount: number, description: string) {
    const user = this._user.value;
    if (!user) return;
    
    return await supabase
      .from('expenses')
      .insert([{ amount, description, user_id: user.id }]);
  }
}