import { usePageContentState } from '@/lib/states/usePageContentState';
import { cn, getProjectMode, getSelectedBlock, sendMessageToParent } from '@/lib/utils';
import React from 'react';

type ListProps<T> = {
  pageBlockId: string;
  component?: string;
  itemComponent?: string;
  propName?: string;
  className?: string;
  listItemClassName?: string;
  renderComponent: (value: T, index: number) => JSX.Element;
  defaultPropValues?: T[];
  setListItemClassName?: (value: T, index: number) => string;
};

export default function List<T>({
  pageBlockId = '',
  component = 'ul',
  itemComponent = 'li',
  propName = '',
  className = '',
  renderComponent,
  listItemClassName = '',
  setListItemClassName,
  defaultPropValues = [],
}: ListProps<T>) {
  const { selectedListItem } = usePageContentState();
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page?.active);
  const pageBlocks = activePage?.blocks?.[activePage?.activeLanguageLocale] || [];
  const foundBlock = pageBlocks.find((block) => block?.id === pageBlockId);
  const selectedBlock = getSelectedBlock(pageBlocks);
  const globalBlock = globalBlocks?.find((block) => block.id === foundBlock?.globalBlockId);
  const projectMode = getProjectMode();

  const children = defaultPropValues.map((values, index) => {
    return React.createElement(itemComponent, {
      key: `${propName}.${index}`,
      className: cn('visio-cms-list-none', listItemClassName || setListItemClassName?.(values, index), {
        'visio-cms-outline visio-cms-outline-2 visio-cms-outline-blue-500':
          `${selectedBlock?.id}.${selectedListItem?.propName}` === `${pageBlockId}.${propName}.${index}` &&
          !globalBlock,
      }),
      children: renderComponent(values, index),
      onClick: (e: MouseEvent) => {
        if (globalBlock || projectMode != 'BUILDER') return;
        e.stopPropagation();
        sendMessageToParent({
          type: 'setSelectedListItem',
          content: JSON.stringify({ propName: `${propName}.${index}`, pageBlockId }),
        });
      },
    });
  });

  if (!component) return children;

  return React.createElement(component, {
    className: cn(className),
    children,
  });
}
