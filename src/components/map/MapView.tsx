import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FootballField } from '../../types';
import { calculateDistance } from '../../utils/helpers';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface MapViewProps {
  onFieldClick?: (field: FootballField) => void;
}

const TASHKENT_CENTER: [number, number] = [41.2995, 69.2401];

const MapView: React.FC<MapViewProps> = ({ onFieldClick }) => {
  const { filteredFields, userLocation, requestUserLocation, isLocating } = useApp();
  const { translations } = useLanguage();
  const { isLoggedIn } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedFieldForModal, setSelectedFieldForModal] = useState<FootballField | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: TASHKENT_CENTER,
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const userMarkerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    userMarkerLayerRef.current = userMarkerGroup;
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      userMarkerLayerRef.current = null;
    };
  }, []);

  // Center to Tashkent
  const handleResetCenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(TASHKENT_CENTER, 12, { duration: 1 });
    }
  }, []);

  // Geolocation to user
  const handleLocateMe = useCallback(async () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation[0], userLocation[1]], 14, { duration: 1.2 });
      return;
    }

    const coords = await requestUserLocation();
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([coords[0], coords[1]], 14, { duration: 1.2 });
    } else {
      handleResetCenter();
    }
  }, [userLocation, requestUserLocation, handleResetCenter]);

  // Handle user location marker
  useEffect(() => {
    if (!mapReady || !userMarkerLayerRef.current || !mapInstanceRef.current) return;
    userMarkerLayerRef.current.clearLayers();

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
            <div style="position: absolute; width: 32px; height: 32px; background: rgba(37, 99, 235, 0.3); border-radius: 9999px; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; background: #2563eb; border: 3px solid white; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); position: relative; z-index: 2;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userMarker = L.marker([userLocation[0], userLocation[1]], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; font-weight: 700; color: #1e293b; padding: 4px 6px; text-align: center;">
          📍 ${translations.yourLocation || 'Sizning joylashuvingiz'}
        </div>
      `);
      userMarkerLayerRef.current.addLayer(userMarker);
    }
  }, [userLocation, mapReady, translations]);

  // Handle markers update
  useEffect(() => {
    if (!mapReady || !markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredFields.forEach((field) => {
      const [coord1, coord2] = field.coordinates;
      // Latitude is ~41, Longitude is ~69
      const lat = coord1 < 50 ? coord1 : coord2;
      const lng = coord1 > 50 ? coord1 : coord2;

      const isAvailable = field.available ?? true;
      const pinColor = isAvailable ? '#10b981' : '#f43f5e';
      const hasImage = field.images && field.images.length > 0 && field.images[0];
      const thumbnail = hasImage
        ? field.images[0]
        : 'https://images.unsplash.com/photo-1579952363873-27f3bade9e55?w=300';

      const customIcon = L.divIcon({
        className: 'field-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background-color: ${pinColor}; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: 700; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
              <span>⚽</span>
              <span>${field.price >= 1000 ? (field.price / 1000).toFixed(0) + 'k' : field.price}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid ${pinColor}; margin-top: -1px;"></div>
          </div>
        `,
        iconSize: [60, 36],
        iconAnchor: [30, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const dist = userLocation ? calculateDistance(userLocation[0], userLocation[1], lat, lng) : null;

      const popupHtml = `
        <div style="width: 220px; font-family: inherit;">
          <div style="height: 110px; width: 100%; border-radius: 12px; overflow: hidden; position: relative; margin-bottom: 8px;">
            <img src="${thumbnail}" alt="${field.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.65); color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 600;">
              ${translations[field.fieldType] || field.fieldType}
            </div>
            <div style="position: absolute; top: 6px; right: 6px; background: rgba(255,255,255,0.95); color: #0f172a; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 700;">
              ★ ${field.rating.toFixed(1)}
            </div>
          </div>
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 2px 0; color: #0f172a; line-height: 1.2;">
            ${field.name}
          </h4>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 4px 0;">
            ${field.district} • ${field.size}
          </p>
          ${dist !== null ? `
            <div style="display: inline-flex; align-items: center; gap: 4px; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; margin-bottom: 6px;">
              <span>📍</span>
              <span>${translations.distanceFromYou || 'Sizdan'} ${dist} km</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div>
              <span style="font-size: 13px; font-weight: 800; color: #059669;">
                ${field.price.toLocaleString()} UZS
              </span>
              <span style="font-size: 10px; color: #94a3b8; display: block;">${translations.perHourShort || '/ soat'}</span>
            </div>
            <button
              id="map-btn-${field.id}"
              style="background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);"
            >
              ${isLoggedIn ? (translations.book || 'Band qilish') : (translations.register || 'Ro‘yxatdan o‘tish')}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260, className: 'modern-field-popup' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-btn-${field.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onFieldClick) {
              onFieldClick(field);
            } else {
              setSelectedFieldForModal(field);
            }
          };
        }
      });

      if (markersLayerRef.current) {
        markersLayerRef.current.addLayer(marker);
      }
    });
  }, [filteredFields, mapReady, onFieldClick, translations, isLoggedIn, userLocation]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft bg-white">
      {/* Map Control bar */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2">
        <button
          onClick={handleResetCenter}
          title={translations.resetMapCenter || 'Toshkent markaziga qaytish'}
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 text-slate-700 hover:text-brand-600 hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Compass className="h-5 w-5" />
        </button>
        <button
          onClick={handleLocateMe}
          title={translations.myLocation || 'Mening joylashuvim'}
          className={`p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 text-slate-700 hover:text-brand-600 hover:bg-white transition-all active:scale-95 cursor-pointer ${
            isLocating ? 'text-brand-600 ring-2 ring-brand-500 ring-offset-1' : ''
          }`}
        >
          <Navigation className={`h-5 w-5 ${isLocating ? 'animate-spin text-brand-600' : ''}`} />
        </button>
      </div>

      {/* Interactive Map Header Badge */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200/60 flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-bold text-slate-800">
          {filteredFields.length} ta maydon xaritada
        </span>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="h-[460px] sm:h-[540px] md:h-[620px] w-full z-0"
      />

      {/* Fallback internal details modal if onFieldClick wasn't supplied */}
      {selectedFieldForModal && (
        <div style={{ display: 'none' }}>{/* Handled by parent */}</div>
      )}
    </div>
  );
};

export default MapView;
