import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FootballField } from '../../types';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface MapViewProps {
  onFieldClick?: (field: FootballField) => void;
}

const TASHKENT_CENTER: [number, number] = [41.2995, 69.2401];

const MapView: React.FC<MapViewProps> = ({ onFieldClick }) => {
  const { filteredFields } = useApp();
  const { translations } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
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
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Center to Tashkent
  const handleResetCenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(TASHKENT_CENTER, 12, { duration: 1 });
    }
  }, []);

  // Geolocation to user
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.2 });
        }
      },
      (err) => {
        console.warn('Geolocation denied or unavailable', err);
        handleResetCenter();
      }
    );
  }, [handleResetCenter]);

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

      const popupHtml = `
        <div style="width: 220px; font-family: inherit;">
          <div style="height: 110px; width: 100%; border-radius: 12px; overflow: hidden; position: relative; margin-bottom: 8px;">
            <img src="${thumbnail}" alt="${field.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.65); color: white; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 600;">
              ${field.fieldType}
            </div>
            <div style="position: absolute; top: 6px; right: 6px; background: rgba(255,255,255,0.95); color: #0f172a; padding: 2px 6px; border-radius: 6px; font-size: 10px; font-weight: 700;">
              ★ ${field.rating.toFixed(1)}
            </div>
          </div>
          <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 2px 0; color: #0f172a; line-height: 1.2;">
            ${field.name}
          </h4>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0;">
            ${field.district} • ${field.size}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div>
              <span style="font-size: 13px; font-weight: 800; color: #059669;">
                ${field.price.toLocaleString()} UZS
              </span>
              <span style="font-size: 10px; color: #94a3b8; display: block;">/ soat</span>
            </div>
            <button
              id="map-btn-${field.id}"
              style="background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);"
            >
              ${translations.details || 'Batafsil'}
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
  }, [filteredFields, mapReady, onFieldClick, translations]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-soft bg-white">
      {/* Map Control bar */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-2">
        <button
          onClick={handleResetCenter}
          title="Toshkent markaziga qaytish"
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 text-slate-700 hover:text-brand-600 hover:bg-white transition-all active:scale-95"
        >
          <Compass className="h-5 w-5" />
        </button>
        <button
          onClick={handleLocateMe}
          title="Mening joylashuvim"
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 text-slate-700 hover:text-brand-600 hover:bg-white transition-all active:scale-95"
        >
          <Navigation className="h-5 w-5" />
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
