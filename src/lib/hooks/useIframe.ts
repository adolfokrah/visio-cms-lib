import { useEffect, useMemo, useRef, useState } from 'react';
import { useIframeState } from '../states/useIframeState';
import { usePagesState } from '../states/usePagesState';
import { Message } from '../types';

export default function useIframe(hookAvailableInIframe: boolean) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setIframe, setIframeHeight } = useIframeState();
  const { pages } = usePagesState();
  const activePage = useMemo(() => pages.find((page) => page.active), [pages]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    //this useEffect runs outside the iframe
    if (hookAvailableInIframe) return;

    const iframe = iframeRef.current;
    if (iframe) {
      setIframe(iframe);

      const handleSetInitialData = () => {
        if (activePage && iframe.contentWindow) {
          const message = { type: 'greeting', content: activePage?.name };
          iframe.contentWindow.postMessage(message, '*');
        }
      };
      handleSetInitialData();

      iframe.contentWindow?.addEventListener('load', () => {
        setTimeout(() => {
          handleSetInitialData();
        }, 500);
      });

      return () => {
        iframe?.contentWindow?.removeEventListener('load', handleSetInitialData);
      };
    }
  }, [iframeRef, setIframe, activePage, hookAvailableInIframe]);

  useEffect(() => {
    //this useEffect runs inside the iframe
    if (!hookAvailableInIframe) return;

    const handleMessage = (event: MessageEvent) => {
      const data: Message = event.data;
      if (data.type === 'greeting') {
        getWindowHeight();
        setMessage(data.content);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('resize', getWindowHeight);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('resize', getWindowHeight);
    };
  }, [hookAvailableInIframe, iframeRef, setMessage]);

  useEffect(() => {
    //this useEffect runs outside the iframe
    if (hookAvailableInIframe) return;

    const handleMessage = (event: MessageEvent) => {
      const data: Message = event.data;
      if (data.type === 'setHeight') {
        setIframeHeight(parseInt(data.content));
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [hookAvailableInIframe, setIframeHeight]);

  const sendMessageToParent = (messageToSend: Message) => {
    window.parent.postMessage(messageToSend, '*'); // Replace '*' with the specific origin if needed
  };

  const getWindowHeight = () => {
    if (window) {
      const scrollHeight = window.document.body.scrollHeight;
      sendMessageToParent({ type: 'setHeight', content: scrollHeight.toString() });
    }
  };

  return { iframeRef, message };
}
