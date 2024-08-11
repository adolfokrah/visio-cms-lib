import { SchedulePublished, Status, usePagesState } from '@/lib/states/usePagesState';
import { useCallback, useMemo, useState } from 'react';
import { formatStringToSlug } from '../utils';
export default function usePageSettings() {
  const { pages, setPages } = usePagesState();
  const [error, setError] = useState<string>('');
  const page = useMemo(() => pages.find((page) => page.active), [pages]);

  const updatePageStatus = useCallback(
    (value: Status) => {
      setPages(pages.map((page) => ({ ...page, status: page.active ? (value as Status) : page.status })));
    },
    [pages, setPages],
  );

  const updateSchedulePublished = useCallback(
    (value: SchedulePublished) => {
      setPages(
        pages.map((page) => ({
          ...page,
          schedulePublished: page.active ? (value as SchedulePublished) : page.schedulePublished,
        })),
      );
    },
    [pages, setPages],
  );

  const handleUpdatePageDate = useCallback(
    (value: Date) => {
      setPages(
        pages.map((page) => ({
          ...page,
          publishDate: page.active ? (value as Date) : page.publishDate,
        })),
      );
    },
    [pages, setPages],
  );

  const handleUpdatePageName = useCallback(
    (value: string) => {
      if (!value) {
        setError('Page name can not be empty');
        return;
      }
      const isPageNameExists = pages.find((page) => page.name.toLowerCase() === value.toLowerCase() && !page.active);

      if (isPageNameExists) {
        setError(`Page name ${value} already exists`);
        return;
      }
      setPages(pages.map((page) => ({ ...page, name: page.active ? value : page.name })));
      setError('');
    },
    [pages, setPages],
  );

  const handleUpdatePageTag = useCallback(
    (value: string) => {
      setPages(pages.map((page) => ({ ...page, tags: page.active ? value : page.tags })));
    },
    [pages, setPages],
  );

  const handleUpdatePageSlug = useCallback(
    (value: string) => {
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
      setPages(pages.map((page) => ({ ...page, slug: page.active ? slug : page.slug })));
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
    (value: { title?: string; description?: string; keywords?: string; featuredImage?: string }) => {
      setPages(
        pages.map((page) => ({
          ...page,
          seo: page.active
            ? {
                ...page.seo,
                [page.activeLanguageLocale]: {
                  meta: {
                    title: value.title || page.seo?.[page.activeLanguageLocale]?.meta?.title || '',
                    description: value.description || page.seo?.[page.activeLanguageLocale]?.meta?.description || '',
                    keywords: value.keywords || page.seo?.[page.activeLanguageLocale]?.meta?.keywords || '',
                    featuredImage: page.seo?.[page.activeLanguageLocale]?.meta?.featuredImage,
                  },
                },
              }
            : page.seo,
        })),
      );
    },
    [pages, setPages],
  );

  const updatePageFeaturedImage = (image: string | undefined) => {
    setPages(
      pages.map((page) => ({
        ...page,
        seo: page.active
          ? {
              ...page?.seo,
              [page.activeLanguageLocale]: {
                meta: {
                  title: page.seo?.[page.activeLanguageLocale]?.meta?.title || '',
                  description: page.seo?.[page.activeLanguageLocale]?.meta?.description || '',
                  keywords: page.seo?.[page.activeLanguageLocale]?.meta?.keywords || '',
                  featuredImage: image,
                },
              },
            }
          : page.seo,
      })),
    );
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
