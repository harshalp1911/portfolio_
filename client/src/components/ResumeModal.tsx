import React from 'react';
import { useQuery } from 'react-query';
import { resumeAPI } from '../services/api';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { data: resumeData, isLoading } = useQuery('resume', resumeAPI.get, {
    retry: false,
    onError: () => {},
  });
  const resume = resumeData?.data;

  if (!isOpen) return null;

  const handleDownload = () => {
    if (resume?.fileUrl) {
      const link = document.createElement('a');
      link.href = resume.fileUrl;
      link.download = resume.fileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Preview</h2>
          <div className="flex items-center gap-4">
            {resume?.fileUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[#EF6461] text-white rounded-lg hover:bg-[#ff8a87] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF6461]"></div>
            </div>
          ) : resume?.fileUrl ? (
            <div className="w-full h-full min-h-[600px]">
              <iframe
                src={`${resume.fileUrl}#toolbar=0`}
                className="w-full h-full border-0 rounded-lg"
                title="Resume Preview"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No resume uploaded yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Please upload your resume from the admin panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
