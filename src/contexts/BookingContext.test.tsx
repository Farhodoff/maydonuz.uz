import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BookingProvider, useBooking } from './BookingContext';
import { Booking } from '../types/booking';

const mockUseAuth = vi.fn();

vi.mock('./AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

type BookResult = { success: boolean; booking: Booking; message: string };

describe('BookingContext', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseAuth.mockReturnValue({
      user: { email: 'user@maydonuz.uz', name: 'Test User' },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <BookingProvider>{children}</BookingProvider>
  );

  it('fails to book if user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { result } = renderHook(() => useBooking(), { wrapper });

    let response: BookResult | undefined;
    await act(async () => {
      response = await result.current.bookField(
        'f1',
        'Bunyodkor',
        'img.jpg',
        '2099-12-31',
        '18:00 - 19:00',
        100000
      );
    });

    expect(response?.success).toBe(false);
    expect(response?.message).toContain('tizimga kiring');
  });

  it('successfully books a valid future time slot', async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    let response: BookResult | undefined;
    await act(async () => {
      response = await result.current.bookField(
        'f1',
        'Bunyodkor',
        'img.jpg',
        '2099-12-31',
        '18:00 - 19:00',
        100000
      );
    });

    expect(response?.success).toBe(true);
    expect(response?.booking.fieldName).toBe('Bunyodkor');
    expect(result.current.bookings).toHaveLength(1);
  });

  it('rejects booking the same slot twice', async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    await act(async () => {
      await result.current.bookField(
        'f1',
        'Bunyodkor',
        'img.jpg',
        '2099-12-31',
        '18:00 - 19:00',
        100000
      );
    });

    let secondAttempt: BookResult | undefined;
    await act(async () => {
      secondAttempt = await result.current.bookField(
        'f1',
        'Bunyodkor',
        'img.jpg',
        '2099-12-31',
        '18:00 - 19:00',
        100000
      );
    });

    expect(secondAttempt?.success).toBe(false);
    expect(secondAttempt?.message).toContain('band qilingan');
  });

  it('cancels booking and frees up the slot status', async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    let bookRes: BookResult | undefined;
    await act(async () => {
      bookRes = await result.current.bookField(
        'f1',
        'Bunyodkor',
        'img.jpg',
        '2099-12-31',
        '19:00 - 20:00',
        100000
      );
    });

    const bookingId = bookRes!.booking.id;

    act(() => {
      result.current.cancelBooking(bookingId);
    });

    const updated = result.current.bookings.find((b) => b.id === bookingId);
    expect(updated?.paymentStatus).toBe('cancelled');
  });
});
