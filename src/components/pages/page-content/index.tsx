import usePageContent from '@/lib/hooks/usePageContent';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import EmptyPageDroppable from './components/emptyPageDroppable';
import BlockItem from './components/bock-item';

export default function PageContent() {
  const { activePage } = usePageContent();
  const { blocks } = useProjectConfigurationState();

  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];

  if (pageBlocks.length === 0 && activePage) {
    return <EmptyPageDroppable activePage={activePage} />;
  }

  return (
    <div id="page-content" className="visio-cms-h-auto">
      {activePage?.blocks?.[activePage.activeLanguageLocale]?.map((pageBlock, index) => {
        const { blockId } = pageBlock;
        const block = blocks.find((block) => block.Schema.id === blockId);
        if (!block) return null;

        return (
          <BlockItem key={pageBlock.id} block={block} index={index} pageBlock={pageBlock} pageBlocks={pageBlocks} />
        );
      })}
    </div>
  );
}
