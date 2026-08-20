import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X
} from 'lucide-react';

export interface ScheduledShareItem {
  id: string;
  title: string;
  shareType: '重复' | '单次';
  frequency: string; // e.g. '每个月', '每周', '每天', '2025-08-21 12:30'
  creator: string;
  createTime: string;
  groupDate: string; // e.g. '今天', '2025-08-21'
  recipients: string;
  promptText: string;
  pushTime: string;
  startDate: string;
  endDate: string;
  selectedWeekdays?: string[];
  previewSummary?: string;
}

interface ScheduleShareManagementProps {
  onBack: () => void;
  initialOpenCreate?: boolean;
}

export const ScheduleShareManagement: React.FC<ScheduleShareManagementProps> = ({
  onBack,
  initialOpenCreate = false
}) => {
  // Mock initial list
  const [items, setItems] = useState<ScheduledShareItem[]>([
    {
      id: 'share_1',
      title: '2024财务收入报表',
      shareType: '重复',
      frequency: '每个月',
      creator: '张翠山',
      createTime: '12:12:29',
      groupDate: '今天',
      recipients: '业务开发部、张三、李明浩...',
      promptText: '统计年度财务报表',
      pushTime: '12:30',
      startDate: '2026-04-09',
      endDate: '2026-06-08',
      selectedWeekdays: ['星期一', '星期三', '星期五'],
      previewSummary:
        '根据财政部公开数据，2024年全国一般公共预算收入约XXX万元，同比增长6.8%，其中税收收入占比约 85%，非税收入占比约15%。具体分类如下：'
    },
    {
      id: 'share_2',
      title: '2024财务收入报表',
      shareType: '单次',
      frequency: '2025-08-21 12:30',
      creator: '张翠山',
      createTime: '12:12:29',
      groupDate: '2025-08-21',
      recipients: '业务开发部、张三、李明浩...',
      promptText: '统计年度财务报表',
      pushTime: '12:30',
      startDate: '2025-08-21',
      endDate: '2025-08-21',
      previewSummary:
        '根据财政部公开数据，2024年全国一般公共预算收入约XXX万元，同比增长6.8%，其中税收收入占比约 85%，非税收入占比约15%。具体分类如下：'
    },
    {
      id: 'share_3',
      title: '2024财务收入报表',
      shareType: '单次',
      frequency: '2025-08-21 12:30',
      creator: '张翠山',
      createTime: '12:12:29',
      groupDate: '2025-08-21',
      recipients: '业务开发部、张三、李明浩...',
      promptText: '统计年度财务报表',
      pushTime: '12:30',
      startDate: '2025-08-21',
      endDate: '2025-08-21',
      previewSummary:
        '根据财政部公开数据，2024年全国一般公共预算收入约XXX万元，同比增长6.8%，其中税收收入占比约 85%，非税收入占比约15%。具体分类如下：'
    }
  ]);

  const [searchDateRange, setSearchDateRange] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal / Drawer state for creating / editing
  const [isModalOpen, setIsModalOpen] = useState(initialOpenCreate);
  const [editingItem, setEditingItem] = useState<ScheduledShareItem | null>(null);

  // Form states in Modal
  const [formPrompt, setFormPrompt] = useState('统计年度财务报表');
  const [formFrequency, setFormFrequency] = useState<'每天' | '每周' | '每月' | '单次'>('每月');
  const [formPushTime, setFormPushTime] = useState('12:30');
  const [formStartDate, setFormStartDate] = useState('2026-04-09');
  const [formEndDate, setFormEndDate] = useState('2026-06-08');
  const [formWeekdays, setFormWeekdays] = useState<string[]>([
    '星期一',
    '星期二',
    '星期三',
    '星期五',
    '星期日'
  ]);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [previewContent, setPreviewContent] = useState(
    '根据财政部公开数据，2024年全国一般公共预算收入约XXX万元，同比增长6.8%，其中税收收入占比约 85%，非税收入占比约15%。具体分类如下：'
  );

  // Weekday picker sub-drawer
  const [isWeekdayDrawerOpen, setIsWeekdayDrawerOpen] = useState(false);
  const [tempWeekdays, setTempWeekdays] = useState<string[]>(formWeekdays);

  const showToast = (txt: string) => {
    setToastMsg(txt);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormPrompt('统计年度财务报表');
    setFormFrequency('每月');
    setFormPushTime('12:30');
    setFormStartDate('2026-04-09');
    setFormEndDate('2026-06-08');
    setFormWeekdays(['星期一', '星期二', '星期三', '星期五']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduledShareItem) => {
    setEditingItem(item);
    setFormPrompt(item.promptText || item.title);
    setFormFrequency(
      item.frequency === '每个月' || item.frequency === '每月'
        ? '每月'
        : item.frequency === '每周'
        ? '每周'
        : item.frequency === '每天'
        ? '每天'
        : '单次'
    );
    setFormPushTime(item.pushTime || '12:30');
    setFormStartDate(item.startDate || '2026-04-09');
    setFormEndDate(item.endDate || '2026-06-08');
    setFormWeekdays(item.selectedWeekdays || ['星期一', '星期二', '星期三']);
    if (item.previewSummary) setPreviewContent(item.previewSummary);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast('已删除定时分享任务');
  };

  const handleSaveModal = () => {
    if (!formPrompt.trim()) {
      showToast('请输入提示词内容');
      return;
    }

    if (editingItem) {
      // Update existing
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                title: formPrompt,
                promptText: formPrompt,
                shareType: formFrequency === '单次' ? '单次' : '重复',
                frequency:
                  formFrequency === '每月'
                    ? '每个月'
                    : formFrequency === '每周'
                    ? '每周'
                    : formFrequency === '每天'
                    ? '每天'
                    : `${formStartDate} ${formPushTime}`,
                pushTime: formPushTime,
                startDate: formStartDate,
                endDate: formEndDate,
                selectedWeekdays: formWeekdays,
                previewSummary: previewContent
              }
            : i
        )
      );
      showToast('已更新定时分享');
    } else {
      // Create new
      const newItem: ScheduledShareItem = {
        id: 'share_' + Date.now(),
        title: formPrompt,
        shareType: formFrequency === '单次' ? '单次' : '重复',
        frequency:
          formFrequency === '每月'
            ? '每个月'
            : formFrequency === '每周'
            ? '每周'
            : formFrequency === '每天'
            ? '每天'
            : `${formStartDate} ${formPushTime}`,
        creator: '张翠山',
        createTime: '12:12:29',
        groupDate: '今天',
        recipients: '业务开发部、张三、李明浩...',
        promptText: formPrompt,
        pushTime: formPushTime,
        startDate: formStartDate,
        endDate: formEndDate,
        selectedWeekdays: formWeekdays,
        previewSummary: previewContent
      };
      setItems((prev) => [newItem, ...prev]);
      showToast('已创建定时分享');
    }
    setIsModalOpen(false);
  };

  // Group items by groupDate
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.groupDate]) {
      acc[item.groupDate] = [];
    }
    acc[item.groupDate].push(item);
    return acc;
  }, {} as Record<string, ScheduledShareItem[]>);

  const allWeekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  return (
    <div className="flex flex-col h-full bg-[#f6f9fc] select-none font-sans relative overflow-hidden animate-fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[12px] px-3.5 py-1.5 rounded-full shadow-lg z-50 animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Top Header (1:1 with Image 3) */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">定时分享管理</h1>

        <button
          onClick={handleOpenCreate}
          className="system-plus-button"
          title="新建定时分享"
        >
          <Plus />
        </button>
      </div>

      {/* Date Range Search Bar (1:1 with Image 3) */}
      <div className="p-4 bg-white border-b border-slate-100/80 flex items-center gap-2">
        <div className="flex-1 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 flex items-center gap-2 text-slate-700 shadow-2xs">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchDateRange}
            onChange={(e) => setSearchDateRange(e.target.value)}
            placeholder="开始日期 至 结束日期"
            className="w-full text-[13px] bg-transparent placeholder-slate-400 outline-none"
          />
        </div>
        <button
          onClick={() => showToast('已筛选日期区间')}
          className="w-10 h-10 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-2xs active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* List Area grouped by Date (1:1 with Image 3) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-[13px] gap-2">
            <Calendar className="w-10 h-10 text-slate-300 stroke-[1.2]" />
            <span>暂无定时分享任务，点击右上角「+」新建</span>
          </div>
        ) : (
          (Object.entries(groupedItems) as [string, ScheduledShareItem[]][]).map(([dateGroup, list]) => (
            <div key={dateGroup} className="space-y-2.5">
              {/* Date Group Label */}
              <h3 className="text-[13px] font-medium text-slate-500 px-1">{dateGroup}</h3>

              {/* Share Task Cards */}
              <div className="space-y-3">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-b from-white via-white to-slate-50/50 rounded-2xl p-4 shadow-sm border border-slate-100/90 relative overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* Subtle Top Gradient Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/20 via-indigo-300/20 to-pink-300/20" />

                    {/* Card Title */}
                    <h4 className="text-[15px] font-bold text-slate-900 tracking-tight mb-3">
                      {item.title}
                    </h4>

                    {/* Field Rows (1:1 aligned like Image 3) */}
                    <div className="space-y-2 text-[13px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-normal">分享类型：</span>
                        <span className="text-slate-700 font-medium">{item.shareType}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-normal">分享频率：</span>
                        <span className="text-slate-700 font-medium">{item.frequency}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-normal">创建人：</span>
                        <span className="text-slate-700 font-medium">{item.creator}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-normal">创建时间：</span>
                        <span className="text-slate-700 font-medium">{item.createTime}</span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-400 font-normal shrink-0">推送对象：</span>
                        <span className="text-slate-700 font-medium text-right line-clamp-1">
                          {item.recipients}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions: 删除 | 修改 */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center divide-x divide-slate-200 text-[13px] font-medium">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 text-slate-500 hover:text-rose-600 text-center py-0.5 active:scale-95 transition-all"
                      >
                        删除
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="flex-1 text-[#0070f3] hover:text-blue-700 text-center py-0.5 active:scale-95 transition-all font-semibold"
                      >
                        修改
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= EDIT / CREATE SCHEDULED SHARE MODAL (1:1 with Images 4 & 5) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="w-6" />
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">定时分享</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[14px]">
              {/* 1. 提示词内容 */}
              <div className="space-y-1.5">
                <label className="block text-[13px] text-slate-700 font-medium">提示词内容</label>
                <input
                  type="text"
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  placeholder="请输入提示词"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#0070f3] transition-all bg-white"
                />
              </div>

              {/* 2. 推送频率 */}
              <div className="space-y-1.5">
                <label className="block text-[13px] text-slate-700 font-medium">推送频率</label>
                <div className="relative">
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as any)}
                    className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#0070f3] bg-white transition-all pr-9"
                  >
                    <option value="每天">每天</option>
                    <option value="每周">每周</option>
                    <option value="每月">每月</option>
                    <option value="单次">单次</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. 选择星期 (Shown when 推送频率 === '每周' as in Image 5) */}
              {formFrequency === '每周' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-[13px] text-slate-700 font-medium">选择星期</label>
                  <div
                    onClick={() => {
                      setTempWeekdays([...formWeekdays]);
                      setIsWeekdayDrawerOpen(true);
                    }}
                    className="border border-slate-200 rounded-xl p-2.5 flex items-center justify-between bg-white cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {formWeekdays.slice(0, 3).map((w) => (
                        <span
                          key={w}
                          className="bg-slate-100 text-slate-700 text-[12px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium"
                        >
                          {w}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormWeekdays((prev) => prev.filter((item) => item !== w));
                            }}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {formWeekdays.length > 3 && (
                        <span className="bg-slate-100 text-slate-700 text-[12px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                          +{formWeekdays.length - 3}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormWeekdays(formWeekdays.slice(0, 3));
                            }}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {formWeekdays.length === 0 && (
                        <span className="text-slate-400 text-[13px]">请选择星期</span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                  </div>
                </div>
              )}

              {/* 4. 推送时间 */}
              <div className="space-y-1.5">
                <label className="block text-[13px] text-slate-700 font-medium">推送时间</label>
                <input
                  type="text"
                  value={formPushTime}
                  onChange={(e) => setFormPushTime(e.target.value)}
                  placeholder="如: 12:30"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#0070f3] transition-all bg-white"
                />
              </div>

              {/* 5. 开始日期 */}
              <div className="space-y-1.5">
                <label className="block text-[13px] text-slate-700 font-medium">开始日期</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    placeholder="2026-04-09"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#0070f3] transition-all bg-white pr-9"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 6. 结束日期 */}
              <div className="space-y-1.5">
                <label className="block text-[13px] text-slate-700 font-medium">结束日期</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    placeholder="2026-06-08"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#0070f3] transition-all bg-white pr-9"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 7. Preview Box with Collapse & Re-generate (1:1 with Image 4 & 5) */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <button
                    onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
                    className="text-slate-600 font-medium flex items-center gap-1 hover:text-slate-900 active:scale-95 transition-all"
                  >
                    <span>{isPreviewCollapsed ? '展开' : '收起'}</span>
                    {isPreviewCollapsed ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      showToast('正在重新生成预测报表摘要...');
                      setTimeout(() => {
                        setPreviewContent(
                          `根据最新业务数据，2024年全国一般公共预算收入约 ${(
                            Math.random() * 50 +
                            150
                          ).toFixed(1)} 亿元，同比增长 ${(Math.random() * 4 + 5).toFixed(
                            1
                          )}%，其中税收收入占比稳定在 85% 左右。`
                        );
                        showToast('已重新生成');
                      }, 500);
                    }}
                    className="text-[#0070f3] font-medium flex items-center gap-1 hover:text-blue-700 active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>重新生成</span>
                  </button>
                </div>

                {!isPreviewCollapsed && (
                  <div className="border border-slate-200/90 rounded-2xl p-4 bg-white shadow-2xs space-y-2 animate-fade-in">
                    <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">
                      {formPrompt || '2024财务收入报表'}
                    </h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
                      {previewContent}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Action: 保存 Button */}
            <div className="p-4 bg-white border-t border-slate-100">
              <button
                onClick={handleSaveModal}
                className="w-full bg-[#0070f3] hover:bg-blue-600 active:scale-98 text-white font-medium py-3 rounded-xl shadow-md transition-all text-[15px]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= WEEKDAY PICKER BOTTOM SHEET (1:1 with Image 6) ================= */}
      {isWeekdayDrawerOpen && (
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/50 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-5 space-y-5 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="w-6" />
              <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">选择星期</h3>
              <button
                onClick={() => setIsWeekdayDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Grid (3 columns, 1:1 like Image 6) */}
            <div className="grid grid-cols-3 gap-2.5">
              {allWeekdays.map((wd) => {
                const isSelected = tempWeekdays.includes(wd);
                return (
                  <button
                    key={wd}
                    onClick={() => {
                      if (isSelected) {
                        setTempWeekdays((prev) => prev.filter((item) => item !== wd));
                      } else {
                        setTempWeekdays((prev) => [...prev, wd]);
                      }
                    }}
                    className={`py-3 rounded-xl text-[14px] font-medium transition-all ${
                      isSelected
                        ? 'bg-[#eef4ff] text-[#0070f3] border border-[#0070f3]/30 font-bold'
                        : 'bg-[#f8fafc] text-slate-700 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {wd}
                  </button>
                );
              })}
            </div>

            {/* Bottom Buttons: 重置 & 确定 */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setTempWeekdays([])}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-[15px] hover:bg-slate-50 active:scale-95 transition-all"
              >
                重置
              </button>
              <button
                onClick={() => {
                  setFormWeekdays([...tempWeekdays]);
                  setIsWeekdayDrawerOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#0070f3] hover:bg-blue-600 text-white font-bold text-[15px] shadow-md active:scale-95 transition-all"
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
