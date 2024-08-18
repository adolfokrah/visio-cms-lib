import { usePageContentState } from '@/lib/states/usePageContentState';
import { RepeaterSchema } from '@/lib/states/useRepeaterState';
import { SideEditingProps } from '@/lib/types';
import { cn, sendMessageToParent } from '@/lib/utils';
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
  sideEditingProps?: SideEditingProps[];
} & React.HTMLAttributes<HTMLLIElement>) {
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page.active);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);
  const globalBlock = globalBlocks.find((block) => block.id === foundBlock?.globalBlockId);

  return (
    <li
      {...props}
      onClick={() => {
        if (globalBlock) return;
        sendMessageToParent({
          type: 'setSelectedRepeaterItemSchema',
          content: JSON.stringify({
            repeaterItemId: propName,
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
      className={cn(className)}
    >
      {children}
    </li>
  );
}
