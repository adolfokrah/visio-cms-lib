import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  convertToTitleCase,
  deleteItemByPathArray,
  findObjectWithParents,
  getItemPositionByPathArray,
  getSelectedBlock,
  getSelectedBlockPath,
  getValueByPath,
  groupSideEditingProps,
  moveItemByPathArray,
} from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import useListController from '@/lib/hooks/useListController';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { Label } from '@/components/ui/label';
import RenderController from './controllers';
import { toast } from 'sonner';
import { useTabState } from '@/lib/states/useTabsState';
import { useListState } from '@/lib/states/useListState';
import { usePagesState } from '@/lib/states/usePagesState';

export default function PropertiesTab() {
  const { updateBlockValue, globalBlocks, updateBlockInputs } = useListController();
  const { selectedListItem, setSelectedListItem } = useListState();
  const { blocks } = useProjectConfigurationState();
  const { pages } = usePagesState();
  const { tabs } = useTabState();
  const activePage = pages.find((page) => page.active);
  const pageBlocks = activePage?.blocks?.[activePage?.activeLanguageLocale];
  const pageBlock = getSelectedBlock(pageBlocks);
  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);
  const selectedBlock = blocks.find(
    (block) => block.id === pageBlock?.blockId || block.id === activeGlobalPinnedBlock?.blockId,
  );

  function removeNumbersFromString(str: string) {
    return str.replace(/\.\d+/g, '');
  }

  const transformedString = removeNumbersFromString(selectedListItem?.propName || '');
  const foundLists = findObjectWithParents(selectedBlock?.lists || [], transformedString || '');

  function convertStringToArray(input: string): string[] {
    return input.match(/[^.]+\.\d+/g) || [];
  }

  const moveListItem = (propName: string, direction: 'up' | 'down') => {
    let path = propName.split('.');
    if (!activeGlobalPinnedBlock) {
      const blockPath = getSelectedBlockPath(pageBlocks, pageBlock.id);
      path = `${blockPath}.inputs.${propName}`.split('.');
    }
    const newData = moveItemByPathArray(activeGlobalPinnedBlock?.inputs || pageBlocks || {}, path, direction);

    updateBlockInputs(newData || {});
    path = propName.split('.');
    let newPath = `${path.slice(0, path.length - 1).join('.')}`;
    const itemIndex = Number(path[path.length - 1]);
    const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    newPath = `${newPath}.${newIndex}`;
    if (selectedListItem) {
      setSelectedListItem({
        ...selectedListItem,
        propName: newPath,
      });
    }
  };

  const addItem = (propName: string, data: any) => {
    if (activeGlobalPinnedBlock) {
      const path = propName.split('.');
      const value = getValueByPath(pageBlock?.inputs || activeGlobalPinnedBlock?.inputs, path);
      updateBlockValue(path, [...(value || []), data]);
    } else {
      const blockPath = getSelectedBlockPath(pageBlocks, pageBlock.id);
      const path = `${blockPath}.inputs.${propName}`.split('.');
      const value = getValueByPath(pageBlocks, path);
      updateBlockValue(path, [...(value || []), data]);
    }

    toast.success('Item added');
  };

  const deleteRepeaterItem = (propName: string) => {
    let path = propName.split('.');
    if (!activeGlobalPinnedBlock) {
      const blockPath = getSelectedBlockPath(pageBlocks, pageBlock.id);
      path = `${blockPath}.inputs.${propName}`.split('.');
    }
    const newData = deleteItemByPathArray(activeGlobalPinnedBlock?.inputs || pageBlocks || {}, path);
    updateBlockInputs(newData || {});
    setSelectedListItem(null);
  };

  const groupedSideEditingProps = () => {
    const newSideEditingProps = selectedBlock?.sideEditingProps.filter((sideEditingProp) => {
      if (sideEditingProp?.hide) {
        return sideEditingProp.hide(pageBlock?.inputs || activeGlobalPinnedBlock?.inputs || {}) == true ? false : true;
      }
      return true;
    });

    return groupSideEditingProps(newSideEditingProps || []);
  };

  return (
    <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom  visio-cms-px-1">
      {foundLists?.map((list, listIndex) => {
        const listPropName = convertStringToArray(selectedListItem?.propName || '')
          .splice(0, listIndex + 1)
          .join('.');

        const positionInParentArray = getItemPositionByPathArray(
          pageBlock?.inputs || activeGlobalPinnedBlock?.inputs || {},
          listPropName.split('.'),
        );

        return (
          <div key={list.propName}>
            <div className="visio-cms-bg-dark-900 visio-cms-p-2  visio-cms-font-bold visio-cms-text-center visio-cms-uppercase">
              {list.label}
            </div>

            <div className="visio-cms-flex visio-cms-gap-2 items-center visio-cms-justify-between visio-cms-p-2">
              <Button
                variant={'ghost'}
                onClick={() => {
                  moveListItem(listPropName, 'up');
                }}
                disabled={positionInParentArray === 'first' || positionInParentArray === 'firstAndLast'}
              >
                Move
                <ArrowUp size={16} className="visio-cms-ml-2" />
              </Button>
              <Button
                variant={'ghost'}
                onClick={() => {
                  moveListItem(listPropName, 'down');
                }}
                disabled={positionInParentArray === 'last' || positionInParentArray === 'firstAndLast'}
              >
                Move
                <ArrowDown size={16} className="visio-cms-ml-2" />
              </Button>

              <Button
                variant={'ghost'}
                onClick={() => deleteRepeaterItem(listPropName)}
                className="visio-cms-text-destructive"
              >
                Remove
              </Button>
            </div>
            {list.subLists && list.subLists?.length > 0 && (
              <div className="visio-cms-px-2">
                <Accordion type="single" defaultValue="list-add-items">
                  <AccordionItem value={'list-add-items'}>
                    <AccordionTrigger>Add items</AccordionTrigger>
                    <AccordionContent>
                      <div>
                        {list.subLists?.map((subList, index) => {
                          const path = subList.propName.split('.');
                          const p = `${listPropName}.${path[path.length - 1]}`;
                          const value = getValueByPath(
                            pageBlock?.inputs || activeGlobalPinnedBlock?.inputs,
                            p.split('.'),
                          );
                          return (
                            <Button
                              key={`${subList.propName}-${index}`}
                              variant={'outline'}
                              className="visio-cms-mt-2 visio-cms-w-full hover:!visio-cms-bg-dark-700"
                              onClick={() => {
                                addItem(`${listPropName}.${path[path.length - 1]}`, subList.defaultValue);
                              }}
                              disabled={list.maxCount ? value?.length >= list.maxCount : false}
                            >
                              Add {convertToTitleCase(subList.label)}
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            {list?.sideEditingProps && list.sideEditingProps?.length > 0 && (
              <div className="visio-cms-px-2">
                <Accordion type="single" defaultValue="list-side-editing">
                  <AccordionItem value={'list-side-editing'}>
                    <AccordionTrigger>Editing props</AccordionTrigger>
                    <AccordionContent>
                      <div>
                        {list.sideEditingProps
                          ?.filter((sideEditingProp) => {
                            if (sideEditingProp?.hide) {
                              return sideEditingProp.hide(pageBlock?.inputs || activeGlobalPinnedBlock?.inputs || {}) ==
                                true
                                ? false
                                : true;
                            }
                            return true;
                          })
                          .map((sideEditingProp, index) => (
                            <div
                              key={`${sideEditingProp.propName}.${index}`}
                              className="visio-cms-mt-3 visio-cms-space-y-2"
                            >
                              <div>
                                <Label>{sideEditingProp.label}</Label>
                              </div>
                              <RenderController
                                {...sideEditingProp}
                                propName={`${listPropName}.${sideEditingProp.propName}`}
                              />
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        );
      })}

      {selectedBlock && !foundLists && (
        <>
          <div className="visio-cms-bg-dark-900 visio-cms-p-2  visio-cms-font-bold visio-cms-text-center visio-cms-uppercase">
            {selectedBlock.name}
          </div>

          {selectedBlock.lists && selectedBlock.lists?.length > 0 && (
            <div className="visio-cms-px-2">
              <Accordion type="single" defaultValue="list-add-items">
                <AccordionItem value={'list-add-items'}>
                  <AccordionTrigger>Add items</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {selectedBlock.lists?.map((list, index) => {
                        const value = getValueByPath(
                          pageBlock?.inputs || activeGlobalPinnedBlock?.inputs,
                          list.propName.split('.'),
                        );
                        return (
                          <Button
                            key={`${list.propName}-${index}`}
                            variant={'outline'}
                            className="visio-cms-mt-2 visio-cms-w-full hover:!visio-cms-bg-dark-700"
                            onClick={() => {
                              addItem(list.propName, list.defaultValue);
                            }}
                            disabled={list.maxCount ? value?.length >= list.maxCount : false}
                          >
                            Add {convertToTitleCase(list.label)}
                          </Button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {selectedBlock?.sideEditingProps && selectedBlock.sideEditingProps?.length > 0 && (
            <div className="visio-cms-px-2">
              <Accordion type="multiple">
                {groupedSideEditingProps()
                  .filter((group) => group.group != 'default')
                  .map((group) => (
                    <AccordionItem key={group.group} value={group.group}>
                      <AccordionTrigger>{group.group}</AccordionTrigger>
                      <AccordionContent>
                        <div>
                          {group.items?.map((sideEditingProp, index) => (
                            <div
                              key={`${sideEditingProp.propName}.${index}`}
                              className="visio-cms-mt-3 visio-cms-space-y-2"
                            >
                              <div>
                                <Label>{sideEditingProp.label}</Label>
                              </div>
                              <RenderController {...sideEditingProp} propName={`${sideEditingProp.propName}`} />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
              {groupedSideEditingProps()
                .filter((group) => group.group == 'default')
                .map((group) => (
                  <div key={group.group}>
                    {group.items?.map((sideEditingProp, index) => (
                      <div key={`${sideEditingProp.propName}.${index}`} className="visio-cms-mt-3 visio-cms-space-y-2">
                        <div>
                          <Label>{sideEditingProp.label}</Label>
                        </div>
                        <RenderController {...sideEditingProp} propName={`${sideEditingProp.propName}`} />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
