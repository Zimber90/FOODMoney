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
    supabase.auth.onAuthStateChange((_event, session) => {
      this._user.next(session?.user ?? null);
    });
    this.initializeSession();
  }

  private async initializeSession() {
    const { data: { session } } = await supabase.auth.getSession();
    this._user.next(session?.user ?? null);
  }

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
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
      return { data: [], error };
    }
  }

  async addExpense(amount: number, description: string, category: string, expenseDate?: string) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ 
        amount, 
        description, 
        category,
        user_id: user.id,
        created_at: expenseDate || null
      }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  }

  async updateExpense(id: string, amount: number, description: string, category: string, expenseDate?: string) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');
    
    const { data, error } = await supabase
      .from('expenses')
      .update({ 
        amount, 
        description, 
        category,
        created_at: expenseDate || null 
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  }

  async deleteExpense(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  }
}