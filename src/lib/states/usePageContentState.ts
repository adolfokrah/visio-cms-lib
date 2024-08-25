import { create } from 'zustand';
import { Page } from './usePagesState';
import { ProjectConfiguration } from '../types';
import { TabsState } from './useTabsState';
import { ListStateType } from './useListState';

type State = {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  globalBlocks: ProjectConfiguration['globalBlocks'];
  setGlobalBlocks: (globalBlocks: ProjectConfiguration['globalBlocks']) => void;
  tabs: TabsState['tabs'];
  setTabs: (tabs: TabsState['tabs']) => void;
  selectedListItem: ListStateType['selectedListItem'];
  setSelectedListItem: ListStateType['setSelectedListItem'];
};

export const usePageContentState = create<State>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  globalBlocks: [],
  setGlobalBlocks: (globalBlocks) => set({ globalBlocks }),
  tabs: [],
  setTabs: (tabs) => set({ tabs }),
  selectedListItem: null,
  setSelectedListItem: (selectedListItem) => set({ selectedListItem }),
}));
