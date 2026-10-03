import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { FootballField, SearchFilters, ViewMode, AppTab, AuthModalMode } from '../types';
import { mockFields } from '../data/mockData';
import { deduplicateByAddress, sortFieldsByImage, filterFields } from '../utils/filterFields';

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
      const filtered = filterFields(allFields, filters, userLoc);
      setFilteredFields(filtered);
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

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
      setSearchFilters,
      addField,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
