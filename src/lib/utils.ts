import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@supabase/supabase-js';
import { useProjectConfigurationState } from './states/useProjectConfigState';
import { OsTypes, PageGroup } from './types';
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

export function getGroupedPages(pages: Page[]): PageGroup[] {
  const pageMap = new Map<string, PageGroup>();

  pages.forEach((page) => {
    pageMap.set(page.id, { ...page, children: [] });
  });

  // Initialize the grouped pages array
  const groupedPages: PageGroup[] = [];

  // Populate the page map with parent-child relationships
  pages.forEach((page) => {
    if (page.parentPage) {
      const parent = pageMap.get(page.parentPage);
      const child = pageMap.get(page.id);
      if (parent && child) {
        parent.children.push(child);
      }
    } else {
      const topLevelPage = pageMap.get(page.id);
      if (topLevelPage) {
        groupedPages.push(topLevelPage);
      }
    }
  });

  return groupedPages;
}

export function hasActiveChildren(pages: PageGroup[], parentId: string): boolean {
  function checkActive(pages: PageGroup[], parentId: string): boolean {
    for (const page of pages) {
      // Check if the current page is the parent we are interested in
      if (page.id === parentId) {
        // If the parent is found, check all its children (including nested children)
        return hasActiveDescendants(page.children || []);
      } else if (page.children) {
        // Recursively check in the children of the current page
        if (checkActive(page.children, parentId)) {
          return true;
        }
      }
    }
    return false;
  }

  function hasActiveDescendants(pages: PageGroup[]): boolean {
    for (const page of pages) {
      if (page.active) {
        return true;
      }
      if (page.children && hasActiveDescendants(page.children)) {
        return true;
      }
    }
    return false;
  }

  return checkActive(pages, parentId);
}

export function getSearchedPages(pages: PageGroup[], pageName: string): PageGroup[] {
  // Helper function to recursively search for pages by name and accumulate results
  function findPages(pages: PageGroup[], pageName: string): PageGroup[] {
    let result: PageGroup[] = [];

    for (const page of pages) {
      // Check if the current page matches the search name
      if (page.name.toLowerCase().includes(pageName)) {
        result.push(page);
      }

      // Recursively search in the children
      const foundInChildren = findPages(page.children, pageName);
      result = result.concat(foundInChildren);
    }

    return result;
  }

  return findPages(pages, pageName);
}

function findPageById(pages: PageGroup[], pageId: string): PageGroup | null {
  for (const page of pages) {
    if (page.id === pageId) {
      return page;
    }
    const childPage = findPageById(page.children, pageId);
    if (childPage) {
      return childPage;
    }
  }
  return null;
}

export function getAllSlugs(pages: PageGroup[], pageId: string): string[] {
  const page = findPageById(pages, pageId);
  if (!page) return [];

  // If the page has no parent, return its own slug
  if (!page.parentPage) {
    return [page.slug];
  }

  const slugs: string[] = [];

  // Helper function to recursively collect slugs
  function collectSlugs(p: PageGroup) {
    slugs.push(p.slug);
    for (const child of p.children) {
      collectSlugs(child);
    }
  }

  collectSlugs(page);

  return slugs;
}
