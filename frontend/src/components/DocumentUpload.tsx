import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { repositoryAPI } from '../services/api';
import { queueDocumentUpload } from '../db/indexedDB';

interface DocumentUploadProps {
  contractId: string;
  onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ contractId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      await repositoryAPI.uploadDocument(contractId, file);
      onUploadSuccess();
    } catch (err: any) {
      // If offline or server error, queue for later
      await queueDocumentUpload(contractId, file);
      setError('Upload queued for when online');
      onUploadSuccess(); // Refresh list to show queued status if needed
    } finally {
      setUploading(false);
    }
  }, [contractId, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop a document here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
            </p>
          </div>
        )}
        {uploading && (
          <p className="text-blue-600 mt-2">Uploading...</p>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;