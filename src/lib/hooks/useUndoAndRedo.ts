import { usePagesState } from '../states/usePagesState';

export default function useUndoAndRedo() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);

  const history = activePage?.history?.[activePage.activeLanguageLocale];

  const undo = () => {
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
        console.log(page);
        setPages(pages.map((p) => (p.active ? page : p)));
      }
    }
  };

  const redo = () => {
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
  };

  return { undo, redo, history };
}
