import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNewPageFormSchema } from '../zod-schemas';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Page, usePagesState } from '../states/usePagesState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { formatStringToSlug } from '../utils';
import { useAuthState } from '../states/useAuthState';
import { useTreeView } from '../states/useTreeView';
import { PageTreeItem } from '../types';
import { useTabState } from '../states/useTabsState';

export default function usePage({ onPageAdded }: { onPageAdded?: () => void }) {
  const { pages, setPages } = usePagesState();
  const { tabs, setTabs } = useTabState();
  const { defaultLanguage } = useProjectConfigurationState();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const [error, setError] = useState<string>('');
  const { items, setItems } = useTreeView();
  const addPageForm = useForm<z.infer<typeof addNewPageFormSchema>>({
    resolver: zodResolver(addNewPageFormSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const onAddPage = (data: z.infer<typeof addNewPageFormSchema> & { folderId: string }) => {
    setLoading(true);
    setTimeout(() => {
      const pageWithSlugExists = pages.find((page) => page.slug == `/${formatStringToSlug(data.slug)}`);
      if (pageWithSlugExists) {
        setError('Slug already exists');
        setLoading(false);
        return;
      }
      const pageWithNameExists = pages.find((page) => page.name.toLowerCase() == data.name.toLowerCase());
      if (pageWithNameExists) {
        setError('Page with this name already exists');
        setLoading(false);
        return;
      }

      const newPage: Page = {
        id: `${pages.length + 1}`,
        name: data.name,
        slug: `/${formatStringToSlug(data.slug)}`,
        active: true,
        selectedView: 'Desktop',
        activeLanguageLocale: defaultLanguage.locale,
        pinned: true,
        status: 'Draft',
        author: {
          first_name: user?.user_metadata.first_name,
          last_name: user?.user_metadata.last_name,
          photo: user?.user_metadata.photo,
        },
        schedulePublished: 'Now',
        folderId: data.folderId,
      };

      setPages([
        newPage,
        ...pages.map((page) => ({
          ...page,
          active: false,
        })),
      ]);
      setLoading(false);
      if (onPageAdded) onPageAdded();
      addPageForm.reset();
    }, 1000);
  };

  const deletePage = (page: PageTreeItem, withPages: boolean) => {
    setLoading(true);
    setTimeout(() => {
      const newPages = pages.filter((fPage) => (withPages ? fPage.folderId != page.id : fPage.id != page.id));
      setPages(newPages);

      setTabs([...tabs.filter((tab) => tab.id != page.id)]);
      if (page.type == 'Folder') setItems(items.filter((item) => item.id != page.id));
      setLoading(false);
    }, 1000);
  };

  const duplicatePage = ({ page }: { page: Page }) => {
    setLoading(true);
    setTimeout(() => {
      const foundPage = pages.find((fPage) => fPage.id == page.id);

      if (foundPage) {
        const id = `${pages.length + 1}`;
        const slug = `${foundPage.slug}-${id}`;

        setPages([
          ...pages.map((page) => ({ ...page, active: false })),
          {
            ...foundPage,
            id,
            slug: slug,
            name: `${foundPage.name}-${id}`,
            pinned: true,
            active: true,
          },
        ]);
        setTabs([
          ...tabs.map((tab) => ({ ...tab, active: false })),
          { name: `${foundPage.name}-${id}`, type: 'page', id, active: true },
        ]);
      }
      setLoading(false);
    }, 1000);
  };

  return { addPageForm, loading, onAddPage, deletePage, duplicatePage, error, setError };
}
