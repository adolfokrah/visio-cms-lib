import { create } from 'zustand';

type State = {
  iframe?: HTMLIFrameElement;
  setIframe: (iframe: HTMLIFrameElement) => void;
  iframeHeight: number;
  setIframeHeight: (height: number) => void;
};

export const useIframeState = create<State>((set) => ({
  iframe: undefined,
  setIframe: (iframe) => set(() => ({ iframe })),
  iframeHeight: 2000,
  setIframeHeight: (iframeHeight) => set(() => ({ iframeHeight })),
}));
