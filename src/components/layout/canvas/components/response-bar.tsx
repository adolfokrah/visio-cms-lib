import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { usePagesState } from '@/lib/states/usePagesState';
import { RESPONSIVE_VIEWS } from '@/lib/constants';

export default function ResponseBar() {
  const { pages, setPageResponsiveView } = usePagesState();
  const activePage = pages.find((page) => page.active);
  if (!activePage) return null;
  return (
    <div className="visio-cms-w-full visio-cms-rounded-md visio-cms-bg-dark-800 visio-cms-p-1 visio-cms-flex visio-cms-justify-between">
      <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center">
        <div className="visio-cms-bg-dark-700 visio-cms-p-1 visio-cms-rounded-sm">
          {RESPONSIVE_VIEWS.find((view) => view.view === activePage.selectedView)?.icon}
        </div>
        {activePage.selectedView}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="visio-cms-bg-dark-700 visio-cms-flex visio-cms-items-center visio-cms-gap-2 visio-cms-p-1 visio-cms-rounded-sm">
            {RESPONSIVE_VIEWS.find((view) => view.view === activePage.selectedView)?.size}
            <ChevronDown size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {RESPONSIVE_VIEWS.map(({ view, size, icon }) => (
            <DropdownMenuItem
              key={view}
              onClick={() => setPageResponsiveView(view)}
              className={cn(
                'visio-cms-p-3 visio-cms-place-items-center visio-cms-justify-between visio-cms-group visio-cms-text-slate-400 visio-cms-flex visio-cms-gap-2 visio-cms-cursor-pointer hover:visio-cms-bg-dark-900 visio-cms-items-center',
                {
                  'visio-cms-bg-dark-700': view === activePage.selectedView,
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
