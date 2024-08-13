import { Redo, Undo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { usePagesState } from '@/lib/states/usePagesState';

export default function UndoRedoControls() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);

  if (!activePage) return null;
  const history = activePage.history?.[activePage.activeLanguageLocale];

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
  return (
    <div className="visio-cms-flex">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!history || history?.blocks.length < 1 || history?.currentIndex < 0}
              onClick={undo}
              className="visio-cms-rounded-none !visio-cms-bg-dark-700 hover:!visio-cms-bg-dark-900"
            >
              <Undo size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!history || history?.blocks.length < 1 || history?.currentIndex === history.blocks.length - 1}
              onClick={redo}
              className="visio-cms-rounded-none !visio-cms-bg-dark-700 hover:!visio-cms-bg-dark-900"
            >
              <Redo size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
