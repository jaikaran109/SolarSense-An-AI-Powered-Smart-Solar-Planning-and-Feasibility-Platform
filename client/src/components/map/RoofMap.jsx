import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import {
  MapPin,
  RotateCcw,
  Undo2,
  Check,
  Search,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Eye
} from 'lucide-react';

const DEFAULT_CENTER = [27.18, 78.02]; // Agra
const DEFAULT_ZOOM = 18;

const CITIES = [
  { name: 'Agra', lat: 27.18, lon: 78.02 },
  { name: 'Delhi NCR', lat: 28.6139, lon: 77.209 },
  { name: 'Noida', lat: 28.5355, lon: 77.391 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 }
];

const PRESET_SHAPES = [
  { label: 'Terrace (18 m²)', area: 18, radiusMeters: 2.4 },
  { label: 'Standard (32 m²)', area: 32, radiusMeters: 3.2 },
  { label: 'Spacious (55 m²)', area: 55, radiusMeters: 4.2 },
  { label: 'Large Villa (90 m²)', area: 90, radiusMeters: 5.4 }
];

export default function RoofMap({ onAreaCalculated, initialArea = 0 }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const polygonLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [area, setArea] = useState(initialArea);
  const [isFinalized, setIsFinalized] = useState(initialArea > 0);
  const [activeLayer, setActiveLayer] = useState('satellite'); // 'satellite' | 'street'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [drawMode, setDrawMode] = useState(true);

  // Keep a stable ref to onAreaCalculated callback to avoid re-triggering map useEffect
  const onAreaCalculatedRef = useRef(onAreaCalculated);
  useEffect(() => {
    onAreaCalculatedRef.current = onAreaCalculated;
  }, [onAreaCalculated]);

  // Recalculate area via Turf.js
  const computeAndBroadcastArea = useCallback((pts) => {
    if (!pts || pts.length < 3) {
      setArea(0);
      setIsFinalized(false);
      if (onAreaCalculatedRef.current) onAreaCalculatedRef.current(0);
      return;
    }

    try {
      // Turf expects [longitude, latitude] and first == last
      const coordinates = pts.map(p => [p.lng, p.lat]);
      coordinates.push([pts[0].lng, pts[0].lat]); // close ring

      const polygon = turf.polygon([coordinates]);
      const calculatedM2 = Number(turf.area(polygon).toFixed(1));
      
      setArea(calculatedM2);
      setIsFinalized(true);
      if (onAreaCalculatedRef.current) onAreaCalculatedRef.current(calculatedM2);
    } catch (err) {
      console.warn('Error calculating turf area:', err);
    }
  }, []);

  // Initialize Leaflet Map Once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    // Add Zoom Control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Satellite Tile Layer
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        maxNativeZoom: 18,
        crossOrigin: true
      }
    ).addTo(map);
    tileLayerRef.current = satelliteLayer;

    // Layer groups for markers & polygon
    const polygonGroup = L.featureGroup().addTo(map);
    const markersGroup = L.featureGroup().addTo(map);
    polygonLayerRef.current = polygonGroup;
    markersGroupRef.current = markersGroup;

    mapRef.current = map;

    // Click handler to drop rooftop points
    map.on('click', (e) => {
      setPoints((prev) => {
        const nextPoints = [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }];
        return nextPoints;
      });
    });

    // Ensure map container size is accurate after render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Polygon & Markers whenever `points` changes
  useEffect(() => {
    if (!mapRef.current || !polygonLayerRef.current || !markersGroupRef.current) return;

    polygonLayerRef.current.clearLayers();
    markersGroupRef.current.clearLayers();

    if (points.length === 0) {
      computeAndBroadcastArea([]);
      return;
    }

    // Add custom number markers for vertices
    points.forEach((pt, index) => {
      const isFirst = index === 0;
      const isLast = index === points.length - 1;

      const markerHtml = `
        <div style="
          background: ${isFirst ? '#10b981' : isLast ? '#06b6d4' : '#0f172a'};
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        ">
          ${index + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-roof-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon });
      markersGroupRef.current.addLayer(marker);
    });

    // Draw connecting lines or completed polygon
    const latLngs = points.map(p => [p.lat, p.lng]);

    if (points.length >= 3) {
      const poly = L.polygon(latLngs, {
        color: '#10b981',
        weight: 3,
        opacity: 0.9,
        fillColor: '#10b981',
        fillOpacity: 0.35,
        dashArray: '4, 6'
      });
      polygonLayerRef.current.addLayer(poly);
      computeAndBroadcastArea(points);
    } else if (points.length === 2) {
      const line = L.polyline(latLngs, {
        color: '#10b981',
        weight: 3,
        dashArray: '4, 4'
      });
      polygonLayerRef.current.addLayer(line);
      computeAndBroadcastArea([]);
    }
  }, [points, computeAndBroadcastArea]);

  // Switch Tile Layer (Satellite vs Street)
  const handleLayerChange = (type) => {
    if (!mapRef.current) return;
    setActiveLayer(type);

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    if (type === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, maxNativeZoom: 18 }
      ).addTo(mapRef.current);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      ).addTo(mapRef.current);
    }
  };

  // Undo Last Point
  const handleUndo = () => {
    if (points.length === 0) return;
    const nextPoints = points.slice(0, -1);
    setPoints(nextPoints);
  };

  // Clear Roof Polygon
  const handleClear = () => {
    setPoints([]);
    setArea(0);
    setIsFinalized(false);
    if (onAreaCalculatedRef.current) onAreaCalculatedRef.current(0);
  };

  // Apply Quick Rooftop Preset
  const handleApplyPreset = (preset) => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const lat = center.lat;
    const lng = center.lng;

    // Convert meters to approximate lat/lng offset
    const latOffset = (preset.radiusMeters / 111320);
    const lngOffset = (preset.radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180)));

    const rectPoints = [
      { lat: lat + latOffset, lng: lng - lngOffset },
      { lat: lat + latOffset, lng: lng + lngOffset },
      { lat: lat - latOffset, lng: lng + lngOffset },
      { lat: lat - latOffset, lng: lng - lngOffset }
    ];

    setPoints(rectPoints);
  };

  // Search Address or Locality via OpenStreetMap Nominatim
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        if (mapRef.current) {
          mapRef.current.flyTo([parseFloat(lat), parseFloat(lon)], 18, { duration: 1.5 });
        }
      } else {
        setSearchError('Location not found. Try searching city or landmark.');
      }
    } catch (err) {
      setSearchError('Search service temporary unavailable.');
    } finally {
      setIsSearching(false);
    }
  };

  // Quick City Navigation
  const handleFlyToCity = (lat, lon) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 18, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
      {/* Top Search & Controls Bar */}
      <div className="p-4 bg-slate-900 text-white border-b border-slate-800 space-y-3">
        {/* Search Form */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your city, sector, or colony (e.g., Sector 62 Noida, Indira Nagar Lucknow)..."
              className="w-full pl-9 pr-24 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              {isSearching ? 'Locating...' : 'Search'}
            </button>
          </form>

          {/* Map Layer Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleLayerChange('satellite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLayer === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => handleLayerChange('street')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLayer === 'street'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Street
            </button>
          </div>
        </div>

        {searchError && (
          <p className="text-xs text-rose-400 font-medium">{searchError}</p>
        )}

        {/* Quick Indian Cities */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" /> Jump to:
          </span>
          {CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleFlyToCity(c.lat, c.lon)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700/60 transition-colors"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '480px' }}
          className="z-0 bg-slate-950"
        />

        {/* Floating Drawing Guide Overlay */}
        <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-slate-700 shadow-xl max-w-xs text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Roof Tracing</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {points.length === 0
              ? 'Click anywhere on your rooftop to drop Corner 1.'
              : points.length < 3
              ? `Corner ${points.length} placed. Click ${3 - points.length} more corner(s) to close the shape.`
              : `Boundary active (${points.length} corners marked). Area computed via Turf.js.`}
          </p>
        </div>

        {/* Floating Action Controls */}
        <div className="absolute bottom-4 right-4 z-[400] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-2xl">
          <button
            type="button"
            onClick={handleUndo}
            disabled={points.length === 0}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Undo Last Corner"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={points.length === 0}
            className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white disabled:opacity-40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-800/40"
            title="Clear Boundary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Preset Rooftop Quick Selection & Output Bar */}
      <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Quick Rooftop Presets */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Quick Presets:
          </span>
          {PRESET_SHAPES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Live Calculated Area Output */}
        <div className="flex items-center gap-3 self-end sm:self-auto bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Marked Usable Area (Turf.js)
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-400">
              {area > 0 ? `${area.toFixed(1)} m²` : '0.0 m²'}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                (≈ {(area * 10.7639).toFixed(0)} sq ft)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
