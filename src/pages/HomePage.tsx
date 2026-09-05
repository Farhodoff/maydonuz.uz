import React, { useState, Suspense } from 'react';
import Navbar from '../components/common/Navbar';
import SearchBar from '../components/search/SearchBar';
import Filters from '../components/search/Filters';
import ViewToggle from '../components/common/ViewToggle';
import ListView from '../components/list/ListView';
import HowItWorks from '../components/common/HowItWorks';
import Footer from '../components/common/Footer';
import MobileBottomNav from '../components/common/MobileBottomNav';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FootballField } from '../types';

// Code-split heavy components
const MapView = React.lazy(() => import('../components/map/MapView'));
const FieldDetailsModal = React.lazy(() => import('../components/modals/FieldDetailsModal'));
const AuthModal = React.lazy(() => import('../components/modals/AuthModal'));
const MyBookingsModal = React.lazy(() => import('../components/modals/MyBookingsModal'));
const OwnerDashboardModal = React.lazy(() => import('../components/modals/OwnerDashboardModal'));

const MapSkeleton = () => (
  <div className="h-[460px] sm:h-[540px] md:h-[620px] rounded-3xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center animate-pulse">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-xs font-semibold text-slate-500">Xarita yuklanmoqda...</span>
  </div>
);

const HomePage: React.FC = () => {
  const { viewMode, filteredFields, searchFilters, setSearchFilters } = useApp();
  const { translations } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [selectedField, setSelectedField] = useState<FootballField | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  const handleOpenOwnerModal = () => {
    if (!isLoggedIn) {
      showToast("Maydoningizni qo‘shish uchun avval tizimga kiring yoki ro‘yxatdan o‘ting", "info");
      setIsAuthModalOpen(true);
      return;
    }
    setIsOwnerModalOpen(true);
  };

  const quickTags = [
    { label: translations.all || 'Barchasi', active: !searchFilters.district && !searchFilters.fieldType && !searchFilters.sortBy, action: () => setSearchFilters({ district: '', fieldType: '', query: '', sortBy: '' }) },
    { label: '⭐ 4.5+ ' + (translations.rating || 'Reyting'), active: searchFilters.sortBy === 'rating_desc', action: () => setSearchFilters({ sortBy: searchFilters.sortBy === 'rating_desc' ? '' : 'rating_desc' }) },
    { label: '💰 ' + (translations.priceAsc || 'Arzonroq'), active: searchFilters.sortBy === 'price_asc', action: () => setSearchFilters({ sortBy: searchFilters.sortBy === 'price_asc' ? '' : 'price_asc' }) },
    { label: '🌱 ' + (translations.artificial || 'Sun‘iy'), active: searchFilters.fieldType === 'artificial', action: () => setSearchFilters({ fieldType: searchFilters.fieldType === 'artificial' ? '' : 'artificial' }) },
    { label: '📍 Yunusobod', active: searchFilters.district === 'yunusabad', action: () => setSearchFilters({ district: searchFilters.district === 'yunusabad' ? '' : 'yunusabad' }) },
    { label: '📍 Chilonzor', active: searchFilters.district === 'chilanzar', action: () => setSearchFilters({ district: searchFilters.district === 'chilanzar' ? '' : 'chilanzar' }) },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 pb-20 md:pb-0">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Minimalist, Clean Search Header */}
          <div className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-soft text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Futbol maydonlarini qidirish va band qilish
            </h1>
            <p className="text-slate-500 text-sm mb-6 max-w-xl mx-auto">
              Toshkentdagi eng yaxshi mini-futbol maydonlari, narxlar va qulay vaqtlarni toping
            </p>

            {/* Search Input */}
            <SearchBar />

            {/* Quick Filter Chips */}
            <div className="mt-4 flex items-center justify-center flex-wrap gap-2">
              {quickTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={tag.action}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    tag.active
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                      : 'bg-slate-100/90 text-slate-650 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Detailed Collapsible Filters */}
            <Filters />
          </div>

          {/* Results Bar with Inline View Toggle */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-800">
                {filteredFields.length} ta maydon
              </span>
              {(searchFilters.query || searchFilters.district || searchFilters.fieldType || searchFilters.sortBy) && (
                <span className="text-xs text-slate-400 font-medium">
                  (saralandi)
                </span>
              )}
            </div>

            <ViewToggle />
          </div>

          {/* Content: Map or List */}
          <div>
            {viewMode === 'map' ? (
              <Suspense fallback={<MapSkeleton />}>
                <MapView onFieldClick={(field) => setSelectedField(field)} />
              </Suspense>
            ) : (
              <ListView />
            )}
          </div>

          {/* Landing Elements: How It Works & Field Owner CTA */}
          <HowItWorks onOpenOwnerModal={handleOpenOwnerModal} />
        </div>
      </main>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
      />

      {/* Field Details Modal triggered from map or cards */}
      <Suspense fallback={null}>
        {selectedField && (
          <FieldDetailsModal
            field={selectedField}
            onClose={() => setSelectedField(null)}
          />
        )}

        {/* Auth Modal for mobile bottom nav */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode="login"
          />
        )}

        {/* My Bookings Modal for mobile bottom nav */}
        {isBookingsModalOpen && (
          <MyBookingsModal
            isOpen={isBookingsModalOpen}
            onClose={() => setIsBookingsModalOpen(false)}
          />
        )}

        {/* Owner Dashboard Modal triggered from landing CTA */}
        {isOwnerModalOpen && (
          <OwnerDashboardModal
            isOpen={isOwnerModalOpen}
            onClose={() => setIsOwnerModalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default HomePage;
