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

const matchFilter = (filterValue: string, fieldValue: string): boolean => {
  if (!filterValue) return true;
  
  const fVal = filterValue.toLowerCase();
  const dbVal = fieldValue.toLowerCase();
  
  const normalizationMap: Record<string, string[]> = {
    'tashkent': ['tashkent', 'toshkent'],
    'samarkand': ['samarkand', 'samarqand'],
    'fergana': ['fergana', 'fargona', 'farg\'ona'],
    'andijan': ['andijan', 'andijon'],
    'yunusabad': ['yunusabad', 'yunusobod'],
    'chilanzar': ['chilanzar', 'chilonzor'],
    'shayhantahur': ['shayhantahur', 'shayxontoxur', 'shayxontohur'],
    'almazar': ['almazar', 'olmazor'],
    'yashnabad': ['yashnabad', 'yashnobod'],
  };

  if (normalizationMap[fVal]) {
    return normalizationMap[fVal].some(val => dbVal.includes(val));
  }

  return dbVal.includes(fVal) || fVal.includes(dbVal);
};

const sortFieldsByImage = (items: FootballField[], sortBy?: string): FootballField[] => {
  return [...items].sort((a, b) => {
    // Check if fields have images
    const aHasImage = a.images && a.images.length > 0 && a.images[0] ? 1 : 0;
    const bHasImage = b.images && b.images.length > 0 && b.images[0] ? 1 : 0;
    
    // Primary sort: fields with images first
    if (aHasImage !== bHasImage) {
      return bHasImage - aHasImage;
    }
    
    // User selected sorting
    if (sortBy === 'price_asc') {
      return a.price - b.price;
    } else if (sortBy === 'price_desc') {
      return b.price - a.price;
    } else if (sortBy === 'rating_desc') {
      return b.rating - a.rating;
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

            const matchesRegion = newFilters.region
              ? matchFilter(newFilters.region, field.region)
              : true;

            const matchesFieldType = newFilters.fieldType
              ? matchFilter(newFilters.fieldType, field.fieldType)
              : true;

            const matchesDistrict = newFilters.district
              ? matchFilter(newFilters.district, field.district)
              : true;

            const matchesSize = newFilters.size
              ? matchFilter(newFilters.size, field.size)
              : true;

            return matchesQuery && matchesRegion && matchesFieldType && matchesDistrict && matchesSize;
          });

          setFilteredFields(sortFieldsByImage(filtered, newFilters.sortBy));
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
