import { create } from 'zustand';
import { SideEditingProps } from '../types';
import { persist, createJSONStorage } from 'zustand/middleware';

export type RepeaterSchema = {
  propName: string;
  label: string;
  itemCount?: number;
  schema: Record<string, any>;
  repeaters?: RepeaterSchema[];
  sideEditingProps?: SideEditingProps[];
};

type RepeaterItemSchema = {
  sideEditingProps?: SideEditingProps[];
  repeaterItemId: string;
  subRepeatersSchemas: RepeaterSchema[];
};

export type RepeaterState = {
  repeaterId: string;
  setRepeaterId: (value: string) => void;
  selectedRepeaterItem: RepeaterItemSchema | null;
  setSelectedRepeaterItem: (value: RepeaterItemSchema | null) => void;
  selectedRepeaterItemParentRepeaterItems: RepeaterItemSchema[];
  setSelectedRepeaterItemParentRepeaterItems: (value: RepeaterItemSchema[]) => void;
};

export const useRepeaterState = create(
  persist<RepeaterState>(
    (set) => ({
      repeaterId: '',
      setRepeaterId: (repeaterId) => set(() => ({ repeaterId })),
      selectedRepeaterItem: null,
      setSelectedRepeaterItem: (selectedRepeaterItem) => set(() => ({ selectedRepeaterItem })),
      selectedRepeaterItemParentRepeaterItems: [],
      setSelectedRepeaterItemParentRepeaterItems: (selectedRepeaterItemParentRepeaterItems) =>
        set(() => ({ selectedRepeaterItemParentRepeaterItems })),
    }),
    {
      name: 'repeater-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
