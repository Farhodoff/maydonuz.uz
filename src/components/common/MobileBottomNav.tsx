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
  const { activeTab, setActiveTab } = useApp();
  const { isLoggedIn, user } = useAuth();
  const { bookings } = useBooking();
  const { translations } = useLanguage();

  const userBookings = user
    ? bookings.filter((b) => b.userId.toLowerCase() === user.email.toLowerCase() && b.paymentStatus !== 'cancelled')
    : [];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around">
        {/* Fields Directory */}
        <button
          onClick={() => setActiveTab('fields')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'fields'
              ? 'text-emerald-700 font-bold bg-emerald-50/90 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Map className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{translations.fields}</span>
        </button>

        {/* How It Works */}
        <button
          onClick={() => setActiveTab('how-it-works')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'how-it-works'
              ? 'text-emerald-700 font-bold bg-emerald-50/90 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <LayoutList className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{translations.guide}</span>
        </button>

        {/* For Owners / Biznes */}
        <button
          onClick={() => setActiveTab('for-owners')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'for-owners'
              ? 'text-emerald-700 font-bold bg-emerald-50/90 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Calendar className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{translations.business}</span>
        </button>

        {/* Profile / Auth */}
        <button
          onClick={isLoggedIn ? onOpenBookings : onOpenAuth}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-500 font-medium hover:text-slate-800 transition-all active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <div className="w-5 h-5 mb-0.5 rounded-full flex items-center justify-center bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
              {isLoggedIn ? (user?.name?.charAt(0).toUpperCase() || 'U') : <User className="h-3.5 w-3.5" />}
            </div>
            {isLoggedIn && userBookings.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {userBookings.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">
            {isLoggedIn ? translations.myBookings || 'Bronlar' : translations.login}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
