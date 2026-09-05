// Debounce function to limit the rate at which a function can fire
export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Format price with currency
export const formatPrice = (price: number, currency: string = 'UZS'): string => {
  return `${price.toLocaleString()} ${currency}`;
};

// Normalize coordinates to [latitude, longitude] where Uzbekistan latitude is ~37-45, longitude is ~56-74
export const normalizeCoordinates = (coords: [number, number]): [number, number] => {
  const [c1, c2] = coords;
  if (c1 > 50 && c2 < 50) {
    return [c2, c1];
  }
  return [c1, c2];
};

// Calculate distance between two coordinates in kilometers
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const [nLat1, nLon1] = normalizeCoordinates([lat1, lon1]);
  const [nLat2, nLon2] = normalizeCoordinates([lat2, lon2]);

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(nLat2 - nLat1);
  const dLon = deg2rad(nLon2 - nLon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(nLat1)) *
      Math.cos(deg2rad(nLat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}