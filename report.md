# Maydon.uz loyihasi bo‘yicha hisobot

## 1. Loyiha vazifasi

Ushbu loyiha **futbol maydonlarini qidirish va ko‘rish platformasi** sifatida ishlab chiqilgan.  
Asosiy vazifasi foydalanuvchiga:
- maydonlarni qidirish va filtrlash,
- ro‘yxat va xarita ko‘rinishida ko‘rish,
- maydon haqidagi asosiy ma’lumotlarni (manzil, narx, reyting, turi, kontakt) tez topish
imkonini berishdan iborat.

Loyiha hozircha **mock ma’lumotlar** bilan ishlaydi va prototiplash/demonstratsiya uchun moslangan.

## 2. Ishlatilgan stacklar

| Yo‘nalish | Texnologiya |
|---|---|
| Asosiy frontend framework | React 18 |
| Dasturlash tili | TypeScript |
| Build tool / bundler | Vite 5 |
| UI stilizatsiya | Tailwind CSS |
| CSS processing | PostCSS + Autoprefixer |
| Xarita integratsiyasi | Mapbox GL JS |
| Ikonkalar | Lucide React |
| Kod sifati nazorati | ESLint |

## 3. Arxitektura (qisqacha)

- `src/pages/HomePage.tsx` — bosh sahifa va umumiy layout.
- `src/components/` — qidiruv, xarita, ro‘yxat, navbar, footer kabi UI qismlar.
- `src/contexts/` — ilova holati va til (context) boshqaruvi.
- `src/data/mockData.ts` — maydonlar bo‘yicha test ma’lumotlar manbai.

## 4. Xulosa

Maydon.uz — React + TypeScript asosida qurilgan, xarita va qidiruv funksiyalariga yo‘naltirilgan frontend loyiha bo‘lib, kelajakda real backend/booking tizimi bilan integratsiyaga tayyor prototip hisoblanadi.
