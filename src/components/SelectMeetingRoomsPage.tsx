import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Search,
  Users,
  MapPin,
  Clock,
  Check,
  X,
  Filter,
  Building,
  RotateCcw
} from 'lucide-react';

export interface RoomOption {
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
}

export const ALL_MEETING_ROOMS: RoomOption[] = [
  {
    id: 'r1',
    name: '海纳会议室 A01',
    code: 'A01',
    building: 'A座',
    floor: '3F',
    campus: '上海总部',
    capacity: 12,
    distance: '120m',
    status: 'available',
    availableNote: '空闲中',
    facilities: ['投影仪', '白板', '视频会议', '音响'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 A座 3F 301室'
  },
  {
    id: 'r2',
    name: '云程会议室 B12',
    code: 'B12',
    building: 'B座',
    floor: '12F',
    campus: '上海总部',
    capacity: 16,
    distance: '230m',
    status: 'reserved',
    availableNote: '13:00 后可预约',
    facilities: ['投影仪', '电视', '白板', '视频会议'],
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 B座 12F 1202室'
  },
  {
    id: 'r3',
    name: '智汇会议室 A05',
    code: 'A05',
    building: 'A座',
    floor: '5F',
    campus: '上海总部',
    capacity: 20,
    distance: '180m',
    status: 'near_full',
    availableNote: '已接近满约',
    facilities: ['投影仪', '电板', '白板', '音响'],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 A座 5F 508室'
  },
  {
    id: 'r4',
    name: '启航会议室 B03',
    code: 'B03',
    building: 'B座',
    floor: '3F',
    campus: '上海总部',
    capacity: 8,
    distance: '200m',
    status: 'available',
    availableNote: '空闲中',
    facilities: ['电视', '白板', '视频会议'],
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80',
    locationDetail: '上海总部大厦 B座 3F 305室'
  },
  {
    id: 'r5',
    name: '顺德分公司-视频会议室',
    code: 'SD-01',
    building: '顺德分部',
    floor: '2F',
    campus: '广东分部',
    capacity: 25,
    distance: '远端连线',
    status: 'available',
    availableNote: '空闲中',
    facilities: ['双屏视频终端', '高清摄像机', '电子白板'],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
    locationDetail: '顺德研发基地 2F 视频会议室'
  },
  {
    id: 'r6',
    name: '总部深圳-信托2楼会议室',
    code: 'SZ-02',
    building: '信托大厦',
    floor: '2F',
    campus: '深圳总部',
    capacity: 18,
    distance: '远端连线',
    status: 'available',
    availableNote: '空闲中',
    facilities: ['高清投影', '全向麦克风', '视频会议'],
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    locationDetail: '深圳信托大厦 2F 206室'
  }
];

export interface SelectMeetingRoomsPageProps {
  selectedRoomNames: string[];
  onConfirm: (rooms: string[]) => void;
  onCancel: () => void;
}

export const SelectMeetingRoomsPage: React.FC<SelectMeetingRoomsPageProps> = ({
  selectedRoomNames,
  onConfirm,
  onCancel
}) => {
  // 当前已选会议室列表
  const [selectedList, setSelectedList] = useState<string[]>(selectedRoomNames || []);

  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 状态过滤 Tab: 'all' | 'available'
  const [filterType, setFilterType] = useState<'all' | 'available'>('available');

  // 切换会议室选中/取消
  const handleToggleRoom = (roomName: string) => {
    if (selectedList.includes(roomName)) {
      setSelectedList(prev => prev.filter(r => r !== roomName));
    } else {
      setSelectedList(prev => [...prev, roomName]);
    }
  };

  // 过滤会议室
  const filteredRooms = useMemo(() => {
    return ALL_MEETING_ROOMS.filter(room => {
      // 过滤搜索词
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = room.name.toLowerCase().includes(q);
        const matchCode = room.code.toLowerCase().includes(q);
        const matchBuilding = `${room.building} ${room.floor}`.toLowerCase().includes(q);
        const matchFacilities = room.facilities.some(f => f.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchBuilding && !matchFacilities) {
          return false;
        }
      }

      // 仅看空闲
      if (filterType === 'available' && room.status !== 'available') {
        return false;
      }

      return true;
    });
  }, [searchQuery, filterType]);

  return (
    <div className="fixed inset-0 z-50 bg-[#f4f5f8] flex flex-col select-none overflow-hidden animate-fade-in font-sans">
      {/* 顶部导航 Header (对照原型图2) */}
      <div className="px-4 py-3 bg-white flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-2xs">
        <button
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center -ml-1.5 rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          选择会议室
        </h1>

        <button
          onClick={() => setSelectedList([])}
          disabled={selectedList.length === 0}
          className="text-[13px] text-[#0070f3] disabled:text-slate-300 font-medium hover:underline cursor-pointer"
        >
          清空
        </button>
      </div>

      {/* 搜索与过滤栏 */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100 space-y-2.5">
        {/* 搜索框 */}
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索会议室 / 楼层 / 设备"
            className="w-full bg-[#f4f5f8] rounded-xl pl-9 pr-8 py-2 text-[13px] text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 快捷过滤标签 */}
        <div className="flex items-center gap-2 text-[12px]">
          <button
            onClick={() => setFilterType('available')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              filterType === 'available'
                ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ● 空闲会议室
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-blue-50 text-[#0070f3] font-bold border border-blue-200/60'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部会议室 ({ALL_MEETING_ROOMS.length})
          </button>
        </div>
      </div>

      {/* 会议室列表内容区 (对照图2样式) */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-3.5">
        {filteredRooms.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Building className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="text-[14px]">暂无匹配的会议室</p>
          </div>
        ) : (
          filteredRooms.map(room => {
            const isSelected = selectedList.includes(room.name);

            return (
              <div
                key={room.id}
                className={`bg-white rounded-[20px] p-3.5 border transition-all flex gap-3.5 relative overflow-hidden shadow-2xs ${
                  isSelected
                    ? 'border-[#0070f3] ring-1 ring-[#0070f3]/20 bg-blue-50/10'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* 左侧会议室实景图片 (对照图2) */}
                <div className="w-[110px] h-[110px] rounded-[16px] overflow-hidden flex-shrink-0 bg-slate-100 relative">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 右侧会议室详细信息 (对照图2) */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                  <div>
                    {/* 会议室名称与状态标签 (对照图2) */}
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-[15px] font-bold text-slate-900 tracking-tight truncate">
                        {room.name}
                      </h3>

                      {/* 状态徽章 */}
                      {room.status === 'available' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0ca678] bg-[#e6fcf5] px-2 py-0.5 rounded-full shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#12b886]" />
                          空闲中
                        </span>
                      ) : room.status === 'reserved' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                          <Clock className="w-3 h-3 stroke-[2.5]" />
                          {room.availableNote || '使用中'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full shrink-0">
                          <Clock className="w-3 h-3 stroke-[2.5]" />
                          {room.availableNote || '已接近满约'}
                        </span>
                      )}
                    </div>

                    {/* 楼栋与楼层 (对照图2: A座 3F) */}
                    <p className="text-[12px] text-slate-400 mt-0.5 font-normal">
                      {room.building} {room.floor}
                    </p>

                    {/* 容纳人数与距离 (对照图2: 可容纳 12 人 | 距离 120m) */}
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

                  {/* 设施标签与操作按钮行 (对照图2: 立即预约 vs 取消预约) */}
                  <div className="flex items-center justify-between pt-2">
                    {/* 设施标签 */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {room.facilities.slice(0, 3).map((facility, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#f1f3f7] text-slate-600 text-[11px] font-medium rounded-md"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    {/* 预约/取消预约 操作按钮 (对照要求: 已选显示取消预约，支持多选) */}
                    {isSelected ? (
                      <button
                        onClick={() => handleToggleRoom(room.name)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[12px] font-bold rounded-full border border-rose-200/80 active:scale-95 transition-all cursor-pointer shrink-0 shadow-2xs"
                      >
                        取消预约
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleRoom(room.name)}
                        className="px-3.5 py-1.5 bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white text-[12px] font-bold rounded-full shadow-xs transition-all cursor-pointer shrink-0"
                      >
                        立即预约
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 底部固定确认栏 (支持选择多个并提交) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between max-w-md mx-auto z-30 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[14px] text-slate-700 font-medium">
            已选择:{' '}
            <span className="text-[#0070f3] font-bold text-[16px]">
              {selectedList.length}
            </span>{' '}
            间会议室
          </span>
          {selectedList.length > 0 && (
            <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {selectedList.join('、')}
            </span>
          )}
        </div>

        <button
          onClick={() => onConfirm(selectedList)}
          className="bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white text-[15px] font-bold px-7 py-2.5 rounded-[10px] transition-all shadow-xs cursor-pointer"
        >
          确定
        </button>
      </div>
    </div>
  );
};
