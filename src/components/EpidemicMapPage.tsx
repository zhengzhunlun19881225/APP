import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Search,
  X,
  ChevronDown,
  Navigation,
  ChevronRight,
  ShieldAlert,
  Layers,
  Clock,
  Plus,
  Minus,
  Crosshair,
  Car,
  Activity,
  Check,
  Globe,
  Info
} from 'lucide-react';
import L from 'leaflet';
import { CityPickerModal } from './CityPickerModal';
import { LayerDetailModal } from './LayerDetailModal';
import { OpenSourceMap, MapMarkerData, MapPolygonData, MapCircleData } from './OpenSourceMap';
import { CITY_COORDINATES } from '../utils/geoData';

export interface EpidemicPoi {
  id: string;
  name: string;
  level: 'high' | 'medium' | 'low';
  levelText: string;
  layerCount: number;
  address: string;
  updateTime: string;
  lat: number;
  lng: number;
}

const EPIDEMIC_POIS: EpidemicPoi[] = [
  {
    id: 'poi-1',
    name: '南悦花苑',
    level: 'high',
    levelText: '高风险',
    layerCount: 4,
    address: '广州市白云区机场路与广园路交汇南悦花苑',
    updateTime: '2022年08月21日 更新',
    lat: 23.165,
    lng: 113.265
  },
  {
    id: 'poi-2',
    name: '太阳新天地',
    level: 'medium',
    levelText: '中风险',
    layerCount: 4,
    address: '广州市天河区海安路与马场路交叉口东侧',
    updateTime: '2022年08月21日 更新',
    lat: 23.125,
    lng: 113.342
  },
  {
    id: 'poi-3',
    name: '珠江商务大厦',
    level: 'high',
    levelText: '高风险',
    layerCount: 3,
    address: '广州市天河区珠江东路28号',
    updateTime: '2022年08月21日 更新',
    lat: 23.120,
    lng: 113.328
  },
  {
    id: 'poi-4',
    name: '保利中环广场',
    level: 'high',
    levelText: '高风险',
    layerCount: 12,
    address: '广州市越秀区建设大马路18号',
    updateTime: '2022年08月21日 更新',
    lat: 23.136,
    lng: 113.284
  },
  {
    id: 'poi-5',
    name: '白藤街道商业示范街',
    level: 'low',
    levelText: '低风险',
    layerCount: 6,
    address: '广州市白云区白藤街道999号',
    updateTime: '2022年08月20日 更新',
    lat: 23.155,
    lng: 113.272
  }
];

const DISTRICT_LIST = [
  '全城',
  '荔湾区',
  '越秀区',
  '海珠区',
  '天河区',
  '白云区',
  '黄埔区',
  '番禺区',
  '花都区',
  '南沙区'
];

const RADIUS_MAP: Record<string, number> = {
  '默认': 0,
  '500米': 500,
  '1公里': 1000,
  '2公里': 2000,
  '5公里': 5000
};

const RADIUS_LIST = Object.keys(RADIUS_MAP);

interface EpidemicMapPageProps {
  onBack: () => void;
}

