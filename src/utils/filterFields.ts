import { FootballField, SearchFilters } from '../types';
import { calculateDistance } from './helpers';

export const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['`ʻʼ’"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getAddressKey = (field: FootballField): string =>
  `${normalizeText(field.region)}|${normalizeText(field.district)}|${normalizeText(field.address)}`;

export const deduplicateByAddress = (items: FootballField[]): FootballField[] => {
  const seen = new Set<string>();

  return items.filter((field) => {
    const key = getAddressKey(field);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const matchFilter = (filterValue: string, fieldValue: string): boolean => {
  if (!filterValue) return true;

  const fVal = normalizeText(filterValue);
  const dbVal = normalizeText(fieldValue);

  const normalizationMap: Record<string, string[]> = {
    tashkent: ['tashkent', 'toshkent'],
    toshkent: ['tashkent', 'toshkent'],
    samarkand: ['samarkand', 'samarqand'],
    samarqand: ['samarkand', 'samarqand'],
    fergana: ['fergana', 'fargona'],
    fargona: ['fergana', 'fargona'],
    andijan: ['andijan', 'andijon'],
    andijon: ['andijan', 'andijon'],
    yunusabad: ['yunusabad', 'yunusobod'],
    yunusobod: ['yunusabad', 'yunusobod'],
    chilanzar: ['chilanzar', 'chilonzor'],
    chilonzor: ['chilanzar', 'chilonzor'],
    shayhantahur: ['shayhantahur', 'shayxontoxur', 'shayxontohur'],
    shayxontoxur: ['shayhantahur', 'shayxontoxur', 'shayxontohur'],
    shayxontohur: ['shayhantahur', 'shayxontoxur', 'shayxontohur'],
    almazar: ['almazar', 'olmazor'],
    olmazor: ['almazar', 'olmazor'],
    yashnabad: ['yashnabad', 'yashnobod'],
    yashnobod: ['yashnabad', 'yashnobod'],
  };

  if (normalizationMap[fVal]) {
    return normalizationMap[fVal].some((val) => dbVal.includes(val));
  }

  return dbVal.includes(fVal) || fVal.includes(dbVal);
};

export const sortFieldsByImage = (
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

    // User selected sorting
    if (sortBy === 'price_asc') {
      if (a.price !== b.price) return a.price - b.price;
    } else if (sortBy === 'price_desc') {
      if (a.price !== b.price) return b.price - a.price;
    } else if (sortBy === 'rating_desc') {
      if (a.rating !== b.rating) return b.rating - a.rating;
    }

    // Keep image-rich fields prominent only when no explicit sort is selected.
    const aHasImage = a.images?.[0] ? 1 : 0;
    const bHasImage = b.images?.[0] ? 1 : 0;
    if (!sortBy && aHasImage !== bHasImage) return bHasImage - aHasImage;

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

export const filterFields = (
  allFields: FootballField[],
  filters: SearchFilters,
  userLoc: [number, number] | null = null
): FootballField[] => {
  const filtered = allFields.filter((field) => {
    const query = normalizeText(filters.query || '');
    const searchableText = [
      field.name,
      field.district,
      field.region,
      field.address,
      field.fieldType,
      field.size,
    ]
      .map(normalizeText)
      .join(' ');
    const matchesQuery = query ? searchableText.includes(query) : true;

    const matchesRegion = filters.region ? matchFilter(filters.region, field.region) : true;
    const matchesFieldType = filters.fieldType ? matchFilter(filters.fieldType, field.fieldType) : true;
    const matchesDistrict = filters.district ? matchFilter(filters.district, field.district) : true;
    const matchesSize = filters.size ? matchFilter(filters.size, field.size) : true;

    return matchesQuery && matchesRegion && matchesFieldType && matchesDistrict && matchesSize;
  });

  return sortFieldsByImage(filtered, filters.sortBy, userLoc);
};
