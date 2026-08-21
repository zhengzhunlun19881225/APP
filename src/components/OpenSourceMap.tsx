import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { OPEN_SOURCE_TILE_PROVIDERS, TileProvider } from '../utils/geoData';

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category?: string;
  count?: number; // For clusters (e.g. 18, 24, 99+, 123)
  iconType?: 'cluster' | 'risk' | 'camera' | 'surveillanceCamera' | 'surveillanceCluster' | 'personnel' | 'truck' | 'hospital' | 'warehouse' | 'shelter' | 'fire' | 'police' | 'hotel' | 'pin';
  status?: 'high' | 'medium' | 'low' | 'normal' | 'online' | 'warning' | 'offline';
  cameraColor?: 'teal' | 'orange' | 'grey';
  rawCameraData?: any;
  details?: {
    address?: string;
    subtext?: string;
    peopleCount?: number;
    headName?: string;
    phone?: string;
    actionLabel?: string;
  };
}

export interface MapPolygonData {
  id: string;
  coordinates: [number, number][];
  name: string;
  level: 'high' | 'medium' | 'low';
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  label?: string;
}

export interface MapCircleData {
  center: [number, number];
  radius: number; // in meters
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
}

export interface OpenSourceMapProps {
  center: [number, number];
  zoom?: number;
  tileProviderId?: string;
  markers?: MapMarkerData[];
  polygons?: MapPolygonData[];
  circle?: MapCircleData | null;
  showTraffic?: boolean;
  showUserLocation?: boolean;
  userLocation?: [number, number];
  interactive?: boolean;
  onMarkerClick?: (marker: MapMarkerData) => void;
  onPolygonClick?: (polygon: MapPolygonData) => void;
  onMoveEnd?: (center: [number, number], zoom: number) => void;
  onMapReady?: (map: L.Map) => void;
  showMarkerLabels?: boolean;
  className?: string;
}

