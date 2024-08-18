import { usePageContentState } from '@/lib/states/usePageContentState';
import { useRepeaterState } from '@/lib/states/useRepeaterState';
import { cn } from '@/lib/utils';
import React from 'react';

type RepeaterProps = {
  pageBlockId: string;
  propName: string;
  className?: string;
  children: React.ReactNode;
};

export default function Repeater({ pageBlockId, propName, className, children, ...props }: RepeaterProps) {
  const { repeaterId, setRepeaterId } = useRepeaterState();
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page.active);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);
  const globalBlock = globalBlocks.find((block) => block.id === foundBlock?.globalBlockId);

  return (
    <ul
      {...props}
      id={propName}
      onClick={() => {
        if (globalBlock) {
          return null;
        }
        setRepeaterId(propName);
      }}
      className={cn(className, {
        'visio-cms-outline-blue-400 visio-cms-outline visio-cms-outline-2 -visio-cms-outline-offset-2 visio-cms-w-max':
          repeaterId === propName && pageBlockId === pageBlocks.find((block) => block.isSelected)?.id,
      })}
    >
      {React.Children.map(children, (child, index) => (
        <>{React.cloneElement(child as React.ReactElement, { propName: `${propName}.${index}` })}</>
      ))}
    </ul>
  );
}
