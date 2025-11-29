# ⚽ Toshkent Mini-Futbol Maydonchalari Mock Data

## 📝 Kirish

Ushbu ombor (repository) Toshkent shahri va viloyatidagi 22 dan ortiq mini-futbol maydonchalari haqidagi ma'lumotlarni o'z ichiga olgan **Mock Data Massivi** hisoblanadi. Ma'lumotlar mobil yoki veb ilovalarni ishlab chiqishda sinov (testing), demo va prototiplash maqsadlarida bevosita import qilib ishlatish uchun tayyorlangan. Ma'lumotlar real bron qilish xizmatlari (masalan, ManaPolya.uz) asosida tuzilgan.

## 🎯 Loyiha Maqsadi

* Frontend loyihalarida (React, Vue, Angular, Mobile Apps) server so'rovlarisiz ishlash uchun tezkor ma'lumot manbai yaratish.
* Xaritalar (Google Maps, Leaflet) va Geolokatsiya xususiyatlarini sinash.
* Qidiruv, filtrlash va reyting tizimlarini ishlab chiqishda dastlabki ma'lumotlar bazasi vazifasini bajarish.

## 🛠️ Texnik Ma'lumotlar

| Parametr | Qiymat |
| :--- | :--- |
| **Asosiy Til** | TypeScript / JavaScript |
| **Fayl Nomi** | `mockFields.ts` |
| **Ma'lumotlar Soni** | 22 ta maydon |
| **Eksport** | `export const mockFields` |

## 🏗️ Ma'lumotlar Tuzilishi (Interface)

Ma'lumotlar `FootballField` nomli TypeScript interfeysiga asoslangan:

```typescript
export interface FootballField {
  id: string; // Noyob identifikator
  name: string; // Maydonning nomi (Masalan: Lider Stadium)
  district: string; // Joylashuv tumani (Masalan: Chilonzor)
  address: string; // Taxminiy manzil
  size: string; // Maydon o'lchami ('5x5', '7x7', '11x11')
  price: number; // Soatiga taxminiy narx (So'mda)
  rating: number; // Reyting (1.0 dan 5.0 gacha)
  coordinates: [number, number]; // [Longitude, Latitude] - Uzunlik va Kenglik
  images: string[]; // Rasmlar havolalari massivi (har bir maydon uchun noyob kombinatsiya)
  fieldType: "Sun'iy" | "Tabiiy" | "Zamonaviy"; // Maydon turi
  region: string; // Viloyat/shahar (Masalan: Toshkent shahar)
  ownerName: string; // Maydon egasining shartli nomi
  phone: string; // Aloqa raqami
}
