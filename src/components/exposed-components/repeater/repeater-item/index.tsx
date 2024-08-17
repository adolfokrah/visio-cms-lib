import { RepeaterSchema } from '@/lib/states/useRepeaterState';
import { sendMessageToParent } from '@/lib/utils';
import React from 'react';

export default function RepeaterItem<T extends React.ElementType>({
  children,
  component,
  propName,
  subRepeatersSchema,
  ...props
}: {
  children: React.ReactNode;
  component: React.ElementType;
  propName: string;
  subRepeatersSchema?: Omit<RepeaterSchema, 'propName'>[];
} & React.ComponentPropsWithoutRef<T>) {
  const Tag = component || 'div';

  return (
    <>
      <Tag
        {...props}
        onClick={() => {
          sendMessageToParent({
            type: 'setSelectedRepeaterItemSchema',
            content: JSON.stringify({
              repeaterItemId: propName,
              subRepeatersSchemas:
                subRepeatersSchema?.map((schema) => ({
                  ...schema,
                  propName: `${propName}.${schema.name}`,
                })) || [],
            }),
          });
        }}
      >
        {children}
      </Tag>
    </>
  );
}
