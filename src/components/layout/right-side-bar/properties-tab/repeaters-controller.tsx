import { useRepeaterState } from '@/lib/states/useRepeaterState';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { convertToTitleCase, getValueByPath, Path, sendMessageToParent, updateValueByPath } from '@/lib/utils';
import { usePagesState } from '@/lib/states/usePagesState';
import useBlockHistory from '@/lib/hooks/useBlockHistory';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function RepeatersController() {
  const { selectedRepeaterItem } = useRepeaterState();
  const { pages, setPages } = usePagesState();
  const { addBlocksToPageHistory } = useBlockHistory();
  const activePage = pages.find((page) => page.active);
  const page = activePage;

  if (!page) return null;
  const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
  const foundBlock = blocks.find((block) => block.isSelected);

  if (!selectedRepeaterItem || !foundBlock) return null;
  const repeaterItemPath = selectedRepeaterItem?.repeaterItemId.split('.');
  const repeaterItemIndex = Number(repeaterItemPath[repeaterItemPath.length - 1]);
  repeaterItemPath.pop();
  const repeaterItemParentValue: Record<string, any>[] = getValueByPath(foundBlock.inputs, repeaterItemPath);

  const moveRepeaterItem = (direction: 'up' | 'down') => {
    let index = repeaterItemIndex;
    if (direction === 'up') {
      if (repeaterItemIndex === 0) return;
      const temp = repeaterItemParentValue[repeaterItemIndex];
      repeaterItemParentValue[repeaterItemIndex] = repeaterItemParentValue[repeaterItemIndex - 1];
      repeaterItemParentValue[repeaterItemIndex - 1] = temp;
      index = repeaterItemIndex - 1;
    } else {
      if (repeaterItemIndex === repeaterItemParentValue.length - 1) return;
      const temp = repeaterItemParentValue[repeaterItemIndex];
      repeaterItemParentValue[repeaterItemIndex] = repeaterItemParentValue[repeaterItemIndex + 1];
      repeaterItemParentValue[repeaterItemIndex + 1] = temp;
      index = repeaterItemIndex + 1;
    }

    sendMessageToParent({
      type: 'setSelectedRepeaterItemSchema',
      content: JSON.stringify({
        repeaterItemId: `${repeaterItemPath.join('.')}.${index}`,
        subRepeatersSchemas: selectedRepeaterItem?.subRepeatersSchemas,
      }),
    });

    updateBlockValue(repeaterItemPath, repeaterItemParentValue);
  };

  const deleteRepeaterItem = () => {
    repeaterItemParentValue.splice(repeaterItemIndex, 1);
    updateBlockValue(repeaterItemPath, repeaterItemParentValue);

    sendMessageToParent({
      type: 'setSelectedRepeaterItemSchema',
      content: JSON.stringify(null),
    });
  };

  const updateBlockValue = (path: Path, value: any) => {
    const blockInputs = updateValueByPath(foundBlock.inputs, path, value);

    page.blocks = {
      ...page.blocks,
      [page.activeLanguageLocale]: blocks.map((block) =>
        block.id === foundBlock.id ? { ...block, inputs: blockInputs } : block,
      ),
    };
    setPages(pages.map((p) => (p.active ? page : p)));
    addBlocksToPageHistory(page.activeLanguageLocale, [...JSON.parse(JSON.stringify(blocks))]);
  };
  return (
    <>
      <AccordionItem value={'repeater-item-options'}>
        <AccordionTrigger>Repeater item options</AccordionTrigger>
        <AccordionContent>
          <div className="visio-cms-flex visio-cms-gap-2 items-center visio-cms-justify-between">
            <Button onClick={() => moveRepeaterItem('up')} variant={'ghost'} disabled={repeaterItemIndex == 0}>
              Move
              <ArrowUp size={16} className="visio-cms-ml-2" />
            </Button>
            <Button
              variant={'ghost'}
              onClick={() => moveRepeaterItem('down')}
              disabled={repeaterItemIndex == repeaterItemParentValue.length - 1}
            >
              Move
              <ArrowDown size={16} className="visio-cms-ml-2" />
            </Button>

            <Button variant={'ghost'} onClick={() => deleteRepeaterItem()} className="visio-cms-text-destructive">
              Remove
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {selectedRepeaterItem?.subRepeatersSchemas.length > 0 && (
        <AccordionItem value={'repeater-add-items'}>
          <AccordionTrigger>Add items</AccordionTrigger>
          <AccordionContent>
            <div>
              {selectedRepeaterItem?.subRepeatersSchemas.map((schema, index) => {
                return (
                  <Button
                    key={`${schema.propName}-${index}`}
                    variant={'outline'}
                    className="visio-cms-mt-2 visio-cms-w-full"
                    onClick={() => {
                      if (page) {
                        if (foundBlock) {
                          const path = schema.propName.split('.');

                          const value = getValueByPath(foundBlock.inputs, path);

                          updateBlockValue(path, value ? [...value, schema.schema] : [schema.schema]);
                        }
                      }
                    }}
                  >
                    Add {convertToTitleCase(schema.name)}
                  </Button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </>
  );
}
