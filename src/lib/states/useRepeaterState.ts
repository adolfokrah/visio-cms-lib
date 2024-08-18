import { create } from 'zustand';
import { SideEditingProps } from '../types';

export type RepeaterSchema = {
  propName: string;
  name: string;
  itemCount?: number;
  schema: Record<string, any>;
};

type State = {
  repeaterId: string;
  setRepeaterId: (value: string) => void;
  selectedRepeaterItem: {
    sideEditingProps?: SideEditingProps[];
    repeaterItemId: string;
    subRepeatersSchemas: RepeaterSchema[];
  } | null;
  setSelectedRepeaterItem: (
    value: {
      repeaterItemId: string;
      subRepeatersSchemas: RepeaterSchema[];
      sideEditingProps: SideEditingProps[];
    } | null,
  ) => void;
};

export const useRepeaterState = create<State>((set) => ({
  repeaterId: '',
  setRepeaterId: (repeaterId) => set(() => ({ repeaterId })),
  selectedRepeaterItem: null,
  setSelectedRepeaterItem: (selectedRepeaterItem) => set(() => ({ selectedRepeaterItem })),
}));
