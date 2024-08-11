import { PAGES } from '@/lib/constants';
import useIframe from '@/lib/hooks/useIframe';

export default function IframeView() {
  const { iframeRef } = useIframe(false);
  const url = `${window.location.protocol}//${window.location.host}${PAGES.PAGE_CONTENT}`;
  return (
    <div className="visio-cms-mt-3 visio-cms-h-full visio-cms-bg-white visio-cms-rounded-md">
      <iframe src={url} ref={iframeRef} className="visio-cms-w-full visio-cms-h-full visio-cms-rounded-md" />
    </div>
  );
}
