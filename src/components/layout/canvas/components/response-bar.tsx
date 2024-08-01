import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResponseBarState } from '@/lib/states/useResponsiveBarState';
import { cn } from '@/lib/utils';

export default function ResponseBar() {
  const { views, setView, selectedView } = useResponseBarState();
  return (
    <div className="visio-cms-w-full visio-cms-rounded-md visio-cms-bg-dark-800 visio-cms-p-1 visio-cms-flex visio-cms-justify-between">
      <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center">
        <div className="visio-cms-bg-dark-700 visio-cms-p-1 visio-cms-rounded-sm">
          {views.find((view) => view.view === selectedView)?.icon}
        </div>
        {selectedView}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="visio-cms-bg-dark-700 visio-cms-flex visio-cms-items-center visio-cms-gap-2 visio-cms-p-1 visio-cms-rounded-sm">
            {views.find((view) => view.view === selectedView)?.size}
            <ChevronDown size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {views.map(({ view, size, icon }) => (
            <DropdownMenuItem
              key={view}
              onClick={() => setView(view)}
              className={cn(
                'visio-cms-p-3 visio-cms-place-items-center visio-cms-justify-between visio-cms-group visio-cms-text-slate-400 visio-cms-flex visio-cms-gap-2 visio-cms-cursor-pointer hover:visio-cms-bg-dark-900 visio-cms-items-center',
                {
                  'visio-cms-bg-dark-700': view === selectedView,
                },
              )}
            >
              <div className="visio-cms-flex visio-cms-gap-2">
                {icon}
                {view}
              </div>
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
