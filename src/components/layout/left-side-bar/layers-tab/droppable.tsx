import { cn, sendMessageToParent } from '@/lib/utils';
import { useState } from 'react';

export default function DroppableItem({ index }: { index: number }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div
      className={cn('visio-cms-h-[5px] visio-cms-w-full', {
        '!visio-cms-bg-blue-500': isDraggingOver,
      })}
      onDragOver={(e) => {
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
        const data = e.dataTransfer.getData('text/plain');
        if (data) {
          sendMessageToParent({
            type: 'moveBlockToPosition',
            content: JSON.stringify({ blockId: data, position: index }),
          });
        }
      }}
    />
  );
}
