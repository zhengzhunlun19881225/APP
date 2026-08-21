import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  FileText,
  Shield,
  ShieldAlert,
  Building2,
  Users,
  Radio,
  FileSpreadsheet,
  CheckCircle2,
  Share2,
  Bookmark,
  X,
  ExternalLink,
  Phone,
  Clock,
  ArrowDown,
  Activity,
  Layers
} from 'lucide-react';

export interface PlanDetailData {
  id: string;
  title: string;
  department: string;
  version: string;
  category: string;
  subTag: string;
  publishDate: string;
  lastRevisedDate: string;
  eventType: string;
  legalBasis: string[];
  notes: string;
  purpose: string;
  scope: string;
  impactScope: string;
  derivativeRisks: string;
  attachments: {
    name: string;
    size: string;
    type: 'pdf' | 'excel' | 'doc';
  }[];
}

export const defaultPlanDetailData: PlanDetailData = {
  id: 'p1',
  title: '城市综合应急预案',
  department: 'XX市应急管理局',
  version: 'V2.1',
  category: '综合应急预案',
  subTag: '领导批示',
  publishDate: '2025-01-15',
  lastRevisedDate: '2025-05-20',
  eventType: '自然灾害',
  legalBasis: [
    '《中华人民共和国突发事件应对法》',
    '《国家自然灾害救助应急预案》'
  ],
  notes: '--',
  purpose: '规范本市应对自然灾害的应急响应程序，提高应急处置能力。',
  scope: '适用于本市行政区域内发生的自然灾害事件。',
  impactScope: '可能影响本市多个区县，造成较大人员伤亡和财产损失。',
  derivativeRisks: '次生灾害、公共卫生事件、交通中断、社会秩序混乱等。',
  attachments: [
    {
      name: '城市综合应急预案_V2.1.pdf',
      size: '2.4MB',
      type: 'pdf'
    },
    {
      name: '预案附件清单.xlsx',
      size: '18KB',
      type: 'excel'
    }
  ]
};

interface PlanDetailPageProps {
  plan?: Partial<PlanDetailData>;
  onBack: () => void;
}

type TabKey = 'basic' | 'org' | 'directive' | 'resource' | 'process';
type PlanLevel = 'level1' | 'level2' | 'level3' | 'level4';

