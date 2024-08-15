import { create } from 'zustand';
import { ProjectConfiguration } from '../types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useDbState } from './usedbState';
import { createClient } from '@supabase/supabase-js';

type Actions = {
  setConfiguration: (
    props: Pick<
      ProjectConfiguration,
      | 'supabaseAnonKey'
      | 'supabaseProjectUrl'
      | 'projectId'
      | 'emailSender'
      | 'defaultLanguage'
      | 'supportedLanguages'
      | 'blocks'
    >,
  ) => void;
  setTheme: (props: Pick<ProjectConfiguration, 'theme'>) => void;
  setGlobalBlocks: (blocks: ProjectConfiguration['globalBlocks']) => void;
};

export const useProjectConfigurationState = create(
  persist<ProjectConfiguration & Actions>(
    (set) => ({
      supabaseAnonKey: '',
      supabaseProjectUrl: '',
      globalBlocks: [],
      projectId: '',
      bucketName: 'media',
      emailSender: '',
      blocks: [],
      setConfiguration: (data) =>
        set(() => {
          const dbState = useDbState.getState();
          dbState.setsupabaseDb(createClient(data.supabaseProjectUrl, data.supabaseAnonKey));
          return data;
        }),
      defaultLanguage: {
        language: 'English',
        locale: 'en-us',
      },
      supportedLanguages: [],
      theme: {
        colorScheme: [],
      },
      setTheme: (data) => set(() => data),
      setGlobalBlocks: (globalBlocks) => set(() => ({ globalBlocks })),
    }),
    {
      name: 'project-configuration-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
