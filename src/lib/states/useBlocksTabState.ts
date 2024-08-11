import { create } from 'zustand';

type State = {
  expandedGroups: string[];
  setExpandedGroups: (value: string[]) => void;
};

export const useBlocksTabState = create<State>((set) => ({
  expandedGroups: [],
  setExpandedGroups: (expandedGroups) => set(() => ({ expandedGroups })),
}));
