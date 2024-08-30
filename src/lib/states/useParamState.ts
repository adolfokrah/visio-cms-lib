import { create } from 'zustand';
import { PageData } from '../utils';

type State = {
  params: PageData['params'];
  setParams: (value: PageData['params']) => void;
};

export const useParamState = create<State>((set) => ({
  params: {},
  setParams: (params) => set(() => ({ params })),
}));
