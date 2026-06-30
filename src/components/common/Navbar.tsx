import React, { useState } from 'react';
import { Globe, Menu, X, LogOut, Key, User, ChevronDown, Calendar, Award } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Language } from '../../types';
import AuthModal, { AuthModalMode } from '../modals/AuthModal';
import MyBookingsModal from '../modals/MyBookingsModal';
import OwnerDashboardModal from '../modals/OwnerDashboardModal';

const Navbar: React.FC = () => {
  const { language, setLanguage, translations } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  
  const [isMyBookingsModalOpen, setIsMyBookingsModalOpen] = useState(false);
  const [isOwnerDashboardModalOpen, setIsOwnerDashboardModalOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const openAuthModal = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
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
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-extrabold text-brand-600 tracking-tight">{translations.appName}</h1>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center text-slate-600 hover:text-brand-600 px-3 py-2 rounded-full text-sm font-semibold"
                >
                  <Globe className="h-5 w-5 mr-1" />
                  <span>{language.toUpperCase()}</span>
                </button>

                {/* Language dropdown */}
                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft py-1 z-10 border border-slate-100">
                    <button
                      onClick={() => handleLanguageChange('uz')}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50"
                    >
                      🇺🇿 O'zbek
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ru')}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50"
                    >
                      🇷🇺 Русский
                    </button>
                  </div>
                )}
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
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <User className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.editProfile}
                        </button>
                        <button
                          onClick={() => openAuthModal('password')}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <Key className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.changePassword}
                        </button>
                        <button
                          onClick={() => {
                            setIsMyBookingsModalOpen(true);
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <Calendar className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.bookingHistory}
                        </button>
                        <button
                          onClick={() => {
                            setIsOwnerDashboardModalOpen(true);
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <Award className="h-4 w-4 mr-2.5 text-slate-500" />
                          {translations.ownerPanel}
                        </button>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
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
                    className="text-slate-700 hover:text-brand-600 font-semibold text-sm px-4 py-2 transition-colors"
                  >
                    {translations.login}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all active:scale-[0.98] shadow-md shadow-brand-500/10"
                  >
                    {translations.register}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-brand-600 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on state */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-100">
              <div className="flex space-x-2 px-3 py-2 border-b border-slate-50">
                <button
                  onClick={() => handleLanguageChange('uz')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${language === 'uz' ? 'bg-brand-100 text-brand-700' : 'text-slate-700'}`}
                >
                  🇺🇿 UZ
                </button>
                <button
                  onClick={() => handleLanguageChange('ru')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${language === 'ru' ? 'bg-brand-100 text-brand-700' : 'text-slate-700'}`}
                >
                  🇷🇺 RU
                </button>
              </div>

              {/* Mobile Auth options */}
              {isLoggedIn ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2">
                    {user?.name} <span className="text-xs text-slate-400 font-normal">({user?.email})</span>
                  </div>
                  <button
                    onClick={() => openAuthModal('profile')}
                    className="block w-full text-left py-2 text-sm text-slate-700 font-medium hover:text-brand-600"
                  >
                    {translations.editProfile}
                  </button>
                  <button
                    onClick={() => openAuthModal('password')}
                    className="block w-full text-left py-2 text-sm text-slate-700 font-medium hover:text-brand-600"
                  >
                    {translations.changePassword}
                  </button>
                  <button
                    onClick={() => {
                      setIsMyBookingsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm text-slate-700 font-medium hover:text-brand-600"
                  >
                    {translations.bookingHistory}
                  </button>
                  <button
                    onClick={() => {
                      setIsOwnerDashboardModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm text-slate-700 font-medium hover:text-brand-600"
                  >
                    {translations.ownerPanel}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-sm text-red-600 font-medium hover:text-red-700"
                  >
                    {translations.logout}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-3 py-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm"
                  >
                    {translations.login}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="w-full text-center py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm"
                  >
                    {translations.register}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <MyBookingsModal
        isOpen={isMyBookingsModalOpen}
        onClose={() => setIsMyBookingsModalOpen(false)}
      />

      <OwnerDashboardModal
        isOpen={isOwnerDashboardModalOpen}
        onClose={() => setIsOwnerDashboardModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
