import React from 'react';

const FieldCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-4"></div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>
        
        <div className="mt-3">
          <div className="h-4 bg-gray-200 rounded-md w-3/5"></div>
        </div>
        
        <div className="mt-4 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default FieldCardSkeleton;