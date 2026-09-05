import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import FieldCard from './FieldCard';
import FieldCardSkeleton from './FieldCardSkeleton';
import { FootballField } from '../../types';
import { ChevronDown, Lock, UserPlus } from 'lucide-react';

const FieldDetailsModal = React.lazy(() => import('../modals/FieldDetailsModal'));

const PAGE_SIZE = 10;

const ListView: React.FC = () => {
  const { filteredFields, isLoading, error, openAuthModal } = useApp();
  const { isLoggedIn } = useAuth();
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
          <p className="text-slate-400 text-xs">{translations.tryOtherFilters || 'Boshqa tuman yoki filtrlarni tanlab ko‘ring'}</p>
        </div>
      </div>
    );
  }

  const displayedFields = filteredFields.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFields.length;
  const remainingCount = filteredFields.length - visibleCount;

  return (
    <>
      {/* Auth Gate Reminder Banner for Guest Users */}
      {!isLoggedIn && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                {translations.guestBannerTitle || 'Maydonlarni band qilish va telefon raqamlarni ko‘rish'}
              </h4>
              <p className="text-xs text-slate-600">
                {translations.guestBannerSubtitle || 'Bepul ro‘yxatdan o‘ting va maydon egalari bilan to‘g‘ridan-to‘g‘ri bog‘laning'}
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm shadow-emerald-600/20 transition-all active:scale-95 flex-shrink-0 cursor-pointer text-center flex items-center justify-center space-x-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{translations.register || 'Ro‘yxatdan o‘tish'}</span>
          </button>
        </div>
      )}

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
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-slate-700 hover:text-brand-700 font-bold text-xs shadow-soft transition-all active:scale-95 cursor-pointer"
          >
            <span>{translations.loadMore || 'Ko‘proq ko‘rsatish'}</span>
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
