import { Path, updateValueByPath } from '@/lib/utils';
import { usePagesState } from '@/lib/states/usePagesState';
import useBlockHistory from '@/lib/hooks/useBlockHistory';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { useTabState } from '../states/useTabsState';

export default function useRepeaterController() {
  const { pages, setPages } = usePagesState();
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const { addBlocksToPageHistory, addInputsToGlobalBlockHistory } = useBlockHistory();
  const { tabs } = useTabState();
  const activePage = pages.find((page) => page.active);
  const page = activePage;

  const blocks = page?.blocks?.[page.activeLanguageLocale] ?? [];
  const foundBlock = blocks.find((block) => block.isSelected);
  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);

  const updateBlockValue = (path: Path, value: any) => {
    const blockInputs = updateValueByPath(foundBlock?.inputs || activeGlobalPinnedBlock?.inputs || {}, path, value);
    updateBlockInputs(blockInputs);
  };

  const updateBlockInputs = (blockInputs: Record<string, any>) => {
    if (foundBlock && page) {
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
