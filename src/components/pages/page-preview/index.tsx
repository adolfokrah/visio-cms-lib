import { PAGES } from '@/lib/constants';
import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PagePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pages } = usePagesState();
  const { blocks, globalBlocks } = useProjectConfigurationState();

  const page = pages.find((page) => page.id === id);
  if (!page) navigate(PAGES.PAGE_NOT_FOUND);
  return (
    <>
      {page?.blocks?.[page.activeLanguageLocale]?.map((pageBlock) => {
        const { blockId } = pageBlock;
        const block = blocks.find((block) => block.Schema.id === blockId);
        const foundGlobalBlock = globalBlocks.find((block) => block.id === pageBlock?.globalBlockId);

        if (!block) return null;

        return React.createElement(block, {
          key: pageBlock.id,
          ...(foundGlobalBlock?.inputs || pageBlock?.inputs),
          pageBlockId: pageBlock?.id,
        });
      })}
    </>
  );
}
