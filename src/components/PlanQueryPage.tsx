import React, { useState } from 'react';
import { ChevronLeft, Search, ChevronDown, Calendar, X, FileText, Bookmark, Check } from 'lucide-react';
import { PlanDetailPage, PlanDetailData } from './PlanDetailPage';
import { StatusBar } from './StatusBar';

interface PlanItem {
  id: string;
  title: string;
  category: string; // 综合预案 | 专项预案 | 现场处置方案
  subTag: string; // 领导批示 | 通关秩序异常 | 防汛抢险 | 消防安全
  department: string;
  publishDate: string;
  version: string;
  coverBg: string;
  patternType: 'lines' | 'curves' | 'waves' | 'circles' | 'bars' | 'dots';
  summary: string;
  sections: string[];
}

const mockPlans: PlanItem[] = [
  {
    id: 'p1',
    title: '机场突发事件总体应急预案',
    category: '综合预案',
    subTag: '领导批示',
    department: '济南机场',
    publishDate: '2026-10-2',
    version: 'V3.2',
    coverBg: 'from-blue-600 via-blue-500 to-sky-400',
    patternType: 'lines',
    summary: '本预案规定了济南机场应对各类突发事件的应急响应机制、组织指挥体系、处置程序及善后保障工作，适用于机场范围内发生的自然灾害、事故灾难、公共卫生事件及社会安全事件的应急处置。',
    sections: [
      '1. 总则 (编制目的、依据、适用范围与工作原则)',
      '2. 组织指挥体系及职责',
      '3. 预警机制与信息报告流程',
      '4. 应急响应等级与分级处置措施',
      '5. 后勤保障与恢复重建',
      '6. 预案演练与修订规范'
    ]
  },
  {
    id: 'p2',
    title: '机场突发事件总体应急预案',
    category: '专项预案',
    subTag: '领导批示',
    department: '济南机场',
    publishDate: '2026-10-2',
    version: 'V2.1',
    coverBg: 'from-emerald-500 via-teal-500 to-emerald-400',
    patternType: 'curves',
    summary: '专门针对机场航站楼、飞行区及航站区消防安全与紧急疏散的专项处置方案，明确了火警扑救、人员疏散、医疗救护及现场封控等具体响应标准。',
    sections: [
      '1. 适用范围与风险分析',
      '2. 现场指挥联动机制',
      '3. 人员紧急疏散路径与引导',
      '4. 消防器材与救援物资调用',
      '5. 事故现场恢复与总结报告'
    ]
  },
  {
    id: 'p3',
    title: '机场突发事件总体应急预案',
    category: '专项预案',
    subTag: '通关秩序异常',
    department: '济南机场',
    publishDate: '2026-10-2',
    version: 'V1.8',
    coverBg: 'from-purple-600 via-indigo-500 to-purple-400',
    patternType: 'waves',
    summary: '针对国际航站楼通关系统故障、客流暴增或通关受阻等异常情况的应急处置预案，快速联动海关、边检与机场地服部门，保障通关秩序平稳。',
    sections: [
      '1. 通关异常分类与判定标准',
      '2. 多部门联合响应分工',
      '3. 客流分流与备用通道开启方案',
      '4. 旅客情绪安抚与信息发布'
    ]
  },
  {
    id: 'p4',
    title: '机场突发事件总体应急预案',
    category: '专项预案',
    subTag: '通关秩序异常',
    department: '济南机场',
    publishDate: '2026-10-2',
    version: 'V2.5',
    coverBg: 'from-sky-500 via-blue-500 to-cyan-400',
    patternType: 'circles',
    summary: '应对极端恶劣天气导致的大面积航班延误应急响应预案，涵盖旅客滞留退改签服务、餐饮防寒物资供应、航站楼过夜安置及交通接驳保障。',
    sections: [
      '1. 航班大面积延误预警触发条件',
      '2. 应急会商与运管委联动机制',
      '3. 航站楼服务保障与物资发放',
      '4. 陆侧交通疏运与出租车调度'
    ]
  },
  {
    id: 'p5',
    title: '机场突发事件总体应急预案',
    category: '专项预案',
    subTag: '通关秩序异常',
    department: '济南机场',
    publishDate: '2026-10-2',
    version: 'V1.4',
    coverBg: 'from-teal-600 via-cyan-600 to-teal-400',
    patternType: 'bars',
    summary: '针对机场核心通信网络、离港系统及安全检查系统网络瘫痪或受攻击情况下的手工作业备用切换与数据恢复应急预案。',
    sections: [
      '1. 网络安全事件分级',
      '2. 应急响应与手工值机切换流程',
      '3. 系统修复与数据同步验证'
    ]
  },
  {
    id: 'p6',
    title: '机场突发事件总体应急预案',
    category: '专项预案',
    subTag: '通关秩序异常',
    department: '济南机场',
    publishDate: '2026-10-2',
    version: 'V2.0',
    coverBg: 'from-orange-500 via-amber-500 to-orange-400',
    patternType: 'dots',
    summary: '危险化学品及航空货物运输事故现场处置预案，规定了隔离警戒区域设定、专业防化队伍响应以及有毒有害气体监控程序。',
    sections: [
      '1. 危险品泄露事故分级',
      '2. 现场警戒与隔离带设置',
      '3. 专业处置与环境保护'
    ]
  }
];

