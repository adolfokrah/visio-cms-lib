import usePageContent from '@/lib/hooks/usePageContent';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function DroppableItem({
  position,
  index,
  showPlaceHolder,
}: {
  position: 'top' | 'bottom';
  index: number;
  showPlaceHolder: boolean;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { sendMessageToParent } = usePageContent();

  return (
    <TooltipProvider>
      <Tooltip open={showPlaceHolder}>
        <TooltipTrigger asChild disabled>
          <div
            className={cn('visio-cms-h-[5px] visio-cms-w-full visio-cms-absolute', {
              '!visio-cms-bg-blue-500': isDraggingOver,
              'visio-cms-top-0': position === 'top',
              'visio-cms-bottom-0': position === 'bottom',
              'visio-cms-bg-blue-200': showPlaceHolder,
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
                sendMessageToParent({ type: 'addBlock', content: JSON.stringify({ blockId: data, position: index }) });
              }
            }}
          />
        </TooltipTrigger>
        <TooltipContent side={position}>Drop here</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
