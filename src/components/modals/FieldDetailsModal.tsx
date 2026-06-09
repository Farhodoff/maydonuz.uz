import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Phone, User, Lock, CheckCircle, Navigation } from 'lucide-react';
import { FootballField } from '../../types';
import { Booking } from '../../types/booking';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import AuthModal from './AuthModal';

const ALL_TIME_SLOTS = [
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00'
];

interface FieldDetailsModalProps {
  field: FootballField;
  onClose: () => void;
}

type StepMode = 'details' | 'checkout' | 'receipt';

const FieldDetailsModal: React.FC<FieldDetailsModalProps> = ({ field, onClose }) => {
  const { translations } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { bookField, payBooking, getAvailableTimeSlots } = useBooking();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Booking states
  const [step, setStep] = useState<StepMode>('details');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Update available slots when bookings/date changes
  useEffect(() => {
    const slots = getAvailableTimeSlots(field.id, selectedDate);
    setAvailableSlots(slots);
  }, [selectedDate, field.id, getAvailableTimeSlots]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === field.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? field.images.length - 1 : prev - 1
    );
  };

  const handleBookingInit = async () => {
    if (!selectedTimeSlot) return;

    const res = await bookField(
      field.id,
      field.name,
      field.images[0] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9e55?w=500',
      selectedDate,
      selectedTimeSlot,
      field.price
    );

    if (res.success) {
      setCurrentBooking(res.booking);
      setStep('checkout');
    } else {
      alert(res.message);
    }
  };

  const handlePaymentSubmit = async (method: 'click' | 'payme' | 'cash') => {
    if (!currentBooking) return;

    const res = await payBooking(currentBooking.id, method);
    if (res.success) {
      // Update local currentBooking state to match paid status
      setCurrentBooking({
        ...currentBooking,
        paymentStatus: 'paid',
        paymentMethod: method,
        transactionId: `tx-${Math.floor(10000000 + Math.random() * 90000000)}`
      });
      setStep('receipt');
    } else {
      alert(res.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm" onClick={onClose}></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-100">
            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
              <button
                onClick={onClose}
                className="bg-white/80 hover:bg-white rounded-full p-2 hover:shadow-soft transition-all focus:outline-none"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Image Slider */}
            <div className="relative h-64 sm:h-80">
              <img
                src={field.images[currentImageIndex] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9e55?w=500'}
                alt={field.name}
                className="w-full h-full object-cover"
              />
              {field.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-semibold">
                    {currentImageIndex + 1} / {field.images.length}
                  </div>
                </>
              )}
            </div>

            <div className="bg-white px-6 py-6 sm:p-8">
              <div className="sm:flex sm:items-start">
                <div className="text-center sm:text-left w-full">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{field.name}</h3>
                  
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Navigation Address */}
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2.5 text-green-600 flex-shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">{field.district}, {field.region}</span>
                        {isLoggedIn && (
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${field.coordinates[0]},${field.coordinates[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:text-brand-700 hover:underline font-bold mt-1 flex items-center"
                          >
                            <Navigation className="h-3.5 w-3.5 mr-1" />
                            Google Xaritada navigatsiya
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <User className="h-5 w-5 mr-2.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{field.ownerName || translations.ownerNotSpecified}</span>
                    </div>
                    
                    {isLoggedIn ? (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-5 w-5 mr-2.5 text-green-600 flex-shrink-0" />
                        <a href={`tel:${field.phone}`} className="hover:text-green-700 font-bold text-sm">
                          {field.phone}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600 bg-slate-50 border border-slate-200/60 rounded-2xl p-3 sm:col-span-2">
                        <Lock className="h-5 w-5 mr-3 text-slate-400 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-xs text-slate-500 font-medium">{translations.loginToViewPhone}</p>
                          <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline mt-0.5"
                          >
                            {translations.login} / {translations.register}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-slate-600 text-sm font-medium">
                      <span className="text-slate-500 font-semibold">{translations.size}:</span> {field.size}
                    </div>
                    <div className="text-slate-600 text-sm font-medium">
                      <span className="text-slate-500 font-semibold">{translations.price}:</span> {field.price.toLocaleString()} {translations.perHour}
                    </div>
                  </div>

                  {/* Booking Section */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">{translations.book}</h4>
                    
                    {step === 'details' && (
                      <div className="space-y-4">
                        {/* Date Picker */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{translations.selectDate}</label>
                          <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => {
                              setSelectedDate(e.target.value);
                              setSelectedTimeSlot('');
                            }}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                          />
                        </div>

                        {/* Time Slots */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{translations.selectTime}</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {ALL_TIME_SLOTS.map((slot) => {
                              const isAvailable = availableSlots.includes(slot);
                              const isSelected = selectedTimeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`py-3 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${
                                    !isAvailable 
                                      ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed line-through' 
                                      : isSelected 
                                        ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-500/10'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600'
                                  }`}
                                >
                                  <div>{slot}</div>
                                  <div className={`text-[10px] mt-0.5 font-semibold ${
                                    !isAvailable 
                                      ? 'text-slate-400' 
                                      : isSelected 
                                        ? 'text-brand-100' 
                                        : 'text-slate-500'
                                  }`}>
                                    {isAvailable ? translations.available : translations.booked}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Booking Action */}
                        <div className="pt-2">
                          {isLoggedIn ? (
                            <button
                              type="button"
                              disabled={!selectedTimeSlot}
                              onClick={handleBookingInit}
                              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/10"
                            >
                              {translations.book}
                            </button>
                          ) : (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                              <p className="text-sm text-slate-600 font-medium mb-3">Maydonni band qilish uchun tizimga kiring</p>
                              <button
                                type="button"
                                onClick={() => setIsAuthModalOpen(true)}
                                className="px-6 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all"
                              >
                                {translations.login}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 'checkout' && currentBooking && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2">
                          <h5 className="font-bold text-slate-800 text-sm">{translations.bookingDetails}</h5>
                          <div className="text-xs text-slate-650 space-y-1">
                            <div className="flex justify-between">
                              <span>Maydon:</span>
                              <span className="font-bold text-slate-900">{field.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Kun:</span>
                              <span className="font-bold text-slate-900">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vaqt:</span>
                              <span className="font-bold text-slate-900">{selectedTimeSlot}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2.5 mt-2.5 text-sm">
                              <span className="font-bold text-slate-900">{translations.price}:</span>
                              <span className="font-extrabold text-brand-700">{field.price.toLocaleString()} UZS</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Options */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{translations.paymentMethodLabel}</p>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => handlePaymentSubmit('click')}
                              className="p-3.5 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-slate-50 transition-all font-bold text-slate-800 flex flex-col items-center justify-center space-y-1 active:scale-[0.98]"
                            >
                              <span className="text-blue-600 text-sm font-extrabold tracking-wide">CLICK</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePaymentSubmit('payme')}
                              className="p-3.5 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-slate-50 transition-all font-bold text-slate-800 flex flex-col items-center justify-center space-y-1 active:scale-[0.98]"
                            >
                              <span className="text-cyan-500 text-sm font-extrabold tracking-wide">Payme</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePaymentSubmit('cash')}
                              className="p-3.5 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-slate-50 transition-all font-bold text-slate-800 flex flex-col items-center justify-center space-y-1 active:scale-[0.98]"
                            >
                              <span className="text-slate-600 text-xs font-extrabold tracking-wide">Naqd</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 'receipt' && currentBooking && (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span>{translations.paymentSuccess}</span>
                        </div>

                        {/* Invoice Receipt */}
                        <div className="border border-dashed border-slate-350 rounded-2xl p-5 bg-slate-50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center translate-x-4 -translate-y-4">
                            <CheckCircle className="h-6 w-6 text-brand-600" />
                          </div>

                          <h5 className="font-extrabold text-slate-900 border-b border-slate-200 pb-3 mb-4 tracking-tight flex items-center">
                            <span>{translations.invoice}</span>
                          </h5>

                          <div className="space-y-2.5 text-xs text-slate-650">
                            <div className="flex justify-between">
                              <span>Kvitansiya ID:</span>
                              <span className="font-mono font-bold text-slate-800">{currentBooking.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tranzaksiya ID:</span>
                              <span className="font-mono font-bold text-slate-800">{currentBooking.transactionId || 'CASH_PAYMENT'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Maydon nomi:</span>
                              <span className="font-bold text-slate-800">{currentBooking.fieldName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bron kuni:</span>
                              <span className="font-semibold text-slate-800">{currentBooking.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bron vaqti:</span>
                              <span className="font-semibold text-slate-800">{currentBooking.timeSlot}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>To‘lov usuli:</span>
                              <span className="font-semibold uppercase text-slate-800">{currentBooking.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-3 mt-3 text-sm font-extrabold">
                              <span className="text-slate-900">Jami to‘lov:</span>
                              <span className="text-brand-700">{currentBooking.price.toLocaleString()} UZS</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setStep('details');
                            setSelectedTimeSlot('');
                            setCurrentBooking(null);
                          }}
                          className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                        >
                          Yana bron qilish
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode="login"
      />
    </>
  );
};

export default FieldDetailsModal;