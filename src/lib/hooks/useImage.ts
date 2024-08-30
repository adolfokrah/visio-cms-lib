import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { getProjectMode, isValidURL, supabase } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { MediaFile } from '../types';
import { usePageContentState } from '../states/usePageContentState';
export default function useImage({ defaultValue, pageBlockId }: { defaultValue: MediaFile; pageBlockId: string }) {
  const db = supabase();
  const { bucketName, allowImageTransformation } = useProjectConfigurationState();
  const [openMediaExplorer, setOpenMediaExplorer] = useState(false);
  const [imagePublicUrl, setImagePublicUrl] = useState<string>('https://placehold.co/600x400');
  const { pages, globalBlocks, projectId } = usePageContentState();
  const activePage = pages.find((page) => page.active);

  const isBlockGlobal = useMemo(() => {
    const projectMode = getProjectMode();
    if (projectMode === 'LIVE') return false;
    const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
    const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);

    return globalBlocks.some((block) => block.id === foundBlock?.globalBlockId);
  }, [activePage, globalBlocks, pageBlockId]);

  useEffect(() => {
    const projectMode = getProjectMode();

    if (defaultValue?.mediaHash?.includes('http') || defaultValue?.mediaHash?.includes('https')) {
      return;
    }

    const getImagePublicUrl = async (mediaHash: string, width: number, height: number) => {
      if (projectMode === 'LIVE') {
        setImagePublicUrl(
          projectId
            ? `https://${projectId}.supabase.co/storage/v1/object/public/media/${defaultValue?.mediaHash}`
            : 'https://placehold.co/600x400',
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
      setImagePublicUrl(defaultValue?.mediaHash || 'https://placehold.co/600x400');
    }
  }, [
    bucketName,
    defaultValue?.mediaHash,
    defaultValue?.height,
    defaultValue?.width,
    db.storage,
    allowImageTransformation,
    projectId,
  ]);

  return { openMediaExplorer, setOpenMediaExplorer, imagePublicUrl, isBlockGlobal };
}
