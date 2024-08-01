import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ResponseBar from './components/response-bar';
import { usePagesState } from '@/lib/states/usePagesState';
import { RESPONSIVE_VIEWS } from '@/lib/constants';

export default function Canvas() {
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  if (!activePage) return null;

  return (
    <TransformWrapper>
      <TransformComponent
        wrapperClass="visio-cms-w-full visio-cms-h-[calc(100vh-84px)] "
        contentClass="visio-cms-h-[900px] visio-cms-w-[1200px]"
        contentStyle={{ width: RESPONSIVE_VIEWS.find((view) => view.view === activePage.selectedView)?.size }}
      >
        <div className="visio-cms-w-full visio-cms-pt-32">
          <ResponseBar />
          <div>Main page</div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
