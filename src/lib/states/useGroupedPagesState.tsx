import { create } from 'zustand';
import { PageGroup } from '../types';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  groupedPagesState: PageGroup[];
  setGroupedPagesState: (groupedPagesState: PageGroup[]) => void;
};

export const useGroupedPagesState = create(
  persist<State>(
    (set) => ({
      groupedPagesState: [],
      setGroupedPagesState: (groupedPagesState) => set(() => ({ groupedPagesState })),
    }),
    {
      name: 'groupedPages-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
