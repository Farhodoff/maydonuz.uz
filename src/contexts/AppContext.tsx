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
  addField: (field: FootballField) => void;
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
  addField: () => {},
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
  const [fields, setFieldsState] = useState<FootballField[]>([]);
  const [filteredFields, setFilteredFields] = useState<FootballField[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({ query: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  // Initialize fields with uniqueFields + customFields on mount
  useEffect(() => {
    const customFieldsRaw = localStorage.getItem('maydon_custom_fields');
    let customFields: FootballField[] = [];
    if (customFieldsRaw) {
      try {
        customFields = JSON.parse(customFieldsRaw);
      } catch (e) {
        console.error('Error parsing custom fields', e);
      }
    }
    setFieldsState(sortFieldsByImage([...customFields, ...uniqueFields]));
  }, []);

  const runFiltering = useCallback((allFields: FootballField[], filters: SearchFilters) => {
    try {
      const filtered = allFields.filter((field) => {
        const matchesQuery = filters.query
          ? field.name.toLowerCase().includes(filters.query.toLowerCase()) ||
            field.district.toLowerCase().includes(filters.query.toLowerCase())
          : true;

        const matchesRegion = filters.region
          ? matchFilter(filters.region, field.region)
          : true;

        const matchesFieldType = filters.fieldType
          ? matchFilter(filters.fieldType, field.fieldType)
          : true;

        const matchesDistrict = filters.district
          ? matchFilter(filters.district, field.district)
          : true;

        const matchesSize = filters.size
          ? matchFilter(filters.size, field.size)
          : true;

        return matchesQuery && matchesRegion && matchesFieldType && matchesDistrict && matchesSize;
      });

      setFilteredFields(sortFieldsByImage(filtered, filters.sortBy));
    } catch {
      setError('networkError');
      setFilteredFields(allFields);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Whenever fields changes, or searchFilters changes, re-run filtering (debounced)
  useEffect(() => {
    if (fields.length === 0) return; // wait for initialization
    setIsLoading(true);
    setError(null);

    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      runFiltering(fields, searchFilters);
    }, 400);

    return () => {
      if (searchTimeoutRef.current !== null) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fields, searchFilters, runFiltering]);

  const setSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setSearchFiltersState((prev) => ({ ...prev, ...filters }));
  }, []);

  const addField = useCallback((newField: FootballField) => {
    setFieldsState((prev) => {
      const updated = [newField, ...prev];
      const customFieldsOnly = updated.filter(f => f.ownerId);
      localStorage.setItem('maydon_custom_fields', JSON.stringify(customFieldsOnly));
      return updated;
    });
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
        addField,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
