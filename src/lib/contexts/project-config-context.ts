import { createContext } from 'react';
import { ProjectConfiguration } from '../types';

export const ProjectConfigurationContext = createContext<ProjectConfiguration>({
  supabaseProjectUrl: '',
  supabaseAnonKey: '',
});
