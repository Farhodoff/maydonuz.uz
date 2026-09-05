import React from 'react';
import { Search, CalendarCheck, Trophy, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';
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
      iconColor: 'text-emerald-600 bg-emerald-100/70 border-emerald-200',
      title: translations.step1Title || '1. Maydonni tanlang',
      description: translations.step1Desc || 'Toshkentdagi qulay tuman, narx va o‘lcham bo‘yicha eng mos maydonni toping.',
    },
    {
      step: '02',
      icon: CalendarCheck,
      iconColor: 'text-brand-600 bg-brand-100/70 border-brand-200',
      title: translations.step2Title || '2. Vaqtni belgilang',
      description: translations.step2Desc || 'Bo‘sh soatlarni onlayn tekshirib, telefon qilmasdan 1 daqiqada band qiling.',
    },
    {
      step: '03',
      icon: Trophy,
      iconColor: 'text-amber-600 bg-amber-100/70 border-amber-200',
      title: translations.step3Title || '3. Futbol o‘ynang!',
      description: translations.step3Desc || 'To‘lovni qulay usulda amalga oshiring, do‘stlarga ulashing va o‘yinga boring!',
    },
  ];

  return (
    <section id="how-it-works" className="my-14 sm:my-18">
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto mb-10 px-4">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Zap className="h-3.5 w-3.5 text-emerald-600" />
          <span>Tez va oson</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {translations.howItWorksTitle || 'Maydonuz qanday ishlaydi?'}
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          {translations.howItWorksSubtitle || '3 ta oddiy qadamda futbol maydonini toping va band qiling'}
        </p>
      </div>

      {/* 3 Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 px-1">
        {steps.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="relative bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.iconColor}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 tracking-tighter">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Owner Call to Action (CTA) Banner */}
      <div
        id="for-owners"
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-brand-950 p-6 sm:p-10 text-white shadow-xl border border-slate-800"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-brand-300 border border-white/15 mb-3.5">
              <Users className="h-3.5 w-3.5" />
              <span>Maydon egalari uchun</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2.5">
              {translations.ownerCtaTitle || 'Futbol maydoningiz bormi?'}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              {translations.ownerCtaDesc || 'Maydoningizni Maydonuz platformasiga bepul qo‘shing. Bo‘sh vaqtlarni to‘ldiring va daromadingizni oshiring.'}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>100% Bepul ro‘yxatdan o‘tish</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="h-4 w-4 text-brand-400" />
                <span>Onlayn buyurtmalar boshqaruvi</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={onOpenOwnerModal}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-brand-600/30 active:scale-95"
            >
              <span>{translations.ownerCtaBtn || 'Maydon qo‘shish'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
