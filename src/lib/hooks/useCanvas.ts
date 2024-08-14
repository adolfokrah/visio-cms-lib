import { useEffect } from 'react';
import { PageBlock, usePagesState } from '../states/usePagesState';
import { Block, Message } from '../types';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import useUndoAndRedo from './useUndoAndRedo';

export default function useCanvas() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks } = useProjectConfigurationState();
  const { undo, redo } = useUndoAndRedo();

  useEffect(() => {
    const setPageBlocks = (block: Block, position: number) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = [...blocks].map((block) => ({ ...block, isSelected: false }));
        newBlocks.splice(position, 0, {
          id: uuidv4(),
          blockId: block.Schema.id,
          isSelected: true,
          inputs: block.Schema.defaultPropValues,
        });
        page.blocks = {
          ...page.blocks,
          [page.activeLanguageLocale]: newBlocks,
        };
        setPages(pages.map((p) => (p.active ? page : p)));
        addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
      }
    };

    const removeBlock = (blockId: string) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = blocks.filter((block) => block.id !== blockId);
        page.blocks = {
          ...page.blocks,
          [page.activeLanguageLocale]: newBlocks,
        };
        setPages(pages.map((p) => (p.active ? page : p)));
        addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
      }
    };

    const selectBlock = (blockId: string) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = blocks.map((block) => ({ ...block, isSelected: block.id === blockId }));
        page.blocks = {
          ...page.blocks,
          [page.activeLanguageLocale]: newBlocks,
        };
        setPages(pages.map((p) => (p.active ? page : p)));
        addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
      }
    };

    const addBlocksToPageHistory = (locale: string, blocks: PageBlock[]) => {
      const page = activePage;
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

    const handleMessage = (event: MessageEvent) => {
      const data: Message = event.data;
      if (data.type === 'addBlock') {
        const { blockId, position } = JSON.parse(data.content);
        const block = blocks.find((block) => block.Schema.id === blockId);
        if (block) {
          setPageBlocks(block, Number(position));
        }
      } else if (data.type === 'removeBlock') {
        const blockId = data.content;
        removeBlock(blockId);
      } else if (data.type === 'selectBlock') {
        const blockId = data.content;
        selectBlock(blockId);
      } else if (data.type === 'moveBlockUp') {
        const blockId = data.content;
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block.id === blockId);
          if (blockIndex === 0) return;
          const newBlocks = [...blocks];
          [newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [newBlocks[blockIndex], newBlocks[blockIndex - 1]];
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: newBlocks,
          };
          setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'moveBlockDown') {
        const blockId = data.content;
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block.id === blockId);
          if (blockIndex === blocks.length - 1) return;
          const newBlocks = [...blocks];
          [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: newBlocks,
          };
          setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'copyBlock') {
        const blockId = data.content;
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block.id === blockId);
          const block = blocks[blockIndex];
          const newBlock = {
            ...block,
            id: uuidv4(),
          };
          const newBlocks = [...blocks].map((block) => ({ ...block, isSelected: false }));
          newBlocks.splice(blockIndex + 1, 0, newBlock);
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: newBlocks,
          };
          setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'Undo') {
        undo();
      } else if (data.type === 'Redo') {
        redo();
      } else if (data.type === 'moveBlockToPosition') {
        console.log(data.content);
        const { blockId, position } = JSON.parse(data.content);
        const newIndex = Number(position);
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block?.id === blockId);
          const newBlocks = [...blocks];
          newBlocks.splice(blockIndex, 1);
          newBlocks.splice(newIndex, 0, blocks[blockIndex]);
          page.blocks = {
            ...page.blocks,
            [page.activeLanguageLocale]: newBlocks,
          };

          setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [pages, blocks, setPages, activePage, undo, redo]);

  return {};
}
