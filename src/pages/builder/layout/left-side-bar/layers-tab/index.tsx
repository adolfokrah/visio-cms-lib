import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { cn } from '@/lib/utils';
import { Box, BoxSelect } from 'lucide-react';
import DroppableItem from './droppable';
import { useCallback } from 'react';

export default function LayersTab() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks, globalBlocks } = useProjectConfigurationState();
  const selectBlock = useCallback(
    (id: string) => {
      if (activePage) {
        const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale];
        if (pageBlocks) {
          const newBlocks = pageBlocks.map((block) => ({ ...block, isSelected: block.id === id }));
          activePage.blocks = {
            ...activePage.blocks,
            [activePage.activeLanguageLocale]: newBlocks,
          };
          setPages(pages.map((p) => (p.active ? activePage : p)));
        }
      }
    },
    [activePage, setPages, pages],
  );

  if (!activePage) return null;

  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale];

  return (
    <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom  visio-cms-px-1">
      {pageBlocks?.map(({ blockId, id, isSelected, globalBlockId }, index) => {
        const blockComponent = blocks.find((block) => block.id === blockId);
        const globalBlock = globalBlocks.find((block) => block.id === globalBlockId);
        if (!blockComponent) return null;
        return (
          <div key={id}>
            <DroppableItem index={index} />
            <div
              onClick={() => selectBlock(id)}
              draggable={true} // Add draggable attribute
              onDragStart={(e) => {
                e.stopPropagation();
                e.dataTransfer.setData('text/plain', id); // Set the data to be transferred during drag
              }}
              className={cn(
                'visio-cms-p-3 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-flex visio-cms-gap-2 hover:visio-cms-bg-dark-700',
                {
                  'visio-cms-text-purple-400': globalBlock != null,
                  'visio-cms-bg-dark-900': isSelected,
                },
              )}
            >
              {globalBlock != null ? <BoxSelect size={14} className="visio-cms-text-purple-400" /> : <Box size={14} />}
              {globalBlock?.name || blockComponent.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
