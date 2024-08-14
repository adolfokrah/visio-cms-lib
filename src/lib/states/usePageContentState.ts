import { create } from 'zustand';
import { Page } from './usePagesState';
import { ProjectConfiguration } from '../types';

type State = {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  globalBlocks: ProjectConfiguration['globalBlocks'];
  setGlobalBlocks: (globalBlocks: ProjectConfiguration['globalBlocks']) => void;
};

export const usePageContentState = create<State>((set) => ({
  pages: [],
  setPages: (pages) => set({ pages }),
  globalBlocks: [],
  setGlobalBlocks: (globalBlocks) => set({ globalBlocks }),
}));