interface PlanQueryPageProps {
  onBack: () => void;
}

export const PlanQueryPage: React.FC<PlanQueryPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedOrg, setSelectedOrg] = useState<string>('全部');
  const [dateRange, setDateRange] = useState<string>('8月8日–10月23日');
  
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'org' | 'date' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [bookmarkedPlans, setBookmarkedPlans] = useState<string[]>(['p1']);

  // Filter options
  const categories = ['全部', '综合预案', '专项预案', '现场处置方案'];
  const orgs = ['全部', '济南机场', '首都机场', '广州机场', '运行指挥中心'];
  const dateRanges = ['8月8日–10月23日', '近1个月', '近3个月', '2026全年', '自定义时间'];

  // Filter logic
  const filteredPlans = mockPlans.filter((plan) => {
    const matchesSearch =
      plan.title.includes(searchQuery) ||
      plan.category.includes(searchQuery) ||
      plan.subTag.includes(searchQuery) ||
      plan.department.includes(searchQuery);

    const matchesCategory =
      selectedCategory === '全部' || plan.category === selectedCategory;

    const matchesOrg =
      selectedOrg === '全部' || plan.department === selectedOrg;

    return matchesSearch && matchesCategory && matchesOrg;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedPlans((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Render decorative cover patterns to match the screenshot precisely
  const renderCoverPattern = (type: PlanItem['patternType']) => {
    switch (type) {
      case 'lines':
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[size:12px_12px]" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-white/20 blur-sm" />
          </div>
        );
      case 'curves':
        return (
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full border-4 border-white/40" />
            <div className="absolute -bottom-10 -right-6 w-28 h-28 rounded-full border-4 border-white/30" />
          </div>
        );
      case 'waves':
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="none">
              <path d="M0 20 Q 50 40 100 20 T 200 20 V120 H0 Z" fill="white" opacity="0.3" />
              <path d="M0 60 Q 50 80 100 60 T 200 60 V120 H0 Z" fill="white" opacity="0.2" />
            </svg>
          </div>
        );
      case 'circles':
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute top-2 right-2 w-16 h-16 rounded-full border-2 border-white/50" />
            <div className="absolute bottom-2 left-2 w-20 h-20 rounded-full bg-white/20" />
          </div>
        );
      case 'bars':
        return (
          <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-around items-end p-2">
            <div className="w-2 h-16 bg-white rounded-full" />
            <div className="w-2 h-24 bg-white rounded-full" />
            <div className="w-2 h-12 bg-white rounded-full" />
            <div className="w-2 h-20 bg-white rounded-full" />
          </div>
        );
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1.5px,transparent_1.5px)] bg-[size:8px_8px]" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] relative overflow-hidden select-none">
      {/* Top Header with Soft Sky Gradient Background */}
      <div className="app-plan-query-bg pt-0 pb-3.5 px-3 relative z-20">
        <div className="-mx-3 mb-1">
          <StatusBar />
        </div>
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-3 relative">
          <button
            onClick={onBack}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
            预案查询
          </h1>
          <div className="w-8" />
        </div>

        {/* Search Bar Input */}
        <div className="relative mb-3">
          <div className="bg-white/85 backdrop-blur-md rounded-xl flex h-10 items-center px-3 py-0 shadow-2xs border border-white/60 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索"
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar Row */}
        <div className="flex items-center justify-between gap-1.5 text-xs text-slate-800 font-medium">
          {/* 事件类型 Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === 'category' ? null : 'category')
              }
              className={`w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-colors ${
                selectedCategory !== '全部'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white/40 active:bg-white/60 text-slate-900'
              }`}
            >
              <span className="truncate">
                {selectedCategory === '全部' ? '事件类型' : selectedCategory}
              </span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
            </button>

            {/* Category Menu */}
            {activeDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-fade-in">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedCategory === cat
                        ? 'text-blue-600 font-bold bg-blue-50/60'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 组织机构 Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === 'org' ? null : 'org')
              }
              className={`w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-colors ${
                selectedOrg !== '全部'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white/40 active:bg-white/60 text-slate-900'
              }`}
            >
              <span className="truncate">
                {selectedOrg === '全部' ? '组织机构' : selectedOrg}
              </span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
            </button>

            {/* Org Menu */}
            {activeDropdown === 'org' && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-fade-in">
                {orgs.map((org) => (
                  <button
                    key={org}
                    onClick={() => {
                      setSelectedOrg(org);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedOrg === org
                        ? 'text-blue-600 font-bold bg-blue-50/60'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{org}</span>
                    {selectedOrg === org && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === 'date' ? null : 'date')
              }
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/40 active:bg-white/60 text-slate-900 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-800" />
              <span className="text-[11px] tracking-tight">{dateRange}</span>
            </button>

            {/* Date Range Menu */}
            {activeDropdown === 'date' && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 animate-fade-in">
                {dateRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setActiveDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      dateRange === range
                        ? 'text-blue-600 font-bold bg-blue-50/60'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{range}</span>
                    {dateRange === range && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main List Area */}
      <div
        onClick={() => setActiveDropdown(null)}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
      >
        {filteredPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <FileText className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
            <p className="text-xs font-medium">未搜到相关预案文件</p>
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const isBookmarked = bookmarkedPlans.includes(plan.id);
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-100 flex gap-3.5 items-stretch cursor-pointer active:scale-[0.99] transition-transform relative overflow-hidden group"
              >
                {/* Book Cover Design */}
                <div
                  className={`w-[88px] h-[114px] rounded-xl flex-shrink-0 bg-gradient-to-br ${plan.coverBg} flex items-center justify-center p-2 text-center text-white font-bold text-[13px] leading-tight relative shadow-xs select-none`}
                >
                  {/* Decorative background overlay */}
                  {renderCoverPattern(plan.patternType)}

                  {/* Vertical / centered title text */}
                  <span className="z-10 text-white font-bold drop-shadow-xs tracking-tight line-clamp-4">
                    {plan.title}
                  </span>
                </div>

                {/* Right Details Info */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Plan Title */}
                    <h3 className="text-[14px] font-bold text-slate-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {plan.title}
                    </h3>

                    {/* Tag Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <span className="bg-blue-50 text-blue-600 border border-blue-200/80 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {plan.category}
                      </span>
                      <span className="bg-slate-50 text-slate-600 border border-slate-200/80 text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {plan.subTag}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="space-y-0.5 text-[11px] text-slate-500">
                    <p>所属单位： <span className="text-slate-700">{plan.department}</span></p>
                    <p>发布时间： <span className="text-slate-700">{plan.publishDate}</span></p>
                  </div>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => toggleBookmark(plan.id, e)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-300 hover:text-amber-500 transition-colors"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isBookmarked ? 'fill-amber-400 text-amber-500' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Plan Details Full View (Matches 预案详情 Screenshots) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-[#f4f6fb] animate-fade-in">
          <PlanDetailPage
            plan={{
              id: selectedPlan.id,
              title: selectedPlan.title,
              department: selectedPlan.department,
              version: selectedPlan.version,
              category: selectedPlan.category,
              subTag: selectedPlan.subTag,
              publishDate: selectedPlan.publishDate,
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
                  name: `${selectedPlan.title}_${selectedPlan.version}.pdf`,
                  size: '2.4MB',
                  type: 'pdf'
                },
                {
                  name: '预案附件清单.xlsx',
                  size: '18KB',
                  type: 'excel'
                }
              ]
            }}
            onBack={() => setSelectedPlan(null)}
          />
        </div>
      )}
    </div>
  );
};
