import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, X, ChevronRight } from 'lucide-react';

interface SkillTreePageProps {
  onBack: () => void;
  onSelectQuestion: (question: string) => void;
}

interface SkillCategory {
  id: string;
  name: string;
  subCategories: string[];
  questions: string[];
}

const skillCategoriesData: SkillCategory[] = [
  {
    id: 'hr',
    name: '人力',
    subCategories: ['全部', '人员分布', '年龄学历', '入职离职', '人效分析'],
    questions: [
      '1. 人员主要集中在实业领域',
      '人才团队与管理人员年龄分布队',
      '30岁以下人员比例',
      '30岁以下人员比例',
      '30岁以下人员比例',
      '30岁以下人员比例',
      '各企业人员入职、离职、人员变化情况',
      '30岁以下人员比例',
      '各企业人员入职、离职、人员变化情况',
      '各部门人效与营收贡献排名对比',
      '高层次人才与骨干专家流动趋势',
      '全集团员工学历与职称分布全景'
    ]
  },
  {
    id: 'finance',
    name: '财务',
    subCategories: ['全部', '收入利润', '预算执行', '税费成本', '资金流动'],
    questions: [
      '2024年度集团财务收入与利润总额',
      '各板块一般公共预算与税收收入结构',
      '全季度预算执行进度与预警指标',
      '各分子公司研发费用与成本费用占比',
      '主要业务线现金流与资金回笼周期',
      '本年经营性利润与去年同期增长率',
      '各区域销售回款明细与逾期账款分布'
    ]
  },
  {
    id: 'invest',
    name: '投资',
    subCategories: ['全部', '项目进度', '投资回报', '风控评估'],
    questions: [
      '重大战略投资项目投后收益回报率(ROI)',
      '年度股权投资及战略合作进展评估',
      '新产业孵化项目阶段性投资成果',
      '对外合资合作项目年度资金调配'
    ]
  },
  {
    id: 'assets',
    name: '资产',
    subCategories: ['全部', '固定资产', '闲置盘活', '无形资产'],
    questions: [
      '集团国有资产保值增值率统计',
      '各园区厂房及土地资产利用率分析',
      '核心专利与知识产权无形资产评估',
      '低效无效资产处置与盘活进度报告'
    ]
  },
  {
    id: 'property',
    name: '产权',
    subCategories: ['全部', '股权结构', '产权登记', '交易流转'],
    questions: [
      '集团各级控股子公司股权穿透结构',
      '年度产权交易挂牌与交割流转状态',
      '国有产权权属变更与登记备案明细'
    ]
  },
  {
    id: 'operation',
    name: '经营',
    subCategories: ['全部', '产销协同', '供应链', '重点工程'],
    questions: [
      '全集团主营业务月度产能与交付达成率',
      '供应链关键原材料采购价格波动走势',
      '重大工程项目节点履约与施工进度'
    ]
  },
  {
    id: 'risk',
    name: '风控',
    subCategories: ['全部', '合规审计', '法律纠纷', '安全生产'],
    questions: [
      '重大经营风险监控指标预警看板',
      '集团涉诉案件处置与法律纠纷进展',
      '各生产基地安全生产巡检与隐患整改'
    ]
  }
];

