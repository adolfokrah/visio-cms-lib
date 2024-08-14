import { Input } from '@/components/ui/input';
import { ComponentProps } from 'react';
import { Tooltip, TooltipContent,  TooltipTrigger } from '@/components/ui/tooltip';

export default function SlugInput(props: ComponentProps<typeof Input> & { parentSlug: string }) {
  return (
    <div className="visio-cms-flex">
      
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              dir="rtl"
              className="!visio-cms-border-dark-700 visio-cms-border  visio-cms-truncate visio-cms-pt-[8px] visio-cms-px-2 visio-cms-rounded-l visio-cms-text-xs  visio-cms-whitespace-nowrap visio-cms-overflow-hidden visio-cms-text-right !visio-cms-bg-dark-800 visio-cms-min-w-[100px]  visio-cms-max-w-[150px] visio-cms-rounded-r-none"
            >
              {props.parentSlug}
            </div>
          </TooltipTrigger>
          <TooltipContent align="start">
            <p>
              <b>yourwebiste.com</b>
              {props.parentSlug}
            </p>
          </TooltipContent>
        </Tooltip>
     

      <Input
        className="!visio-cms-border-dark-700 visio-cms-rounded-l-none visio-cms-border-l-0"
        type="text"
        placeholder="Enter slug"
        {...props}
      />
    </div>
  );
}
