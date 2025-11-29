import React from 'react';
import Navbar from '../components/common/Navbar';
import SearchBar from '../components/search/SearchBar';
import ViewToggle from '../components/common/ViewToggle';
import MapView from '../components/map/MapView';
import ListView from '../components/list/ListView';
import Footer from '../components/common/Footer';
import { useApp } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Maydon.uz
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Futbol maydonlarini qidirib, band qilish platformasi
            </p>

            <SearchBar />
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