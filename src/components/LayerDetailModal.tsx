import React, { useState } from 'react';
import { ChevronLeft, Check, Warehouse, Video } from 'lucide-react';

export interface LayerItem {
  id: string;
  type: 'warehouse' | 'camera';
  name: string;
  address: string;
  checked: boolean;
}

interface LayerDetailModalProps {
  title?: string;
  onClose: () => void;
  onStartConsultation?: (selectedCount: number) => void;
}

export const LayerDetailModal: React.FC<LayerDetailModalProps> = ({
  title = '范围内图层(23)',
  onClose,
  onStartConsultation
}) => {
  const [items, setItems] = useState<LayerItem[]>([
    {
      id: 'w-1',
      type: 'warehouse',
      name: '天河区第一应急物资仓库',
      address: '广州市天河区海安路与马场路交叉口东50米',
      checked: true
    },
    {
      id: 'w-2',
      type: 'warehouse',
      name: '珠江新城防疫应急物资储备点',
      address: '广州市天河区花城大道68号地下物资库',
      checked: true
    },
    {
      id: 'w-3',
      type: 'warehouse',
      name: '白云区南悦应急物资调拨分库',
      address: '广州市白云区机场路南悦花苑西侧物资站',
      checked: true
    },
    {
      id: 'w-4',
      type: 'warehouse',
      name: '越秀防汛防汛与综合应急储备库',
      address: '广州市越秀区东风中路300号',
      checked: true
    },
    {
      id: 'c-1',
      type: 'camera',
      name: '马场路与海安路交汇处高清球机01',
      address: '广州市天河区海安路与马场路交叉口上方',
      checked: true
    },
    {
      id: 'c-2',
      type: 'camera',
      name: '南悦花苑封控区正门全景监控03',
      address: '广州市白云区南悦花苑正门路灯杆',
      checked: true
    },
    {
      id: 'c-3',
      type: 'camera',
      name: '白藤街道治安与交通联合监控08',
      address: '广州市白云区白藤街道999号主干道',
      checked: true
    }
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const warehouses = items.filter((i) => i.type === 'warehouse');
  const cameras = items.filter((i) => i.type === 'camera');

  const allWarehousesChecked = warehouses.every((i) => i.checked);
  const allCamerasChecked = cameras.every((i) => i.checked);

  const toggleAllWarehouses = () => {
    const nextState = !allWarehousesChecked;
    setItems((prev) =>
      prev.map((item) => (item.type === 'warehouse' ? { ...item, checked: nextState } : item))
    );
  };

  const toggleAllCameras = () => {
    const nextState = !allCamerasChecked;
    setItems((prev) =>
      prev.map((item) => (item.type === 'camera' ? { ...item, checked: nextState } : item))
    );
  };

  const selectedCount = items.filter((i) => i.checked).length;

  const handleConsultation = () => {
    if (selectedCount === 0) {
      setToastMsg('请先勾选需要参与会商的图层设备或物资库');
      setTimeout(() => setToastMsg(null), 2000);
      return;
    }
    if (onStartConsultation) {
      onStartConsultation(selectedCount);
    } else {
      setToastMsg(`正在为所选的 ${selectedCount} 个资源与现场设备发起一键视频会商...`);
      setTimeout(() => {
        setToastMsg(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#f8fafc] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-md">
          {toastMsg}
        </div>
      )}

      {/* Top Navbar */}
      <div className="h-12 bg-white border-b border-slate-100 px-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h2 className="text-[16px] font-bold text-slate-900 truncate max-w-[240px]">{title}</h2>
        <div className="w-8" />
      </div>

      {/* Scrollable Checklist */}
      <div className="flex-1 overflow-y-auto pb-24 divide-y divide-slate-100">
        {/* Section 1: 物资仓库 */}
        <div className="bg-white mb-2.5">
          <div
            onClick={toggleAllWarehouses}
            className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 cursor-pointer select-none"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                allWarehousesChecked ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {allWarehousesChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-[15px] font-bold text-slate-800">物资仓库</span>
            <span className="text-xs text-slate-400">({warehouses.length})</span>
          </div>

          <div className="divide-y divide-slate-50">
            {warehouses.map((w) => (
              <div
                key={w.id}
                onClick={() => toggleItem(w.id)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    w.checked ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {w.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Warehouse className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-medium text-slate-900 truncate">{w.name}</h4>
                  <p className="text-[12px] text-slate-400 truncate mt-0.5">{w.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 视频监控 */}
        <div className="bg-white">
          <div
            onClick={toggleAllCameras}
            className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 cursor-pointer select-none"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                allCamerasChecked ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {allCamerasChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-[15px] font-bold text-slate-800">视频监控</span>
            <span className="text-xs text-slate-400">({cameras.length})</span>
          </div>

          <div className="divide-y divide-slate-50">
            {cameras.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleItem(c.id)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    c.checked ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {c.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Video className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-medium text-slate-900 truncate">{c.name}</h4>
                  <p className="text-[12px] text-slate-400 truncate mt-0.5">{c.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Button: 一键会商 (N) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
        <button
          onClick={handleConsultation}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
        >
          一键会商 ({selectedCount})
        </button>
      </div>
    </div>
  );
};
