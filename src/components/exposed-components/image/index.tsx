import MediaExplorer from '@/components/ui/media-explorer';
import useImage from '@/lib/hooks/useImage';
import { MediaFile } from '@/lib/types';
import { cn, sendMessageToParent } from '@/lib/utils';

export default function Image({
  defaultValue,
  propName,
  className,
}: {
  defaultValue: MediaFile;
  propName: string;
  className?: string;
}) {
  const { openMediaExplorer, setOpenMediaExplorer, imagePublicUrl, globalBlock } = useImage({ defaultValue });

  return (
    <div>
      <img
        src={`${imagePublicUrl}?t=${new Date().getTime()}`}
        alt={defaultValue?.altText || ''}
        className={cn(className, {
          'visio-cms-cursor-pointer': !globalBlock,
        })}
        onClick={() => setOpenMediaExplorer(true)}
      />
      {!globalBlock && (
        <MediaExplorer
          open={openMediaExplorer}
          onCloseModal={() => setOpenMediaExplorer(false)}
          onImageChosen={(media) => {
            sendMessageToParent({
              type: 'updateBlockInput',
              content: JSON.stringify({ path: propName, value: media }),
            });
            setOpenMediaExplorer(false);
          }}
          chosenImage={defaultValue?.mediaHash ? defaultValue : undefined}
        />
      )}
    </div>
  );
}
