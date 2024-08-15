import Tiptap from '@/components/ui/tiptap/tiptap';
import { usePageContentState } from '@/lib/states/usePageContentState';
import { EditorControlTypes } from '@/lib/types';
import { sendMessageToParent } from '@/lib/utils';
import { debounce } from 'lodash';
import sanitizeHtml from 'sanitize-html';

export type TextEditorControls = Exclude<
  EditorControlTypes,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'bullet-list' | 'ordered-list' | 'blockquote' | 'image'
>;

export default function Text({
  allowedControls = [],
  defaultValue,
  propName,
}: {
  allowedControls?: TextEditorControls[];
  defaultValue?: string;
  propName: string;
}) {
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page.active);
  if (!activePage) return null;

  const selectedBlock = activePage?.blocks?.[activePage.activeLanguageLocale].find((block) => block.isSelected);
  if (!selectedBlock) return null;
  const globalBlock = globalBlocks.find((block) => block.id === selectedBlock.globalBlockId);

  const debouncedOnUpdate = debounce(({ value }: { value: string }) => {
    sendMessageToParent({ type: 'updateBlockInput', content: JSON.stringify({ path: propName, value }) });
  }, 500);

  const html = sanitizeHtml(defaultValue || '');

  if (globalBlock) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <Tiptap
      allowedControls={allowedControls}
      defaultValue={defaultValue}
      allowNewLines={false}
      onChange={(value) => {
        debouncedOnUpdate({ value });
      }}
    />
  );
}
