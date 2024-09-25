import { getSelectedBlock, Path, updateValueByPath } from '@/lib/utils';
import { PageBlock, usePagesState } from '@/lib/states/usePagesState';
import useBlockHistory from '@/lib/hooks/useBlockHistory';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { useTabState } from '../states/useTabsState';
import lodash from 'lodash'
export default function useListController() {
  const { pages, setPages } = usePagesState();
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const { addBlocksToPageHistory, addInputsToGlobalBlockHistory } = useBlockHistory();
  const { tabs } = useTabState();
  const activePage = pages.find((page) => page.active);
  const page = activePage;

  const blocks = page?.blocks?.[page.activeLanguageLocale] ?? [];
  const foundBlock = getSelectedBlock(blocks)
  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);

  const updateBlockValue = (path: Path, value: any) => {
    const blockInputs = updateValueByPath(activeGlobalPinnedBlock?.inputs || blocks || {}, path, value);
    updateBlockInputs(blockInputs);
  };

  const updateBlockInputs = (blockInputs: Record<string, any> | PageBlock[]) => {
    if (foundBlock && page && Array.isArray(blockInputs)) {
      page.blocks = {
        ...page.blocks,
        [page.activeLanguageLocale]: blockInputs as PageBlock[],
      };
      setPages(pages.map((p) => (p.active ? page : p)));
      addBlocksToPageHistory(page.activeLanguageLocale, [
        ...lodash.cloneDeep(page.blocks?.[page.activeLanguageLocale]),
      ]);
    } else if (activeGlobalPinnedBlock) {
      setGlobalBlocks(
        globalBlocks.map((block) =>
          block.id === activeGlobalPinnedBlock.id ? { ...block, inputs: blockInputs } : block,
        ),
      );
      addInputsToGlobalBlockHistory(activeGlobalPinnedBlock.id, blockInputs);
    }
  };

  return {
    updateBlockValue,
    globalBlocks,
    updateBlockInputs,
  };
}
