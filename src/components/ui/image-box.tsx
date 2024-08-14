import { Button } from './button';
import { RefreshCcw, Trash, UploadCloudIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn, supabase } from '@/lib/utils';
import MediaExplorer from './media-explorer';
import { useMemo, useState } from 'react';
import { MediaFile } from '@/lib/types';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';

const ImageBox = (props: { image?: MediaFile; onImageChosen?: (image: MediaFile | null) => void }) => {
  const { image } = props;
  const { bucketName } = useProjectConfigurationState();
  const [open, setOpen] = useState(false);
  const [mediaHash, setMediaHash] = useState<string | undefined>(image?.mediaHash);
  const db = useMemo(() => supabase(), []);
  const imagePublicUrl = db.storage.from(bucketName).getPublicUrl(mediaHash || '').data.publicUrl;

  return (
    <>
      <div
        className={
          'visio-cms-bg-dark-900 visio-cms-group  visio-cms-rounded-md  visio-cms-relative  visio-cms-w-full visio-cms-h-48'
        }
      >
        {mediaHash && image?.mediaHash && (
          <img
            src={`${imagePublicUrl}?t=${new Date().getTime()}`}
            className="visio-cms-w-full visio-cms-object-contain visio-cms-h-full visio-cms-rounded-md visio-cms-absolute visio-cms-left-0 visio-cms-top-0"
          />
        )}

        <div
          className={cn(
            'visio-cms-absolute visio-cms-w-full visio-cms-h-full visio-cms-place-items-center visio-cms-top-0 visio-cms-left-0',
            {
              'visio-cms-hidden group-hover:visio-cms-grid': mediaHash,
              'visio-cms-grid': !mediaHash,
            },
          )}
        >
          <div className="visio-cms-flex visio-cms-gap-2 visio-cms-justify-center">
            {!mediaHash || !image?.mediaHash ? (
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
                        setMediaHash(undefined);
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
          </div>
        </div>
      </div>

      <MediaExplorer
        open={open}
        onCloseModal={() => setOpen(false)}
        chosenImage={image ? { ...image, mediaHash } : undefined}
        onImageChosen={(mediaFile) => {
          props.onImageChosen?.(mediaFile);
          setMediaHash(mediaFile?.mediaHash);
          setOpen(false);
        }}
      />
    </>
  );
};

export { ImageBox };
