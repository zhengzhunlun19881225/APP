import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  MapPin,
  ChevronDown,
  User,
  Plus,
  Home,
  X,
  Check,
  Package,
  ArrowRight,
  Copy,
  Trash2,
  QrCode,
  Layers,
  Calendar,
  AlertTriangle,
  Building2,
  Tag,
  Clock,
  Send,
  HelpCircle,
  Truck,
  PlusCircle
} from 'lucide-react';
import { StatusBar } from './StatusBar';

// Types
export interface MaterialBatchItem {
  id: string;
  room: string;
  categoryName: string; // e.g. '灭火器', '推车式干粉灭火器', '医用口罩 (包)'
  batchName: string; // e.g. '批次一', '2024消防储备A批'
  remaining: number; // 余量
  abnormal: number; // 异常
  used: number; // 已用
  expiryDate: string; // e.g. '2025-03'
  purchaseDate: string; // 购置日期
  brand: string; // 品牌
  model: string; // 型号
  manufacturer: string; // 生产厂家
  maintenanceTime: string; // 维护时间
  creator: string; // 创建人
  createTime: string; // 创建时间
  remarks: string; // 备注
  unit: string;
}

export interface SpaceDistribution {
  room: string;
  remaining: number;
  abnormal: number;
  used: number;
  department: string;
  responsiblePerson: string;
  phone: string;
  status: string;
}

// Initial Data Mock
const initialMaterials: MaterialBatchItem[] = [
  {
    id: 'mat_1',
    room: '一楼105室',
    categoryName: '灭火器',
    batchName: '批次一',
    remaining: 70,
    abnormal: 0,
    used: 30,
    expiryDate: '2025-03',
    purchaseDate: '2023-03-15',
    brand: '海湾安全 (GST)',
    model: 'MFZ/ABC4 手提贮压式',
    manufacturer: '广东省江门市安防消防设备制造厂',
    maintenanceTime: '2024-03-10',
    creator: '李明 (后勤保障部)',
    createTime: '2023-03-15 14:30',
    remarks: '南区1号楼常规备战灭火器材，按季例行点检。',
    unit: '个'
  },
  {
    id: 'mat_2',
    room: '一楼105室',
    categoryName: '推车式干粉灭火器',
    batchName: '2023储备特级批次',
    remaining: 70,
    abnormal: 0,
    used: 10,
    expiryDate: '2025-03',
    purchaseDate: '2023-03-20',
    brand: '坚盾安防',
    model: 'MFTZ/ABC35 35kg推车式',
    manufacturer: '浙江宇安消防装备有限公司',
    maintenanceTime: '2024-03-15',
    creator: '李明 (后勤保障部)',
    createTime: '2023-03-20 09:15',
    remarks: '大型地下车库与总配电室应急专用。',
    unit: '台'
  },
  {
    id: 'mat_3',
    room: '一楼105室',
    categoryName: '医用口罩 (包)',
    batchName: '防护储备02批',
    remaining: 70,
    abnormal: 0,
    used: 50,
    expiryDate: '2025-03',
    purchaseDate: '2023-04-01',
    brand: '稳健医疗 (Winner)',
    model: 'YY/T 0969-2013 灭菌级',
    manufacturer: '稳健医疗用品股份有限公司',
    maintenanceTime: '2024-02-28',
    creator: '王海 (卫生应急组)',
    createTime: '2023-04-01 11:20',
    remarks: '突发公共卫生事件一线人员一级防护。',
    unit: '包'
  },
  {
    id: 'mat_4',
    room: '一楼105室',
    categoryName: '灭火器',
    batchName: '批次二',
    remaining: 70,
    abnormal: 2,
    used: 28,
    expiryDate: '2025-03',
    purchaseDate: '2023-04-10',
    brand: '海湾安全 (GST)',
    model: 'MFZ/ABC4 手提贮压式',
    manufacturer: '广东省江门市安防消防设备制造厂',
    maintenanceTime: '2024-04-05',
    creator: '李明 (后勤保障部)',
    createTime: '2023-04-10 16:00',
    remarks: '走廊东侧配电箱专用灭火组。',
    unit: '个'
  },
  {
    id: 'mat_5',
    room: '二楼234室',
    categoryName: '医用口罩 (包)',
    batchName: '二楼常备批次',
    remaining: 70,
    abnormal: 0,
    used: 15,
    expiryDate: '2025-03',
    purchaseDate: '2023-05-12',
    brand: '稳健医疗',
    model: 'YY/T 0969 一次性外科',
    manufacturer: '稳健医疗用品股份有限公司',
    maintenanceTime: '2024-05-01',
    creator: '张强 (行政部)',
    createTime: '2023-05-12 10:00',
    remarks: '二楼办公区日常及应急申领。',
    unit: '包'
  },
  {
    id: 'mat_6',
    room: '三楼302室',
    categoryName: '防毒面具 (顶)',
    batchName: '防化抢险储备A',
    remaining: 45,
    abnormal: 0,
    used: 5,
    expiryDate: '2026-08',
    purchaseDate: '2023-08-01',
    brand: '3M安全',
    model: '6800 全面罩防毒面具',
    manufacturer: '3M中国有限公司',
    maintenanceTime: '2024-06-10',
    creator: '赵林 (特勤搜救队)',
    createTime: '2023-08-01 15:40',
    remarks: '特种危化防毒及防浓烟逃生专用装备。',
    unit: '顶'
  }
];

