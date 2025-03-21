import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Tab = {
  name: string;
  type: 'page' | 'globalBlock';
  id: string;
  active: boolean;
};
export type TabsState = {
  tabs: Tab[];
  setTabs: (tabs: TabsState['tabs']) => void;
};

export const useTabState = create(
  persist<TabsState>(
    (set) => ({
      tabs: [],
      setTabs: (tabs) => set({ tabs }),
    }),
    {
      name: 'tabs-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
