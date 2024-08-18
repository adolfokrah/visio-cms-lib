import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { supabase } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { MediaFile } from '../types';
import { usePageContentState } from '../states/usePageContentState';
export default function useImage({ defaultValue, pageBlockId }: { defaultValue: MediaFile; pageBlockId: string }) {
  const db = supabase();
  const { bucketName } = useProjectConfigurationState();
  const [openMediaExplorer, setOpenMediaExplorer] = useState(false);
  const [imagePublicUrl, setImagePublicUrl] = useState<string>(
    defaultValue?.mediaHash || 'https://placehold.co/600x400',
  );
  const { pages, globalBlocks } = usePageContentState();
  const activePage = pages.find((page) => page.active);

  const isBlockGlobal = useMemo(() => {
    const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale] || [];
    const foundBlock = pageBlocks.find((block) => block.id === pageBlockId);

    return globalBlocks.some((block) => block.id === foundBlock?.globalBlockId);
  }, [activePage, globalBlocks, pageBlockId]);

  useEffect(() => {
    console.log(defaultValue?.mediaHash);
    if (defaultValue?.mediaHash?.includes('http') || defaultValue?.mediaHash?.includes('https')) {
      return;
    }

    const getImagePublicUrl = async (mediaHash: string, width: number, height: number) => {
      const publicUrl = db.storage.from(bucketName).getPublicUrl(mediaHash, {
        transform: {
          width,
          height,
        },
      }).data.publicUrl;
      const res = await fetch(publicUrl);
      const data = await res.json();

      if (data?.error) {
        const newPublicUrl = db.storage.from(bucketName).getPublicUrl(mediaHash).data.publicUrl;

        setImagePublicUrl(newPublicUrl);
        return;
      }
      setImagePublicUrl(publicUrl);
    };
    if (defaultValue?.mediaHash) {
      getImagePublicUrl(defaultValue?.mediaHash, defaultValue.width, defaultValue.height);
    }
  }, [bucketName, defaultValue?.mediaHash, defaultValue?.height, defaultValue?.width, db.storage]);

  return { openMediaExplorer, setOpenMediaExplorer, imagePublicUrl, isBlockGlobal };
}
