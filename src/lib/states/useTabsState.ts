import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  tabs: {
    name: string;
    type: 'page' | 'globalBlock';
    id: string;
    active: boolean;
  }[];
  setTabs: (tabs: State['tabs']) => void;
};

export const useTabState = create(
  persist<State>(
    (set) => ({
      tabs: [],
      setTabs: (tabs) => set({ tabs }),
    }),
    {
      name: 'tabs-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
