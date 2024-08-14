import { Page } from '@/lib/states/usePagesState';
import { cn, sendMessageToParent } from '@/lib/utils';
import { Box } from 'lucide-react';
import { useState } from 'react';

export default function EmptyPageDroppable({ activePage }: { activePage: Page }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div
      className={cn(
        'visio-cms-h-screen visio-cms-grid visio-cms-place-items-center visio-cms-bg-white visio-cms-rounded-md ',
        {
          'visio-cms-bg-blue-300': isDraggingOver,
        },
      )}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('text/plain')) {
          return;
        }
        if (activePage?.blocks?.[activePage.activeLanguageLocale]?.length) return;
        setIsDraggingOver(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        if (activePage?.blocks?.[activePage.activeLanguageLocale]?.length) return;
        setIsDraggingOver(false);
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (activePage?.blocks?.[activePage.activeLanguageLocale]?.length) return;
        setIsDraggingOver(false);
        const data = e.dataTransfer.getData('application/block');
        if (data) {
          sendMessageToParent({ type: 'addBlock', content: JSON.stringify({ blockId: data, position: 0 }) });
        }
      }}
    >
      <div className="empty-drop-zone viso-cms-[90%] md:visio-cms-w-[70%] lg:visio-cms-w-1/2 visio-cms-p-20 visio-cms-grid visio-cms-place-items-center">
        <Box size={64} strokeWidth={0.5} className="visio-cms-text-gray-200" />
        <p className="visio-cms-text-gray-400">Drag & drop a blog here</p>
        <small className="visio-cms-text-gray-400 visio-cms-mt-1 visio-cms-text-center">
          Find a block in the blocks tab from the left the side bar
        </small>
      </div>
    </div>
  );
}
