import { Redo, Undo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import useUndoAndRedo from '@/lib/hooks/useUndoAndRedo';

export default function UndoRedoControls() {
  const { undo, redo, history, activeGlobalPinnedBlock } = useUndoAndRedo();

  const undoCheck = () => {
    if (activeGlobalPinnedBlock) {
      const globalBlockHistory = activeGlobalPinnedBlock.history;
      return !globalBlockHistory || globalBlockHistory.inputs.length < 1 || (globalBlockHistory?.currentIndex || 0) < 1;
    } else {
      return !history || history?.blocks.length < 1 || history?.currentIndex < 1;
    }
  };

  const redoCheck = () => {
    if (activeGlobalPinnedBlock) {
      const globalBlockHistory = activeGlobalPinnedBlock.history;
      return (
        !globalBlockHistory ||
        globalBlockHistory?.inputs.length < 2 ||
        globalBlockHistory?.currentIndex === globalBlockHistory.inputs.length - 1
      );
    } else {
      return !history || history?.blocks.length < 2 ||   history?.currentIndex === history.blocks.length - 1;
    }
  };
  return (
    <div className="visio-cms-flex">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={undoCheck()}
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
            disabled={redoCheck()}
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
    </div>
  );
}
