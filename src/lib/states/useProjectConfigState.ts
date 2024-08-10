import { create } from 'zustand';
import { ProjectConfiguration } from '../types';
import { createJSONStorage, persist } from 'zustand/middleware';

type Actions = {
  setConfiguration: (
    props: Pick<ProjectConfiguration, 'supabaseAnonKey' | 'supabaseProjectUrl' | 'projectId' | 'emailSender'>,
  ) => void;
  setTheme: (props: Pick<ProjectConfiguration, 'theme'>) => void;
};

export const useProjectConfigurationState = create(
  persist<ProjectConfiguration & Actions>(
    (set) => ({
      supabaseAnonKey: '',
      supabaseProjectUrl: '',
      projectId: '',
      bucketName: 'media',
      emailSender: '',
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
      theme: {
        colorScheme: [],
      },
      setTheme: (data) => set(() => data),
    }),
    {
      name: 'project-configuration-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
