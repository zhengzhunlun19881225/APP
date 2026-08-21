import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronRight,
  Star,
  Flag,
  RotateCcw,
  Check,
  Filter,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import {
  SURVEILLANCE_CITIES,
  SURVEILLANCE_CUSTOM_DIRS,
  SURVEILLANCE_PLANS,
  SURVEILLANCE_CAMERAS,
  SurveillanceCamera,
  SurveillanceCity,
  SurveillancePlan,
  getCamerasForDistrict
} from '../data/surveillanceData';

interface SurveillanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCamera: (camera: SurveillanceCamera) => void;
  onLocateCameraOnMap?: (camera: SurveillanceCamera) => void;
  favoriteCameraIds: Set<string>;
  onToggleFavorite: (cameraId: string) => void;
}

type TabType = 'division' | 'plan' | 'hotspot' | 'history';
type DivisionCategory = 'admin' | 'custom';

export const SurveillanceDrawer: React.FC<SurveillanceDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCamera,
  onLocateCameraOnMap,
  favoriteCameraIds,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('division');
  const [searchQuery, setSearchQuery] = useState('');

  // Division navigation states
  const [divisionCategory, setDivisionCategory] = useState<DivisionCategory>('admin');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState<SurveillanceCity | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{ id: string; name: string } | null>(null);

  // Plan navigation states
  const [selectedPlan, setSelectedPlan] = useState<SurveillancePlan | null>(null);
  const [showPlanFilterModal, setShowPlanFilterModal] = useState(false);
  const [tempSelectedPlanIds, setTempSelectedPlanIds] = useState<string[]>(['plan-1', 'plan-4', 'plan-7']);

  // Reset navigation when switching tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // Filtered cameras based on search and current tab
  const displayedCameras = useMemo(() => {
    let list = SURVEILLANCE_CAMERAS;

    if (activeTab === 'division') {
      if (selectedDistrict && selectedCity) {
        list = getCamerasForDistrict(selectedCity.name, selectedDistrict.name);
      } else if (selectedDistrict) {
        list = getCamerasForDistrict('', selectedDistrict.name);
      } else if (selectedCity) {
        list = list.filter((c) => c.city.includes(selectedCity.name) || selectedCity.name.includes(c.city));
      }
    } else if (activeTab === 'hotspot') {
      list = list.filter((c) => c.isHotspot);
    } else if (activeTab === 'history') {
      list = list.filter((c) => c.isHistory);
    } else if (activeTab === 'plan') {
      if (selectedPlan) {
        list = list.filter((c) => c.planIds?.includes(selectedPlan.id));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, searchQuery, selectedCity, selectedDistrict, selectedPlan]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 app-bottom-sheet shadow-2xl flex flex-col border-t border-slate-200/90 transition-all duration-300 max-h-[82%] sm:max-h-[75%] h-[560px] select-none animate-in slide-in-from-bottom">
      {/* Drag Handle Bar */}
      <div className="w-full flex justify-center pt-2.5 pb-1 cursor-grab">
        <div className="w-10 h-1 bg-slate-300 rounded-full"></div>
      </div>

      {/* Top 4 Navigation Tabs (Matches 列表-区划 1.png & 列表-预案.png) */}
      <div className="flex items-center justify-between px-5 pt-1 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-7">
          {/* Tab 1: 区划 */}
          <button
            onClick={() => handleTabChange('division')}
            className={`text-[16px] font-bold pb-1 relative transition-colors cursor-pointer ${
              activeTab === 'division' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            区划
            {activeTab === 'division' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full"></span>
            )}
          </button>

          {/* Tab 2: 预案 */}
          <button
            onClick={() => handleTabChange('plan')}
            className={`text-[16px] font-bold pb-1 relative transition-colors cursor-pointer ${
              activeTab === 'plan' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            预案
            {activeTab === 'plan' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full"></span>
            )}
          </button>

          {/* Tab 3: 热点 */}
          <button
            onClick={() => handleTabChange('hotspot')}
            className={`text-[16px] font-bold pb-1 relative transition-colors cursor-pointer ${
              activeTab === 'hotspot' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            热点
            {activeTab === 'hotspot' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full"></span>
            )}
          </button>

          {/* Tab 4: 历史 */}
          <button
            onClick={() => handleTabChange('history')}
            className={`text-[16px] font-bold pb-1 relative transition-colors cursor-pointer ${
              activeTab === 'history' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            历史
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Bar (Matches 搜索 in all list screenshots) */}
      <div className="px-4 py-2.5">
        <div className="app-search-shell !bg-[#f8fafc] !border-slate-200/70 !backdrop-blur-none">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索"
            className="app-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-0.5 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Sub-header & Content based on Tab */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* ===================== 1. 区划 (Division Tab) ===================== */}
        {activeTab === 'division' && (
          <div className="flex flex-col flex-1">
            {/* Breadcrumb / Subcategory Header with Mode Switcher */}
            <div className="px-4 py-2 flex items-center justify-between text-[13px] border-b border-slate-100 bg-slate-50/70 relative z-20">
              <div className="flex items-center gap-2 flex-wrap">
                {/* 行政区域 / 自定义目录 切换按钮 */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown((prev) => !prev)}
                    className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-blue-600 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
                    title="切换目录模式"
                  >
                    <span>{divisionCategory === 'admin' ? '行政区域' : '自定义目录'}</span>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {/* Dropdown Menu Modal / Popover */}
                  {showCategoryDropdown && (
                    <>
                      {/* Backdrop to close */}
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setShowCategoryDropdown(false)}
                      />
                      <div className="absolute top-full left-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                          目录分类切换
                        </div>
                        <button
                          onClick={() => {
                            setDivisionCategory('admin');
                            setSelectedCity(null);
                            setSelectedDistrict(null);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between cursor-pointer transition-colors ${
                            divisionCategory === 'admin'
                              ? 'bg-blue-50/80 text-blue-600 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>行政区域</span>
                          </div>
                          {divisionCategory === 'admin' && <Check className="w-4 h-4 text-blue-600" />}
                        </button>

                        <button
                          onClick={() => {
                            setDivisionCategory('custom');
                            setSelectedCity(null);
                            setSelectedDistrict(null);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between cursor-pointer transition-colors ${
                            divisionCategory === 'custom'
                              ? 'bg-blue-50/80 text-blue-600 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span>自定义目录</span>
                          </div>
                          {divisionCategory === 'custom' && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Breadcrumbs Navigation */}
                <div className="flex items-center gap-1.5 text-slate-500">
                  <button
                    onClick={() => {
                      setSelectedCity(null);
                      setSelectedDistrict(null);
                    }}
                    className={`hover:text-blue-600 transition-colors cursor-pointer ${
                      !selectedCity ? 'text-blue-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    全部
                  </button>

                  {selectedCity && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <button
                        onClick={() => setSelectedDistrict(null)}
                        className={`hover:text-blue-600 transition-colors cursor-pointer ${
                          !selectedDistrict ? 'text-blue-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {selectedCity.name}
                      </button>
                    </>
                  )}

                  {selectedDistrict && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-blue-600 font-bold">{selectedDistrict.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {/* Level 1: City List or Custom Directory List (Matches 列表-区划 1.png & 列表-区划 1备份 2.png) */}
              {!selectedCity && !selectedDistrict && (
                <>
                  {divisionCategory === 'admin'
                    ? SURVEILLANCE_CITIES.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => setSelectedCity(city)}
                          className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Blue Org-tree node icon */}
                            <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path d="M10 6.5h7a2 2 0 0 1 2 2V14" />
                              </svg>
                            </div>
                            <span className="text-[14px] text-slate-800 font-normal">
                              {city.name} ({city.count})
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      ))
                    : SURVEILLANCE_CUSTOM_DIRS.map((cd) => (
                        <div
                          key={cd.id}
                          onClick={() => {
                            const matchCity = SURVEILLANCE_CITIES.find((c) => c.name.startsWith(cd.name.slice(0, 2))) || SURVEILLANCE_CITIES[0];
                            setSelectedCity(matchCity);
                          }}
                          className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path d="M10 6.5h7a2 2 0 0 1 2 2V14" />
                              </svg>
                            </div>
                            <span className="text-[14px] text-slate-800 font-normal">
                              {cd.name} ({cd.count})
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      ))}
                </>
              )}

              {/* Level 2: District List (Matches 列表-区划 2.png) */}
              {selectedCity && !selectedDistrict && (
                <>
                  {selectedCity.districts.map((dist) => (
                    <div
                      key={dist.id}
                      onClick={() => setSelectedDistrict(dist)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <path d="M10 6.5h7a2 2 0 0 1 2 2V14" />
                          </svg>
                        </div>
                        <span className="text-[14px] text-slate-800 font-normal">
                          {dist.name} ({dist.count})
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                </>
              )}

              {/* Level 3: Real CCTV Camera Items (Matches 列表-区划 3.png) */}
              {selectedCity && selectedDistrict && (
                <>
                  {displayedCameras.map((cam) => {
                    const isFav = favoriteCameraIds.has(cam.id) || cam.isFavorite;
                    return (
                      <div
                        key={cam.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                        onClick={() => onSelectCamera(cam)}
                      >
                        {/* Left: Camera Status Icon + Info */}
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {/* Camera Icon in colored circle (teal: online, orange: warning, grey: offline) */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                              cam.status === 'online'
                                ? 'bg-teal-500 text-white'
                                : cam.status === 'warning'
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-400 text-white'
                            }`}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="m22 8-6 4 6 4V8Z" />
                              <rect width="14" height="12" x="2" y="6" rx="2" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-[14px] font-medium text-slate-900 truncate">
                              {cam.name}
                            </h4>
                            <p className="text-[12px] text-slate-400 truncate">
                              {cam.address}
                            </p>
                          </div>
                        </div>

                        {/* Right: Star & Flag Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onToggleFavorite(cam.id)}
                            className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                            title="收藏监控"
                          >
                            <Star className={`w-5 h-5 ${isFav ? 'fill-blue-600 text-blue-600' : 'text-blue-600'}`} />
                          </button>

                          <button
                            onClick={() => onLocateCameraOnMap && onLocateCameraOnMap(cam)}
                            className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                            title="在地图上定位"
                          >
                            <Flag className="w-5 h-5 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================== 2. 预案 (Plan Tab) (Matches 列表-预案.png & 列表-预案 2.png) ===================== */}
        {activeTab === 'plan' && (
          <div className="flex flex-col flex-1">
            {/* Breadcrumbs / Plan selector */}
            <div className="px-4 py-1.5 flex items-center justify-between text-[13px] border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className={`text-slate-500 hover:text-blue-600 ${!selectedPlan ? 'text-blue-600 font-medium' : ''}`}
                >
                  全部
                </button>
                {selectedPlan && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-600 font-medium">{selectedPlan.name}</span>
                  </>
                )}
              </div>

              {/* Multi-select modal trigger button */}
              <button
                onClick={() => setShowPlanFilterModal(true)}
                className="text-[12px] text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700"
              >
                <span>选择预案</span>
                <SlidersHorizontal className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {!selectedPlan ? (
                /* Plan Categories List (Matches 列表-预案.png) */
                SURVEILLANCE_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <path d="M10 6.5h7a2 2 0 0 1 2 2V14" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-slate-800 font-normal">
                        {plan.name} ({plan.count})
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))
              ) : (
                /* Cameras under selected plan (Matches 列表-预案 2.png) */
                displayedCameras.map((cam) => {
                  const isFav = favoriteCameraIds.has(cam.id) || cam.isFavorite;
                  return (
                    <div
                      key={cam.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                      onClick={() => onSelectCamera(cam)}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            cam.status === 'online'
                              ? 'bg-teal-500 text-white'
                              : cam.status === 'warning'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-400 text-white'
                          }`}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="m22 8-6 4 6 4V8Z" />
                            <rect width="14" height="12" x="2" y="6" rx="2" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[14px] font-medium text-slate-900 truncate">{cam.name}</h4>
                          <p className="text-[12px] text-slate-400 truncate">{cam.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleFavorite(cam.id)}
                          className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${isFav ? 'fill-blue-600 text-blue-600' : 'text-blue-600'}`} />
                        </button>
                        <button
                          onClick={() => onLocateCameraOnMap && onLocateCameraOnMap(cam)}
                          className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Flag className="w-5 h-5 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===================== 3. 热点 (Hotspots Tab) (Matches 列表-热点.png) ===================== */}
        {activeTab === 'hotspot' && (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {displayedCameras.map((cam) => {
              const isFav = favoriteCameraIds.has(cam.id) || cam.isFavorite;
              return (
                <div
                  key={cam.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => onSelectCamera(cam)}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        cam.status === 'online'
                          ? 'bg-teal-500 text-white'
                          : cam.status === 'warning'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-400 text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="m22 8-6 4 6 4V8Z" />
                        <rect width="14" height="12" x="2" y="6" rx="2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-medium text-slate-900 truncate">{cam.name}</h4>
                      <p className="text-[12px] text-slate-400 truncate">{cam.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleFavorite(cam.id)}
                      className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${isFav ? 'fill-blue-600 text-blue-600' : 'text-blue-600'}`} />
                    </button>
                    <button
                      onClick={() => onLocateCameraOnMap && onLocateCameraOnMap(cam)}
                      className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Flag className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================== 4. 历史 (History Tab) (Matches 列表-历史.png) ===================== */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {displayedCameras.map((cam) => {
              const isFav = favoriteCameraIds.has(cam.id) || cam.isFavorite;
              return (
                <div
                  key={cam.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => onSelectCamera(cam)}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        cam.status === 'online'
                          ? 'bg-teal-500 text-white'
                          : cam.status === 'warning'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-400 text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="m22 8-6 4 6 4V8Z" />
                        <rect width="14" height="12" x="2" y="6" rx="2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-medium text-slate-900 truncate">{cam.name}</h4>
                      <p className="text-[12px] text-slate-400 truncate">{cam.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleFavorite(cam.id)}
                      className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${isFav ? 'fill-blue-600 text-blue-600' : 'text-blue-600'}`} />
                    </button>
                    <button
                      onClick={() => onLocateCameraOnMap && onLocateCameraOnMap(cam)}
                      className="p-1 text-blue-600 hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Flag className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Multi-Select Modal for 预案 (Matches 列表-预案收藏3.png) */}
      {showPlanFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs select-none">
          <div className="app-bottom-sheet w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh] border-t border-slate-200 animate-in slide-in-from-bottom">
            {/* Modal Title */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-center relative">
              <h3 className="text-[16px] font-bold text-slate-900">选择预案</h3>
              <button
                onClick={() => setShowPlanFilterModal(false)}
                className="absolute right-4 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans list with Checkmarks */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {SURVEILLANCE_PLANS.map((p) => {
                const isChecked = tempSelectedPlanIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (isChecked) {
                        setTempSelectedPlanIds(tempSelectedPlanIds.filter((id) => id !== p.id));
                      } else {
                        setTempSelectedPlanIds([...tempSelectedPlanIds, p.id]);
                      }
                    }}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-blue-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <path d="M10 6.5h7a2 2 0 0 1 2 2V14" />
                        </svg>
                      </div>
                      <span className="text-[14px] text-slate-800">{p.name}</span>
                    </div>

                    {isChecked && <Check className="w-5 h-5 text-blue-600 stroke-[2.5]" />}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: 重置 vs 确定 (Matches 列表-预案收藏3.png) */}
            <div className="p-4 grid grid-cols-2 gap-3 border-t border-slate-100 bg-white">
              <button
                onClick={() => setTempSelectedPlanIds([])}
                className="py-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-blue-600 font-bold rounded-xl text-[15px] transition-colors"
              >
                重置
              </button>
              <button
                onClick={() => setShowPlanFilterModal(false)}
                className="py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-[15px] shadow-sm transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
