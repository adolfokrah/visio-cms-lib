import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNewPageFormSchema } from '../zod-schemas';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Page, usePagesState } from '../states/usePagesState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';

export default function useAddPage({ onPageAdded }: { onPageAdded: () => void }) {
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
        slug: data.slug,
        active: true,
        selectedView: 'Desktop',
        activeLanguageLocale: defaultLanguage.locale,
        pinned: true,
      };
      if (data.parentPage.length) newPage.parentPage = data.parentPage;
      setPages([newPage, ...pages.map((page) => ({ ...page, active: false }))]);
      setLoading(false);
      onPageAdded();
      addPageForm.reset();
    }, 1000);
  };

  return { addPageForm, loading, onAddPage };
}
