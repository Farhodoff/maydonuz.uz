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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-green-600">Maydon.uz</h1>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Globe className="h-5 w-5 mr-1" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* Language dropdown */}
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => handleLanguageChange('uz')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🇺🇿 O'zbek
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ru')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🇷🇺 Русский
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex flex-col space-y-2 px-3 py-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLanguageChange('uz')}
                  className={`px-3 py-1 rounded-md text-sm ${language === 'uz' ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}
                >
                  🇺🇿 O'zbek
                </button>
                <button
                  onClick={() => handleLanguageChange('ru')}
                  className={`px-3 py-1 rounded-md text-sm ${language === 'ru' ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}
                >
                  🇷🇺 Русский
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-md text-sm ${language === 'en' ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}
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