import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@supabase/supabase-js';
import { useProjectConfigurationState } from './states/useProjectConfigState';
import { Folder, OsTypes, PageTreeItem } from './types';
import { Page } from './states/usePagesState';

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

export const mapScaleToPercentage = (scale: number): number => {
  // Define the range boundaries
  const minScale = 1;
  const maxScale = 8;
  const minPercentage = 10;
  const maxPercentage = 100;

  // Ensure scale is within the range of 1 to 8
  if (scale < minScale) {
    scale = minScale;
  } else if (scale > maxScale) {
    scale = maxScale;
  }

  // Calculate percentage
  const percentage = ((scale - minScale) / (maxScale - minScale)) * (maxPercentage - minPercentage) + minPercentage;
  return Math.round(percentage);
};

export const getOS = (): OsTypes => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('macintosh') || userAgent.includes('mac os x')) {
    return 'mac';
  }
  if (userAgent.includes('windows nt')) {
    return 'windows';
  }
  return 'unknown'; // Fallback for unknown OS
};

export function generateTree(treeItems: PageTreeItem[], pages: Page[]): PageTreeItem[] {
  const folders = treeItems.filter((item) => item.type === 'Folder') as Folder[];
  const pageWithNoFolders = pages.filter((page) => !folders.find((folder) => folder.id === page.folderId));
  const pagesWithFolders = pages.filter((page) => folders.find((folder) => folder.id === page.folderId));

  folders.forEach((item) => {
    const children = pagesWithFolders.filter((page) => page.folderId === item.id);
    item.children = children.map((page) => ({ ...page, type: 'Page' }));
    item.isExpanded = item.children.find((child) => child.type === 'Page' && child.active) ? true : item.isExpanded;
  });

  const tree = [
    ...folders.map((folder) => ({
      ...folder,
      type: 'Folder',
    })),
    ...pageWithNoFolders.map((page) => ({ ...page, type: 'Page' })),
  ] as PageTreeItem[];
  return tree;
}

export function formatStringToSlug(str: string): string {
  return str
    .replace(/^\/+|\/+$/g, '') // Remove leading and trailing slashes
    .replace(/\/{2,}/g, '/') // Replace multiple consecutive slashes with a single slash
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/\/+$/g, '') // Remove trailing slashes after replacement
    .replace(/^\/+/g, ''); // Remove leading slashes after replacement
}
