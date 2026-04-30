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
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session initialization error:', error);
        // Handle invalid/expired JWT (Supabase error code 5100)
        if (error.code === '5100') {
          await supabase.auth.signOut();
        }
        this._user.next(null);
      } else {
        this._user.next(data.session?.user ?? null);
      }
    } catch (err) {
      console.error('Failed to initialize session:', err);
      this._user.next(null);
    }
  }

  getUser(): User | null {
    return this._user.value;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────────
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async updateUserProfile(name: string, email: string) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');

    // Aggiorna email se diversa
    if (email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) throw emailError;
    }

    // Aggiorna profilo
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name, email })
      .eq('id', user.id);

    if (profileError) throw profileError;
    
    // Aggiorna metadati utente
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: name, email_notifications: this._user.value?.user_metadata?.['email_notifications'] || false }
    });
    if (metaError) throw metaError;

    return { error: null };
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return await supabase.auth.updateUser({
      password: newPassword
    });
  }

  async deleteAccount() {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');

    // Elimina dati associati
    await supabase.from('expenses').delete().eq('user_id', user.id);
    await supabase.from('restaurants').delete().eq('user_id', user.id);
    await supabase.from('profiles').delete().eq('id', user.id);
    
    // Disconnette
    return await supabase.auth.signOut();
  }

  // ── Expenses ───────────────────────────────────────────────────────────────
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

  async addExpense(
    amount: number,
    description: string,
    category: string,
    expenseDate?: string,
    restaurantColor?: string
  ) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        amount,
        description,
        category,
        user_id: user.id,
        created_at: expenseDate || null,
        restaurant_color: restaurantColor || '#f97316'
      }])
      .select();

    if (error) throw error;
    return { data, error: null };
  }

  async updateExpense(
    id: string,
    amount: number,
    description: string,
    category: string,
    expenseDate?: string,
    restaurantColor?: string
  ) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');

    const { data, error } = await supabase
      .from('expenses')
      .update({
        amount,
        description,
        category,
        created_at: expenseDate || null,
        restaurant_color: restaurantColor || '#f97316'
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

  // ── Restaurants ─────────────────────────────────────────────────────────────
  async getRestaurants() {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: [], error };
    }
  }

  async addRestaurant(name: string, color: string) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');

    const { data, error } = await supabase
      .from('restaurants')
      .insert([{ name, color, user_id: user.id }])
      .select();

    if (error) throw error;
    return { data, error: null };
  }

  async updateRestaurant(id: string, name: string, color: string) {
    const user = this._user.value;
    if (!user) throw new Error('Utente non autenticato');

    const { data, error } = await supabase
      .from('restaurants')
      .update({ name, color })
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) throw error;
    return { data, error: null };
  }

  async deleteRestaurant(id: string) {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  }
}