import { useRepeaterState } from '@/lib/states/useRepeaterState';
import { getValueByPath, Path, sendMessageToParent, updateValueByPath } from '@/lib/utils';
import { usePagesState } from '@/lib/states/usePagesState';
import useBlockHistory from '@/lib/hooks/useBlockHistory';
import { useProjectConfigurationState } from '../states/useProjectConfigState';

export default function useRepeaterController() {
  const { selectedRepeaterItem, setSelectedRepeaterItem } = useRepeaterState();
  const { pages, setPages } = usePagesState();
  const { globalBlocks } = useProjectConfigurationState();
  const { addBlocksToPageHistory } = useBlockHistory();
  const activePage = pages.find((page) => page.active);
  const page = activePage;

  const blocks = page?.blocks?.[page.activeLanguageLocale] ?? [];
  const foundBlock = blocks.find((block) => block.isSelected);

  const globalBlock = globalBlocks.find((block) => block.id === foundBlock?.globalBlockId);

  const repeaterItemPath = selectedRepeaterItem?.repeaterItemId.split('.');
  const repeaterItemIndex = Number(repeaterItemPath?.[repeaterItemPath?.length - 1]);
  repeaterItemPath?.pop();
  const repeaterItemParentValue: Record<string, any>[] = getValueByPath(foundBlock?.inputs, repeaterItemPath || []);

  const moveRepeaterItem = (direction: 'up' | 'down') => {
    if (!repeaterItemPath) return;
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

    setSelectedRepeaterItem({
      repeaterItemId: `${repeaterItemPath.join('.')}.${index}`,
      subRepeatersSchemas: selectedRepeaterItem?.subRepeatersSchemas || [],
      sideEditingProps:
        selectedRepeaterItem?.sideEditingProps?.map((prop) => {
          const newPropName = `${repeaterItemPath.join('.')}.${index}.${prop.propName.split('.')[prop.propName.split('.').length - 1]}`;
          return {
            ...prop,
            propName: `${newPropName}`,
          };
        }) || [],
    });

    updateBlockValue(repeaterItemPath, repeaterItemParentValue);
  };

  const deleteRepeaterItem = () => {
    if (!repeaterItemPath) return;
    repeaterItemParentValue.splice(repeaterItemIndex, 1);
    updateBlockValue(repeaterItemPath, repeaterItemParentValue);

    sendMessageToParent({
      type: 'setSelectedRepeaterItemSchema',
      content: JSON.stringify(null),
    });
  };

  const updateBlockValue = (path: Path, value: any) => {
    if (!foundBlock || !page) return;
    const blockInputs = updateValueByPath(foundBlock.inputs, path, value);

    page.blocks = {
      ...page.blocks,
      [page.activeLanguageLocale]: blocks.map((block) =>
        block.id === foundBlock.id ? { ...block, inputs: blockInputs } : block,
      ),
    };
    setPages(pages.map((p) => (p.active ? page : p)));
    addBlocksToPageHistory(page.activeLanguageLocale, [
      ...JSON.parse(JSON.stringify(page.blocks?.[page.activeLanguageLocale])),
    ]);
  };

  return {
    updateValueByPath,
    moveRepeaterItem,
    deleteRepeaterItem,
    page,
    repeaterItemIndex,
    repeaterItemPath,
    repeaterItemParentValue,
    selectedRepeaterItem,
    foundBlock,
    updateBlockValue,
    globalBlock,
    globalBlocks,
  };
}
