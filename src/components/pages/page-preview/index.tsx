import { PAGES } from '@/lib/constants';
import { useAuthState } from '@/lib/states/useAuthState';
import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import React, { useEffect } from 'react';

export default function PagePreview({ id }: { id: string }) {
  const { pages } = usePagesState();
  const { blocks, globalBlocks } = useProjectConfigurationState();
  const { user, fetchingUser, fetchUser } = useAuthState();

  const navigate = (path: string) => {
    window.location.pathname = path;
  };
  useEffect(() => {
    if (fetchingUser) {
      fetchUser();
      return;
    }
    if (!fetchingUser && !user) {
      navigate(PAGES.LOGIN);
    }
  }, [fetchUser, fetchingUser, user]);

  const page = pages.find((page) => page.id === id);
  if (!page) navigate(PAGES.PAGE_NOT_FOUND);

  if (fetchingUser) return null;

  return (
    <>
      {page?.blocks?.[page.activeLanguageLocale]?.map((pageBlock, index) => {
        const { blockId } = pageBlock;

        const foundGlobalBlock = globalBlocks.find((block) => block.id === pageBlock?.globalBlockId);
        const id = foundGlobalBlock?.blockId || blockId;
        const block = blocks.find((block) => block.Schema.id == id);

        if (!block) return null;

        return React.createElement(block, {
          key: `${pageBlock.id}-${index}`,
          ...(foundGlobalBlock?.inputs || pageBlock?.inputs),
          pageBlockId: pageBlock?.id,
        });
      })}
    </>
  );
}
