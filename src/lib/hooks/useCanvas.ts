import { useEffect, useState } from 'react';
import { PageBlock, usePagesState } from '../states/usePagesState';
import { Block, Message } from '../types';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import useUndoAndRedo from './useUndoAndRedo';
import {
  getSelectedBlock,
  getSelectedBlockPath,
  getValueByPath,
  updateIsSelectedByBlockId,
  updateValueByPath,
} from '../utils';
import useBlockHistory from './useBlockHistory';
import { useTabState } from '../states/useTabsState';
import { useListState } from '../states/useListState';
import { toast } from 'sonner';
import lodash from 'lodash';
export default function useCanvas() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { blocks, globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const { undo, redo } = useUndoAndRedo();
  const [blockToAddAsGlobal, setBlockToAddAsGlobal] = useState<{
    pageBlockId: string;
    propName?: string;
    parentBlockId?: string;
  } | null>(null);
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
      pageBlockId?: string,
      propName?: string,
    ) => {
      const page = activePage;

      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = updateIsSelectedByBlockId(lodash.cloneDeep(blocks), '') as PageBlock[];
        const globalBlock = globalBlocks.find((block) => block.id === globalBlockId);
        const foundBlock = getSelectedBlock(newBlocks, pageBlockId);
        const copiedBlock = localStorage.getItem('copiedBlock');
        const inputs =
          fromClipBoard && copiedBlock
            ? JSON.parse(copiedBlock)?.inputs
            : globalBlock?.inputs || block.Schema.defaultPropValues;

       
        if (propName && foundBlock) {
          const foundPropInput = getValueByPath(foundBlock?.inputs, propName.split('.')) || [];
          foundPropInput.splice(position, 0, {
            id: uuidv4(),
            blockId: block.Schema.id,
            isSelected: true,
            inputs,
            isGlobalBlock,
            globalBlockId,
          });
          const newInputs = updateValueByPath(foundBlock?.inputs, propName.split('.'), foundPropInput);
          foundBlock.inputs = newInputs;
        } else {
          newBlocks.splice(position, 0, {
            id: uuidv4(),
            blockId: block.Schema.id,
            isSelected: true,
            inputs,
            isGlobalBlock,
            globalBlockId,
          });
        }

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
        let newBlocks = [...blocks];
        if (blocks.find((block) => block.id === blockId)) {
          newBlocks = blocks.filter((block) => block.id !== blockId);
        } else {
          const blockPath = getSelectedBlockPath(newBlocks, blockId);

          const path = blockPath ? blockPath.split('.') : [];
          path.pop();
          const foundInput = (getValueByPath(newBlocks, path) || []) as PageBlock[];

          const blocks = updateValueByPath(
            newBlocks,
            path,
            foundInput.filter((block) => block.id != blockId),
          );
          newBlocks = blocks;
        }

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
        const newBlocks = updateIsSelectedByBlockId(lodash.cloneDeep(blocks), blockId);
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
        const { blockId, position, isGlobal, globalBlockId, fromClipBoard, pageBlockId, propName } = JSON.parse(
          data.content,
        );

        const block = blocks.find((block) => block.Schema.id === blockId);
        if (block) {
          setPageBlocks(
            block,
            Number(position),
            isGlobal,
            globalBlockId,
            fromClipBoard || false,
            pageBlockId,
            propName,
          );
        }
      } else if (data.type === 'removeBlock') {
        const { pageBlockId } = JSON.parse(data.content);
        removeBlock(pageBlockId);
      } else if (data.type === 'selectBlock') {
        const { blockId } = JSON.parse(data.content);
        selectBlock(blockId, true);
      } else if (data.type === 'moveBlockUp') {
        const { pageBlockId } = JSON.parse(data.content);
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block.id === pageBlockId);
          let newBlocks = [...blocks];

          if (blockIndex < 0) {
            const blockPath = getSelectedBlockPath(newBlocks, pageBlockId);

            const path = blockPath ? blockPath.split('.') : [];
            path.pop();
            const foundInput = (getValueByPath(newBlocks, path) || []) as PageBlock[];
            const blockIndex = foundInput.findIndex((block) => block.id === pageBlockId);

            if (blockIndex === 0) return;
            [foundInput[blockIndex - 1], foundInput[blockIndex]] = [foundInput[blockIndex], foundInput[blockIndex - 1]];

            const blocks = updateValueByPath(newBlocks, path, foundInput);
            newBlocks = blocks;
          } else {
            if (blockIndex === 0) return;
            [newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [newBlocks[blockIndex], newBlocks[blockIndex - 1]];
          }

          // setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'moveBlockDown') {
        const { pageBlockId } = JSON.parse(data.content);
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block.id === pageBlockId);
          let newBlocks = [...blocks];
          if (blockIndex < 0) {
            const blockPath = getSelectedBlockPath(newBlocks, pageBlockId);

            const path = blockPath ? blockPath.split('.') : [];
            path.pop();
            const foundInput = (getValueByPath(newBlocks, path) || []) as PageBlock[];
            const blockIndex = foundInput.findIndex((block) => block.id === pageBlockId);

            if (blockIndex === foundInput.length - 1) return;
            [foundInput[blockIndex], foundInput[blockIndex + 1]] = [foundInput[blockIndex + 1], foundInput[blockIndex]];

            const blocks = updateValueByPath(newBlocks, path, foundInput);
            newBlocks = blocks;
          } else {
            if (blockIndex === blocks.length - 1) return;

            [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
          }

          // setPages(pages.map((p) => (p.active ? page : p)));
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
        }
      } else if (data.type === 'duplicateBlock') {
        const { pageBlockId } = JSON.parse(data.content);
        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockIndex = blocks.findIndex((block) => block.id === pageBlockId);
          let newBlocks = [...blocks].map((block) => ({ ...block, isSelected: false }));
          if (blockIndex > -1) {
            const block = blocks[blockIndex];
            newBlocks.splice(blockIndex + 1, 0, {
              ...block,
              id: uuidv4(),
            });
          } else {
            const blockPath = getSelectedBlockPath(newBlocks, pageBlockId);
            const path = blockPath ? blockPath.split('.') : [];
            path.pop();
            const foundInput = (getValueByPath(newBlocks, path) || []) as PageBlock[];

            const blockIndex = foundInput.findIndex((block) => block.id === pageBlockId);
            const block = foundInput[blockIndex];
            const id = uuidv4();
            foundInput.splice(blockIndex + 1, 0, {
              ...block,
              id,
            });

            const blocks = updateValueByPath(newBlocks, path, foundInput);

            newBlocks = updateIsSelectedByBlockId(blocks, id);
          }

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
        const { pageBlockId, propName, parentBlockId } = JSON.parse(data.content);
        setBlockToAddAsGlobal({ pageBlockId, propName, parentBlockId });
      } else if (data.type === 'updateBlockInput') {
        const { propName, value, pageBlockId } = JSON.parse(data.content);

        const page = activePage;
        if (page) {
          const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
          const blockPath = getSelectedBlockPath(blocks, pageBlockId);
          const path = propName.split('.');
          const newBlocks = updateValueByPath(
            blocks,
            blockPath ? `${blockPath}.inputs.${propName}`.split('.') : path,
            value,
          );
          addBlocksToPageHistory(page.activeLanguageLocale, newBlocks);
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
        const pageBlock = getSelectedBlock(activePage?.blocks?.[activePage.activeLanguageLocale], blockId)
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

  return { blockToAddAsGlobal, setBlockToAddAsGlobal };
}
