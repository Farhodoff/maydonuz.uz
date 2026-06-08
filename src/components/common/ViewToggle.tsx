import React from 'react';
import { Map, List } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { ViewMode } from '../../types';

const ViewToggle: React.FC = () => {
  const { translations } = useLanguage();
  const { viewMode, setViewMode } = useApp();

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="flex justify-center my-6">
      <div className="inline-flex rounded-2xl shadow-soft bg-white p-1.5 border border-slate-200">
        <button
          type="button"
          onClick={() => handleViewChange('map')}
          className={`inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
            viewMode === 'map'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-brand-600'
          }`}
        >
          <Map className="h-4 w-4 mr-2" />
          {translations.map}
        </button>
        <button
          type="button"
          onClick={() => handleViewChange('list')}
          className={`inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
            viewMode === 'list'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-brand-600'
          }`}
        >
          <List className="h-4 w-4 mr-2" />
          {translations.list}
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
