import React from 'react';
import { Search, CalendarCheck, Trophy, ArrowRight, Sparkles, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HowItWorksProps {
  onOpenOwnerModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOwnerModal }) => {
  const { translations } = useLanguage();

  const steps = [
    {
      step: '01',
      icon: Search,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white',
      title: translations.step1Title || '1. Maydonni tanlang',
      description: translations.step1Desc || 'Toshkentdagi qulay tuman, narx va o‘lcham bo‘yicha eng mos maydonni toping.',
      badgeText: 'Tezkor filtrlar',
      mockup: (
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-slate-700">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate">Chilonzor • 5x5 • Sun'iy</span>
          </div>
          <span className="text-brand-700 flex-shrink-0 ml-1">150,000 UZS</span>
        </div>
      ),
    },
    {
      step: '02',
      icon: CalendarCheck,
      iconBg: 'bg-brand-50 text-brand-600 border-brand-200/80 group-hover:bg-brand-600 group-hover:text-white',
      title: translations.step2Title || '2. Vaqtni belgilang',
      description: translations.step2Desc || 'Bo‘sh soatlarni onlayn tekshirib, telefon qilmasdan 1 daqiqada band qiling.',
      badgeText: 'Jonli grafik',
      mockup: (
        <div className="mt-4 grid grid-cols-2 gap-1.5 text-[10px] font-bold">
          <div className="py-2 px-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>20:00 - 21:00 ✓</span>
          </div>
          <div className="py-2 px-2 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center">
            <span>21:00 - 22:00</span>
          </div>
        </div>
      ),
    },
    {
      step: '03',
      icon: Trophy,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80 group-hover:bg-amber-500 group-hover:text-white',
      title: translations.step3Title || '3. Futbol o‘ynang!',
      description: translations.step3Desc || 'To‘lovni qulay usulda amalga oshiring, do‘stlarga ulashing va o‘yinga boring!',
      badgeText: 'Click, Payme, Naqd',
      mockup: (
        <div className="mt-4 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between text-[11px] font-bold text-emerald-800">
          <span className="flex items-center">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            Kvitansiya tasdiqlandi
          </span>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md shadow-xs text-slate-700">
            📲 Telegram
          </span>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="my-16 sm:my-20">
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12 px-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 text-emerald-800 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3.5 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
          <span>Oddiy va qulay jarayon</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {translations.howItWorksTitle || 'Maydonuz qanday ishlaydi?'}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          {translations.howItWorksSubtitle || '3 ta oddiy qadamda futbol maydonini toping va band qiling'}
        </p>
      </div>

      {/* 3 Step Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 px-1">
        {steps.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft hover:shadow-xl hover:border-emerald-400/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-sm ${item.iconBg}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.badgeText}
                    </span>
                    <span className="text-2xl font-black text-slate-300 group-hover:text-emerald-500 transition-colors">
                      {item.step}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Mockup Preview Widget */}
                {item.mockup}
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium Field Owner Call to Action (CTA) Banner */}
      <div
        id="for-owners"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-7 sm:p-12 shadow-2xl border border-emerald-500/30"
      >
        {/* Stadium turf line aesthetics pattern (SVG) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stadium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stadium-grid)" />
          </svg>
        </div>

        {/* Ambient glow lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Benefits */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-300 mb-4 backdrop-blur-md">
              <span>🏟️ BIZNES VA MAYDON EGALARI UCHUN</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
              Futbol maydoningiz bormi?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 block sm:inline">
                Daromadni 2x oshiring
              </span>
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Maydoningizni Maydonuz platformasiga bepul qo‘shing. Bo‘sh qolayotgan kunduzgi va kechki vaqtlarni to‘ldirib, yangi jamoalarni jalb qiling.
            </p>

            {/* Checkmark benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>100% Bepul ulanish</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>Telefon qo‘ng‘iroqlarsiz avtomatika</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>Click, Payme va Naqd to‘lovlar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>Har kuni yangi o‘yinchilar</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Stats Preview Card & Big CTA */}
          <div className="lg:col-span-5 flex flex-col items-stretch space-y-4">
            {/* Glassmorphic Stats Preview Box */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-xl text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Maydon tushumi prognozi
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                  +34% o‘sish
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline">
                  <span>2,400,000</span>
                  <span className="text-xs font-normal text-slate-300 ml-1.5">UZS / kunlik</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">O‘rtacha 12 ta band qilingan soat bo‘yicha</p>
              </div>

              <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full w-[88%] rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Bandlik darajasi</span>
                <span className="text-emerald-300 font-bold">88% to‘lgan</span>
              </div>
            </div>

            {/* Big Action Button */}
            <button
              onClick={onOpenOwnerModal}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 hover:from-emerald-400 hover:via-teal-400 hover:to-brand-500 text-white font-extrabold text-sm sm:text-base transition-all duration-200 shadow-xl shadow-emerald-600/30 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>{translations.ownerCtaBtn || 'Maydon qo‘shish'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
