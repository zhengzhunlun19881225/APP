import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Filter,
  Phone,
  Clock,
  MapPin,
  Bookmark,
  User,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  Send,
  X,
  Sparkles,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface EventItem {
  id: string;
  code: string;
  level: '一级' | '二级' | '三级' | '四级';
  type: string;
  title: string;
  category: string;
  time: string;
  location: string;
  status: '响应中' | '未响应' | '处置中' | '已办结';
  dutyOfficer: string;
  dutyPhone: string;
  siteOfficer?: string;
  sitePhone?: string;
  description?: string;
}

interface EventListPageProps {
  onBack: () => void;
  onSelectEvent: (event: EventItem) => void;
}

export const EventListPage: React.FC<EventListPageProps> = ({
  onBack,
  onSelectEvent
}) => {
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('全部');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportModalEvent, setReportModalEvent] = useState<EventItem | null>(null);
  const [reportText, setReportText] = useState('');
  const [callModalInfo, setCallModalInfo] = useState<{ name: string; role: string; phone: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const initialEvents: EventItem[] = [
    {
      id: 'EVT-20260814-01',
      code: '202608140898',
      level: '一级',
      type: '突发事件',
      title: '派出由民政部负责人带队的现场应急处置救助先遣工作组',
      category: '交通秩序异常-通关秩序异常',
      time: '2026/08/14 14:23:34',
      location: '广东省深圳市南山区粤海街道学生西路深圳大学沧海校区西门',
      status: '响应中',
      dutyOfficer: '李维文',
      dutyPhone: '138-0021-9872',
      siteOfficer: '张旭',
      sitePhone: '139-2210-4491',
      description: '人流聚集超负荷，已协调多部门联合封控与疏导，增派医疗与民政应急救助组。'
    },
    {
      id: 'EVT-20260814-02',
      code: '202608140899',
      level: '二级',
      type: '突发事件',
      title: '派出由民政部负责人带队协调物资调配及区域客流分流',
      category: '交通秩序异常-通关秩序异常',
      time: '2026/08/14 14:20:12',
      location: '广东省深圳市南山区粤海街道学生西路深圳大学西丽协同枢纽',
      status: '未响应',
      dutyOfficer: '林鸣',
      dutyPhone: '136-8891-2301',
      description: '周边道路拥堵指数达4.2，正在等待街道综治中心指派第一梯队巡查员。'
    },
    {
      id: 'EVT-20260814-03',
      code: '202608140900',
      level: '三级',
      type: '突发事件',
      title: '派出由民政部负责人现场督导学生西路口应急照明与指引设置',
      category: '交通秩序异常-通关秩序异常',
      time: '2026/08/14 13:58:45',
      location: '广东省深圳市南山区粤海街道学生西路深圳大学科技楼北侧',
      status: '响应中',
      dutyOfficer: '王利明',
      dutyPhone: '137-9912-8823',
      siteOfficer: '陈立强',
      sitePhone: '135-4421-9988',
      description: '现场安保组已接管人车分流导流标线，已配置临时发电机及应急扩音广播。'
    },
    {
      id: 'EVT-20260814-04',
      code: '202608140901',
      level: '四级',
      type: '突发事件',
      title: '派出由民政部负责人通报沿线护栏损坏加固与非机动车乱停整治',
      category: '交通秩序异常-通关秩序异常',
      time: '2026/08/14 13:15:20',
      location: '广东省深圳市南山区粤海街道学生西路深圳大学生活区路口',
      status: '响应中',
      dutyOfficer: '赵立德',
      dutyPhone: '139-0012-7711',
      description: '网格防暴巡逻组已到场清理共享单车阻滞，修复隔离带卡扣。'
    },
    {
      id: 'EVT-20260814-05',
      code: '202608140902',
      level: '一级',
      type: '突发事件',
      title: '突发人流过度拥挤及踩踏险情应急处置调派',
      category: '公共安全-群体性过度拥挤事件',
      time: '2026/08/14 10:04:34',
      location: '广东省广州市增城区民生街与育才路交叉口往西北约70米',
      status: '响应中',
      dutyOfficer: '李维文',
      dutyPhone: '138-0021-9872',
      siteOfficer: '张旭',
      sitePhone: '139-2210-4491',
      description: '超大人流量过度拥挤，出现倒地及踩踏险情，已调派救护与交警警力管控。'
    }
  ];

  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const getLevelAccentBar = (level: string) => {
    switch (level) {
      case '一级':
        return 'bg-[#1677ff]'; // Blue
      case '二级':
        return 'bg-[#fa8c16]'; // Orange/Amber
      case '三级':
        return 'bg-[#597ef7]'; // Purple/Indigo
      case '四级':
        return 'bg-[#52c41a]'; // Green
      default:
        return 'bg-slate-400';
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case '一级':
        return 'bg-[#fff1f0] text-[#ff4d4f]';
      case '二级':
        return 'bg-[#fff7e6] text-[#fa8c16]';
      case '三级':
        return 'bg-[#597ef7] text-white';
      case '四级':
        return 'bg-[#f6ffed] text-[#52c41a]';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchLevel = activeLevelFilter === '全部' || evt.level === activeLevelFilter;
    const matchStatus = activeStatusFilter === '全部' || evt.status === activeStatusFilter;
    const matchQuery =
      searchQuery === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.code.includes(searchQuery);
    return matchLevel && matchStatus && matchQuery;
  });

  const handleSendReport = () => {
    if (!reportText.trim()) {
      showToast('请输入续报进展内容');
      return;
    }
    showToast(`续报已成功提交至指挥中心！编号: ${reportModalEvent?.code}`);
    setReportModalEvent(null);
    setReportText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f6fa] select-none relative overflow-hidden">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-[13px] px-4 py-2 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 animate-in fade-in zoom-in-95">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-slate-100 shadow-xs z-10">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-95 transition-transform flex items-center cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">事件列表</h1>
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-medium text-[#1677ff] bg-[#e8f3ff] px-2.5 py-0.5 rounded-full">
            共 {filteredEvents.length} 条
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white px-3 pt-2 pb-2.5 border-b border-slate-100 space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索事件名称 / 类别 / 地点 / 编号..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#f5f6fa] text-slate-800 placeholder-slate-400 text-[13px] rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-200/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Level Filters Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {['全部', '一级', '二级', '三级', '四级'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevelFilter(lvl)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all flex-shrink-0 cursor-pointer ${
                activeLevelFilter === lvl
                  ? 'bg-[#1677ff] text-white shadow-2xs'
                  : 'bg-[#f0f2f5] text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl === '全部' ? '全部级别' : `${lvl}事件`}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Scroll View */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-8">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <AlertCircle className="w-12 h-12 stroke-[1.5] text-slate-300 mb-2" />
            <p className="text-[14px]">暂无符合条件的事件记录</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100/90 hover:border-blue-200 transition-all cursor-pointer relative group space-y-2.5"
            >
              {/* Header: Accent bar + Title + Status badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`w-1.5 h-4 rounded-full flex-shrink-0 ${getLevelAccentBar(evt.level)}`} />
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug truncate">
                    {evt.title}
                  </h3>
                </div>

                {/* Status Badge */}
                {evt.status === '响应中' ? (
                  <span className="px-2.5 py-0.5 bg-[#e6f4ff] text-[#1677ff] text-[12px] font-medium rounded-[4px] flex-shrink-0">
                    响应中
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-[#e6f4ff]/80 text-[#4096ff] text-[12px] font-medium rounded-[4px] flex-shrink-0">
                    未响应
                  </span>
                )}
              </div>

              {/* 3 Information Rows with Outline Icons */}
              <div className="space-y-1.5 text-[13px] text-slate-500">
                {/* 1. Time */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 stroke-[1.8]" />
                  <span>{evt.time}</span>
                </div>

                {/* 2. Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 stroke-[1.8]" />
                  <span className="line-clamp-1">{evt.location}</span>
                </div>

                {/* 3. Category */}
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-slate-400 flex-shrink-0 stroke-[1.8]" />
                  <span>{evt.category}</span>
                </div>
              </div>

              {/* Tags below info */}
              <div className="flex items-center gap-2 pt-0.5">
                {/* Level Tag */}
                <span
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-[4px] ${getLevelBadgeStyle(
                    evt.level
                  )}`}
                >
                  {evt.level}
                </span>

                {/* Type Tag */}
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-[4px] bg-[#fff1f0] text-[#ff4d4f]">
                  {evt.type}
                </span>

                {/* Status Tag */}
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-[4px] bg-[#e6f4ff] text-[#1677ff]">
                  {evt.status === '已办结' ? '已办' : '待办'}
                </span>
              </div>

              {/* Footer Row: Contacts & Report action */}
              <div className="border-t border-slate-100/90 pt-3 flex items-center justify-between">
                {/* Left contact actions */}
                <div className="flex items-center gap-1 text-[13px] text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-600 stroke-[2] mr-0.5" />
                  
                  {/* If site officer exists */}
                  {evt.siteOfficer ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCallModalInfo({
                            name: evt.siteOfficer!,
                            role: '现场处置人员',
                            phone: evt.sitePhone || '139-2210-4491'
                          });
                        }}
                        className="inline-flex items-center gap-1 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
                      >
                        <span>现场人员</span>
                        <Phone className="w-3.5 h-3.5 text-[#1677ff] stroke-[2.2]" />
                      </button>

                      <span className="text-slate-200 mx-2">|</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCallModalInfo({
                            name: evt.dutyOfficer,
                            role: '值班员',
                            phone: evt.dutyPhone
                          });
                        }}
                        className="inline-flex items-center gap-1 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
                      >
                        <span>值班员</span>
                        <Phone className="w-3.5 h-3.5 text-[#1677ff] stroke-[2.2]" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCallModalInfo({
                          name: evt.dutyOfficer,
                          role: '值班员',
                          phone: evt.dutyPhone
                        });
                      }}
                      className="inline-flex items-center gap-1 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>值班员</span>
                      <Phone className="w-3.5 h-3.5 text-[#1677ff] stroke-[2.2]" />
                    </button>
                  )}
                </div>

                {/* Right: 事件续报 >> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportModalEvent(evt);
                  }}
                  className="text-[13px] text-[#1677ff] font-medium hover:underline active:scale-95 transition-transform cursor-pointer flex items-center gap-0.5"
                >
                  <span>事件续报 &gt;&gt;</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal 1: 事件续报弹窗 (Event Follow-up Report) */}
      {reportModalEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">事件续报录入</h3>
                  <p className="text-[11px] text-slate-400">单号：{reportModalEvent.code}</p>
                </div>
              </div>
              <button
                onClick={() => setReportModalEvent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-3 text-[13px]">
              {/* Event basic info brief */}
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[2px] ${getLevelBadgeStyle(reportModalEvent.level)}`}>
                    {reportModalEvent.level}
                  </span>
                  <span className="text-[13px] font-bold text-slate-800 line-clamp-1">
                    {reportModalEvent.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{reportModalEvent.location}</span>
                </p>
              </div>

              {/* Report Input */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">
                  最新处置进展与现状描述 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="请输入现场处置人员最新到达情况、伤亡损耗、交通疏散或物资使用进展..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Quick Preset Progress Tags */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">快捷填充：</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '应急工作组已到达现场',
                    '现场秩序已恢复平稳',
                    '医疗急救绿色通道已开启',
                    '人流分流管控完毕'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setReportText((prev) => (prev ? `${prev}；${preset}` : preset))}
                      className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-[11px] transition-colors cursor-pointer"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload Attachment Button */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => showToast('已调起现场取证相机')}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-xl text-slate-600 hover:text-blue-600 text-[12px] cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-400" />
                  <span>添加现场照片/音视频</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReportModalEvent(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSendReport}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>立即上报</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 电话拨打确认弹窗 */}
      {callModalInfo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border border-slate-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">{callModalInfo.name}</h3>
              <p className="text-[12px] text-slate-400">{callModalInfo.role}</p>
              <p className="text-[14px] font-bold text-blue-600 mt-1">{callModalInfo.phone}</p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setCallModalInfo(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  showToast(`正在呼叫【${callModalInfo.name}】(${callModalInfo.phone})...`);
                  setCallModalInfo(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-xl shadow-md cursor-pointer"
              >
                立即呼叫
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
