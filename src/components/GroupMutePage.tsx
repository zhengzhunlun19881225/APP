import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Settings } from 'lucide-react';
import { WhitelistPage, WhitelistMember } from './WhitelistPage';

interface GroupMutePageProps {
  onBack: () => void;
  onNotice?: (msg: string) => void;
}

export type MuteMode = 'off' | 'always' | 'scheduled';

export const GroupMutePage: React.FC<GroupMutePageProps> = ({ onBack, onNotice }) => {
  // Current mute mode selection: 'off' | 'always' | 'scheduled'
  const [muteMode, setMuteMode] = useState<MuteMode>('always');

  // Sub-page state
  const [activeSubPage, setActiveSubPage] = useState<'main' | 'scheduled'>('main');
  const [showWhitelist, setShowWhitelist] = useState(false);

  // Whitelist state
  const [whitelist, setWhitelist] = useState<WhitelistMember[]>([]);

  // Scheduled Mute Settings state
  const [isRepeat, setIsRepeat] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(['周一', '周二', '周三', '周四', '周五']);
  const [startTime, setStartTime] = useState('09:33');
  const [endTime, setEndTime] = useState('12:33');
  const [startDateStr, setStartDateStr] = useState('3月20日');

  const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSelectMode = (mode: MuteMode) => {
    setMuteMode(mode);
    if (mode === 'scheduled') {
      setActiveSubPage('scheduled');
    }
  };

  const handleNotice = (text: string) => {
    if (onNotice) {
      onNotice(text);
    } else {
      alert(text);
    }
  };

  if (showWhitelist) {
    return (
      <WhitelistPage
        onBack={() => setShowWhitelist(false)}
        whitelist={whitelist}
        onUpdateWhitelist={setWhitelist}
      />
    );
  }

  // ================= 2. SCHEDULED MUTE SUB-PAGE =================
  if (activeSubPage === 'scheduled') {
    return (
      <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-8">
        {/* Top Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-[#f4f5f8]/95 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={() => setActiveSubPage('main')}
            className="text-[15px] font-normal text-blue-600 hover:text-blue-700 transition-colors"
          >
            取消
          </button>

          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
            定时禁言
          </h1>

          <button
            onClick={() => {
              setMuteMode('scheduled');
              setActiveSubPage('main');
            }}
            className="text-[15px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            完成
          </button>
        </div>

        <div className="px-3 space-y-3 mt-1">
          {/* Section Header */}
          <div className="text-[13px] text-slate-400 font-normal px-1 mt-1">
            设置禁言时段
          </div>

          {/* Repeat Card */}
          <div className="bg-white rounded-[16px] shadow-2xs border border-slate-100/80 overflow-hidden divide-y divide-slate-100">
            {/* Repeat Toggle */}
            <div className="flex items-center justify-between p-3.5">
              <span className="text-[15px] font-medium text-slate-800">重复周期</span>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  isRepeat ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    isRepeat ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Weekdays selection (visible if Repeat is ON) */}
            {isRepeat && (
              <div className="divide-y divide-slate-100 px-3">
                {daysOfWeek.map((day) => {
                  const isChecked = selectedDays.includes(day);
                  return (
                    <div
                      key={day}
                      onClick={() => toggleDay(day)}
                      className="flex items-center justify-between py-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 bg-white group-hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-[15px] text-slate-800">{day}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Start and End Time Card */}
          <div className="bg-white rounded-[16px] shadow-2xs border border-slate-100/80 divide-y divide-slate-100 p-1">
            <div
              onClick={() => handleNotice('选择开始时间')}
              className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
            >
              <span className="text-[15px] font-medium text-slate-800">开始时间</span>
              <div className="flex items-center gap-1">
                <span className="text-[14px] text-slate-400">
                  {isRepeat ? startTime : `${startDateStr} ${startTime}`}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>

            <div
              onClick={() => handleNotice('选择结束时间')}
              className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
            >
              <span className="text-[15px] font-medium text-slate-800">结束时间</span>
              <div className="flex items-center gap-1">
                <span className="text-[14px] text-slate-400">
                  {isRepeat ? endTime : `${startDateStr} ${endTime}`}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= 1. MAIN GROUP MUTE PAGE =================
  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-8">
      {/* Top Header */}
      <div className="px-3 py-3 flex items-center justify-between bg-[#f4f5f8]/95 backdrop-blur-md sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          群内禁言
        </h1>

        <div className="w-8"></div>
      </div>

      <div className="px-3 space-y-3 mt-1">
        {/* Sub Header / Feedback link */}
        <div className="flex justify-between items-center px-1">
          <span className="text-[13px] text-slate-400 font-normal">意见反馈</span>
        </div>

        {/* Mute Options Card */}
        <div className="bg-white rounded-[16px] p-1 shadow-2xs border border-slate-100/80 divide-y divide-slate-100">
          {/* 未开启禁言 */}
          <div
            onClick={() => handleSelectMode('off')}
            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
          >
            <span className="text-[15px] font-medium text-slate-800">未开启禁言</span>
            {muteMode === 'off' && <Check className="w-5 h-5 text-blue-600 stroke-[2.5]" />}
          </div>

          {/* 始终禁言 */}
          <div
            onClick={() => handleSelectMode('always')}
            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
          >
            <span className="text-[15px] font-medium text-slate-800">始终禁言</span>
            {muteMode === 'always' && <Check className="w-5 h-5 text-blue-600 stroke-[2.5]" />}
          </div>

          {/* 定时禁言 */}
          <div
            onClick={() => handleSelectMode('scheduled')}
            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-medium text-slate-800">定时禁言</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSubPage('scheduled');
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full"
              >
                <Settings className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
            {muteMode === 'scheduled' && <Check className="w-5 h-5 text-blue-600 stroke-[2.5]" />}
          </div>
        </div>

        {/* Hint text */}
        <div className="px-1 text-[13px] text-slate-400 leading-normal">
          禁言后，只允许群主和白名单发言
        </div>

        {/* Whitelist Section */}
        <div className="pt-2 space-y-1.5">
          <div className="text-[13px] text-slate-400 font-normal px-1">
            设置禁言时允许发言
          </div>

          <div className="bg-white rounded-[16px] p-1 shadow-2xs border border-slate-100/80">
            <div
              onClick={() => setShowWhitelist(true)}
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
            >
              <span className="text-[15px] font-medium text-slate-800">白名单</span>
              <div className="flex items-center gap-1">
                <span className="text-[14px] text-slate-400">
                  {whitelist.length > 0 ? `${whitelist.length}人` : '未设置'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
