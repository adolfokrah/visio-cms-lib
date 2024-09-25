import { PageBlock, usePagesState } from '../states/usePagesState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { updateOrInsertProjectConfig, updatePageData } from '../utils';
export default function useBlockHistory() {
  const { setPages } = usePagesState();
  const { setGlobalBlocks, globalBlocks } = useProjectConfigurationState();

  const addBlocksToPageHistory = async (locale: string, blocks: PageBlock[]) => {
    const pages = usePagesState.getState().pages;
    const page = pages.find((page) => page.active);
    if (page) {
      const history = page.history?.[locale]?.blocks ?? [];
      const currentIndex = page.history?.[locale]?.currentIndex ?? -1;
      const newHistory = history.slice(0, currentIndex + 1);

      newHistory.push(blocks);

    

      const newPage = {
        ...page,
        blocks: {
          ...page.blocks,
          [locale]: blocks,
        },
        history: {
          ...page.history,
          [locale]: {
            currentIndex: currentIndex + 1,
            blocks: newHistory,
          },
        },
      };


      await updatePageData({ blocks_dev: newPage?.blocks }, page?.id || '');
      setPages(pages.map((p) => (p.active ? newPage : p)));
    }
  };

  const addInputsToGlobalBlockHistory = async (blockId: string, inputs: Record<string, any>) => {
    const globalBlock = globalBlocks.find((block) => block.id === blockId);
    if (globalBlock) {
      const history = globalBlock.history?.inputs ?? [{ ...globalBlock.inputs }];
      const currentIndex = (globalBlock.history?.currentIndex || 0) ?? -1;
      const newHistory = history.slice(0, currentIndex + 1);

      newHistory.push(inputs);

      globalBlock.history = {
        currentIndex: currentIndex + 1,
        inputs: newHistory,
      };
      globalBlock.inputs = { ...inputs };
      const newGlobalBlocks = globalBlocks.map((block) => (block.id === blockId ? globalBlock : block));
      await updateOrInsertProjectConfig({ global_blocks: newGlobalBlocks });

      setGlobalBlocks(newGlobalBlocks);
    }
  };

  return { addBlocksToPageHistory, addInputsToGlobalBlockHistory };
}
