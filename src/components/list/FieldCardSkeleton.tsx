import React from 'react';

const FieldCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center space-x-3.5 flex-1">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 rounded-md w-1/3" />
          <div className="h-3.5 bg-slate-150 rounded-md w-1/4" />
          <div className="flex space-x-2 pt-1">
            <div className="h-4 bg-slate-150 rounded w-12" />
            <div className="h-4 bg-slate-150 rounded w-16" />
          </div>
        </div>
      </div>
      <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2">
        <div className="h-5 bg-slate-200 rounded-md w-24" />
        <div className="h-8 bg-slate-200 rounded-xl w-24" />
      </div>
    </div>
  );
};

export default FieldCardSkeleton;