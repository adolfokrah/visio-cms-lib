import { PAGES } from '@/lib/constants';
import { useIframeState } from '@/lib/states/useIframeState';
import { useEffect, useRef } from 'react';

export default function IframeView() {
  const url = `${window.location.protocol}//${window.location.host}${PAGES.PAGE_CONTENT}`;
  const { setIframe } = useIframeState();
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      setIframe(ref.current);
    }
  }, [ref, setIframe]);

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
