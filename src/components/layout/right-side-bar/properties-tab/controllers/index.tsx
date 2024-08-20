import { SideEditingPropsType } from '@/lib/types';
import TextController from './text-controller';
import { getValueByPath, updateValueByPath } from '@/lib/utils';
import { usePagesState } from '@/lib/states/usePagesState';
import lodash from 'lodash';
import useBlockHistory from '@/lib/hooks/useBlockHistory';
import ColorController from './color-controller';
import LinkController from './link-controller';
import ImageController from './image-controller';

export default function RenderController({ type, propName }: { type: SideEditingPropsType; propName: string }) {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const activeBlock = pageBlocks.find((block) => block.isSelected);
  const { addBlocksToPageHistory } = useBlockHistory();
  const defaultValue = getValueByPath(activeBlock?.inputs, propName.split('.'));

  const debounceChangePropValue = lodash.debounce((value: any) => {
    const page = activePage;
    if (activeBlock && page) {
      const blockInputs = updateValueByPath(activeBlock?.inputs, propName.split('.'), value);
      page.blocks = {
        ...page.blocks,
        [page.activeLanguageLocale]: pageBlocks.map((block) =>
          block.id === activeBlock.id ? { ...block, inputs: blockInputs } : block,
        ),
      };
      setPages(pages.map((p) => (p.active ? page : p)));
      addBlocksToPageHistory(page.activeLanguageLocale, [
        ...JSON.parse(JSON.stringify(page.blocks?.[page.activeLanguageLocale])),
      ]);
    }
  }, 300);
  switch (type) {
    case 'text':
      return <TextController defaultValue={defaultValue} onChange={debounceChangePropValue} />;
    case 'color':
      return <ColorController defaultValue={defaultValue} onChange={debounceChangePropValue} />;
    case 'link':
      return <LinkController defaultValue={defaultValue} onChange={debounceChangePropValue} />;
    case 'image':
      return <ImageController defaultValue={defaultValue} onChange={debounceChangePropValue} />;
    case 'number':
      return <TextController defaultValue={defaultValue} onChange={debounceChangePropValue} type="number" />;
    default:
      return null;
  }
}
