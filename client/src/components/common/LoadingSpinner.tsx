import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
