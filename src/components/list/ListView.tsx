import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import FieldCard from './FieldCard';
import FieldCardSkeleton from './FieldCardSkeleton';
import { FootballField } from '../../types';
import { ChevronDown } from 'lucide-react';

const FieldDetailsModal = React.lazy(() => import('../modals/FieldDetailsModal'));

const PAGE_SIZE = 10;

const ListView: React.FC = () => {
  const { filteredFields, isLoading, error } = useApp();
  const { translations } = useLanguage();
  const [selectedField, setSelectedField] = useState<FootballField | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when search/filter results change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredFields.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <FieldCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-10 rounded-2xl bg-white border border-slate-200">
        <div className="text-center">
          <p className="text-red-500 mb-2">{translations[error] || error}</p>
        </div>
      </div>
    );
  }

  if (filteredFields.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 rounded-2xl bg-white border border-slate-200 text-center">
        <div>
          <span className="text-4xl mb-3 block">⚽</span>
          <p className="text-slate-700 font-bold text-base mb-1">{translations.noResults}</p>
          <p className="text-slate-400 text-xs">Boshqa tuman yoki filtrlarni tanlab ko‘ring</p>
        </div>
      </div>
    );
  }

  const displayedFields = filteredFields.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFields.length;
  const remainingCount = filteredFields.length - visibleCount;

  return (
    <>
      <div className="flex flex-col space-y-3">
        {displayedFields.map((field) => (
          <FieldCard 
            key={field.id} 
            field={field} 
            onFieldClick={(field) => setSelectedField(field)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6 mb-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-slate-700 hover:text-brand-700 font-bold text-xs shadow-soft transition-all active:scale-95"
          >
            <span>Ko‘proq ko‘rsatish</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              +{Math.min(PAGE_SIZE, remainingCount)}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      )}

      <React.Suspense fallback={null}>
        {selectedField && (
          <FieldDetailsModal
            field={selectedField}
            onClose={() => setSelectedField(null)}
          />
        )}
      </React.Suspense>
    </>
  );
};

export default ListView;
