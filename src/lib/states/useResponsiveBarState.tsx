import { create } from 'zustand';
import { RESPONSIVE_VIEWS } from '../constants';

type ResponsiveView = 'Desktop' | 'Mobile' | 'Tablet';
export type ResponsiveViews = {
  view: ResponsiveView;
  size: string;
  icon: React.ReactNode;
};

export type ResponsiveTypes = {
  views: ResponsiveViews[];
  selectedView: ResponsiveView;
  setView: (view: ResponsiveView) => void;
};

export const useResponseBarState = create<ResponsiveTypes>((set) => ({
  views: RESPONSIVE_VIEWS,
  selectedView: RESPONSIVE_VIEWS[0].view,
  setView: (view) => {
    set({ selectedView: view });
  },
}));
