import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Calendar,
  Clock,
  Users,
  MapPin,
  Tv,
  Wifi,
  Video,
  Volume2,
  QrCode,
  Navigation,
  ChevronRight,
  Plus,
  Check,
  X,
  Bell,
  Info,
  Trash2,
  Coffee,
  Building2,
  CalendarCheck,
  Star,
  Camera,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Filter,
  Plug,
  Monitor,
  Square,
  Sparkles,
  AlertCircle
} from 'lucide-react';

import { Avatar } from './Avatar';
import { BookMeetingPage } from './BookMeetingPage';

export interface TimeSlotSegment {
  label: string;
  type: 'free' | 'occupied' | 'bookable_pattern';
  widthPct: number;
}

export interface RoomItem {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  campus: string;
  capacity: number;
  distance: string;
  status: 'available' | 'reserved' | 'near_full';
  availableNote?: string;
  facilities: string[];
  image: string;
  locationDetail: string;
  timelineSegments: TimeSlotSegment[];
  currentTimePosPct?: number;
}

export interface MeetingItem {
  id: string;
  title: string;
  host: string;
  roomName: string;
  roomFloor: string;
  capacity: number;
  date: string;
  dayOfWeek: string;
  timeSlot: string;
  durationMinutes: number;
  status: 'pending' | 'ongoing' | 'completed' | 'canceled';
  attendeesCount: number;
  attendeesAvatars: string[];
  notice?: string;
  qrCodeTime?: string;
  facilities?: string[];
  locationDetail?: string;
}

interface MeetingSystemPageProps {
  onBack: () => void;
  initialMeetingId?: string;
}

// 模拟会议室数据 (包含图中标注的 4 个真实会议室及时间段图谱)
const mockRooms: RoomItem[] = [
  {
    id: 'r1',
    name: '海纳会议室 A01',
    code: 'A01',
    building: 'A座',
    floor: '3F',
    campus: '全部园区',
    capacity: 12,
    distance: '120m',
    status: 'available',
    availableNote: '空闲中',
    facilities: ['投影仪', '白板', '视频会议', '音响'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 A座 3F 301室',
    currentTimePosPct: 20.8,
    timelineSegments: [
      { label: '08:00 - 10:00', type: 'free', widthPct: 16.6 },
      { label: '10:00 - 12:00', type: 'occupied', widthPct: 16.6 },
      { label: '12:00 - 16:00', type: 'free', widthPct: 33.3 },
      { label: '16:00 - 18:00', type: 'occupied', widthPct: 16.6 },
      { label: '18:00 - 20:00', type: 'free', widthPct: 16.9 }
    ]
  },
  {
    id: 'r2',
    name: '云程会议室 B12',
    code: 'B12',
    building: 'B座',
    floor: '12F',
    campus: '全部园区',
    capacity: 16,
    distance: '230m',
    status: 'reserved',
    availableNote: '13:00 后可预约',
    facilities: ['投影仪', '电视', '白板', '视频会议', '音响'],
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 B座 12F 1202室',
    currentTimePosPct: 20.8,
    timelineSegments: [
      { label: '08:00 - 10:00', type: 'free', widthPct: 16.6 },
      { label: '10:00 - 13:00', type: 'occupied', widthPct: 25.0 },
      { label: '13:00 - 17:30', type: 'bookable_pattern', widthPct: 41.6 },
      { label: '17:30 - 20:00', type: 'free', widthPct: 16.8 }
    ]
  },
  {
    id: 'r3',
    name: '智汇会议室 A05',
    code: 'A05',
    building: 'A座',
    floor: '5F',
    campus: '全部园区',
    capacity: 20,
    distance: '180m',
    status: 'near_full',
    availableNote: '已接近满约',
    facilities: ['投影仪', '电板', '白板', '视频会议', '音响'],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 A座 5F 508室',
    currentTimePosPct: 20.8,
    timelineSegments: [
      { label: '08:00 - 12:00', type: 'occupied', widthPct: 33.3 },
      { label: '12:00 - 15:00', type: 'free', widthPct: 25.0 },
      { label: '15:00 - 19:00', type: 'occupied', widthPct: 33.3 },
      { label: '19:00 - 20:00', type: 'free', widthPct: 8.4 }
    ]
  },
  {
    id: 'r4',
    name: '启航会议室 B03',
    code: 'B03',
    building: 'B座',
    floor: '3F',
    campus: '全部园区',
    capacity: 8,
    distance: '200m',
    status: 'available',
    availableNote: '空闲中',
    facilities: ['电视', '白板', '视频会议'],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 B座 3F 305室',
    currentTimePosPct: 20.8,
    timelineSegments: [
      { label: '08:00 - 16:00', type: 'free', widthPct: 66.6 },
      { label: '16:00 - 18:00', type: 'occupied', widthPct: 16.6 },
      { label: '18:00 - 20:00', type: 'free', widthPct: 16.8 }
    ]
  }
];

// 模拟已预约会议数据 (对照图2)
const initialMeetings: MeetingItem[] = [
  {
    id: 'm1',
    title: '产品周会',
    host: '张经理',
    roomName: '海纳会议室 A01',
    roomFloor: '3F',
    capacity: 12,
    date: '2025-06-12',
    dayOfWeek: '周四',
    timeSlot: '10:00 - 11:30',
    durationMinutes: 90,
    status: 'pending',
    attendeesCount: 12,
    notice: '距离开始还有 2 小时 15 分钟，请提前到达会场',
    qrCodeTime: '10:50 开放签到',
    facilities: ['投影仪', '白板', 'Wi-Fi', '视频会议'],
    locationDetail: '上海总部大厦 A座 3F 浦东新区世纪大道 123 号',
    attendeesAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80'
    ]
  },
  {
    id: 'm2',
    title: '销售复盘会',
    host: '李总监',
    roomName: '云程会议室 B12',
    roomFloor: '12F',
    capacity: 8,
    date: '2025-06-11',
    dayOfWeek: '周三',
    timeSlot: '14:00 - 15:30',
    durationMinutes: 90,
    status: 'ongoing',
    attendeesCount: 8,
    facilities: ['电视', '白板', 'Wi-Fi', '音响'],
    locationDetail: '上海总部大厦 B座 12F 浦东新区世纪大道 123 号',
    attendeesAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
    ]
  },
  {
    id: 'm3',
    title: '项目评审',
    host: '王工',
    roomName: '智汇会议室 A05',
    roomFloor: '5F',
    capacity: 10,
    date: '2025-06-10',
    dayOfWeek: '周二',
    timeSlot: '09:30 - 11:00',
    durationMinutes: 90,
    status: 'completed',
    attendeesCount: 10,
    facilities: ['投影仪', 'Wi-Fi', '视频会议', '茶水'],
    locationDetail: '上海总部大厦 A座 5F 浦东新区世纪大道 123 号',
    attendeesAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
    ]
  },
  {
    id: 'm4',
    title: '行政培训',
    host: '赵主管',
    roomName: '启航会议室 B03',
    roomFloor: '3F',
    capacity: 20,
    date: '2025-06-09',
    dayOfWeek: '周一',
    timeSlot: '16:00 - 17:30',
    durationMinutes: 90,
    status: 'canceled',
    attendeesCount: 20,
    facilities: ['投影仪', '白板', 'Wi-Fi'],
    locationDetail: '上海总部大厦 B座 3F 浦东新区世纪大道 123 号',
    attendeesAvatars: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
    ]
  }
];

