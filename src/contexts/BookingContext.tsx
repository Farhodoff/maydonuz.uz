import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingContextType } from '../types/booking';
import { useAuth } from './AuthContext';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const ALL_TIME_SLOTS = [
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00'
];

const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= new Date().toISOString().split('T')[0];

const persistBookings = (nextBookings: Booking[]) => {
  localStorage.setItem('maydon_bookings', JSON.stringify(nextBookings));
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  // Load bookings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('maydon_bookings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      } catch {
        localStorage.removeItem('maydon_bookings');
      }
    }
  }, []);

  const bookField = async (
    fieldId: string,
    fieldName: string,
    fieldImage: string,
    date: string,
    timeSlot: string,
    price: number
  ) => {
    if (!user) {
      return { success: false, booking: {} as Booking, message: 'Bron qilish uchun tizimga kiring!' };
    }

    if (!fieldId || !fieldName || !isValidDate(date) || !ALL_TIME_SLOTS.includes(timeSlot) || price <= 0) {
      return { success: false, booking: {} as Booking, message: 'Bron ma’lumotlari noto‘g‘ri!' };
    }

    // Check if slot is already taken
    const isSlotTaken = bookings.some(
      (b) =>
        b.fieldId === fieldId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.paymentStatus !== 'cancelled'
    );

    if (isSlotTaken) {
      return { success: false, booking: {} as Booking, message: 'Bu vaqt band qilingan!' };
    }

    const newBooking: Booking = {
      id: `br-${crypto.randomUUID()}`,
      fieldId,
      fieldName,
      fieldImage,
      userId: user.email,
      date,
      timeSlot,
      price,
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    persistBookings(updatedBookings);

    return { success: true, booking: newBooking, message: 'Maydon muvaffaqiyatli band qilindi!' };
  };

  const payBooking = async (bookingId: string, method: 'click' | 'payme' | 'cash') => {
    if (!user) {
      return { success: false, message: 'To‘lov qilish uchun tizimga kiring!' };
    }

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Bron topilmadi!' };
    if (booking.userId.toLowerCase() !== user.email.toLowerCase()) {
      return { success: false, message: 'Bu bron sizga tegishli emas!' };
    }
    if (booking.paymentStatus !== 'unpaid') {
      return {
        success: false,
        message: booking.paymentStatus === 'paid' ? 'Bu bron uchun to‘lov allaqachon amalga oshirilgan!' : 'Bekor qilingan bron uchun to‘lov qilib bo‘lmaydi!'
      };
    }

    const transactionId = `tx-${crypto.randomUUID()}`;
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, paymentStatus: 'paid' as const, paymentMethod: method, transactionId }
        : b
    );

    setBookings(updatedBookings);
    persistBookings(updatedBookings);
    return { success: true, transactionId, message: 'To‘lov muvaffaqiyatli amalga oshirildi!' };
  };

  const cancelBooking = async (bookingId: string) => {
    if (!user) return { success: false, message: 'Bronni bekor qilish uchun tizimga kiring!' };

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Bron topilmadi!' };
    if (booking.paymentStatus === 'cancelled') {
      return { success: false, message: 'Bu bron allaqachon bekor qilingan!' };
    }

    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, paymentStatus: 'cancelled' as const };
      }
      return b;
    });

    setBookings(updatedBookings);
    persistBookings(updatedBookings);
    return { success: true, message: 'Bron qilish muvaffaqiyatli bekor qilindi!' };
  };

  const getAvailableTimeSlots = (fieldId: string, date: string): string[] => {
    const bookedSlots = bookings
      .filter((b) => b.fieldId === fieldId && b.date === date && b.paymentStatus !== 'cancelled')
      .map((b) => b.timeSlot);

    return ALL_TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
  };

  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter((b) => b.userId.toLowerCase() === userId.toLowerCase());
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        bookField,
        payBooking,
        cancelBooking,
        getAvailableTimeSlots,
        getUserBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