const mockSpaceDistributions: Record<string, SpaceDistribution[]> = {
  default: [
    { room: '一楼109室', remaining: 100, abnormal: 100, used: 56, department: '安全保卫处', responsiblePerson: '张立国', phone: '13800138800', status: '正常受控' },
    { room: '一楼102室', remaining: 40, abnormal: 0, used: 12, department: '应急值班室', responsiblePerson: '陈建斌', phone: '13911223344', status: '正常受控' },
    { room: '一楼121室', remaining: 35, abnormal: 0, used: 8, department: '消防中控室', responsiblePerson: '刘志刚', phone: '13788990011', status: '正常受控' },
    { room: '二楼204室', remaining: 25, abnormal: 1, used: 14, department: '综合保障部', responsiblePerson: '何建平', phone: '13655443322', status: '有异常记录' }
  ]
};

const allLocations = ['全部位置', '一楼105室', '一楼109室', '一楼102室', '一楼121室', '二楼234室', '三楼302室'];
const allCategories = ['灭火器', '推车式干粉灭火器', '医用口罩 (包)', '防毒面具 (顶)', '救生破拆工具', '应急照明灯'];

interface TransferCardItem {
  id: string;
  sourceRoom: string;
  category: string;
  batch: string;
  quantity: number;
  available: number;
}

interface MaterialManagementPageProps {
  onBack: () => void;
}

