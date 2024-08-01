import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ResponseBar from './components/response-bar';
import { useResponseBarState } from '@/lib/states/useResponsiveBarState';

export default function Canvas() {
  const { views, selectedView } = useResponseBarState();

  return (
    <TransformWrapper>
      <TransformComponent
        wrapperClass="visio-cms-w-full visio-cms-h-[calc(100vh-84px)] "
        contentClass="visio-cms-h-[900px] visio-cms-w-[1200px]"
        contentStyle={{ width: views.find((view) => view.view === selectedView)?.size }}
      >
        <div className="visio-cms-w-full visio-cms-pt-32">
          <ResponseBar />
          <div>Main page</div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
