import MediaExplorer from '@/components/ui/media-explorer';
import useImage from '@/lib/hooks/useImage';
import { MediaFile } from '@/lib/types';
import { cn, sendMessageToParent } from '@/lib/utils';

export default function Image({
  defaultValue,
  propName,
  className,
  pageBlockId,
  allowTransformation,
}: {
  defaultValue: MediaFile;
  propName: string;
  className?: string;
  pageBlockId: string;
  allowTransformation?: boolean;
}) {
  const { openMediaExplorer, setOpenMediaExplorer, imagePublicUrl, isBlockGlobal } = useImage({
    defaultValue,
    pageBlockId,
    allowTransformation,
  });

  return (
    <div>
      <img
        src={`${imagePublicUrl}?t=${new Date().getTime()}`}
        alt={defaultValue?.altText || ''}
        className={cn(className, {
          'visio-cms-cursor-pointer': !isBlockGlobal,
        })}
        onClick={() => setOpenMediaExplorer(true)}
      />
      {!isBlockGlobal && (
        <MediaExplorer
          open={openMediaExplorer}
          onCloseModal={() => setOpenMediaExplorer(false)}
          onImageChosen={(media) => {
            sendMessageToParent({
              type: 'updateBlockInput',
              content: JSON.stringify({ propName, value: media, pageBlockId }),
            });
            setOpenMediaExplorer(false);
          }}
          chosenImage={defaultValue?.mediaHash ? defaultValue : undefined}
        />
      )}
    </div>
  );
}