export const EpidemicMapPage: React.FC<EpidemicMapPageProps> = ({ onBack }) => {
  // Top Tabs: 隐患地图 | 隐患轨迹 | 隐患数量
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'track' | 'cases'>('map');

  // Filter State
  const [selectedCity, setSelectedCity] = useState<string>('广州市');
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Dropdown open states
  const [activeDropdown, setActiveDropdown] = useState<'distance' | 'risk' | null>(null);

  // Distance dropdown sub tab ('district' | 'radius')
  const [distanceSubTab, setDistanceSubTab] = useState<'district' | 'radius'>('district');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('全城');
  const [selectedRadius, setSelectedRadius] = useState<string>('默认');

  // Risk filter state
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Analysis Card visibility
  const [showAnalysisCard, setShowAnalysisCard] = useState(true);

  // Active Selected POI
  const [selectedPoi, setSelectedPoi] = useState<EpidemicPoi | null>(EPIDEMIC_POIS[0]);

  // Map Coordinates
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.165, 113.265]);
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Full Expanded Card List Sheet (2.4展开.png)
  const [showExpandedSheet, setShowExpandedSheet] = useState(false);

  // Layer Detail Modal
  const [showLayerDetail, setShowLayerDetail] = useState(false);
  const [layerDetailTitle, setLayerDetailTitle] = useState<string>('范围内图层(23)');

  // Map Traffic and Zoom states
  const [trafficOn, setTrafficOn] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const mapInstanceRef = useRef<L.Map | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Sync city selection to map coordinates
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowCityPicker(false);
    const coords = CITY_COORDINATES[cityName] || [23.1291, 113.2644];
    setMapCenter(coords);
    setMapZoom(13);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 13, { duration: 1.2 });
    }
    triggerToast(`已定位至【${cityName}】开源防汛隐患网格`);
  };

  // Filter POIs based on selections
  const filteredPois = EPIDEMIC_POIS.filter((p) => {
    if (selectedRisk === 'high' && p.level !== 'high') return false;
    if (selectedRisk === 'medium' && p.level !== 'medium') return false;
    if (selectedRisk === 'low' && p.level !== 'low') return false;
    if (selectedDistrict !== '全城' && !p.address.includes(selectedDistrict)) return false;
    return true;
  });

  // Markers for OpenStreetMap
  const markers: MapMarkerData[] = filteredPois.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    title: p.name,
    category: p.levelText + '隐患点',
    iconType: p.level === 'high' ? 'risk' : 'pin',
    status: p.level,
    details: {
      address: p.address,
      subtext: p.updateTime
    }
  }));

  // Additional facilities (Hospitals, Cameras)
  markers.push(
    {
      id: 'hosp-baiyun',
      lat: 23.169,
      lng: 113.259,
      title: '广钢医院(北郊分院)',
      category: '排水泵站 / 应急抢险',
      iconType: 'hospital'
    },
    {
      id: 'cam-baiteng',
      lat: 23.158,
      lng: 113.268,
      title: '白藤街道999高空探头',
      category: '防汛隐患视频监测',
      iconType: 'camera'
    }
  );

  // Polygons for High Risk Zone Areas
  const polygons: MapPolygonData[] = [
    {
      id: 'poly-nanyue',
      name: '南悦花苑高风险防汛隐患区',
      level: 'high',
      coordinates: [
        [23.167, 113.261],
        [23.168, 113.269],
        [23.162, 113.27],
        [23.161, 113.262]
      ]
    },
    {
      id: 'poly-taiyang',
      name: '太阳新天地中风险防汛隐患区',
      level: 'medium',
      coordinates: [
        [23.127, 113.338],
        [23.128, 113.346],
        [23.123, 113.345],
        [23.122, 113.339]
      ]
    }
  ];

  // Buffer Circle calculation
  const bufferRadius = RADIUS_MAP[selectedRadius] || 0;
  const mapCircle: MapCircleData | null = bufferRadius > 0 && selectedPoi
    ? {
        center: [selectedPoi.lat, selectedPoi.lng],
        radius: bufferRadius,
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.15
      }
    : null;

  return (
    <div className="absolute inset-0 z-40 bg-white flex flex-col overflow-hidden select-none">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md animate-fade-in flex items-center gap-1.5 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          {toastMsg}
        </div>
      )}

      {/* City Picker Modal */}
      {showCityPicker && (
        <CityPickerModal
          selectedCity={selectedCity}
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityPicker(false)}
        />
      )}

      {/* Layer Detail & 一键会商 Modal */}
      {showLayerDetail && (
        <LayerDetailModal
          title={layerDetailTitle}
          onClose={() => setShowLayerDetail(false)}
          onStartConsultation={(cnt) => {
            setShowLayerDetail(false);
            triggerToast(`已成功为【${layerDetailTitle}】所选的 ${cnt} 处资源发起应急联席会商！`);
          }}
        />
      )}

      {/* 1. Top Header Navbar */}
      <div className="h-12 bg-white border-b border-slate-100 px-3 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>防汛隐患地图</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 font-normal">
            开源OSM
          </span>
        </h1>
        <div className="w-8" />
      </div>

      {/* 2. Three Tabs: 隐患地图 | 隐患轨迹 | 隐患数量 */}
      <div className="bg-white px-4 border-b border-slate-100 flex items-center justify-around z-20">
        {[
          { id: 'map', label: '隐患地图' },
          { id: 'track', label: '隐患轨迹' },
          { id: 'cases', label: '隐患数量' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                if (tab.id !== 'map') {
                  triggerToast(`正在切换至【${tab.label}】全景数据视图`);
                }
              }}
              className={`py-2.5 px-3 text-[15px] transition-all relative font-bold cursor-pointer ${
                isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Triple Filter Bar (广州市 ▾ | 位置距离 ▾ | 隐患区域 ▾) */}
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-2 shadow-2xs z-20">
        {/* City Filter */}
        <button
          onClick={() => {
            setActiveDropdown(null);
            setShowCityPicker(true);
          }}
          className="flex-1 h-9 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between text-[13px] font-medium text-slate-800 border border-slate-200/80 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{selectedCity}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Distance / District Filter */}
        <button
          onClick={() => {
            setActiveDropdown(activeDropdown === 'distance' ? null : 'distance');
          }}
          className={`flex-1 h-9 px-2.5 rounded-xl flex items-center justify-between text-[13px] font-medium border transition-colors cursor-pointer ${
            activeDropdown === 'distance'
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
          }`}
        >
          <span className="truncate">
            {selectedDistrict !== '全城' ? selectedDistrict : selectedRadius !== '默认' ? selectedRadius : '位置距离'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* Risk Level Filter */}
        <button
          onClick={() => {
            setActiveDropdown(activeDropdown === 'risk' ? null : 'risk');
          }}
          className={`flex-1 h-9 px-2.5 rounded-xl flex items-center justify-between text-[13px] font-medium border transition-colors cursor-pointer ${
            activeDropdown === 'risk'
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
          }`}
        >
          <span className="truncate">
            {selectedRisk === 'all'
              ? '隐患区域'
              : selectedRisk === 'high'
              ? '高风险'
              : selectedRisk === 'medium'
              ? '中风险'
              : '低风险'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      {/* Dropdown 1: Distance & District Selector (Matches 3.1 & 3.2) */}
      {activeDropdown === 'distance' && (
        <div className="absolute top-[102px] left-0 right-0 z-30 bg-white shadow-xl border-b border-slate-200 animate-in slide-in-from-top-2 duration-150 flex flex-col max-h-[360px]">
          <div className="flex h-[280px]">
            {/* Left Sub tabs: 行政区 / 范围 */}
            <div className="w-[100px] bg-slate-50 border-r border-slate-100">
              <button
                onClick={() => setDistanceSubTab('district')}
                className={`w-full py-3.5 px-3 text-left text-[13px] cursor-pointer ${
                  distanceSubTab === 'district'
                    ? 'bg-white text-blue-600 font-bold border-l-3 border-blue-600'
                    : 'text-slate-600'
                }`}
              >
                行政区
              </button>
              <button
                onClick={() => setDistanceSubTab('radius')}
                className={`w-full py-3.5 px-3 text-left text-[13px] cursor-pointer ${
                  distanceSubTab === 'radius'
                    ? 'bg-white text-blue-600 font-bold border-l-3 border-blue-600'
                    : 'text-slate-600'
                }`}
              >
                范围
              </button>
            </div>

            {/* Right options */}
            <div className="flex-1 overflow-y-auto p-2">
              {distanceSubTab === 'district' ? (
                <div className="divide-y divide-slate-50">
                  {DISTRICT_LIST.map((dist) => {
                    const isSelected = dist === selectedDistrict;
                    return (
                      <button
                        key={dist}
                        onClick={() => {
                          setSelectedDistrict(dist);
                          setActiveDropdown(null);
                          triggerToast(`已按【${dist}】过滤隐患区域`);
                        }}
                        className="w-full py-2.5 px-3 flex items-center justify-between text-[13px] hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <span className={isSelected ? 'text-blue-600 font-bold' : 'text-slate-800'}>
                          {dist}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {RADIUS_LIST.map((rad) => {
                    const isSelected = rad === selectedRadius;
                    return (
                      <button
                        key={rad}
                        onClick={() => {
                          setSelectedRadius(rad);
                          setActiveDropdown(null);
                          triggerToast(`已按周边【${rad}】辐射圈过滤`);
                        }}
                        className="w-full py-2.5 px-3 flex items-center justify-between text-[13px] hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <span className={isSelected ? 'text-blue-600 font-bold' : 'text-slate-800'}>
                          {rad}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown 2: Risk Level Selector (Matches 3.3) */}
      {activeDropdown === 'risk' && (
        <div className="absolute top-[102px] left-0 right-0 z-30 bg-white shadow-xl border-b border-slate-200 p-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {[
            { id: 'all', label: '全部 (15)', color: '' },
            { id: 'low', label: '低风险 (10)', color: 'bg-emerald-500' },
            { id: 'medium', label: '中风险 (3)', color: 'bg-amber-500' },
            { id: 'high', label: '高风险 (2)', color: 'bg-rose-500' }
          ].map((item) => {
            const isSelected = selectedRisk === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedRisk(item.id as any);
                  setActiveDropdown(null);
                  triggerToast(`已筛选${item.label}`);
                }}
                className="w-full py-2.5 px-3 flex items-center justify-between text-[14px] hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {item.color && (
                    <span className={`w-3.5 h-3.5 rounded-full ${item.color} flex items-center justify-center text-[8px] text-white`}>
                      ●
                    </span>
                  )}
                  <span className={isSelected ? 'text-blue-600 font-bold' : 'text-slate-800'}>
                    {item.label}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Interactive Open-Source Leaflet Map */}
      <div className="flex-1 relative bg-[#f1f5f9] overflow-hidden">
        <OpenSourceMap
          center={mapCenter}
          zoom={mapZoom}
          tileProviderId="amapVector"
          markers={markers}
          polygons={polygons}
          circle={mapCircle}
          showTraffic={trafficOn}
          showUserLocation={true}
          userLocation={[23.165, 113.265]}
          onMapReady={(map) => {
            mapInstanceRef.current = map;
          }}
          onMarkerClick={(m) => {
            const matched = EPIDEMIC_POIS.find((p) => p.id === m.id);
            if (matched) {
              setSelectedPoi(matched);
            }
          }}
          onPolygonClick={(poly) => {
            triggerToast(`已选中区域：${poly.name}`);
          }}
        />

        {/* Top Floating Analysis Popover */}
        {showAnalysisCard && (
          <div className="absolute top-3 left-4 right-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                防汛隐患实时分析
              </h4>
              <button
                onClick={() => setShowAnalysisCard(false)}
                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              {selectedCity}当前已发现<span className="text-rose-600 font-bold px-1">{filteredPois.length}</span>个重点防汛隐患场所，距离最近的【{selectedPoi?.name || '南悦花苑'}】处于网格化巡查中。
            </p>
          </div>
        )}

        {/* Right Floating Map Control Panel */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col divide-y divide-slate-100">
            <button
              onClick={() => {
                setTrafficOn(!trafficOn);
                triggerToast(trafficOn ? '路况已关闭' : '路况已开启');
              }}
              className={`p-2 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                trafficOn ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4 mb-0.5 stroke-[2.2]" />
              <span className="text-[10px] font-bold">路况</span>
            </button>
            <button
              onClick={() => {
                setLayerDetailTitle('所有图层与资源清单');
                setShowLayerDetail(true);
              }}
              className="p-2 flex flex-col items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Layers className="w-4 h-4 mb-0.5 stroke-[2.2]" />
              <span className="text-[10px] font-bold">图层</span>
            </button>
          </div>

          <button
            onClick={() => triggerToast('防汛隐患更新记录：今日已同步 15 处隐患区域轨迹')}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Clock className="w-4 h-4 mb-0.5 stroke-[2.2]" />
            <span className="text-[9px] font-bold">记录</span>
          </button>

          {/* Zoom controls */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col divide-y divide-slate-100">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-10 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-10 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Current location button */}
          <button
            onClick={() => {
              if (selectedPoi && mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([selectedPoi.lat, selectedPoi.lng], 15);
              }
              triggerToast('已定位至焦点区域');
            }}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Crosshair className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* 5. Bottom Card / Sheet Area (Matches 2.3多个.png & 2.4展开.png) */}
        {!showExpandedSheet ? (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-2xl shadow-2xl border-t border-slate-100 p-3 z-30 flex flex-col gap-2">
            {/* Top Bar inside sheet */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setShowExpandedSheet(true)}
                className="flex items-center gap-1 text-[13px] font-bold text-slate-700 hover:text-blue-600 cursor-pointer"
              >
                <span>查看全部结果 ({filteredPois.length})</span>
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => {
                  setLayerDetailTitle('范围内图层(23)');
                  setShowLayerDetail(true);
                }}
                className="flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-blue-600 cursor-pointer"
              >
                <span>范围内图层(23)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Selected POI Card (Matches 2.3多个.png) */}
            {selectedPoi && (
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-black text-slate-900 truncate">
                      {selectedPoi.name}
                    </h3>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        selectedPoi.level === 'high'
                          ? 'bg-rose-100 text-rose-600'
                          : selectedPoi.level === 'medium'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {selectedPoi.levelText}
                    </span>
                    <button
                      onClick={() => {
                        setLayerDetailTitle(selectedPoi.name);
                        setShowLayerDetail(true);
                      }}
                      className="text-[12px] text-slate-500 hover:text-blue-600 flex items-center gap-0.5 ml-auto cursor-pointer"
                    >
                      <span>图层({selectedPoi.layerCount})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[12px] text-slate-500 truncate mb-1">
                    {selectedPoi.address}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {selectedPoi.updateTime}
                  </p>
                </div>

                <button
                  onClick={() => triggerToast(`已开启前往【${selectedPoi.name}】的应急导航路线`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white" />
                  <span>到这去</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Full Expanded Sheet View (Matches 2.4展开.png) */
          <div className="absolute inset-0 bg-white z-40 flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="h-12 border-b border-slate-100 px-4 flex items-center justify-between">
              <span className="text-[15px] font-bold text-slate-900">
                共找到 {filteredPois.length} 处隐患区域
              </span>
              <button
                onClick={() => setShowExpandedSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredPois.map((poi) => (
                <div
                  key={poi.id}
                  onClick={() => {
                    setSelectedPoi(poi);
                    setShowExpandedSheet(false);
                    setMapCenter([poi.lat, poi.lng]);
                    mapInstanceRef.current?.flyTo([poi.lat, poi.lng], 15);
                    triggerToast(`已在开源地图定位至：${poi.name}`);
                  }}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-black text-slate-900 truncate">
                        {poi.name}
                      </h3>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          poi.level === 'high'
                            ? 'bg-rose-100 text-rose-600'
                            : poi.level === 'medium'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {poi.levelText}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLayerDetailTitle(poi.name);
                          setShowLayerDetail(true);
                        }}
                        className="text-[12px] text-slate-500 hover:text-blue-600 flex items-center gap-0.5 ml-auto cursor-pointer"
                      >
                        <span>图层({poi.layerCount})</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[12px] text-slate-500 truncate mb-1">
                      {poi.address}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {poi.updateTime}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPoi(poi);
                      setShowExpandedSheet(false);
                      setMapCenter([poi.lat, poi.lng]);
                      mapInstanceRef.current?.flyTo([poi.lat, poi.lng], 15);
                      triggerToast(`已定位至【${poi.name}】并规划路线`);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-white" />
                    <span>到这去</span>
                  </button>
                </div>
              ))}

              <div className="text-center py-4 text-[12px] text-slate-400">
                没有更多了
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
