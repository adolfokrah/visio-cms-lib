import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileIcon, Redo, Undo, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const pages = [
  {
    name: 'Home page',
    active: false,
  },
  {
    name: 'About page',
    active: true,
  },
  {
    name: 'Services page',
    active: false,
  },
];
export default function PageTabs() {
  return (
    <div className="visio-cms-bg-dark-800 visio-cms-flex visio-cms-justify-between visio-cms-items-center">
      <div className="visio-cms-flex">
        {pages.map(({ name, active }) => (
          <div
            key={name}
            className={cn(
              'visio-cms-p-3 visio-cms-group visio-cms-text-slate-400 visio-cms-flex visio-cms-gap-2 visio-cms-cursor-pointer hover:visio-cms-bg-dark-700 visio-cms-items-center',
              {
                '!visio-cms-bg-dark-900 !visio-cms-text-white': active,
              },
            )}
          >
            <FileIcon
              size={12}
              color={active ? 'hsl(var(--visio-cms-primary))' : 'rgb(148 163 184 / var(--tw-text-opacity))'}
            />
            {name}
            <X size={12} className="visio-cms-invisible group-hover:visio-cms-visible" />
          </div>
        ))}
      </div>

      <div className="visio-cms-flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="visio-cms-rounded-none !visio-cms-bg-dark-700 hover:!visio-cms-bg-dark-900">
                <Undo size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="visio-cms-rounded-none !visio-cms-bg-dark-700 hover:!visio-cms-bg-dark-900">
                <Redo size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
