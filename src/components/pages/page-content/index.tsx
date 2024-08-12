import usePageContent from '@/lib/hooks/usePageContent';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export default function PageContent() {
  const { activePage, sendMessageToParent } = usePageContent();
  const { blocks } = useProjectConfigurationState();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div
      className={cn('visio-cms-h-screen visio-cms-bg-white visio-cms-rounded-md ', {
        'visio-cms-bg-blue-300': isDraggingOver,
      })}
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
      <div id="page-content" className="visio-cms-h-auto">
        {activePage?.blocks?.[activePage.activeLanguageLocale]?.map(({ blockId, id }, index) => {
          const block = blocks.find((block) => block.Schema.id === blockId);
          if (!block) return null;
          return (
            <div
              key={id}
              onClick={(e) => {
                e.stopPropagation();
                alert('click');
                // sendMessageToParent({ type: 'removeBlock', content: id });
              }}
              className="visio-cms-relative"
            >
              <div>{React.createElement(block, { key: block.Schema.id, ...block.Schema.defaultPropValues })}</div>

              <Droppable position="top" index={index} />
              <Droppable position="bottom" index={index + 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Droppable = ({ position, index }: { position: 'top' | 'bottom'; index: number }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { sendMessageToParent } = usePageContent();

  return (
    <div
      className={cn('visio-cms-h-[5px] visio-cms-w-full visio-cms-absolute', {
        'visio-cms-bg-blue-500': isDraggingOver,
        'visio-cms-top-0': position === 'top',
        'visio-cms-bottom-0': position === 'bottom',
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
    >
      {' '}
    </div>
  );
};
