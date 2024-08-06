import { useCallback, useEffect, useState } from 'react';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { supabase } from '../utils';
import * as tus from 'tus-js-client';

export type Media = {
  id: string;
  file: File;
  uploadProgress: number;
  error?: boolean;
  mediaUrl?: string;
  selected?: boolean;
  width?: number;
  height?: number;
  altText?: string;
  hashed_file_name?: string;
};
export default function useMediaExplorer() {
  const db = supabase();
  const { projectId, bucketName } = useProjectConfigurationState();
  const [files, setFiles] = useState<Media[]>([]);
  const [selectedFileAltText, setSelectedFileAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await db.from('uploaded_files').select('*');
      if (error) {
        throw new Error(error.message);
      }
      setFiles(
        data.map((file) => ({
          id: file.id,
          uploadProgress: 100,
          file: new File([], file.file_name),
          mediaUrl: db.storage.from('media').getPublicUrl(file.hashed_file_name).data.publicUrl,
          width: file.file_width,
          height: file.file_height,
          hashed_file_name: file.hashed_file_name,
        })),
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  async function uploadFiles(mediaFiles: Media[]) {
    setFiles(() => [...mediaFiles, ...files]);
    for (const file of mediaFiles) {
      uploadFile(file.file.name, file.file, file.id);
    }
  }

  async function uploadFile(
    originalFileName: string,
    file: globalThis.File | Blob | Pick<ReadableStreamDefaultReader, 'read'>,
    filedId: string,
  ) {
    const {
      data: { session },
    } = await db.auth.getSession();
    const ext = originalFileName.substring(originalFileName.lastIndexOf('.')).replace('.', '');
    const fileName = `${filedId}.${ext}`;

    return new Promise<void>((resolve, reject) => {
      // Specify the type for the Promise
      const upload = new tus.Upload(file, {
        // Replace 'var' with 'let'
        endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session?.access_token}`, // Add null check for 'session'
          'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType: `image/${ext}`,
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: function (error: Error) {
          // Specify the type for the 'error' parameter
          console.log('Failed because: ' + error);
          reject(error);
        },
        onProgress: function (bytesUploaded: number, bytesTotal: number) {
          // Specify the types for the 'bytesUploaded' and 'bytesTotal' parameters
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setFiles((prevFiles) =>
            prevFiles.map((file) => (file.id === filedId ? { ...file, uploadProgress: Number(percentage) } : file)),
          );
        },
        onSuccess: async function () {
          const { data } = db.storage.from('media').getPublicUrl(fileName);

          const image = new Image();
          image.src = data.publicUrl;
          image.onload = async function () {
            const width = image.width;
            const height = image.height;

            setFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === filedId
                  ? { ...file, uploadProgress: Number(100), mediaUrl: data.publicUrl, width, height }
                  : file,
              ),
            );

            await db.from('uploaded_files').insert({
              file_name: originalFileName,
              hashed_file_name: fileName,
              file_width: width,
              file_height: height,
              uploaded_at: new Date(),
            });
          };
          resolve();
        },
      });

      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then(function (previousUploads: any) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        // Start the upload
        upload.start();
      });
    });
  }

  const handleSelectMediaType = useCallback((fileId: string) => {
    setFiles((prevFiles) => prevFiles.map((file) => ({ ...file, selected: file.id === fileId })));
  }, []);

  return {
    uploadFiles,
    files,
    handleSelectMediaType,
    selectedFileAltText,
    setSelectedFileAltText,
    loading,
    error,
    fetchFiles,
  };
}
