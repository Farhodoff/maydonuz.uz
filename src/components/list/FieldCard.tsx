import React from 'react';
import { Star, MapPin, ArrowRight, Lock, Phone } from 'lucide-react';
import { FootballField } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface FieldCardProps {
  field: FootballField;
  onFieldClick: (field: FootballField) => void;
}

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'artificial':
      return '🌱';
    case 'natural':
      return '🌿';
    case 'futsal':
    case 'indoor':
      return '👟';
    case 'modern':
      return '🏟️';
    case 'mini':
    default:
      return '⚽';
  }
};

const FieldCard: React.FC<FieldCardProps> = ({ field, onFieldClick }) => {
  const { translations } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { openAuthModal } = useApp();
  const isAvailable = field.available ?? true;

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      onClick={() => onFieldClick(field)}
    >
      {/* Left: Icon & Info */}
      <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
        {/* Visual Icon Badge */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/80 to-slate-50 border border-emerald-100/90 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 group-hover:scale-110 group-hover:border-brand-300 transition-transform duration-200 shadow-xs">
          {getFieldIcon(field.fieldType)}
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
              {field.name}
            </h3>
            {/* Status Dot */}
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              title={isAvailable ? translations.available : translations.booked}
            />
          </div>

          <div className="flex items-center text-xs text-slate-500 font-medium mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400 flex-shrink-0" />
            <span className="truncate">{field.district}, {field.region}</span>
          </div>

          {/* Badges */}
          <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
            <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-2 py-0.5 rounded-lg">
              {field.size}
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-[11px] px-2 py-0.5 rounded-lg">
              {translations[field.fieldType] || field.fieldType}
            </span>
            {isLoggedIn ? (
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center bg-emerald-50/70 border border-emerald-100 px-2 py-0.5 rounded-lg">
                <Phone className="h-3 w-3 mr-1 text-emerald-600" />
                {field.phone}
              </span>
            ) : (
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  openAuthModal('register');
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 flex items-center bg-slate-100/90 hover:bg-emerald-50 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                title={translations.phoneLockNotice || 'Telefon raqamni ko‘rish uchun ro‘yxatdan o‘ting'}
              >
                <Lock className="h-2.5 w-2.5 mr-1 text-slate-400" />
                {translations.phoneLoginRequired || 'Telefon: Ro‘yxatdan o‘ting'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Rating, Price & CTA */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2 flex-shrink-0">
        <div className="flex items-center space-x-3 sm:space-x-2">
          {/* Rating */}
          <div className="flex items-center bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-current mr-1" />
            <span className="text-xs font-bold text-amber-800">{field.rating.toFixed(1)}</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-base font-extrabold text-brand-700">
              {field.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium ml-1">
              {translations.perHour || 'so‘m/soat'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        {isLoggedIn ? (
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-sm shadow-brand-500/20 active:scale-95 group-hover:shadow-md cursor-pointer"
          >
            <span>{translations.book || 'Band qilish'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openAuthModal('register');
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-sm shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Lock className="h-3 w-3" />
            <span>{translations.register || 'Ro‘yxatdan o‘tish'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FieldCard;
