import BlockItem from "@/components/pages/page-content/components/bock-item"
import EmptyPageDroppable from "@/components/pages/page-content/components/emptyPageDroppable"
import { PageBlock } from "@/lib/exposed-types"
import usePageContent from "@/lib/hooks/usePageContent"
import { usePageContentState } from "@/lib/states/usePageContentState"
import { useProjectConfigurationState } from "@/lib/states/useProjectConfigState"
import { cn, getProjectMode } from "@/lib/utils"

type SlotProps = {
    pageBlocks: PageBlock[]
    direction?: 'horizontal' | 'vertical',
    className?: string,
    propName: string
    pageBlockId: string
}
export default function Slot({pageBlocks, direction, className, propName, pageBlockId}:SlotProps){
    const { activePage } = usePageContent();
    const { blocks: builderBlocks } = useProjectConfigurationState();
    const {blocks: liveBlocks, globalBlocks} = usePageContentState();
    const isLiveMode = getProjectMode() === 'LIVE'


    if (pageBlocks.length === 0 && activePage) {
        return <EmptyPageDroppable activePage={activePage} propName={propName} pageBlockId={pageBlockId} className="h-full" />;
    }

    const blocks =  isLiveMode ?  liveBlocks : builderBlocks

    const divClass = cn('relative flex flex-col',className, {
        'flex-row': direction === 'horizontal',
    })

    if(isLiveMode){
        return (
            <div className={cn(divClass)}>
           { pageBlocks?.map((block) => {
            const globalBlock = globalBlocks?.find((b) => b.id === block?.globalBlockId);
            const Block = blocks.find((b) => b.Schema.id === (globalBlock?.blockId || block.blockId));
            if (!Block) return null;
                const inputs = { ...Block.Schema.defaultPropValues, ...block.inputs, ...globalBlock?.inputs };
                return <Block key={block.id} {...inputs} />;
            })}
        </div>
        )
    }
    return (
        <div className={cn(divClass)}>
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