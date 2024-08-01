import { create } from 'zustand';
import { supabase } from '../utils';
import { User } from '@supabase/supabase-js';

type State = {
  user: User | null;
  fetchingUser: boolean;
};

type Actions = {
  fetchUser: () => void;
};

export const useAuthState = create<State & Actions>((set) => ({
  user: null,
  fetchingUser: true,
  fetchUser: async () => {
    const db = supabase();
    const { data, error } = await db.auth.getUser();
    if (error) {
      return;
    }
    if (data) {
      set({ user: data.user, fetchingUser: false });
    }
  },
}));
