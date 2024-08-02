import { createContext } from 'react';
import { ProjectConfiguration } from '../types';

export const ProjectConfigurationContext = createContext<
  Pick<ProjectConfiguration, 'supabaseAnonKey' | 'supabaseProjectUrl'>
>({
  supabaseProjectUrl: '',
  supabaseAnonKey: '',
});
