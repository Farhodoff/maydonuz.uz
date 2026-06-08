import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { FootballField, SearchFilters, ViewMode } from '../types';
import { mockFields } from '../data/mockData';

interface AppContextType {
  fields: FootballField[];
  filteredFields: FootballField[];
  viewMode: ViewMode;
  searchFilters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  setViewMode: (mode: ViewMode) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
}

const AppContext = createContext<AppContextType>({
  fields: [],
  filteredFields: [],
  viewMode: 'list',
  searchFilters: { query: '' },
  isLoading: false,
  error: null,
  setViewMode: () => {},
  setSearchFilters: () => {},
});

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/['`ʻʼ’"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getAddressKey = (field: FootballField) =>
  `${normalizeText(field.region)}|${normalizeText(field.district)}|${normalizeText(field.address)}`;

const deduplicateByAddress = (items: FootballField[]): FootballField[] => {
  const seen = new Set<string>();

  return items.filter((field) => {
    const key = getAddressKey(field);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sortFieldsByImage = (items: FootballField[]): FootballField[] => {
  return [...items].sort((a, b) => {
    // Check if fields have images
    const aHasImage = a.images && a.images.length > 0 && a.images[0] ? 1 : 0;
    const bHasImage = b.images && b.images.length > 0 && b.images[0] ? 1 : 0;
    
    // Primary sort: fields with images first
    if (aHasImage !== bHasImage) {
      return bHasImage - aHasImage;
    }
    
    // Secondary sort: by rating (highest first)
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    
    // Tertiary sort: by price (lowest first)
    if (a.price !== b.price) {
      return a.price - b.price;
    }
    
    // Quaternary sort: by name for consistency
    return a.name.localeCompare(b.name);
  });
};

const uniqueFields = sortFieldsByImage(deduplicateByAddress(mockFields));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields] = useState<FootballField[]>(uniqueFields);
  const [filteredFields, setFilteredFields] = useState<FootballField[]>(uniqueFields);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({ query: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  const setSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setIsLoading(true);
    setError(null);

    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Simulate API call delay
    searchTimeoutRef.current = window.setTimeout(() => {
      try {
        setSearchFiltersState((prevFilters) => {
          const newFilters = { ...prevFilters, ...filters };

          const filtered = fields.filter((field) => {
            const matchesQuery = newFilters.query
              ? field.name.toLowerCase().includes(newFilters.query.toLowerCase()) ||
                field.district.toLowerCase().includes(newFilters.query.toLowerCase())
              : true;

            const matchesDistrict = newFilters.district
              ? field.district === newFilters.district
              : true;

            const matchesSize = newFilters.size ? field.size === newFilters.size : true;

            return matchesQuery && matchesDistrict && matchesSize;
          });

          setFilteredFields(sortFieldsByImage(filtered));
          setIsLoading(false);
          return newFilters;
        });
      } catch {
        setError('networkError');
        setFilteredFields(fields);
        setIsLoading(false);
      }
    }, 500);
  }, [fields]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current !== null) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);


  return (
    <AppContext.Provider
      value={{
        fields,
        filteredFields,
        viewMode,
        searchFilters,
        isLoading,
        error,
        setViewMode,
        setSearchFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
