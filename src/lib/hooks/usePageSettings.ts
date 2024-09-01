import { SchedulePublished, Status, usePagesState } from '@/lib/states/usePagesState';
import { useCallback, useMemo, useState } from 'react';
import { formatStringToSlug, updatePageData } from '../utils';
import { useTabState } from '../states/useTabsState';
import { toast } from 'sonner';
export default function usePageSettings() {
  const { pages, setPages } = usePagesState();

  const [error, setError] = useState<string>('');
  const page = useMemo(() => pages.find((page) => page.active), [pages]);
  const { tabs, setTabs } = useTabState();

  const updatePageStatus = useCallback(
    async (value: Status) => {
      try {
        const page = pages.find((page) => page.active);
        if (page) {
          const newStatus = page.active ? value : page.status[page.activeLanguageLocale];

          await updatePageData({ status: { ...page.status, [page.activeLanguageLocale]: newStatus } }, page.id);
          setPages(
            pages.map((page) => ({
              ...page,
              status: {
                ...page.status,
                [page.activeLanguageLocale]: newStatus,
              },
            })),
          );
        }
      } catch (error) {
        toast.error('Failed to update page status');
      }
    },
    [pages, setPages],
  );

  const updateSchedulePublished = useCallback(
    async (value: SchedulePublished) => {
      try {
        const page = pages.find((page) => page.active);
        await updatePageData({ schedule_published: value, publish_date: new Date(0) }, page?.id || '');
        setPages(
          pages.map((page) => ({
            ...page,
            schedulePublished: page.active ? (value as SchedulePublished) : page.schedulePublished,
            publishDate: page?.publishDate || new Date(),
          })),
        );
      } catch (error) {
        toast.error('Failed to update schedule published');
      }
    },
    [pages, setPages],
  );

  const handleUpdatePageDate = useCallback(
    async (value: Date) => {
      try {
        const page = pages.find((page) => page.active);
        await updatePageData({ publish_date: value, schedule_published: 'Later' }, page?.id || '');
        setPages(
          pages.map((page) => ({
            ...page,
            publishDate: page.active ? (value as Date) : page.publishDate,
          })),
        );
      } catch (error) {
        toast.error('Failed to update page date');
      }
    },
    [pages, setPages],
  );

  const handleUpdatePageName = useCallback(
    async (value: string) => {
      try {
        if (!value) {
          setError('Page name can not be empty');
          return;
        }
        const isPageNameExists = pages.find((page) => page.name.toLowerCase() === value.toLowerCase() && !page.active);

        if (isPageNameExists) {
          setError(`Page name ${value} already exists`);
          return;
        }
        const page = pages.find((page) => page.active);
        await updatePageData({ name: value }, page?.id || '');
        setPages(pages.map((page) => ({ ...page, name: page.active ? value : page.name })));
        setTabs(tabs.map((tab) => (tab.id === page?.id ? { ...tab, name: value } : tab)));
        setError('');
      } catch (e) {
        toast.error('Failed to update page name');
      }
    },
    [pages, setPages, tabs, setTabs],
  );

  const handleUpdatePageTag = useCallback(
    async (value: string) => {
      try {
        const page = pages.find((page) => page.active);
        await updatePageData({ tags: value }, page?.id || '');
        setPages(pages.map((page) => ({ ...page, tags: page.active ? value : page.tags })));
      } catch (error) {
        toast.error('Failed to update page tag');
      }
    },
    [pages, setPages],
  );

  const handleUpdatePageSlug = useCallback(
    async (value: string) => {
      try {
        const slug = `/${formatStringToSlug(value)}`;
        if (!value) {
          setError('Page slug can not be empty');
          return;
        }
        const isPageNameExists = pages.find((page) => page.slug.toLowerCase() === slug.toLowerCase() && !page.active);

        if (isPageNameExists) {
          setError(`Page slug already exists`);
          return;
        }
        const page = pages.find((page) => page.active);
        await updatePageData({ slug: value }, page?.id || '');
        setPages(pages.map((page) => ({ ...page, slug: page.active ? slug : page.slug })));
      } catch (error) {
        toast.error('Failed to update page slug');
      }
    },
    [pages, setPages],
  );

  const authorInitial = useMemo(() => {
    const author = page?.author;
    if (author) {
      const firstName = author.first_name || '';
      const lastName = author.last_name || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }, [page?.author]);

  const updatePageMeta = useCallback(
    async (value: { title?: string; description?: string; keywords?: string; featuredImage?: string }) => {
      try {
        const page = pages.find((page) => page.active);
        if (!page) return;
        const seo = {
          ...page.seo,
          [page.activeLanguageLocale]: {
            meta: {
              title: value.title || page.seo?.[page.activeLanguageLocale]?.meta?.title || '',
              description: value.description || page.seo?.[page.activeLanguageLocale]?.meta?.description || '',
              keywords: value.keywords || page.seo?.[page.activeLanguageLocale]?.meta?.keywords || '',
              featuredImage: page.seo?.[page.activeLanguageLocale]?.meta?.featuredImage,
            },
          },
        };
        await updatePageData({ seo }, page?.id || '');
        setPages(
          pages.map((page) => ({
            ...page,
            seo: page.active ? seo : page.seo,
          })),
        );
      } catch (error) {
        toast.error('Failed to update page meta');
      }
    },
    [pages, setPages],
  );

  const updatePageFeaturedImage = async (image: string | undefined) => {
    try {
      const page = pages.find((page) => page.active);
      if (!page) return;
      const seo = {
        ...page?.seo,
        [page.activeLanguageLocale]: {
          meta: {
            title: page.seo?.[page.activeLanguageLocale]?.meta?.title || '',
            description: page.seo?.[page.activeLanguageLocale]?.meta?.description || '',
            keywords: page.seo?.[page.activeLanguageLocale]?.meta?.keywords || '',
            featuredImage: image,
          },
        },
      };
      await updatePageData({ seo }, page?.id || '');
      setPages(
        pages.map((page) => ({
          ...page,
          seo: page.active ? seo : page.seo,
        })),
      );
    } catch (error) {
      toast.error('Failed to update page featured image');
    }
  };

  return {
    handleUpdatePageDate,
    updateSchedulePublished,
    updatePageStatus,
    page,
    handleUpdatePageName,
    handleUpdatePageTag,
    handleUpdatePageSlug,
    authorInitial,
    error,
    setError,
    updatePageMeta,
    updatePageFeaturedImage,
  };
}
