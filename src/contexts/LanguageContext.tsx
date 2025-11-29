import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const defaultLanguage: Language = 'uz';

// Get initial language from localStorage or use default
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || defaultLanguage;
  }
  return defaultLanguage;
};

const translations = {
  // Uzbek translations
  'uz': {
    'appName': 'Maydon.uz',
    'search': 'Maydonlarni qidiring...',
    'map': 'Xarita',
    'list': 'Ro\'yxat',
    'login': 'Kirish',
    'available': 'Mavjud',
    'notAvailable': 'Band',
    'price': 'Narx',
    'perHour': 'so\'m/soat',
    'size': 'O\'lcham',
    'rating': 'Reyting',
    'book': 'Band qilish',
    'email': 'Email/Telefon',
    'password': 'Parol',
    'forgotPassword': 'Parolni unutdingizmi?',
    'register': 'Ro\'yxatdan o\'tish',
    'noResults': 'Hech qanday maydon topilmadi',
    'networkError': 'Tarmoq xatoligi. Namuna ma\'lumotlar ko\'rsatilmoqda.',
    'loginSuccess': 'Muvaffaqiyatli kirildi!',
    'loginError': 'Kirish muvaffaqiyatsiz. Ma\'lumotlaringizni tekshiring.',
  },
  // Russian translations
  'ru': {
    'appName': 'Maydon.uz',
    'search': 'Поиск полей...',
    'map': 'Карта',
    'list': 'Список',
    'login': 'Вход',
    'available': 'Доступно',
    'notAvailable': 'Занято',
    'price': 'Цена',
    'perHour': 'сум/час',
    'size': 'Размер',
    'rating': 'Рейтинг',
    'book': 'Забронировать',
    'email': 'Email/Телефон',
    'password': 'Пароль',
    'forgotPassword': 'Забыли пароль?',
    'register': 'Регистрация',
    'noResults': 'Поля не найдены',
    'networkError': 'Ошибка сети. Отображаются примеры данных.',
    'loginSuccess': 'Вход выполнен успешно!',
    'loginError': 'Ошибка входа. Проверьте ваши данные.',
  },
  // English translations
  'en': {
    'appName': 'Maydon.uz',
    'search': 'Search fields...',
    'map': 'Map',
    'list': 'List',
    'login': 'Login',
    'available': 'Available',
    'notAvailable': 'Booked',
    'price': 'Price',
    'perHour': 'UZS/hour',
    'size': 'Size',
    'rating': 'Rating',
    'book': 'Book Now',
    'email': 'Email/Phone',
    'password': 'Password',
    'forgotPassword': 'Forgot password?',
    'register': 'Register',
    'noResults': 'No fields found',
    'networkError': 'Network error. Showing sample data.',
    'loginSuccess': 'Login successful!',
    'loginError': 'Login failed. Please check your credentials.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  translations: translations[defaultLanguage],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  useEffect(() => {
    // Update document title based on language
    document.title = translations[language].appName;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);