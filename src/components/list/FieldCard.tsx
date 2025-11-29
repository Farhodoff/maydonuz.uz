import React from 'react';
import { Star } from 'lucide-react';
import { FootballField } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface FieldCardProps {
  field: FootballField;
  onFieldClick: (field: FootballField) => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, onFieldClick }) => {
  const { translations } = useLanguage();

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
      onClick={() => onFieldClick(field)}
    >
      <div className="relative h-48">
        <img 
          src={field.images[0]} 
          alt={field.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
        <p className="text-gray-600 text-sm">{field.district}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm">{translations.size}:</span>
            <span className="ml-1 text-sm font-medium">{field.size}</span>
          </div>
          
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium">{field.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <span className="text-gray-700 text-sm">{translations.price}:</span>
          <span className="ml-1 text-green-700 font-semibold">{field.price.toLocaleString()} {translations.perHour}</span>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;