import { PageBlock, usePagesState } from '../states/usePagesState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
export default function useBlockHistory() {
  const { setPages } = usePagesState();
  const { setGlobalBlocks } = useProjectConfigurationState();

  const addBlocksToPageHistory = (locale: string, blocks: PageBlock[]) => {
    const pages = usePagesState.getState().pages;
    const page = pages.find((page) => page.active);
    if (page) {
      const history = page.history?.[locale]?.blocks ?? [];
      const currentIndex = page.history?.[locale]?.currentIndex ?? -1;
      const newHistory = history.slice(0, currentIndex + 1);

      newHistory.push(blocks);

      page.history = {
        ...page.history,
        [locale]: {
          currentIndex: currentIndex + 1,
          blocks: newHistory,
        },
      };
      setPages(pages.map((p) => (p.active ? page : p)));
    }
  };

  const addInputsToGlobalBlockHistory = (blockId: string, inputs: Record<string, any>) => {
    const globalBlocks = useProjectConfigurationState.getState().globalBlocks;
    const globalBlock = globalBlocks.find((block) => block.id === blockId);
    if (globalBlock) {
      const history = globalBlock.history?.inputs ?? [];
      const currentIndex = globalBlock.history?.currentIndex ?? -1;
      const newHistory = history.slice(0, currentIndex + 1);

      newHistory.push(inputs);

      globalBlock.history = {
        currentIndex: currentIndex + 1,
        inputs: newHistory,
      };

      console.log(inputs, globalBlock);

      setGlobalBlocks(globalBlocks.map((block) => (block.id === blockId ? globalBlock : block)));
    }
  };

  return { addBlocksToPageHistory, addInputsToGlobalBlockHistory };
}
