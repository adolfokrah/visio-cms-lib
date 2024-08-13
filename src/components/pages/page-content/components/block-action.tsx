import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Copy, LucideTrash2 } from 'lucide-react';

export default function BlockAction({ blockName }: { blockName: string }) {
  return (
    <div className="visio-cms-w-max visio-cms-px-2 visio-cms-py-1 visio-cms-text-white  visio-cms-flex visio-cms-gap-1 visio-cms-absolute visio-cms-right-[10px] visio-cms-top-[10px] visio-cms-bg-dark-900 visio-cms-rounded-md">
      <span>{blockName}</span>
      <Button variant={'ghost'} className="hover:!visio-cms-bg-dark-700">
        <LucideTrash2 size={16} />
      </Button>
      <Button variant={'ghost'} className="hover:!visio-cms-bg-dark-700">
        <ChevronUp size={16} />
      </Button>
      <Button variant={'ghost'} className="hover:!visio-cms-bg-dark-700">
        <ChevronDown size={16} />
      </Button>
      <Button variant={'ghost'} className="hover:!visio-cms-bg-dark-700">
        <Copy size={16} />
      </Button>
    </div>
  );
}
