import { addGlobalBlockSchema } from '../zod-schemas/add-global-block-schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import { ResponsiveView, usePagesState } from '../states/usePagesState';
import { toast } from 'sonner';
import { getSelectedBlock, getSelectedBlockPath, updateOrInsertProjectConfig, updateValueByPath } from '../utils';
import useBlockHistory from './useBlockHistory';
import { cloneDeep } from 'lodash';

export default function useGlobalBlock(onClose?: () => void) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { globalBlocks, setGlobalBlocks, blocks } = useProjectConfigurationState();
  const { addBlocksToPageHistory } = useBlockHistory();
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);

  const addGlobalBlockForm = useForm<z.infer<typeof addGlobalBlockSchema>>({
    resolver: zodResolver(addGlobalBlockSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onAddGlobalBlock(data: z.infer<typeof addGlobalBlockSchema> & { pageBlockId: string }) {
    if (!activePage) throw new Error('Active page not found');

    const name = data.name;
    const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] ?? [];
    const pageBlock = getSelectedBlock(pageBlocks, data.pageBlockId);
    const blockId = blocks.find((block) => block.id === pageBlock?.blockId)?.id;
    if (!pageBlock || !blockId) {
      setErrorMessage('Block not found');
      return;
    }

    const foundBlock = globalBlocks.find((block) => block.name.toLowerCase() === name.toLowerCase());
    if (foundBlock) {
      setErrorMessage('Block with the same name already exists');
      return;
    }
    setLoading(true);

    try {
      const id = uuidv4();
      const newBlock = {
        id,
        name,
        blockId,
        inputs: { ...pageBlock?.inputs },
        selectedView: 'Desktop' as ResponsiveView,
        autoSave: false,
        initialState: {},
      };
      newBlock.initialState = cloneDeep({ ...newBlock });
      const newGlobalBlocks = [...globalBlocks, newBlock];
      await updateOrInsertProjectConfig({ global_blocks: newGlobalBlocks });
      setGlobalBlocks(newGlobalBlocks);
      addGlobalBlockForm.reset();

      const blockPath = getSelectedBlockPath(pageBlocks, pageBlock.id);
      let newBlocks = updateValueByPath(pageBlocks, `${blockPath}.isGlobalBlock`.split('.'), true);
      newBlocks = updateValueByPath(newBlocks, `${blockPath}.globalBlockId`.split('.'), id);

      setPages(
        pages.map((p) =>
          p.active
            ? {
                ...activePage,
                blocks: {
                  ...activePage.blocks,
                  [activePage.activeLanguageLocale]: newBlocks,
                },
              }
            : p,
        ),
      );

      addBlocksToPageHistory(activePage.activeLanguageLocale, newBlocks);

      toast.success('Block added successfully');
      if (onClose) onClose();
    } catch (e: any) {
      setErrorMessage(e?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { onAddGlobalBlock, addGlobalBlockForm, loading, errorMessage, setErrorMessage };
}
