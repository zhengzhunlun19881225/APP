import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Users,
  Video,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Shield,
  Bell,
  Lock,
  Radio,
  Disc,
  Share2
} from 'lucide-react';
import { Avatar } from './Avatar';
import { initialContacts } from '../data/mockData';
import { SelectAttendeesPage, AttendeePerson, MOCK_ALL_ATTENDEES } from './SelectAttendeesPage';
import { SelectMeetingRoomsPage } from './SelectMeetingRoomsPage';

export interface BookMeetingPageProps {
  onBack: () => void;
  onSuccess?: (meetingData: any) => void;
  initialRoom?: {
    name: string;
    location?: string;
  };
}

export const BookMeetingPage: React.FC<BookMeetingPageProps> = ({
  onBack,
  onSuccess,
  initialRoom
}) => {
  // 会议主题 / 预订人
  const [topic, setTopic] = useState<string>('芦丽云预定的会议');

  // 开始与结束时间
  const [startDateStr, setStartDateStr] = useState<string>('04月08日 周五');
  const [startTimeStr, setStartTimeStr] = useState<string>('14:00');
  const [endDateStr, setEndDateStr] = useState<string>('04月08日 周五');
  const [endTimeStr, setEndTimeStr] = useState<string>('15:00');

  // 会议类型: '视频会议' | '本地会议'
  const [meetingType, setMeetingType] = useState<'视频会议' | '本地会议'>('视频会议');
  const [showTypeSheet, setShowTypeSheet] = useState<boolean>(false);

  // 调试时间
  const [debugTime, setDebugTime] = useState<string>('04月08日 13:45');
  const [showTimePickerModal, setShowTimePickerModal] = useState<boolean>(false);
  const [timePickerTarget, setTimePickerTarget] = useState<'debug' | 'start' | 'end'>('debug');

  // 重复周期 / 频率
  const [repeatFrequency, setRepeatFrequency] = useState<string>('不重复');
  const [showRepeatSheet, setShowRepeatSheet] = useState<boolean>(false);

  // 参会方 (预设 6 人，与原型图对照)
  const [attendees, setAttendees] = useState<AttendeePerson[]>([
    MOCK_ALL_ATTENDEES[0], // 员工0002
    MOCK_ALL_ATTENDEES[1], // 员工0001
    MOCK_ALL_ATTENDEES[2], // 员工003
    MOCK_ALL_ATTENDEES[3], // 石梁雅
    MOCK_ALL_ATTENDEES[4], // 董巧琬
    MOCK_ALL_ATTENDEES[5]  // 官文
  ]);
  const [showAttendeeModal, setShowAttendeeModal] = useState<boolean>(false);

  // 会议室 (预设 海纳会议室 A01，与原型图对照)
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    initialRoom?.name
      ? [initialRoom.name]
      : ['海纳会议室 A01']
  );
  const [showRoomPickerModal, setShowRoomPickerModal] = useState<boolean>(false);

  // 高级设置 Accordion
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [meetingNotice, setMeetingNotice] = useState<string>('短信、邮件');
  const [showNoticeSheet, setShowNoticeSheet] = useState<boolean>(false);
  const [meetingPassword, setMeetingPassword] = useState<string>('845729');
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [tencentMeetingEnabled, setTencentMeetingEnabled] = useState<boolean>(true);
  const [liveStreamEnabled, setLiveStreamEnabled] = useState<boolean>(true);
  const [recordingEnabled, setRecordingEnabled] = useState<boolean>(true);

  // 临时时间选择器状态 (用于滚轮选择器)
  const [tempDateIdx, setTempDateIdx] = useState<number>(2); // 2022-05-20 周五
  const [tempHourIdx, setTempHourIdx] = useState<number>(18);
  const [tempMinuteIdx, setTempMinuteIdx] = useState<number>(0);

  const availableDates = [
    { label: '2022-05-18 周三', short: '05月18日 周三', isToday: false },
    { label: '2022-05-19 周四', short: '05月19日 周四', isToday: false },
    { label: '2022-05-20 周五', short: '05月20日 周五', isToday: true },
    { label: '2022-05-21 周六', short: '05月21日 周六', isToday: false },
    { label: '2022-05-22 周日', short: '05月22日 周日', isToday: false },
    { label: '2022-05-23 周一', short: '05月23日 周一', isToday: false },
    { label: '2022-05-24 周二', short: '05月24日 周二', isToday: false }
  ];

  const availableRoomsList = [
    '顺德分公司-视频会议室',
    '总部深圳-信托2楼会议室',
    '海纳会议室 A01 (3F)',
    '云程会议室 B12 (12F)',
    '智汇会议室 A05 (5F)',
    '启航会议室 B03 (3F)',
    '广州分中心-302多功能厅'
  ];

  // 移除会议室
  const handleRemoveRoom = (roomName: string) => {
    setSelectedRooms(selectedRooms.filter(r => r !== roomName));
  };

  // 切换会议室选中
  const handleToggleRoom = (roomName: string) => {
    if (selectedRooms.includes(roomName)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomName));
    } else {
      setSelectedRooms([...selectedRooms, roomName]);
    }
  };

  // 确认时间选择
  const handleConfirmTimePicker = () => {
    const selectedDate = availableDates[tempDateIdx];
    const hourStr = tempHourIdx < 10 ? `0${tempHourIdx}` : `${tempHourIdx}`;
    const minStr = tempMinuteIdx < 10 ? `0${tempMinuteIdx}` : `${tempMinuteIdx}`;
    const formattedTime = `${hourStr}:${minStr}`;

    if (timePickerTarget === 'debug') {
      setDebugTime(`${selectedDate.short.split(' ')[0]} ${formattedTime}`);
    } else if (timePickerTarget === 'start') {
      setStartDateStr(selectedDate.short);
      setStartTimeStr(formattedTime);
    } else if (timePickerTarget === 'end') {
      setEndDateStr(selectedDate.short);
      setEndTimeStr(formattedTime);
    }
    setShowTimePickerModal(false);
  };

  // 重置时间选择
  const handleResetTimePicker = () => {
    setTempDateIdx(2);
    setTempHourIdx(14);
    setTempMinuteIdx(0);
  };

  // 提交预约
  const handleBookSubmit = () => {
    const newMeetingData = {
      id: `m_${Date.now()}`,
      title: topic || '芦丽云预定的会议',
      host: '芦丽云',
      roomName: selectedRooms[0] || '默认视频会议室',
      rooms: selectedRooms,
      roomFloor: '2F/多地连线',
      capacity: 20,
      date: startDateStr,
      timeSlot: `${startTimeStr} - ${endTimeStr}`,
      durationMinutes: 60,
      status: 'pending',
      meetingType,
      debugTime,
      repeatFrequency,
      attendeesCount: attendees.length,
      attendeesAvatars: attendees.map(a => a.avatar),
      tencentMeeting: tencentMeetingEnabled,
      liveStream: liveStreamEnabled,
      recording: recordingEnabled,
      password: meetingPassword
    };

    if (onSuccess) {
      onSuccess(newMeetingData);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] select-none relative overflow-hidden animate-fade-in">
      {/* Top Header (对照原型) */}
      <div className="px-4 py-3 bg-white flex items-center justify-between border-b border-slate-100/90 sticky top-0 z-20 shadow-2xs">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center -ml-1.5 rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          预约会议
        </h1>
        <div className="w-8" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* 会议名称 / 主题输入行 */}
        <div className="px-4 py-3.5 bg-white border-b border-slate-100">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="请输入会议主题"
            className="w-full text-[16px] text-slate-700 font-normal outline-none bg-transparent placeholder:text-slate-300"
          />
        </div>

        {/* 开始 & 结束 时间选择区块 (对照原型: 蓝字 04月08日 周五 14:00 -> 15:00) */}
        <div className="bg-white mt-2 px-4 py-4 border-y border-slate-100/80">
          <div className="flex items-center justify-between">
            {/* 开始 */}
            <div
              onClick={() => {
                setTimePickerTarget('start');
                setShowTimePickerModal(true);
              }}
              className="flex-1 cursor-pointer group active:opacity-75 transition-opacity"
            >
              <div className="text-[13px] text-slate-400 font-normal mb-1">
                开始
              </div>
              <div className="text-[16px] font-medium text-[#2563eb] leading-tight">
                {startDateStr}
              </div>
              <div className="text-[18px] font-medium text-[#2563eb] mt-0.5">
                {startTimeStr}
              </div>
            </div>

            {/* 中间箭头 */}
            <div className="px-3 flex items-center justify-center text-slate-300">
              <svg
                width="36"
                height="14"
                viewBox="0 0 36 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-300"
              >
                <path
                  d="M1 7H33M33 7L27 1M33 7L27 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* 结束 */}
            <div
              onClick={() => {
                setTimePickerTarget('end');
                setShowTimePickerModal(true);
              }}
              className="flex-1 text-right cursor-pointer group active:opacity-75 transition-opacity"
            >
              <div className="text-[13px] text-slate-400 font-normal mb-1">
                结束
              </div>
              <div className="text-[16px] font-medium text-[#2563eb] leading-tight">
                {endDateStr}
              </div>
              <div className="text-[18px] font-medium text-[#2563eb] mt-0.5">
                {endTimeStr}
              </div>
            </div>
          </div>
        </div>

        {/* Form Group 1: 会议类型、调试时间、重复周期 */}
        <div className="bg-white mt-2 border-y border-slate-100 divide-y divide-slate-100/90 text-[15px]">
          {/* 会议类型 */}
          <div
            onClick={() => setShowTypeSheet(true)}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-slate-900 font-normal">会议类型</span>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[14px]">{meetingType}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
            </div>
          </div>

          {/* 调试时间 */}
          <div
            onClick={() => {
              setTimePickerTarget('debug');
              setShowTimePickerModal(true);
            }}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-slate-900 font-normal">调试时间</span>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[14px]">{debugTime}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
            </div>
          </div>

          {/* 重复周期 / 重复频率 */}
          <div
            onClick={() => setShowRepeatSheet(true)}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-slate-900 font-normal">重复周期</span>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[14px]">{repeatFrequency}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Form Group 2: 参会方、会议室 */}
        <div className="bg-white mt-2 border-y border-slate-100 text-[15px]">
          {/* 参会方 */}
          <div
            onClick={() => setShowAttendeeModal(true)}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-100/90"
          >
            <span className="text-slate-900 font-normal">参会方</span>
            <div className="flex items-center gap-2">
              {/* 3 张圆形头像 */}
              <div className="flex items-center -space-x-1.5">
                {attendees.slice(0, 3).map((att) => (
                  <div key={att.id} className="w-7 h-7 rounded-full overflow-hidden border border-white">
                    <img src={att.avatar} alt={att.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[14px] text-slate-500">
                共{attendees.length}人
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
            </div>
          </div>

          {/* 会议室行 */}
          <div
            onClick={() => setShowRoomPickerModal(true)}
            className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-slate-900 font-normal">会议室</span>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[14px]">
                {selectedRooms.length > 0 ? `已选 ${selectedRooms.length} 间` : '请选择'}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
            </div>
          </div>

          {/* 已选会议室 Tags (对照原型: 顺德分公司-视频会议室, 总部深圳-信托2楼会议室) */}
          {selectedRooms.length > 0 && (
            <div className="px-4 pb-3 pt-1 space-y-2">
              {selectedRooms.map((roomName) => (
                <div
                  key={roomName}
                  className="flex items-center justify-between px-3.5 py-2.5 bg-[#f4f5f8] rounded-[6px] text-slate-800 text-[14px]"
                >
                  <span className="truncate">{roomName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRoom(roomName);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 active:scale-95 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 高级设置 Accordion Header */}
        <div className="mt-2">
          <div
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 px-4 py-3 text-[14px] text-slate-500 cursor-pointer select-none active:opacity-75 transition-opacity"
          >
            <span>高级设置</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-slate-400 stroke-[2]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 stroke-[2]" />
            )}
          </div>

          {/* 高级设置列表 (对照原型) */}
          {showAdvanced && (
            <div className="bg-white border-y border-slate-100 divide-y divide-slate-100/90 text-[15px] animate-fade-in">
              {/* 会议通知 */}
              <div
                onClick={() => setShowNoticeSheet(true)}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <span className="text-slate-900 font-normal">会议通知</span>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="text-[14px]">{meetingNotice}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
                </div>
              </div>

              {/* 会议密码 */}
              <div
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <span className="text-slate-900 font-normal">会议密码</span>
                <div className="flex items-center gap-1 text-slate-500">
                  <span className="text-[14px]">{meetingPassword}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 stroke-[2]" />
                </div>
              </div>

              {/* 腾讯会议 */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-slate-900 font-normal">腾讯会议</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tencentMeetingEnabled}
                    onChange={(e) => setTencentMeetingEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                </label>
              </div>

              {/* 直播会议 */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-slate-900 font-normal">直播会议</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liveStreamEnabled}
                    onChange={(e) => setLiveStreamEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                </label>
              </div>

              {/* 会议录制 */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-slate-900 font-normal">会议录制</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recordingEnabled}
                    onChange={(e) => setRecordingEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Fixed Action Button: 预约会议 (蓝底大按钮) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 z-30 max-w-md mx-auto">
        <button
          onClick={handleBookSubmit}
          className="w-full py-3.5 bg-[#2563eb] hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-[16px] rounded-[8px] transition-all flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/20"
        >
          预约会议
        </button>
      </div>

      {/* ---------------- 弹窗 1: 会议类型 ActionSheet (对照设计图) ---------------- */}
      {showTypeSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[16px] overflow-hidden shadow-2xl animate-slide-up">
            <div className="divide-y divide-slate-100 text-center">
              {/* 视频会议 */}
              <button
                onClick={() => {
                  setMeetingType('视频会议');
                  setShowTypeSheet(false);
                }}
                className="w-full py-4 px-6 flex items-center justify-center relative text-[16px] text-slate-900 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>视频会议</span>
                {meetingType === '视频会议' && (
                  <Check className="w-5 h-5 text-[#2563eb] absolute right-6 stroke-[2.5]" />
                )}
              </button>

              {/* 本地会议 */}
              <button
                onClick={() => {
                  setMeetingType('本地会议');
                  setShowTypeSheet(false);
                }}
                className="w-full py-4 px-6 flex items-center justify-center relative text-[16px] text-slate-900 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>本地会议</span>
                {meetingType === '本地会议' && (
                  <Check className="w-5 h-5 text-[#2563eb] absolute right-6 stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* 分割线 */}
            <div className="h-2 bg-[#f4f5f8]" />

            {/* 取消按钮 */}
            <button
              onClick={() => setShowTypeSheet(false)}
              className="w-full py-4 text-center text-[16px] text-slate-700 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 弹窗 2: 时间选择器 Wheel Picker (对照调试时间设计图) ---------------- */}
      {showTimePickerModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[16px] overflow-hidden shadow-2xl animate-slide-up">
            {/* Header: 重置 | 选择时间 | 确认 */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <button
                onClick={handleResetTimePicker}
                className="text-[15px] text-[#2563eb] font-normal cursor-pointer active:opacity-75"
              >
                重置
              </button>
              <h3 className="text-[16px] font-bold text-slate-900">
                选择时间
              </h3>
              <button
                onClick={handleConfirmTimePicker}
                className="text-[15px] text-[#2563eb] font-normal cursor-pointer active:opacity-75"
              >
                确认
              </button>
            </div>

            {/* 3-Column Picker Wheel Simulation */}
            <div className="relative py-6 px-4 flex items-center justify-between text-center overflow-hidden h-64 select-none">
              {/* Highlight selection bar */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-11 bg-blue-50/80 rounded-[8px] pointer-events-none border-y border-blue-100/60" />

              {/* Column 1: Date List */}
              <div className="flex-1 h-full overflow-y-auto no-scrollbar space-y-3 py-20">
                {availableDates.map((item, idx) => {
                  const isSelected = tempDateIdx === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setTempDateIdx(idx)}
                      className={`h-11 flex items-center justify-center gap-1.5 cursor-pointer text-[15px] transition-colors ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-400 font-normal'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.isToday && (
                        <span className="w-4 h-4 rounded-full border border-blue-500 text-blue-500 text-[10px] flex items-center justify-center font-normal">
                          今
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Column 2: Hours */}
              <div className="w-20 h-full overflow-y-auto no-scrollbar space-y-3 py-20">
                {Array.from({ length: 24 }).map((_, h) => {
                  const isSelected = tempHourIdx === h;
                  const hStr = h < 10 ? `0${h}` : `${h}`;
                  return (
                    <div
                      key={h}
                      onClick={() => setTempHourIdx(h)}
                      className={`h-11 flex items-center justify-center cursor-pointer text-[17px] transition-colors ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-400 font-normal'
                      }`}
                    >
                      {hStr}
                    </div>
                  );
                })}
              </div>

              {/* Column 3: Minutes */}
              <div className="w-20 h-full overflow-y-auto no-scrollbar space-y-3 py-20">
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((mStr, idx) => {
                  const mVal = parseInt(mStr, 10);
                  const isSelected = tempMinuteIdx === mVal;
                  return (
                    <div
                      key={idx}
                      onClick={() => setTempMinuteIdx(mVal)}
                      className={`h-11 flex items-center justify-center cursor-pointer text-[17px] transition-colors ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-400 font-normal'
                      }`}
                    >
                      {mStr}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 弹窗 3: 会议室多选 Modal ---------------- */}
      {showRoomPickerModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[16px] overflow-hidden shadow-2xl p-5 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900">
                选择会议室
              </h3>
              <button
                onClick={() => setShowRoomPickerModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-1">
              {availableRoomsList.map((room) => {
                const isSelected = selectedRooms.includes(room);
                return (
                  <div
                    key={room}
                    onClick={() => handleToggleRoom(room)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-medium'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-[14px]">{room}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-600 stroke-[2.5]" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowRoomPickerModal(false)}
                className="w-full py-3 bg-[#2563eb] text-white font-medium text-[15px] rounded-lg shadow-xs cursor-pointer"
              >
                完成选择 ({selectedRooms.length} 间)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 弹窗 4: 选择人员 / 参会方管理 (对照图2与图3) ---------------- */}
      {showAttendeeModal && (
        <SelectAttendeesPage
          selectedAttendees={attendees}
          onConfirm={(newSelected) => {
            setAttendees(newSelected);
            setShowAttendeeModal(false);
          }}
          onCancel={() => setShowAttendeeModal(false)}
        />
      )}

      {/* ---------------- 弹窗 4.5: 选择会议室 (对照原型图2: 空闲会议室列表、已选会议室改成取消预约、支持多选) ---------------- */}
      {showRoomPickerModal && (
        <SelectMeetingRoomsPage
          selectedRoomNames={selectedRooms}
          onConfirm={(newRooms) => {
            setSelectedRooms(newRooms);
            setShowRoomPickerModal(false);
          }}
          onCancel={() => setShowRoomPickerModal(false)}
        />
      )}

      {/* ---------------- 弹窗 5: 重复频率 Sheet ---------------- */}
      {showRepeatSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[16px] overflow-hidden shadow-2xl animate-slide-up">
            <div className="divide-y divide-slate-100 text-center">
              {['不重复', '每天', '每个工作日 (周一至周五)', '每周', '每月'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => {
                    setRepeatFrequency(freq);
                    setShowRepeatSheet(false);
                  }}
                  className="w-full py-3.5 px-6 flex items-center justify-center relative text-[15px] text-slate-900 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{freq}</span>
                  {repeatFrequency === freq && (
                    <Check className="w-5 h-5 text-[#2563eb] absolute right-6 stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
            <div className="h-2 bg-[#f4f5f8]" />
            <button
              onClick={() => setShowRepeatSheet(false)}
              className="w-full py-4 text-center text-[16px] text-slate-700 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 弹窗 6: 会议通知 Sheet ---------------- */}
      {showNoticeSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[16px] overflow-hidden shadow-2xl animate-slide-up">
            <div className="divide-y divide-slate-100 text-center">
              {['短信、邮件', '应用内通知', '仅邮件', '仅短信'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setMeetingNotice(opt);
                    setShowNoticeSheet(false);
                  }}
                  className="w-full py-3.5 px-6 flex items-center justify-center relative text-[15px] text-slate-900 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{opt}</span>
                  {meetingNotice === opt && (
                    <Check className="w-5 h-5 text-[#2563eb] absolute right-6 stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
            <div className="h-2 bg-[#f4f5f8]" />
            <button
              onClick={() => setShowNoticeSheet(false)}
              className="w-full py-4 text-center text-[16px] text-slate-700 font-normal hover:bg-slate-50 transition-colors cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 弹窗 7: 会议密码修改 Modal ---------------- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-2xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-[16px] overflow-hidden shadow-2xl p-5 space-y-4">
            <h3 className="text-[16px] font-bold text-slate-900 text-center">
              设置会议密码
            </h3>
            <input
              type="text"
              value={meetingPassword}
              onChange={(e) => setMeetingPassword(e.target.value)}
              placeholder="请输入6位数字密码"
              className="w-full text-center tracking-widest text-[20px] font-bold px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500"
              maxLength={6}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMeetingPassword(Math.floor(100000 + Math.random() * 900000).toString());
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-medium rounded-lg"
              >
                随机生成
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg"
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
