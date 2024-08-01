import { create } from 'zustand';
import { ProjectConfiguration } from '../types';

type Actions = {
  setConfiguration: (props: ProjectConfiguration) => void;
};

export const useProjectConfigurationState = create<ProjectConfiguration & Actions>((set) => ({
  supabaseAnonKey: '',
  supabaseProjectUrl: '',
  setConfiguration: (data) => set(() => data),
}));
