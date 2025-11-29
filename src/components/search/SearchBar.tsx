import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { debounce } from '../../utils/helpers';

const SearchBar: React.FC = () => {
  const { translations } = useLanguage();
  const { setSearchFilters, searchFilters } = useApp();
  const [inputValue, setInputValue] = useState(searchFilters.query);

  // Debounce search to avoid too many re-renders
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchFilters({ query: value });
    }, 300),
    [setSearchFilters]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({ query: inputValue });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder={translations.search}
          value={inputValue}
          onChange={handleChange}
          className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;