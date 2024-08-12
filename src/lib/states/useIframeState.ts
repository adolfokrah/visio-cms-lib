import { create } from 'zustand';

type State = {
  iframe?: HTMLIFrameElement;
  setIframe: (iframe: HTMLIFrameElement) => void;
  iframeHeight: number;
  setIframeHeight: (height: number) => void;
  isMouseOver: boolean;
  setIsMouseOver: (isMouseOver: boolean) => void;
};

export const useIframeState = create<State>((set) => ({
  iframe: undefined,
  setIframe: (iframe) => set(() => ({ iframe })),
  iframeHeight: 0,
  setIframeHeight: (iframeHeight) => set(() => ({ iframeHeight })),
  isMouseOver: false,
  setIsMouseOver: (isMouseOver) => set(() => ({ isMouseOver })),
}));
