import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Plus,
  Minus,
  Crosshair,
  Car,
  Navigation,
  ShieldAlert,
  User,
  Video,
  Truck,
  HardHat,
  Users,
  Warehouse,
  AlertTriangle,
  Flame,
  Building2,
  Hotel,
  Activity,
  Pipette,
  Check,
  Globe,
  MapPin,
  Info,
  Tv,
  ListVideo
} from 'lucide-react';
import L from 'leaflet';
import { EpidemicMapPage } from './EpidemicMapPage';
import { LocationPickerModal } from './LocationPickerModal';
import { OpenSourceMap, MapMarkerData, MapPolygonData } from './OpenSourceMap';
import { OPEN_SOURCE_TILE_PROVIDERS } from '../utils/geoData';
import {
  SURVEILLANCE_CAMERAS,
  SurveillanceCamera
} from '../data/surveillanceData';
import { SurveillanceDrawer } from './SurveillanceDrawer';
import { SurveillanceModal } from './SurveillanceModal';
import { SurveillanceFullscreenModal } from './SurveillanceFullscreenModal';

interface SearchResultItem {
  id: string;
  name: string;
  category: string;
  address: string;
  tag?: string;
  lat: number;
  lng: number;
}

const SEARCH_MOCK_RESULTS: SearchResultItem[] = [
  {
    id: 'sr-1',
    name: '南悦花苑',
    category: '高风险封控小区',
    address: '广东省深圳市福田区莲花街道福中一路',
    tag: '高风险',
    lat: 22.5488,
    lng: 114.0556
  },
  {
    id: 'sr-2',
    name: '广钢医院(北郊分院)',
    category: '医疗机构 / 发热门诊',
    address: '广东省广州市白云区机场路118号',
    lat: 23.165,
    lng: 113.255
  },
  {
    id: 'sr-3',
    name: '白藤街道应急指挥调度中心',
    category: '政府指挥机构',
    address: '广东省广州市白云区白藤街道999号',
    lat: 23.178,
    lng: 113.268
  },
  {
    id: 'sr-4',
    name: '市民中心东侧避难安置点',
    category: '应急避难场所',
    address: '广东省深圳市福田区福中三路市民中心',
    lat: 22.5415,
    lng: 114.0612
  },
  {
    id: 'sr-5',
    name: '马务小学集中核酸采样点',
    category: '采样检测点',
    address: '广东省广州市白云区黄石东路88号',
    lat: 23.195,
    lng: 113.272
  },
  {
    id: 'sr-6',
    name: '中心应急物资综合储备库',
    category: '物资仓库',
    address: '广东省深圳市南山区深南大道科技园中区',
    lat: 22.538,
    lng: 113.945
  },
  {
    id: 'sr-shenda',
    name: '深大地铁站',
    category: '视频监控 / 轨道交通',
    address: '广东省深圳市南山区深大地铁站',
    tag: '在线',
    lat: 22.5365,
    lng: 113.9438
  }
];

export interface MapPageProps {
  initialOpenSurveillanceDrawer?: boolean;
}

