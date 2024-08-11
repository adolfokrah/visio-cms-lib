import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { Box } from 'lucide-react';

export default function LayersTab() {
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks } = useProjectConfigurationState();
  if (!activePage) return null;

  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale];
  return (
    <>
      {pageBlocks?.map(({ blockId, id }) => {
        const BlockComponent = blocks.find((block) => block.Schema.id === blockId);
        if (!BlockComponent) return null;
        return (
          <div
            key={id}
            className="visio-cms-p-3 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-flex visio-cms-gap-2 hover:visio-cms-bg-dark-700"
          >
            <Box size={14} />
            {BlockComponent.Schema.name}
          </div>
        );
      })}
    </>
  );
}