export const PlanDetailPage: React.FC<PlanDetailPageProps> = ({
  plan: initialPlan,
  onBack
}) => {
  const planData: PlanDetailData = {
    ...defaultPlanDetailData,
    ...initialPlan,
    title: initialPlan?.title || defaultPlanDetailData.title,
    department: initialPlan?.department || defaultPlanDetailData.department,
    version: initialPlan?.version || defaultPlanDetailData.version
  };

  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [selectedLevel, setSelectedLevel] = useState<PlanLevel>('level1');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(true);

  // Accordion toggle states in Basic Info
  const [expandedBasicSections, setExpandedBasicSections] = useState<Record<string, boolean>>({
    purpose: true,
    scope: true,
    impact: true,
    risk: true
  });

  // Accordion toggle states in Org
  const [expandedOrgSections, setExpandedOrgSections] = useState<Record<string, boolean>>({
    command: true,
    dispatch: false,
    medical: false,
    logistics: false
  });

  // Member detail modal state
  const [selectedMember, setSelectedMember] = useState<{
    role: string;
    scope: string;
    personnel: string;
    leader: string;
    group: string;
  } | null>(null);

  // Directive detail modal state
  const [showDirectiveDetail, setShowDirectiveDetail] = useState(false);

  // Process node detail modal state
  const [selectedProcessNode, setSelectedProcessNode] = useState<{
    title: string;
    desc: string;
    subNodes?: string[];
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  const toggleBasicSection = (key: string) => {
    setExpandedBasicSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOrgSection = (key: string) => {
    setExpandedOrgSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Level selector config (1级/2级/3级/4级)
  const levels = [
    {
      id: 'level1' as PlanLevel,
      name: '1级预案',
      sub: '重大特别',
      iconBg: 'bg-red-100 text-red-600',
      activeBorder: 'border-red-500 bg-red-50/40 text-red-700',
      tagColor: 'bg-red-500 text-white',
      badgeNum: 'I 级'
    },
    {
      id: 'level2' as PlanLevel,
      name: '2级预案',
      sub: '重大',
      iconBg: 'bg-orange-100 text-orange-600',
      activeBorder: 'border-orange-500 bg-orange-50/40 text-orange-700',
      tagColor: 'bg-orange-500 text-white',
      badgeNum: 'II 级'
    },
    {
      id: 'level3' as PlanLevel,
      name: '3级预案',
      sub: '较大',
      iconBg: 'bg-amber-100 text-amber-600',
      activeBorder: 'border-amber-500 bg-amber-50/40 text-amber-700',
      tagColor: 'bg-amber-500 text-white',
      badgeNum: 'III 级'
    },
    {
      id: 'level4' as PlanLevel,
      name: '4级预案',
      sub: '一般',
      iconBg: 'bg-emerald-100 text-emerald-600',
      activeBorder: 'border-emerald-500 bg-emerald-50/40 text-emerald-700',
      tagColor: 'bg-emerald-600 text-white',
      badgeNum: 'IV 级'
    }
  ];

  // Dynamic Resource Data by level
  const resourceDataByLevel: Record<
    PlanLevel,
    {
      transport: { name: string; dispatch: string; available: string }[];
      medical: { name: string; dispatch: string; available: string }[];
      living: { name: string; dispatch: string; available: string }[];
    }
  > = {
    level1: {
      transport: [
        { name: '救护车', dispatch: '50辆', available: '32辆' },
        { name: '消防车', dispatch: '20辆', available: '15辆' },
        { name: '运输车', dispatch: '30辆', available: '18辆' }
      ],
      medical: [
        { name: '医疗队', dispatch: '10支', available: '6支' },
        { name: '急救箱', dispatch: '100个', available: '80个' },
        { name: '担架', dispatch: '50副', available: '35副' }
      ],
      living: [
        { name: '帐篷', dispatch: '200顶', available: '150顶' },
        { name: '食品', dispatch: '500份', available: '300份' },
        { name: '饮用水', dispatch: '1000箱', available: '600箱' }
      ]
    },
    level2: {
      transport: [
        { name: '救护车', dispatch: '35辆', available: '28辆' },
        { name: '消防车', dispatch: '15辆', available: '12辆' },
        { name: '运输车', dispatch: '20辆', available: '15辆' }
      ],
      medical: [
        { name: '医疗队', dispatch: '7支', available: '5支' },
        { name: '急救箱', dispatch: '70个', available: '60个' },
        { name: '担架', dispatch: '35副', available: '30副' }
      ],
      living: [
        { name: '帐篷', dispatch: '120顶', available: '100顶' },
        { name: '食品', dispatch: '350份', available: '280份' },
        { name: '饮用水', dispatch: '700箱', available: '550箱' }
      ]
    },
    level3: {
      transport: [
        { name: '救护车', dispatch: '20辆', available: '18辆' },
        { name: '消防车', dispatch: '10辆', available: '8辆' },
        { name: '运输车', dispatch: '12辆', available: '10辆' }
      ],
      medical: [
        { name: '医疗队', dispatch: '4支', available: '4支' },
        { name: '急救箱', dispatch: '40个', available: '38个' },
        { name: '担架', dispatch: '20副', available: '18副' }
      ],
      living: [
        { name: '帐篷', dispatch: '60顶', available: '55顶' },
        { name: '食品', dispatch: '200份', available: '180份' },
        { name: '饮用水', dispatch: '400箱', available: '350箱' }
      ]
    },
    level4: {
      transport: [
        { name: '救护车', dispatch: '10辆', available: '10辆' },
        { name: '消防车', dispatch: '5辆', available: '5辆' },
        { name: '运输车', dispatch: '6辆', available: '6辆' }
      ],
      medical: [
        { name: '医疗队', dispatch: '2支', available: '2支' },
        { name: '急救箱', dispatch: '20个', available: '20个' },
        { name: '担架', dispatch: '10副', available: '10副' }
      ],
      living: [
        { name: '帐篷', dispatch: '30顶', available: '30顶' },
        { name: '食品', dispatch: '100份', available: '100份' },
        { name: '饮用水', dispatch: '200箱', available: '200箱' }
      ]
    }
  };

  const currentResources = resourceDataByLevel[selectedLevel];
  const detailRows = [
    { label: '预案名称', value: planData.title },
    { label: '所属单位', value: planData.department },
    { label: '事项类型', value: planData.eventType },
    { label: '预案类型', value: planData.category },
    { label: '版本发布日期', value: planData.publishDate },
    { label: '最近修订日期', value: planData.lastRevisedDate },
    { label: '法律依据', value: planData.legalBasis },
    { label: '备注', value: planData.notes }
  ];

  // Render Sub-Level Selector Bar (Used on tabs: 应急组织, 操作指令, 资源预案, 处置流程)
  const renderLevelSelector = () => (
    <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-2.5 shadow-2xs border border-slate-100/90 mb-3">
      {levels.map((lvl) => {
        const isSelected = selectedLevel === lvl.id;
        return (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative ${
              isSelected
                ? 'bg-slate-50 shadow-xs border border-slate-200/80 font-bold scale-[1.02]'
                : 'hover:bg-slate-50/60 text-slate-600'
            }`}
          >
            {/* Level Icon Badge */}
            <div
              className={`w-9 h-9 rounded-full ${lvl.iconBg} flex items-center justify-center mb-1 shadow-2xs transition-transform ${
                isSelected ? 'scale-110' : 'opacity-85'
              }`}
            >
              <Shield className="w-5 h-5 fill-current" />
            </div>

            {/* Level Name */}
            <span
              className={`text-[12px] leading-tight font-bold ${
                isSelected
                  ? lvl.id === 'level1'
                    ? 'text-red-600'
                    : lvl.id === 'level2'
                    ? 'text-orange-600'
                    : lvl.id === 'level3'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                  : 'text-slate-800'
              }`}
            >
              {lvl.name}
            </span>

            {/* Sub description */}
            <span className="text-[10px] text-slate-400 mt-0.5">{lvl.sub}</span>

            {/* Active Bottom Indicator Dot */}
            {isSelected && (
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  lvl.id === 'level1'
                    ? 'bg-red-500'
                    : lvl.id === 'level2'
                    ? 'bg-orange-500'
                    : lvl.id === 'level3'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f4f6fb] relative overflow-hidden select-none font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[12px] px-3.5 py-1.5 rounded-full shadow-lg z-50 animate-fade-in flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="px-4 pt-3 pb-2.5 flex items-center justify-between z-20 relative bg-gradient-to-b from-[#d9ebfc] via-[#e5f1fd] to-[#edf5ff]">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">预案详情</h1>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              showToast(isBookmarked ? '已取消收藏' : '已添加至预案收藏');
            }}
            className="w-8 h-8 rounded-full bg-white/70 shadow-2xs border border-slate-100/60 flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition-all"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Plan Summary: retained as a mobile-contained information block */}
      <div className="px-4 pb-3 pt-1 bg-[#edf5ff] shrink-0">
        <div className="rounded-2xl bg-[#d9ebfc]/80 px-3.5 py-3 border border-white/60">
          <h2 className="text-[16px] font-bold text-slate-900 leading-snug break-words">
            {planData.title}
          </h2>
          <div className="mt-2 space-y-1 text-[12px] leading-relaxed">
            <p className="text-slate-600">
              发布单位：<span className="text-slate-800 font-medium">{planData.department}</span>
            </p>
            <p className="text-slate-600">
              版本：<span className="text-slate-800 font-medium">{planData.version}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Top 5 Navigation Tabs (基本信息 | 应急组织 | 操作指令 | 资源预案 | 处置流程) */}
      <div className="bg-white border-b border-slate-100 px-2 shadow-2xs z-10 overflow-x-auto">
        <div className="flex items-center text-[13px] font-medium text-slate-500 min-w-max">
          {[
            { key: 'basic', label: '基本信息' },
            { key: 'org', label: '应急组织' },
            { key: 'directive', label: '操作指令' },
            { key: 'resource', label: '资源预案' },
            { key: 'process', label: '处置流程' }
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`py-3 px-2 min-w-[74px] text-center font-medium transition-all relative whitespace-nowrap ${
                  isActive ? 'text-[#0070f3] font-bold' : 'hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#0070f3] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {/* ===================== TAB 1: 基本信息 (Matches 编组 56.png) ===================== */}
        {activeTab === 'basic' && (
          <div className="space-y-3 animate-fade-in">
            {/* Properties Table Card */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 divide-y divide-slate-100 text-[13px]">
              {detailRows.map((row) => (
                <div key={row.label} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="text-[12px] text-slate-400 mb-1">{row.label}</div>
                  <div className="text-[14px] text-slate-800 font-medium leading-relaxed break-words">
                    {Array.isArray(row.value) ? (
                      <div className="space-y-0.5">
                        {row.value.map((law, idx) => (
                          <p key={idx}>{law}</p>
                        ))}
                      </div>
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion 1: 编制目的 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 transition-all">
              <div
                onClick={() => toggleBasicSection('purpose')}
                className="flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-[14px] font-bold text-slate-900">编制目的</h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedBasicSections.purpose ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {expandedBasicSections.purpose && (
                <p className="mt-2.5 text-[12px] text-slate-600 leading-relaxed">
                  {planData.purpose}
                </p>
              )}
            </div>

            {/* Accordion 2: 适用范围 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 transition-all">
              <div
                onClick={() => toggleBasicSection('scope')}
                className="flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-[14px] font-bold text-slate-900">适用范围</h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedBasicSections.scope ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {expandedBasicSections.scope && (
                <p className="mt-2.5 text-[12px] text-slate-600 leading-relaxed">
                  {planData.scope}
                </p>
              )}
            </div>

            {/* Accordion 3: 事件影响范围 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 transition-all">
              <div
                onClick={() => toggleBasicSection('impact')}
                className="flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-[14px] font-bold text-slate-900">事件影响范围</h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedBasicSections.impact ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {expandedBasicSections.impact && (
                <p className="mt-2.5 text-[12px] text-slate-600 leading-relaxed">
                  {planData.impactScope}
                </p>
              )}
            </div>

            {/* Accordion 4: 衍生风险 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 transition-all">
              <div
                onClick={() => toggleBasicSection('risk')}
                className="flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-[14px] font-bold text-slate-900">衍生风险</h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedBasicSections.risk ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {expandedBasicSections.risk && (
                <p className="mt-2.5 text-[12px] text-slate-600 leading-relaxed">
                  {planData.derivativeRisks}
                </p>
              )}
            </div>

            {/* 预案附件 Section */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100">
              <h3 className="text-[14px] font-bold text-slate-900 mb-3">预案附件</h3>
              <div className="space-y-2.5">
                {planData.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/90"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          file.type === 'pdf'
                            ? 'bg-red-500 text-white font-bold text-[10px]'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {file.type === 'pdf' ? (
                          <span>PDF</span>
                        ) : (
                          <FileSpreadsheet className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-slate-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{file.size}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`已下载 ${file.name}`)}
                      className="w-8 h-8 rounded-full bg-white shadow-2xs border border-slate-100 flex items-center justify-center text-[#0070f3] hover:bg-blue-50 active:scale-95 transition-all flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: 应急组织 (Matches 编组 59.png) ===================== */}
        {activeTab === 'org' && (
          <div className="space-y-3 animate-fade-in">
            {renderLevelSelector()}

            {/* Accordion 1: 指挥部 (Expanded) */}
            <div className="bg-white rounded-2xl shadow-2xs border border-slate-100 overflow-hidden">
              <div
                onClick={() => toggleOrgSection('command')}
                className="p-4 flex items-center justify-between cursor-pointer bg-slate-50/50 border-b border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#0070f3] rounded-full" />
                  <h3 className="text-[15px] font-bold text-slate-900">指挥部</h3>
                </div>
                <ChevronUp
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    !expandedOrgSections.command ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedOrgSections.command && (
                <div className="p-4 space-y-3.5">
                  {/* Sub-card: 综合协调组 */}
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-2">综合协调组</h4>
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5 text-[12px]">
                      <p className="text-slate-600">
                        组长：<span className="text-slate-900 font-semibold">张三</span>
                      </p>
                      <p className="text-slate-600">
                        职责：<span className="text-slate-800">负责综合协调、信息汇总、文稿起草等工作</span>
                      </p>
                    </div>
                  </div>

                  {/* 组员角色 (3) */}
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-800 mb-2">组员角色 (3)</h5>
                    <div className="space-y-2">
                      {[
                        {
                          role: '协调员',
                          scope: '协调联络',
                          personnel: '应急管理局相关人员',
                          leader: '张三',
                          group: '综合协调组'
                        },
                        {
                          role: '信息员',
                          scope: '信息收集与报送',
                          personnel: '各部门信息员',
                          leader: '张三',
                          group: '综合协调组'
                        },
                        {
                          role: '文书员',
                          scope: '文稿起草与管理',
                          personnel: '办公室人员',
                          leader: '张三',
                          group: '综合协调组'
                        }
                      ].map((member, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedMember(member)}
                          className="p-3 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer hover:bg-slate-50/80 active:scale-[0.99] transition-all"
                        >
                          <div className="space-y-1 min-w-0">
                            <h6 className="text-[13px] font-bold text-slate-900">{member.role}</h6>
                            <p className="text-[11px] text-slate-500">
                              职务范围：<span className="text-slate-700">{member.scope}</span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              人员范围：<span className="text-slate-700">{member.personnel}</span>
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: 应急处置组 */}
            <div className="bg-white rounded-2xl shadow-2xs border border-slate-100 overflow-hidden">
              <div
                onClick={() => toggleOrgSection('dispatch')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-4 bg-orange-500 rounded-full" />
                  <h3 className="text-[15px] font-bold text-slate-900">应急处置组</h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedOrgSections.dispatch ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedOrgSections.dispatch && (
                <div className="p-4 pt-1 space-y-3 text-[12px] border-t border-slate-100">
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <p className="text-slate-600">
                      组长：<span className="text-slate-900 font-semibold">李四</span>
                    </p>
                    <p className="text-slate-600">
                      职责：<span className="text-slate-800">负责现场封控、抢险救援与人员搜救。</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        role: '现场处置员',
                        scope: '一线破拆与施救',
                        personnel: '特勤抢险队',
                        leader: '李四',
                        group: '应急处置组'
                      },
                      {
                        role: '安全督导员',
                        scope: '现场风险勘测与防范',
                        personnel: '安监工程师',
                        leader: '李四',
                        group: '应急处置组'
                      }
                    ].map((m, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedMember(m)}
                        className="p-3 rounded-xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <h6 className="text-[13px] font-bold text-slate-900">{m.role}</h6>
                          <p className="text-[11px] text-slate-500 mt-1">职务范围：{m.scope}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: 医疗救护组 */}
            <div className="bg-white rounded-2xl shadow-2xs border border-slate-100 overflow-hidden">
              <div
                onClick={() => toggleOrgSection('medical')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-[15px] font-bold text-slate-900">医疗救护组</h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedOrgSections.medical ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedOrgSections.medical && (
                <div className="p-4 pt-1 space-y-3 text-[12px] border-t border-slate-100">
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <p className="text-slate-600">
                      组长：<span className="text-slate-900 font-semibold">王医生</span>
                    </p>
                    <p className="text-slate-600">
                      职责：<span className="text-slate-800">负责伤员现场急救、检伤分类与转运定点医院。</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: 后勤保障组 */}
            <div className="bg-white rounded-2xl shadow-2xs border border-slate-100 overflow-hidden">
              <div
                onClick={() => toggleOrgSection('logistics')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-4 bg-purple-500 rounded-full" />
                  <h3 className="text-[15px] font-bold text-slate-900">后勤保障组</h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedOrgSections.logistics ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedOrgSections.logistics && (
                <div className="p-4 pt-1 space-y-3 text-[12px] border-t border-slate-100">
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <p className="text-slate-600">
                      组长：<span className="text-slate-900 font-semibold">赵经理</span>
                    </p>
                    <p className="text-slate-600">
                      职责：<span className="text-slate-800">负责应急通信、应急物资调拨与交通运输调度保障。</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: 操作指令 (Matches 编组 62.png) ===================== */}
        {activeTab === 'directive' && (
          <div className="space-y-3 animate-fade-in">
            {renderLevelSelector()}

            {/* Command Tree Structure Card */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col items-center">
              {/* Level 1: 总指挥 */}
              <div
                onClick={() => setShowDirectiveDetail(true)}
                className="w-36 py-2 px-3 rounded-xl bg-blue-50/80 border-2 border-blue-400 text-center shadow-2xs cursor-pointer hover:bg-blue-100/70 active:scale-95 transition-all"
              >
                <h4 className="text-[14px] font-bold text-blue-600">总指挥</h4>
                <p className="text-[11px] text-slate-500">市政府领导</p>
              </div>

              {/* Connecting arrow 1 */}
              <div className="flex flex-col items-center my-1.5">
                <div className="w-0.5 h-4 bg-blue-400" />
                <ArrowDown className="w-3.5 h-3.5 text-blue-500 -mt-1" />
              </div>

              {/* Level 2: 副总指挥 */}
              <div
                onClick={() => setShowDirectiveDetail(true)}
                className="w-40 py-2 px-3 rounded-xl bg-blue-50/80 border-2 border-blue-400 text-center shadow-2xs cursor-pointer hover:bg-blue-100/70 active:scale-95 transition-all"
              >
                <h4 className="text-[14px] font-bold text-blue-600">副总指挥</h4>
                <p className="text-[11px] text-slate-500">应急管理局局长</p>
              </div>

              {/* Branching tree 1 to Level 3 */}
              <div className="w-full flex flex-col items-center mt-2 mb-1">
                <div className="w-0.5 h-3 bg-blue-300" />
                {/* Horizontal branch line spanning 3 items */}
                <div className="w-[82%] h-0.5 bg-blue-300 relative">
                  <div className="absolute top-0 left-0 w-0.5 h-3 bg-blue-300" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-blue-300" />
                  <div className="absolute top-0 right-0 w-0.5 h-3 bg-blue-300" />
                </div>
              </div>

              {/* Level 3: 指挥协调组 | 现场指挥部 | 专家顾问组 */}
              <div className="w-full grid grid-cols-3 gap-2 mt-2">
                <div
                  onClick={() => setShowDirectiveDetail(true)}
                  className="py-2 px-1 rounded-xl bg-blue-50/60 border border-blue-300 text-center cursor-pointer hover:bg-blue-100/60"
                >
                  <h5 className="text-[12px] font-bold text-blue-600">指挥协调组</h5>
                </div>

                <div
                  onClick={() => setShowDirectiveDetail(true)}
                  className="py-2 px-1 rounded-xl bg-blue-100/70 border-2 border-blue-500 text-center cursor-pointer shadow-2xs"
                >
                  <h5 className="text-[12px] font-bold text-blue-700">现场指挥部</h5>
                </div>

                <div
                  onClick={() => setShowDirectiveDetail(true)}
                  className="py-2 px-1 rounded-xl bg-blue-50/60 border border-blue-300 text-center cursor-pointer hover:bg-blue-100/60"
                >
                  <h5 className="text-[12px] font-bold text-blue-600">专家顾问组</h5>
                </div>
              </div>

              {/* Branching from 现场指挥部 down to sub-groups */}
              <div className="w-full flex flex-col items-center mt-2 mb-1">
                <div className="w-0.5 h-3 bg-blue-300" />
                <div className="w-[82%] h-0.5 bg-blue-300 relative">
                  <div className="absolute top-0 left-0 w-0.5 h-3 bg-blue-300" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-blue-300" />
                  <div className="absolute top-0 right-0 w-0.5 h-3 bg-blue-300" />
                </div>
              </div>

              {/* Level 4: 信息研判组 | 应急处置组 | 后勤保障组 */}
              <div className="w-full grid grid-cols-3 gap-2 mt-2 mb-2">
                <div
                  onClick={() => setShowDirectiveDetail(true)}
                  className="py-2 px-1 rounded-xl bg-blue-50/50 border border-blue-200 text-center cursor-pointer hover:bg-blue-100/60"
                >
                  <h5 className="text-[12px] font-medium text-blue-600">信息研判组</h5>
                </div>

                <div
                  onClick={() => setShowDirectiveDetail(true)}
                  className="py-2 px-1 rounded-xl bg-blue-50/50 border border-blue-200 text-center cursor-pointer hover:bg-blue-100/60"
                >
                  <h5 className="text-[12px] font-medium text-blue-600">应急处置组</h5>
                </div>

                <div
                  onClick={() => setShowDirectiveDetail(true)}
                  className="py-2 px-1 rounded-xl bg-blue-50/50 border border-blue-200 text-center cursor-pointer hover:bg-blue-100/60"
                >
                  <h5 className="text-[12px] font-medium text-blue-600">后勤保障组</h5>
                </div>
              </div>
            </div>

            {/* Bottom Card: 指挥安排 (Matches 编组 62.png) */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/80 shadow-2xs space-y-2">
              <h4 className="text-[14px] font-bold text-slate-900">指挥安排</h4>
              <p className="text-[12px] text-slate-700 leading-relaxed">
                负责整体指挥协调，制定应急处置策略，下达指令，监督执行情况。
              </p>
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => setShowDirectiveDetail(true)}
                  className="text-[12px] font-semibold text-[#0070f3] flex items-center gap-1 hover:underline active:scale-95"
                >
                  <span>查看详情</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: 资源预案 (Matches 编组 57.png) ===================== */}
        {activeTab === 'resource' && (
          <div className="space-y-3 animate-fade-in">
            {renderLevelSelector()}

            {/* Table 1: 交通运输类 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-[14px] font-bold text-slate-900">交通运输类</h3>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-[12px] text-left">
                  <thead className="bg-slate-50 text-slate-400 font-normal border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3 font-normal">资源小类</th>
                      <th className="py-2.5 px-3 font-normal text-center">调派数量</th>
                      <th className="py-2.5 px-3 font-normal text-right">可用数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {currentResources.transport.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{item.dispatch}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">{item.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: 医疗救护类 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 bg-emerald-600 rounded-full" />
                <h3 className="text-[14px] font-bold text-slate-900">医疗救护类</h3>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-[12px] text-left">
                  <thead className="bg-slate-50 text-slate-400 font-normal border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3 font-normal">资源小类</th>
                      <th className="py-2.5 px-3 font-normal text-center">调派数量</th>
                      <th className="py-2.5 px-3 font-normal text-right">可用数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {currentResources.medical.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{item.dispatch}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">{item.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: 生活保障类 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 bg-amber-600 rounded-full" />
                <h3 className="text-[14px] font-bold text-slate-900">生活保障类</h3>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-[12px] text-left">
                  <thead className="bg-slate-50 text-slate-400 font-normal border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3 font-normal">资源小类</th>
                      <th className="py-2.5 px-3 font-normal text-center">调派数量</th>
                      <th className="py-2.5 px-3 font-normal text-right">可用数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {currentResources.living.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{item.dispatch}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">{item.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 5: 处置流程 (Matches 编组 58备份.png) ===================== */}
        {activeTab === 'process' && (
          <div className="space-y-3 animate-fade-in">
            {renderLevelSelector()}

            {/* Flowchart Diagram Card */}
            <div className="bg-white rounded-2xl p-5 shadow-2xs border border-slate-100">
              <div className="max-w-[340px] mx-auto space-y-4 relative">
                {/* Step 1: 事件上报 */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() =>
                      setSelectedProcessNode({
                        title: '事件上报',
                        desc: '监测到突发事故后，第一发现人或监控值班人员第一时间通过指挥专线与应急系统完成首报。'
                      })
                    }
                    className="w-40 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-center font-bold text-[13px] text-slate-800 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    事件上报
                  </div>
                  <div className="w-0.5 h-5 bg-slate-300 my-1" />
                </div>

                {/* Step 2: 现场先期处置 (with right-branching nodes) */}
                <div className="relative">
                  <div className="flex items-start justify-between">
                    {/* Left node */}
                    <div
                      onClick={() =>
                        setSelectedProcessNode({
                          title: '现场先期处置',
                          desc: '发生事故所在责任单位立即组织自救互救，实施现场警戒封控，防止次生衍生灾害扩大。',
                          subNodes: ['人员调派', '职能部门指挥', '联系相关单位']
                        })
                      }
                      className="w-36 py-3 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-center font-bold text-[13px] text-slate-800 shadow-2xs cursor-pointer flex-shrink-0"
                    >
                      现场先期处置
                    </div>

                    {/* Horizontal connector line */}
                    <div className="flex-1 flex items-center pt-5">
                      <div className="h-0.5 w-full bg-slate-300" />
                    </div>

                    {/* Right branch bracket & 3 sub-nodes */}
                    <div className="w-36 space-y-2 flex-shrink-0 border-l-2 border-slate-300 pl-2">
                      {['人员调派', '职能部门指挥', '联系相关单位'].map((sub, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            setSelectedProcessNode({
                              title: sub,
                              desc: `在先期处置阶段执行【${sub}】动作，启动应急预备组与联络机制。`
                            })
                          }
                          className="py-1.5 px-2 rounded-lg bg-slate-50/90 hover:bg-blue-50 border border-slate-200/80 text-center text-[12px] text-slate-700 font-medium cursor-pointer"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vertical connector down from left node */}
                  <div className="w-36 flex justify-center">
                    <div className="w-0.5 h-6 bg-slate-300" />
                  </div>
                </div>

                {/* Step 3: 事件接报核实 */}
                <div className="flex flex-col items-start">
                  <div
                    onClick={() =>
                      setSelectedProcessNode({
                        title: '事件接报核实',
                        desc: '指挥中心接报后，2分钟内核实事发地点、人员伤亡、危害程度及发展趋势。'
                      })
                    }
                    className="w-36 py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-center font-bold text-[13px] text-slate-800 shadow-2xs cursor-pointer"
                  >
                    事件接报核实
                  </div>
                  <div className="w-36 flex justify-center my-1">
                    <div className="w-0.5 h-5 bg-slate-300" />
                  </div>
                </div>

                {/* Step 4: 事件续报 */}
                <div className="flex flex-col items-start">
                  <div
                    onClick={() =>
                      setSelectedProcessNode({
                        title: '事件续报',
                        desc: '根据现场最新处置态势，每隔15-30分钟按规定路径持续向上级报告处置进展。'
                      })
                    }
                    className="w-36 py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-center font-bold text-[13px] text-slate-800 shadow-2xs cursor-pointer"
                  >
                    事件续报
                  </div>
                  <div className="w-36 flex justify-center my-1">
                    <div className="w-0.5 h-5 bg-slate-300" />
                  </div>
                </div>

                {/* Step 5: 监控研判 */}
                <div className="flex flex-col items-start">
                  <div
                    onClick={() =>
                      setSelectedProcessNode({
                        title: '监控研判',
                        desc: '专家顾问组结合现场视频监控与传感器物联网数据进行风险趋势模型推演。'
                      })
                    }
                    className="w-36 py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-center font-bold text-[13px] text-slate-800 shadow-2xs cursor-pointer"
                  >
                    监控研判
                  </div>
                  <div className="w-36 flex justify-center my-1">
                    <div className="w-0.5 h-5 bg-slate-300" />
                  </div>
                </div>

                {/* Step 6: 报告 (with right-branching nodes) */}
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() =>
                        setSelectedProcessNode({
                          title: '报告',
                          desc: '根据研判结论，向党委政府及上级主管部门形成正式书面应急报告。',
                          subNodes: ['市委、市政府', '上级单位']
                        })
                      }
                      className="w-36 py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-center font-bold text-[13px] text-slate-800 shadow-2xs cursor-pointer flex-shrink-0"
                    >
                      报告
                    </div>

                    <div className="flex-1 flex items-center pt-3.5">
                      <div className="h-0.5 w-full bg-slate-300" />
                    </div>

                    <div className="w-36 space-y-2 flex-shrink-0 border-l-2 border-slate-300 pl-2">
                      {['市委、市政府', '上级单位'].map((sub, i) => (
                        <div
                          key={i}
                          onClick={() =>
                            setSelectedProcessNode({
                              title: sub,
                              desc: `报送至【${sub}】应急总指挥部审阅。`
                            })
                          }
                          className="py-1.5 px-2 rounded-lg bg-slate-50/90 hover:bg-blue-50 border border-slate-200/80 text-center text-[12px] text-slate-700 font-medium cursor-pointer"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL: 组员详情 (Member Details) ===================== */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {selectedMember.role.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900">{selectedMember.role}</h4>
                  <p className="text-[11px] text-slate-400">{selectedMember.group}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">分管组长</span>
                  <span className="text-slate-800 font-semibold">{selectedMember.leader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">职务范围</span>
                  <span className="text-slate-800 font-medium">{selectedMember.scope}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">人员编制范围</span>
                  <span className="text-slate-800 font-medium">{selectedMember.personnel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">响应等级要求</span>
                  <span className="text-red-600 font-bold">10分钟内全员集结到岗</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="w-full py-2 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl font-bold text-[13px] active:scale-98 transition-all"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: 指挥安排详情 ===================== */}
      {showDirectiveDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900">指挥调度安排规范</h4>
                  <p className="text-[11px] text-slate-400">响应等级：{levels.find(l => l.id === selectedLevel)?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectiveDetail(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px] text-slate-700 leading-relaxed">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-1.5">
                <h5 className="font-bold text-blue-700">1. 指挥权限与层级</h5>
                <p>总指挥由市领导担任，全面主持应急处置决策；副总指挥由市应急管理局局长担任，负责现场执行与协调督办。</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <h5 className="font-bold text-slate-900">2. 指令下达路径</h5>
                <p>总指挥部 ➔ 现场指挥部 ➔ 各专业应急小组。严禁越级下达或私自更改战术方案。</p>
              </div>
            </div>

            <button
              onClick={() => setShowDirectiveDetail(false)}
              className="w-full py-2 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl font-bold text-[13px]"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* ===================== MODAL: 流程节点详情 ===================== */}
      {selectedProcessNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-[15px] font-bold text-slate-900">流程环节：{selectedProcessNode.title}</h4>
              <button
                onClick={() => setSelectedProcessNode(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px] text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p>{selectedProcessNode.desc}</p>
              {selectedProcessNode.subNodes && (
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="font-semibold text-slate-900">关联协同分支：</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedProcessNode.subNodes.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedProcessNode(null)}
              className="w-full py-2 bg-[#0070f3] hover:bg-blue-600 text-white rounded-xl font-bold text-[13px]"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
