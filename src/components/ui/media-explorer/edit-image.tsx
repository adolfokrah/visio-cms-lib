import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import lodash from 'lodash';
import { canvasPreview } from './canvaspreview';
import { Media } from '@/lib/hooks/useMediaExplorer';
import { supabase } from '@/lib/utils';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

export default function EditImageView({ image, onImageSaved }: { image: Media; onImageSaved: () => void }) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const src = image?.mediaUrl;
  const { bucketName } = useProjectConfigurationState();
  const imgRef = useRef<HTMLImageElement>(null);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const debouncedPreview = lodash.debounce(() => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    }, 100);

    debouncedPreview();

    return () => {
      debouncedPreview.cancel();
    };
  }, [completedCrop]);

  async function saveImage() {
    setSaving(true);
    try {
      const imageElement = imgRef.current;
      const previewCanvas = previewCanvasRef.current;
      const db = supabase();

      if (!imageElement || !previewCanvas || !completedCrop) {
        throw new Error('Crop canvas or image does not exist');
      }

      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

        if (!blob) {
          throw new Error('Failed to convert canvas to Blob');
        }

        const fileName = image?.hashed_file_name || '';

        // Convert Blob to File
        const file = new File([blob], fileName, { type: 'image/png' });

        const { error } = await db.storage.from(bucketName).upload(fileName, file, {
          upsert: true, // Set to true to overwrite existing files
        });
        if (error) throw new Error(error.message);
        toast.success('Image saved successfully');
        onImageSaved();
        setOpen(false);
      }
    } catch (e: any) {
      toast.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="visio-cms-text-primary visio-cms-mt-2">
          Edit Image
        </Button>
      </DialogTrigger>
      <DialogContent className="!visio-cms-max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Edit image</DialogTitle>
          <DialogDescription className="visio-cms-max-h-[700px] visio-cms-w-full  visio-cms-relative visio-cms-grid visio-cms-items-center visio-cms-h-[calc(100vh-200px)]  visio-cms-rounded-md ">
            <div
              style={{
                width: imgRef.current?.width,
                height: imgRef.current?.height,
                margin: 'auto',
              }}
            >
              {completedCrop && (
                <canvas
                  id="myCanvas"
                  ref={previewCanvasRef}
                  className="visio-cms-border  visio-cms-invisible visio-cms-absolute visio-cms-top-0 visio-cms-left-0 visio-cms-border-black visio-cms-object-contain"
                  style={{
                    width: `${completedCrop.width}px`,
                    height: `${completedCrop.height}px`,
                  }}
                />
              )}
              <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)}>
                <img
                  crossOrigin="anonymous"
                  src={src}
                  ref={imgRef}
                  className="visio-cms-rounded-md visio-cms-m-auto visio-cms-h-[calc(100vh-200px)] visio-cms-object-contain"
                />
              </ReactCrop>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="visio-cms-border-t visio-cms-border-dark-700 visio-cms-pt-2">
          <Button onClick={saveImage} disabled={saving}>
            {saving ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Crop & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
