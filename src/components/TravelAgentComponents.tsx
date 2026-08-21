import React, { useState, useRef } from 'react';
import {
  FileText,
  Plane,
  Train,
  Building,
  CheckCircle,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  DollarSign,
  X,
  CreditCard,
  Receipt,
  Car,
  Star,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';

// 财务模版数据结构
export interface FinancialTemplateItem {
  id: string;
  category: '申请' | '报销' | '借款' | '预订';
  title: string;
  description: string;
  defaultPrompt: string;
  tag: string;
}

export const FINANCIAL_TEMPLATES: FinancialTemplateItem[] = [
  {
    id: 'ft-1',
    category: '申请',
    title: '出差事前申请单',
    description: '适用于境内公务出差审批，自动核算差旅标准与预算',
    defaultPrompt: '申请出差北京三天，与代理商讨论项目方案',
    tag: '高频常用'
  },
  {
    id: 'ft-2',
    category: '报销',
    title: '日常差旅综合报销单',
    description: '关联出差事前审批单，一键归集机票、酒店、用车发票',
    defaultPrompt: '我还有哪些发票没有报销',
    tag: '自动合规'
  },
  {
    id: 'ft-3',
    category: '预订',
    title: '出差酒店智能比价与预订',
    description: '指定拜访地点或商圈，推荐协议价及合规限额内酒店',
    defaultPrompt: '明天要去北京出差帮我推荐附近的酒店',
    tag: '企业免垫资'
  },
  {
    id: 'ft-4',
    category: '预订',
    title: '合规机票智能比价方案',
    description: '查询往返最优航班、航司协议折扣及退改签政策',
    defaultPrompt: '查询北京到上海往返最优惠差旅航班与比价方案',
    tag: '协议折扣'
  },
  {
    id: 'ft-5',
    category: '借款',
    title: '差旅备用金预支申请',
    description: '适用于大额业务出差、境外公务差旅备用金借款',
    defaultPrompt: '申请出差备用金借款 8000 元，用于境外商务洽谈食宿与公杂费',
    tag: '快速核拨'
  }
];

// 1. 财务模版抽屉
interface FinancialTemplatesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: FinancialTemplateItem) => void;
}

