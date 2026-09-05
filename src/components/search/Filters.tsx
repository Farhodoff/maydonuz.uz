import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { FilterOption } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const Filters: React.FC = () => {
  const { searchFilters, setSearchFilters } = useApp();
  const { translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

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

  const sortOptions: FilterOption[] = [
    { value: 'rating_desc', label: translations.ratingDesc },
    { value: 'price_asc', label: translations.priceAsc },
    { value: 'price_desc', label: translations.priceDesc },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters({ ...searchFilters, [key]: value });
  };

  const handleResetFilters = () => {
    setSearchFilters({
      region: '',
      fieldType: '',
      size: '',
      district: '',
      sortBy: '',
    });
  };

  const activeCount = [
    searchFilters.region,
    searchFilters.fieldType,
    searchFilters.size,
    searchFilters.district,
    searchFilters.sortBy,
  ].filter(Boolean).length;

  const SelectFilter: React.FC<{
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }> = ({ label, options, value, onChange, placeholder }) => (
    <div className="w-full">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-3">
      {/* Sleek Toggle Button for Detailed Filters */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isOpen || activeCount > 0
              ? 'bg-brand-50 border-brand-200 text-brand-700'
              : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-brand-600" />
          <span>Batafsil filtrlar</span>
          {activeCount > 0 && (
            <span className="ml-1 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Filtrlarni tozalash</span>
          </button>
        )}
      </div>

      {/* Filter Dropdown Panel */}
      {isOpen && (
        <div className="mt-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/60">
            <span className="text-xs font-bold text-slate-700">Qidiruv filtrlari</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
      )}
    </div>
  );
};

export default Filters;
