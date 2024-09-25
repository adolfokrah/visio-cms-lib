import { create } from 'zustand';

export type SelectedBlock = {
    id: string;
    parent?: string
    propName?: string
} | null

export type SelectedBlockState = {
  selectedBlock: SelectedBlock,
  setSelectedBlock: (selectedBlock: SelectedBlock )=> void
}

export const useSelectedBlockState = create<SelectedBlockState>((set) => ({
    selectedBlock: null,
    setSelectedBlock: (selectedBlock) => set(() => ({ selectedBlock })),
}));