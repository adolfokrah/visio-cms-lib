import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SelectedListitem = {
  pageBlockId: string;
  propName: string;
};

export type ListStateType = {
  selectedListItem: SelectedListitem | null;
  setSelectedListItem: (value: SelectedListitem | null) => void;
};

export const useListState = create(
  persist<ListStateType>(
    (set) => ({
      selectedListItem: null,
      setSelectedListItem: (selectedListItem) => set(() => ({ selectedListItem })),
    }),
    {
      name: 'list-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
