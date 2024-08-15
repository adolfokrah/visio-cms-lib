import { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';

type State = {
  supabase: SupabaseClient<any, 'public', any>;
  setsupabaseDb: (value: SupabaseClient<any, 'public', any>) => void;
};

export const useDbState = create<State>((set) => ({
  supabase: {} as SupabaseClient<any, 'public', any>,
  setsupabaseDb: (supabase) => set(() => ({ supabase })),
}));
