import { create } from 'zustand';
import { PageTreeItem } from '../types';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  items: PageTreeItem[];
  setItems: (items: PageTreeItem[]) => void;
};

export const useTreeView = create(
  persist<State>(
    (set) => ({
      items: [],
      setItems: (items) => set(() => ({ items })),
    }),
    {
      name: 'pageTreeItems-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
