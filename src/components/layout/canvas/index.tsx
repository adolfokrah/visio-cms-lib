import { RESPONSIVE_VIEWS } from '@/lib/constants';
import IframeView from './components/iframe-view';
import { usePagesState } from '@/lib/states/usePagesState';
import useCanvas from '@/lib/hooks/useCanvas';

export default function Canvas() {
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  useCanvas();

  const selectedView = RESPONSIVE_VIEWS.find((view) => view.view === activePage?.selectedView);
  return (
    <>
      <div
        style={{ width: selectedView?.view == 'Desktop' ? '100%' : selectedView?.size, margin: 'auto' }}
        className="visio-cms-transition-all visio-cms-ease-in-out visio-cms-duration-200"
      >
        <IframeView />
      </div>
    </>
  );
}
