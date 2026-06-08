import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { FilterOption } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const Filters: React.FC = () => {
  const { searchFilters, setSearchFilters } = useApp();
  const { translations } = useLanguage();

  const regions: FilterOption[] = [
    { value: 'tashkent', label: translations.tashkentRegion },
    { value: 'samarkand', label: translations.samarkand },
    { value: 'fergana', label: translations.fergana },
    { value: 'andijan', label: translations.andijan },
  ];

  const fieldTypes: FilterOption[] = [
    { value: 'artificial', label: translations.artificial },
    { value: 'natural', label: translations.natural },
    { value: 'modern', label: translations.modern },
    { value: 'indoor', label: translations.indoor },
  ];

  const sizes: FilterOption[] = [
    { value: '5x5', label: '5x5' },
    { value: '7x7', label: '7x7' },
    { value: '11x11', label: '11x11' },
  ];

  const districts: FilterOption[] = [
    { value: 'yunusabad', label: translations.yunusabad },
    { value: 'chilanzar', label: translations.chilanzar },
    { value: 'shayhantahur', label: translations.shayhantahur },
    { value: 'almazar', label: translations.almazar },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters({ ...searchFilters, [key]: value });
  };

  const SelectFilter: React.FC<{
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }> = ({ label, options, value, onChange, placeholder }) => (
    <div className="w-full md:w-auto">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  const sortOptions: FilterOption[] = [
    { value: 'rating_desc', label: translations.ratingDesc },
    { value: 'price_asc', label: translations.priceAsc },
    { value: 'price_desc', label: translations.priceDesc },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <SelectFilter
          label={translations.region}
          options={regions}
          value={searchFilters.region || ''}
          onChange={(value) => handleFilterChange('region', value)}
          placeholder={translations.selectRegion}
        />
        <SelectFilter
          label={translations.fieldType}
          options={fieldTypes}
          value={searchFilters.fieldType || ''}
          onChange={(value) => handleFilterChange('fieldType', value)}
          placeholder={translations.selectFieldType}
        />
        <SelectFilter
          label={translations.size}
          options={sizes}
          value={searchFilters.size || ''}
          onChange={(value) => handleFilterChange('size', value)}
          placeholder={translations.selectSize}
        />
        <SelectFilter
          label={translations.district}
          options={districts}
          value={searchFilters.district || ''}
          onChange={(value) => handleFilterChange('district', value)}
          placeholder={translations.selectDistrict}
        />
        <SelectFilter
          label={translations.sortBy}
          options={sortOptions}
          value={searchFilters.sortBy || ''}
          onChange={(value) => handleFilterChange('sortBy', value)}
          placeholder={translations.selectSort}
        />
      </div>
    </div>
  );
};

export default Filters;