export const MapPage: React.FC<MapPageProps> = ({
  initialOpenSurveillanceDrawer = false
}) => {
  // Sub-pages state (e.g. Epidemic Control Map, Location Picker)
  const [activeSubPage, setActiveSubPage] = useState<'epidemic' | 'picker' | null>(null);

  // Map state (defaults around Shenzhen center / Shenda station)
  const [center, setCenter] = useState<[number, number]>([22.5488, 114.0556]);
  const [zoom, setZoom] = useState<number>(13);
  const [activeTileId, setActiveTileId] = useState<string>('amapVector');
  const [showTileSelector, setShowTileSelector] = useState(false);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResultItem | null>(null);

  // Selected item modal/card on map (for POI)
  const [selectedPoi, setSelectedPoi] = useState<MapMarkerData | SearchResultItem | null>({
    id: 'sr-1',
    name: '南悦花苑',
    category: '商务楼宇 / 封控区',
    address: '广东省深圳市福田区莲花街道福中一路',
    tag: '高风险',
    lat: 22.5488,
    lng: 114.0556
  });

  // Layer Drawer state
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);

  // Surveillance (监控) States
  const [showSurveillanceDrawer, setShowSurveillanceDrawer] = useState(initialOpenSurveillanceDrawer);
  const [activeSurveillanceCamera, setActiveSurveillanceCamera] = useState<SurveillanceCamera | null>(null);
  const [isFullscreenSurveillance, setIsFullscreenSurveillance] = useState(false);
  const [favoriteCameraIds, setFavoriteCameraIds] = useState<Set<string>>(new Set(['cam-shenda', 'cam-4', 'cam-sz-baoan']));

  // Floating controls toggles
  const [trafficOn, setTrafficOn] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const mapInstanceRef = useRef<L.Map | null>(null);

  // Active Layers Toggles in Drawer
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    personnel: true,
    camera: true,
    truck: true,
    risk: true,
    shelter: true,
    police: true,
    trafficPolice: true,
    fire: true,
    hospital: true,
    hotel: true,
    epidemic: true,
    nucleic: false
  });

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleFavorite = (camId: string) => {
    setFavoriteCameraIds((prev) => {
      const next = new Set(prev);
      if (next.has(camId)) {
        next.delete(camId);
        triggerToast('已取消收藏该监控');
      } else {
        next.add(camId);
        triggerToast('已添加至监控收藏夹');
      }
      return next;
    });
  };

  const toggleLayer = (layerKey: string, layerName: string) => {
    setActiveLayers((prev) => {
      const nextVal = !prev[layerKey];
      triggerToast(`${layerName}图层已${nextVal ? '开启显示' : '关闭隐藏'}`);
      return { ...prev, [layerKey]: nextVal };
    });
  };

  // Zoom handlers for map
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
    const userLoc: [number, number] = [22.5431, 114.0579];
    setCenter(userLoc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userLoc, 15, { duration: 1 });
    }
    triggerToast('已定位至当前位置（深圳市中心区）');
  };

  const handleLocateCamera = (camera: SurveillanceCamera) => {
    const loc: [number, number] = [camera.lat, camera.lng];
    setCenter(loc);
    setZoom(16);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc, 16, { duration: 1 });
    }
    setActiveSurveillanceCamera(camera);
    triggerToast(`已在地图定位监控：${camera.name}`);
  };

  // Assemble dynamic markers based on layer toggles
  const mapMarkers: MapMarkerData[] = [];

  // 1. Surveillance Cameras Layer (Matches 1.1地图.png & 1.1地图2.png)
  if (activeLayers.camera) {
    if (zoom <= 12) {
      // Clustered Surveillance Camera Badge (Matches 1.1地图.png: dark circle with amber rim + 123 / count)
      mapMarkers.push({
        id: 'surv-cluster-sz',
        lat: 22.545,
        lng: 113.945,
        title: '科技园周边监控',
        count: 123,
        iconType: 'surveillanceCluster',
        rawCameraData: SURVEILLANCE_CAMERAS[0]
      });
      mapMarkers.push({
        id: 'surv-cluster-ft',
        lat: 22.552,
        lng: 114.055,
        title: '福田枢纽监控',
        count: 362,
        iconType: 'surveillanceCluster',
        rawCameraData: SURVEILLANCE_CAMERAS[1]
      });
      mapMarkers.push({
        id: 'surv-cluster-ba',
        lat: 22.572,
        lng: 113.895,
        title: '宝安主干道监控',
        count: 24,
        iconType: 'surveillanceCluster',
        rawCameraData: SURVEILLANCE_CAMERAS[9]
      });
    } else {
      // Individual Camera Markers (Matches 1.1地图2.png: Teal for online, Orange for warning, Grey for offline)
      SURVEILLANCE_CAMERAS.forEach((cam) => {
        mapMarkers.push({
          id: `marker-${cam.id}`,
          lat: cam.lat,
          lng: cam.lng,
          title: cam.name,
          category: `视频监控 · ${cam.type}`,
          iconType: 'surveillanceCamera',
          status: cam.status,
          cameraColor: cam.status === 'warning' ? 'orange' : cam.status === 'offline' ? 'grey' : 'teal',
          rawCameraData: cam,
          details: {
            address: cam.address,
            subtext: `监控编码: ${cam.code}`
          }
        });
      });
    }
  }

  // 2. Cluster bubbles for general emergency sites when zoomed out
  if (zoom <= 13 && (activeLayers.risk || activeLayers.epidemic)) {
    mapMarkers.push({
      id: 'cluster-1',
      lat: 22.552,
      lng: 114.048,
      title: '福田综合片区',
      count: 18,
      iconType: 'cluster'
    });
    mapMarkers.push({
      id: 'cluster-2',
      lat: 22.535,
      lng: 113.985,
      title: '南山科技园片区',
      count: 99,
      iconType: 'cluster'
    });
    mapMarkers.push({
      id: 'cluster-4',
      lat: 22.518,
      lng: 114.07,
      title: '罗湖商务片区',
      count: 2,
      iconType: 'cluster'
    });
  }

  // 3. Risk zone marker (南悦花苑)
  if (activeLayers.risk) {
    mapMarkers.push({
      id: 'poi-nanyue',
      lat: 22.5488,
      lng: 114.0556,
      title: '南悦花苑',
      category: '高风险封控区',
      iconType: 'risk',
      status: 'high',
      details: {
        address: '福田中心区莲花街道福中一路',
        peopleCount: 1420,
        headName: '陈志坚 (街道书记)',
        phone: '13800138000'
      }
    });
  }

  // 4. Truck / Rescue Vehicles
  if (activeLayers.truck) {
    mapMarkers.push({
      id: 'truck-1',
      lat: 22.542,
      lng: 114.048,
      title: '应急消杀车 粤B·88219',
      category: '防疫特种车',
      iconType: 'truck'
    });
  }

  // 5. Hospital
  if (activeLayers.hospital) {
    mapMarkers.push({
      id: 'hosp-1',
      lat: 22.549,
      lng: 114.068,
      title: '北京大学深圳医院',
      category: '定点医疗机构',
      iconType: 'hospital'
    });
  }

  // 6. Shelter
  if (activeLayers.shelter) {
    mapMarkers.push({
      id: 'shelter-1',
      lat: 22.541,
      lng: 114.062,
      title: '中心应急避难所',
      category: '1类应急避难所',
      iconType: 'shelter'
    });
  }

  // Polygons for High Risk Zone Area
  const mapPolygons: MapPolygonData[] = [];
  if (activeLayers.risk || activeLayers.epidemic) {
    mapPolygons.push({
      id: 'poly-nanyue',
      name: '南悦花苑封控区',
      level: 'high',
      coordinates: [
        [22.551, 114.052],
        [22.552, 114.059],
        [22.546, 114.06],
        [22.545, 114.053]
      ]
    });
    mapPolygons.push({
      id: 'poly-buffer',
      name: '福中一路周边管控圈',
      level: 'medium',
      coordinates: [
        [22.554, 114.048],
        [22.556, 114.064],
        [22.542, 114.066],
        [22.54, 114.049]
      ]
    });
  }

  // If sub-page is active, render it
  if (activeSubPage === 'epidemic') {
    return <EpidemicMapPage onBack={() => setActiveSubPage(null)} />;
  }

  if (activeSubPage === 'picker') {
    return (
      <LocationPickerModal
        onClose={() => setActiveSubPage(null)}
        onSendLocation={(loc) => {
          setActiveSubPage(null);
          triggerToast(`已选取并发送位置：【${loc.name}】`);
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] flex flex-col overflow-hidden select-none">
      {/* Toast Alert Notice */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md animate-fade-in flex items-center gap-1.5 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* 1. Top Search Bar (Matches 1.1地图.png & 3.5-搜索.png) */}
      {!isSearchOpen ? (
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-2">
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
            className="h-11 w-11 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer flex-shrink-0"
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Fullscreen Search Mode (Matches 3.5-搜索.png & 3.6-搜索结果.png) */
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
                placeholder="搜索地点、监控或社区，如深大地铁站"
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
            {SEARCH_MOCK_RESULTS.filter(
              (r) =>
                !searchKeyword.trim() ||
                r.name.includes(searchKeyword) ||
                r.address.includes(searchKeyword)
            ).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedSearchResult(item);
                  setSelectedPoi(item);
                  setIsSearchOpen(false);
                  setCenter([item.lat, item.lng]);
                  setZoom(16);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([item.lat, item.lng], 16, { duration: 1 });
                  }
                  const matchCam = SURVEILLANCE_CAMERAS.find((c) => c.name === item.name);
                  if (matchCam) {
                    setActiveSurveillanceCamera(matchCam);
                  }
                  triggerToast(`已在地图定位至：${item.name}`);
                }}
                className="px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3"
              >
                <Search className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-blue-600 truncate flex items-center gap-2">
                    {item.name}
                    {item.tag && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-normal">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-slate-400 mt-0.5 truncate">
                    <span className="text-slate-600 font-medium">{item.category}</span> · {item.address}
                  </div>
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
              开源地图图源选择 (Open-Source)
            </div>
            <button
              onClick={() => setShowTileSelector(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            {Object.values(OPEN_SOURCE_TILE_PROVIDERS).map((tp) => (
              <button
                key={tp.id}
                onClick={() => {
                  setActiveTileId(tp.id);
                  setShowTileSelector(false);
                  triggerToast(`已切换至【${tp.name}】开源图层`);
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

      {/* 2. Real Open-Source Leaflet Map */}
      <div className="absolute inset-0 w-full h-full z-0">
        <OpenSourceMap
          center={center}
          zoom={zoom}
          tileProviderId={activeTileId}
          markers={mapMarkers}
          polygons={mapPolygons}
          showTraffic={trafficOn}
          showUserLocation={true}
          userLocation={[22.5431, 114.0579]}
          onMapReady={(map) => {
            mapInstanceRef.current = map;
          }}
          onMoveEnd={(newCenter, newZoom) => {
            setCenter(newCenter);
            setZoom(newZoom);
          }}
          onMarkerClick={(marker) => {
            if (marker.rawCameraData) {
              setActiveSurveillanceCamera(marker.rawCameraData);
              return;
            }
            if (marker.iconType === 'surveillanceCluster') {
              setCenter([marker.lat, marker.lng]);
              setZoom(15);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([marker.lat, marker.lng], 15, { duration: 0.8 });
              }
              return;
            }
            setSelectedPoi({
              id: marker.id,
              name: marker.title,
              category: marker.category || '重点设施',
              address: marker.details?.address || '周边辐射区域',
              lat: marker.lat,
              lng: marker.lng
            });
          }}
        />
      </div>

      {/* 3. Floating Quick Action Controls (Right Sidebar) */}
      <div className="absolute right-3 top-20 z-20 flex flex-col gap-2.5 items-end">
        {/* Surveillance Drawer Toggle (Matches 📑 目录/区划 bottom sheet in 1.1地图.png) */}
        <button
          onClick={() => setShowSurveillanceDrawer(true)}
          title="监控目录与区划列表"
          className="w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
        >
          <ListVideo className="w-5 h-5" />
        </button>

        {/* Real-time Traffic Toggle (Matches 1.1) */}
        <button
          onClick={() => {
            const next = !trafficOn;
            setTrafficOn(next);
            triggerToast(next ? '已开启实时路况仿真叠加' : '已关闭实时路况');
          }}
          title="实时路况"
          className={`w-10 h-10 rounded-xl shadow-md border flex items-center justify-center transition-all cursor-pointer ${
            trafficOn
              ? 'bg-white/95 text-blue-600 border-blue-200'
              : 'bg-white/95 text-slate-700 border-slate-200/80 hover:bg-white'
          }`}
        >
          <Car className="w-5 h-5" />
        </button>

        {/* Layer Drawer Toggle */}
        <button
          onClick={() => setShowLayerDrawer(true)}
          title="图层管理"
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-all cursor-pointer"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Location Picker */}
        <button
          onClick={() => setActiveSubPage('picker')}
          title="选取位置分享"
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-all cursor-pointer"
        >
          <MapPin className="w-5 h-5" />
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

      {/* 4. Bottom Selected Location Card (Matches 1.2地图-选中点.png) */}
      {selectedPoi && !showSurveillanceDrawer && !activeSurveillanceCamera && (
        <div className="absolute bottom-4 left-3 right-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-3.5 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-[16px] font-bold text-slate-900 truncate">
                  {'name' in selectedPoi ? selectedPoi.name : '未知地点'}
                </h4>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-semibold shrink-0">
                  {'tag' in selectedPoi && selectedPoi.tag ? selectedPoi.tag : '重点管控'}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1 truncate">
                {'address' in selectedPoi ? selectedPoi.address : '广东省深圳市福田区莲花街道'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  已管控区域
                </span>
                <span className="text-slate-300">|</span>
                <span>网格责任人：陈书记</span>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={() => {
                  triggerToast(`正在规划前往【${'name' in selectedPoi ? selectedPoi.name : ''}】的最佳应急路径...`);
                }}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
              >
                <Navigation className="w-5 h-5 fill-current" />
              </button>
              <span className="text-[10px] text-center font-bold text-blue-600">导航</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Surveillance Bottom Sheet Drawer (Matches 列表-区划, 列表-预案, 列表-热点, 列表-历史) */}
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

      {/* 6. Surveillance Live Preview & PTZ Modal (Matches 监控详情 1.png & 监控详情 2.png) */}
      {activeSurveillanceCamera && !isFullscreenSurveillance && (
        <SurveillanceModal
          camera={activeSurveillanceCamera}
          onClose={() => setActiveSurveillanceCamera(null)}
          onToggleFavorite={toggleFavorite}
          onFullscreenToggle={() => setIsFullscreenSurveillance(true)}
        />
      )}

      {/* 7. Fullscreen Surveillance View (Matches 实时监控-全屏.png) */}
      {activeSurveillanceCamera && isFullscreenSurveillance && (
        <SurveillanceFullscreenModal
          camera={activeSurveillanceCamera}
          onClose={() => setIsFullscreenSurveillance(false)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* 8. Layer Drawer (Matches 1.3图层入口.png) */}
      {showLayerDrawer && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={() => setShowLayerDrawer(false)}
            className="flex-1"
          />
          <div className="bg-white rounded-t-3xl shadow-2xl p-5 max-h-[82%] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h2 className="text-[17px] font-bold text-slate-900">图层管理</h2>
              </div>
              <button
                onClick={() => setShowLayerDrawer(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: 人员/设备 */}
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-3">人员 / 设备</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  onClick={() => toggleLayer('personnel', '现场人员')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      activeLayers.personnel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] text-slate-700">现场人员</span>
                </button>

                <button
                  onClick={() => toggleLayer('camera', '视频监控')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      activeLayers.camera ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] text-slate-700">视频监控</span>
                </button>

                <button
                  onClick={() => toggleLayer('truck', '救援车辆')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      activeLayers.truck ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] text-slate-700">救援车辆</span>
                </button>
              </div>
            </div>

            {/* Section 2: 场所 */}
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-3">场所与重点设施</h3>
              <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-center">
                {[
                  { key: 'worksite', label: '工点', icon: HardHat, defaultBg: 'bg-slate-100 text-slate-700' },
                  { key: 'rescueTeam', label: '救援队', icon: Users, defaultBg: 'bg-slate-100 text-slate-700' },
                  { key: 'warehouse', label: '物资仓库', icon: Warehouse, defaultBg: 'bg-slate-100 text-slate-700' },
                  { key: 'risk', label: '风险源', icon: AlertTriangle, defaultBg: 'bg-blue-600 text-white' },
                  { key: 'shelter', label: '避难场所', icon: Flame, defaultBg: 'bg-blue-600 text-white' },
                  { key: 'police', label: '派出所', icon: ShieldAlert, defaultBg: 'bg-blue-600 text-white' },
                  { key: 'trafficPolice', label: '交警队', icon: User, defaultBg: 'bg-blue-600 text-white' },
                  { key: 'fire', label: '消防队', icon: Building2, defaultBg: 'bg-blue-600 text-white' },
                  { key: 'hospital', label: '医院', icon: Activity, defaultBg: 'bg-blue-600 text-white' },
                  { key: 'hotel', label: '协议酒店', icon: Hotel, defaultBg: 'bg-blue-600 text-white' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeLayers[item.key] ?? true;
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleLayer(item.key, item.label)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                          isActive ? item.defaultBg : 'bg-slate-100 text-slate-400 opacity-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[12px] text-slate-700 truncate max-w-full">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: 专题图层 */}
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-3">专题图层</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <button
                  onClick={() => toggleLayer('epidemic', '疫情管控')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      activeLayers.epidemic ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] text-slate-700">疫情管控</span>
                </button>

                <button
                  onClick={() => toggleLayer('nucleic', '核酸检测')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      activeLayers.nucleic ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Pipette className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] text-slate-700">核酸检测</span>
                </button>
              </div>
            </div>

            {/* Section 4: 专题地图入口 (Navigates to 疫情管控地图) */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-[13px] text-slate-400 mb-2">专题地图入口</h3>
              <div
                onClick={() => {
                  setShowLayerDrawer(false);
                  setActiveSubPage('epidemic');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[14px] font-bold text-blue-900 block">疫情管控专题地图</span>
                    <span className="text-[11px] text-blue-600">包含风险区域、周边图层清单与一键会商</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
