import { useEffect, useState } from 'react';
import { usePagesState } from '../states/usePagesState';
import { Block, Message } from '../types';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import useUndoAndRedo from './useUndoAndRedo';
import { updatePageData, updateValueByPath } from '../utils';
import useBlockHistory from './useBlockHistory';
import { useTabState } from '../states/useTabsState';
import { useListState } from '../states/useListState';
import { toast } from 'sonner';

export default function useCanvas() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks, globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const { undo, redo } = useUndoAndRedo();
  const [blockToAddAsGlobalId, setBlockToAddAsGlobalId] = useState<string | null>(null);
  const { setSelectedListItem } = useListState();
  const { addBlocksToPageHistory, addInputsToGlobalBlockHistory } = useBlockHistory();
  const { tabs, setTabs } = useTabState();

  useEffect(() => {
    const setPageBlocks = async (
      block: Block,
      position: number,
      isGlobalBlock: boolean,
      globalBlockId: string,
      fromClipBoard?: boolean,
    ) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = [...blocks].map((block) => ({ ...block, isSelected: false }));
        const globalBlock = globalBlocks.find((block) => block.id === globalBlockId);
        const copiedBlock = localStorage.getItem('copiedBlock');
        const inputs =
          fromClipBoard && copiedBlock
            ? JSON.parse(copiedBlock)?.inputs
            : globalBlock?.inputs || block.Schema.defaultPropValues;
        newBlocks.splice(position, 0, {
          id: uuidv4(),
          blockId: block.Schema.id,
          isSelected: true,
          inputs,
          isGlobalBlock,
          globalBlockId,
        });

        // setPages(pages.map((p) => (p.active ? page : p)));
        await addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        if (fromClipBoard) {
          localStorage.removeItem('copiedBlock');
        }
      }
    };

    const removeBlock = (blockId: string) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = blocks.filter((block) => block.id !== blockId);

        // setPages(pages.map((p) => (p.active ? page : p)));
        addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
      }
    };

    const selectBlock = (blockId: string, deselectRepeater = true) => {
      if (deselectRepeater) {
        setSelectedListItem(null);
      }

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

    const handleMessage = async (event: MessageEvent) => {
      const data: Message = event.data;
      if (data.type === 'addBlock') {
        const { blockId, position, isGlobal, globalBlockId, fromClipBoard } = JSON.parse(data.content);

        const block = blocks.find((block) => block.Schema.id === blockId);
        if (block) {
          setPageBlocks(block, Number(position), isGlobal, globalBlockId, fromClipBoard || false);
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

          // setPages(pages.map((p) => (p.active ? page : p)));
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

          // setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'duplicateBlock') {
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

          // setPages(pages.map((p) => (p.active ? page : p)));
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

          // setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'convertBlockToGlobal') {
        const blockId = data.content;
        setBlockToAddAsGlobalId(blockId);
      } else if (data.type === 'updateBlockInput') {
        const { propName, value, pageBlockId } = JSON.parse(data.content);

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
            // setPages(pages.map((p) => (p.active ? page : p)));
            addBlocksToPageHistory(page.activeLanguageLocale, page.blocks[page.activeLanguageLocale]);
          }
        } else {
          ///user is editing a global block
          const globalBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);
          if (globalBlock) {
            const path = propName.split('.');
            const blockInputs = updateValueByPath(globalBlock?.inputs || {}, path, value);
            //update global block inputs and inputs to history

            addInputsToGlobalBlockHistory(globalBlock?.id || '', blockInputs);
          }
        }
      } else if (data.type === 'setSelectedListItem') {
        const selectedListItem = JSON.parse(data.content);
        setSelectedListItem(selectedListItem);
        if (selectedListItem?.pageBlockId) {
          selectBlock(selectedListItem.pageBlockId, false);
        }
      } else if (data.type === 'remove-selected-repeater') {
        setSelectedListItem(null);
      } else if (data.type === 'editGlobalBlock') {
        const blockId = data.content;

        const globalBlock = globalBlocks.find((block) => block.id === blockId);
        if (globalBlock) {
          if (tabs.find((tab) => tab.id === blockId)) {
            setTabs([...tabs.map((tab) => ({ ...tab, active: tab.id === blockId }))]);
            return;
          }
          setTabs([
            ...tabs.map((tab) => ({ ...tab, active: false })),
            { id: blockId, type: 'globalBlock', active: true, name: globalBlock?.name },
          ]);
          setPages(pages.map((page) => ({ ...page, active: false })));
        }
      } else if (data.type === 'unlinkBlockFromGlobal') {
        const blockId = data.content;
        const pageBlock = activePage?.blocks?.[activePage.activeLanguageLocale]?.find((block) => block.id === blockId);
        const globalBlockInputs = globalBlocks.find((block) => block.id === pageBlock?.globalBlockId)?.inputs;
        const page = activePage;
        if (page && globalBlockInputs) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const newBlocks = blocks.map((block) => {
            if (block.id === blockId) {
              return {
                ...block,
                inputs: { ...block.inputs, ...globalBlockInputs },
                isGlobalBlock: false,
                globalBlockId: '',
              };
            }
            return block;
          });

          // setPages(pages.map((p) => (p.active ? page : p)));
          await addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
          toast.success('Block unlinked from global block');
        }
      } else if (data.type === 'copyBlock') {
        const blockId = data.content;
        const pageBlock = activePage?.blocks?.[activePage.activeLanguageLocale]?.find((block) => block.id === blockId);
        if (pageBlock) {
          localStorage.setItem('copiedBlock', JSON.stringify(pageBlock));
          toast.success('Block copied');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [
    pages,
    blocks,
    setPages,
    activePage,
    undo,
    redo,
    globalBlocks,
    setSelectedListItem,
    addBlocksToPageHistory,
    setTabs,
    tabs,
    setGlobalBlocks,
    addInputsToGlobalBlockHistory,
  ]);

  useEffect(() => {
    (async () => {
      await updatePageData({ blocks_dev: activePage?.blocks }, activePage?.id || '');
    })();
  }, [activePage?.blocks, activePage?.id]);

  return { blockToAddAsGlobalId, setBlockToAddAsGlobalId };
}
