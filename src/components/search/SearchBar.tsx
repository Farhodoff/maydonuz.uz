import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { debounce } from '../../utils/helpers';

const SearchBar: React.FC = () => {
  const { translations } = useLanguage();
  const { setSearchFilters, searchFilters } = useApp();
  const [inputValue, setInputValue] = useState(searchFilters.query);

  // Debounce search to avoid too many re-renders
  const debouncedSearch = useMemo(
    () =>
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
    <div className="w-full max-w-3xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder={translations.search}
          value={inputValue}
          onChange={handleChange}
          className="w-full py-4 pl-12 pr-24 text-slate-700 bg-white/95 border border-slate-200 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Qidirish
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
