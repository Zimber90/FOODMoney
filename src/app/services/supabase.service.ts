"use client";

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
  
  constructor() {
    // Ascolta i cambiamenti di stato dell'autenticazione
    supabase.auth.onAuthStateChange((_event, session) => {
      this._user.next(session?.user ?? null);
    });
    
    // Recupera la sessione iniziale all'avvio
    this.initializeSession();
  }

  private async initializeSession() {
    const { data: { session } } = await supabase.auth.getSession();
    this._user.next(session?.user ?? null);
  }

  async signIn(email: string) {
    return await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async getExpenses() {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Errore nel recupero spese:', error);
      return { data: [], error };
    }
  }

  async addExpense(amount: number, description: string) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ 
          amount, 
          description, 
          user_id: user.id 
        }])
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Errore nell\'aggiunta spesa:', error);
      throw error;
    }
  }
}