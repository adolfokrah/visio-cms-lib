import { PAGES } from '@/lib/constants';
import { useAuthState } from '@/lib/states/useAuthState';
import { usePagesState } from '@/lib/states/usePagesState';
import { useParamState } from '@/lib/states/useParamState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { getProjectMode } from '@/lib/utils';
import { is } from 'date-fns/locale';
import React, { useEffect } from 'react';

export default function PagePreview({ id }: { id: string }) {
  const { pages } = usePagesState();
  const { blocks, globalBlocks } = useProjectConfigurationState();
  const { user, fetchingUser, fetchUser } = useAuthState();
  const isBuilderMode = getProjectMode() === 'BUILDER';
  const page = pages.find((page) => page.id === id);
  const { setParams } = useParamState();
  const navigate = (path: string) => {
    window.location.pathname = path;
  };
  useEffect(() => {
    if (isBuilderMode) setParams({ locale: page?.activeLanguageLocale });
    if (fetchingUser) {
      fetchUser();
      return;
    }
    if (!fetchingUser && !user) {
      navigate(PAGES.LOGIN);
    }
  }, [fetchUser, fetchingUser, user, isBuilderMode, page, setParams]);

  
  if (!page) navigate(PAGES.PAGE_NOT_FOUND);

  if (fetchingUser) return null;

  return (
    <>
      {page?.blocks?.[page.activeLanguageLocale]?.map((pageBlock, index) => {
        const { blockId } = pageBlock;

        const foundGlobalBlock = globalBlocks.find((block) => block.id === pageBlock?.globalBlockId);
        const id = foundGlobalBlock?.blockId || blockId;
        const block = blocks.find((block) => block.Schema.id == id);
        const inputs = { ...block?.Schema.defaultPropValues, ...pageBlock?.inputs, ...foundGlobalBlock?.inputs };

        if (!block) return null;

        return React.createElement(block, {
          key: `${pageBlock.id}-${index}`,
          ...inputs,
          pageBlockId: pageBlock?.id,
        });
      })}
    </>
  );
}