export const OpenSourceMap: React.FC<OpenSourceMapProps> = ({
  center,
  zoom = 13,
  tileProviderId = 'cartoVoyager',
  markers = [],
  polygons = [],
  circle = null,
  showTraffic = false,
  showUserLocation = true,
  userLocation = [22.5431, 114.0579],
  interactive = true,
  onMarkerClick,
  onPolygonClick,
  onMoveEnd,
  onMapReady,
  showMarkerLabels = true,
  className = 'w-full h-full'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const trafficLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false, // We provide custom styled controls
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive
      });

      // Default tile provider
      const provider: TileProvider = OPEN_SOURCE_TILE_PROVIDERS[tileProviderId] || OPEN_SOURCE_TILE_PROVIDERS.cartoVoyager;
      const tileLayer = L.tileLayer(provider.url, {
        maxZoom: provider.maxZoom || 18,
        subdomains: provider.subdomains || ['1', '2', '3', '4']
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      polygonsLayerGroupRef.current = L.layerGroup().addTo(map);
      trafficLayerGroupRef.current = L.layerGroup().addTo(map);

      map.on('moveend', () => {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();
        onMoveEnd?.([currentCenter.lat, currentCenter.lng], currentZoom);
      });

      mapRef.current = map;
      onMapReady?.(map);

      // Force recalculate dimensions after rendering in tabs/modals
      setTimeout(() => {
        map.invalidateSize();
      }, 60);
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }

    // Resize observer to ensure full responsiveness
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 2. Handle Center & Zoom change
  useEffect(() => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const distance = Math.sqrt(
        Math.pow(currentCenter.lat - center[0], 2) + Math.pow(currentCenter.lng - center[1], 2)
      );
      if (distance > 0.0001 || mapRef.current.getZoom() !== zoom) {
        mapRef.current.setView(center, zoom, { animate: true });
      }
    }
  }, [center[0], center[1], zoom]);

  // 3. Handle Tile Provider change
  useEffect(() => {
    if (!mapRef.current) return;
    const provider = OPEN_SOURCE_TILE_PROVIDERS[tileProviderId] || OPEN_SOURCE_TILE_PROVIDERS.cartoVoyager;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const newTileLayer = L.tileLayer(provider.url, {
      maxZoom: provider.maxZoom || 18,
      subdomains: provider.subdomains || ['1', '2', '3', '4']
    }).addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;
    newTileLayer.bringToBack();
  }, [tileProviderId]);

  // 4. Render Markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerGroupRef.current) return;
    markersLayerGroupRef.current.clearLayers();

    markers.forEach((m) => {
      let iconHtml = '';
      let iconSize: [number, number] = [36, 36];
      let iconAnchor: [number, number] = [18, 18];

      if (m.iconType === 'cluster') {
        // Matches cluster bubble from 1.1地图.png (18, 24, 99+, 2)
        const isLarge = (m.count || 0) >= 50;
        const bgColor = isLarge ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white';
        const ringColor = isLarge ? 'ring-amber-200/60' : 'ring-blue-200/60';
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group transition-transform hover:scale-110">
            <div class="w-10 h-10 rounded-full ${bgColor} flex items-center justify-center font-bold text-sm shadow-md ring-4 ${ringColor} border-2 border-white">
              ${m.count !== undefined ? m.count : '1'}
            </div>
            ${showMarkerLabels && m.title ? `<div class="absolute -bottom-5 whitespace-nowrap bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-slate-200">${m.title}</div>` : ''}
          </div>
        `;
        iconSize = [40, 40];
        iconAnchor = [20, 20];
      } else if (m.iconType === 'risk') {
        // High risk warning marker (e.g. 南悦花苑)
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer group">
            ${showMarkerLabels ? `
              <div class="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                ${m.title}
              </div>
              <div class="w-2.5 h-2.5 bg-red-600 rotate-45 -mt-1 shadow-sm border-r border-b border-white"></div>
            ` : ''}
            <div class="w-7 h-7 rounded-full bg-red-50 border-2 border-red-600 flex items-center justify-center -mt-1 shadow-md">
              <svg class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>
        `;
        iconSize = showMarkerLabels ? [90, 60] : [36, 36];
        iconAnchor = showMarkerLabels ? [45, 60] : [18, 18];
      } else if (m.iconType === 'surveillanceCluster') {
        // Matches surveillance cluster marker from 1.1地图.png (Camera icon + Count in dark circular badge with amber rim)
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group transition-transform hover:scale-110">
            <div class="w-11 h-11 rounded-full bg-[#1e293b] text-white flex flex-col items-center justify-center font-bold shadow-xl ring-[3px] ring-amber-400 border-2 border-white">
              <div class="flex items-center gap-0.5 leading-none">
                <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>
                </svg>
                <span class="text-[12px] font-black text-white font-mono">${m.count || '123'}</span>
              </div>
            </div>
            ${showMarkerLabels && m.title ? `<div class="absolute -bottom-5 whitespace-nowrap bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-slate-200">${m.title}</div>` : ''}
          </div>
        `;
        iconSize = [44, 44];
        iconAnchor = [22, 22];
      } else if (m.iconType === 'surveillanceCamera' || m.iconType === 'camera') {
        // Individual camera circular marker (Yellow for warning/alert, Green for online/normal, Grey for offline)
        // Clean circular icon without label or pointer arrow
        const isWarning = m.status === 'warning' || m.cameraColor === 'orange';
        const isOffline = m.status === 'offline' || m.cameraColor === 'grey';
        const bgGrad = isWarning
          ? 'bg-[#eab308]' // Yellow / Amber #eab308
          : isOffline
          ? 'bg-[#64748b]'
          : 'bg-[#10b981]'; // Green / Emerald #10b981

        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group hover:scale-115 active:scale-95 transition-transform">
            <div class="w-8.5 h-8.5 rounded-full ${bgGrad} text-white flex items-center justify-center shadow-lg border-2 border-white ring-1.5 ring-black/15">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>
              </svg>
            </div>
          </div>
        `;
        iconSize = [36, 36];
        iconAnchor = [18, 18];
      } else if (m.iconType === 'truck' || m.iconType === 'warehouse') {
        // Emergency Trucks / Logistics Warehouse
        const isTruck = m.iconType === 'truck';
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <div class="w-8 h-8 rounded-full ${isTruck ? 'bg-amber-500 ring-amber-200' : 'bg-emerald-600 ring-emerald-200'} text-white flex items-center justify-center shadow-md border-2 border-white ring-2">
              ${isTruck ? `
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
                </svg>
              ` : `
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              `}
            </div>
            ${showMarkerLabels && m.title ? `<div class="bg-white/95 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200 mt-1 whitespace-nowrap">${m.title}</div>` : ''}
          </div>
        `;
        iconSize = showMarkerLabels ? [70, 48] : [36, 36];
        iconAnchor = showMarkerLabels ? [35, 20] : [18, 18];
      } else if (m.iconType === 'hospital') {
        // Medical Hospital
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <div class="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md border-2 border-white ring-2 ring-rose-200">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 6v12"/><path d="M6 12h12"/>
              </svg>
            </div>
            ${showMarkerLabels && m.title ? `<div class="bg-white/95 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200 mt-1 whitespace-nowrap">${m.title}</div>` : ''}
          </div>
        `;
        iconSize = showMarkerLabels ? [70, 48] : [36, 36];
        iconAnchor = showMarkerLabels ? [35, 20] : [18, 18];
      } else {
        // Standard Pin
        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white ring-2 ring-blue-200">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            ${showMarkerLabels && m.title ? `<div class="bg-white/95 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200 mt-0.5 whitespace-nowrap">${m.title}</div>` : ''}
          </div>
        `;
        iconSize = showMarkerLabels ? [60, 44] : [36, 36];
        iconAnchor = showMarkerLabels ? [30, 20] : [18, 18];
      }

      const customDivIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-div-icon',
        iconSize,
        iconAnchor
      });

      const marker = L.marker([m.lat, m.lng], { icon: customDivIcon });

      if (m.details || m.title) {
        const popupContent = `
          <div class="p-2.5 max-w-[200px] text-slate-800 font-sans">
            <div class="font-bold text-[14px] text-slate-900 leading-tight">${m.title}</div>
            ${m.category ? `<div class="text-[11px] text-blue-600 font-medium mt-0.5">${m.category}</div>` : ''}
            ${m.details?.address ? `<div class="text-[12px] text-slate-500 mt-1 leading-snug">${m.details.address}</div>` : ''}
            ${m.details?.peopleCount ? `<div class="text-[12px] text-slate-700 font-semibold mt-1">涉及人员：${m.details.peopleCount}人</div>` : ''}
            ${m.details?.headName ? `<div class="text-[12px] text-slate-600 mt-0.5">负责人：${m.details.headName}</div>` : ''}
            <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
              <span class="text-blue-600 font-semibold cursor-pointer">导航到此</span>
              <span class="text-slate-400">|</span>
              <span class="text-blue-600 font-semibold cursor-pointer">查看详情</span>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, {
          closeButton: true,
          className: 'custom-leaflet-popup'
        });
      }

      marker.on('click', () => {
        onMarkerClick?.(m);
      });

      markersLayerGroupRef.current?.addLayer(marker);
    });
  }, [markers, showMarkerLabels]);

  // 5. Render Polygons (Risk Zones, Controlled Areas)
  useEffect(() => {
    if (!mapRef.current || !polygonsLayerGroupRef.current) return;
    polygonsLayerGroupRef.current.clearLayers();

    polygons.forEach((poly) => {
      const isHigh = poly.level === 'high';
      const isMedium = poly.level === 'medium';
      const strokeColor = poly.color || (isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#3b82f6');
      const fillColor = poly.fillColor || (isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#3b82f6');

      const leafletPoly = L.polygon(poly.coordinates, {
        color: strokeColor,
        weight: 2.5,
        dashArray: isHigh ? '4, 4' : undefined,
        fillColor: fillColor,
        fillOpacity: poly.fillOpacity ?? 0.25
      });

      leafletPoly.bindPopup(`
        <div class="p-2 font-sans">
          <div class="text-xs font-bold text-slate-900">${poly.name}</div>
          <div class="text-[11px] ${isHigh ? 'text-red-600' : 'text-amber-600'} font-medium mt-0.5">
            ${isHigh ? '高风险防汛隐患区' : isMedium ? '中风险防汛隐患区' : '重点防范区'}
          </div>
        </div>
      `);

      leafletPoly.on('click', () => {
        onPolygonClick?.(poly);
      });

      polygonsLayerGroupRef.current?.addLayer(leafletPoly);
    });
  }, [polygons]);

  // 6. Render Buffer Circle
  useEffect(() => {
    if (!mapRef.current) return;
    if (circleLayerRef.current) {
      mapRef.current.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }

    if (circle) {
      const circleLayer = L.circle(circle.center, {
        radius: circle.radius,
        color: circle.color || '#3b82f6',
        weight: 2,
        dashArray: '6, 6',
        fillColor: circle.fillColor || '#3b82f6',
        fillOpacity: circle.fillOpacity ?? 0.12
      }).addTo(mapRef.current);

      circleLayerRef.current = circleLayer;
    }
  }, [circle]);

  // 7. Render Real-time Traffic Simulation Lines
  useEffect(() => {
    if (!mapRef.current || !trafficLayerGroupRef.current) return;
    trafficLayerGroupRef.current.clearLayers();

    if (showTraffic) {
      // Simulate real-time major arterial highway traffic overlays
      const trafficRoutes: { coords: [number, number][]; color: string; weight: number }[] = [
        // Route 1 - Heavy traffic (Red)
        {
          coords: [
            [22.565, 113.91],
            [22.552, 113.935],
            [22.545, 113.96],
            [22.543, 113.99]
          ],
          color: '#ef4444',
          weight: 4
        },
        // Route 2 - Moderate traffic (Yellow)
        {
          coords: [
            [22.53, 113.92],
            [22.535, 113.945],
            [22.541, 113.975],
            [22.549, 114.02]
          ],
          color: '#f59e0b',
          weight: 4
        },
        // Route 3 - Smooth traffic (Green)
        {
          coords: [
            [22.58, 113.94],
            [22.565, 113.96],
            [22.55, 113.98],
            [22.54, 114.01]
          ],
          color: '#10b981',
          weight: 4
        }
      ];

      trafficRoutes.forEach((route) => {
        const polyline = L.polyline(route.coords, {
          color: route.color,
          weight: route.weight,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        });
        trafficLayerGroupRef.current?.addLayer(polyline);
      });
    }
  }, [showTraffic]);

  // 8. User Current GPS Marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (showUserLocation && userLocation) {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-blue-500/30 animate-ping absolute"></div>
          <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg relative z-10"></div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: 'user-loc-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker(userLocation as L.LatLngTuple, { icon: userIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
      userMarker.bindPopup('<div class="text-xs font-bold text-slate-800 p-1">📍 您的当前位置</div>');
      userMarkerRef.current = userMarker;
    }
  }, [showUserLocation, userLocation]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0" />
      <style>{`
        .custom-map-div-icon {
          background: transparent;
          border: none;
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          padding: 0;
          border: 1px solid rgba(226, 232, 240, 0.9);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }
        .leaflet-container {
          font-family: inherit;
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
};
