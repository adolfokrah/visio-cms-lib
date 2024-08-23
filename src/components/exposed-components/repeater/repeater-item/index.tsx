import { usePageContentState } from '@/lib/states/usePageContentState';
import { RepeaterSchema } from '@/lib/states/useRepeaterState';
import { SideEditingProps } from '@/lib/types';
import { cn, getProjectMode, sendMessageToParent } from '@/lib/utils';
import React from 'react';

export default function RepeaterItem({
  children,
  propName,
  subRepeatersSchema,
  pageBlockId,
  className,
  sideEditingProps,
  ...props
}: {
  children: React.ReactNode;
  propName?: string;
  pageBlockId?: string;
  className?: string;
  subRepeatersSchema?: Omit<RepeaterSchema, 'propName'>[];
  sideEditingProps?: Omit<SideEditingProps, 'group'>[];
  key: string;
} & React.HTMLAttributes<HTMLLIElement>) {
  const { pages, globalBlocks, selectedRepeaterItem } = usePageContentState();
  const activePage = pages.find((page) => page.active);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);
  const globalBlock = globalBlocks.find((block) => block.id === foundBlock?.globalBlockId);
  const projectMode = getProjectMode();
  return (
    <li
      {...props}
      onClick={(e) => {
        e.stopPropagation();

        if (globalBlock || projectMode != 'BUILDER') return;

        sendMessageToParent({
          type: 'setSelectedRepeaterItemSchema',
          content: JSON.stringify({
            repeaterItemId: propName,
            pageBlockId,
            subRepeatersSchemas:
              subRepeatersSchema?.map((schema) => ({
                ...schema,
                propName: `${propName}.${schema.name}`,
                pageBlockId,
              })) || [],
            sideEditingProps,
          }),
        });
      }}
      className={cn(className, {
        'visio-cms-outline-blue-400 visio-cms-outline visio-cms-outline-2 -visio-cms-outline-offset-2 visio-cms-w-max':
          selectedRepeaterItem?.repeaterItemId === propName &&
          pageBlockId === pageBlocks.find((block) => block.isSelected)?.id,
      })}
    >
      {children}
    </li>
  );
}
