<div align="center">

# ⚽ Maydonuz.uz

### Toshkent mini-futbol maydonlari uchun onlayn bron qilish platformasi

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-maydonuz.netlify.app-00C7B7?style=for-the-badge)](https://maydonuz.netlify.app)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)

</div>

---

## 📌 Loyiha haqida

**Maydonuz.uz** — Toshkent shahri va uning atrofidagi **22 ta mini-futbol maydoni** haqidagi ma'lumotlarni o'z ichiga olgan frontend veb-ilova. Platforma foydalanuvchilarga maydonlarni qidirish, filtrlash, xaritada ko'rish va narxlarni solishtirish imkonini beradi.

> Mock data [ManaPolya.uz](https://manapolya.uz) kabi real bron qilish xizmatlari strukturasiga asoslangan.

---

## ✨ Asosiy imkoniyatlar

- 🔍 **Qidiruv va filtrlash** — nom, tuman, maydon turi va narx bo'yicha
- 🗺️ **Interaktiv xarita** — Mapbox orqali maydonlarni geolokatsiyada ko'rish
- 📊 **Reyting tizimi** — 1.0 dan 5.0 gacha baho
- 📱 **Responsive dizayn** — mobil va desktop qurilmalar uchun moslashtirilgan
- ⚡ **Tez ishlash** — server so'rovlarisiz to'g'ridan-to'g'ri mock data bilan

---

## 🛠️ Texnologiyalar

| Texnologiya | Maqsad |
|---|---|
| React + TypeScript | UI komponetlari va tip xavfsizligi |
| Vite | Tez build va dev server |
| Tailwind CSS | Utility-first styling |
| Mapbox GL | Interaktiv xarita |
| Lucide React | Ikonlar |
| ESLint + PostCSS | Kod sifati va CSS processing |

---

## 🚀 Ishga tushirish

### Talablar

- Node.js `>=18`
- npm yoki yarn

### O'rnatish

```bash
# Reponi klonlash
git clone https://github.com/Farhodoff/maydonuz.uz.git
cd maydonuz.uz

# Bog'liqliklarni o'rnatish
npm install

# Dev serverni ishga tushirish
npm run dev
```

Brauzerda `http://localhost:5173` ni oching.

### Build

```bash
npm run build
```

---

## 🏗️ Ma'lumot strukturasi

Barcha maydonlar quyidagi `FootballField` interfeysi asosida yozilgan:

```typescript
export interface FootballField {
  id: string;                              // Unikal identifikator
  name: string;                            // Maydon nomi
  district: string;                        // Joylashgan tuman
  address: string;                         // Taxminiy manzil
  size: string;                            // Maydon o'lchami ('5x5' | '7x7' | '11x11')
  price: number;                           // Soatlik narx (UZS)
  rating: number;                          // Reyting (1.0 – 5.0)
  coordinates: [number, number];           // [Longitude, Latitude]
  images: string[];                        // Rasm URL'lari massivi
  fieldType: "Sun'iy" | "Tabiiy" | "Zamonaviy";
  region: string;                          // Shahar/viloyat
  ownerName: string;                       // Egasi ismi (placeholder)
  phone: string;                           // Aloqa raqami
}
```

**Mock data parametrlari:**

| Parametr | Qiymat |
|---|---|
| Fayl | `src/data/mockFields.ts` |
| Maydonlar soni | 22 ta |
| Export | `export const mockFields` |

---

## 📁 Loyiha strukturasi

```
maydonuz.uz/
├── src/
│   ├── components/       # UI komponentlari
│   ├── context/          # AppContext (global state)
│   ├── data/             # mockFields.ts
│   ├── pages/            # HomePage va boshqa sahifalar
│   └── types/            # TypeScript interfeyslari
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🌐 Demo

Ilovani jonli ko'rish: **[maydonuz.netlify.app](https://maydonuz.netlify.app)**

---

## 📄 Litsenziya

MIT © [Farhodoff](https://github.com/Farhodoff)
