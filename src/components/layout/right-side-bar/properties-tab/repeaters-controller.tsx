import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { convertToTitleCase, getValueByPath } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useRepeaterController from '@/lib/hooks/useRepeaterController';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';

export default function RepeatersController() {
  const {
    moveRepeaterItem,
    deleteRepeaterItem,
    page,
    repeaterItemIndex,
    repeaterItemParentValue,
    selectedRepeaterItem,
    foundBlock,
    updateBlockValue,
  } = useRepeaterController();
  const { blocks } = useProjectConfigurationState();

  if (!foundBlock || !page) return null;

  const repeaterItems = selectedRepeaterItem?.subRepeatersSchemas.length
    ? selectedRepeaterItem?.subRepeatersSchemas
    : blocks
        .find((block) => block.Schema.id === foundBlock.blockId)
        ?.Schema.repeaters?.map((schema) => ({ ...schema, propName: schema.name })) || [];

  return (
    <>
      <>
        {!selectedRepeaterItem || !repeaterItemParentValue?.length ? null : (
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
                  disabled={repeaterItemIndex == repeaterItemParentValue?.length - 1}
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
        )}
      </>

      {repeaterItems.length > 0 && (
        <AccordionItem value={'repeater-add-items'}>
          <AccordionTrigger>Add items</AccordionTrigger>
          <AccordionContent>
            <div>
              {repeaterItems.map((schema, index) => {
                const path = schema.propName.split('.');
                const value = getValueByPath(foundBlock.inputs, path);
                const itemCount = schema?.itemCount || 400;

                return (
                  <Button
                    key={`${schema.propName}-${index}`}
                    variant={'outline'}
                    className="visio-cms-mt-2 visio-cms-w-full"
                    disabled={value && value.length >= itemCount}
                    onClick={() => {
                      if (page) {
                        if (foundBlock) {
                          const path = schema.propName.split('.');

                          const value = getValueByPath(foundBlock.inputs, path);

                          updateBlockValue(
                            path,
                            value
                              ? [...value, { ...schema.schema, itemKey: uuidv4() }]
                              : [{ ...schema.schema, itemKey: uuidv4() }],
                          );
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