export const SkillTreePage: React.FC<SkillTreePageProps> = ({ onBack, onSelectQuestion }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('finance');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('小类名称');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;

  const activeCategory = skillCategoriesData.find((c) => c.id === selectedCategoryId) || skillCategoriesData[0];

  // Filter questions based on search keyword and category
  const filteredQuestions = useMemo(() => {
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      // Search globally across all categories
      const allQ: { question: string; categoryName: string }[] = [];
      skillCategoriesData.forEach((cat) => {
        cat.questions.forEach((q) => {
          if (q.toLowerCase().includes(kw)) {
            allQ.push({ question: q, categoryName: cat.name });
          }
        });
      });
      return allQ.map((item) => item.question);
    }

    return activeCategory.questions;
  }, [searchKeyword, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPageSafe - 1) * pageSize,
    currentPageSafe * pageSize
  );

  // Highlight matched keyword in blue (1:1 with Image 2)
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-[#0070f3] font-bold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] select-none font-sans animate-fade-in">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">技能树</h1>

        <div className="w-8" />
      </div>

      {/* Global Search Input Box (1:1 with Images 1 & 2) */}
      <div className="px-4 pt-3 pb-2 bg-white">
        <div className="app-search-shell !bg-[#f8fafc] !border-slate-200/80 !backdrop-blur-none">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="搜索"
            className="app-search-input"
          />
          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword('');
                setCurrentPage(1);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content White Card (1:1 with design) */}
      <div className="flex-1 overflow-hidden flex flex-col mx-3 my-2 bg-white rounded-2xl shadow-xs border border-slate-100/90">
        {/* Category Tabs Header */}
        <div className="flex items-center gap-6 px-4 pt-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {skillCategoriesData.map((cat) => {
            const isActive = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setSelectedSubCat(cat.subCategories[1] || '全部');
                  setCurrentPage(1);
                }}
                className={`pb-2.5 text-[15px] font-bold tracking-tight whitespace-nowrap relative transition-colors ${
                  isActive ? 'text-[#0070f3]' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0070f3] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Subcategory Pills Row */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-slate-50">
          {activeCategory.subCategories.map((sub, idx) => {
            const isSelected = selectedSubCat === sub || (idx === 1 && selectedSubCat === '小类名称');
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSubCat(sub);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#eef4ff] text-[#0070f3] border border-[#0070f3]/30 font-semibold'
                    : 'bg-[#f8fafc] text-slate-600 border border-slate-200/60 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Question List (1:1 with blue Q icon) */}
        <div className="flex-1 overflow-y-auto px-4 divide-y divide-slate-100/80">
          {paginatedQuestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-[13px] gap-2">
              <Search className="w-8 h-8 text-slate-300 stroke-[1.5]" />
              <span>未找到相关问题，请尝试其他关键词</span>
            </div>
          ) : (
            paginatedQuestions.map((qText, qIdx) => (
              <div
                key={qIdx}
                onClick={() => onSelectQuestion(qText.replace(/^\d+\.\s*/, ''))}
                className="flex items-center gap-3 py-3.5 hover:bg-blue-50/40 active:bg-blue-50/70 rounded-lg px-1.5 cursor-pointer transition-colors group"
              >
                {/* Blue Q Badge Icon */}
                <div className="w-5 h-5 rounded-full bg-[#0070f3] text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  Q
                </div>

                {/* Question Text */}
                <span className="text-[14px] text-slate-800 font-normal leading-tight group-hover:text-[#0070f3] transition-colors line-clamp-1">
                  {renderHighlightedText(qText, searchKeyword)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Bottom Pagination Bar (1:1 with Image 1 & 2) */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-center gap-2">
          {/* Previous Page Arrow */}
          <button
            disabled={currentPageSafe <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number 1 */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 rounded-lg text-[13px] font-medium flex items-center justify-center transition-all ${
              currentPageSafe === 1
                ? 'bg-[#eef4ff] text-[#0070f3] border border-[#0070f3]/40 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            1
          </button>

          {/* Page Number 2 */}
          {totalPages >= 2 && (
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-[13px] font-medium flex items-center justify-center transition-all ${
                currentPageSafe === 2
                  ? 'bg-[#eef4ff] text-[#0070f3] border border-[#0070f3]/40 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              2
            </button>
          )}

          {/* Page Number 3 */}
          {totalPages >= 3 && (
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-[13px] font-medium flex items-center justify-center transition-all ${
                currentPageSafe === 3
                  ? 'bg-[#eef4ff] text-[#0070f3] border border-[#0070f3]/40 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              3
            </button>
          )}

          {/* Page Number 4 */}
          {totalPages >= 4 && (
            <button
              onClick={() => setCurrentPage(4)}
              className={`w-7 h-7 rounded-lg text-[13px] font-medium flex items-center justify-center transition-all ${
                currentPageSafe === 4
                  ? 'bg-[#eef4ff] text-[#0070f3] border border-[#0070f3]/40 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              4
            </button>
          )}

          {/* Ellipsis if more than 4 pages */}
          {totalPages > 4 && (
            <span className="text-slate-400 text-xs px-0.5">...</span>
          )}

          {/* Next Page Arrow */}
          <button
            disabled={currentPageSafe >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
