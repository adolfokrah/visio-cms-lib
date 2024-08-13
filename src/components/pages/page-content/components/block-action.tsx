import { Button } from '@/components/ui/button';
import usePageContent from '@/lib/hooks/usePageContent';
import { PageBlock } from '@/lib/states/usePagesState';
import { ChevronDown, ChevronUp, Copy, Edit, LucideTrash2 } from 'lucide-react';

export default function BlockAction({
  blockName,
  pageBlock,
  index,
}: {
  blockName: string;
  pageBlock: PageBlock;
  index: number;
}) {
  const { sendMessageToParent } = usePageContent();
  const { activePage } = usePageContent();
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const pageBlockId = pageBlock.id;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="visio-cms-w-max visio-cms-z-50 visio-cms-px-2 visio-cms-py-1 visio-cms-text-white  visio-cms-flex visio-cms-gap-1 visio-cms-absolute visio-cms-right-[10px] visio-cms-top-[10px] visio-cms-bg-dark-900 visio-cms-rounded-md"
    >
      <span>{blockName}</span>
      <Button
        variant={'ghost'}
        className="hover:!visio-cms-bg-dark-700"
        onClick={(e) => {
          e.stopPropagation();
          sendMessageToParent({ type: 'removeBlock', content: pageBlockId });
        }}
      >
        <LucideTrash2 size={16} />
      </Button>
      <Button
        variant={'ghost'}
        className="hover:!visio-cms-bg-dark-700"
        disabled={index === 0}
        onClick={(e) => {
          e.stopPropagation();
          sendMessageToParent({ type: 'moveBlockUp', content: pageBlockId });
        }}
      >
        <ChevronUp size={16} />
      </Button>
      <Button
        variant={'ghost'}
        className="hover:!visio-cms-bg-dark-700"
        disabled={index === pageBlocks.length - 1}
        onClick={(e) => {
          e.stopPropagation();
          sendMessageToParent({ type: 'moveBlockDown', content: pageBlockId });
        }}
      >
        <ChevronDown size={16} />
      </Button>
      <Button
        variant={'ghost'}
        className="hover:!visio-cms-bg-dark-700"
        onClick={(e) => {
          e.stopPropagation();
          sendMessageToParent({ type: 'copyBlock', content: pageBlockId });
        }}
      >
        <Copy size={16} />
      </Button>

      {pageBlock.isGlobalBlock && (
        <Button
          variant={'ghost'}
          className="hover:!visio-cms-bg-dark-700"
          onClick={(e) => {
            e.stopPropagation();
            sendMessageToParent({ type: 'editGlobalBlock', content: pageBlockId });
          }}
        >
          <Edit size={16} />
        </Button>
      )}
    </div>
  );
}
