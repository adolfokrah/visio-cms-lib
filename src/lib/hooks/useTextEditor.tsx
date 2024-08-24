import { usePageContentState } from '@/lib/states/usePageContentState';
import { sendMessageToParent } from '@/lib/utils';
import { debounce } from 'lodash';
import { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';

export default function useTextEditor({
  propName,
  defaultValue,
  pageBlockId,
}: {
  propName: string;
  defaultValue?: string;
  pageBlockId: string;
}) {
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page.active);

  const isBlockGlobal = useMemo(() => {
    const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
    const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);

    return globalBlocks.some((block) => block.id === foundBlock?.globalBlockId);
  }, [activePage, globalBlocks, pageBlockId]);

  const debouncedOnUpdate = debounce(({ value }: { value: string }) => {
    sendMessageToParent({
      type: 'updateBlockInput',
      content: JSON.stringify({ propName, value, pageBlockId, editor: true }),
    });
  }, 500);

  let html = sanitizeHtml(defaultValue || '');
  const removeRegexP = /<p><\/p>/g;
  html = html.replace(removeRegexP, '<br>');

  return { html, debouncedOnUpdate, isBlockGlobal, activePage };
}
