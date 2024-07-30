import { Button } from './button';
import { RefreshCcw, Trash, UploadCloudIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';
import SVGPattern from './svg-pattern';

const ImageBox = (props: { imageSrc?: string }) => {
  const { imageSrc } = props;

  return (
    <div
      className={'visio-cms-bg-dark-900 visio-cms-group  visio-cms-rounded-md  visio-cms-relative  visio-cms-w-full'}
    >
      <SVGPattern />

      {imageSrc && (
        <img
          src={imageSrc}
          className="visio-cms-w-full visio-cms-object-contain visio-cms-h-full visio-cms-rounded-md visio-cms-absolute visio-cms-left-0 visio-cms-top-0"
        />
      )}

      <div
        className={cn(
          'visio-cms-absolute visio-cms-w-full visio-cms-h-full visio-cms-place-items-center visio-cms-top-0 visio-cms-left-0',
          {
            'visio-cms-hidden group-hover:visio-cms-grid': imageSrc,
            'visio-cms-grid': !imageSrc,
          },
        )}
      >
        <div className="visio-cms-flex visio-cms-gap-2 visio-cms-justify-center">
          <TooltipProvider>
            {!imageSrc ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 !visio-cms-h-11 !visio-cms-w-11">
                    <UploadCloudIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload Image</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 !visio-cms-h-11 !visio-cms-w-11">
                      <Trash size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove Image</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 !visio-cms-h-11 !visio-cms-w-11">
                      <RefreshCcw size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Replace Image</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export { ImageBox };
