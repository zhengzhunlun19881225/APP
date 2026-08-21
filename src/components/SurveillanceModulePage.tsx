import React, { useState, useRef } from 'react';
import {
  Search,
  ChevronLeft,
  X,
  ListVideo,
  Plus,
  Minus,
  Crosshair,
  Globe,
  Check,
  Video,
  Play,
  Star,
  Flag,
  Info,
  SlidersHorizontal,
  Signal,
  Radio
} from 'lucide-react';
import { OpenSourceMap, MapMarkerData } from './OpenSourceMap';
import { SurveillanceDrawer } from './SurveillanceDrawer';
import { SurveillanceModal } from './SurveillanceModal';
import { SurveillanceFullscreenModal } from './SurveillanceFullscreenModal';
import {
  SURVEILLANCE_CAMERAS,
  SurveillanceCamera
} from '../data/surveillanceData';
import { SELECTABLE_TILE_PROVIDERS } from '../utils/geoData';
import L from 'leaflet';

interface SurveillanceModulePageProps {
  onBack: () => void;
}

export const SurveillanceModulePage: React.FC<SurveillanceModulePageProps> = ({ onBack }) => {
  // Map View States
  const [center, setCenter] = useState<[number, number]>([22.5488, 114.0556]); // Centered around Shenzhen Futian
  const [zoom, setZoom] = useState<number>(14);
  const [activeTileId, setActiveTileId] = useState<string>('cartoVoyager');
  const [showTileSelector, setShowTileSelector] = useState(false);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Search State in Monitoring Module
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSearchResult, setSelectedSearchResult] = useState<SurveillanceCamera | null>(null);

  // Drawer and Detail Modal States
  const [showSurveillanceDrawer, setShowSurveillanceDrawer] = useState(true); // Default open as in design mockups
  const [activeSurveillanceCamera, setActiveSurveillanceCamera] = useState<SurveillanceCamera | null>(null);
  const [selectedMapCamera, setSelectedMapCamera] = useState<SurveillanceCamera | null>(null);
  const [isFullscreenSurveillance, setIsFullscreenSurveillance] = useState(false);
  const [favoriteCameraIds, setFavoriteCameraIds] = useState<Set<string>>(
    new Set(['cam-shenda', 'cam-yx-4', 'cam-sz-baoan'])
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleFavorite = (camId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteCameraIds((prev) => {
      const next = new Set(prev);
      if (next.has(camId)) {
        next.delete(camId);
        triggerToast('已取消收藏该监控');
      } else {
        next.add(camId);
        triggerToast('已添加至收藏列表');
      }
      return next;
    });
  };

  // Map Zoom & Locate handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    } else {
      setZoom((z) => Math.min(z + 1, 18));
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    } else {
      setZoom((z) => Math.max(z - 1, 4));
    }
  };

  const handleLocateMe = () => {
    const userLoc: [number, number] = [22.5488, 114.0556];
    setCenter(userLoc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userLoc, 15, { duration: 1 });
    }
    triggerToast('已定位至当前区域');
  };

  const handleLocateCamera = (camera: SurveillanceCamera) => {
    const loc: [number, number] = [camera.lat, camera.lng];
    setCenter(loc);
    setZoom(16);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc, 16, { duration: 0.8 });
    }
    setSelectedMapCamera(camera);
    triggerToast(`已定位到监控：${camera.name}`);
  };

  // Assemble ONLY surveillance camera markers (Green for Online, Yellow for Warning)
  const mapMarkers: MapMarkerData[] = SURVEILLANCE_CAMERAS.map((cam) => {
    const isWarning = cam.status === 'warning';
    // Green (online/normal) or Yellow (warning)
    const cameraColor: 'teal' | 'orange' | 'grey' = isWarning ? 'orange' : 'teal';

    return {
      id: `marker-${cam.id}`,
      lat: cam.lat,
      lng: cam.lng,
      title: cam.name,
      category: `视频监控 · ${cam.type}`,
      iconType: 'surveillanceCamera',
      status: isWarning ? 'warning' : 'online',
      cameraColor,
      rawCameraData: cam,
      details: {
        address: cam.address,
        subtext: `监控编码: ${cam.code}`
      }
    };
  });

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] flex flex-col overflow-hidden select-none">
      {/* Toast Alert Notice */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md animate-in fade-in flex items-center gap-1.5 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* 1. Top Search Bar with Back Button (搜索框左边加返回按钮) */}
      {!isSearchOpen ? (
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-2">
          {/* Back Button to return to Homepage/Dashboard */}
          <button
            onClick={onBack}
            className="system-back-button"
            title="返回工作台"
          >
            <ChevronLeft />
          </button>

          {/* Search Box Input Trigger */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 h-11 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 px-3.5 flex items-center gap-2.5 cursor-pointer hover:bg-white transition-all"
          >
            <Search className="w-4 h-4 text-slate-400 stroke-[2.5]" />
            <span className="text-[13px] text-slate-500 font-medium truncate">
              {selectedSearchResult ? selectedSearchResult.name : '搜索地点、应急场所、监控探头'}
            </span>
          </div>

          {/* Open-Source Tile Switcher Button */}
          <button
            onClick={() => setShowTileSelector((v) => !v)}
            title="切换开源底图图源"
            className="h-11 w-11 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-all cursor-pointer flex-shrink-0"
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Fullscreen Search Mode */
        <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-150">
          <div className="h-14 border-b border-slate-100 px-3 flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                autoFocus
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索监控探头名称、点位地址或国标编号"
                className="w-full h-10 pl-3.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {SURVEILLANCE_CAMERAS.filter(
              (c) =>
                !searchKeyword.trim() ||
                c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                c.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                c.code.includes(searchKeyword)
            ).map((cam) => (
              <div
                key={cam.id}
                onClick={() => {
                  setSelectedSearchResult(cam);
                  setSelectedMapCamera(cam);
                  setIsSearchOpen(false);
                  setCenter([cam.lat, cam.lng]);
                  setZoom(16);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([cam.lat, cam.lng], 16, { duration: 0.8 });
                  }
                  triggerToast(`已在地图定位监控：${cam.name}`);
                }}
                className="px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                    cam.status === 'warning' ? 'bg-amber-500' : 'bg-teal-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-slate-800 truncate flex items-center gap-2">
                    <span>{cam.name}</span>
                    <span className="text-[11px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                      {cam.type}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        cam.status === 'warning'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-teal-50 text-teal-600'
                      }`}
                    >
                      {cam.status === 'warning' ? '预警状态' : '正常在线'}
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5 truncate">{cam.address}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{cam.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open-Source Tile Layer Selection Popup */}
      {showTileSelector && (
        <div className="absolute top-16 right-3 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-3 w-64 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              底图图源切换
            </div>
            <button
              onClick={() => setShowTileSelector(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            {SELECTABLE_TILE_PROVIDERS.map((tp) => (
              <button
                key={tp.id}
                onClick={() => {
                  setActiveTileId(tp.id);
                  setShowTileSelector(false);
                  triggerToast(`已切换至【${tp.name}】底图`);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  activeTileId === tp.id
                    ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{tp.name}</span>
                {activeTileId === tp.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Map Viewport (Rendering ONLY Surveillance Camera Markers) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <OpenSourceMap
          center={center}
          zoom={zoom}
          tileProviderId={activeTileId}
          markers={mapMarkers}
          polygons={[]}
          showTraffic={false}
          showUserLocation={true}
          userLocation={[22.5488, 114.0556]}
          onMapReady={(map) => {
            mapInstanceRef.current = map;
          }}
          onMoveEnd={(newCenter, newZoom) => {
            setCenter(newCenter);
            setZoom(newZoom);
          }}
          onMarkerClick={(marker) => {
            if (marker.rawCameraData) {
              setSelectedMapCamera(marker.rawCameraData);
              setShowSurveillanceDrawer(false);
            }
          }}
        />
      </div>

      {/* 3. Floating Quick Action Controls (Right Sidebar - NO layers & traffic buttons) */}
      <div className="absolute right-3 top-20 z-20 flex flex-col gap-2.5 items-end">
        {/* Surveillance Drawer Toggle Button */}
        <button
          onClick={() => {
            setShowSurveillanceDrawer((prev) => !prev);
            setSelectedMapCamera(null);
          }}
          title="监控目录与区划列表"
          className="w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
        >
          <ListVideo className="w-5 h-5" />
        </button>

        {/* Zoom In & Out Controls */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          <button
            onClick={handleZoomIn}
            title="放大"
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="缩小"
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Locate Me Button */}
        <button
          onClick={handleLocateMe}
          title="定位到我的位置"
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-all cursor-pointer"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* 4. Clicked Surveillance Camera Bottom Card (Matches Image 1 style precisely) */}
      {selectedMapCamera && !showSurveillanceDrawer && !activeSurveillanceCamera && (
        <div
          onClick={() => setActiveSurveillanceCamera(selectedMapCamera)}
          className="absolute bottom-5 left-3 right-3 z-30 bg-white rounded-2xl shadow-xl border border-slate-200/90 px-4 py-3.5 animate-in slide-in-from-bottom-3 duration-200 cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left: Circular Video Camera Icon (Green for online, Yellow for warning) */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs ${
                selectedMapCamera.status === 'warning' ? 'bg-[#eab308]' : 'bg-[#00b074]'
              }`}
            >
              <Video className="w-5 h-5 fill-current" />
            </div>

            {/* Middle: Name and Address */}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-[15px] font-bold text-slate-900 truncate tracking-tight">
                {selectedMapCamera.name}
              </h4>
              <p className="text-[12px] text-slate-500 truncate mt-0.5">
                {selectedMapCamera.address}
              </p>
            </div>

            {/* Right: Star & Flag Action Icons */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => toggleFavorite(selectedMapCamera.id, e)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-blue-600"
                title={favoriteCameraIds.has(selectedMapCamera.id) ? '已收藏' : '收藏'}
              >
                <Star
                  className={`w-5 h-5 stroke-[1.8] ${
                    favoriteCameraIds.has(selectedMapCamera.id)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-blue-600'
                  }`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerToast(`已为【${selectedMapCamera.name}】添加重点标记`);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-blue-600"
                title="标记点位"
              >
                <Flag className="w-5 h-5 stroke-[1.8] text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Existing Surveillance Drawer (Preserves all existing styles, tabs & directories) */}
      <SurveillanceDrawer
        isOpen={showSurveillanceDrawer}
        onClose={() => setShowSurveillanceDrawer(false)}
        onSelectCamera={(cam) => {
          setActiveSurveillanceCamera(cam);
        }}
        onLocateCameraOnMap={(cam) => {
          setShowSurveillanceDrawer(false);
          handleLocateCamera(cam);
        }}
        favoriteCameraIds={favoriteCameraIds}
        onToggleFavorite={toggleFavorite}
      />

      {/* 6. Video Surveillance Modal (PTZ & Live Video Stream) */}
      {activeSurveillanceCamera && !isFullscreenSurveillance && (
        <SurveillanceModal
          camera={activeSurveillanceCamera}
          onClose={() => setActiveSurveillanceCamera(null)}
          onEnterFullscreen={() => setIsFullscreenSurveillance(true)}
          isFavorite={favoriteCameraIds.has(activeSurveillanceCamera.id)}
          onToggleFavorite={() => toggleFavorite(activeSurveillanceCamera.id)}
        />
      )}

      {/* 7. Fullscreen Video Surveillance Modal */}
      {activeSurveillanceCamera && isFullscreenSurveillance && (
        <SurveillanceFullscreenModal
          camera={activeSurveillanceCamera}
          onClose={() => setIsFullscreenSurveillance(false)}
          onExitFullscreen={() => setIsFullscreenSurveillance(false)}
        />
      )}
    </div>
  );
};
