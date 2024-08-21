import { PAGES } from '@/lib/constants';
import { useTabState } from '@/lib/states/useTabsState';
import { useRef } from 'react';

export default function IframeView() {
  const { tabs } = useTabState();
  const pinnedTab = tabs.find((tab) => tab.active);
  const url = `${window.location.protocol}//${window.location.host}${pinnedTab?.type === 'page' ? PAGES.PAGE_CONTENT : PAGES.GLOBAL_BLOCK_EDIT_CONTENT}`;
  const ref = useRef<HTMLIFrameElement | null>(null);

  if (!pinnedTab) return null;
  return (
    <iframe
      ref={ref}
      src={url}
      onLoad={() => {
        ref?.current?.contentDocument?.body.classList.add('scrollbar-custom', 'visio-cms-bg-white');
      }}
      className="visio-cms-w-full visio-cms-h-[calc(100vh-90px)] visio-cms-rounded-md visio-cms-m-0 visio-cms-p-0 "
    />
  );
}
