import { SideEditingProps } from '@/lib/types';
import TextController from './text-controller';
import { getValueByPath, updateValueByPath } from '@/lib/utils';
import { usePagesState } from '@/lib/states/usePagesState';
import lodash from 'lodash';
import useBlockHistory from '@/lib/hooks/useBlockHistory';
import ColorController from './color-controller';
import LinkController from './link-controller';
import ImageController from './image-controller';
import SwitchController from './switch-controller';
import RadioGroupController from './radio-group-controller';
import SelectController from './select-controller';
import { useTabState } from '@/lib/states/useTabsState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import ListController from './list-controller';

export default function RenderController(props: SideEditingProps) {
  const { pages, setPages } = usePagesState();
  const { tabs } = useTabState();
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const activePage = pages.find((page) => page.active);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const activeBlock =
    pageBlocks.find((block) => block.isSelected) ||
    globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);
  const { addBlocksToPageHistory, addInputsToGlobalBlockHistory } = useBlockHistory();
  const defaultValue = getValueByPath(activeBlock?.inputs, props.propName.split('.'));

  const debounceChangePropValue = lodash.debounce((value: any) => {
    const page = activePage;
    if (activeBlock) {
      const blockInputs = updateValueByPath(activeBlock?.inputs, props.propName.split('.'), value);
      if (page) {
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
      } else {
        setGlobalBlocks(
          globalBlocks.map((block) => (block.id === activeBlock.id ? { ...block, inputs: blockInputs } : block)),
        );
        addInputsToGlobalBlockHistory(activeBlock.id, blockInputs);
      }
    }
  }, 300);

  switch (props.type) {
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
    case 'switch':
      return (
        <SwitchController
          defaultValue={defaultValue}
          onChange={debounceChangePropValue}
          onLabel={props.onLabel || ''}
          offLabel={props?.offLabel || ''}
        />
      );
    case 'radio-group':
      return (
        <RadioGroupController defaultValue={defaultValue} onChange={debounceChangePropValue} options={props.options} />
      );
    case 'select':
      return (
        <SelectController
          defaultValue={defaultValue}
          onChange={debounceChangePropValue}
          options={props.options}
          placeholder={props.placeholder}
        />
      );
    case 'list':
      return <ListController {...props} defaultValue={defaultValue} onChange={debounceChangePropValue} />;
    case 'custom':
      return (
        <props.component {...props.componentProps} defaultValue={defaultValue} onChange={debounceChangePropValue} />
      );
    default:
      return null;
  }
}
