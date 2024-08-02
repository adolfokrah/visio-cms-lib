import { create } from 'zustand';
import { RESPONSIVE_VIEWS } from '../constants';
import { persist, createJSONStorage } from 'zustand/middleware';
const data = [
  { name: 'Home page', active: false },
  { name: 'About page', active: true },
  { name: 'Services page', active: false },
  { name: 'Contact page', active: false },
  { name: 'Blog page', active: false },
  { name: 'Portfolio page', active: false },
  { name: 'Testimonials page', active: false },
  { name: 'FAQ page', active: false },
  { name: 'Pricing page', active: false },
  { name: 'Terms and Conditions page', active: false },
  { name: 'Privacy Policy page', active: false },
  { name: 'Careers page', active: false },
  { name: 'Support page', active: false },
  { name: 'Resources page', active: false },
  { name: 'Partners page', active: false },
  { name: 'Events page', active: false },
  { name: 'Newsletter page', active: false },
  { name: 'Sitemap page', active: false },
  { name: 'User Dashboard page', active: false },
  { name: 'Admin Panel page', active: false },
  { name: 'Settings page', active: false },
  { name: 'Help Center page', active: false },
  { name: 'Contact Us page', active: false },
  { name: '404 Not Found page', active: false },
  { name: 'Coming Soon page', active: false },
  { name: 'Accessibility page', active: false },
];

export type ResponsiveView = 'Desktop' | 'Tablet' | 'Mobile';
export type ResponsiveViews = {
  view: ResponsiveView;
  size: string;
  icon: React.ReactNode;
};
export type Page = {
  name: string;
  active: boolean;
  selectedView: ResponsiveView;
  canvasSettings?: {
    scale: number;
    positionX: number;
    positionY: number;
  };
};

type PagesStateType = {
  pages: Page[];
  selectedPage: string;
  setSelectedPage: (name: string) => void;
  setPageResponsiveView: (view: ResponsiveView) => void;
  setPages: (pages: Page[]) => void;
};

export const usePagesState = create(
  persist<PagesStateType>(
    (set) => ({
      pages: data.map((page) => ({ ...page, selectedView: RESPONSIVE_VIEWS[0].view })),
      selectedPage: data.find((page) => page.active)?.name || '',
      setSelectedPage: (selectedPage) => set(() => ({ selectedPage })),
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
    }),
    {
      name: 'pages-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
