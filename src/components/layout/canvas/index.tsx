import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';
import ResponseBar from './components/response-bar';
import { RESPONSIVE_VIEWS } from '@/lib/constants';
import IframeView from './components/iframe-view';
import useCanvas from '@/lib/hooks/useCanvas';
import { Page, usePagesState } from '@/lib/states/usePagesState';
import { useCallback, useRef } from 'react';
import lodash from 'lodash';

export default function Canvas() {
  const { pages, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<ReactZoomPanPinchContentRef | null>(null);

  const debouncedOnTransformed = useCallback(
    lodash.debounce((_, state: { scale: number; positionX: number; positionY: number }) => {
      const activePage = pages.find((page) => page.active);
      if (lodash.isEqual(activePage?.canvasSettings, state)) {
        return;
      }
      const newPages = pages.map((page) => ({
        ...page,
        canvasSettings: page.active ? state : page.canvasSettings,
      }));
      setPages(newPages);
    }, 300),
    [pages],
  );
  if (!activePage) return null;

  return (
    <div ref={canvasWrapperRef}>
      <TransformWrapper
        ref={canvasRef}
        doubleClick={{
          disabled: true,
        }}
        wheel={{
          wheelDisabled: true,
          smoothStep: 0.01,
        }}
        pinch={{
          step: 9,
        }}
        panning={{
          wheelPanning: true,
          activationKeys: [' '],
        }}
        onTransformed={debouncedOnTransformed}
      >
        <Index activePage={activePage} canvasWrapperRef={canvasWrapperRef} />
      </TransformWrapper>
    </div>
  );
}

function Index({
  activePage,
  canvasWrapperRef,
}: {
  activePage: Page | undefined;
  canvasWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  useCanvas({ canvasWrapperRef });
  return (
    <TransformComponent
      wrapperClass="!visio-cms-w-[calc(100vw-480px)] !visio-cms-h-[calc(100vh-84px)]  !visio-cms-mx-auto"
      contentClass="!visio-cms-h-[2000px] visio-cms-w-[1200px]"
      contentStyle={{ width: RESPONSIVE_VIEWS.find((view) => view.view === activePage?.selectedView)?.size }}
    >
      <div className="visio-cms-w-full visio-cms-pt-32">
        <ResponseBar />
        <IframeView />
      </div>
    </TransformComponent>
  );
}
