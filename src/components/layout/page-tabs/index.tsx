import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileIcon, MoreVerticalIcon, Redo, Undo, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import usePageTabs from '@/lib/hooks/usePageTabls';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PageTabs() {
  const { hiddenTabs, containerRef, pages, handleTabClick, tabRefs, handleRemovePage } = usePageTabs();

  return (
    <div className="visio-cms-bg-dark-800 visio-cms-h-[40px] visio-cms-flex visio-cms-justify-between visio-cms-items-center">
      <div
        className="visio-cms-flex  visio-cms-overflow-x-hidden visio-cms-whitespace-nowrap visio-cms-flex-1"
        ref={containerRef}
      >
        {pages.map(({ name, active }) => (
          <div
            key={name}
            id={name}
            title={name}
            onClick={() => handleTabClick(name)}
            ref={(el) => el && tabRefs.current.set(name, el)} // Store reference
            className={cn(
              'visio-cms-p-3 visio-cms-border-r visio-cms-border-dark-900 visio-cms-group visio-cms-text-slate-400 visio-cms-flex visio-cms-gap-2 visio-cms-cursor-pointer hover:visio-cms-bg-dark-700 visio-cms-items-center',
              {
                '!visio-cms-bg-dark-900 !visio-cms-text-white': active,
              },
            )}
          >
            <FileIcon
              size={12}
              color={active ? 'hsl(var(--visio-cms-primary))' : 'rgb(148 163 184 / var(--tw-text-opacity))'}
            />
            <div className="visio-cms-w-24 visio-cms-truncate visio-cms-overflow-hidden visio-cms-whitespace-nowrap">
              {name}
            </div>
            <X
              size={12}
              className="visio-cms-invisible group-hover:visio-cms-visible"
              onClick={() => handleRemovePage(name)}
            />
          </div>
        ))}
      </div>
      {hiddenTabs.length ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="!visio-cms-bg-transparent hover:!visio-cms-bg-dark-900 ">
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {pages
              .filter((page) => hiddenTabs.includes(page.name))
              .map(({ name }) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => handleTabClick(name)}
                  className={cn(
                    'visio-cms-p-3 visio-cms-place-items-center visio-cms-justify-between visio-cms-group visio-cms-text-slate-400 visio-cms-flex visio-cms-gap-2 visio-cms-cursor-pointer hover:visio-cms-bg-dark-900 visio-cms-items-center',
                  )}
                >
                  <div className="visio-cms-flex visio-cms-gap-2">
                    <FileIcon size={12} color="rgb(148 163 184 / var(--tw-text-opacity))" />
                    {name}
                  </div>
                  <X
                    size={12}
                    className="visio-cms-invisible group-hover:visio-cms-visible"
                    onClick={() => handleRemovePage(name)}
                  />
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

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
