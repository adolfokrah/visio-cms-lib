import usePageContent from '@/lib/hooks/usePageContent';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import EmptyPageDroppable from './components/emptyPageDroppable';
import BlockItem from './components/bock-item';
import { useExternalData } from '@/lib/hooks/useExternalData';
import { extractBlockData } from '@/lib/utils';

export default function PageContent() {
  const { activePage } = usePageContent();
  const { blocks } = useProjectConfigurationState();
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];

  const { externalData, loading } = useExternalData(activePage?.slug || '', pageBlocks);

  if (loading) {
    return null;
  }

  if (pageBlocks.length === 0 && activePage) {
    return <EmptyPageDroppable activePage={activePage} />;
  }

  return (
    <div id="visio-cms-page-content" className="visio-cms-h-auto">
      {activePage?.blocks?.[activePage.activeLanguageLocale]?.map((pageBlock, index) => {
        const { blockId } = pageBlock;
        const block = blocks.find((block) => block.id === blockId);
        if (!block) return null;
        return (
          <BlockItem
            key={pageBlock.id}
            block={block}
            index={index}
            pageBlock={pageBlock}
            pageBlocks={pageBlocks}
            externalData={extractBlockData({ ...externalData }, pageBlock.id)}
          />
        );
      })}
    </div>
  );
}
