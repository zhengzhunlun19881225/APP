import React, { useState, useRef } from 'react';
import { Search, Check, Crosshair, MapPin } from 'lucide-react';
import L from 'leaflet';
import { OpenSourceMap, MapMarkerData } from './OpenSourceMap';

export interface LocationItem {
  id: string;
  name: string;
  distance: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerModalProps {
  onClose: () => void;
  onSendLocation: (location: LocationItem) => void;
}

const DEFAULT_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-1',
    name: '南方腾星机动车登记服务站',
    distance: '100m内',
    address: '南山区北环大道与深南北环立交交叉口',
    lat: 22.543,
    lng: 113.935
  },
  {
    id: 'loc-2',
    name: '南方腾星汽车销售服务有限公司(西南门)',
    distance: '100m内',
    address: '深圳市南山区北环大道',
    lat: 22.544,
    lng: 113.936
  },
  {
    id: 'loc-3',
    name: '嘉进隆前海汽车城C区',
    distance: '100m内',
    address: '深圳市南山区月亮湾大道',
    lat: 22.538,
    lng: 113.928
  },
  {
    id: 'loc-4',
    name: '南山科技金融城应急指挥中心',
    distance: '250m内',
    address: '深圳市南山区深南大道9668号',
    lat: 22.541,
    lng: 113.942
  },
  {
    id: 'loc-5',
    name: '深云地铁站综合救援调度站',
    distance: '500m内',
    address: '深圳市南山区北环大道7号线深云站B出口',
    lat: 22.559,
    lng: 113.985
  }
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  onClose,
  onSendLocation
}) => {
  const [selectedId, setSelectedId] = useState<string>('loc-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.543, 113.935]);
  const [mapZoom, setMapZoom] = useState<number>(15);

  const mapInstanceRef = useRef<L.Map | null>(null);

  const filtered = searchQuery.trim()
    ? DEFAULT_LOCATIONS.filter(
        (l) => l.name.includes(searchQuery) || l.address.includes(searchQuery)
      )
    : DEFAULT_LOCATIONS;

  const selectedLoc = DEFAULT_LOCATIONS.find((l) => l.id === selectedId) || DEFAULT_LOCATIONS[0];

  const handleSelectLoc = (loc: LocationItem) => {
    setSelectedId(loc.id);
    setMapCenter([loc.lat, loc.lng]);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 16);
    }
  };

  const handleSend = () => {
    onSendLocation(selectedLoc);
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
      {/* Top Header Floating Buttons over Map */}
      <div className="relative h-[48%] w-full bg-[#e2e8f0] overflow-hidden">
        {/* Real Open-Source Leaflet Map */}
        <OpenSourceMap
          center={mapCenter}
          zoom={mapZoom}
          tileProviderId="amapVector"
          showTraffic={false}
          showUserLocation={false}
          onMapReady={(map) => {
            mapInstanceRef.current = map;
          }}
          onMoveEnd={(center) => {
            setMapCenter(center);
          }}
        />

        {/* Top Floating Actions Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900/70 hover:bg-slate-900/85 backdrop-blur-md text-white text-[13px] font-medium rounded-xl transition-colors cursor-pointer shadow-md"
          >
            取消
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            发送
          </button>
        </div>

        {/* Center Target Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-emerald-500/30 animate-bounce">
            <span className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border-2 border-white mt-0.5 shadow-md" />
        </div>

        {/* Recenter Button */}
        <button
          onClick={() => handleSelectLoc(DEFAULT_LOCATIONS[0])}
          className="absolute bottom-4 right-3 w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-white transition-colors cursor-pointer z-30"
        >
          <Crosshair className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Bottom Half: Search & List (Matches 位置.png) */}
      <div className="flex-1 app-bottom-sheet -mt-4 relative z-30 shadow-2xl flex flex-col overflow-hidden border-t border-slate-100">
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100">
          <div className="h-10 px-3 bg-slate-100/80 rounded-xl flex items-center gap-2 border border-slate-200/60">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索地点、街道或建筑物"
              className="flex-1 bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Location Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filtered.map((loc) => {
            const isSelected = loc.id === selectedId;
            return (
              <div
                key={loc.id}
                onClick={() => handleSelectLoc(loc)}
                className="px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-[14px] font-bold text-slate-900 truncate flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{loc.name}</span>
                  </div>
                  <div className="text-[12px] text-slate-400 mt-0.5 truncate pl-5">
                    <span className="text-slate-500 font-medium">{loc.distance}</span> | {loc.address}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 stroke-[2.5]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
