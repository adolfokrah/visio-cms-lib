import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@supabase/supabase-js';
import { useProjectConfigurationState } from './states/useProjectConfigState';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getQueryParamsFromUrl(url: string): Record<string, string> {
  const hash = url.split('?')[1];

  if (!hash) return {};

  const params: Record<string, string> = hash.split('&').reduce(
    (acc, param) => {
      const [key, value] = param.split('=');
      if (key !== undefined && value !== undefined) {
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return params;
}

export const supabase = () => {
  const projectConfiguration = useProjectConfigurationState.getState();
  const db = createClient(projectConfiguration.supabaseProjectUrl, projectConfiguration.supabaseAnonKey);
  return db;
};
