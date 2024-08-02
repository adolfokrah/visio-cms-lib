import { Button } from '@/components/ui/button';
import { useCanvasState } from '@/lib/states/useCanvasState';
import { usePagesState } from '@/lib/states/usePagesState';
import { cn, getOS, mapScaleToPercentage } from '@/lib/utils';
import { ChevronDown, GrabIcon, MousePointer2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useMemo } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

export default function CanvasControls() {
  const { panning, zooming, setPanning, setZooming, setZoomingOut } = useCanvasState();
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const os = useMemo(() => getOS(), []);
  const symbol = os == 'mac' ? '⌘' : 'Ctrl';
  const controls = useControls();
  return (
    <div className=" visio-cms-fixed visio-cms-bottom-3 visio-cms-p-2 visio-cms-flex visio-cms-z-10 visio-cms-gap-3 visio-cms-bg-dark-800 visio-cms-border visio-cms-border-dark-700 visio-cms-rounded-xl visio-cms-w-[210px] visio-cms-left-[calc(50%-100px)]">
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
      <Button className="!visio-cms-bg-transparent hover:!visio-cms-bg-dark-700">EN</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="!visio-cms-bg-dark-700">
            {activePage?.canvasSettings && mapScaleToPercentage(activePage?.canvasSettings?.scale)}
            {'%'}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="visio-cms-w-[160px]">
          <DropdownMenuItem>
            Zoom
            <DropdownMenuShortcut>Z</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              controls.zoomIn();
            }}
          >
            Zoom in
            <DropdownMenuShortcut>{symbol}+</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              controls.zoomOut();
            }}
          >
            Zoom out
            <DropdownMenuShortcut>{symbol}-</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              controls.setTransform(
                activePage?.canvasSettings?.positionX || 0,
                activePage?.canvasSettings?.positionY || 0,
                8,
              );
            }}
          >
            Zoom to 100%
            <DropdownMenuShortcut>{symbol}0</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              controls.setTransform(
                activePage?.canvasSettings?.positionX || 0,
                activePage?.canvasSettings?.positionY || 0,
                4.1,
              );
            }}
          >
            Zoom to 50%
            <DropdownMenuShortcut>{symbol}1</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              controls.setTransform(
                activePage?.canvasSettings?.positionX || 0,
                activePage?.canvasSettings?.positionY || 0,
                1,
              );
            }}
          >
            Zoom to fit
            <DropdownMenuShortcut>{symbol}3</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
