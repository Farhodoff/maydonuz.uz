import React, { useState, Suspense } from 'react';
import { Menu, X, LogOut, Key, User, ChevronDown, Calendar, Award } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Language } from '../../types';
import type { AuthModalMode } from '../modals/AuthModal';

const MyBookingsModal = React.lazy(() => import('../modals/MyBookingsModal'));
const OwnerDashboardModal = React.lazy(() => import('../modals/OwnerDashboardModal'));

const LANGUAGES: { code: Language; flag: string; label: string; full: string }[] = [
  { code: 'uz', flag: '🇺🇿', label: 'O‘Z', full: "O'zbekcha" },
  { code: 'ru', flag: '🇷🇺', label: 'РУ', full: 'Русский' },
  { code: 'en', flag: '🇬🇧', label: 'EN', full: 'English' },
];

const Navbar: React.FC = () => {
  const { language, setLanguage, translations } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  const { activeTab, setActiveTab, openAuthModal: openGlobalAuthModal } = useApp();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const [isOwnerDashboardModalOpen, setIsOwnerDashboardModalOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const openAuthModal = (mode: AuthModalMode) => {
    openGlobalAuthModal(mode);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo & Desktop Nav Tabs */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('fields')}
                className="flex-shrink-0 flex items-center cursor-pointer focus:outline-none"
              >
                <h1 className="text-xl font-black text-brand-600 tracking-tight">{translations.appName}</h1>
              </button>

              {/* Desktop links */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`text-xs font-black transition-all px-3.5 py-2 rounded-xl cursor-pointer ${
                    activeTab === 'fields'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  ⚽ {translations.fields}
                </button>
                <button
                  onClick={() => setActiveTab('how-it-works')}
                  className={`text-xs font-black transition-all px-3.5 py-2 rounded-xl cursor-pointer ${
                    activeTab === 'how-it-works'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  ⚡ {translations.howItWorks}
                </button>
                <button
                  onClick={() => setActiveTab('for-owners')}
                  className={`text-xs font-black transition-all px-3.5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'for-owners'
                      ? 'bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <span>{translations.fieldOwners}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                    {translations.business}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop right: Direct Segmented Language Switcher + Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Direct Instant Segmented Language Switcher */}
              <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-xs">
                {LANGUAGES.map((item) => {
                  const isActive = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60 scale-[1.02]'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                      title={item.full}
                    >
                      <span className="text-xs leading-none">{item.flag}</span>
                      <span className="tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Auth Buttons or Dropdown */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 text-slate-700 hover:text-brand-600 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  >
                    <User className="h-4.5 w-4.5 text-brand-600" />
                    <span>{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg py-2 z-10 border border-slate-100 divide-y divide-slate-100">
                      <div className="px-4 py-2 text-xs text-slate-400">
                        {user?.email}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => openAuthModal('profile')}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          <User className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.editProfile}
                        </button>
                        <button
                          onClick={() => openAuthModal('password')}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          <Key className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.changePassword}
                        </button>
                        <button
                          onClick={() => {
                            setIsMyBookingsModalOpen(true);
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          <Calendar className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.bookingHistory}
                        </button>
                        <button
                          onClick={() => {
                            setIsOwnerDashboardModalOpen(true);
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                        >
                          <Award className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.ownerPanel}
                        </button>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-2.5 text-red-500" />
                          {translations.logout}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-slate-700 hover:text-brand-600 font-bold text-xs px-3.5 py-2 transition-colors cursor-pointer"
                  >
                    {translations.login}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all active:scale-[0.98] shadow-sm shadow-brand-500/20 cursor-pointer"
                  >
                    {translations.register}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Header: Direct Language Switcher + Hamburger menu */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Direct Instant Segmented Language Switcher on Mobile Header */}
              <div className="flex items-center bg-slate-100/90 p-0.5 rounded-full border border-slate-200/80">
                {LANGUAGES.map((item) => {
                  const isActive = language === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`px-2 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/60'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title={item.full}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100/80 focus:outline-none cursor-pointer"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on state */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 pt-2 pb-4 space-y-2 bg-white border-t border-slate-100 shadow-xl">
              {/* Expanded Mobile Language Switcher */}
              <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                  Til / Язык / Language
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1 cursor-pointer ${
                        language === item.code
                          ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                          : 'bg-white/60 text-slate-650 hover:bg-white'
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.full}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Quick Page Links */}
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('fields');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                    activeTab === 'fields' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>⚽ {translations.fields}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('how-it-works');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                    activeTab === 'how-it-works' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>⚡ {translations.howItWorks}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('for-owners');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                    activeTab === 'for-owners' ? 'bg-slate-900 text-emerald-400' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>🏟️ {translations.fieldOwners}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase">
                    {translations.business}
                  </span>
                </button>
              </div>

              {/* Mobile Auth options */}
              {isLoggedIn ? (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="text-xs font-semibold text-slate-800 pb-1 px-1">
                    {user?.name} <span className="text-slate-400 font-normal">({user?.email})</span>
                  </div>
                  <button
                    onClick={() => openAuthModal('profile')}
                    className="block w-full text-left py-2 px-3 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    {translations.editProfile}
                  </button>
                  <button
                    onClick={() => openAuthModal('password')}
                    className="block w-full text-left py-2 px-3 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    {translations.changePassword}
                  </button>
                  <button
                    onClick={() => {
                      setIsMyBookingsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    {translations.bookingHistory}
                  </button>
                  <button
                    onClick={() => {
                      setIsOwnerDashboardModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    {translations.ownerPanel}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded-xl text-xs text-red-600 font-medium hover:bg-red-50 cursor-pointer"
                  >
                    {translations.logout}
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs text-center hover:bg-slate-50 cursor-pointer"
                  >
                    {translations.login}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-brand-600 text-white font-bold text-xs text-center hover:bg-brand-700 shadow-sm cursor-pointer"
                  >
                    {translations.register}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Lazy Loaded Modals */}
      <Suspense fallback={null}>
        {isMyBookingsModalOpen && (
          <MyBookingsModal 
            isOpen={isMyBookingsModalOpen} 
            onClose={() => setIsMyBookingsModalOpen(false)} 
          />
        )}
        {isOwnerDashboardModalOpen && (
          <OwnerDashboardModal 
            isOpen={isOwnerDashboardModalOpen} 
            onClose={() => setIsOwnerDashboardModalOpen(false)} 
          />
        )}
      </Suspense>
    </>
  );
};

export default Navbar;
