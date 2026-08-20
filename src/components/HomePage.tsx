import React, { useState } from 'react';
import {
  Bell,
  Phone,
  FileText,
  Search,
  BookOpen,
  GraduationCap,
  Video,
  Eye,
  Box,
  SlidersHorizontal,
  Clock,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AiAgentAvatar } from './AiAgentAvatar';

interface HomePageProps {
  onNavigateToTraining?: () => void;
  onNavigateToPlanQuery?: () => void;
  onNavigateToMaterials?: () => void;
  onNavigateToRiskRectification?: () => void;
  onNavigateToMeeting?: () => void;
  onNavigateToPersonnelDispatch?: () => void;
  onNavigateToEventDetail?: () => void;
  onNavigateToEventList?: () => void;
  onNavigateToMonitoring?: () => void;
  onNavigateToAi?: () => void;
  onNavigateToKnowledgeBase?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToDutyHandover?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToTraining,
  onNavigateToPlanQuery,
  onNavigateToMaterials,
  onNavigateToRiskRectification,
  onNavigateToMeeting,
  onNavigateToPersonnelDispatch,
  onNavigateToEventDetail,
  onNavigateToEventList,
  onNavigateToMonitoring,
  onNavigateToAi,
  onNavigateToKnowledgeBase,
  onNavigateToProfile,
  onNavigateToDutyHandover
}) => {
  const [taskTab, setTaskTab] = useState<'todo' | 'done'>('todo');

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-6 relative">
      {/* Top Banner with Background Image */}
      <div className="relative w-full h-44 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 p-4 text-white flex flex-col justify-end overflow-hidden pb-5">
        {/* Background Decorative Graphic */}
        <div className="absolute inset-0 opacity-35 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
            alt="Header BG"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info & Bell Row */}
        <div className="flex items-center justify-between z-10 px-1">
          {/* Left: Avatar & Text */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div
              onClick={onNavigateToProfile}
              className="relative flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
              title="点击查看个人中心"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Avatar"
                className="w-13 h-13 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10b981] border-2 border-white rounded-full" />
            </div>

            {/* Greeting & Subtitle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-white tracking-tight leading-[22px]">
                  上午好，刘强
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#10b981] text-[11px] font-semibold text-white shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  在线
                </span>
              </div>
              <p className="text-[15px] font-medium text-white/95 mt-0.5 tracking-tight leading-[20px]">
                您有 <span className="text-[#f59e0b] font-bold text-[17px]">20</span> 条待办任务
              </p>
            </div>
          </div>

          {/* Right: Bell Icon with Badge */}
          <button className="relative p-1 text-white hover:opacity-80 transition-opacity flex-shrink-0 mr-1">
            <Bell className="w-6 h-6 stroke-[1.8] text-white" />
            <span className="absolute -top-1 -right-1.5 bg-[#ef4444] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full border border-white leading-none shadow-2xs">
              26
            </span>
          </button>
        </div>
      </div>

      {/* Quick Action Grid (8 Icons) */}
      <div className="px-3 -mt-3 z-10 mb-3">
        <div className="bg-white rounded-[18px] p-3 shadow-2xs border border-slate-100/80 grid grid-cols-4 gap-y-3.5 gap-x-2 text-center">
          {/* 事项列表 / 事件列表 */}
          <div
            onClick={onNavigateToEventList}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/shixiang.svg" alt="事件列表" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">事件列表</span>
          </div>

          {/* 预案查询 */}
          <div
            onClick={onNavigateToPlanQuery}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/yuan.svg" alt="预案查询" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">预案查询</span>
          </div>

          {/* 交接日志 */}
          <div
            onClick={onNavigateToDutyHandover}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/jiaojie.svg" alt="交接日志" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">交接日志</span>
          </div>

          {/* 物资管理 */}
          <div
            onClick={onNavigateToMaterials}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/wuzi.svg" alt="物资管理" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">物资管理</span>
          </div>

          {/* 发起会议 */}
          <div
            onClick={onNavigateToMeeting}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/huiyi.svg" alt="发起会议" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">发起会议</span>
          </div>

          {/* 监控 */}
          <div
            onClick={onNavigateToMonitoring}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/jiankong.svg" alt="监控" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">监控</span>
          </div>

          {/* 知识库 */}
          <div
            onClick={onNavigateToKnowledgeBase}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/zhishi.svg" alt="知识库" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">知识库</span>
          </div>

          {/* 培训考试 */}
          <div
            onClick={onNavigateToTraining}
            className="flex flex-col items-center cursor-pointer group"
          >
            <img src="/icons/peixun.svg" alt="培训考试" className="w-12 h-12 object-contain group-active:scale-95 transition-transform mb-1" />
            <span className="text-[13px] text-slate-800 font-medium tracking-tight">培训考试</span>
          </div>
        </div>
      </div>

      {/* Task List Header */}
      <div className="px-3 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* 待办 Tab */}
          <button
            onClick={() => setTaskTab('todo')}
            className={`flex items-center gap-1.5 text-[17px] font-semibold relative pb-1 transition-colors leading-[22px] ${
              taskTab === 'todo' ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            待办
            <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
              12
            </span>
            {taskTab === 'todo' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          {/* 已办 Tab */}
          <button
            onClick={() => setTaskTab('done')}
            className={`text-[17px] font-semibold relative pb-1 transition-colors leading-[22px] ${
              taskTab === 'done' ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            已办
            {taskTab === 'done' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Button / View all events */}
        <button
          onClick={onNavigateToEventList}
          className="flex items-center gap-1 text-[13px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
        >
          <span>全部事件</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task Cards List */}
      <div className="px-3 space-y-3 flex-1">
        {/* Incident Detail Task Card (Navigates to EventDetailPage for 人员踩踏事件) */}
        <div
          onClick={onNavigateToEventDetail}
          className="bg-white rounded-[16px] p-3.5 shadow-2xs border border-slate-100/80 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-[17px] font-semibold text-slate-900 flex items-center gap-1.5 leading-[22px]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
              <span className="truncate">202608140898 人员踩踏事件处置</span>
            </h3>

            <div className="flex items-center gap-2 text-[15px] text-slate-600">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                alt="李维文"
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium text-slate-800">李维文</span>
              <span className="text-[13px] text-slate-500">(监督员 / 增城区监督中心)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[12px]">
              <Clock className="w-3.5 h-3.5" />
              <span>2026-08-14 10:04:34</span>
            </div>

            <div className="flex items-center gap-1 pt-0.5">
              <span className="px-2 py-0.5 text-[11px] font-semibold text-rose-600 bg-rose-50 rounded-[6px]">
                突发事件
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-[6px]">
                已响应
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToEventDetail?.();
            }}
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Personnel Dispatch Task Card (Navigates to PersonnelDispatchPage) - Exact match to user request */}
        <div
          onClick={onNavigateToPersonnelDispatch}
          className="bg-white rounded-[16px] p-3.5 shadow-2xs border border-slate-100/80 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-[17px] font-semibold text-slate-900 flex items-center gap-1.5 leading-[22px]">
              <span className="truncate">派出由民政部负责人带队赴灾区慰问受灾群众</span>
            </h3>

            <div className="flex items-center gap-2 text-[15px] text-slate-600">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="谷菲婷"
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium text-slate-800">谷菲婷</span>
              <span className="text-[13px] text-slate-500">(现场指挥官 / 调度员)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[12px]">
              <Clock className="w-3.5 h-3.5" />
              <span>2022-04-12 10:04:34</span>
              <span className="text-[#f97316] font-medium">剩余 1小时54分</span>
            </div>

            <div className="flex items-center gap-1 pt-0.5">
              <span className="px-2 py-0.5 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-[6px]">
                人员调派
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-[6px]">
                待执行
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToPersonnelDispatch?.();
            }}
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Risk Hazard Task Card (Navigates to RiskRectificationPage) */}
        <div
          onClick={onNavigateToRiskRectification}
          className="bg-white rounded-[16px] p-3.5 shadow-2xs border border-slate-100/80 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between gap-3"
        >
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-[17px] font-semibold text-slate-900 flex items-center gap-1.5 leading-[22px]">
              <span className="truncate">消防-附属、辅助功能区整改填报</span>
            </h3>

            <div className="flex items-center gap-2 text-[15px] text-slate-600">
              <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                👤
              </span>
              <span className="text-slate-800 font-medium">李敏浩</span>
              <span className="text-[13px] text-slate-500">(安保部 / 消防安全检查员)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>2026-04-13 10:00 (整改期限剩2天)</span>
            </div>

            <div className="flex items-center gap-1 pt-0.5">
              <span className="px-2 py-0.5 text-[11px] font-semibold text-rose-600 bg-rose-50 rounded-[6px]">
                风险隐患
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-[6px]">
                待整改
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToRiskRectification?.();
            }}
            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Card 1 */}
        <div className="bg-white rounded-[16px] p-3.5 shadow-2xs border border-slate-100/80 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-[17px] font-semibold text-slate-900 leading-[22px]">突发事件审批</h3>

            <div className="flex items-center gap-2 text-[15px] text-slate-600">
              <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                👤
              </span>
              <span className="text-slate-800 font-medium">张丽</span>
              <span className="text-[13px] text-slate-500">(集团总部/指挥中心值班员)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>2021-10-20 14:00~16:36</span>
            </div>

            <div className="flex items-center gap-1 pt-0.5">
              <span className="px-2 py-0.5 text-[11px] font-semibold text-rose-500 bg-rose-50 rounded-[6px]">
                突发事件
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-[6px]">
                待办
              </span>
            </div>
          </div>

          <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0">
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[16px] p-3.5 shadow-2xs border border-slate-100/80 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-[17px] font-semibold text-slate-900 leading-[22px]">突发事件审批</h3>

            <div className="flex items-center gap-2 text-[15px] text-slate-600">
              <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                👤
              </span>
              <span className="text-slate-800 font-medium">张丽</span>
              <span className="text-[13px] text-slate-500">(集团总部/指挥中心值班员)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>2021-10-20 14:00~16:36</span>
            </div>

            <div className="flex items-center gap-1 pt-0.5">
              <span className="px-2 py-0.5 text-[11px] font-semibold text-rose-500 bg-rose-50 rounded-[6px]">
                突发事件
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 rounded-[6px]">
                待办
              </span>
            </div>
          </div>

          <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating AI+ Assistant Quick Launch Button */}
      {onNavigateToAi && (
        <button
          onClick={onNavigateToAi}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pl-2 pr-3.5 py-1.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
        >
          <div className="relative">
            <AiAgentAvatar size="xs" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
            </span>
          </div>
          <span className="text-[12px] font-bold tracking-tight">AI+ 智能体</span>
        </button>
      )}
    </div>
  );
};
