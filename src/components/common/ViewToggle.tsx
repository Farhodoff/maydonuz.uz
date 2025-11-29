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
    <div className="flex justify-center my-4">
      <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => handleViewChange('map')}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            viewMode === 'map'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-700 hover:text-green-600'
          }`}
        >
          <Map className="h-4 w-4 mr-2" />
          {translations.map}
        </button>
        <button
          type="button"
          onClick={() => handleViewChange('list')}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            viewMode === 'list'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-700 hover:text-green-600'
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