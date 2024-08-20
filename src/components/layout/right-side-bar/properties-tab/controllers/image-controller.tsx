import { ImageBox } from '@/components/ui/image-box';
import { MediaFile } from '@/lib/types';

export default function ImageController({
  defaultValue,
  onChange,
}: {
  defaultValue: MediaFile;
  onChange: (value: MediaFile | null) => void;
}) {
  return <ImageBox image={defaultValue} onImageChosen={onChange} />;
}
