import { describe, it, expect } from 'vitest';
import {
  normalizeText,
  getAddressKey,
  deduplicateByAddress,
  matchFilter,
  sortFieldsByImage,
  filterFields,
} from './filterFields';
import { FootballField, SearchFilters } from '../types';

const mockFieldsData: FootballField[] = [
  {
    id: 'f1',
    name: 'Bunyodkor Arena',
    district: 'Chilanzar',
    region: 'Toshkent',
    address: 'Bunyodkor shox ko\'chasi, 47',
    size: '105x68',
    price: 150000,
    rating: 4.8,
    coordinates: [41.2785, 69.2155],
    images: ['https://example.com/img1.jpg'],
    fieldType: 'standard',
    ownerName: 'Aziz',
    phone: '+998901234567',
  },
  {
    id: 'f2',
    name: 'Lokomotiv Mini Stadium',
    district: 'Yunusabad',
    region: 'Toshkent',
    address: 'Amir Temur ko\'chasi, 12',
    size: '40x20',
    price: 90000,
    rating: 4.5,
    coordinates: [41.3521, 69.2874],
    images: ['https://example.com/img2.jpg'],
    fieldType: 'mini',
    ownerName: 'Bobur',
    phone: '+998909876543',
  },
  {
    id: 'f3',
    name: 'Samarqand Dinamo Futsal',
    district: 'Siyob',
    region: 'Samarqand',
    address: 'Rudakiy ko\'chasi, 5',
    size: '38x18',
    price: 120000,
    rating: 4.9,
    coordinates: [39.6542, 66.9597],
    images: [],
    fieldType: 'futsal',
    ownerName: 'Sherzod',
    phone: '+998931112233',
  },
];

describe('filterFields.ts', () => {
  describe('normalizeText', () => {
    it('normalizes uppercase, trailing spaces, and Uzbek apostrophes', () => {
      expect(normalizeText("  OʻZBEKISTON  ")).toBe('ozbekiston');
      expect(normalizeText("Bo'stonliq")).toBe('bostonliq');
      expect(normalizeText("G`ijduvon")).toBe('gijduvon');
      expect(normalizeText("Qo’qon")).toBe('qoqon');
    });

    it('strips accents and combining diacritical marks', () => {
      expect(normalizeText('Futsál Áréna')).toBe('futsal arena');
    });
  });

  describe('getAddressKey & deduplicateByAddress', () => {
    it('creates address key from region, district, and address', () => {
      const key = getAddressKey(mockFieldsData[0]);
      expect(key).toBe('toshkent|chilanzar|bunyodkor shox kochasi, 47');
    });

    it('deduplicates fields with identical address keys', () => {
      const duplicateField: FootballField = {
        ...mockFieldsData[0],
        id: 'f1-copy',
        name: 'Another Name at Same Address',
      };
      const result = deduplicateByAddress([mockFieldsData[0], duplicateField, mockFieldsData[1]]);
      expect(result).toHaveLength(2);
      expect(result.map((f) => f.id)).toEqual(['f1', 'f2']);
    });
  });

  describe('matchFilter', () => {
    it('returns true if filter value is empty', () => {
      expect(matchFilter('', 'Any value')).toBe(true);
    });

    it('matches city aliases correctly (tashkent <-> toshkent)', () => {
      expect(matchFilter('tashkent', 'Toshkent shahri')).toBe(true);
      expect(matchFilter('Toshkent', 'Tashkent Region')).toBe(true);
    });

    it('matches district aliases correctly (yunusabad <-> yunusobod)', () => {
      expect(matchFilter('yunusabad', 'Yunusobod tumani')).toBe(true);
      expect(matchFilter('chilanzar', 'Chilonzor')).toBe(true);
    });

    it('matches substring if no alias found', () => {
      expect(matchFilter('standard', 'standard')).toBe(true);
      expect(matchFilter('mini', 'futsal')).toBe(false);
    });
  });

  describe('sortFieldsByImage', () => {
    it('sorts by price_asc correctly', () => {
      const sorted = sortFieldsByImage(mockFieldsData, 'price_asc');
      expect(sorted.map((f) => f.price)).toEqual([90000, 120000, 150000]);
    });

    it('sorts by price_desc correctly', () => {
      const sorted = sortFieldsByImage(mockFieldsData, 'price_desc');
      expect(sorted.map((f) => f.price)).toEqual([150000, 120000, 90000]);
    });

    it('sorts by rating_desc correctly', () => {
      const sorted = sortFieldsByImage(mockFieldsData, 'rating_desc');
      expect(sorted.map((f) => f.rating)).toEqual([4.9, 4.8, 4.5]);
    });

    it('sorts by distance_asc when userLocation is provided', () => {
      // User location near Yunusabad
      const userLoc: [number, number] = [41.352, 69.287];
      const sorted = sortFieldsByImage(mockFieldsData, 'distance_asc', userLoc);
      expect(sorted[0].id).toBe('f2'); // Lokomotiv is closest
    });
  });

  describe('filterFields', () => {
    it('filters by search query matching name or district', () => {
      const filters: SearchFilters = { query: 'bunyodkor' };
      const result = filterFields(mockFieldsData, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bunyodkor Arena');
    });

    it('filters by region', () => {
      const filters: SearchFilters = { query: '', region: 'Samarqand' };
      const result = filterFields(mockFieldsData, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('f3');
    });

    it('filters by fieldType and size', () => {
      const filters: SearchFilters = { query: '', fieldType: 'mini', size: '40x20' };
      const result = filterFields(mockFieldsData, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('f2');
    });

    it('returns empty array when no matches found', () => {
      const filters: SearchFilters = { query: 'Nonexistent Stadium XYZ' };
      const result = filterFields(mockFieldsData, filters);
      expect(result).toHaveLength(0);
    });
  });
});
