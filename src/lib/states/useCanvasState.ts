import { create } from 'zustand';

type State = {
  zooming: boolean;
  zoomingOut: boolean;
  isMouseOver: boolean;
  panning: boolean;
  setZooming: (value: boolean) => void;
  setZoomingOut: (value: boolean) => void;
  setIsMouseOver: (value: boolean) => void;
  setPanning: (value: boolean) => void;
};

export const useCanvasState = create<State>((set) => ({
  zooming: false,
  zoomingOut: false,
  isMouseOver: false,
  panning: false,
  setZooming: (zooming) => set(() => ({ zooming })),
  setZoomingOut: (zoomingOut) => set(() => ({ zoomingOut })),
  setIsMouseOver: (isMouseOver) => set(() => ({ isMouseOver })),
  setPanning: (panning) => set(() => ({ panning })),
}));
