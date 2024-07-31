import { createClient } from '@supabase/supabase-js';
import { ProjectConfigurationContext } from '../contexts/project-config-context';
import { useContext, useMemo } from 'react';

export default function useDb() {
  const projectConfiguration = useContext(ProjectConfigurationContext);
  const db = useMemo(
    () => createClient(projectConfiguration.supabaseProjectUrl, projectConfiguration.supabaseAnonKey),
    [projectConfiguration],
  );
  return db;
}
