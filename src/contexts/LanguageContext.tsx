import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const defaultLanguage: Language = 'uz';

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as Language;
    return (savedLanguage === 'uz' || savedLanguage === 'ru') ? savedLanguage : defaultLanguage;
  }
  return defaultLanguage;
};

const translations: Record<Language, Record<string, string>> = {
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
    'subtitle': 'Futbol maydonlarini tezroq band qiling',
    'heroDesc': 'Futbol maydonlarini qidirib, band qilish platformasi',
    'results': 'Natijalar',
    'averagePrice': 'O‘rtacha narx',
    'view': 'Ko‘rinish',
    'searchBtn': 'Qidirish',
    'region': 'Viloyat',
    'fieldType': 'Maydon turi',
    'district': 'Tuman',
    'selectRegion': 'Viloyatni tanlang',
    'selectFieldType': 'Maydon turini tanlang',
    'selectSize': 'O\'lchamni tanlang',
    'selectDistrict': 'Tumanni tanlang',
    'tashkentRegion': 'Toshkent viloyati',
    'samarkand': 'Samarqand',
    'fergana': 'Farg\'ona',
    'andijan': 'Andijon',
    'artificial': 'Sun\'iy',
    'natural': 'Tabiiy',
    'modern': 'Zamonaviy',
    'indoor': 'Yopiq',
    'yunusabad': 'Yunusobod',
    'chilanzar': 'Chilonzor',
    'shayhantahur': 'Shayxontohur',
    'almazar': 'Olmazor',
    'retry': 'Qayta urinish',
    'ownerNotSpecified': 'Egasi ko‘rsatilmagan',
    'contact': 'Aloqa',
    'companyAddress': 'Toshkent shahri, Chilonzor tumani',
    'pages': 'Sahifalar',
    'home': 'Bosh sahifa',
    'about': 'Biz haqimizda',
    'fields': 'Maydonlar',
    'guide': 'Qo\'llanma',
    'allRightsReserved': 'Barcha huquqlar himoyalangan.'
  },
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
    'subtitle': 'Бронируйте футбольные поля быстрее',
    'heroDesc': 'Платформа для поиска и бронирования футбольных полей',
    'results': 'Результаты',
    'averagePrice': 'Средняя цена',
    'view': 'Вид',
    'searchBtn': 'Поиск',
    'region': 'Область',
    'fieldType': 'Тип поля',
    'district': 'Район',
    'selectRegion': 'Выберите область',
    'selectFieldType': 'Выберите тип поля',
    'selectSize': 'Выберите размер',
    'selectDistrict': 'Выберите район',
    'tashkentRegion': 'Ташкентская область',
    'samarkand': 'Самарканд',
    'fergana': 'Фергана',
    'andijan': 'Андижан',
    'artificial': 'Искусственное',
    'natural': 'Естественное',
    'modern': 'Современное',
    'indoor': 'Крытое',
    'yunusabad': 'Юнусабад',
    'chilanzar': 'Чиланзар',
    'shayhantahur': 'Шайхантахур',
    'almazar': 'Алмазар',
    'retry': 'Повторить попытку',
    'ownerNotSpecified': 'Владелец не указан',
    'contact': 'Контакты',
    'companyAddress': 'город Ташкент, Чиланзарский район',
    'pages': 'Страницы',
    'home': 'Главная',
    'about': 'О нас',
    'fields': 'Поля',
    'guide': 'Руководство',
    'allRightsReserved': 'Все права защищены.'
  }
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
