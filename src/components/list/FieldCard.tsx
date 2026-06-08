import React from 'react';
import { Star, Image as ImageIcon } from 'lucide-react';
import { FootballField } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface FieldCardProps {
  field: FootballField;
  onFieldClick: (field: FootballField) => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, onFieldClick }) => {
  const { translations } = useLanguage();
  const hasImage = field.images && field.images.length > 0 && field.images[0];

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-soft cursor-pointer"
      onClick={() => onFieldClick(field)}
    >
      <div className="relative h-48 bg-slate-100">
        {hasImage ? (
          <img 
            src={field.images[0]} 
            alt={field.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Rasm mavjud emas</p>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex justify-between p-3">
          <span className="rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
            {field.fieldType}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
            {field.region}
          </span>
        </div>
        {!hasImage && (
          <div className="absolute top-3 left-3 rounded-full bg-yellow-500/90 px-2 py-1 text-xs font-semibold text-white">
            📸
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">{field.name}</h3>
        <p className="text-slate-500 text-sm">{field.district}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-slate-600 text-sm">{translations.size}:</span>
            <span className="ml-1 text-sm font-medium">{field.size}</span>
          </div>
          
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium">{field.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-slate-600 text-sm">{translations.price}:</span>
            <span className="ml-1 text-brand-700 font-semibold">{field.price.toLocaleString()} {translations.perHour}</span>
          </div>
          <span className="text-xs text-slate-500">
            {field.ownerName ?? translations.ownerNotSpecified}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;
