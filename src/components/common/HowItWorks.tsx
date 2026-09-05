import React, { useState } from 'react';
import {
  Search,
  CalendarCheck,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  Share2,
  Check,
  Zap,
  ShieldCheck,
  Users,
  MapPin,
  Star
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';

interface HowItWorksProps {
  onOpenOwnerModal: () => void;
}

interface DistrictOption {
  name: string;
  field: string;
  sub: string;
  price: number;
  rating: string;
  reviews: number;
  type: string;
}

const DISTRICT_DATA: Record<string, DistrictOption> = {
  'Chilonzor': {
    name: 'Chilonzor',
    field: 'Bunyodkor Arena',
    sub: '7-mavze • 5x5',
    price: 150000,
    rating: '4.9',
    reviews: 118,
    type: "🌱 Sun'iy maysa",
  },
  'Yunusobod': {
    name: 'Yunusobod',
    field: 'Lokomotiv Stadium',
    sub: '12-mavze • 6x6',
    price: 180000,
    rating: '4.8',
    reviews: 95,
    type: '🏟️ Yopiq maydon',
  },
  'Mirobod': {
    name: 'Mirobod',
    field: 'Grand Mirobod Turf',
    sub: 'Nukus ko‘chasi • 7x7',
    price: 220000,
    rating: '5.0',
    reviews: 142,
    type: '🌿 Tabiiy chim',
  },
};

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOwnerModal }) => {
  const { translations } = useLanguage();
  const { showToast } = useToast();

  // Interactive state for Step 1 (Districts)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chilonzor');

  // Interactive state for Step 2 (Time slots)
  const [selectedSlot, setSelectedSlot] = useState<string>('20:00 - 21:00');

  // Interactive state for Step 3 (Ticket share)
  const [ticketShared, setTicketShared] = useState<boolean>(false);

  // Interactive Revenue Calculator for Field Owners
  const [hourlyPrice, setHourlyPrice] = useState<number>(160000);
  const [dailyHours, setDailyHours] = useState<number>(8);

  const activeDistrictData = DISTRICT_DATA[selectedDistrict] || DISTRICT_DATA['Chilonzor'];

  // Calculations for owner calculator
  const dailyRevenue = hourlyPrice * dailyHours;
  const monthlyRevenue = dailyRevenue * 30;
  const occupancyPercent = Math.min(Math.round((dailyHours / 12) * 100), 100);
  const estimatedExtraRevenue = Math.round(monthlyRevenue * 0.35);

  const handleShareTicket = () => {
    setTicketShared(true);
    showToast(`O‘yin chiptasi nusxalandi! Do‘stlarga yuboring.`, 'success');
    setTimeout(() => setTicketShared(false), 3000);
  };

  return (
    <section id="how-it-works" className="pt-16 sm:pt-20 pb-8 my-8 sm:my-12 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-emerald-500/10 border border-emerald-500/25 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-emerald-800 mb-3.5 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
          <span>3 bosqichda oson va tezkor</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
          {translations.howItWorksTitle || 'Maydonuz qanday ishlaydi?'}
        </h2>
        
        <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Ortiqcha qo‘ng‘iroqlarsiz, atigi 1 daqiqada Toshkentdagi eng qulay maydonni toping, vaqtni tanlang va o‘yinni boshlang.
        </p>

        {/* Desktop Step Flow Indicator */}
        <div className="hidden md:flex items-center justify-center space-x-4 mt-7 text-xs font-bold text-slate-500">
          <span className="flex items-center text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            1. Maydonni tanlash
          </span>
          <div className="w-8 h-px bg-slate-300" />
          <span className="flex items-center text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-500 mr-1.5" />
            2. Vaqtni band qilish
          </span>
          <div className="w-8 h-px bg-slate-300" />
          <span className="flex items-center text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            3. Futbol o‘ynash
          </span>
        </div>
      </div>

      {/* 3 Step Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20 px-1">
        
        {/* Step 1: Maydonni tanlang */}
        <div className="group relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-soft hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div>
            {/* Step Top Bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Search className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                  Tezkor saralash
                </span>
                <span className="text-2xl font-black text-slate-300 group-hover:text-emerald-500 transition-colors">
                  01
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
              {translations.step1Title || '1. Maydonni tanlang'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Tuman, narx, maydon o‘lchami va qulayliklar (dush, yoritish) bo‘yicha o‘zingizga mos stadionni toping.
            </p>

            {/* Interactive District Filter Chips */}
            <div className="mb-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Tumanni sinab ko‘ring:</span>
                <span className="text-emerald-600 lowercase font-medium">bosing</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(DISTRICT_DATA).map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSelectedDistrict(dist)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedDistrict === dist
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Result Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 transition-all hover:bg-emerald-50/40 hover:border-emerald-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-xs font-extrabold text-slate-900">{activeDistrictData.field}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center">
                    <MapPin className="h-3 w-3 mr-0.5 text-slate-400" />
                    {activeDistrictData.sub}
                  </p>
                </div>
                <div className="flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
                  {activeDistrictData.rating}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500">{activeDistrictData.type}</span>
                <span className="font-extrabold text-emerald-700">
                  {activeDistrictData.price.toLocaleString()} UZS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Vaqtni belgilang */}
        <div className="group relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-soft hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />

          <div>
            {/* Step Top Bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full">
                  Jonli grafik
                </span>
                <span className="text-2xl font-black text-slate-300 group-hover:text-brand-500 transition-colors">
                  02
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
              {translations.step2Title || '2. Vaqtni belgilang'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Real vaqt rejimida bo‘sh soatlarni ko‘ring. Telefon qilib navbat kutmasdan, 1 marta bosishda band qiling.
            </p>

            {/* Interactive Slot Grid */}
            <div className="mb-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Bo‘sh vaqtni tanlang:</span>
                <span className="text-brand-600 lowercase font-medium">interaktiv</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'].map((slot, idx) => {
                  const isBooked = idx === 0; // 18:00 is booked
                  const isSelected = selectedSlot === slot && !isBooked;
                  
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all text-left ${
                        isBooked
                          ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-brand-300 hover:bg-brand-50/50'
                      }`}
                    >
                      <span className="text-[11px]">{slot}</span>
                      {isBooked ? (
                        <span className="text-[9px] text-slate-400">band</span>
                      ) : isSelected ? (
                        <Check className="h-3 w-3 text-white" />
                      ) : (
                        <span className="text-[9px] text-emerald-600 font-bold">bo‘sh</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot selection feedback */}
            <div className="mt-3 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-[11px] font-bold text-emerald-800">
              <span className="flex items-center truncate">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">Bugun: {selectedSlot}</span>
              </span>
              <span className="text-emerald-700 bg-white px-2 py-0.5 rounded-md shadow-xs border border-emerald-200 text-[10px] flex-shrink-0 ml-1">
                ✓ Tanlandi
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: Futbol o‘ynang! */}
        <div className="group relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-soft hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

          <div>
            {/* Step Top Bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                  Tezkor tasdiq
                </span>
                <span className="text-2xl font-black text-slate-300 group-hover:text-amber-500 transition-colors">
                  03
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
              {translations.step3Title || '3. Futbol o‘ynang!'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Click, Payme yoki joyida naqd to‘lang. O‘yin tafsilotlarini Telegram orqali bitta tugma bilan jamoaga ulashing!
            </p>

            {/* Boarding pass / Match ticket preview */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  ⚽ MAYDONUZ MATCH PASS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">#MUZ-8842</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-black text-white">{activeDistrictData.field}</div>
                  <div className="text-[10px] text-slate-300 flex items-center mt-0.5">
                    <Clock className="h-2.5 w-2.5 mr-1 text-emerald-400" />
                    Bugun, {selectedSlot}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                    Tasdiqlandi
                  </span>
                </div>
              </div>

              {/* Share to Telegram button inside card */}
              <button
                onClick={handleShareTicket}
                className={`w-full mt-1.5 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  ticketShared
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {ticketShared ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Chipta nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3 w-3 text-sky-400" />
                    <span>Telegramda jamoaga ulashish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Premium Field Owner Call to Action (CTA) Banner with Revenue Calculator */}
      {/* ========================================================================= */}
      <div
        id="for-owners"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-7 sm:p-10 lg:p-12 shadow-2xl border border-emerald-500/30 scroll-mt-24"
      >
        {/* Stadium turf line aesthetics pattern (SVG) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stadium-field-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" />
                <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stadium-field-grid)" />
          </svg>
        </div>

        {/* Ambient glow lights & stadium spotlights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Value Proposition & Benefits */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-black text-emerald-300 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MAYDON EGALARI VA BIZNES UCHUN</span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-4">
              Futbol maydoningiz bormi?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 block">
                Daromadni 2 barobar oshiring
              </span>
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Maydoningizni Maydonuz platformasiga bepul joylashtiring. Kunduzgi va kechki bo‘sh soatlarni avtomatik to‘ldirib, har kuni yangi jamoalarni jalb qiling.
            </p>

            {/* 4 Core Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-200 mb-8">
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <span>100% Bepul ulanish (0% komissiya)</span>
              </div>
              
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Qo‘ng‘iroqlarsiz avtomatik band qilish</span>
              </div>

              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Click, Payme va Naqd to‘lovlar</span>
              </div>

              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-emerald-400" />
                </div>
                <span>Telegram botga tezkor xabarnomalar</span>
              </div>
            </div>

            {/* Social Proof Bar */}
            <div className="flex items-center space-x-3 pt-2 border-t border-white/10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  BA
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  LS
                </div>
                <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  GM
                </div>
              </div>
              <div className="text-xs text-slate-300">
                <span className="font-extrabold text-white">50+ maydon egalari</span> allaqachon ulangan •{' '}
                <span className="text-emerald-400 font-bold">⭐ 4.9 hamkorlik bahosi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Revenue Simulator & Big CTA */}
          <div className="lg:col-span-5 flex flex-col items-stretch space-y-4">
            
            {/* Interactive Revenue Calculator Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-black text-emerald-300 flex items-center uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4 mr-1.5 text-emerald-400" />
                  Daromad kalkulyatori
                </span>
                <span className="text-[11px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-black">
                  +35% o‘sish prognozi
                </span>
              </div>

              {/* Selector 1: Hourly Price */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>1 soatlik narx:</span>
                  <span className="font-bold text-emerald-300 text-sm">
                    {hourlyPrice.toLocaleString()} UZS
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[120000, 150000, 180000, 220000].map((price) => (
                    <button
                      key={price}
                      onClick={() => setHourlyPrice(price)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        hourlyPrice === price
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      {(price / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Daily Hours */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Kunlik o‘rtacha band soatlar:</span>
                  <span className="font-bold text-emerald-300 text-sm">{dailyHours} soat / kun</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[4, 6, 8, 10].map((hrs) => (
                    <button
                      key={hrs}
                      onClick={() => setDailyHours(hrs)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        dailyHours === hrs
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      {hrs} soat
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculated Stats Output */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-medium">Kutilayotgan oylik tushum:</span>
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white tracking-tight">
                    {monthlyRevenue.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-400">UZS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
                  <span>Kunlik tushum:</span>
                  <span className="font-bold text-white">{dailyRevenue.toLocaleString()} UZS</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Maydon bandlik darajasi</span>
                    <span className="text-emerald-300 font-bold">{occupancyPercent}% to‘lgan</span>
                  </div>
                  <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-emerald-300 font-bold pt-1 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-400 flex-shrink-0" />
                  <span>Platforma orqali qo‘shimcha: +{estimatedExtraRevenue.toLocaleString()} UZS / oy</span>
                </div>
              </div>

              {/* Big High-Converting Action Button */}
              <button
                onClick={onOpenOwnerModal}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white font-black text-base transition-all duration-200 shadow-xl shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{translations.ownerCtaBtn || 'Maydoningizni bepul qo‘shing'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="text-center text-[11px] text-slate-400 font-medium">
                ⏱️ 2 daqiqada ulanish • Boshlang‘ich to‘lov yo‘q
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