export const FinancialTemplatesDrawer: React.FC<FinancialTemplatesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  if (!isOpen) return null;

  const categories = ['全部', '申请', '报销', '预订', '借款'];
  const filtered = FINANCIAL_TEMPLATES.filter(
    (t) => activeCategory === '全部' || t.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
      <div className="w-full max-w-md app-bottom-sheet overflow-hidden shadow-2xl flex flex-col max-h-[85vh] h-[540px] animate-slide-up">
        {/* Drawer Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={onClose}
            className="text-[14px] text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            取消
          </button>

          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0070f3]" />
            <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
              财务模版库
            </h2>
          </div>

          <div className="w-8" />
        </div>

        {/* Categories Bar */}
        <div className="px-2 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100/80 bg-slate-50/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#0070f3] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectTemplate(item);
                onClose();
              }}
              className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/30 active:scale-[0.99] transition-all cursor-pointer bg-white shadow-2xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-slate-900 group-hover:text-[#0070f3] transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#0070f3] font-medium border border-blue-100">
                    {item.tag}
                  </span>
                </div>
                <span className="text-[12px] text-slate-400 font-medium">
                  {item.category}
                </span>
              </div>

              <p className="text-[14px] text-slate-500 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-1.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[260px]">
                  示例指令：{item.defaultPrompt}
                </span>
                <span className="text-[#0070f3] font-medium flex items-center gap-0.5">
                  套用 <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. 出差申请单卡片 (支持未提交态 / 已提交态，完全匹配设计图)
export interface TravelCostBreakdown {
  intercityTransport: number; // 城市间交通
  hotel: number; // 酒店费用
  mealAllowance: number; // 餐补/出差补贴
  localTransport: number; // 市内交通
}

export interface AttachedFileItem {
  id: string;
  name: string;
  size: string;
}

export interface TravelApplicationData {
  applicant: string;
  applicantDept?: string;
  travelers?: string[];
  startTime: string;
  endTime: string;
  startDate?: string;
  startSlot?: '上午' | '下午';
  endDate?: string;
  endSlot?: '上午' | '下午';
  fromCity: string;
  toCity: string;
  destinations?: string[];
  amount: number;
  notes: string;
  isSubmitted?: boolean;
  hasOa?: boolean;
  hasPaperDoc?: boolean;
  isDomestic?: boolean;
  costBreakdown?: TravelCostBreakdown;
  attachments?: AttachedFileItem[];
}

interface TravelApplicationCardProps {
  data: TravelApplicationData;
  onConfirm: () => void;
}

export const TravelApplicationCard: React.FC<TravelApplicationCardProps> = ({
  data,
  onConfirm
}) => {
  return (
    <div className="app-card p-4.5 bg-gradient-to-b from-[#fffbf8] to-white shadow-2xs space-y-3.5 relative overflow-hidden">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-[#ff9800] text-white flex items-center justify-center shadow-2xs">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-[16px] font-bold text-slate-900 tracking-tight">
            出差申请单
          </span>
        </div>

        {/* Submitted badge */}
        {data.isSubmitted && (
          <div className="flex items-center gap-1 bg-[#10b981] text-white text-[12px] font-medium px-2.5 py-0.5 rounded-[4px] shadow-2xs">
            <span>✓ 已提交</span>
          </div>
        )}
      </div>

      {/* Meta Field List */}
      <div className="space-y-2.5 text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">出行人员：</span>
          <span className="text-slate-800 font-medium">{data.applicant}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">开始时间：</span>
          <span className="text-slate-800">{data.startTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">结束时间：</span>
          <span className="text-slate-800">{data.endTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">出发城市：</span>
          <span className="text-slate-800 font-medium">{data.fromCity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">途径及目的地：</span>
          <span className="text-slate-800 font-medium">{data.toCity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">申请费用：</span>
          <div className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#0070f3]" />
            <span className="text-slate-900 font-semibold">
              ¥ {data.amount}
            </span>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-slate-400 shrink-0">备注：</span>
          <span className="text-slate-800 text-right leading-snug">
            {data.notes}
          </span>
        </div>
      </div>

      {/* Unsubmitted Warning Notice Banner */}
      {!data.isSubmitted && (
        <div className="bg-[#fff9e6] rounded-[10px] p-2.5 flex items-center gap-2 border border-[#ffe58f]/60">
          <div className="w-4 h-4 rounded-full bg-[#fa8c16] text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
            !
          </div>
          <p className="text-[12px] text-[#d46b08] leading-tight font-medium">
            请检查备注是否详细，无误即可同步提交财务共享
          </p>
        </div>
      )}

      {/* Single Action Button: 去确认 */}
      {!data.isSubmitted && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 rounded-xl text-[14px] font-medium text-white bg-[#0070f3] hover:bg-blue-600 active:scale-98 transition-all shadow-xs text-center cursor-pointer"
          >
            去确认
          </button>
        </div>
      )}
    </div>
  );
};

// 3. 交通推荐卡片 (Match Screenshot 3)
interface TravelTransportCardProps {
  date: string;
  from: string;
  to: string;
  preference: string;
  onViewFlights: () => void;
  onViewTrains: () => void;
}

export const TravelTransportCard: React.FC<TravelTransportCardProps> = ({
  date,
  from,
  to,
  preference,
  onViewFlights,
  onViewTrains
}) => {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-[14px] text-slate-800 font-medium">
        为您推荐{from}到{to}的交通：
      </div>

      <div className="app-card p-4 shadow-2xs space-y-3">
        <div className="text-[13px] text-slate-500">
          出发日期：{date}
        </div>

        {/* From -> To line Graphic */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="text-center">
            <div className="text-[18px] font-bold text-slate-900">{from}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">出发</div>
          </div>

          {/* Dotted / Solid arrow bar */}
          <div className="flex-1 mx-6 flex flex-col items-center">
            <div className="w-full h-[1.5px] bg-slate-200 relative flex items-center justify-center">
              <div className="w-4 h-4 bg-white text-slate-400 flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 rotate-90 text-slate-300" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[18px] font-bold text-slate-900">{to}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">终点</div>
          </div>
        </div>

        {/* Preference line */}
        <div className="pt-2 border-t border-slate-100 text-[13px] text-slate-600 flex items-start gap-1">
          <span className="text-slate-400 shrink-0">差旅偏好：</span>
          <span>{preference}</span>
        </div>

        {/* Action Link Buttons */}
        <div className="pt-1 flex items-center gap-4 text-[13px] text-[#0070f3] font-medium">
          <button
            type="button"
            onClick={onViewFlights}
            className="hover:underline active:scale-95 transition-all cursor-pointer"
          >
            查看机票
          </button>
          <span className="text-slate-200">|</span>
          <button
            type="button"
            onClick={onViewTrains}
            className="hover:underline active:scale-95 transition-all cursor-pointer"
          >
            查看火车
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. 酒店住宿偏好卡片 (Match Screenshot 3)
interface TravelHotelRecommendCardProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  durationText: string;
  roomText: string;
  preference: string;
  onViewHotels: () => void;
}

export const TravelHotelRecommendCard: React.FC<TravelHotelRecommendCardProps> = ({
  destination,
  checkIn,
  checkOut,
  durationText,
  roomText,
  preference,
  onViewHotels
}) => {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-[14px] text-slate-800 font-medium">
        为您推荐酒店住宿：
      </div>

      <div className="app-card p-4 shadow-2xs space-y-3">
        <div className="text-[13px] text-slate-500">
          目的地：{destination}
        </div>

        {/* Check in / Check out timeline */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="text-center">
            <div className="text-[18px] font-bold text-slate-900">{checkIn}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">入住</div>
          </div>

          <div className="flex-1 mx-4 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 mb-1">
              {durationText} · {roomText}
            </span>
            <div className="w-full h-[1.5px] bg-slate-200 relative" />
          </div>

          <div className="text-center">
            <div className="text-[18px] font-bold text-slate-900">{checkOut}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">离店</div>
          </div>
        </div>

        {/* Preference line */}
        <div className="pt-2 border-t border-slate-100 text-[13px] text-slate-600 flex items-start gap-1">
          <span className="text-slate-400 shrink-0">差旅偏好：</span>
          <span className="leading-snug">{preference}</span>
        </div>

        {/* Action Link Buttons */}
        <div className="pt-1 flex items-center text-[13px] text-[#0070f3] font-medium">
          <button
            type="button"
            onClick={onViewHotels}
            className="hover:underline active:scale-95 transition-all cursor-pointer"
          >
            查看酒店
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. 酒店列表卡片 (完全匹配截图4)
export interface HotelItem {
  id: string;
  name: string;
  image: string;
  distance: string;
  score: string;
  scoreLabel: string;
  tags: string[];
  price: number;
  badges: string[];
}

export const MOCK_HOTELS_DATA: HotelItem[] = [
  {
    id: 'h-1',
    name: '四季酒店(北京国贸建国门店)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    distance: '距国贸大厦1.2公里',
    score: '4.4',
    scoreLabel: '挺好的',
    tags: ['四季酒店自营', '洗衣房', '智能家居'],
    price: 490,
    badges: ['余票充足', '时间合适']
  },
  {
    id: 'h-2',
    name: '北京京伦饭店 高档型(北京国贸店)',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80',
    distance: '距国贸大厦1.2公里',
    score: '4.4',
    scoreLabel: '挺好的',
    tags: ['四季酒店自营', '洗衣房', '智能家居'],
    price: 490,
    badges: ['余票充足', '时间合适']
  },
  {
    id: 'h-3',
    name: '速8精选酒店(北京国贸建国门店)经济型',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80',
    distance: '距国贸大厦1.2公里',
    score: '4.4',
    scoreLabel: '挺好的',
    tags: ['四季酒店自营', '洗衣房', '智能家居'],
    price: 490,
    badges: ['余票充足', '时间合适']
  }
];

interface HotelListCardProps {
  locationTitle: string;
  dateRangeText: string;
  hotels?: HotelItem[];
  onBookHotel: (hotel: HotelItem) => void;
}

export const HotelListCard: React.FC<HotelListCardProps> = ({
  locationTitle,
  dateRangeText,
  hotels = MOCK_HOTELS_DATA,
  onBookHotel
}) => {
  return (
    <div className="space-y-3 mt-2">
      <div className="text-[14px] text-slate-800 font-medium leading-snug">
        为您推荐{locationTitle}附近的酒店，入住时间为{dateRangeText}
      </div>

      <div className="space-y-3">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="app-card p-3.5 shadow-2xs space-y-3 relative overflow-hidden"
          >
            <div className="flex gap-3">
              {/* Hotel image with '智能推荐' yellow badge (Match Screenshot 4) */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-[#ff9800] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
                  智能推荐
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight line-clamp-1">
                    {hotel.name}
                  </h4>
                  <p className="text-[12px] text-slate-400 mt-1">
                    {hotel.distance}
                  </p>
                </div>

                {/* Stars and score */}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center text-[#ff9800]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[12px] text-slate-700 font-medium">
                    {hotel.score} · {hotel.scoreLabel}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mt-1">
                  {hotel.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.2 rounded border border-[#ff9800]/50 text-[#ff9800] whitespace-nowrap"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="mt-1">
                  <span className="text-[13px] text-[#ff9800] font-bold">
                    ¥ <span className="text-[18px]">{hotel.price}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 ml-0.5">起</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Badges + Book Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                {hotel.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-slate-200 text-slate-500"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onBookHotel(hotel)}
                className="bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white text-[13px] font-semibold px-4.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                预订
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. 未报销发票单据卡片 (完全匹配截图6)
export interface UnreimbursedItem {
  id: string;
  orderCode: string;
  flightCount: number;
  flightAmount: number;
  hotelNights: number;
  hotelAmount: number;
  carNights: number;
  carAmount: number;
  totalAmount: number;
  isReimbursed?: boolean;
}

export const MOCK_UNREIMBURSED_ITEMS: UnreimbursedItem[] = [
  {
    id: 'un-1',
    orderCode: 'SQD223538',
    flightCount: 2,
    flightAmount: 3200.00,
    hotelNights: 2,
    hotelAmount: 800.00,
    carNights: 2,
    carAmount: 212.00,
    totalAmount: 4212.00
  },
  {
    id: 'un-2',
    orderCode: 'SQD223538',
    flightCount: 2,
    flightAmount: 3200.00,
    hotelNights: 2,
    hotelAmount: 800.00,
    carNights: 2,
    carAmount: 212.00,
    totalAmount: 4212.00
  }
];

interface UnreimbursedInvoicesCardProps {
  items?: UnreimbursedItem[];
  onReimburse: (item: UnreimbursedItem) => void;
  onViewMore: () => void;
}

export const UnreimbursedInvoicesCard: React.FC<UnreimbursedInvoicesCardProps> = ({
  items = MOCK_UNREIMBURSED_ITEMS,
  onReimburse,
  onViewMore
}) => {
  return (
    <div className="space-y-3 mt-2">
      <div className="text-[14px] text-slate-800 font-medium">
        已为您预生成出差申请单，请确认：
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="app-card p-4 shadow-2xs space-y-3"
          >
            {/* Header: 关联出差申请单 */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100/60">
              <div className="w-5 h-5 rounded-[5px] bg-[#ff9800] text-white flex items-center justify-center">
                <FileText className="w-3 h-3" />
              </div>
              <span className="text-[14px] font-semibold text-slate-800">
                关联出差申请单：
              </span>
              <span className="text-[14px] font-bold text-[#0070f3]">
                {item.orderCode}
              </span>
            </div>

            {/* Invoices breakdown */}
            <div className="space-y-2 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">机票：</span>
                <span className="text-slate-800">
                  {item.flightCount}张，共{item.flightAmount.toFixed(2)}元
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">酒店：</span>
                <span className="text-slate-800">
                  {item.hotelNights}晚，共{item.hotelAmount.toFixed(2)}元
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">用车：</span>
                <span className="text-slate-800">
                  {item.carNights}晚，共{item.carAmount.toFixed(2)}元
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-400">共计：</span>
                <span className="text-slate-900 font-semibold">
                  {item.totalAmount.toFixed(2)}元
                </span>
              </div>
            </div>

            {/* Reimbursed or Reimbursing button */}
            <button
              type="button"
              disabled={item.isReimbursed}
              onClick={() => onReimburse(item)}
              className={`w-full py-2.5 rounded-xl text-[15px] font-semibold transition-all shadow-xs ${
                item.isReimbursed
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#0070f3] hover:bg-blue-600 active:scale-[0.99] text-white cursor-pointer'
              }`}
            >
              {item.isReimbursed ? '已提交报销' : '报销'}
            </button>
          </div>
        ))}
      </div>

      {/* More Link */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onViewMore}
          className="text-[14px] text-[#0070f3] hover:underline font-medium cursor-pointer"
        >
          更多
        </button>
      </div>
    </div>
  );
};

// 7. 出差申请单确认 2步流程弹窗 (TravelApplicationConfirmModal)
interface TravelApplicationConfirmModalProps {
  isOpen: boolean;
  initialData: TravelApplicationData;
  onClose: () => void;
  onConfirm: (updated: TravelApplicationData) => void;
}

export const TravelApplicationConfirmModal: React.FC<TravelApplicationConfirmModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onConfirm
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 - Cost Breakdown
  const [intercityCost, setIntercityCost] = useState<number>(5800);
  const [hotelCost, setHotelCost] = useState<number>(1400);
  const [mealCost, setMealCost] = useState<number>(240);
  const [localCost, setLocalCost] = useState<number>(1200);

  const totalCalculated = intercityCost + hotelCost + mealCost + localCost;

  // Step 2 - Application Form details
  const [applicant, setApplicant] = useState<string>(
    initialData.applicantDept || '黄嘉嘉/数字与人工智能部/数字与人工智能开发组'
  );
  const [hasOa, setHasOa] = useState<boolean>(false);
  const [hasPaperDoc, setHasPaperDoc] = useState<boolean>(false);
  const [reason, setReason] = useState<string>(initialData.notes || '与代理商讨论项目方案');

  const [travelers, setTravelers] = useState<string>('黄嘉嘉、上官家家');
  const [startDate, setStartDate] = useState<string>('2025-07-07');
  const [startSlot, setStartSlot] = useState<'上午' | '下午'>('上午');
  const [endDate, setEndDate] = useState<string>('2025-07-09');
  const [endSlot, setEndSlot] = useState<'上午' | '下午'>('下午');
  const [isDomestic, setIsDomestic] = useState<boolean>(true);
  const [fromCity, setFromCity] = useState<string>(initialData.fromCity || '广州市');
  const [destinations, setDestinations] = useState<string[]>(['北京', '上海']);
  const [newDestInput, setNewDestInput] = useState<string>('');
  const [isAddingDest, setIsAddingDest] = useState<boolean>(false);

  // Attachments
  const [attachments, setAttachments] = useState<AttachedFileItem[]>([
    { id: 'att-1', name: '出差发票.pdf', size: '154.12KB' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newAtt: AttachedFileItem = {
        id: 'att-' + Date.now(),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + 'KB'
      };
      setAttachments((prev) => [...prev, newAtt]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddDestination = () => {
    if (newDestInput.trim() && !destinations.includes(newDestInput.trim())) {
      setDestinations((prev) => [...prev, newDestInput.trim()]);
      setNewDestInput('');
      setIsAddingDest(false);
    }
  };

  const handleRemoveDestination = (tag: string) => {
    setDestinations((prev) => prev.filter((t) => t !== tag));
  };

  const handleFinalSubmit = () => {
    const confirmedData: TravelApplicationData = {
      ...initialData,
      applicant: travelers.split('、')[0] || initialData.applicant || '黄嘉嘉',
      applicantDept: applicant,
      travelers: travelers.split('、'),
      startTime: `${startDate} ${startSlot}`,
      endTime: `${endDate} ${endSlot}`,
      startDate,
      startSlot,
      endDate,
      endSlot,
      fromCity,
      toCity: destinations.join('、') || '北京市',
      destinations,
      amount: totalCalculated,
      notes: reason,
      hasOa,
      hasPaperDoc,
      isDomestic,
      isSubmitted: true,
      costBreakdown: {
        intercityTransport: intercityCost,
        hotel: hotelCost,
        mealAllowance: mealCost,
        localTransport: localCost
      },
      attachments
    };

    onConfirm(confirmedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg app-modal shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="w-6" />
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight text-center">
            出差申请单确认
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar (Match Screenshots) */}
        <div className="flex items-center justify-center gap-2 py-3 bg-[#fbfcfe] border-b border-slate-100/90 text-[13px]">
          {/* Step 1 Indicator */}
          <div className="flex items-center gap-1.5">
            {step === 1 ? (
              <div className="w-4.5 h-4.5 rounded-full bg-[#0070f3] text-white flex items-center justify-center text-[11px] font-bold">
                1
              </div>
            ) : (
              <div className="w-4.5 h-4.5 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[10px] font-bold">
                <Check className="w-3 h-3" />
              </div>
            )}
            <span
              className={`font-semibold ${
                step === 1
                  ? 'text-[#0070f3]'
                  : 'text-[#10b981]'
              }`}
            >
              费用评估
            </span>
          </div>

          {/* Stepper Divider */}
          <div
            className={`w-12 sm:w-16 h-[1.5px] ${
              step === 2 ? 'bg-[#10b981]' : 'bg-slate-200'
            }`}
          />

          {/* Step 2 Indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 2
                  ? 'bg-[#0070f3] text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span
              className={`font-semibold ${
                step === 2 ? 'text-[#0070f3]' : 'text-slate-400'
              }`}
            >
              申请单填写
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-[14px]">
          {/* STEP 1: 费用评估 (Match Screenshot 2 申请费用评估备份.png) */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* Warning Notice Banner */}
              <div className="bg-[#fff9e6] rounded-[10px] p-3 flex items-center gap-2 border border-[#ffe58f]/80">
                <div className="w-4 h-4 rounded-full bg-[#fa8c16] text-white flex items-center justify-center shrink-0 text-[11px] font-bold">
                  !
                </div>
                <p className="text-[13px] text-[#fa8c16] font-medium leading-tight">
                  费用由AI生成仅供参考，请参照实际情况调整
                </p>
              </div>

              {/* Sub-section: 餐补/出差补贴 */}
              <div className="space-y-1.5">
                <div className="text-[15px] font-bold text-slate-900">
                  餐补/出差补贴
                </div>
                <div className="flex items-center gap-8 text-[13px] text-slate-800">
                  <span>用餐补贴120/天</span>
                  <span>2*120=240元</span>
                </div>
              </div>

              {/* Sub-section: 申请费用 */}
              <div className="space-y-2">
                <div className="text-[15px] font-bold text-slate-900">
                  申请费用
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  您将于{startDate}{startSlot}到{endDate}{endSlot}从{fromCity}前往{destinations.join('、')}出差 为您预估费用如下：
                </p>

                {/* Table of Cost Items */}
                <div className="rounded-[14px] bg-[#f8fafc] border border-slate-200/80 overflow-hidden divide-y divide-slate-200/70">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 px-3.5 py-2.5 bg-slate-100/70 text-[13px] font-semibold text-slate-700">
                    <div className="col-span-4">费用类型</div>
                    <div className="col-span-4 text-center">合计</div>
                    <div className="col-span-4 text-right">调整费用</div>
                  </div>

                  {/* Row 1: 城市间交通 */}
                  <div className="grid grid-cols-12 px-3.5 py-2.5 items-center text-[13px]">
                    <div className="col-span-4 text-slate-800">城市间交通</div>
                    <div className="col-span-4 text-center text-slate-900 font-medium">
                      ¥5,800
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={intercityCost}
                        onChange={(e) => setIntercityCost(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-right bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-500 text-[12px]">元</span>
                    </div>
                  </div>

                  {/* Row 2: 酒店费用 */}
                  <div className="grid grid-cols-12 px-3.5 py-2.5 items-center text-[13px]">
                    <div className="col-span-4 text-slate-800">酒店费用</div>
                    <div className="col-span-4 text-center text-slate-900 font-medium">
                      ¥1,400
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={hotelCost}
                        onChange={(e) => setHotelCost(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-right bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-500 text-[12px]">元</span>
                    </div>
                  </div>

                  {/* Row 3: 餐补/出差补贴 */}
                  <div className="grid grid-cols-12 px-3.5 py-2.5 items-center text-[13px]">
                    <div className="col-span-4 text-slate-800">餐补/出差补贴</div>
                    <div className="col-span-4 text-center text-slate-900 font-medium">
                      ¥240
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={mealCost}
                        onChange={(e) => setMealCost(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-right bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-500 text-[12px]">元</span>
                    </div>
                  </div>

                  {/* Row 4: 市内交通 */}
                  <div className="grid grid-cols-12 px-3.5 py-2.5 items-center text-[13px]">
                    <div className="col-span-4 text-slate-800">市内交通</div>
                    <div className="col-span-4 text-center text-slate-900 font-medium">
                      ¥1,200
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={localCost}
                        onChange={(e) => setLocalCost(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-right bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-500 text-[12px]">元</span>
                    </div>
                  </div>

                  {/* Row 5: 合计 */}
                  <div className="grid grid-cols-12 px-3.5 py-2.5 items-center text-[13px] bg-slate-50 font-bold">
                    <div className="col-span-4 text-slate-900">合计</div>
                    <div className="col-span-4 text-center text-slate-900">
                      ¥8,640
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={totalCalculated}
                        readOnly
                        className="w-20 px-2 py-1 text-right bg-slate-100 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-900"
                      />
                      <span className="text-slate-500 text-[12px]">元</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 申请单填写 (Match Screenshot 1 出差申请单备份.png) */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* Section: 基本信息 */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[15px] font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>基本信息</span>
                </div>

                {/* 申请人 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 申请人
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={applicant}
                      onChange={(e) => setApplicant(e.target.value)}
                      className="app-form-select"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* 申请费用（含补贴）元 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-[13px] text-slate-600 font-medium">
                      <span className="text-red-500">*</span> 申请费用（含补贴）元
                    </label>
                    <Info className="w-3.5 h-3.5 text-blue-500 cursor-pointer" />
                  </div>
                  <input
                    type="text"
                    value={totalCalculated.toFixed(2)}
                    readOnly
                    className="app-form-control"
                  />
                </div>

                {/* 是否有oa申请 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 是否有oa申请
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasOa(true)}
                      className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                        hasOa
                          ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      是
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasOa(false)}
                      className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                        !hasOa
                          ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      否
                    </button>
                  </div>
                </div>

                {/* 纸质附件 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 纸质附件
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasPaperDoc(true)}
                      className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                        hasPaperDoc
                          ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      有
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasPaperDoc(false)}
                      className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                        !hasPaperDoc
                          ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      无
                    </button>
                  </div>
                </div>

                {/* 申请原因 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 申请原因
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="请输入"
                      maxLength={200}
                      className="app-form-textarea min-h-[112px] pb-6"
                    />
                    <span className="absolute right-2.5 bottom-2 text-[11px] text-slate-400">
                      {reason.length}/200
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: 申请明细 */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[15px] font-bold text-slate-900">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>申请明细</span>
                </div>

                {/* 出行人员 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 出行人员
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="app-form-select"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* 开始日期 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 开始日期
                  </label>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-8 relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="app-form-control"
                      />
                    </div>
                    <div className="col-span-4 relative">
                      <select
                        value={startSlot}
                        onChange={(e) => setStartSlot(e.target.value as '上午' | '下午')}
                        className="app-form-select"
                      >
                        <option value="上午">上午</option>
                        <option value="下午">下午</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 结束日期 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 结束日期
                  </label>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-8 relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="app-form-control"
                      />
                    </div>
                    <div className="col-span-4 relative">
                      <select
                        value={endSlot}
                        onChange={(e) => setEndSlot(e.target.value as '上午' | '下午')}
                        className="app-form-select"
                      >
                        <option value="上午">上午</option>
                        <option value="下午">下午</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 是否国内差旅 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 是否国内差旅
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDomestic(true)}
                      className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                        isDomestic
                          ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      是
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDomestic(false)}
                      className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                        !isDomestic
                          ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      否
                    </button>
                  </div>
                </div>

                {/* 出发城市 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 出发城市
                  </label>
                  <div className="relative">
                    <select
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="app-form-select"
                    >
                      <option value="广州市">广州市</option>
                      <option value="深圳市">深圳市</option>
                      <option value="北京市">北京市</option>
                      <option value="上海市">上海市</option>
                      <option value="杭州市">杭州市</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* 途径及目的地 */}
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span> 途径及目的地
                  </label>
                  <div className="min-h-[42px] p-1.5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center gap-1.5">
                    {destinations.map((dest) => (
                      <span
                        key={dest}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[12px] font-medium border border-slate-200"
                      >
                        {dest}
                        <button
                          type="button"
                          onClick={() => handleRemoveDestination(dest)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {isAddingDest ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          autoFocus
                          placeholder="城市名称"
                          value={newDestInput}
                          onChange={(e) => setNewDestInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddDestination();
                            if (e.key === 'Escape') setIsAddingDest(false);
                          }}
                          className="w-20 px-1.5 py-0.5 text-[12px] border border-blue-400 rounded outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddDestination}
                          className="text-[11px] text-[#0070f3] font-medium"
                        >
                          添加
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingDest(true)}
                        className="px-2 py-1 text-[12px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                      >
                        <span>+ 增加</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: 附件区 */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[14px] font-medium text-slate-800">
                  附件区
                </div>

                {/* Upload box */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50/70 transition-colors flex items-center justify-center gap-2 text-[#0070f3] text-[13px] font-medium cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>点击上传文件</span>
                </button>

                {/* Attached File List */}
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[13px]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{file.name}</div>
                        <div className="text-[11px] text-slate-400">{file.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Fixed Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[15px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-center cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 rounded-xl text-[15px] font-semibold text-white bg-[#0070f3] hover:bg-blue-600 active:scale-[0.99] transition-all shadow-xs text-center cursor-pointer"
              >
                下一步
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl text-[15px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-center cursor-pointer"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl text-[15px] font-semibold text-white bg-[#0070f3] hover:bg-blue-600 active:scale-[0.99] transition-all shadow-xs text-center cursor-pointer"
              >
                提交
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Backward-compatibility alias
export const EditTravelApplicationModal = TravelApplicationConfirmModal;
