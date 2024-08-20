import { useEffect, useState } from 'react';
import { usePagesState } from '../states/usePagesState';
import { Block, Message } from '../types';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import useUndoAndRedo from './useUndoAndRedo';
import { updateValueByPath } from '../utils';
import { useRepeaterState } from '../states/useRepeaterState';
import useBlockHistory from './useBlockHistory';

export default function useCanvas() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks, globalBlocks } = useProjectConfigurationState();
  const { undo, redo } = useUndoAndRedo();
  const [blockToAddAsGlobalId, setBlockToAddAsGlobalId] = useState<string | null>(null);
  const { setSelectedRepeaterItem } = useRepeaterState();
  const { addBlocksToPageHistory } = useBlockHistory();

  useEffect(() => {
    const setPageBlocks = (block: Block, position: number, isGlobalBlock: boolean, globalBlockId: string) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = [...blocks].map((block) => ({ ...block, isSelected: false }));
        const globalBlock = globalBlocks.find((block) => block.id === globalBlockId);
        newBlocks.splice(position, 0, {
          id: uuidv4(),
          blockId: block.Schema.id,
          isSelected: true,
          inputs: globalBlock?.inputs || block.Schema.defaultPropValues,
          isGlobalBlock,
          globalBlockId,
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
      setSelectedRepeaterItem(null);

      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = blocks.map((block) => ({ ...block, isSelected: block.id === blockId }));
        page.blocks = {
          ...page.blocks,
          [page.activeLanguageLocale]: newBlocks,
        };
        setPages(pages.map((p) => (p.active ? page : p)));
      }
    };

    const handleMessage = (event: MessageEvent) => {
      const data: Message = event.data;
      if (data.type === 'addBlock') {
        const { blockId, position, isGlobal, globalBlockId } = JSON.parse(data.content);

        const block = blocks.find((block) => block.Schema.id === blockId);
        if (block) {
          setPageBlocks(block, Number(position), isGlobal, globalBlockId);
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
      } else if (data.type === 'convertBlockToGlobal') {
        const blockId = data.content;
        setBlockToAddAsGlobalId(blockId);
      } else if (data.type === 'updateBlockInput') {
        const { propName, value, pageBlockId, editor } = JSON.parse(data.content);

        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const foundBlock = blocks.find((block) => block.id === pageBlockId);
          if (foundBlock) {
            const path = propName.split('.');

            const blockInputs = updateValueByPath(foundBlock.inputs, path, value);

            page.blocks = {
              ...page.blocks,
              [page.activeLanguageLocale]: blocks.map((block) =>
                block.id === pageBlockId ? { ...block, inputs: blockInputs } : block,
              ),
            };
            setPages(pages.map((p) => (p.active ? page : p)));
            if (!editor) addBlocksToPageHistory(page.activeLanguageLocale, [...JSON.parse(JSON.stringify(blocks))]);
          }
        }
      } else if (data.type === 'setSelectedRepeaterItemSchema') {
        const subRepeaterSchema = JSON.parse(data.content);
        setSelectedRepeaterItem(subRepeaterSchema);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [pages, blocks, setPages, activePage, undo, redo, globalBlocks, setSelectedRepeaterItem, addBlocksToPageHistory]);

  return { blockToAddAsGlobalId, setBlockToAddAsGlobalId };
}
