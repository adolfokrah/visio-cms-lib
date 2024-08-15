import { usePageContentState } from '@/lib/states/usePageContentState';
import { sendMessageToParent } from '@/lib/utils';
import { debounce } from 'lodash';
import sanitizeHtml from 'sanitize-html';

export default function useTextEditor({ propName, defaultValue }: { propName: string; defaultValue?: string }) {
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page.active);

  const selectedBlock = activePage?.blocks?.[activePage.activeLanguageLocale].find((block) => block.isSelected);
  const globalBlock = globalBlocks?.find((block) => block.id === selectedBlock?.globalBlockId);

  const debouncedOnUpdate = debounce(({ value }: { value: string }) => {
    sendMessageToParent({ type: 'updateBlockInput', content: JSON.stringify({ path: propName, value }) });
  }, 500);

  const html = sanitizeHtml(defaultValue || '');

  return { html, debouncedOnUpdate, globalBlock, selectedBlock, activePage };
}
