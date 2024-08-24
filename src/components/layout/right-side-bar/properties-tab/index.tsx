import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { convertToTitleCase, getValueByPath, groupSideEditingProps } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import useRepeaterController from '@/lib/hooks/useRepeaterController';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { Label } from '@/components/ui/label';
import RenderController from './controllers';
import { SideEditingProps } from '@/lib/types';
import { toast } from 'sonner';
import { useTabState } from '@/lib/states/useTabsState';

export default function PropertiesTab() {
  const {
    moveRepeaterItem,
    deleteRepeaterItem,
    page,
    repeaterItemIndex,
    repeaterItemParentValue,
    selectedRepeaterItem,
    foundBlock,
    updateBlockValue,
    globalBlock,
    globalBlocks,
  } = useRepeaterController();
  const { blocks } = useProjectConfigurationState();
  const { tabs } = useTabState();

  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);

  if ((!foundBlock || !page || globalBlock) && !activeGlobalPinnedBlock) return null;

  const repeaterItems = selectedRepeaterItem?.subRepeatersSchemas.length
    ? selectedRepeaterItem?.subRepeatersSchemas
    : !selectedRepeaterItem
      ? blocks
          .find(
            (block) => block.Schema.id == foundBlock?.blockId || block.Schema.id == activeGlobalPinnedBlock?.blockId,
          )
          ?.Schema.repeaters?.map((schema) => ({ ...schema, propName: schema.name }))
      : [] || [];

  const sideEditingProp =
    repeaterItemParentValue && selectedRepeaterItem
      ? selectedRepeaterItem?.sideEditingProps || []
      : blocks.find((block) => block.Schema.id === (foundBlock?.blockId || activeGlobalPinnedBlock?.blockId))?.Schema
          .sideEditingProps || [];

  const groupedSideEditingProps = !selectedRepeaterItem ? groupSideEditingProps(sideEditingProp) : [];

  return (
    <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom  visio-cms-px-1">
      <Accordion type="multiple">
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

                    <Button
                      variant={'ghost'}
                      onClick={() => deleteRepeaterItem()}
                      className="visio-cms-text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </>

          {repeaterItems && repeaterItems.length > 0 && (
            <>
              <AccordionItem value={'repeater-add-items'}>
                <AccordionTrigger>Add items</AccordionTrigger>
                <AccordionContent>
                  <div>
                    {repeaterItems.map((schema, index) => {
                      const path = schema.propName.split('.');
                      const value = getValueByPath(foundBlock?.inputs || activeGlobalPinnedBlock?.inputs, path);
                      const itemCount = schema?.itemCount || 400;

                      return (
                        <Button
                          key={`${schema.propName}-${index}`}
                          variant={'outline'}
                          className="visio-cms-mt-2 visio-cms-w-full"
                          disabled={value && value.length >= itemCount}
                          onClick={() => {
                            if (foundBlock || activeGlobalPinnedBlock) {
                              try {
                                updateBlockValue(
                                  path,
                                  value
                                    ? [...value, { ...schema.schema, itemKey: uuidv4() }]
                                    : [{ ...schema.schema, itemKey: uuidv4() }],
                                );
                                toast.success(`${convertToTitleCase(schema.name)} added successfully`);
                              } catch (e) {
                                toast.error(`Error adding ${convertToTitleCase(schema.name)}`);
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
            </>
          )}

          {sideEditingProp && sideEditingProp.length > 0 && (
            <>
              {selectedRepeaterItem?.sideEditingProps && repeaterItemParentValue ? (
                <AccordionItem value={'repeater-side-editing'}>
                  <AccordionTrigger>Editing props</AccordionTrigger>
                  <AccordionContent>
                    <Controllers sideEditingProp={sideEditingProp} />
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <>
                  {groupedSideEditingProps
                    .filter((group) => group.group != 'default')
                    .map((group) => (
                      <AccordionItem key={group.group} value={group.group}>
                        <AccordionTrigger>{group.group}</AccordionTrigger>
                        <AccordionContent>
                          <Controllers sideEditingProp={group.items} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                  <>
                    {groupedSideEditingProps
                      .filter((group) => group.group == 'default')
                      .map((group) => (
                        <Controllers key={group.group} sideEditingProp={group.items} />
                      ))}
                  </>
                </>
              )}
            </>
          )}
        </>
      </Accordion>
    </div>
  );
}

function Controllers({ sideEditingProp }: { sideEditingProp: SideEditingProps[] }) {
  return sideEditingProp.map((sideEditingProp, index) => (
    <div key={`${sideEditingProp.propName}.${index}`} className="visio-cms-mt-3 visio-cms-space-y-2">
      <div>
        <Label>{sideEditingProp.label}</Label>
      </div>
      <RenderController {...sideEditingProp} />
    </div>
  ));
}
