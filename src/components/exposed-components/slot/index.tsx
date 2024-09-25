import BlockItem from "@/components/pages/page-content/components/bock-item"
import EmptyPageDroppable from "@/components/pages/page-content/components/emptyPageDroppable"
import { PageBlock } from "@/lib/exposed-types"
import usePageContent from "@/lib/hooks/usePageContent"
import { useProjectConfigurationState } from "@/lib/states/useProjectConfigState"
import { cn } from "@/lib/utils"

type SlotProps = {
    pageBlocks: PageBlock[]
    direction?: 'horizontal' | 'vertical',
    className?: string,
    propName: string
    pageBlockId: string
}
export default function Slot({pageBlocks, direction, className, propName, pageBlockId}:SlotProps){
    const { activePage } = usePageContent();
    const { blocks } = useProjectConfigurationState();


    if (pageBlocks.length === 0 && activePage) {
        return <EmptyPageDroppable activePage={activePage} propName={propName} pageBlockId={pageBlockId} className="h-full" />;
    }
   
    return (
        <div className={cn('relative flex flex-col',className, {
          'flex-row': direction === 'horizontal',
        })}>
            {pageBlocks.map((pageBlock, index)=>{
                const { blockId } = pageBlock;
                const block = blocks.find((block) => block.Schema.id === blockId);
                
                if (!block) return null;
                return (
                    <BlockItem parentBlockId={pageBlockId} propName={propName} key={pageBlock.id} block={block} index={index} pageBlock={pageBlock} pageBlocks={pageBlocks} />
                )
            })}
        </div>
    )
}