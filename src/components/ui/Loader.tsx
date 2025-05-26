import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];
  
  const loader = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClass} border-t-primary-400 border-r-primary-300 border-b-primary-200 border-l-primary-100 rounded-full animate-spin`}></div>
      <p className="mt-4 text-primary-300 text-sm">Loading...</p>
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark-800 bg-opacity-80 z-50">
        {loader}
      </div>
    );
  }
  
  return <div className="flex justify-center py-8">{loader}</div>;
};

export default Loader;