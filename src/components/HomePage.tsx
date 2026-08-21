import React, { useState } from 'react';
import {
  Bell,
  Phone,
  Clock,
  Check,
  SlidersHorizontal,
  UserRound
} from 'lucide-react';
import { AiAgentAvatar } from './AiAgentAvatar';
import { StatusBar } from './StatusBar';

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
  const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
  const quickActions = [
    { label: '事项列表', icon: assetUrl('work-home-assets/events.png'), onClick: onNavigateToEventList },
    { label: '预案查询', icon: assetUrl('work-home-assets/plans.png'), onClick: onNavigateToPlanQuery },
    { label: '交班日志', icon: assetUrl('work-home-assets/handover.png'), onClick: onNavigateToDutyHandover },
    { label: '物资管理', icon: assetUrl('work-home-assets/materials.png'), onClick: onNavigateToMaterials },
    { label: '发起会议', icon: assetUrl('work-home-assets/meeting.png'), onClick: onNavigateToMeeting },
    { label: '监控', icon: assetUrl('work-home-assets/monitoring.png'), onClick: onNavigateToMonitoring },
    { label: '知识库', icon: assetUrl('work-home-assets/knowledge.png'), onClick: onNavigateToKnowledgeBase },
    { label: '培训考试', icon: assetUrl('work-home-assets/training.png'), onClick: onNavigateToTraining }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f0f3f7] select-none overflow-y-auto pb-6 relative">
      <div className="relative z-0 h-[358px] flex-shrink-0 overflow-visible">
        {/* Airport hero */}
        <div className="absolute inset-x-0 top-0 h-[217px] overflow-hidden bg-sky-500">
          <img
            src={assetUrl('work-home-assets/airport-hero.png')}
            alt="济南机场"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 pt-1">
          <StatusBar />
        </div>

        {/* User row */}
        <div className="absolute left-[15px] right-[18px] top-[70px] z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={onNavigateToProfile}
              className="relative flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
              title="点击查看个人中心"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Avatar"
                className="size-[45px] rounded-full border-2 border-white object-cover shadow-sm"
              />
              <span className="absolute bottom-[1px] right-[1px] size-2.5 rounded-full border-2 border-white bg-[#14c38e]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-white leading-[20px]">
                  上午好，刘强
                </span>
                <span className="inline-flex h-[19px] items-center gap-0.5 rounded-full border border-white/70 bg-[#15bc84] px-[6px] text-[12px] text-white shadow-2xs">
                  <Check className="size-3 stroke-[3]" />
                  在线
                </span>
              </div>
              <p className="mt-0.5 text-[16px] font-semibold leading-[20px] text-white">
                您有<span className="text-[#ff9500]">20</span>条待办任务
              </p>
            </div>
          </div>

          <button className="relative mt-1 flex size-8 items-center justify-center text-slate-800 transition-opacity hover:opacity-80">
            <Bell className="size-[24px] fill-slate-900/10 stroke-[1.8]" />
            <span className="absolute right-[-1px] top-[-1px] flex h-[13px] min-w-[18px] items-center justify-center rounded-full bg-[#f05656] px-1 text-[9px] font-medium leading-none text-white">
              26
            </span>
          </button>
        </div>

        {/* Quick action glass panel */}
        <div className="absolute left-0 right-0 top-[174px] z-20 h-[176px] rounded-t-[16px] rounded-b-[12px] border border-white bg-gradient-to-b from-white/70 to-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-[4px]">
          <div className="grid grid-cols-4 gap-y-[13px] px-0 pb-4 pt-5 text-center">
            {quickActions.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="group flex flex-col items-center gap-[7px] cursor-pointer"
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="size-[44px] rounded-[12px] object-contain transition-transform group-active:scale-95"
                />
                <span className="text-[12px] font-normal leading-[18px] text-[#222] tracking-normal">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List Header */}
      <div className="h-[56px] flex-shrink-0 rounded-t-[16px] bg-gradient-to-b from-white via-white to-[#f2f1f5] px-8 pt-[15px] mb-2 flex items-start justify-between">
        <div className="flex items-start gap-6">
          {/* 待办 Tab */}
          <button
            onClick={() => setTaskTab('todo')}
            className={`relative flex items-center text-[15px] leading-[22px] transition-colors ${
              taskTab === 'todo' ? 'font-medium text-[#03091b]' : 'font-normal text-[#4e5969]'
            }`}
          >
            待办
            <span className="absolute -right-[18px] -top-1 flex size-[18px] items-center justify-center rounded-full bg-[#f53f6b] text-[12px] font-medium leading-[12px] text-white">
              12
            </span>
            {taskTab === 'todo' && (
              <span className="absolute -bottom-[7px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[#007aff]" />
            )}
          </button>

          {/* 已办 Tab */}
          <button
            onClick={() => setTaskTab('done')}
            className={`relative text-[15px] leading-[22px] transition-colors ${
              taskTab === 'done' ? 'font-medium text-[#03091b]' : 'font-normal text-[#4e5969]'
            }`}
          >
            已办
            {taskTab === 'done' && (
              <span className="absolute -bottom-[7px] left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[#007aff]" />
            )}
          </button>
        </div>

        {/* Filter Button / View all events */}
        <button
          onClick={onNavigateToEventList}
          className="flex items-center gap-2 text-[15px] leading-[22px] text-[#4e5969] hover:text-blue-600 cursor-pointer"
        >
          <span>全部</span>
          <SlidersHorizontal className="size-[15px] stroke-[1.8]" />
        </button>
      </div>

      {/* Task Cards List */}
      <div className="px-3 space-y-2 flex-1">
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
              <UserRound className="w-4 h-4 text-blue-500" />
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
              <UserRound className="w-4 h-4 text-blue-500" />
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
