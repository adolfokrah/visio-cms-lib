import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNewPageFormSchema } from '../zod-schemas';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Page, usePagesState } from '../states/usePagesState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { formatStringToSlug, supabase } from '../utils';
import { useAuthState } from '../states/useAuthState';
import { useTreeView } from '../states/useTreeView';
import { PageTreeItem } from '../types';
import { useTabState } from '../states/useTabsState';
import { toast } from 'sonner';

export default function usePage({ onPageAdded }: { onPageAdded?: () => void }) {
  const { pages, setPages } = usePagesState();
  const { tabs, setTabs } = useTabState();
  const { defaultLanguage } = useProjectConfigurationState();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const [error, setError] = useState<string>('');
  const { items, setItems } = useTreeView();
  const db = supabase();
  const addPageForm = useForm<z.infer<typeof addNewPageFormSchema>>({
    resolver: zodResolver(addNewPageFormSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const onAddPage = async (data: z.infer<typeof addNewPageFormSchema> & { folderId: string }) => {
    setLoading(true);
    try {
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

      const { error, data: pageData } = await db
        .from('pages')
        .insert({
          name: newPage.name,
          slug: newPage.slug,
          status: newPage.status,
          author: user?.user_metadata.id,
          tags: '',
          seo: {},
          blocks: [],
          folder_id: newPage?.folderId || null,
          schedule_published: newPage.schedulePublished,
          publish_date: newPage.publishDate,
        })
        .select();

      if (error) throw error;
      newPage.id = pageData?.[0].id;

      setPages([
        newPage,
        ...pages.map((page) => ({
          ...page,
          active: false,
        })),
      ]);
      setLoading(false);
      setTabs([
        ...tabs.map((tab) => ({ ...tab, active: false })),
        { name: newPage.name, type: 'page', id: newPage.id, active: true },
      ]);
      if (onPageAdded) onPageAdded();
      addPageForm.reset();
    } catch (error) {
      setError('Failed to add page');
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (page: PageTreeItem, withPages: boolean) => {
    setLoading(true);
    try {
      if (page.type == 'Folder') {
        if (withPages) {
          const { error, data } = await db.from('pages').delete().eq('folder_id', page.id).select();
          if (error) throw error;

          const { error: deleteError } = await db.from('pages_scheduled_publish').delete().eq('page_id', data[0].id);
          if (deleteError) throw deleteError;
        } else {
          const { error } = await db.from('pages').update({ folder_id: null }).eq('folder_id', page.id);
          if (error) throw error;
        }
        const { error } = await db.from('folders').delete().eq('id', page.id);
        if (error) throw error;
      } else {
        const { error, data } = await db.from('pages').delete().eq('id', page.id).select();
        if (error) throw error;
        const { error: deleteError } = await db.from('pages_scheduled_publish').delete().eq('page_id', data[0].id);
        if (deleteError) throw deleteError;
      }
      const pagesInFolder = pages.filter((fPage) => fPage.folderId == page.id).map((page) => page.id);

      const newPages = pages.filter((fPage) => (withPages ? fPage.folderId != page.id : fPage.id != page.id));
      setPages(newPages);

      const newTabs = [...tabs.filter((tab) => (withPages ? !pagesInFolder.includes(tab.id) : tab.id != page.id))];
      const newItems = items.filter((item) => item.id != page.id);
      setItems(newItems);
      setTabs(newTabs);
    } catch (error) {
      toast.error(`Failed to delete ${page.type === 'Folder' ? 'folder' : 'page'}`);
    } finally {
      setLoading(false);
    }
  };

  const duplicatePage = async ({ page }: { page: Page }) => {
    setLoading(true);
    try {
      const foundPage = pages.find((fPage) => fPage.id == page.id);

      if (foundPage) {
        const id = `${pages.length + 1}`;
        const slug = `${foundPage.slug}-${id}`;
        const newPage = {
          ...foundPage,
          id,
          slug: slug,
          name: `${foundPage.name}-${id}`,
        };

        const { error, data } = await db
          .from('pages')
          .insert({
            name: newPage.name,
            slug: newPage.slug,
            status: newPage.status,
            author: user?.user_metadata.id,
            tags: newPage.tags,
            seo: newPage.seo,
            blocks: newPage.blocks,
            folder_id: newPage.folderId,
            schedule_published: newPage.schedulePublished,
            publish_date: newPage.publishDate,
          })
          .select();

        if (error) throw error;
        newPage.id = data?.[0].id;

        setPages([
          ...pages.map((page) => ({ ...page, active: false })),
          {
            ...newPage,
            pinned: true,
            active: true,
          },
        ]);
        setTabs([
          ...tabs.map((tab) => ({ ...tab, active: false })),
          { name: newPage.name, type: 'page', id: newPage.id, active: true },
        ]);
      }
    } catch (error) {
      setError('Failed to duplicate page');
    } finally {
      setLoading(false);
    }
  };

  return { addPageForm, loading, onAddPage, deletePage, duplicatePage, error, setError };
}
