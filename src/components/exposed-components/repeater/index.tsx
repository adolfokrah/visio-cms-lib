import { usePageContentState } from '@/lib/states/usePageContentState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { useRepeaterState } from '@/lib/states/useRepeaterState';
import { cn } from '@/lib/utils';

type RepeaterProps<T> = {
  renderBlock: (index: number, value: T, propPath: string) => JSX.Element;
  pageBlockId: string;
  defaultValue: T[];
  propName: string;
  className?: string;
  component: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'ol' | 'li';
};

export default function Repeater<T>({
  renderBlock,
  pageBlockId,
  defaultValue,
  propName,
  className,
  component = 'div',
}: RepeaterProps<T>) {
  const { repeaterId, setRepeaterId } = useRepeaterState();
  const { pages } = usePageContentState();
  const { globalBlocks } = useProjectConfigurationState();
  const activePage = pages.find((page) => page.id === pageBlockId);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
  const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);
  const globalBlock = globalBlocks.find((block) => block.id === foundBlock?.globalBlockId);

  const Tag = component || 'div';
  return (
    <Tag
      id={propName}
      key={`${defaultValue}`}
      onClick={(e) => {
        if (globalBlock) return null;
        e.stopPropagation();
        setRepeaterId(propName);
      }}
      className={cn(className, {
        'visio-cms-outline-blue-400 visio-cms-outline visio-cms-outline-2 -visio-cms-outline-offset-2 ':
          repeaterId === propName,
      })}
    >
      {defaultValue.map((value, index) => renderBlock(index, value, `${propName}.${index}`))}
    </Tag>
  );
}
