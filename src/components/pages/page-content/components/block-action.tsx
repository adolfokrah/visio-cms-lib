import { Button } from '@/components/ui/button';
import { PageBlock } from '@/lib/states/usePagesState';
import { sendMessageToParent } from '@/lib/utils';
import { BoxSelect, ChevronDown, ChevronUp, Copy, Edit, LucideTrash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function BlockAction({
  blockName,
  pageBlock,
  index,
  pageBlocks,
}: {
  blockName: string;
  pageBlock: PageBlock;
  index: number;
  pageBlocks: PageBlock[];
}) {
  const pageBlockId = pageBlock.id;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="visio-cms-w-max visio-cms-items-center  visio-cms-px-2 visio-cms-py-1 visio-cms-text-white  visio-cms-flex visio-cms-gap-1  visio-cms-bg-dark-900 visio-cms-rounded-md"
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
          sendMessageToParent({ type: 'duplicateBlock', content: pageBlockId });
        }}
      >
        <Copy size={16} />
      </Button>

      {pageBlock.isGlobalBlock ? (
        <Button
          variant={'ghost'}
          className="hover:!visio-cms-bg-dark-700"
          onClick={(e) => {
            e.stopPropagation();
            sendMessageToParent({ type: 'editGlobalBlock', content: pageBlock?.globalBlockId || '' });
          }}
        >
          <Edit size={16} />
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'ghost'}
              className="hover:!visio-cms-bg-dark-700"
              onClick={(e) => {
                e.stopPropagation();
                sendMessageToParent({ type: 'convertBlockToGlobal', content: pageBlockId });
              }}
            >
              <BoxSelect size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Convert to global block</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
