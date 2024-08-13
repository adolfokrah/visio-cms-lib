import React from 'react';
import DroppableItem from './droppableItem';
import { Block } from '@/lib/types';
import usePageContent from '@/lib/hooks/usePageContent';
import { cn } from '@/lib/utils';
import { PageBlock } from '@/lib/states/usePagesState';
import BlockAction from './block-action';

export default function BlockItem({
  block,
  index,
  pageBlock,
}: {
  block: Block<Record<string, any>>;
  index: number;
  pageBlock: PageBlock;
}) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const { sendMessageToParent } = usePageContent();
  return (
    <div
      key={pageBlock.id}
      onClick={(e) => {
        e.stopPropagation();
        sendMessageToParent({ type: 'selectBlock', content: pageBlock.id });
      }}
      className={cn('visio-cms-relative')}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('text/plain')) {
          return;
        }
        setIsDraggingOver(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setIsDraggingOver(false);
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
      }}
    >
      {React.createElement(block, { key: block.Schema.id, ...block.Schema.defaultPropValues })}

      <DroppableItem position="top" index={index} showPlaceHolder={isDraggingOver} />
      <DroppableItem position="bottom" index={index + 1} showPlaceHolder={isDraggingOver} />
      <div
        className={cn(
          'visio-cms-absolute visio-cms-top-0 visio-cms-left-0 visio-cms-h-full visio-cms-bg-transparent visio-cms-w-full visio-cms-pointer-events-none',
          {
            'visio-cms-outline-blue-400 visio-cms-outline visio-cms-outline-2 -visio-cms-outline-offset-2 ':
              pageBlock.isSelected,
          },
        )}
      />
      {pageBlock.isSelected && (
        <BlockAction blockName={pageBlock?.globalBlockName || block.Schema.name} index={index} pageBlock={pageBlock} />
      )}
    </div>
  );
}
