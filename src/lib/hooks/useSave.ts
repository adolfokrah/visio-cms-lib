import { usePagesState } from '@/lib/states/usePagesState';
import { useEffect, useState } from 'react';
import { updateOrInsertProjectConfig, updatePageData as updatePageDataApi } from '@/lib/utils';
import { toast } from 'sonner';
import { useTabState } from '../states/useTabsState';
import { cloneDeep, isEqual } from 'lodash';
import { useProjectConfigurationState } from '../states/useProjectConfigState';

export const useSave = () => {
  const { getActivePage, updatePageData } = usePagesState();
  const { tabs } = useTabState();
  const activeTab = tabs.find((tab) => tab.active);
  const activePage = getActivePage();
  const [isSaving, setSaving] = useState(false);
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const activeGlobalBlock = globalBlocks.find((block) => block.id === activeTab?.id);

  const clonedPage = cloneDeep(activePage);
  const { initialState, ...page } = clonedPage || {};
  const {initialState: initialBlockState, ...globalBlock} = cloneDeep(activeGlobalBlock) || {};
  const isChanged = activeGlobalBlock ? !isEqual(initialBlockState, globalBlock) :  !isEqual(page, initialState);

  useEffect(() => {
    if (activePage && !activePage.initialState) {
      updatePageData({ ...activePage, initialState: cloneDeep(page) });
    }else if(activeGlobalBlock && !activeGlobalBlock.initialState){
      setGlobalBlocks(globalBlocks.map((block) => (block.id === activeTab?.id ? { ...block, initialState: cloneDeep(globalBlock) } : block)));
    }
  }, [activeTab?.id]);

  const onSavePage = async (setAutosave = false) => {
    setSaving(true);
    try {
      if (activePage) {
        await updatePageDataApi(activePage, activePage.id, true);
        toast.success('Page saved successfully');
        updatePageData({ ...activePage, autoSave: setAutosave, initialState: cloneDeep(page) });
      } else {
        setGlobalBlocks(globalBlocks.map((block) => (block.id === activeTab?.id ? { ...block, autoSave: setAutosave, initialState: cloneDeep(globalBlock) } : block)));
        await updateOrInsertProjectConfig({ global_blocks: globalBlocks });
        toast.success('Block saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save');
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
    activeGlobalBlock,
  };
};
