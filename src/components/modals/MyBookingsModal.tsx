import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, CheckCircle, AlertCircle, Trash2, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Booking } from '../../types/booking';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ isOpen, onClose }) => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { payBooking, cancelBooking, getUserBookings } = useBooking();
  
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Booking | null>(null);

  if (!isOpen || !user) return null;

  const userBookings = getUserBookings(user.email);

  const handleCancel = async (id: string) => {
    if (window.confirm('Haqiqatdan ham ushbu bron qilishni bekor qilmoqchimisiz?')) {
      await cancelBooking(id);
    }
  };

  const handlePaymentSubmit = async (bookingId: string, method: 'click' | 'payme' | 'cash') => {
    const res = await payBooking(bookingId, method);
    if (res.success) {
      setSelectedBookingForPayment(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 max-h-[85vh] overflow-y-auto transform transition-all">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1.5 hover:bg-slate-100"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{translations.bookingHistory}</h2>
        </div>

        {/* Bookings List */}
        {userBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-350 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Sizda hali bron qilingan maydonlar mavjud emas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((b) => (
              <div 
                key={b.id} 
                className="border border-slate-150 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-all bg-slate-50/50"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{b.fieldName}</h3>
                    
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5 text-brand-600" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-brand-600" />
                        <span>{b.timeSlot}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-brand-650" />
                        <span>{b.price.toLocaleString()} UZS</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3.5">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : b.paymentStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.paymentStatus === 'paid' && translations.paid}
                      {b.paymentStatus === 'unpaid' && translations.unpaid}
                      {b.paymentStatus === 'cancelled' && translations.cancelled}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {b.paymentStatus === 'unpaid' && (
                        <>
                          <button
                            onClick={() => setSelectedBookingForPayment(b)}
                            className="flex items-center px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 active:scale-[0.98]"
                          >
                            <CreditCard className="h-3.5 w-3.5 mr-1" />
                            {translations.book}
                          </button>
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="flex items-center px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1 text-red-500" />
                            {translations.cancelBookingBtn}
                          </button>
                        </>
                      )}
                      
                      {b.paymentStatus === 'paid' && (
                        <button
                          onClick={() => setSelectedReceipt(b)}
                          className="flex items-center px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 mr-1 text-brand-600" />
                          {translations.invoice}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unpaid Booking Checkout Overlay */}
      {selectedBookingForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedBookingForPayment(null)} />
          
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-sm w-full z-10 relative">
            <button 
              onClick={() => setSelectedBookingForPayment(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-lg mb-4">{translations.paymentMethodLabel}</h3>
            
            <div className="space-y-4">
              <div className="text-xs text-slate-650 bg-slate-50 p-3.5 rounded-2xl space-y-1 border border-slate-150">
                <div className="flex justify-between">
                  <span>Maydon:</span>
                  <span className="font-bold text-slate-800">{selectedBookingForPayment.fieldName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kun/Vaqt:</span>
                  <span className="font-bold text-slate-850">{selectedBookingForPayment.date} ({selectedBookingForPayment.timeSlot})</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 mt-2 font-bold text-sm">
                  <span>Narx:</span>
                  <span className="text-brand-700">{selectedBookingForPayment.price.toLocaleString()} UZS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handlePaymentSubmit(selectedBookingForPayment.id, 'click')}
                  className="py-3 border border-slate-250 rounded-xl hover:border-brand-500 hover:bg-slate-50 transition-all font-extrabold text-blue-600 text-sm text-center"
                >
                  CLICK orqali to‘lash
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentSubmit(selectedBookingForPayment.id, 'payme')}
                  className="py-3 border border-slate-250 rounded-xl hover:border-brand-500 hover:bg-slate-50 transition-all font-extrabold text-cyan-500 text-sm text-center"
                >
                  Payme orqali to‘lash
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentSubmit(selectedBookingForPayment.id, 'cash')}
                  className="py-3 border border-slate-250 rounded-xl hover:border-brand-500 hover:bg-slate-50 transition-all font-extrabold text-slate-605 text-sm text-center"
                >
                  Naqd to‘lash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Receipt Overlay */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)} />
          
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-sm w-full z-10 relative">
            <button 
              onClick={() => setSelectedReceipt(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-lg">{translations.receiptTitle}</h3>
            </div>

            <div className="border border-dashed border-slate-350 rounded-2xl p-5 bg-slate-50 text-xs text-slate-650 space-y-2.5">
              <div className="flex justify-between">
                <span>Kvitansiya ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Tranzaksiya ID:</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.transactionId || 'CASH_PAYMENT'}</span>
              </div>
              <div className="flex justify-between">
                <span>Maydon:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.fieldName}</span>
              </div>
              <div className="flex justify-between">
                <span>Kun/Vaqt:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.date} | {selectedReceipt.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span>To‘lov usuli:</span>
                <span className="font-bold uppercase text-slate-800">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 mt-3 text-sm font-extrabold">
                <span className="text-slate-900">Jami to‘lov:</span>
                <span className="text-brand-700">{selectedReceipt.price.toLocaleString()} UZS</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsModal;
