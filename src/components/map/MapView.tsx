import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FootballField } from '../../types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token from user specifications
mapboxgl.accessToken = 'pk.eyJ1IjoibWF5ZG9udXoiLCJhIjoiY21iYmMzankwMWh6eTJycTU1MzZmaWVkciJ9.S5sor-3J3nKTUZIWtrASwQ';

const MapView: React.FC = () => {
  const { filteredFields, bookField } = useApp();
  const { translations } = useLanguage();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [69.2401, 41.2995], // Tashkent center
        zoom: 11,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to load map. Please try again later.');
    }
  }, []);

  // Add markers when fields or map changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach((marker) => marker.remove());

    // Add new markers for each field
    filteredFields.forEach((field) => {
      createMarker(field);
    });
  }, [filteredFields, mapLoaded]);

  const createMarker = (field: FootballField) => {
    if (!map.current) return;

    // Create marker element
    const markerEl = document.createElement('div');
    markerEl.className = 'field-marker';
    markerEl.style.width = '24px';
    markerEl.style.height = '24px';
    markerEl.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${field.available ? '%2316a34a' : '%23ef4444'}" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>')`;
    markerEl.style.backgroundSize = 'cover';
    markerEl.style.cursor = 'pointer';

    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="p-2">
        <h3 class="font-bold text-green-700">${field.name}</h3>
        <p class="text-gray-600 text-sm">${field.district}, ${field.address}</p>
        <div class="flex items-center mt-1">
          <div class="flex items-center">
            <span class="text-yellow-500">★</span>
            <span class="ml-1 text-sm">${field.rating.toFixed(1)}</span>
          </div>
          <span class="mx-2">•</span>
          <span class="text-sm">${field.size}</span>
        </div>
        <div class="mt-2 text-sm font-medium">${translations.price}: ${field.price.toLocaleString()} ${translations.perHour}</div>
        <button 
          class="mt-2 w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          onclick="window.bookField('${field.id}')"
        >
          ${translations.book}
        </button>
      </div>
    `);

    // Create marker
    new mapboxgl.Marker(markerEl)
      .setLngLat(field.coordinates)
      .setPopup(popup)
      .addTo(map.current);
  };

  // Add global function for booking (needed for popup HTML)
  useEffect(() => {
    window.bookField = (fieldId: string) => {
      bookField(fieldId);
    };
    
    return () => {
      delete window.bookField;
    };
  }, [bookField]);

  if (mapError) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">{mapError}</p>
          <p className="text-gray-600">{translations.networkError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        ref={mapContainer} 
        className="h-[600px] w-full"
        style={{ position: 'relative' }}
      />
    </div>
  );
};

// Add global window declaration
declare global {
  interface Window {
    bookField: (fieldId: string) => void;
  }
}

export default MapView;