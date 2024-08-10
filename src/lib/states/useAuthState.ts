import { create } from 'zustand';
import { supabase } from '../utils';
import { User } from '@supabase/supabase-js';

type State = {
  user: User | null;
  fetchingUser: boolean;
};

type Actions = {
  fetchUser: () => void;
  clearUser: () => void;
};

export const useAuthState = create<State & Actions>((set) => ({
  user: null,
  fetchingUser: true,
  clearUser: () => {
    set({ user: null });
  },
  fetchUser: async () => {
    const db = supabase();
    const { data, error } = await db.auth.getSession();
    set({ fetchingUser: false });
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      const { data: userData, error } = await db.from('users').select('*').eq('id', data.session?.user?.id).single();
      if (userData && data.session?.user && !error) {
        const user = { ...data.session?.user, user_metadata: userData };
        console.log(user);
        set(() => ({ user }));
      }
    }
  },
}));
