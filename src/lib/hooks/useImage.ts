import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { getProjectMode, getSelectedBlock, isValidURL, supabase } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { MediaFile } from '../types';
import { usePageContentState } from '../states/usePageContentState';
import { PageBlock } from '../exposed-types';
export default function useImage({
  defaultValue,
  pageBlockId,
  fallbackImage,
}: {
  defaultValue: MediaFile;
  pageBlockId: string;
  fallbackImage: string;
}) {
  const db = supabase();
  const { bucketName, allowImageTransformation } = useProjectConfigurationState();
  const [openMediaExplorer, setOpenMediaExplorer] = useState(false);
  const [imagePublicUrl, setImagePublicUrl] = useState<string>(fallbackImage);
  const { pages, globalBlocks, projectId } = usePageContentState();
  const activePage = pages.find((page) => page.active);

  const isBlockGlobal = useMemo(() => {
    const projectMode = getProjectMode();
    if (projectMode === 'LIVE') return false;
    const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];

    const selectedBlock = getSelectedBlock(pageBlocks, pageBlockId) as PageBlock;
    return globalBlocks.some((block) => block.id === selectedBlock?.globalBlockId);
  }, [activePage, globalBlocks, pageBlockId]);

  useEffect(() => {
    const projectMode = getProjectMode();

    if (defaultValue?.mediaHash?.includes('http') || defaultValue?.mediaHash?.includes('https')) {
      setImagePublicUrl(defaultValue?.mediaHash);
      return;
    }

    const getImagePublicUrl = async (mediaHash: string, width: number, height: number) => {
      if (projectMode === 'LIVE') {
        setImagePublicUrl(
          projectId
            ? `https://${projectId}.supabase.co/storage/v1/object/public/media/${defaultValue?.mediaHash}`
            : fallbackImage,
        );
        return;
      }

      const data: { [keys: string]: any } = {};
      if (allowImageTransformation) {
        data['transform'] = {
          width,
          height,
        };
      }
      const publicUrl = db.storage.from(bucketName).getPublicUrl(mediaHash, data).data.publicUrl;

      setImagePublicUrl(publicUrl);
    };
    if (defaultValue?.mediaHash && !isValidURL(defaultValue?.mediaHash)) {
      getImagePublicUrl(defaultValue?.mediaHash, defaultValue.width, defaultValue.height);
    } else {
      setImagePublicUrl(defaultValue?.mediaHash || fallbackImage);
    }
  }, [
    bucketName,
    defaultValue?.mediaHash,
    defaultValue?.height,
    defaultValue?.width,
    db.storage,
    allowImageTransformation,
    projectId,
    fallbackImage,
  ]);

  return { openMediaExplorer, setOpenMediaExplorer, imagePublicUrl, isBlockGlobal };
}
