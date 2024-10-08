import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuShortcut,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { PageBlock } from '@/lib/states/usePagesState';
import { sendMessageToParent } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function RightClickMenu({
  children,
  pageBlock,
  index,
  pageBlocks,
  propName,
  parentBlockId,
}: {
  children: React.ReactNode;
  pageBlock?: PageBlock;
  index: number;
  pageBlocks: PageBlock[];
  propName?: string;
  parentBlockId?: string;
}) {
  const pageBlockId = pageBlock?.id;
  const copiedBlock = localStorage.getItem('copiedBlock');

  const pasteBlock = (index: number) => {
    if (!copiedBlock) return;
    const copiedBlockData: PageBlock = JSON.parse(copiedBlock);
    const data = {
      blockId: copiedBlockData.blockId,
      position: index,
      isGlobal: copiedBlockData?.isGlobalBlock,
      globalBlockId: copiedBlockData?.globalBlockId,
      fromClipBoard: true,
      propName: propName,
      pageBlockId: parentBlockId,
    };
    sendMessageToParent({
      type: 'addBlock',
      content: JSON.stringify({ ...data }),
    });
  };

  const content = JSON.stringify({ pageBlockId, propName });
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onMouseDown={(e) => e.stopPropagation()} disabled={!pageBlock && !copiedBlock}>
        <div>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="visio-cms-w-64">
        {pageBlock && pageBlockId && (
          <>
            <ContextMenuItem
              className="visio-cms-text-xs"
              disabled={index === 0}
              onSelect={() => {
                sendMessageToParent({ type: 'moveBlockUp', content });
              }}
            >
              Move block up
              <ContextMenuShortcut>
                <ArrowUp size={12} />
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              className="visio-cms-text-xs"
              disabled={index === pageBlocks.length - 1}
              onSelect={() => {
                sendMessageToParent({ type: 'moveBlockDown', content });
              }}
            >
              Move block down
              <ContextMenuShortcut>
                <ArrowDown size={12} />
              </ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator className="visio-cms-bg-dark-700" />
            <ContextMenuItem
              className="visio-cms-text-xs"
              onSelect={() => {
                sendMessageToParent({ type: 'copyBlock', content: pageBlockId });
              }}
            >
              Copy block
            </ContextMenuItem>

            <ContextMenuItem
              className="visio-cms-text-xs"
              onSelect={() => {
                sendMessageToParent({ type: 'removeBlock', content });
              }}
            >
              Remove block
            </ContextMenuItem>
          </>
        )}
        {copiedBlock && (
          <>
            {pageBlock && pageBlockId && (
              <>
                <ContextMenuItem className="visio-cms-text-xs" onSelect={() => pasteBlock(index)}>
                  Paste block above
                </ContextMenuItem>
                <ContextMenuItem className="visio-cms-text-xs" onSelect={() => pasteBlock(index + 1)}>
                  Paste block below
                </ContextMenuItem>
              </>
            )}
            <ContextMenuItem className="visio-cms-text-xs" onSelect={() => pasteBlock(index)}>
              Paste block here
            </ContextMenuItem>
          </>
        )}

        {pageBlock && pageBlockId && (
          <>
            {pageBlock.isGlobalBlock ? (
              <>
                <ContextMenuSeparator className="visio-cms-bg-dark-700" />
                <ContextMenuItem
                  className="visio-cms-text-xs"
                  onSelect={() => {
                    sendMessageToParent({ type: 'editGlobalBlock', content: pageBlock?.globalBlockId || '' });
                  }}
                >
                  Edit global block
                </ContextMenuItem>
                <ContextMenuItem
                  className="visio-cms-text-xs"
                  onSelect={() => {
                    sendMessageToParent({ type: 'unlinkBlockFromGlobal', content: pageBlockId });
                  }}
                >
                  Unlink block from global
                </ContextMenuItem>
              </>
            ) : (
              <ContextMenuItem
                className="visio-cms-text-xs"
                onSelect={() => {
                  sendMessageToParent({ type: 'convertBlockToGlobal', content });
                }}
              >
                Save block as global
              </ContextMenuItem>
            )}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
