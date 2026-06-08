import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FootballField } from '../../types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token from env
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? '';

const MapView: React.FC = () => {
  const { filteredFields } = useApp();
  const { translations } = useLanguage();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const initMap = useCallback(() => {
    if (!mapContainer.current) return;
    
    // Reset state
    setMapError(null);
    setMapLoaded(false);

    try {
      // Check if WebGL is supported
      if (!mapboxgl.supported()) {
        setMapError('Your browser does not support WebGL, which is required to display the map.');
        return;
      }

      // Check if token is present
      if (!mapboxgl.accessToken) {
        setMapError('Mapbox access token is missing. Please check your configuration.');
        return;
      }

      if (map.current) {
        map.current.remove();
      }

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

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        // Don't show full error screen for minor issues, but log it
        if (!mapLoaded) {
          setMapError('Failed to load map style. This might be a network issue.');
        }
      });

    } catch (error: any) {
      console.error('Error initializing map:', error);
      setMapError(error?.message || 'Failed to initialize map. Please try again later.');
    }
  }, [mapLoaded]);

  // Initialize map when component mounts or retry changes
  useEffect(() => {
    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [retryCount]);

  // Add markers when fields or map changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

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
    markerEl.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${(field.available ?? true) ? '%2316a34a' : '%23ef4444'}" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>')`;
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
      </div>
    `);

    const [first, second] = field.coordinates;
    const lngLat: [number, number] = first > 50 ? [first, second] : [second, first];

    // Create marker
    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.current);
    markersRef.current.push(marker);
  };


  if (mapError) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-900 font-semibold text-lg mb-2">{mapError}</p>
          <p className="text-slate-500 mb-6">{translations.networkError}</p>
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="px-6 py-2 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden">
      <div
        ref={mapContainer}
        className="h-[600px] w-full"
        style={{ position: 'relative' }}
      />
    </div>
  );
};

export default MapView;