export const MeetingSystemPage: React.FC<MeetingSystemPageProps> = ({
  onBack
}) => {
  // 当前主要视图: 'home' (会议室预约) | 'all-rooms' (全部会议室) | 'my-bookings' (我的预约) | 'detail' (会议详情) | 'book-meeting' (预约会议)
  const [activeView, setActiveView] = useState<'home' | 'all-rooms' | 'my-bookings' | 'detail' | 'book-meeting'>('home');

  // 我的预约筛选 Tag ('all' | 'pending' | 'ongoing' | 'completed' | 'canceled')
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'ongoing' | 'completed' | 'canceled'>('all');

  // 搜索关键字与日期范围
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [dateRangeText, setDateRangeText] = useState<string>('2025-06-09 至 2025-06-16');

  // 会议室列表高级筛选 & 日期选择 State
  const [roomSearchQuery, setRoomSearchQuery] = useState<string>('');
  const [selectedCampus, setSelectedCampus] = useState<string>('全部园区');
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>('all'); // 'all' | 'A座' | 'B座'
  const [selectedCapacityFilter, setSelectedCapacityFilter] = useState<number>(10); // 0, 10, 15, 20
  const [selectedFacilityFilters, setSelectedFacilityFilters] = useState<string[]>(['投影仪', '视频会议']);
  const [selectedDateDay, setSelectedDateDay] = useState<string>('12'); // '9', '10', '11', '12', '13', '14', '15'

  // Modals / Drawers state
  const [showCampusDropdown, setShowCampusDropdown] = useState<boolean>(false);
  const [showCapacityDropdown, setShowCapacityDropdown] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false);

  // Helper function: Render facility icon
  const renderFacilityIcon = (facilityName: string) => {
    if (facilityName.includes('投影')) {
      return <Tv className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (facilityName.includes('电视')) {
      return <Monitor className="w-3.5 h-3.5 text-indigo-500" />;
    }
    if (facilityName.includes('白板')) {
      return <Square className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (facilityName.includes('视频会议')) {
      return <Video className="w-3.5 h-3.5 text-purple-500" />;
    }
    if (facilityName.includes('音响')) {
      return <Volume2 className="w-3.5 h-3.5 text-teal-500" />;
    }
    if (facilityName.includes('电板')) {
      return <Plug className="w-3.5 h-3.5 text-amber-600" />;
    }
    if (facilityName.includes('茶水')) {
      return <Coffee className="w-3.5 h-3.5 text-amber-700" />;
    }
    return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
  };

  // 动态筛选会议室
  const filteredRooms = mockRooms.filter((room) => {
    // 搜索词
    if (roomSearchQuery.trim()) {
      const q = roomSearchQuery.toLowerCase();
      const matchName = room.name.toLowerCase().includes(q);
      const matchBuilding = room.building.toLowerCase().includes(q);
      const matchFloor = room.floor.toLowerCase().includes(q);
      const matchFacility = room.facilities.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchBuilding && !matchFloor && !matchFacility) {
        return false;
      }
    }

    // 园区
    if (selectedCampus !== '全部园区' && room.campus !== selectedCampus) {
      return false;
    }

    // 座号 (A座 / B座)
    if (selectedBuildingFilter !== 'all' && room.building !== selectedBuildingFilter) {
      return false;
    }

    // 人数容纳
    if (selectedCapacityFilter > 0 && room.capacity < selectedCapacityFilter) {
      return false;
    }

    // 设备需求
    if (selectedFacilityFilters.length > 0) {
      const hasFacilities = selectedFacilityFilters.every((fac) =>
        room.facilities.some((rf) => rf.includes(fac) || fac.includes(rf))
      );
      if (!hasFacilities) return false;
    }

    return true;
  });

  // 选中的会议详情 ID
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('m1');

  // 所有已预约会议 state
  const [meetings, setMeetings] = useState<MeetingItem[]>(initialMeetings);

  // 快捷发起/预约 Modal 开关
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomItem | null>(null);

  // 发起会议 Form 表单
  const [formTitle, setFormTitle] = useState<string>('产品需求评审会');
  const [formHost, setFormHost] = useState<string>('张经理');
  const [formDate, setFormDate] = useState<string>('2025-06-12');
  const [formTimeSlot, setFormTimeSlot] = useState<string>('11:00 - 12:00');
  const [formAttendeesCount, setFormAttendeesCount] = useState<number>(8);

  // 扫码签到 Modal 开关与状态
  const [showQrScanModal, setShowQrScanModal] = useState<boolean>(false);
  const [scanSuccessToast, setScanSuccessToast] = useState<boolean>(false);

  // 导航 Modal 开关
  const [showNavigationModal, setShowNavigationModal] = useState<boolean>(false);
  const [navigationTargetRoom, setNavigationTargetRoom] = useState<string>('');

  // 评价 Modal 开关
  const [showEvaluateModal, setShowEvaluateModal] = useState<boolean>(false);
  const [evalRating, setEvalRating] = useState<number>(5);
  const [evalComment, setEvalComment] = useState<string>('');

  // 取消确认 Modal
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState<boolean>(false);

  // Toast 消息
  const [toastText, setToastText] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  // 当前查看的会议详情对象
  const currentMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  // 快速打开“发起/预约会议”表单 / 页面
  const handleOpenBookingForm = (room?: RoomItem) => {
    if (room) {
      setSelectedRoomForBooking(room);
    } else {
      setSelectedRoomForBooking(mockRooms[0]);
    }
    setActiveView('book-meeting');
  };

  // 处理预约会议成功
  const handleBookMeetingSuccess = (newMeetingData: any) => {
    const targetRoom = selectedRoomForBooking || mockRooms[0];
    const newMeeting: MeetingItem = {
      id: newMeetingData.id || `m_${Date.now()}`,
      title: newMeetingData.title || '芦丽云预定的会议',
      host: newMeetingData.host || '芦丽云',
      roomName: newMeetingData.roomName || targetRoom.name,
      roomFloor: targetRoom.floor || '2F',
      capacity: targetRoom.capacity || 20,
      date: newMeetingData.date || '04月08日 周五',
      dayOfWeek: '周五',
      timeSlot: newMeetingData.timeSlot || '14:00 - 15:00',
      durationMinutes: newMeetingData.durationMinutes || 60,
      status: 'pending',
      attendeesCount: newMeetingData.attendeesCount || 6,
      notice: '距离会议开始还有一段时间，请提前做好准备',
      qrCodeTime: '13:50 开放签到',
      facilities: targetRoom.facilities || ['视频会议', '投影仪', 'Wi-Fi', '白板'],
      locationDetail: targetRoom.locationDetail || '顺德分公司 / 总部大厦',
      attendeesAvatars: newMeetingData.attendeesAvatars || [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      ]
    };

    setMeetings([newMeeting, ...meetings]);
    setSelectedMeetingId(newMeeting.id);
    triggerToast('会议预约成功！');
    setActiveView('detail');
  };

  // 提交新会议预约
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      triggerToast('请输入会议主题');
      return;
    }

    const targetRoom = selectedRoomForBooking || mockRooms[0];
    const newMeeting: MeetingItem = {
      id: `m_${Date.now()}`,
      title: formTitle,
      host: formHost || '刘强',
      roomName: targetRoom.name,
      roomFloor: targetRoom.floor,
      capacity: targetRoom.capacity,
      date: formDate,
      dayOfWeek: '周四',
      timeSlot: formTimeSlot,
      durationMinutes: 60,
      status: 'pending',
      attendeesCount: formAttendeesCount,
      notice: '距离开始还有 1 小时 30 分钟，请提前到达会场',
      qrCodeTime: '10:50 开放签到',
      facilities: targetRoom.facilities,
      locationDetail: targetRoom.locationDetail,
      attendeesAvatars: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      ]
    };

    setMeetings([newMeeting, ...meetings]);
    setSelectedMeetingId(newMeeting.id);
    setShowBookingModal(false);
    triggerToast('会议预约成功！');
    setActiveView('detail');
  };

  // 取消当前会议
  const handleConfirmCancelMeeting = () => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === selectedMeetingId ? { ...m, status: 'canceled' as const } : m))
    );
    setShowCancelConfirmModal(false);
    triggerToast('已成功取消该会议预约');
  };

  // 触发扫码签到
  const handleStartQrScan = () => {
    setShowQrScanModal(true);
  };

  const handleSimulateScanComplete = () => {
    setScanSuccessToast(true);
    setTimeout(() => {
      setScanSuccessToast(false);
      setShowQrScanModal(false);
      triggerToast('扫码签到成功！已更新会议签到状态。');
    }, 1500);
  };

  // 触发导航
  const handleOpenNavigation = (roomName: string) => {
    setNavigationTargetRoom(roomName);
    setShowNavigationModal(true);
  };

  // 根据分类过滤会议
  const filteredMeetings = meetings.filter((m) => {
    if (bookingFilter !== 'all' && m.status !== bookingFilter) return false;
    if (
      searchKeyword &&
      !m.title.includes(searchKeyword) &&
      !m.roomName.includes(searchKeyword)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none relative overflow-hidden animate-fade-in">
      {/* Toast Alert Notice */}
      {toastText && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* ----------------- 页面 1: 会议室预约 (主页 SCREEN) ----------------- */}
      {activeView === 'home' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-10">
          {/* Header */}
          <div className="px-2 py-3 app-plan-query-bg flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={onBack}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
              会议室预约
            </h1>
            <button
              onClick={() => setActiveView('my-bookings')}
              className="text-[13px] text-[#0070f3] font-bold hover:underline cursor-pointer"
            >
              我的预约
            </button>
          </div>

          <div className="px-2 py-2 space-y-4">
            {/* Blue Banner Banner Card (对照图1顶部) */}
            <div className="relative w-full rounded-[16px] bg-gradient-to-r from-[#2f7bf6] via-[#3b82f6] to-[#60a5fa] p-4 text-white shadow-sm overflow-hidden flex items-center justify-between">
              <div className="relative z-10 space-y-1.5 max-w-[65%]">
                <h2 className="text-[18px] font-bold tracking-tight text-white leading-snug">
                  会议室预约 轻松办公
                </h2>
                <p className="text-[12px] text-blue-100 font-medium tracking-wide">
                  空闲可查 · 一键预约 · 扫码签到
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => handleOpenBookingForm()}
                    className="px-3.5 py-1.5 bg-white text-[#2f7bf6] text-[12px] font-bold rounded-full shadow-xs hover:bg-blue-50 active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>立即预约</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Banner Graphic Illustration */}
              <div className="w-24 h-24 relative pointer-events-none drop-shadow-md">
                <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                  <rect x="25" y="20" width="70" height="85" rx="12" fill="#FFFFFF" opacity="0.95" />
                  <rect x="35" y="32" width="50" height="6" rx="3" fill="#3B82F6" />
                  <rect x="35" y="44" width="35" height="4" rx="2" fill="#93C5FD" />
                  <rect x="35" y="52" width="45" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="35" y="60" width="28" height="4" rx="2" fill="#CBD5E1" />
                  <circle cx="80" cy="75" r="22" fill="#2563EB" />
                  <path d="M80 62 V75 H90" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="80" cy="75" r="3" fill="white" />
                </svg>
              </div>
            </div>

            {/* Quick Grid Navigation (5 Icons - 对照图1 middle) */}
            <div className="app-card p-3 border border-slate-100 shadow-2xs grid grid-cols-5 gap-1 text-center">
              {/* 全部会议室 */}
              <div
                onClick={() => setActiveView('all-rooms')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1 group-active:scale-95 transition-transform shadow-2xs">
                  <Building2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 tracking-tight">
                  全部会议室
                </span>
              </div>

              {/* 我的预约 */}
              <div
                onClick={() => setActiveView('my-bookings')}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0070f3] flex items-center justify-center mb-1 group-active:scale-95 transition-transform shadow-2xs">
                  <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 tracking-tight">
                  我的预约
                </span>
              </div>

              {/* 预约会议 (快速入口) */}
              <div
                onClick={() => handleOpenBookingForm()}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 group-active:scale-95 transition-transform shadow-2xs">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold text-[#0070f3] tracking-tight">
                  预约会议
                </span>
              </div>

              {/* 空闲会议室 */}
              <div
                onClick={() => {
                  setSelectedFacilityFilters([]);
                  setSelectedCapacityFilter(0);
                  setActiveView('all-rooms');
                  triggerToast('已切换至全部会议室视图');
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-active:scale-95 transition-transform shadow-2xs">
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 tracking-tight">
                  空闲会议室
                </span>
              </div>

              {/* 扫码签到 */}
              <div
                onClick={handleStartQrScan}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 group-active:scale-95 transition-transform shadow-2xs">
                  <QrCode className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 tracking-tight">
                  扫码签到
                </span>
              </div>
            </div>

            {/* Notification Notice Bar (对照图1) */}
            <div
              onClick={() => {
                setSelectedMeetingId('m1');
                setActiveView('detail');
              }}
              className="bg-blue-50/80 rounded-[14px] px-3.5 py-2.5 border border-blue-100 flex items-center justify-between text-[12px] text-slate-700 cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Bell className="w-4 h-4 text-[#0070f3] flex-shrink-0 stroke-[2.2]" />
                <span className="font-bold text-[#0070f3]">消息通知</span>
                <span className="text-slate-300">|</span>
                <span className="truncate text-slate-600">
                  您预约的『产品周会』将于 10:30 开始
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
            </div>

            {/* Section Header: 推荐会议室 (对照图1) */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight pl-0.5">
                推荐会议室
              </h3>
              <button
                onClick={() => setActiveView('all-rooms')}
                className="text-[12px] text-[#0070f3] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>查看更多</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Meeting Room Cards (对照图1) */}
            <div className="space-y-2">
              {mockRooms.map((room) => (
                <div
                  key={room.id}
                  className="app-card p-3 border border-slate-100 shadow-2xs flex gap-3 relative overflow-hidden"
                >
                  {/* Left Room Image */}
                  <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      {/* Name & Status */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">
                          {room.name}
                        </h4>
                        {room.status === 'available' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#12b886]" />
                            空闲中
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 stroke-[2.5]" />
                            {room.availableNote || '使用中'}
                          </span>
                        )}
                      </div>

                      {/* Building & Floor */}
                      <p className="text-[12px] text-slate-400 mt-0.5 font-normal">
                        {room.building} {room.floor}
                      </p>

                      {/* Capacity & Distance */}
                      <div className="flex items-center gap-3 text-[12px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          可容纳 {room.capacity} 人
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          距离 {room.distance}
                        </span>
                      </div>
                    </div>

                    {/* Tags & Action Button Row */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {room.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100/90 text-slate-600 text-[10px] font-medium rounded-md"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleOpenBookingForm(room)}
                        className="px-3.5 py-1.5 bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white text-[12px] font-bold rounded-full shadow-xs transition-all cursor-pointer flex-shrink-0"
                      >
                        立即预约
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 页面 1.5: 全部会议室 (全景画幅 + 动态筛选 + Timeline 图谱) ----------------- */}
      {activeView === 'all-rooms' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-10 bg-[#f4f5f8]">
          {/* Top Header */}
          <div className="px-2 py-3 app-plan-query-bg flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={() => setActiveView('home')}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
              全部会议室
            </h1>
            <button
              onClick={() => setActiveView('my-bookings')}
              className="text-[13px] text-[#0070f3] font-bold hover:underline cursor-pointer"
            >
              我的预约
            </button>
          </div>

          {/* Search Input Box */}
          <div className="p-3 bg-white border-b border-slate-100 sticky top-[53px] z-10 space-y-2.5">
            <div className="app-search-shell !bg-[#f8fafc] !border-slate-200/80 !backdrop-blur-none">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="搜索会议室 / 楼层 / 设备"
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                className="app-search-input"
              />
              {roomSearchQuery && (
                <button
                  onClick={() => setRoomSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Chips Horizontal Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 text-[12px]">
              {/* 全部园区 Dropdown */}
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all cursor-pointer flex-shrink-0 ${
                  selectedCampus !== '全部园区'
                    ? 'bg-[#0070f3] text-white shadow-xs'
                    : 'bg-[#eef2ff] text-[#0070f3] hover:bg-blue-100'
                }`}
              >
                <span>{selectedCampus}</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Building Filter Pills: A座 / B座 */}
              <button
                onClick={() =>
                  setSelectedBuildingFilter(selectedBuildingFilter === 'A座' ? 'all' : 'A座')
                }
                className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex-shrink-0 ${
                  selectedBuildingFilter === 'A座'
                    ? 'bg-[#0070f3] text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                A座
              </button>
              <button
                onClick={() =>
                  setSelectedBuildingFilter(selectedBuildingFilter === 'B座' ? 'all' : 'B座')
                }
                className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex-shrink-0 ${
                  selectedBuildingFilter === 'B座'
                    ? 'bg-[#0070f3] text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                B座
              </button>

              {/* 容纳 10 人以上 Dropdown */}
              <button
                onClick={() => setShowCapacityDropdown(!showCapacityDropdown)}
                className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-all cursor-pointer flex-shrink-0 ${
                  selectedCapacityFilter > 0
                    ? 'bg-blue-50 border border-blue-300 text-[#0070f3] font-bold'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <span>
                  {selectedCapacityFilter > 0 ? `容纳 ${selectedCapacityFilter}人以上` : '容纳人数 ∨'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
              </button>

              {/* Facility Chips */}
              {['投影仪', '视频会议'].map((fac) => {
                const isSelected = selectedFacilityFilters.includes(fac);
                return (
                  <button
                    key={fac}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedFacilityFilters(selectedFacilityFilters.filter((f) => f !== fac));
                      } else {
                        setSelectedFacilityFilters([...selectedFacilityFilters, fac]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer flex-shrink-0 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-300 text-[#0070f3] font-bold'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {fac}
                  </button>
                );
              })}

              {/* 高级筛选 Drawer */}
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 font-medium flex items-center gap-1 flex-shrink-0 hover:bg-slate-50 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>筛选</span>
              </button>
            </div>

            {/* Date Strip Bar (对照图: 周日 9 ~ 周六 15) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex-1 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 pr-2">
                {[
                  { day: '9', name: '周日', full: '6/9' },
                  { day: '10', name: '周一', full: '6/10' },
                  { day: '11', name: '周二', full: '6/11' },
                  { day: '12', name: '周三', full: '6/12' },
                  { day: '13', name: '周四', full: '6/13' },
                  { day: '14', name: '周五', full: '6/14' },
                  { day: '15', name: '周六', full: '6/15' }
                ].map((item) => {
                  const isSelected = selectedDateDay === item.day;
                  return (
                    <button
                      key={item.day}
                      onClick={() => setSelectedDateDay(item.day)}
                      className={`flex flex-col items-center justify-center px-2 py-1 rounded-2xl transition-all cursor-pointer min-w-[42px] ${
                        isSelected
                          ? 'bg-[#0070f3] text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[10px] opacity-80">{item.name}</span>
                      <span className="text-[15px] leading-tight my-0.5 font-bold">{item.day}</span>
                      <span className="text-[10px] opacity-75">{item.full}</span>
                    </button>
                  );
                })}
              </div>

              {/* 日历 Picker Button */}
              <button
                onClick={() => setShowCalendarPicker(true)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-700 flex-shrink-0 cursor-pointer ml-1"
              >
                <Calendar className="w-4 h-4 text-[#0070f3]" />
                <span className="text-[10px] font-bold mt-0.5">日历</span>
              </button>
            </div>
          </div>

          {/* Meeting Room Cards List */}
          <div className="px-2 py-2 space-y-2">
            {filteredRooms.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 space-y-2">
                <Building2 className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-[14px]">未找到符合条件的会议室</p>
                <button
                  onClick={() => {
                    setRoomSearchQuery('');
                    setSelectedCampus('全部园区');
                    setSelectedBuildingFilter('all');
                    setSelectedCapacityFilter(0);
                    setSelectedFacilityFilters([]);
                  }}
                  className="px-4 py-1.5 bg-blue-50 text-[#0070f3] font-bold text-[12px] rounded-full mt-2 cursor-pointer"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="app-card p-3 border border-slate-100 shadow-2xs space-y-2 relative overflow-hidden"
                >
                  {/* Top Room Basic Info */}
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-2xs">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info Column */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Name & Status Badge */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                            {room.name}
                          </h3>
                          {room.status === 'available' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0ca678] bg-[#e6fcf5] px-2.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#12b886]" />
                              空闲中
                            </span>
                          )}
                          {room.status === 'reserved' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f59f00] bg-[#fff9db] px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 stroke-[2.5]" />
                              {room.availableNote || '13:00 后可预约'}
                            </span>
                          )}
                          {room.status === 'near_full' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#f76707] bg-[#fff4e6] px-2.5 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                              已接近满约
                            </span>
                          )}
                        </div>

                        {/* Location & Capacity */}
                        <div className="flex items-center gap-3 text-[12px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {room.building} {room.floor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            容纳 {room.capacity} 人
                          </span>
                        </div>

                        {/* Equipment Icons Row */}
                        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                          {room.facilities.map((fac, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 flex items-center gap-1 text-[10px] text-slate-600 flex-shrink-0"
                            >
                              {renderFacilityIcon(fac)}
                              <span className="font-medium">{fac}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Booking Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleOpenBookingForm(room)}
                          className="px-4 py-1.5 bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white text-[12px] font-bold rounded-full shadow-2xs transition-all cursor-pointer"
                        >
                          立即预约
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Visualizer (对照图中的 1日 Timeline) */}
                  <div className="bg-[#f8fafc] rounded-xl p-2.5 border border-slate-100/80 space-y-2">
                    {/* Time Tick Marks */}
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>16:00</span>
                      <span>20:00</span>
                    </div>

                    {/* Progress Timeline Track */}
                    <div className="relative h-3 bg-slate-200/80 rounded-full overflow-hidden flex items-center">
                      {room.timelineSegments.map((seg, sIdx) => {
                        let segBg = 'bg-emerald-500'; // free
                        if (seg.type === 'occupied') segBg = 'bg-slate-300';
                        if (seg.type === 'bookable_pattern')
                          segBg = 'bg-amber-400 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.4)_75%,transparent_75%,transparent)] bg-[length:12px_12px]';

                        return (
                          <div
                            key={sIdx}
                            style={{ width: `${seg.widthPct}%` }}
                            className={`h-full ${segBg} transition-all border-r border-white/40 last:border-r-0`}
                            title={seg.label}
                          />
                        );
                      })}

                      {/* Current Time Pointer Marker */}
                      {room.currentTimePosPct && (
                        <div
                          style={{ left: `${room.currentTimePosPct}%` }}
                          className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-10"
                        />
                      )}
                    </div>

                    {/* Current Time Pointer Tag & Legend */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 px-0.5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                          空闲
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-xs bg-slate-300" />
                          已预约
                        </span>
                        {room.status === 'reserved' && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-xs bg-amber-400" />
                            可预约时段
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[#0070f3] font-bold">
                        <span className="text-[10px]">▲</span>
                        <span>当前时间 10:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----------------- 页面 2: 我的预约 (对照图2) ----------------- */}
      {activeView === 'my-bookings' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-10">
          {/* Header */}
          <div className="px-2 py-3 app-plan-query-bg flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={() => setActiveView('home')}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
              我的预约
            </h1>
            <div className="w-8" />
          </div>

          {/* Filter Categories Horizontal Tabs (对照图2顶部: 全部, 待开始, 进行中, 已完成, 已取消) */}
          <div className="bg-white px-3 py-2 flex items-center justify-between border-b border-slate-100 text-[13px] font-bold">
            <button
              onClick={() => setBookingFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingFilter === 'all'
                  ? 'bg-[#0070f3] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setBookingFilter('pending')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingFilter === 'pending'
                  ? 'bg-[#0070f3] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              待开始
            </button>
            <button
              onClick={() => setBookingFilter('ongoing')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingFilter === 'ongoing'
                  ? 'bg-[#0070f3] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setBookingFilter('completed')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingFilter === 'completed'
                  ? 'bg-[#0070f3] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              已完成
            </button>
            <button
              onClick={() => setBookingFilter('canceled')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingFilter === 'canceled'
                  ? 'bg-[#0070f3] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              已取消
            </button>
          </div>

          {/* Search & Date Picker Filter Row (对照图2) */}
          <div className="px-2 py-2 flex items-center gap-2">
            <div className="app-search-shell flex-1 !bg-white !border-slate-200/80 !backdrop-blur-none">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="搜索会议主题 / 会议室"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="app-search-input"
              />
            </div>

            <button
              onClick={() => triggerToast('修改查询时间范围')}
              className="bg-white rounded-xl px-3 py-2 border border-slate-200/80 flex items-center gap-1.5 text-[12px] text-slate-700 font-medium flex-shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateRangeText}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
            </button>
          </div>

          {/* Booking Cards List (对照图2) */}
          <div className="px-2 space-y-2">
            {filteredMeetings.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 space-y-2">
                <CalendarCheck className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-[14px]">暂无符合条件的会议预约</p>
              </div>
            ) : (
              filteredMeetings.map((item) => (
                <div
                  key={item.id}
                  className="app-card p-4 border border-slate-100 shadow-2xs space-y-2"
                >
                  {/* Card Title & Status Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">
                      {item.title}
                    </h3>

                    {item.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0070f3] text-[12px] font-bold">
                        待开始
                      </span>
                    )}
                    {item.status === 'ongoing' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[12px] font-bold">
                        进行中
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[12px] font-bold">
                        已完成
                      </span>
                    )}
                    {item.status === 'canceled' && (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[12px] font-bold">
                        已取消
                      </span>
                    )}
                  </div>

                  {/* Info Metadata Lines */}
                  <div className="space-y-1.5 text-[13px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        {item.roomName} {item.roomFloor}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>参会 {item.attendeesCount} 人</span>
                    </div>

                    <div className="flex items-center gap-3 pt-0.5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>
                          {item.date} ({item.dayOfWeek})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>
                          {item.timeSlot} ({item.durationMinutes}分钟)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Blue Alert Banner if Pending (对照图2 第一张卡片) */}
                  {item.notice && item.status === 'pending' && (
                    <div className="bg-blue-50/80 rounded-xl px-3 py-2 text-[12px] text-[#0070f3] font-medium flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
                        <span>{item.notice}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Action Buttons Row (对照图2) */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-50">
                    {/* 待开始 / 进行中状态的操作 */}
                    {(item.status === 'pending' || item.status === 'ongoing') && (
                      <>
                        <button
                          onClick={handleStartQrScan}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-[12px] font-bold flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>扫码签到</span>
                        </button>

                        {item.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedMeetingId(item.id);
                              setShowCancelConfirmModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-bold hover:bg-slate-50 cursor-pointer"
                          >
                            取消预约
                          </button>
                        )}
                      </>
                    )}

                    {/* 已完成状态的操作 */}
                    {item.status === 'completed' && (
                      <>
                        <button
                          onClick={() => handleOpenBookingForm()}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-[12px] font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          再次预约
                        </button>

                        <button
                          onClick={() => setShowEvaluateModal(true)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-[12px] font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          评价
                        </button>
                      </>
                    )}

                    {/* 已取消状态的操作 */}
                    {item.status === 'canceled' && (
                      <button
                        onClick={() => handleOpenBookingForm()}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-[12px] font-bold hover:bg-slate-50 cursor-pointer"
                      >
                        再次预约
                      </button>
                    )}

                    {/* 查看详情按钮 (蓝色按钮) */}
                    <button
                      onClick={() => {
                        setSelectedMeetingId(item.id);
                        setActiveView('detail');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white text-[12px] font-bold shadow-xs transition-all cursor-pointer"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----------------- 页面 3: 会议详情 (对照图3) ----------------- */}
      {activeView === 'detail' && (
        <div className="flex-1 flex flex-col overflow-y-auto pb-20">
          {/* Header */}
          <div className="px-2 py-3 app-plan-query-bg flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={() => setActiveView('my-bookings')}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
              会议详情
            </h1>
            <div className="w-8" />
          </div>

          <div className="px-2 py-2 space-y-4">
            {/* Top Meeting Info Card (对照图3) */}
            <div className="app-card p-4 border border-slate-100 shadow-2xs relative overflow-hidden flex items-center justify-between">
              <div className="space-y-2 max-w-[65%]">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0ca678] bg-[#e6fcf5] px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12b886]" />
                  {currentMeeting.status === 'canceled' ? '已取消' : '已预约'}
                </span>

                <h2 className="text-[18px] font-bold text-slate-900 tracking-tight leading-snug">
                  {currentMeeting.title}
                </h2>

                <div className="space-y-1 text-[13px] text-slate-600 pt-1">
                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">主持人</span>
                    <span className="font-medium text-slate-900">
                      {currentMeeting.host}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">会议室</span>
                    <span className="font-medium text-slate-900">
                      {currentMeeting.roomName} ({currentMeeting.capacity}人)
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">日 期</span>
                    <span className="font-medium text-slate-900">
                      {currentMeeting.date} {currentMeeting.dayOfWeek}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="text-slate-400">时 间</span>
                    <span className="font-medium text-slate-900">
                      {currentMeeting.timeSlot} ({currentMeeting.durationMinutes}分钟)
                    </span>
                  </p>
                </div>
              </div>

              {/* Top Right Calendar Illustration Graphic (对照图3) */}
              <div className="w-28 h-28 relative pointer-events-none drop-shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                  <circle cx="60" cy="60" r="45" fill="#E0F2FE" />
                  <rect x="35" y="30" width="50" height="60" rx="10" fill="white" className="drop-shadow-sm" />
                  <rect x="35" y="30" width="50" height="18" rx="8" fill="#3B82F6" />
                  <circle cx="45" cy="38" r="2.5" fill="white" />
                  <circle cx="75" cy="38" r="2.5" fill="white" />
                  <circle cx="60" cy="65" r="16" fill="#2563EB" />
                  <path d="M52 65 L57 70 L68 58" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Section 2: 参会人 (对照图3) */}
            <div className="app-card p-4 border border-slate-100 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-slate-900">
                  参会人 ({currentMeeting.attendeesCount}人)
                </h3>
                <button
                  onClick={() => triggerToast('展示全部参会人员名单')}
                  className="text-[12px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                >
                  <span>查看全部</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                {currentMeeting.attendeesAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Attendee"
                    className="w-10 h-10 rounded-full object-cover border border-slate-100 flex-shrink-0"
                  />
                ))}
                {currentMeeting.attendeesCount > currentMeeting.attendeesAvatars.length && (
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold text-[12px] flex items-center justify-center flex-shrink-0">
                    +{currentMeeting.attendeesCount - currentMeeting.attendeesAvatars.length}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: 会议室信息 (对照图3) */}
            <div className="app-card p-4 border border-slate-100 shadow-2xs space-y-2">
              <h3 className="text-[15px] font-bold text-slate-900">
                会议室信息
              </h3>

              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=300&q=80"
                  alt="Room"
                  className="w-24 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                />

                <div className="space-y-1.5 flex-1">
                  <h4 className="text-[15px] font-bold text-slate-900">
                    {currentMeeting.roomName} ({currentMeeting.capacity}人)
                  </h4>

                  {/* Facility Icons Tag List */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-blue-500" />
                      投影仪
                    </span>
                    <span className="flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-blue-500" />
                      白板
                    </span>
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-blue-500" />
                      Wi-Fi
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                      视频会议
                    </span>
                  </div>

                  <p className="text-[12px] text-slate-400 flex items-start gap-1 leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{currentMeeting.locationDetail || '上海总部大厦 12F 浦东新区世纪大道 123 号'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: 签到方式 (对照图3) */}
            <div className="app-card p-4 border border-slate-100 shadow-2xs space-y-3">
              <h3 className="text-[15px] font-bold text-slate-900">
                签到方式
              </h3>

              <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {/* QR Code Graphic Box */}
                <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>

                <div className="space-y-1 flex-1">
                  <h4 className="text-[14px] font-bold text-slate-900">
                    扫码签到
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    请在会议开始前 10 分钟内完成签到
                  </p>
                  <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3 stroke-[2.5]" />
                    <span>{currentMeeting.qrCodeTime || '待签到 (将于 10:50 开放签到)'}</span>
                  </p>
                </div>
              </div>

              {/* QR Code Action Button */}
              <div className="pt-1">
                <button
                  onClick={handleStartQrScan}
                  className="w-full py-2.5 bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white font-bold text-[13px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>扫码签到</span>
                </button>
              </div>
            </div>

            {/* Section 5: 温馨提示 (对照图3) */}
            <div className="app-card p-4 border border-slate-100 shadow-2xs space-y-2.5">
              <h3 className="text-[15px] font-bold text-slate-900">
                温馨提示
              </h3>

              <div className="space-y-2 text-[12px] text-slate-600">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>建议提前 10 分钟到达会议室，做好会前准备。</span>
                </div>

                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>会议期间请将手机调至静音或振动模式。</span>
                </div>

                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>请保持会议室环境整洁，会议结束后带走个人物品。</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Action: 取消预约 (对照图3底部) */}
          {currentMeeting.status !== 'canceled' && (
            <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-white/90 backdrop-blur-md border-t border-slate-100 z-30 max-w-md mx-auto">
              <button
                onClick={() => setShowCancelConfirmModal(true)}
                className="w-full py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 active:scale-98 font-bold text-[14px] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>取消预约</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ----------------- 页面 5: 预约会议 独立界面 (对照设计图) ----------------- */}
      {activeView === 'book-meeting' && (
        <BookMeetingPage
          initialRoom={
            selectedRoomForBooking
              ? { name: selectedRoomForBooking.name, location: selectedRoomForBooking.locationDetail }
              : undefined
          }
          onBack={() => setActiveView('home')}
          onSuccess={handleBookMeetingSuccess}
        />
      )}

      {/* ----------------- MODAL 1: 发起/预约会议 表单 MODAL ----------------- */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[28px] w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[17px] font-bold text-slate-900">
                发起会议预约
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-3.5">
              {/* 会议主题 */}
              <div className="space-y-1">
                <label className="app-form-label">
                  会议主题 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="例如: 产品需求评审会"
                  className="app-form-control"
                />
              </div>

              {/* 预订会议室 */}
              <div className="space-y-1">
                <label className="app-form-label">
                  选择会议室
                </label>
                <select
                  value={selectedRoomForBooking?.id || mockRooms[0].id}
                  onChange={(e) => {
                    const found = mockRooms.find((r) => r.id === e.target.value);
                    if (found) setSelectedRoomForBooking(found);
                  }}
                  className="app-form-select"
                >
                  {mockRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.floor} / 可容纳{r.capacity}人)
                    </option>
                  ))}
                </select>
              </div>

              {/* 日期与时间 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="app-form-label">
                    会议日期
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="app-form-control"
                  />
                </div>

                <div className="space-y-1">
                  <label className="app-form-label">
                    时间段
                  </label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    className="app-form-select"
                  >
                    <option value="10:00 - 11:30">10:00 - 11:30</option>
                    <option value="11:00 - 12:00">11:00 - 12:00</option>
                    <option value="14:00 - 15:30">14:00 - 15:30</option>
                    <option value="16:00 - 17:30">16:00 - 17:30</option>
                  </select>
                </div>
              </div>

              {/* 主持人与参会人数 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="app-form-label">
                    主持人
                  </label>
                  <input
                    type="text"
                    value={formHost}
                    onChange={(e) => setFormHost(e.target.value)}
                    className="app-form-control"
                  />
                </div>

                <div className="space-y-1">
                  <label className="app-form-label">
                    参会人数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formAttendeesCount}
                    onChange={(e) => setFormAttendeesCount(Number(e.target.value))}
                    className="app-form-control"
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0070f3] hover:bg-[#005bb5] text-white text-[15px] font-bold rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  确认发起预约
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: 扫码签到 仿真 MODAL ----------------- */}
      {showQrScanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-between p-6 animate-fade-in text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold">扫码签到</h3>
            <button
              onClick={() => setShowQrScanModal(false)}
              className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Viewfinder square */}
            <div className="w-64 h-64 border-2 border-blue-400 rounded-3xl relative flex items-center justify-center overflow-hidden bg-black/30 shadow-2xl">
              <div className="w-full h-0.5 bg-blue-400 absolute top-0 animate-bounce shadow-md" />
              <Camera className="w-12 h-12 text-blue-300 opacity-60" />
            </div>
            <p className="text-xs text-slate-300 mt-4">
              请将会议室门口的二维码对准框内
            </p>

            {scanSuccessToast && (
              <div className="absolute bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-bounce shadow-xl">
                <CheckCircle2 className="w-5 h-5" />
                <span>签到成功！</span>
              </div>
            )}
          </div>

          <div className="text-center pb-4">
            <button
              onClick={handleSimulateScanComplete}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg cursor-pointer"
            >
              模拟扫码识别
            </button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: 会议室导航 MODAL ----------------- */}
      {showNavigationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="app-modal p-5 max-w-xs w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowNavigationModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Navigation className="w-8 h-8 stroke-[2]" />
            </div>

            <div>
              <h3 className="text-[17px] font-bold text-slate-900">室内路线指引</h3>
              <p className="text-[13px] text-slate-500 mt-1">
                前往【{navigationTargetRoom || '海纳会议室 A01'}】
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-left text-[12px] text-slate-600 space-y-1.5 border border-slate-100">
              <p className="font-bold text-slate-800">📍 路线说明：</p>
              <p>1. 乘主大厅 A 区电梯至 3 楼</p>
              <p>2. 出电梯后向左直行 30 米</p>
              <p>3. 经过茶水间后右侧即达</p>
            </div>

            <button
              onClick={() => setShowNavigationModal(false)}
              className="w-full py-2.5 bg-[#0070f3] text-white font-bold text-[14px] rounded-xl cursor-pointer"
            >
              开始导航
            </button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: 评价会议 MODAL ----------------- */}
      {showEvaluateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="app-modal p-5 max-w-xs w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[16px] font-bold text-slate-900">评价本次会议</h3>
              <button
                onClick={() => setShowEvaluateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setEvalRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= evalRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="输入您对会议室设备、环境的反馈评价..."
              value={evalComment}
              onChange={(e) => setEvalComment(e.target.value)}
              className="app-form-textarea"
            />

            <button
              onClick={() => {
                setShowEvaluateModal(false);
                triggerToast('感谢您的评价！');
              }}
              className="w-full py-2.5 bg-[#0070f3] text-white font-bold text-[14px] rounded-xl cursor-pointer"
            >
              提交评价
            </button>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 5: 取消预约确认 MODAL ----------------- */}
      {showCancelConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="app-modal p-5 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <h3 className="text-[16px] font-bold text-slate-900">确认取消预约？</h3>
              <p className="text-[12px] text-slate-500 mt-1">
                取消后该会议室将重新开放给其他人借用
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setShowCancelConfirmModal(false)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] rounded-xl cursor-pointer"
              >
                暂不取消
              </button>
              <button
                onClick={handleConfirmCancelMeeting}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[13px] rounded-xl cursor-pointer"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 6: 选择园区 Popup ----------------- */}
      {showCampusDropdown && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="app-bottom-sheet sm:rounded-[20px] p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">选择园区</h3>
              <button
                onClick={() => setShowCampusDropdown(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {['全部园区', '张江园区', '临港园区', '曹河泾园区'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCampus(c);
                    setShowCampusDropdown(false);
                    triggerToast(`已切换园区：${c}`);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-left font-bold text-[14px] flex items-center justify-between transition-all cursor-pointer ${
                    selectedCampus === c
                      ? 'bg-blue-50 text-[#0070f3]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{c}</span>
                  {selectedCampus === c && <CheckCircle2 className="w-4 h-4 text-[#0070f3]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 7: 选择容纳人数 Popup ----------------- */}
      {showCapacityDropdown && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="app-bottom-sheet sm:rounded-[20px] p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">选择容纳人数</h3>
              <button
                onClick={() => setShowCapacityDropdown(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { label: '不限人数', val: 0 },
                { label: '容纳 8 人以上', val: 8 },
                { label: '容纳 10 人以上', val: 10 },
                { label: '容纳 15 人以上', val: 15 },
                { label: '容纳 20 人以上', val: 20 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    setSelectedCapacityFilter(item.val);
                    setShowCapacityDropdown(false);
                    triggerToast(`筛选：${item.label}`);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-left font-bold text-[14px] flex items-center justify-between transition-all cursor-pointer ${
                    selectedCapacityFilter === item.val
                      ? 'bg-blue-50 text-[#0070f3]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedCapacityFilter === item.val && (
                    <CheckCircle2 className="w-4 h-4 text-[#0070f3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 8: 高级筛选 Drawer ----------------- */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fade-in">
          <div className="app-bottom-sheet p-5 w-full max-w-md space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[17px] font-bold text-slate-900">高级筛选</h3>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 楼栋选择 */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800">楼栋座号</label>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'A座', 'B座'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBuildingFilter(b)}
                    className={`py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                      selectedBuildingFilter === b
                        ? 'bg-[#0070f3] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b === 'all' ? '全部座号' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* 设备要求 */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-800">设备要求</label>
              <div className="grid grid-cols-3 gap-2">
                {['投影仪', '白板', '视频会议', '电视', '音响', '电板'].map((fac) => {
                  const isSel = selectedFacilityFilters.includes(fac);
                  return (
                    <button
                      key={fac}
                      onClick={() => {
                        if (isSel) {
                          setSelectedFacilityFilters(selectedFacilityFilters.filter((f) => f !== fac));
                        } else {
                          setSelectedFacilityFilters([...selectedFacilityFilters, fac]);
                        }
                      }}
                      className={`py-2 px-2 rounded-xl text-[12px] font-bold transition-all border cursor-pointer ${
                        isSel
                          ? 'bg-blue-50 border-[#0070f3] text-[#0070f3]'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {fac}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedBuildingFilter('all');
                  setSelectedCapacityFilter(0);
                  setSelectedFacilityFilters([]);
                  setSelectedCampus('全部园区');
                }}
                className="py-3 bg-slate-100 text-slate-700 font-bold text-[14px] rounded-2xl hover:bg-slate-200 cursor-pointer"
              >
                重置
              </button>
              <button
                onClick={() => {
                  setShowFilterDrawer(false);
                  triggerToast('筛选完成');
                }}
                className="py-3 bg-[#0070f3] text-white font-bold text-[14px] rounded-2xl shadow-md hover:bg-blue-600 cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 9: 日历选择 Modal ----------------- */}
      {showCalendarPicker && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="app-modal p-5 max-w-xs w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-[16px] font-bold text-slate-900">选择预约日期</h3>
              <button
                onClick={() => setShowCalendarPicker(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center font-bold text-[15px] text-[#0070f3]">
              2025年 6月
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-slate-400">
              <span>日</span>
              <span>一</span>
              <span>二</span>
              <span>三</span>
              <span>四</span>
              <span>五</span>
              <span>六</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((dayNum) => {
                const isSelected = selectedDateDay === String(dayNum);
                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      setSelectedDateDay(String(dayNum));
                      setShowCalendarPicker(false);
                      triggerToast(`已切换至 2025-06-${dayNum < 10 ? '0' + dayNum : dayNum}`);
                    }}
                    className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0070f3] text-white shadow-xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowCalendarPicker(false)}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold text-[13px] rounded-xl cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
