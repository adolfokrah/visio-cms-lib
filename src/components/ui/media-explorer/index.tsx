import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useMediaExplorer, { Media } from '@/lib/hooks/useMediaExplorer';
import { FileWarning, Loader, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Label } from '../label';
import { Button } from '../button';
import { Separator } from '../separator';
import { Input } from '../input';
import { MediaFile } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import EditImageView from './edit-image';

export default function MediaExplorer({
  open,
  onImageChosen,
  onCloseModal,
  chosenImage,
}: {
  open: boolean;
  onImageChosen: (chosenMediaFile: MediaFile) => void;
  onCloseModal: () => void;
  chosenImage?: MediaFile;
}) {
  const {
    uploadFiles,
    files,
    handleSelectMediaType,
    selectedFileAltText,
    setSelectedFileAltText,
    loading,
    error,
    fetchFiles,
    deleteFile,
    deleting,
    onImageSaved,
    setFiles,
  } = useMediaExplorer({ chosenImage, open });
  const selectedFile = files.find((file) => file.selected);
  return (
    <Dialog open={open}>
      <DialogContent
        className="!visio-cms-max-w-4xl visio-cms-z-[99999] "
        onCloseButtonClicked={() => {
          onCloseModal();
          setFiles((prevFiles) => prevFiles.map((file) => ({ ...file, selected: false })));
        }}
      >
        <DialogHeader>
          <DialogTitle>Media Explorer</DialogTitle>

          <DialogDescription>
            <div className="visio-cms-grid visio-cms-grid-cols-7 visio-cms-max-h-[700px] visio-cms-h-[calc(100vh-200px)]">
              {loading ? (
                <div className="visio-cms-col-span-7  visio-cms-h-full visio-cms-grid visio-cms-place-items-center">
                  <Loader size={16} className="visio-cms-animate-spin" />
                </div>
              ) : (
                <>
                  {files.length < 1 ? (
                    <div className="visio-cms-col-span-7  visio-cms-h-full visio-cms-grid visio-cms-place-items-center">
                      <div className="visio-cms-flex visio-cms-items-center visio-cms-flex-col visio-cms-gap-2">
                        <p className="visio-cms-text-lg">👀</p>
                        {'You have no files uploaded yet :('}
                        <UploadButton uploadFiles={uploadFiles} />
                      </div>
                    </div>
                  ) : (
                    <>
                      {error ? (
                        <div className="visio-cms-col-span-7  visio-cms-h-full visio-cms-grid visio-cms-place-items-center">
                          <div className="visio-cms-flex visio-cms-items-center visio-cms-flex-col visio-cms-gap-2">
                            <FileWarning size={35} />
                            {error}
                            <Button onClick={fetchFiles}>Retry</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={cn('visio-cms-col-span-7 visio-cms-h-full visio-cms-flex visio-cms-flex-col', {
                              '!visio-cms-col-span-5': selectedFile != undefined,
                            })}
                          >
                            <div className="visio-cms-mb-3">
                              <UploadButton uploadFiles={uploadFiles} />
                            </div>
                            <div className="visio-cms-overflow-auto scrollbar-custom visio-cms-max-h-[650px]  visio-cms-h-[calc(100vh-250px)] ">
                              <div className="visio-cms-flex visio-cms-flex-wrap visio-cms-gap-2 ">
                                {files.map((file) => (
                                  <div
                                    onClick={() => {
                                      handleSelectMediaType(file.id);
                                    }}
                                    key={file.id}
                                    className={cn(
                                      'visio-cms-bg-dark-900 visio-cms-rounded-sm visio-cms-relative visio-cms-w-[160px] visio-cms-h-[160px]',
                                      { 'visio-cms-w-[193px] visio-cms-h-[193px]': selectedFile },
                                    )}
                                  >
                                    {file?.mediaUrl && (
                                      <img
                                        loading="lazy"
                                        src={`${file.mediaUrl}?width=150&height=150`}
                                        alt=""
                                        className="visio-cms-w-full visio-cms-h-full visio-cms-object-cover visio-cms-rounded-md"
                                      />
                                    )}
                                    <div
                                      className={cn(
                                        'visio-cms-absolute visio-cms-px-4 visio-cms-w-full visio-cms-h-full visio-cms-left-0 visio-cms-top-0 visio-cms-cursor-pointer visio-cms-rounded-md hover:visio-cms-bg-black/20 visio-cms-grid visio-cms-place-items-center',
                                        { 'visio-cms-border-[3px] visio-cms-border-primary': file.selected },
                                      )}
                                    >
                                      {file.uploadProgress > 0 && file.uploadProgress < 100 && (
                                        <Progress value={file.uploadProgress} />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {selectedFile && (
                            <div className="visio-cms-w-full visio-cms-rounded-md visio-cms-overflow-auto scrollbar-custom  visio-cms-p-2 visio-cms-col-span-2 visio-cms-shrink-0 h-full visio-cms-bg-dark-700">
                              <Label>ATTACHMENT DETAILS</Label>
                              <img
                                src={selectedFile?.mediaUrl}
                                alt=""
                                className="visio-cms-w-full visio-cms-object-contain  visio-cms-h-48 visio-cms-my-2 visio-cms-rounded-md"
                              />

                              <div className="visio-cms-w-full  visio-cms-line-clamp-2 ">
                                <Label className="!visio-cms-text-sm">{selectedFile?.file.name}</Label>
                              </div>
                              <Label className="!visio-cms-text-sm">
                                {selectedFile?.width} x {selectedFile?.height}
                              </Label>
                              <br />

                              <EditImageView image={selectedFile} onImageSaved={() => onImageSaved()} />
                              <br />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant={'ghost'} className="visio-cms-text-destructive visio-cms-mb-2">
                                    Delete Permanently
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete your account and remove
                                      the image from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="visio-cms-text-white">Cancel</AlertDialogCancel>
                                    <Button
                                      onClick={() => {
                                        deleteFile(selectedFile.id);
                                      }}
                                      disabled={deleting}
                                    >
                                      {deleting ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Continue'}
                                    </Button>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Separator />

                              <Label>Alt text</Label>
                              <Input
                                className="visio-cms-my-2"
                                value={selectedFileAltText}
                                onChange={(e) => {
                                  setSelectedFileAltText(e.target.value);
                                }}
                              />
                              <Label>Src</Label>
                              <Input className="visio-cms-my-2" value={selectedFile?.mediaUrl} readOnly />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        {selectedFile && (
          <DialogFooter className="visio-cms-border-t visio-cms-border-dark-700 visio-cms-pt-2">
            <Button
              onClick={() => {
                onImageChosen({
                  mediaHash: selectedFile.hashed_file_name || '',
                  altText: selectedFileAltText,
                  width: selectedFile.width || 0,
                  height: selectedFile.height || 0,
                });
                setFiles((prevFiles) => prevFiles.map((file) => ({ ...file, selected: false })));
              }}
            >
              Insert Media
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UploadButton({ uploadFiles }: { uploadFiles: (mediaFiles: Media[]) => void }) {
  return (
    <>
      <label
        htmlFor="upload-file"
        className="visio-cms-rounded-md  visio-cms-px-3  visio-cms-p-2 visio-cms-w-max visio-cms-flex visio-cms-cursor-pointer  visio-cms-gap-4 hover:!visio-cms-bg-dark-700"
      >
        <Upload size={16} />
        UPLOAD
      </label>
      <input
        multiple
        id="upload-file"
        type="file"
        accept="image/*"
        className="visio-cms-hidden"
        onChange={(e) => {
          const files = e.target.files;

          if (files) {
            const mediaFiles = Object.keys(files).map((fileKey: any) => {
              const file = files[fileKey];
              return {
                id: uuidv4(),
                file,
                uploadProgress: 0,
              };
            });

            uploadFiles(mediaFiles);
          }
        }}
      />
    </>
  );
}
