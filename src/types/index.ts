export interface FootballField {
  id: string;
  name: string;
  district: string;
  address: string;
  size: string;
  price: number;
  rating: number;
  coordinates: [number, number]; // [longitude, latitude]
  images: string[];
  fieldType: string;
  region: string;
  ownerName: string;
  phone: string;
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