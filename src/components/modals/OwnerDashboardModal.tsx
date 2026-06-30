import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, DollarSign, Phone, MapPin, Layers, Award, Image as ImageIcon, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useBooking } from '../../contexts/BookingContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FootballField } from '../../types';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop',
];

const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({ isOpen, onClose }) => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { fields, addField } = useApp();
  const { bookings, cancelBooking } = useBooking();

  const [activeTab, setActiveTab] = useState<'fields' | 'bookings'>('fields');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [region, setRegion] = useState('tashkent');
  const [district, setDistrict] = useState('yunusabad');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(150000);
  const [size, setSize] = useState('5x5');
  const [fieldType, setFieldType] = useState<'mini' | 'standard' | 'futsal' | 'artificial' | 'natural' | 'modern'>('artificial');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);

  if (!isOpen || !user) return null;

  // Filter fields owned by current user
  const myFields = fields.filter((f) => f.ownerId === user.email);
  const myFieldIds = myFields.map((f) => f.id);

  // Filter bookings for current owner's fields
  const myBookings = bookings.filter((b) => myFieldIds.includes(b.fieldId));

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Haqiqatdan ham ushbu buyurtmani bekor qilmoqchimisiz? Mijozga xabar beriladi.')) {
      await cancelBooking(bookingId);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Rasm hajmi juda katta (maksimal 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      alert('Iltimos, barcha zaruriy maydonlarni to‘ldiring.');
      return;
    }

    // Coordinates mapping
    let coordinates: [number, number] = [41.311081, 69.240562]; // Tashkent center
    if (region === 'samarkand') {
      coordinates = [39.65417, 66.95972];
    } else if (region === 'fergana') {
      coordinates = [40.38639, 71.78639];
    } else if (region === 'andijan') {
      coordinates = [40.78206, 72.34424];
    }

    // Format region and district for match filter
    const formattedRegion = region === 'tashkent' ? 'Toshkent viloyati' : region.charAt(0).toUpperCase() + region.slice(1);
    const formattedDistrict = district.charAt(0).toUpperCase() + district.slice(1);

    const newField: FootballField = {
      id: `fd-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      region: formattedRegion,
      district: formattedDistrict,
      address,
      price: Number(price),
      size,
      fieldType,
      phone,
      coordinates,
      images: [imageUrl || PRESET_IMAGES[0]],
      rating: 5.0,
      ownerName: user.name,
      ownerId: user.email,
      available: true,
    };

    addField(newField);
    alert(translations.fieldAddedSuccess);

    // Reset Form
    setName('');
    setAddress('');
    setPhone('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 max-h-[85vh] overflow-y-auto transform transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1.5 hover:bg-slate-100"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
          <Award className="h-7 w-7 text-brand-650 mr-2.5" />
          {translations.ownerPanel}
        </h2>

        {/* Tabs navigation */}
        <div className="flex border-b border-slate-100 mb-6">
          <button
            onClick={() => { setActiveTab('fields'); setShowAddForm(false); }}
            className={`pb-3.5 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'fields' && !showAddForm
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {translations.myFields} ({myFields.length})
          </button>
          <button
            onClick={() => { setActiveTab('bookings'); setShowAddForm(false); }}
            className={`pb-3.5 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'bookings'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {translations.incomingBookings} ({myBookings.length})
          </button>
        </div>

        {/* Tab contents */}
        {showAddForm ? (
          /* Add field form */
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg mb-3">{translations.addField}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.fieldName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={translations.fieldNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.phone} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.region}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="tashkent">Toshkent viloyati</option>
                  <option value="samarkand">Samarqand</option>
                  <option value="fergana">Farg'ona</option>
                  <option value="andijan">Andijon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.district}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="yunusabad">Yunusobod</option>
                  <option value="chilanzar">Chilonzor</option>
                  <option value="shayhantahur">Shayxontohur</option>
                  <option value="almazar">Olmazor</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.address} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={translations.addressPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.pricePerHour} (UZS) *
                </label>
                <input
                  type="number"
                  required
                  min="50000"
                  step="10000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.size}
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="5x5">5x5</option>
                  <option value="7x7">7x7</option>
                  <option value="11x11">11x11</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  {translations.fieldType}
                </label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="artificial">Sun'iy (Artificial)</option>
                  <option value="natural">Tabiiy (Natural)</option>
                  <option value="modern">Zamonaviy (Modern)</option>
                  <option value="futsal">Futzal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Rasm yuklash / Havola
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <label 
                      htmlFor="field-image-upload" 
                      className="flex items-center justify-center px-4 py-2.5 border border-dashed border-slate-300 rounded-2xl hover:border-brand-500 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <Plus className="h-4 w-4 mr-1.5 text-brand-600" />
                      Rasm yuklash (Rasm fayli)
                    </label>
                    <input
                      type="file"
                      id="field-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {imageUrl && imageUrl.startsWith('data:image') && (
                      <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-xl border border-green-150 flex items-center">
                        ✓ Yuklandi
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      placeholder="Yoki rasm URL havolasini kiriting..."
                      value={imageUrl.startsWith('data:image') ? '' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Namunalar:</span>
                    <div className="flex gap-2">
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(img)}
                          className={`w-12 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                            imageUrl === img ? 'border-brand-600 scale-[1.05]' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="Preset preview" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3.5 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-3 border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm active:scale-[0.98]"
              >
                Orqaga
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl transition-all text-sm active:scale-[0.98] shadow-md shadow-brand-500/10"
              >
                {translations.saveField}
              </button>
            </div>
          </form>
        ) : activeTab === 'fields' ? (
          /* Fields list */
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                Umumiy: {myFields.length} ta maydon
              </span>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-brand-500/10 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Maydon qo'shish</span>
              </button>
            </div>

            {myFields.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-semibold">{translations.noFieldsYet}</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow border border-slate-300"
                >
                  Birinchi maydonni qo'shing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myFields.map((field) => (
                  <div 
                    key={field.id}
                    className="border border-slate-150 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-350 transition-all bg-white"
                  >
                    <div className="h-36 relative">
                      <img 
                        src={field.images[0] || PRESET_IMAGES[0]} 
                        alt={field.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm">
                        ⭐ {field.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">{field.name}</h4>
                      <div className="flex items-center text-xs text-slate-500 font-semibold">
                        <MapPin className="h-4 w-4 mr-1 text-brand-600 shrink-0" />
                        <span className="line-clamp-1">{field.district}, {field.address}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold text-[10px] uppercase">
                          {field.size}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold text-[10px] uppercase">
                          {field.fieldType}
                        </span>
                        <span className="ml-auto text-brand-700 font-extrabold text-xs self-center">
                          {field.price.toLocaleString()} UZS/soat
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Bookings list */
          <div className="space-y-4">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide block mb-2">
              Umumiy: {myBookings.length} ta bron so'rovi
            </span>

            {myBookings.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <Calendar className="h-12 w-12 text-slate-350 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-semibold">{translations.noIncomingBookings}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {myBookings.map((b) => (
                  <div 
                    key={b.id}
                    className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{b.fieldName}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                          {b.id}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-semibold">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-brand-600" />
                          <span>{b.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-brand-600" />
                          <span>{b.timeSlot}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-0.5 text-brand-700" />
                          <span>{b.price.toLocaleString()} UZS</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-550 font-bold">
                        Futbolchi: <span className="text-slate-800 font-extrabold">{b.userId}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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

                      {b.paymentStatus !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                        >
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardModal;
