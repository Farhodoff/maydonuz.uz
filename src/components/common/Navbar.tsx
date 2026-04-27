import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-extrabold text-brand-600 tracking-tight">Maydon.uz</h1>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
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
                  <button
                    onClick={() => handleLanguageChange('en')}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50"
                  >
                    🇺🇸 English
                  </button>
                </div>
              )}
            </div>
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
            <div className="flex flex-col space-y-2 px-3 py-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLanguageChange('uz')}
                   className={`px-3 py-1 rounded-md text-sm ${language === 'uz' ? 'bg-brand-100 text-brand-700' : 'text-slate-700'}`}
                >
                  🇺🇿 O'zbek
                </button>
                <button
                  onClick={() => handleLanguageChange('ru')}
                   className={`px-3 py-1 rounded-md text-sm ${language === 'ru' ? 'bg-brand-100 text-brand-700' : 'text-slate-700'}`}
                >
                  🇷🇺 Русский
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                   className={`px-3 py-1 rounded-md text-sm ${language === 'en' ? 'bg-brand-100 text-brand-700' : 'text-slate-700'}`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
