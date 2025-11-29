import React, { createContext, useContext, useState, useCallback } from 'react';
import { FootballField, SearchFilters, ViewMode } from '../types';
import { mockFields } from '../data/mockData';

interface AppContextType {
  fields: FootballField[];
  filteredFields: FootballField[];
  viewMode: ViewMode;
  searchFilters: SearchFilters;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  setViewMode: (mode: ViewMode) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  openModal: () => void;
  closeModal: () => void;
  bookField: (fieldId: string) => void;
}

const AppContext = createContext<AppContextType>({
  fields: [],
  filteredFields: [],
  viewMode: 'map',
  searchFilters: { query: '' },
  isModalOpen: false,
  isLoading: false,
  error: null,
  setViewMode: () => {},
  setSearchFilters: () => {},
  openModal: () => {},
  closeModal: () => {},
  bookField: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields] = useState<FootballField[]>(mockFields);
  const [filteredFields, setFilteredFields] = useState<FootballField[]>(mockFields);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({ query: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSearchFilters = useCallback((filters: Partial<SearchFilters>) => {
    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      try {
        const newFilters = { ...searchFilters, ...filters };
        setSearchFiltersState(newFilters);

        // Filter fields based on search query
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

        setFilteredFields(filtered);
        setIsLoading(false);
      } catch {
        setError('networkError');
        setFilteredFields(fields);
        setIsLoading(false);
      }
    }, 500);
  }, [fields, searchFilters]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const bookField = (fieldId: string) => {
    // In a real app, this would make an API call to book the field
    console.log(`Booking field with ID: ${fieldId}`);
    // For now, just show the login modal
    openModal();
  };

  return (
    <AppContext.Provider
      value={{
        fields,
        filteredFields,
        viewMode,
        searchFilters,
        isModalOpen,
        isLoading,
        error,
        setViewMode,
        setSearchFilters,
        openModal,
        closeModal,
        bookField,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);