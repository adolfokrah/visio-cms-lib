import { PAGES } from '@/lib/constants';
import { useIframeState } from '@/lib/states/useIframeState';
import { useEffect, useRef } from 'react';

export default function IframeView() {
  const url = `${window.location.protocol}//${window.location.host}${PAGES.PAGE_CONTENT}`;
  const { setIframe, iframeHeight } = useIframeState();
  const ref = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      setIframe(ref.current);
    }
  }, [ref, setIframe]);

  return (
    <div className="visio-cms-mt-3 visio-cms-h-full visio-cms-bg-transparent visio-cms-rounded-md">
      <iframe
        ref={ref}
        src={url}
        style={{ height: `${iframeHeight}px` }}
        className="visio-cms-w-full visio-cms-h-full visio-cms-rounded-md visio-cms-m-0 visio-cms-p-0 rounded"
      />
    </div>
  );
}
