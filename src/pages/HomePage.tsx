import React from 'react';
import Navbar from '../components/common/Navbar';
import SearchBar from '../components/search/SearchBar';
import ViewToggle from '../components/common/ViewToggle';
import MapView from '../components/map/MapView';
import ListView from '../components/list/ListView';
import Footer from '../components/common/Footer';
import { useApp } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  const { viewMode, filteredFields } = useApp();
  const averagePrice = filteredFields.length
    ? Math.round(filteredFields.reduce((sum, field) => sum + field.price, 0) / filteredFields.length)
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8 shadow-soft">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 mb-3">
              Book football fields faster
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
              Maydon.uz
            </h1>
            <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
              Futbol maydonlarini qidirib, band qilish platformasi
            </p>

            <SearchBar />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">Natijalar</p>
                <p className="text-2xl font-bold text-slate-900">{filteredFields.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">O‘rtacha narx</p>
                <p className="text-2xl font-bold text-brand-700">{averagePrice.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">Ko‘rinish</p>
                <p className="text-2xl font-bold text-slate-900">{viewMode === 'map' ? 'Xarita' : 'Ro‘yxat'}</p>
              </div>
            </div>
          </div>

          <ViewToggle />

          <div className="mt-6">
            {viewMode === 'map' ? <MapView /> : <ListView />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
