import { PAGES } from '@/lib/constants';
import { useAuthState } from '@/lib/states/useAuthState';
import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PagePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pages } = usePagesState();
  const { blocks, globalBlocks } = useProjectConfigurationState();
  const { user } = useAuthState();
  useEffect(() => {
    if (!user) {
      navigate(PAGES.LOGIN);
    }
  }, [user, navigate]);

  const page = pages.find((page) => page.id === id);
  if (!page) navigate(PAGES.PAGE_NOT_FOUND);
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
