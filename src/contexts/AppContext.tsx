import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { FootballField, SearchFilters, ViewMode, AppTab, AuthModalMode } from '../types';
import { mockFields } from '../data/mockData';
import { calculateDistance } from '../utils/helpers';

interface AppContextType {
  fields: FootballField[];
  filteredFields: FootballField[];
  viewMode: ViewMode;
  searchFilters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  activeTab: AppTab;
  userLocation: [number, number] | null;
  isLocating: boolean;
  requestUserLocation: () => Promise<[number, number] | null>;
  clearUserLocation: () => void;
  setActiveTab: (tab: AppTab) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  addField: (field: FootballField) => void;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
}

const AppContext = createContext<AppContextType>({
  fields: [],
  filteredFields: [],
  viewMode: 'list',
  searchFilters: { query: '' },
  isLoading: false,
  error: null,
  activeTab: 'fields',
  userLocation: null,
  isLocating: false,
  requestUserLocation: async () => null,
  clearUserLocation: () => {},
  setActiveTab: () => {},
  setViewMode: () => {},
  setSearchFilters: () => {},
  addField: () => {},
  isAuthModalOpen: false,
  authModalMode: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
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

const sortFieldsByImage = (
  items: FootballField[],
  sortBy?: string,
  userLocation?: [number, number] | null
): FootballField[] => {
  return [...items].sort((a, b) => {
    // If distance sorting is requested and user location is available
    if (sortBy === 'distance_asc' && userLocation) {
      const distA = calculateDistance(userLocation[0], userLocation[1], a.coordinates[0], a.coordinates[1]);
      const distB = calculateDistance(userLocation[0], userLocation[1], b.coordinates[0], b.coordinates[1]);
      if (distA !== distB) {
        return distA - distB;
      }
    }

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
  const getTabFromHash = (): AppTab => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#how-it-works') return 'how-it-works';
    if (hash === '#for-owners') return 'for-owners';
    return 'fields';
  };

  const [activeTab, setActiveTabState] = useState<AppTab>(getTabFromHash);
  const [fields, setFieldsState] = useState<FootballField[]>([]);
  const [filteredFields, setFilteredFields] = useState<FootballField[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({ query: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const searchTimeoutRef = useRef<number | null>(null);

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const latParam = urlParams.get('lat');
        const lngParam = urlParams.get('lng');
        if (latParam && lngParam) {
          const lat = parseFloat(latParam);
          const lng = parseFloat(lngParam);
          if (!isNaN(lat) && !isNaN(lng)) {
            const loc: [number, number] = [lat, lng];
            sessionStorage.setItem('maydon_user_location', JSON.stringify(loc));
            return loc;
          }
        }

        const cached = sessionStorage.getItem('maydon_user_location') || localStorage.getItem('maydon_user_location');
        if (cached) {
          return JSON.parse(cached);
        }
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLocating, setIsLocating] = useState(false);

  const requestUserLocation = useCallback(async (): Promise<[number, number] | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return null;
    }
    setIsLocating(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          sessionStorage.setItem('maydon_user_location', JSON.stringify(coords));
          localStorage.setItem('maydon_user_location', JSON.stringify(coords));
          setIsLocating(false);
          resolve(coords);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setIsLocating(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }, []);

  const clearUserLocation = useCallback(() => {
    setUserLocation(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maydon_user_location');
      localStorage.removeItem('maydon_user_location');
    }
    setSearchFiltersState((prev) => {
      if (prev.sortBy === 'distance_asc') {
        return { ...prev, sortBy: '' };
      }
      return prev;
    });
  }, []);

  const openAuthModal = useCallback((mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const setActiveTab = useCallback((tab: AppTab) => {
    setActiveTabState(tab);
    if (tab === 'fields') {
      window.location.hash = 'fields';
    } else if (tab === 'how-it-works') {
      window.location.hash = 'how-it-works';
    } else if (tab === 'for-owners') {
      window.location.hash = 'for-owners';
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const runFiltering = useCallback((allFields: FootballField[], filters: SearchFilters, userLoc: [number, number] | null) => {
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

      setFilteredFields(sortFieldsByImage(filtered, filters.sortBy, userLoc));
    } catch {
      setError('networkError');
      setFilteredFields(allFields);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Whenever fields changes, searchFilters changes, or userLocation changes, re-run filtering (debounced)
  useEffect(() => {
    if (fields.length === 0) return; // wait for initialization
    setIsLoading(true);
    setError(null);

    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      runFiltering(fields, searchFilters, userLocation);
    }, 300);

    return () => {
      if (searchTimeoutRef.current !== null) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fields, searchFilters, userLocation, runFiltering]);

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
        activeTab,
        userLocation,
        isLocating,
        requestUserLocation,
        clearUserLocation,
        setActiveTab,
        setViewMode,
        setSearchFilters,
        addField,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
