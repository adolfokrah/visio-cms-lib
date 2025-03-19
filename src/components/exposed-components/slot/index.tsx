import BlockItem from '@/pages/builder/layout/canvas/page-content/components/bock-item';
import EmptyPageDroppable from '@/pages/builder/layout/canvas/page-content/components/emptyPageDroppable';
import { PageBlock } from '@/lib/exposed-types';
import usePageContent from '@/lib/hooks/usePageContent';
import { usePageContentState } from '@/lib/states/usePageContentState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { cn, extractBlockData, getProjectMode } from '@/lib/utils';
import { useExternalData } from '@/lib/hooks/useExternalData';

type SlotProps = {
  defaultValue: PageBlock[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
  propName: string;
  pageBlockId: string;
  allowedBlockIds?: string[];
  externalData?: Record<string, any>;
};
export default function Slot({
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

  const {externalData: extra, loading} = useExternalData('', defaultValue)


  if(loading) return null



  if (defaultValue.length === 0 && activePage) {
    return (
      <EmptyPageDroppable
        activePage={activePage}
        propName={propName}
        pageBlockId={pageBlockId}
        className="!visio-cms-h-full !visio-cms-min-h-[50px]"
        allowedBlockIds={allowedBlockIds}
      />
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
        {defaultValue?.map((pageBlock) => {
          const globalBlock = globalBlocks?.find((b) => b.id === pageBlock?.globalBlockId);
          const Block = blocks.find((b) => b.id === (globalBlock?.blockId || pageBlock.blockId));
          if (!Block) return null;
          const Component = Block.component;
          const inputs = {
            ...Block.defaultPropValues,
            ...pageBlock.inputs,
            ...globalBlock?.inputs,
            externalData: extractBlockData({ ...externalData, ...extra }, pageBlock.id),
          };
          return (
            <div key={pageBlock.id}>
              <Component {...inputs} />
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
        const block = blocks.find((block) => block.id === blockId);

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
            externalData={ extractBlockData({ ...externalData, ...extra }, pageBlock.id)}
          />
        );
      })}
    </div>
  );
}
