import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../utils';
import { Language } from '../types';

export type ResponsiveView = 'Desktop' | 'Tablet' | 'Mobile';
export type ResponsiveViews = {
  view: ResponsiveView;
  size: string;
  icon: React.ReactNode;
};
export type Status = 'Draft' | 'Publish' | 'Schedule';
export type PageBlock = {
  id: string;
  isGlobalBlock?: boolean;
  globalBlockId?: string;
  blockId: string;
  isSelected: boolean;
  inputs: { [key: string]: any };
};
export type Page = {
  id: string;
  name: string;
  active: boolean;
  selectedView: ResponsiveView;
  slug: string;
  canvasSettings?: {
    scale: number;
    positionX: number;
    positionY: number;
  };
  activeLanguageLocale: string;
  folderId?: string;
  pinned: boolean;
  isExpanded?: boolean;
  status: {
    [key: Language['locale']]: Status;
  };
  publishDate?: Date | null;
  author: {
    first_name: string;
    last_name: string;
    photo: string;
  };
  tags?: string;
  seo?: {
    [key: Language['locale']]: {
      meta: {
        title: string;
        description: string;
        keywords: string;
        featuredImage?: string;
      };
    };
  };
  blocks?: {
    [key: Language['locale']]: PageBlock[];
  };
  history?: {
    [key: Language['locale']]: {
      currentIndex: number;
      blocks: PageBlock[][];
    };
  };
  autoSave: boolean;
  initialState: Record<string, any> | null;
};

type PagesStateType = {
  pages: Page[];
  selectedPage: string;
  setSelectedPage: (name: string) => void;
  setPageResponsiveView: (view: ResponsiveView) => void;
  setPages: (pages: Page[]) => void;
  pageSwitched?: boolean;
  setPageSwitched: (flag: boolean) => void;
  setPageSeoFeaturedImages: (activePage: Page) => void;
  updatePageData: (page: Page) => void;
  getActivePage: () => Page | null;
};

export const usePagesState = create(
  persist<PagesStateType>(
    (set, get) => ({
      pages: [],
      selectedPage: '',
      setSelectedPage: (selectedPage) => set(() => ({ selectedPage, pageSwitched: true })),
      pageSwitched: false,
      setPageSwitched: (pageSwitched) => set(() => ({ pageSwitched })),
      setPageResponsiveView: (view) =>
        set((state) => {
          return {
            pages: state.pages.map((page) => ({
              ...page,
              selectedView: state.selectedPage == page.name ? view : page.selectedView,
            })),
          };
        }),
      setPages: (pages) => set(() => ({ pages, selectedPage: pages.find((page) => page.active)?.name || '' })),
      setPageSeoFeaturedImages: async (activePage: Page) => {
        const db = supabase();
        const seo = activePage?.seo;

        if (seo && Object.keys(seo).length) {
          for (const key of Object.keys(seo)) {
            const featuredImage = seo[key]?.meta.featuredImage;
            if (!featuredImage) continue;
            const { data } = await db
              .from('uploaded_files')
              .select('hashed_file_name')
              .eq('hashed_file_name', featuredImage)
              .single();
            seo[key].meta.featuredImage = data
              ? data?.hashed_file_name
              : featuredImage?.startsWith('http')
                ? featuredImage
                : undefined;
          }
        }
        set((state) => {
          return {
            pages: state.pages.map((page) => (page.id == activePage.id ? { ...page, seo } : page)),
          };
        });
      },
      updatePageData: (page) =>
        set((state) => {
          return {
            pages: state.pages.map((p) => (p.id === page.id ? page : p)),
          };
        }),
      getActivePage: () => {
        const state = get();
        return state.pages.find((page) => page.name === state.selectedPage) || null;
      },
    }),
    {
      name: 'pages-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
