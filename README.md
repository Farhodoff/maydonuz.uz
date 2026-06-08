# ⚽ Tashkent Mini-Football Fields Mock Data

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white)



## 📝 Introduction

This repository contains a **Mock Data Array** featuring information about over 22 mini-football fields located in Tashkent city and the surrounding region. The data is structured for direct import and use in mobile or web application development for testing, demo, and prototyping purposes. The dataset is based on the structure of real booking services (e.g., ManaPolya.uz).

## 🎯 Project Goals

* To provide a **fast data source** for frontend projects (React, Vue, Angular, Mobile Apps) to work without constant server requests.
* To enable testing of maps (Google Maps, Leaflet) and Geolocation features.
* To serve as an initial database for developing search, filtering, and rating systems.

## 🛠️ Technical Specifications

| Parameter | Value |
| :--- | :--- |
| **Primary Language** | TypeScript / JavaScript |
| **File Name** | `mockFields.ts` |
| **Data Count** | 22 fields |
| **Export** | `export const mockFields` |

## 🏗️ Data Structure (Interface)

The data adheres to the following TypeScript interface named `FootballField`:

```typescript
export interface FootballField {
  id: string; // Unique identifier
  name: string; // Field name (e.g., Lider Stadium)
  district: string; // Location district (e.g., Chilonzor)
  address: string; // Approximate address
  size: string; // Field size ('5x5', '7x7', '11x11')
  price: number; // Approximate hourly price (in UZS)
  rating: number; // Rating (from 1.0 to 5.0)
  coordinates: [number, number]; // [Longitude, Latitude]
  images: string[]; // Array of image URLs (unique combination for each field)
  fieldType: "Sun'iy" | "Tabiiy" | "Zamonaviy"; // Field type (Artificial, Natural, Modern)
  region: string; // Region/City (e.g., Tashkent shahar)
  ownerName: string; // Placeholder owner name
  phone: string; // Contact phone number
}
