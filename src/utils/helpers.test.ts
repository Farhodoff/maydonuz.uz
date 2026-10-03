import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, normalizeCoordinates, calculateDistance } from './helpers';

describe('helpers.ts', () => {
  describe('normalizeCoordinates', () => {
    it('returns coordinates as is if latitude is < 50 and longitude is > 50', () => {
      const coords: [number, number] = [41.311081, 69.240562];
      expect(normalizeCoordinates(coords)).toEqual([41.311081, 69.240562]);
    });

    it('swaps coordinates if first is > 50 and second is < 50 (Uzbekistan bounding box fix)', () => {
      const swapped: [number, number] = [69.240562, 41.311081];
      expect(normalizeCoordinates(swapped)).toEqual([41.311081, 69.240562]);
    });

    it('does not swap if both are within normal latitude range', () => {
      const coords: [number, number] = [40.0, 45.0];
      expect(normalizeCoordinates(coords)).toEqual([40.0, 45.0]);
    });
  });

  describe('calculateDistance', () => {
    it('returns 0 for identical coordinates', () => {
      const dist = calculateDistance(41.3, 69.2, 41.3, 69.2);
      expect(dist).toBe(0);
    });

    it('calculates reasonable distance between two points in Tashkent', () => {
      // Point A: Amir Timur Square (approx 41.3111, 69.2797)
      // Point B: Chorsu Bazaar (approx 41.3268, 69.2378)
      const dist = calculateDistance(41.3111, 69.2797, 41.3268, 69.2378);
      expect(dist).toBeGreaterThan(3.5);
      expect(dist).toBeLessThan(4.5);
    });

    it('handles inverted input coordinates via normalizeCoordinates', () => {
      const dist1 = calculateDistance(41.3111, 69.2797, 41.3268, 69.2378);
      const dist2 = calculateDistance(69.2797, 41.3111, 41.3268, 69.2378);
      expect(dist1).toBe(dist2);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debounces multiple calls into a single invocation', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 200);

      debouncedFn('call1');
      debouncedFn('call2');
      debouncedFn('call3');

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(199);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });
  });
});
