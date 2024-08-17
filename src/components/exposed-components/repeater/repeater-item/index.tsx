import { RepeaterSchema } from '@/lib/states/useRepeaterState';
import { sendMessageToParent } from '@/lib/utils';

export default function RepeaterItem({
  children,
  component,
  propName,
  subRepeatersSchema,
}: {
  children: React.ReactNode;
  component: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'ol' | 'li';
  propName: string;
  subRepeatersSchema?: Omit<RepeaterSchema, 'propName'>[];
}) {
  const Tag = component || 'div';

  return (
    <Tag
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
  );
}
