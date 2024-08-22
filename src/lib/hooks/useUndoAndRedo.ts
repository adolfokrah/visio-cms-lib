import { useCallback } from 'react';
import { usePagesState } from '../states/usePagesState';
import { useTabState } from '../states/useTabsState';
import { useProjectConfigurationState } from '../states/useProjectConfigState';

export default function useUndoAndRedo() {
  const { pages, setPages } = usePagesState();
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const activePage = pages.find((page) => page.active);
  const { tabs } = useTabState();
  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);

  const history = activePage?.history?.[activePage.activeLanguageLocale];
  const undo = useCallback(() => {
    const page = activePage;
    if (page) {
      if (history) {
        const currentIndex = history?.currentIndex;
        if (currentIndex > 0) {
          const newBlocks = history.blocks[currentIndex - 1];
          page.history = {
            ...page.history,
            [page.activeLanguageLocale]: {
              currentIndex: currentIndex - 1,
              blocks: history.blocks,
            },
          };
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: newBlocks,
          };
        } else {
          page.history = {
            ...page.history,
            [page.activeLanguageLocale]: {
              currentIndex: -1,
              blocks: history.blocks,
            },
          };
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: [],
          };
        }
        setPages(pages.map((p) => (p.active ? page : p)));
      }
    }

    if (activeGlobalPinnedBlock) {
      const globalBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);
      if (globalBlock) {
        const history = globalBlock.history?.inputs ?? [];
        const currentIndex = globalBlock.history?.currentIndex || 1;

        if (currentIndex > 0) {
          const newInputs = history[currentIndex - 1];
          globalBlock.history = {
            currentIndex: currentIndex - 1,
            inputs: history,
          };
          globalBlock.inputs = newInputs;
        } else {
          globalBlock.history = {
            ...globalBlock.history,
            currentIndex: -1,
            inputs: history,
          };
          globalBlock.inputs = history[0];
        }

        setGlobalBlocks(globalBlocks.map((block) => (block.id === globalBlock.id ? globalBlock : block)));
      }
    }
  }, [activePage, history, pages, setPages, setGlobalBlocks, globalBlocks, tabs, activeGlobalPinnedBlock]);

  const redo = useCallback(() => {
    const page = activePage;
    if (page) {
      if (history) {
        const currentIndex = history?.currentIndex;
        if (currentIndex < history.blocks.length - 1) {
          const newBlocks = history.blocks[currentIndex + 1];
          page.history = {
            ...page.history,
            [page.activeLanguageLocale]: {
              currentIndex: currentIndex + 1,
              blocks: history.blocks,
            },
          };
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: newBlocks,
          };
          setPages(pages.map((p) => (p.active ? page : p)));
        }
      }
    }
    if (activeGlobalPinnedBlock) {
      const globalBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);
      if (globalBlock) {
        const history = globalBlock.history?.inputs ?? [];
        const currentIndex = globalBlock.history?.currentIndex || 1;

        if (currentIndex < history.length - 1) {
          const newInputs = history[currentIndex + 1];
          globalBlock.history = {
            currentIndex: currentIndex + 1,
            inputs: history,
          };
          globalBlock.inputs = newInputs;
        }

        setGlobalBlocks(globalBlocks.map((block) => (block.id === globalBlock.id ? globalBlock : block)));
      }
    }
  }, [activePage, history, pages, setPages, setGlobalBlocks, globalBlocks, tabs, activeGlobalPinnedBlock]);

  return { undo, redo, history, activeGlobalPinnedBlock };
}
