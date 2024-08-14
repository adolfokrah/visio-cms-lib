import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { cn } from '@/lib/utils';
import { Box, BoxSelect } from 'lucide-react';
import DroppableItem from './droppable';

export default function LayersTab() {
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks } = useProjectConfigurationState();
  if (!activePage) return null;

  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale];
  return (
    <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom  visio-cms-px-1">
      {pageBlocks?.map(({ blockId, id, isGlobalBlock }, index) => {
        const BlockComponent = blocks.find((block) => block.Schema.id === blockId);
        if (!BlockComponent) return null;
        return (
          <div key={id}>
            <DroppableItem index={index} />
            <div
              draggable={true} // Add draggable attribute
              onDragStart={(e) => {
                e.stopPropagation();
                e.dataTransfer.setData('text/plain', id); // Set the data to be transferred during drag
              }}
              className={cn(
                'visio-cms-p-3 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-flex visio-cms-gap-2 hover:visio-cms-bg-dark-700',
                {
                  'visio-cms-text-purple-400': isGlobalBlock,
                },
              )}
            >
              {isGlobalBlock ? <BoxSelect size={14} className="visio-cms-text-purple-400" /> : <Box size={14} />}
              {BlockComponent.Schema.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
