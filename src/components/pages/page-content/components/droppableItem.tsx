import { cn, sendMessageToParent } from '@/lib/utils';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function DroppableItem({
  position,
  index,
  showPlaceHolder,
  propName,
  pageBlockId,
}: {
  position: 'top' | 'bottom' | 'left' | 'right';
  index: number;
  showPlaceHolder: boolean;
  propName?: string;
  pageBlockId?: string;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <Tooltip open={showPlaceHolder && !propName}>
      <TooltipTrigger asChild disabled>
        <div
          className={cn('visio-cms-absolute visio-cms-z-[200]', {
            '!visio-cms-bg-blue-500': isDraggingOver,
            'visio-cms-top-0 visio-cms-h-[5px] visio-cms-w-full': position === 'top',
            'visio-cms-bottom-0 visio-cms-h-[5px]  visio-cms-w-full': position === 'bottom',
            'visio-cms-cms-left-0 visio-cms-h-full visio-cms-top-0 visio-cms-w-[5px]': position === 'left',
            'visio-cms-cms-right-0 visio-cms-h-full visio-cms-w-[5px] visio-cms-top-0': position === 'right',
            'visio-cms-bg-blue-200': showPlaceHolder && !propName,
          })}
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
            const data = e.dataTransfer.getData('application/block');
            if (data) {
              sendMessageToParent({
                type: 'addBlock',
                content: JSON.stringify({ ...JSON.parse(data), position: index, propName, pageBlockId }),
              });
            }
          }}
        />
      </TooltipTrigger>
      <TooltipContent side={position}>Drop here</TooltipContent>
    </Tooltip>
  );
}
