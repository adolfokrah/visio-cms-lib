import BlockItem from '@/components/pages/page-content/components/bock-item';
import EmptyPageDroppable from '@/components/pages/page-content/components/emptyPageDroppable';
import { PageBlock } from '@/lib/exposed-types';
import usePageContent from '@/lib/hooks/usePageContent';
import { usePageContentState } from '@/lib/states/usePageContentState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { cn, getProjectMode } from '@/lib/utils';

type SlotProps = {
  defaultValue: PageBlock[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
  propName: string;
  pageBlockId: string;
  allowedBlockIds?: string[];
  externalData?: Record<string, any>;
};
export default function ClientSlot({
  defaultValue,
  direction = 'vertical',
  className,
  propName,
  pageBlockId,
  allowedBlockIds,
  externalData,
}: SlotProps) {
  const { activePage } = usePageContent();
  const { blocks: builderBlocks } = useProjectConfigurationState();
  const { blocks: liveBlocks, globalBlocks } = usePageContentState();
  const isBuilderMode = getProjectMode() === 'BUILDER';

  if (defaultValue.length === 0 && activePage) {
    return (
      <div>
        <EmptyPageDroppable
          activePage={activePage}
          propName={propName}
          pageBlockId={pageBlockId}
          className="!visio-cms-h-full !visio-cms-min-h-[50px]"
          allowedBlockIds={allowedBlockIds}
        />
      </div>
    );
  }

  const blocks = getProjectMode() === 'LIVE' ? liveBlocks : builderBlocks;

  const divClass = cn('visio-cms-relative visio-cms-flex', className, {
    'visio-cms-flex-row visio-cms-w-full visio-cms-items-center visio-cms-bg-red-500': direction === 'horizontal',
    'visio-cms-flex-col': direction === 'vertical',
  });

  if (!isBuilderMode) {
    return (
      <div className={cn(divClass)}>
        {defaultValue?.map((block) => {
          const globalBlock = globalBlocks?.find((b) => b.id === block?.globalBlockId);
          const Block = blocks.find((b) => b.Schema.id === (globalBlock?.blockId || block.blockId));
          if (!Block) return null;
          const inputs = {
            ...Block.Schema.defaultPropValues,
            ...block.inputs,
            ...globalBlock?.inputs,
            ...externalData,
          };
          return (
            <div key={block.id}>
              <Block {...inputs} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn(divClass)}>
      {defaultValue.map((pageBlock, index) => {
        const { blockId } = pageBlock;
        const block = blocks.find((block) => block.Schema.id === blockId);

        if (!block) return null;
        return (
          <BlockItem
            droppableDirection={direction}
            parentBlockId={pageBlockId}
            propName={propName}
            key={pageBlock.id}
            block={block}
            index={index}
            pageBlock={pageBlock}
            pageBlocks={defaultValue}
            allowedBlockIds={allowedBlockIds}
          />
        );
      })}
    </div>
  );
}
