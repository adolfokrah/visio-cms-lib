import React from 'react';
import DroppableItem from './droppableItem';
import { Block } from '@/lib/types';
import { cn, sendMessageToParent } from '@/lib/utils';
import { PageBlock } from '@/lib/states/usePagesState';
import BlockAction from './block-action';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePageContentState } from '@/lib/states/usePageContentState';
import { useRepeaterState } from '@/lib/states/useRepeaterState';

export default function BlockItem({
  block,
  index,
  pageBlock,
  pageBlocks,
}: {
  block: Block<Record<string, any>>;
  index: number;
  pageBlock: PageBlock;
  pageBlocks: PageBlock[];
}) {
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const { globalBlocks } = usePageContentState();
  const globalBlock = globalBlocks.find((block) => block.id === pageBlock?.globalBlockId);
  const { setRepeaterId } = useRepeaterState();
  const blockInputs = { ...block.Schema.defaultPropValues, ...globalBlock?.inputs, ...pageBlock.inputs };
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setRepeaterId('');
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
      <Popover open={pageBlock?.isSelected}>
        <PopoverTrigger asChild>
          <div className="visio-cms-relative">
            <div className="visio-cms-relative visio-cms-z-0">
              {React.createElement(block, {
                key: block.Schema.id,
                ...blockInputs,
                pageBlockId: pageBlock.id,
              })}
            </div>
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
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="!visio-cms-p-0 visio-cms-w-max"
          align="end"
          side="top"
          alignOffset={20}
          sideOffset={pageBlocks.length < 2 ? -40 : 0}
        >
          <BlockAction
            blockName={globalBlock?.name || block.Schema.name}
            index={index}
            pageBlock={{ ...pageBlock, isGlobalBlock: globalBlock != null }}
            pageBlocks={pageBlocks}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
