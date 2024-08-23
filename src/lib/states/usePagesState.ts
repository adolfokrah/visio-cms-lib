import { create } from 'zustand';
import { RESPONSIVE_VIEWS } from '../constants';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../utils';

const data = [
  { id: '1', name: 'Home page', slug: '/home-page', active: false },
  { id: '2', name: 'About page', slug: '/about-page', active: false },
  { id: '3', name: 'Services page', slug: '/services-page', active: false },
  { id: '4', name: 'Contact page', slug: '/contact-page', active: false },
  { id: '5', name: 'Blog page', slug: '/services-page/blog-page', active: false, parentPage: '3' },
  { id: '6', name: 'Portfolio page', slug: '/services-page/portfolio-page', active: false, parentPage: '3' },
  { id: '7', name: 'Testimonials page', slug: '/testimonials-page', active: false },
  { id: '8', name: 'FAQ page', slug: '/testimonials-page/faq-page', active: false, parentPage: '7' },
  { id: '9', name: 'Pricing page', slug: '/testimonials-page/pricing-page', active: false, parentPage: '7' },
  { id: '10', name: 'Terms and Conditions page', slug: '/terms-conditions-page', active: false },
  { id: '11', name: 'Privacy Policy page', slug: '/privacy-policy-page', active: false },
  { id: '12', name: 'Careers page', slug: '/careers-page', active: false },
  { id: '13', name: 'Support page', slug: '/support-page', active: false },
  { id: '14', name: 'Resources page', slug: '/support-page/resources-page', active: false, parentPage: '13' },
  { id: '15', name: 'Partners page', slug: '/partners-page', active: false },
  { id: '16', name: 'Events page', slug: '/events-page', active: false },
  { id: '17', name: 'Newsletter page', slug: '/events-page/newsletter-page', active: false, parentPage: '16' },
  { id: '18', name: 'Sitemap page', slug: '/sitemap-page', active: false },
  { id: '19', name: 'User Dashboard page', slug: '/user-dashboard-page', active: false },
  { id: '20', name: 'Admin Panel page', slug: '/admin-panel-page', active: false },
  { id: '21', name: 'Settings page', slug: '/admin-panel-page/settings-page', active: false, parentPage: '20' },
  { id: '22', name: 'Help Center page', slug: '/help-center-page', active: false },
  { id: '23', name: 'Contact Us page', slug: '/help-center-page/contact-us-page', active: false, parentPage: '22' },
  { id: '24', name: '404 Not Found page', slug: '/404-not-found-page', active: false },
  { id: '25', name: 'Coming Soon page', slug: '/coming-soon-page', active: false },
  { id: '28', name: 'Accessibility page', slug: '/accessibility-page', active: false },
];

export type ResponsiveView = 'Desktop' | 'Tablet' | 'Mobile';
export type ResponsiveViews = {
  view: ResponsiveView;
  size: string;
  icon: React.ReactNode;
};
export type Status = 'Draft' | 'Publish';
export type SchedulePublished = 'Now' | 'Later';
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
  status: Status;
  schedulePublished: SchedulePublished;
  publishDate?: Date;
  author: {
    first_name: string;
    last_name: string;
    photo: string;
  };
  tags?: string;
  seo?: {
    [key: string]: {
      meta: {
        title: string;
        description: string;
        keywords: string;
        featuredImage?: string;
      };
    };
  };
  blocks?: {
    [key: string]: PageBlock[];
  };
  history?: {
    [key: string]: {
      currentIndex: number;
      blocks: PageBlock[][];
    };
  };
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
};

export const usePagesState = create(
  persist<PagesStateType>(
    (set) => ({
      pages: data.map((page) => ({
        ...page,
        selectedView: RESPONSIVE_VIEWS[0].view,
        activeLanguageLocale: 'en-us',
        pinned: false,
        status: 'Draft',
        schedulePublished: 'Now',
        author: {
          first_name: 'John',
          last_name: 'Doe',
          photo:
            'https://images.squarespace-cdn.com/content/v1/65c0d13a012cd425e009bc0f/eb1f0fb6-0cb0-428b-ad4d-dbeb0d87441e/1+20190913_InnaBell_GlamHeadshot_16873_Retouched_Portfolio.jpg',
        },
      })),
      selectedPage: data.find((page) => page.active)?.name || '',
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
            const { data } = await db
              .from('uploaded_files')
              .select('hashed_file_name')
              .eq('hashed_file_name', featuredImage)
              .single();
            seo[key].meta.featuredImage = data ? data?.hashed_file_name : undefined;
          }
        }
        set((state) => {
          return {
            pages: state.pages.map((page) => (page.id == activePage.id ? { ...page, seo } : page)),
          };
        });
      },
    }),
    {
      name: 'pages-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
