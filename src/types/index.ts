export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FootballField {
  id: string;
  name: string;
  district: string;
  address: string;
  size: string;
  price: number;
  rating: number;
  coordinates: [number, number]; // [latitude, longitude]
  images: string[];
  fieldType: 'mini' | 'standard' | 'futsal' | 'artificial' | 'natural' | 'modern';
  region: string;
  ownerName: string | null;
  phone: string;
  available?: boolean;
}

export interface SearchFilters {
  query: string;
  district?: string;
  size?: string;
  region?: string;
  fieldType?: string;
}

export type ViewMode = 'map' | 'list';

export type Language = 'uz' | 'ru' | 'en';

export interface UserCredentials {
  verificationCode: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}