export const MaterialManagementPage: React.FC<MaterialManagementPageProps> = ({ onBack }) => {
  // Navigation stack view: 'list' | 'batch-detail' | 'space-detail' | 'add-purchase' | 'transfer' | 'add-space-material'
  const [currentView, setCurrentView] = useState<'list' | 'batch-detail' | 'space-detail' | 'add-purchase' | 'transfer' | 'add-space-material'>('list');

  // List State
  const [materials, setMaterials] = useState<MaterialBatchItem[]>(initialMaterials);
  const [selectedLocation, setSelectedLocation] = useState<string>('全部位置');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  // Selected Detail State
  const [selectedBatch, setSelectedBatch] = useState<MaterialBatchItem | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<SpaceDistribution | null>(null);

  // Transfer Page Form State
  const [transferDestination, setTransferDestination] = useState('二楼234室');
  const [transferAddress, setTransferAddress] = useState('南山区科技园中区1号应急物资储备中心');
  const [transferCards, setTransferCards] = useState<TransferCardItem[]>([
    {
      id: 't_1',
      sourceRoom: '一楼105室',
      category: '灭火器',
      batch: '批次一',
      quantity: 10,
      available: 70
    }
  ]);

  // Purchase Form State
  const [purchaseRoom, setPurchaseRoom] = useState('一楼105室');
  const [purchaseCategory, setPurchaseCategory] = useState('灭火器');
  const [purchaseBatchName, setPurchaseBatchName] = useState('');
  const [purchaseTotalQty, setPurchaseTotalQty] = useState(100);
  const [purchaseDate, setPurchaseDate] = useState('2024-08-15');
  const [validityType, setValidityType] = useState<'validDate' | 'prodDate' | 'permanent'>('validDate');
  const [prodMonth, setProdMonth] = useState('2024-07');
  const [validityDuration, setValidityDuration] = useState('24个月');
  const [purchaseBrand, setPurchaseBrand] = useState('');
  const [purchaseModel, setPurchaseModel] = useState('');
  const [purchaseManufacturer, setPurchaseManufacturer] = useState('');
  const [purchaseRemarks, setPurchaseRemarks] = useState('');

  // Space Material Form State
  const [spaceMatRoom, setSpaceMatRoom] = useState('一楼105室');
  const [spaceMatQrCode, setSpaceMatQrCode] = useState('QR-2024-08-88219');
  const [spaceMatCategory, setSpaceMatCategory] = useState('灭火器');
  const [spaceMatModel, setSpaceMatModel] = useState('MFZ/ABC4 手提贮压式');
  const [spaceMatProdDate, setSpaceMatProdDate] = useState('2024-03-01');
  const [spaceMatExpiryDate, setSpaceMatExpiryDate] = useState('2026-03-01');
  const [spaceMatSource, setSpaceMatSource] = useState('南山区应急管理局统配');
  const [spaceMatCondition, setSpaceMatCondition] = useState('良好待命');

  // Success Toast
  const [toastText, setToastText] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  // Filtered List
  const filteredMaterials = materials.filter((item) => {
    const matchesLoc = selectedLocation === '全部位置' || item.room === selectedLocation;
    const matchesSearch =
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLoc && matchesSearch;
  });

  // Handle Transfer Operations
  const handleAddTransferCard = () => {
    const newCard: TransferCardItem = {
      id: 't_' + Date.now(),
      sourceRoom: '一楼105室',
      category: '灭火器',
      batch: '批次一',
      quantity: 5,
      available: 70
    };
    setTransferCards([...transferCards, newCard]);
  };

  const handleCopyTransferCard = (index: number) => {
    const itemToCopy = transferCards[index];
    const newCard: TransferCardItem = {
      ...itemToCopy,
      id: 't_' + Date.now() + Math.random()
    };
    const newList = [...transferCards];
    newList.splice(index + 1, 0, newCard);
    setTransferCards(newList);
    triggerToast('已复制该条调动项目');
  };

  const handleDeleteTransferCard = (index: number) => {
    if (transferCards.length <= 1) {
      triggerToast('至少保留一条调动物资');
      return;
    }
    setTransferCards(transferCards.filter((_, i) => i !== index));
    triggerToast('已删除调动项目');
  };

  const handleUpdateTransferCard = (index: number, key: keyof TransferCardItem, value: any) => {
    const newList = [...transferCards];
    newList[index] = { ...newList[index], [key]: value };
    setTransferCards(newList);
  };

  const handleSubmitTransfer = () => {
    triggerToast(`物资调动成功！已派发至 ${transferDestination}`);
    setTimeout(() => {
      setCurrentView('list');
    }, 1200);
  };

  // Handle Purchase Submit
  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: MaterialBatchItem = {
      id: 'mat_' + Date.now(),
      room: purchaseRoom,
      categoryName: purchaseCategory,
      batchName: purchaseBatchName || `${purchaseCategory}新批次`,
      remaining: purchaseTotalQty,
      abnormal: 0,
      used: 0,
      expiryDate: validityType === 'permanent' ? '长期有效' : '2026-08',
      purchaseDate: purchaseDate,
      brand: purchaseBrand || '优质安防',
      model: purchaseModel || '标准型',
      manufacturer: purchaseManufacturer || '广东应急器材制造中心',
      maintenanceTime: '暂无维护',
      creator: '李明 (后勤保障部)',
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      remarks: purchaseRemarks || '新购置物资入库入档',
      unit: '件'
    };

    setMaterials([newBatch, ...materials]);
    triggerToast('新增物资购置入库成功！');
    setTimeout(() => {
      setCurrentView('list');
    }, 1000);
  };

  // Handle Space Material Submit
  const handleSubmitSpaceMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: MaterialBatchItem = {
      id: 'mat_' + Date.now(),
      room: spaceMatRoom,
      categoryName: spaceMatCategory,
      batchName: `空间扫码登记 (${spaceMatQrCode.slice(-4)})`,
      remaining: 1,
      abnormal: 0,
      used: 0,
      expiryDate: spaceMatExpiryDate,
      purchaseDate: spaceMatProdDate,
      brand: spaceMatSource,
      model: spaceMatModel,
      manufacturer: '指定厂家',
      maintenanceTime: '全新建档',
      creator: '现场巡检员',
      createTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      remarks: `运行状况: ${spaceMatCondition}`,
      unit: '件'
    };

    setMaterials([newBatch, ...materials]);
    triggerToast('新增空间物资登记成功！');
    setTimeout(() => {
      setCurrentView('list');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] relative overflow-hidden select-none font-sans text-slate-800">
      {/* Toast Alert */}
      {toastText && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 1: 主列表页 (选择功能.png) */}
      {/* ============================================================ */}
      {currentView === 'list' && (
        <div className="flex flex-col h-full">
          {/* Top Sky & Cloud Gradient Header */}
          <div className="app-plan-query-bg pt-0 pb-3 px-3 relative z-20">
            <div className="-mx-3 mb-1">
              <StatusBar />
            </div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-3 relative">
              <button
                onClick={onBack}
                className="system-back-button"
              >
                <ChevronLeft />
              </button>

              <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
                物资管理
              </h1>

              {/* Right Action: Plus with Popover Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowPlusMenu((prev) => !prev)}
                  className="system-plus-button"
                >
                  <Plus />
                </button>

                {/* Popover Bubble Menu (新增物资购置 / 物资调动 / 新增空间物资) */}
                {showPlusMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowPlusMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-fade-in overflow-hidden">
                      <button
                        onClick={() => {
                          setShowPlusMenu(false);
                          setCurrentView('add-purchase');
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Package className="w-4 h-4 text-blue-500" />
                        <span>新增物资购置</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPlusMenu(false);
                          setCurrentView('transfer');
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Truck className="w-4 h-4 text-amber-500" />
                        <span>物资调动</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPlusMenu(false);
                          setCurrentView('add-space-material');
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                      >
                        <QrCode className="w-4 h-4 text-emerald-500" />
                        <span>新增空间物资</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative mb-3">
              <div className="bg-white/85 backdrop-blur-md rounded-xl flex h-10 items-center px-3 py-0 shadow-2xs border border-white/60 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索房间、物资种类或批次..."
                  className="bg-transparent text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Spatial Location Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-slate-900 font-bold text-[14px] hover:opacity-80 active:scale-95 transition-all py-1"
              >
                <MapPin className="w-4 h-4 text-slate-800 stroke-[2.2]" />
                <span>{selectedLocation}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-800 stroke-[2.5] transition-transform ${
                    isLocationDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isLocationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsLocationDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-fade-in">
                    {allLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          selectedLocation === loc
                            ? 'text-blue-600 font-bold bg-blue-50/50'
                            : 'text-slate-700 font-medium'
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocation === loc && (
                          <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Material Cards List */}
          <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-3">
            {filteredMaterials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                <Package className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
                <p className="text-xs font-medium">暂无匹配物资记录</p>
              </div>
            ) : (
              filteredMaterials.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedBatch(item);
                    setCurrentView('batch-detail');
                  }}
                  className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-3 hover:shadow-xs cursor-pointer active:scale-[0.99] transition-all"
                >
                  {/* Top Room Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#0070f3] flex items-center justify-center text-white shadow-2xs">
                        <Home className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-[14px] font-bold text-slate-900 tracking-tight">
                        {item.room}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.batchName}
                    </span>
                  </div>

                  {/* 3 Columns Row: 物资种类 | 余量 | 最近有效 */}
                  <div className="grid grid-cols-3 gap-2 items-center pt-1">
                    {/* Column 1: 物资种类 */}
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-[15px] font-bold text-slate-900 truncate">
                        {item.categoryName}
                      </span>
                      <span className="text-[12px] text-slate-400 font-medium mt-1">
                        物资种类
                      </span>
                    </div>

                    {/* Column 2: 余量 */}
                    <div className="flex flex-col items-center">
                      <span className="text-[18px] font-bold text-slate-900">
                        {item.remaining}
                      </span>
                      <span className="text-[12px] text-slate-400 font-medium mt-1">
                        余量
                      </span>
                    </div>

                    {/* Column 3: 最近有效 */}
                    <div className="flex flex-col items-end">
                      <span className="text-[15px] font-bold text-slate-900 font-mono">
                        {item.expiryDate}
                      </span>
                      <span className="text-[12px] text-slate-400 font-medium mt-1">
                        最近有效
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: 批次详情页 (批次详情.png) */}
      {/* ============================================================ */}
      {currentView === 'batch-detail' && selectedBatch && (
        <div className="flex flex-col h-full bg-[#f4f5f8] overflow-y-auto">
          {/* Header */}
          <div className="app-plan-query-bg pt-0 pb-3 px-3 sticky top-0 z-20">
            <div className="-mx-3 mb-1">
              <StatusBar />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('list')}
                className="system-back-button"
              >
                <ChevronLeft />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900">
                批次详情
              </h1>
              <div className="w-8" />
            </div>
          </div>

          <div className="p-4 space-y-3.5 pb-8">
            {/* Top Room Banner */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">{selectedBatch.room}</h2>
                <p className="text-xs text-slate-400 mt-0.5">科技园防灾大厦南区1号楼 · 应急库房</p>
              </div>
            </div>

            {/* Batch Info Card */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2.5 text-[13px]">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">物资种类</span>
                <span className="text-slate-900 font-bold">{selectedBatch.categoryName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">批次名称</span>
                <span className="text-slate-900 font-semibold">{selectedBatch.batchName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">购置日期</span>
                <span className="text-slate-900 font-medium">{selectedBatch.purchaseDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">品牌</span>
                <span className="text-slate-900 font-medium">{selectedBatch.brand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">型号</span>
                <span className="text-slate-900 font-medium">{selectedBatch.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">生产厂家</span>
                <span className="text-slate-900 font-medium text-right max-w-[200px] truncate">{selectedBatch.manufacturer}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">维护时间</span>
                <span className="text-slate-900 font-medium">{selectedBatch.maintenanceTime}</span>
              </div>
            </div>

            {/* 4 Metrics Highlight Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded-xl p-2.5 text-center shadow-2xs border border-slate-100">
                <div className="text-[17px] font-extrabold text-slate-900">{selectedBatch.remaining}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">余量</div>
              </div>
              <div className="bg-white rounded-xl p-2.5 text-center shadow-2xs border border-slate-100">
                <div className="text-[17px] font-extrabold text-amber-600">{selectedBatch.abnormal}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">异常</div>
              </div>
              <div className="bg-white rounded-xl p-2.5 text-center shadow-2xs border border-slate-100">
                <div className="text-[17px] font-extrabold text-slate-700">{selectedBatch.used}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">已用</div>
              </div>
              <div className="bg-white rounded-xl p-2.5 text-center shadow-2xs border border-slate-100">
                <div className="text-[14px] font-bold text-blue-600 font-mono pt-0.5">{selectedBatch.expiryDate}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">有效期限</div>
              </div>
            </div>

            {/* Creator & Notes */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2.5 text-[13px]">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">创建人</span>
                <span className="text-slate-900 font-semibold">{selectedBatch.creator}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">创建时间</span>
                <span className="text-slate-900 font-mono text-xs">{selectedBatch.createTime}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 font-medium block mb-1">备注说明</span>
                <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedBatch.remarks}
                </p>
              </div>
            </div>

            {/* Other Spaces Storage Status Table */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold text-slate-900">其他存储情况</h3>
                <span className="text-[11px] text-slate-400">点击空间可查看详情</span>
              </div>

              <div className="divide-y divide-slate-100 text-[12px]">
                <div className="grid grid-cols-4 text-slate-400 font-medium pb-2 px-1">
                  <span>空间位置</span>
                  <span className="text-center">余量</span>
                  <span className="text-center">异常</span>
                  <span className="text-right">已用</span>
                </div>
                {mockSpaceDistributions.default.map((sp, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedSpace(sp);
                      setCurrentView('space-detail');
                    }}
                    className="grid grid-cols-4 items-center py-2.5 px-1 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors font-medium"
                  >
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      {sp.room}
                      <ChevronLeft className="w-3 h-3 rotate-180 text-slate-300" />
                    </span>
                    <span className="text-center text-slate-900 font-bold">{sp.remaining}</span>
                    <span className="text-center text-amber-600 font-bold">{sp.abnormal}</span>
                    <span className="text-right text-slate-500">{sp.used}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: 空间物资详情 (3-空间物资详情.png) */}
      {/* ============================================================ */}
      {currentView === 'space-detail' && selectedSpace && (
        <div className="flex flex-col h-full bg-[#f4f5f8] overflow-y-auto">
          {/* Header */}
          <div className="app-plan-query-bg pt-0 pb-3 px-3 sticky top-0 z-20">
            <div className="-mx-3 mb-1">
              <StatusBar />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('batch-detail')}
                className="system-back-button"
              >
                <ChevronLeft />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900">
                空间物资详情
              </h1>
              <div className="w-8" />
            </div>
          </div>

          <div className="p-4 space-y-3.5 pb-8">
            {/* Space Header Banner */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-900">{selectedSpace.room}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">使用部门: {selectedSpace.department}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
                {selectedSpace.status}
              </span>
            </div>

            {/* Inventory Status In This Space */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 text-center shadow-2xs border border-slate-100">
                <div className="text-[20px] font-extrabold text-blue-600">{selectedSpace.remaining}</div>
                <div className="text-[11px] text-slate-400 mt-1">现存余量</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-2xs border border-slate-100">
                <div className="text-[20px] font-extrabold text-amber-600">{selectedSpace.abnormal}</div>
                <div className="text-[11px] text-slate-400 mt-1">异常报修</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-2xs border border-slate-100">
                <div className="text-[20px] font-extrabold text-slate-700">{selectedSpace.used}</div>
                <div className="text-[11px] text-slate-400 mt-1">已领用/消耗</div>
              </div>
            </div>

            {/* Detailed Info Card */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2.5 text-[13px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">物资溯源与责任</h3>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">责任人</span>
                <span className="text-slate-900 font-bold">{selectedSpace.responsiblePerson}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">联系电话</span>
                <span className="text-blue-600 font-mono font-medium">{selectedSpace.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">生产日期</span>
                <span className="text-slate-900">2023-03-15</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">有效期限</span>
                <span className="text-slate-900 font-semibold">2025-03 (24个月)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">失效日期</span>
                <span className="text-slate-900 text-rose-500 font-mono">2025-03-15</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">巡检周期</span>
                <span className="text-slate-900">每月例行巡检 (已通过)</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('batch-detail')}
              className="w-full bg-[#0070f3] text-white py-3 rounded-xl font-bold text-[14px] hover:bg-blue-600 active:scale-98 transition-all shadow-xs"
            >
              返回批次详情
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 4: 新增物资购置 (新增物资购置.png) */}
      {/* ============================================================ */}
      {currentView === 'add-purchase' && (
        <div className="flex flex-col h-full bg-[#f4f5f8] overflow-y-auto">
          {/* Header */}
          <div className="app-plan-query-bg pt-0 pb-3 px-3 sticky top-0 z-20">
            <div className="-mx-3 mb-1">
              <StatusBar />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('list')}
                className="system-back-button"
              >
                <ChevronLeft />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900">
                新增物资购置
              </h1>
              <div className="w-8" />
            </div>
          </div>

          <form onSubmit={handleSubmitPurchase} className="p-4 space-y-4 pb-12">
            {/* Form Section 1: 存放与分类 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3.5 text-[13px]">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  存储位置 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purchaseRoom}
                  onChange={(e) => setPurchaseRoom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {allLocations.filter((l) => l !== '全部位置').map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  物资种类 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={purchaseCategory}
                  onChange={(e) => setPurchaseCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  批次名称
                </label>
                <input
                  type="text"
                  value={purchaseBatchName}
                  onChange={(e) => setPurchaseBatchName(e.target.value)}
                  placeholder="例如：2024夏季特聘防灾A批"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Total Qty with Stepper (+ / -) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  购置总量 <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setPurchaseTotalQty((prev) => Math.max(1, prev - 10))}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={purchaseTotalQty}
                      onChange={(e) => setPurchaseTotalQty(parseInt(e.target.value) || 1)}
                      className="w-20 text-center bg-transparent py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setPurchaseTotalQty((prev) => prev + 10)}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">件 / 套 / 台</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  购置日期
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Form Section 2: 有效期设置 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 text-[13px]">
              <label className="text-xs font-bold text-slate-700 block">
                有效期方式
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'validDate', label: '有效日期' },
                  { id: 'prodDate', label: '生产日期' },
                  { id: 'permanent', label: '永久有效' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setValidityType(item.id as any)}
                    className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all ${
                      validityType === item.id
                        ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {validityType === 'prodDate' && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">生产月份</label>
                    <input
                      type="month"
                      value={prodMonth}
                      onChange={(e) => setProdMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">保质期限</label>
                    <select
                      value={validityDuration}
                      onChange={(e) => setValidityDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                    >
                      <option value="12个月">12个月</option>
                      <option value="24个月">24个月</option>
                      <option value="36个月">36个月</option>
                      <option value="60个月">60个月</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Form Section 3: 物资溯源 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 text-[13px]">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">品牌</label>
                <input
                  type="text"
                  value={purchaseBrand}
                  onChange={(e) => setPurchaseBrand(e.target.value)}
                  placeholder="例如：海湾安全 (GST)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">规格型号</label>
                <input
                  type="text"
                  value={purchaseModel}
                  onChange={(e) => setPurchaseModel(e.target.value)}
                  placeholder="例如：MFZ/ABC4 4kg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">生产厂家</label>
                <input
                  type="text"
                  value={purchaseManufacturer}
                  onChange={(e) => setPurchaseManufacturer(e.target.value)}
                  placeholder="例如：广东省江门市消防装备制造厂"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">备注信息</label>
                <textarea
                  rows={2}
                  value={purchaseRemarks}
                  onChange={(e) => setPurchaseRemarks(e.target.value)}
                  placeholder="填写物资用途、维保周期等说明..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0070f3] text-white py-3.5 rounded-2xl font-bold text-[15px] hover:bg-blue-600 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>保存并入库</span>
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 5: 物资调动 (物资调动1.png & 物资调动2.png) */}
      {/* ============================================================ */}
      {currentView === 'transfer' && (
        <div className="flex flex-col h-full bg-[#f4f5f8] overflow-y-auto">
          {/* Header */}
          <div className="app-plan-query-bg pt-0 pb-3 px-3 sticky top-0 z-20">
            <div className="-mx-3 mb-1">
              <StatusBar />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('list')}
                className="system-back-button"
              >
                <ChevronLeft />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900">
                物资调动
              </h1>
              <div className="w-8" />
            </div>
          </div>

          <div className="p-4 space-y-4 pb-12">
            {/* Top Destination Room Selector Banner */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>调动目的地 <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={transferDestination}
                  onChange={(e) => setTransferDestination(e.target.value)}
                  className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 focus:outline-none"
                >
                  {allLocations.filter((l) => l !== '全部位置').map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                到达地址：{transferAddress}
              </p>
            </div>

            {/* Transfer Items Cards (新增一, 新增二...) */}
            <div className="space-y-3.5">
              {transferCards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 text-[13px] relative"
                >
                  {/* Card Header: 新增一 / 复制 / 删除 */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[14px] font-bold text-slate-900">
                      新增{['一', '二', '三', '四', '五', '六'][index] || index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopyTransferCard(index)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
                        title="复制此项"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTransferCard(index)}
                        className="text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1"
                        title="删除此项"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>删除</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Item: 调出空间 */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">调出空间位置</label>
                    <select
                      value={card.sourceRoom}
                      onChange={(e) => handleUpdateTransferCard(index, 'sourceRoom', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                    >
                      {allLocations.filter((l) => l !== '全部位置').map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Form Item: 物资种类 */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">物资种类</label>
                    <select
                      value={card.category}
                      onChange={(e) => handleUpdateTransferCard(index, 'category', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                    >
                      {allCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Form Item: 购置批次 */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">购置批次</label>
                    <select
                      value={card.batch}
                      onChange={(e) => handleUpdateTransferCard(index, 'batch', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                    >
                      <option value="批次一">批次一 (2023-03购置 · 充足)</option>
                      <option value="批次二">批次二 (2023-04购置 · 充足)</option>
                      <option value="特级抢险储备批次">特级抢险储备批次</option>
                    </select>
                  </div>

                  {/* Form Item: 调动数量 (+ / - 步进器) & 可调余量 */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">调动数量</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => handleUpdateTransferCard(index, 'quantity', Math.max(1, card.quantity - 1))}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={card.quantity}
                          onChange={(e) => handleUpdateTransferCard(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-14 text-center bg-transparent py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                        </input>
                        <button
                          type="button"
                          onClick={() => handleUpdateTransferCard(index, 'quantity', Math.min(card.available, card.quantity + 1))}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">可调用总量</span>
                      <span className="text-sm font-bold text-emerald-600">{card.available} 件</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Big Dashed Plus Button to Add Another Transfer Item */}
            <button
              type="button"
              onClick={handleAddTransferCard}
              className="w-full py-3.5 border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-colors active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>添加调动物资项</span>
            </button>

            {/* Submit Transfer Button */}
            <button
              type="button"
              onClick={handleSubmitTransfer}
              className="w-full bg-[#0070f3] text-white py-3.5 rounded-2xl font-bold text-[15px] hover:bg-blue-600 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>确认调动</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 6: 新增空间物资 (4-新增空间物资.png) */}
      {/* ============================================================ */}
      {currentView === 'add-space-material' && (
        <div className="flex flex-col h-full bg-[#f4f5f8] overflow-y-auto">
          {/* Header */}
          <div className="app-plan-query-bg pt-0 pb-3 px-3 sticky top-0 z-20">
            <div className="-mx-3 mb-1">
              <StatusBar />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('list')}
                className="system-back-button"
              >
                <ChevronLeft />
              </button>
              <h1 className="text-[17px] font-bold text-slate-900">
                新增空间物资
              </h1>
              <div className="w-8" />
            </div>
          </div>

          <form onSubmit={handleSubmitSpaceMaterial} className="p-4 space-y-4 pb-12">
            {/* QR Scan Simulation Card */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 text-[13px]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">二维码编码 / 铭牌编号</label>
                <button
                  type="button"
                  onClick={() => {
                    const randomCode = 'QR-' + Math.floor(1000 + Math.random() * 9000) + '-SAFE';
                    setSpaceMatQrCode(randomCode);
                    triggerToast('已扫描读取最新物资二维码: ' + randomCode);
                  }}
                  className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>扫码录入</span>
                </button>
              </div>
              <input
                type="text"
                value={spaceMatQrCode}
                onChange={(e) => setSpaceMatQrCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Space and Specification */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 text-[13px]">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">分配空间位置</label>
                <select
                  value={spaceMatRoom}
                  onChange={(e) => setSpaceMatRoom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                >
                  {allLocations.filter((l) => l !== '全部位置').map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">物资种类</label>
                <select
                  value={spaceMatCategory}
                  onChange={(e) => setSpaceMatCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">规格型号</label>
                <input
                  type="text"
                  value={spaceMatModel}
                  onChange={(e) => setSpaceMatModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">生产日期</label>
                  <input
                    type="date"
                    value={spaceMatProdDate}
                    onChange={(e) => setSpaceMatProdDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">有效截止</label>
                  <input
                    type="date"
                    value={spaceMatExpiryDate}
                    onChange={(e) => setSpaceMatExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Source & Condition */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-3 text-[13px]">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">物资来源</label>
                <input
                  type="text"
                  value={spaceMatSource}
                  onChange={(e) => setSpaceMatSource(e.target.value)}
                  placeholder="例如：南山区应急管理局统配"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">运行及保管状况</label>
                <select
                  value={spaceMatCondition}
                  onChange={(e) => setSpaceMatCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none"
                >
                  <option value="良好待命">良好待命 (符合随时调动标准)</option>
                  <option value="需维护保养">需维护保养</option>
                  <option value="封存备用">封存备用</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0070f3] text-white py-3.5 rounded-2xl font-bold text-[15px] hover:bg-blue-600 active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>完成空间登记</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
