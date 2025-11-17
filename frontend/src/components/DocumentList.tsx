import React, { useState, useEffect } from 'react';
import { Download, Trash2, FileText, AlertCircle } from 'lucide-react';
import { repositoryAPI } from '../services/api';
import { cacheDocument, getCachedDocument } from '../db/indexedDB';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

interface DocumentListProps {
  contractId: string;
  refreshTrigger?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ contractId, refreshTrigger }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await repositoryAPI.listDocuments(contractId);
      setDocuments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [contractId, refreshTrigger]);

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      // Check if cached
      const cached = await getCachedDocument(contractId, documentId);
      let blob: Blob;
      if (cached) {
        blob = cached.blob;
      } else {
        // Download and cache
        const response = await repositoryAPI.downloadDocument(contractId, documentId);
        blob = new Blob([response.data]);
        await cacheDocument(contractId, documentId, filename, blob);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError('Failed to download document');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await repositoryAPI.deleteDocument(contractId, documentId);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (err: any) {
      setError('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div className="text-center py-4">Loading documents...</div>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <p>No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{doc.originalName}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(doc.id, doc.originalName)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;