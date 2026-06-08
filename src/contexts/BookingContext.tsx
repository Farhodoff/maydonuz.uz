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

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  // Load bookings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('maydon_bookings');
    if (stored) {
      setBookings(JSON.parse(stored));
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
      id: `br-${Math.floor(100000 + Math.random() * 900000)}`,
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
    localStorage.setItem('maydon_bookings', JSON.stringify(updatedBookings));

    return { success: true, booking: newBooking, message: 'Maydon muvaffaqiyatli band qilindi!' };
  };

  const payBooking = async (bookingId: string, method: 'click' | 'payme' | 'cash') => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'paid' as const,
          paymentMethod: method,
          transactionId: `tx-${Math.floor(10000000 + Math.random() * 90000000)}`
        };
      }
      return b;
    });

    setBookings(updatedBookings);
    localStorage.setItem('maydon_bookings', JSON.stringify(updatedBookings));
    return { success: true, message: 'To‘lov muvaffaqiyatli amalga oshirildi!' };
  };

  const cancelBooking = async (bookingId: string) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, paymentStatus: 'cancelled' as const };
      }
      return b;
    });

    setBookings(updatedBookings);
    localStorage.setItem('maydon_bookings', JSON.stringify(updatedBookings));
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
