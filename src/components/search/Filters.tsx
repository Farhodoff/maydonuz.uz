import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { FilterOption } from '../../types';
import { fetchFields } from '../../utils/api';

const regions: FilterOption[] = [
  { value: 'tashkent', label: 'Toshkent viloyat' },
  { value: 'samarkand', label: 'Samarqand' },
  { value: 'fergana', label: 'Farg\'ona' },
  { value: 'andijan', label: 'Andijon' },
];

const fieldTypes: FilterOption[] = [
  { value: 'artificial', label: 'Sun\'iy' },
  { value: 'natural', label: 'Tabiiy' },
  { value: 'modern', label: 'Zamonaviy' },
  { value: 'indoor', label: 'Yopiq' },
];

const sizes: FilterOption[] = [
  { value: '5x5', label: '5x5' },
  { value: '7x7', label: '7x7' },
  { value: '11x11', label: '11x11' },
];

const districts: FilterOption[] = [
  { value: 'yunusabad', label: 'Yunusobod' },
  { value: 'chilanzar', label: 'Chilonzor' },
  { value: 'shayhantahur', label: 'Shayxontoxur' },
  { value: 'almazar', label: 'Olmazor' },
];

// const apiUrl = import.meta.env.VITE_API_URL; // Olib tashlang

const Filters: React.FC = () => {
  const { searchFilters, setSearchFilters } = useApp();
  // const [fields, setFields] = useState([]); // Olib tashlang
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters({ ...searchFilters, [key]: value });
  };

  const SelectFilter: React.FC<{
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }> = ({ label, options, value, onChange }) => (
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
          <option value="">{`${label}ni tanlang`}</option>
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

  const url = `https://your-backend-api.com/fields?region=${searchFilters.region}&type=${searchFilters.fieldType}`;

  useEffect(() => {
    setLoading(true);
    fetchFields(searchFilters)
      .then(setFields)
      .catch(() => {/* xatolikni ko'rsatish */})
      .finally(() => setLoading(false));
  }, [searchFilters]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-4">
      <div className="flex flex-col md:flex-row gap-4">
        <SelectFilter
          label="Viloyat"
          options={regions}
          value={searchFilters.region || ''}
          onChange={(value) => handleFilterChange('region', value)}
        />
        <SelectFilter
          label="Maydon turi"
          options={fieldTypes}
          value={searchFilters.fieldType || ''}
          onChange={(value) => handleFilterChange('fieldType', value)}
        />
        <SelectFilter
          label="O'lcham"
          options={sizes}
          value={searchFilters.size || ''}
          onChange={(value) => handleFilterChange('size', value)}
        />
        <SelectFilter
          label="Tuman"
          options={districts}
          value={searchFilters.district || ''}
          onChange={(value) => handleFilterChange('district', value)}
        />
      </div>
    </div>
  );
}

export default Filters;