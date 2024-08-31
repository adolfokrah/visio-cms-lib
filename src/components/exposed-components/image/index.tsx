import MediaExplorer from '@/components/ui/media-explorer';
import useImage from '@/lib/hooks/useImage';
import { MediaFile } from '@/lib/types';
import { cn, getProjectMode, sendMessageToParent } from '@/lib/utils';

export default function Image({
  defaultValue,
  propName,
  pageBlockId,
  renderImage,
  wrapperClassName = '',
}: {
  defaultValue: MediaFile;
  propName: string;
  wrapperClassName?: string;
  pageBlockId: string;
  allowTransformation?: boolean;
  renderImage: ({
    imagePublicUrl,
    altText,
    width,
    height,
  }: {
    imagePublicUrl: string;
    width: number;
    height: number;
    altText: string;
  }) => JSX.Element;
}) {
  const { openMediaExplorer, setOpenMediaExplorer, imagePublicUrl, isBlockGlobal } = useImage({
    defaultValue,
    pageBlockId,
  });

  const projectMode = getProjectMode();
  if (projectMode === 'BUILDER')
    return (
      <>
        <div
          className={cn('visio-cms-inline-block visio-cms-cursor-pointer', wrapperClassName)}
          onDoubleClick={() => setOpenMediaExplorer(true)}
        >
          {renderImage({
            imagePublicUrl: `${imagePublicUrl}`,
            altText: defaultValue?.altText || '',
            width: defaultValue?.width || 0,
            height: defaultValue?.height || 0,
          })}
        </div>
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
      </>
    );
  else
    return (
      <div className={cn('visio-cms-inline-block', wrapperClassName)}>
        {renderImage({
          imagePublicUrl: `${imagePublicUrl}`,
          altText: defaultValue?.altText || '',
          width: defaultValue?.width || 0,
          height: defaultValue?.height || 0,
        })}
      </div>
    );
}
