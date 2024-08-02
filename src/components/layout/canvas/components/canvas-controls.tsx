import { Button } from '@/components/ui/button';
import { useCanvasState } from '@/lib/states/useCanvasState';
import { cn } from '@/lib/utils';
import { GrabIcon, MousePointer2 } from 'lucide-react';
import ZoomControls from './zoom-controls';
import LanguageControls from './language-controls';

export default function CanvasControls() {
  const { panning, zooming, setPanning, setZooming, setZoomingOut } = useCanvasState();
  return (
    <div className=" visio-cms-fixed visio-cms-bottom-3 visio-cms-p-2 visio-cms-flex visio-cms-z-10 visio-cms-gap-3 visio-cms-bg-dark-800 visio-cms-border visio-cms-border-dark-700 visio-cms-rounded-xl visio-cms-w-[225px] visio-cms-left-[calc(50%-100px)]">
      <Button
        className={cn('visio-cms-bg-transparent hover:!visio-cms-bg-dark-700', {
          '!visio-cms-bg-dark-700': !panning && !zooming,
        })}
        onClick={() => {
          setPanning(false);
          setZooming(false);
          setZoomingOut(false);
        }}
      >
        <MousePointer2 size={16} />
      </Button>
      <Button
        className={cn('visio-cms-bg-transparent hover:!visio-cms-bg-dark-700', {
          '!visio-cms-bg-dark-700': panning,
        })}
        onClick={() => setPanning(true)}
      >
        <GrabIcon size={16} />
      </Button>
      <LanguageControls />
      <ZoomControls />
    </div>
  );
}
