import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import FieldCard from './FieldCard';
import FieldCardSkeleton from './FieldCardSkeleton';
import FieldDetailsModal from '../modals/FieldDetailsModal';
import { FootballField } from '../../types';

const ListView: React.FC = () => {
  const { filteredFields, isLoading, error } = useApp();
  const { translations } = useLanguage();
  const [selectedField, setSelectedField] = useState<FootballField | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <FieldCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">{translations[error] || error}</p>
        </div>
      </div>
    );
  }

  if (filteredFields.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600">{translations.noResults}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredFields.map((field) => (
          <FieldCard 
            key={field.id} 
            field={field} 
            onFieldClick={(field) => setSelectedField(field)}
          />
        ))}
      </div>

      {selectedField && (
        <FieldDetailsModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
        />
      )}
    </>
  );
};

export default ListView;