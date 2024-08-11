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
        'visio-cms-bg-blue-100': isDraggingOver,
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
          sendMessageToParent({ type: 'addBlock', content: JSON.stringify({ blockId: data, position: 0 }) });
        }
      }}
    >
      <div id="page-content" className="visio-cms-h-auto">
        {activePage?.blocks?.[activePage.activeLanguageLocale]?.map(({ blockId, id }) => {
          const block = blocks.find((block) => block.Schema.id === blockId);
          if (!block) return null;
          return (
            <div
              key={id}
              onClick={() => {
                sendMessageToParent({ type: 'removeBlock', content: id });
              }}
            >
              {React.createElement(block, { key: block.Schema.id, ...block.Schema.defaultPropValues })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
