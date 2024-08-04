import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNewPageFormSchema } from '../zod-schemas';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Page, usePagesState } from '../states/usePagesState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { formatStringToSlug } from '../utils';
import { PageGroup } from '../types';

export default function usePage({ onPageAdded }: { onPageAdded?: () => void }) {
  const { pages, setPages } = usePagesState();
  const { defaultLanguage } = useProjectConfigurationState();
  const [loading, setLoading] = useState(false);
  const addPageForm = useForm<z.infer<typeof addNewPageFormSchema>>({
    resolver: zodResolver(addNewPageFormSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const onAddPage = (data: z.infer<typeof addNewPageFormSchema> & { parentPage: string }) => {
    setLoading(true);
    setTimeout(() => {
      const newPage: Page = {
        id: `${pages.length + 1}`,
        name: data.name,
        slug: `/${formatStringToSlug(data.slug)}`,
        active: true,
        selectedView: 'Desktop',
        activeLanguageLocale: defaultLanguage.locale,
        pinned: true,
      };

      if (data.parentPage.length) newPage.parentPage = data.parentPage;
      setPages([
        newPage,
        ...pages.map((page) => ({
          ...page,
          active: false,
          isExpanded: page.id == data.parentPage ? true : page.isExpanded,
        })),
      ]);
      setLoading(false);
      if (onPageAdded) onPageAdded();
      addPageForm.reset();
    }, 1000);
  };

  const deletePage = (pageId: string) => {
    setLoading(true);
    setTimeout(() => {
      const newPages = pages.filter((page) => page.id != pageId);
      setPages(newPages.map((page) => ({ ...page, parentPage: page.parentPage == pageId ? '' : page.parentPage })));
      setLoading(false);
    }, 1000);
  };

  const duplicatePage = ({ page, isolate = false }: { page: PageGroup; isolate?: boolean }) => {
    setLoading(true);
    setTimeout(() => {
      const foundPage = pages.find((fPage) => fPage.id == page.id);

      if (foundPage) {
        const id = `${pages.length + 1}`;
        const slug = `${foundPage.slug}-${id}`;
        const slugArray = slug.split('/');

        setPages([
          {
            ...foundPage,
            id,
            slug: isolate ? `/${slugArray[slugArray.length - 1]}` : slug,
            name: `${foundPage.name}-${id}`,
            parentPage: isolate ? '' : foundPage.parentPage,
            pinned: true,
            active: true,
          },
          ...pages.map((page) => ({ ...page, active: false })),
        ]);
      }
      setLoading(false);
    }, 1000);
  };

  return { addPageForm, loading, onAddPage, deletePage, duplicatePage };
}
