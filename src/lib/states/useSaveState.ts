import { create } from "zustand";
import {isEqual} from "lodash";

interface PageState {
  isSaving: boolean;
  initialState: Record<string, any> | null;
  isChanged: boolean;
  setSaving: (saving: boolean) => void;
  setInitialState: (state: Record<string, any>) => void;
  checkIfChanged: (currentState: Record<string, any>) => void;
}

export const useSaveState = create<PageState>((set) => ({
  isSaving: false,
  initialState: null,
  isChanged: false,

  setSaving: (saving) => set({ isSaving: saving }),

  setInitialState: (state) => set({ initialState: state, isChanged: false }),

  checkIfChanged: (currentState) => {
    set((state) => ({
      isChanged: !isEqual(state.initialState, currentState),
    }));
  },
}));
