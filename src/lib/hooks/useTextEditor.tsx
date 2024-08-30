import { usePageContentState } from '@/lib/states/usePageContentState';
import { getProjectMode, sendMessageToParent } from '@/lib/utils';
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
    const projectMode = getProjectMode();
    if (projectMode === 'LIVE') return false;
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

  let html = sanitizeHtml(defaultValue || '', {
    allowedAttributes: false,
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
  });
  const removeRegexP = /<p><\/p>/g;
  html = html.replace(removeRegexP, '<br>');
  return { html, debouncedOnUpdate, isBlockGlobal, activePage };
}
