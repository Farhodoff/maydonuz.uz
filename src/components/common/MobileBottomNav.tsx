import React from 'react';
import { Map, LayoutList, Calendar, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileBottomNavProps {
  onOpenAuth: () => void;
  onOpenBookings: () => void;
  onOpenOwner?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenAuth,
  onOpenBookings,
}) => {
  const { viewMode, setViewMode } = useApp();
  const { isLoggedIn, user } = useAuth();
  const { bookings } = useBooking();
  const { translations } = useLanguage();

  const userBookings = user
    ? bookings.filter((b) => b.userId.toLowerCase() === user.email.toLowerCase() && b.paymentStatus !== 'cancelled')
    : [];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around">
        {/* List View */}
        <button
          onClick={() => setViewMode('list')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            viewMode === 'list'
              ? 'text-brand-700 font-bold bg-brand-50/80 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <LayoutList className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{translations.list || 'Ro‘yxat'}</span>
        </button>

        {/* Map View */}
        <button
          onClick={() => setViewMode('map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            viewMode === 'map'
              ? 'text-brand-700 font-bold bg-brand-50/80 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Map className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{translations.map || 'Xarita'}</span>
        </button>

        {/* My Bookings */}
        <button
          onClick={onOpenBookings}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 font-medium hover:text-slate-800 transition-all active:scale-95"
        >
          <div className="relative">
            <Calendar className="h-5 w-5 mb-0.5" />
            {userBookings.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {userBookings.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{translations.myBookings || 'Bronlar'}</span>
        </button>

        {/* Profile / Auth */}
        <button
          onClick={onOpenAuth}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 font-medium hover:text-slate-800 transition-all active:scale-95"
        >
          <div className="w-5 h-5 mb-0.5 rounded-full flex items-center justify-center bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
            {isLoggedIn ? (user?.name?.charAt(0).toUpperCase() || 'U') : <User className="h-3.5 w-3.5" />}
          </div>
          <span className="text-[10px] tracking-tight">
            {isLoggedIn ? (user?.name?.split(' ')[0] || translations.profile) : translations.login}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
