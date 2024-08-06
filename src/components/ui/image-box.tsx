import { Button } from './button';
import { RefreshCcw, Trash, UploadCloudIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';
import MediaExplorer from './media-explorer';
import { useState } from 'react';
import { MediaFile } from '@/lib/types';

const ImageBox = (props: { image?: MediaFile; onImageChosen?: (image: MediaFile | null) => void }) => {
  const { image } = props;
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(image?.mediaUrl);

  return (
    <>
      <div
        className={
          'visio-cms-bg-dark-900 visio-cms-group  visio-cms-rounded-md  visio-cms-relative  visio-cms-w-full visio-cms-h-48'
        }
      >
        {imageUrl && (
          <img
            src={imageUrl}
            className="visio-cms-w-full visio-cms-object-contain visio-cms-h-full visio-cms-rounded-md visio-cms-absolute visio-cms-left-0 visio-cms-top-0"
          />
        )}

        <div
          className={cn(
            'visio-cms-absolute visio-cms-w-full visio-cms-h-full visio-cms-place-items-center visio-cms-top-0 visio-cms-left-0',
            {
              'visio-cms-hidden group-hover:visio-cms-grid': imageUrl,
              'visio-cms-grid': !imageUrl,
            },
          )}
        >
          <div className="visio-cms-flex visio-cms-gap-2 visio-cms-justify-center">
            <TooltipProvider>
              {!imageUrl ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="!visio-cms-rounded-full !visio-cms-bg-dark-800 hover:!visio-cms-bg-dark-800 !visio-cms-h-11 !visio-cms-w-11"
                      onClick={() => setOpen(true)}
                    >
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
                      <Button
                        className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 !visio-cms-h-11 !visio-cms-w-11"
                        onClick={() => {
                          setImageUrl(undefined);
                          props.onImageChosen?.(null);
                        }}
                      >
                        <Trash size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove Image</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 !visio-cms-h-11 !visio-cms-w-11"
                        onClick={() => setOpen(true)}
                      >
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

      <MediaExplorer
        onCloseModal={() => setOpen(false)}
        open={open}
        onImageChosen={(mediaFile) => {
          props.onImageChosen?.(mediaFile);
          setImageUrl(mediaFile?.mediaUrl);
          setOpen(false);
        }}
      />
    </>
  );
};

export { ImageBox };
