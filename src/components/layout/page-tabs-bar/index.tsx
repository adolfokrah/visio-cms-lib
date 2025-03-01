import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BoxSelect, Circle,  FileIcon, MoreVerticalIcon, X } from 'lucide-react';
import usePageTabs from '@/lib/hooks/usePageTabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCallback, useState } from 'react';
import ResponsiveBar from './components/responsive-bar';
import LanguageControls from './components/language-controls';
import UndoRedoControls from './components/undo-redo-controls';
import { usePagesState } from '@/lib/states/usePagesState';
import {  isEqual } from 'lodash';
import { Tab } from '@/lib/states/useTabsState';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

export default function PageTabs() {
  const { hiddenTabs, containerRef, tabs, handleTabClick, tabRefs, handleRemovePage } = usePageTabs();
  const {pages} = usePagesState();
  const pinnedPages = tabs;
  const [closingTab, setClosingTab] = useState<null | Tab>(null);

  const tabClicked = useCallback(
    (id: string) => {
      handleTabClick(id);
    },
    [handleTabClick],
  );

  return (
    <div className="visio-cms-bg-dark-800 visio-cms-h-[40px] visio-cms-flex visio-cms-justify-between visio-cms-items-center">
      <div
        className="visio-cms-flex  visio-cms-overflow-x-hidden visio-cms-whitespace-nowrap visio-cms-flex-1"
        ref={containerRef}
      >
        {pinnedPages.map(({ name, id, type, active }) => {
          const {initialState, ...page} = pages.find((page)=> page?.id == id) || {};
          const isChanged =  !isEqual({...page, active: false}, {...initialState, active: false});
          const isAutoSave = 'autoSave' in page && page.autoSave;
          return (
            <div
              key={id}
              id={id}
              title={name}
              onClick={() => tabClicked(id)}
              ref={(el) => el && tabRefs.current.set(name, el)} // Store reference
              className={cn(
                'visio-cms-p-3 visio-cms-border-r visio-cms-border-dark-900 visio-cms-group visio-cms-text-slate-400 visio-cms-flex visio-cms-gap-2 visio-cms-cursor-pointer hover:visio-cms-bg-dark-700 visio-cms-items-center',
                {
                  '!visio-cms-bg-dark-900 !visio-cms-text-white': active,
                },
              )}
            >
  
            {isChanged && !isAutoSave && <Circle fill='white' size={8} />}
  
  
              {type === 'globalBlock' ? (
                <BoxSelect
                  size={12}
                  color={active ? 'hsl(var(--visio-cms-primary))' : 'rgb(148 163 184 / var(--tw-text-opacity))'}
                />
              ) : (
                <FileIcon
                  size={12}
                  color={active ? 'hsl(var(--visio-cms-primary))' : 'rgb(148 163 184 / var(--tw-text-opacity))'}
                />
              )}
  
             
  
              <div className="visio-cms-w-24 visio-cms-truncate visio-cms-overflow-hidden visio-cms-whitespace-nowrap">
                {name}
              </div>
  
             
              <X
                size={12}
                className="visio-cms-invisible group-hover:visio-cms-visible"
                onClick={(e) => {
                  if (isChanged && !isAutoSave) {
                    setClosingTab({name, id, type, active});
                    return;
                  }
                  e.stopPropagation();
                  handleRemovePage(id);
                }}
              />
            </div>
          )
        })}
      </div>

      {hiddenTabs.length ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="!visio-cms-bg-transparent hover:!visio-cms-bg-dark-900 ">
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {pinnedPages
              .filter((page) => hiddenTabs.includes(page.id))
              .map(({ name, id }) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => handleTabClick(id)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePage(id);
                    }}
                  />
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      {tabs.find((tab) => tab.active)?.type === 'page' && <LanguageControls />}
      <ResponsiveBar />
      <UndoRedoControls />

      <AlertDialog open={closingTab != null} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="visio-cms-leading-7">
            This page has unsaved changes. Are you sure you want to close it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>{
             setClosingTab(null);

          }} className="visio-cms-text-white">No</AlertDialogCancel>
          <AlertDialogAction className='visio-cms-text-white visio-cms-bg-primary' onClick={()=>{
             setClosingTab(null);
             if(closingTab){
               handleRemovePage(closingTab.id, true);
             }
          }}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    

    </div>
  );
}
