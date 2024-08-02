import { create } from 'zustand';
import { ProjectConfiguration } from '../types';

type Actions = {
  setConfiguration: (props: ProjectConfiguration) => void;
};

export const useProjectConfigurationState = create<ProjectConfiguration & Actions>((set) => ({
  supabaseAnonKey: '',
  supabaseProjectUrl: '',
  setConfiguration: (data) => set(() => data),
  defaultLanguage: {
    language: 'English',
    locale: 'en-us',
  },
  supportedLanguages: [
    {
      language: 'English',
      locale: 'en-us',
    },
    {
      language: 'Spanish',
      locale: 'es',
    },
    {
      language: 'French',
      locale: 'fr',
    },
    {
      language: 'German',
      locale: 'de',
    },
    {
      language: 'Finish',
      locale: 'fi',
    },
  ],
}));
