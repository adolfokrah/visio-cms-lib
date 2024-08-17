import { PageBlock, usePagesState } from '../states/usePagesState';
export default function useBlockHistory() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);

  const addBlocksToPageHistory = (locale: string, blocks: PageBlock[]) => {
    const page = activePage;
    if (page) {
      const history = page.history?.[locale]?.blocks ?? [];
      const currentIndex = page.history?.[locale]?.currentIndex ?? -1;
      let newHistory = history.slice(0, currentIndex + 1);

      newHistory = [...newHistory, blocks];
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

  return { addBlocksToPageHistory };
}
