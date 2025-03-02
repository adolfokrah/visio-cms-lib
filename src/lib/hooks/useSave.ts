import { usePagesState } from '@/lib/states/usePagesState';
import { useEffect, useState } from 'react';
import { updatePageData as updatePageDataApi } from '@/lib/utils';
import { toast } from 'sonner';
import { useTabState } from '../states/useTabsState';
import { cloneDeep, isEqual } from 'lodash';

export const useSave = () => {
  const { getActivePage, updatePageData } = usePagesState();
  const { tabs } = useTabState();
  const activeTab = tabs.find((tab) => tab.active);
  const activePage = getActivePage();
  const [isSaving, setSaving] = useState(false);

  const clonedPage = cloneDeep(activePage);
  const { initialState, ...page } = clonedPage || {};
  const isChanged = !isEqual(page, initialState);

  useEffect(() => {
    if (activePage && !activePage.initialState) {
      updatePageData({ ...activePage, initialState: cloneDeep(page) });
    }
  }, [activeTab?.id]);

  const onSavePage = async () => {
    setSaving(true);
    try {
      if (activePage) {
        await updatePageDataApi(activePage, activePage.id, true);
        toast.success('Page saved successfully');
        updatePageData({ ...activePage, initialState: cloneDeep(page) });
        setSaving(false);
      }
    } catch (error) {
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return {
    isSaving,
    isChanged,
    onSavePage,
    updatePageData,
    activePage,
  };
};
