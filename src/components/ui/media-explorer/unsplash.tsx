import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { Input } from '../input';
import { useCallback, useEffect, useState } from 'react';
import { MediaFile, UnsplashPhotoData } from '@/lib/types';
import { Gallery } from 'react-grid-gallery';
import lodash from 'lodash';
import { FileWarning, Loader } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '../button';

interface ImageData {
  src: string;
  width: number;
  height: number;
  isSelected: boolean;
  caption: string;
  bigImage: string;
}

export default function Unsplash({ onImageChosen }: { onImageChosen: (image: MediaFile) => void }) {
  const { unsplashAccessKey } = useProjectConfigurationState();
  const [images, setImages] = useState<ImageData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      getImages();
    })();
  }, []);

  const handleSelect = (index: number) => {
    const nextImages = images.map((image, i) => ({ ...image, isSelected: index == i ? !image.isSelected : false }));
    setImages(nextImages);
  };

  const getImages = async (query?: string, endpoint = '/photos') => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.unsplash.com${endpoint}?per_page=50&query=${query}&client_id=${unsplashAccessKey}`,
      );
      const data = await response.json();
      const imagesData: UnsplashPhotoData[] = endpoint === '/photos' ? data : data.results;

      const newImages = imagesData.map((image) => ({
        bigImage: image.urls.full,
        src: image.urls.small,
        width: image.width,
        height: image.height,
        isSelected: false,
        caption: image.alt_description,
      }));
      setImages(newImages);
    } catch (e) {
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useCallback(
    lodash.debounce(async (value: string) => {
      await getImages(value, value.length < 1 ? '/photos' : '/search/photos');
    }, 300),
    [],
  );

  const selectedFile = images.find((image) => image.isSelected);
  return (
    <div className="visio-cms-text-xs visio-cms-text-white visio-cms-h-[95%] visio-cms-flex visio-cms-flex-col">
      <Input
        value={search}
        placeholder="Search Image"
        className="visio-cms-mb-2"
        onChange={(e) => {
          setSearch(e.target.value);
          debounceSearch(e.target.value);
        }}
      />
      <div className="visio-cms-overflow-auto scrollbar-custom visio-cms-flex-1">
        {loading ? (
          <div className="visio-cms-grid visio-cms-w-full visio-cms-h-full visio-cms-place-items-center">
            <Loader size={16} className="visio-cms-animate-spin" />
          </div>
        ) : (
          <>
            {error ? (
              <div className="visio-cms-col-span-7  visio-cms-h-full visio-cms-grid visio-cms-place-items-center">
                <div className="visio-cms-flex visio-cms-items-center visio-cms-flex-col visio-cms-gap-2">
                  <FileWarning size={35} />
                  {error}
                </div>
              </div>
            ) : (
              <Gallery images={images} onSelect={handleSelect} />
            )}
          </>
        )}
      </div>

      {selectedFile && (
        <DialogFooter className="visio-cms-border-t visio-cms-border-dark-700 visio-cms-pt-4">
          <Button
            onClick={() => {
              onImageChosen({
                mediaHash: selectedFile.bigImage || '',
                altText: selectedFile.caption,
                width: selectedFile.width || 0,
                height: selectedFile.height || 0,
              });
            }}
          >
            Insert Media
          </Button>
        </DialogFooter>
      )}
    </div>
  );
}
