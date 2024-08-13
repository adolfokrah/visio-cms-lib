import { Redo, Undo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import useUndoAndRedo from '@/lib/hooks/useUndoAndRedo';

export default function UndoRedoControls() {
  const { undo, redo, history } = useUndoAndRedo();

  return (
    <div className="visio-cms-flex">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!history || history?.blocks.length < 1 || history?.currentIndex < 0}
              onClick={undo}
              className="visio-cms-rounded-none !visio-cms-bg-dark-700 hover:!visio-cms-bg-dark-900"
            >
              <Undo size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!history || history?.blocks.length < 1 || history?.currentIndex === history.blocks.length - 1}
              onClick={redo}
              className="visio-cms-rounded-none !visio-cms-bg-dark-700 hover:!visio-cms-bg-dark-900"
            >
              <Redo size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
