import { usePageContentState } from '@/lib/states/usePageContentState';
import { getProjectMode, getSelectedBlock,  sendMessageToParent } from '@/lib/utils';
import { debounce } from 'lodash';
import { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import { PageBlock } from '../exposed-types';

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
    const selectedBlock = getSelectedBlock(pageBlocks, pageBlockId) as PageBlock
    return globalBlocks.some((block) => block.id === selectedBlock?.globalBlockId);
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
