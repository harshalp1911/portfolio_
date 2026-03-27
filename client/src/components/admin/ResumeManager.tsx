import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { resumeAPI, uploadAPI } from '../../services/api';

const ResumeManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: resumeData } = useQuery('resume', resumeAPI.get, {
    retry: false,
    onError: () => {},
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const uploadMutation = useMutation(resumeAPI.upload, {
    onSuccess: () => {
      queryClient.invalidateQueries('resume');
      setSuccess('Resume uploaded successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to upload resume');
      setSuccess('');
    },
  });

  const deleteMutation = useMutation(resumeAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('resume');
      setSuccess('Resume deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const response = await uploadAPI.uploadImage(file);
      uploadMutation.mutate({
        fileUrl: response.data.url,
        fileName: file.name,
      });
    } catch (error) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteMutation.mutate(resumeData?.data._id);
    }
  };

  const resume = resumeData?.data;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Resume</h2>

      <div className="card">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm mb-4">
            {success}
          </div>
        )}

        {resume ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{resume.fileName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  View
                </a>
                <button onClick={handleDelete} className="btn-secondary">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No resume uploaded yet</p>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            {resume ? 'Upload New Resume' : 'Upload Resume'}
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-600 file:text-white
              hover:file:bg-primary-700
              file:cursor-pointer cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            PDF only, max 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
