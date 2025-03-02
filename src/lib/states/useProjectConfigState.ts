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
      | 'allowImageTransformation'
      | 'unsplashAccessKey'
    >,
  ) => void;
  setTheme: (props: ProjectConfiguration['theme']) => void;
  setGlobalBlocks: (blocks: ProjectConfiguration['globalBlocks']) => void;
};

export const useProjectConfigurationState = create(
  persist<ProjectConfiguration & Actions>(
    (set) => ({
      allowImageTransformation: false,
      supabaseAnonKey: '',
      supabaseProjectUrl: '',
      globalBlocks: [],
      projectId: '',
      bucketName: 'media',
      unsplashAccessKey: '',
      emailSender: '',
      scripts: {
        head: '',
        body: '',
      },
      setScripts: (scripts) => set({ scripts }),
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
      setTheme: (theme) => set(() => ({ theme })),
      setGlobalBlocks: (globalBlocks) => set(() => ({ globalBlocks })),
      routeHandlers: async () => null,
    }),
    {
      name: 'project-configuration-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
