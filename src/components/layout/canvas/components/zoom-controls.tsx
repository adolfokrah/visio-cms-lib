import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getOS, mapScaleToPercentage } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { usePagesState } from '@/lib/states/usePagesState';
import { useMemo } from 'react';
import { useControls } from 'react-zoom-pan-pinch';
export default function ZoomControls() {
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const os = useMemo(() => getOS(), []);
  const symbol = os == 'mac' ? '⌘' : 'Ctrl';
  const controls = useControls();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="!visio-cms-bg-dark-700 viso-cms-w-[50px]">
          {activePage?.canvasSettings ? mapScaleToPercentage(activePage?.canvasSettings?.scale || 1) : '10'}
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
  );
}
