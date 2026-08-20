import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, CheckCircle2, ChevronRight, Sparkles, Layers, ListChecks, FileSpreadsheet, ShieldAlert, GitCompare } from 'lucide-react';

export interface SummaryTypeItem {
  id: string;
  name: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  defaultPrompt: string;
}

export const SUMMARY_TYPES: SummaryTypeItem[] = [
  {
    id: 'sum-1',
    name: '会议纪要与行动清单',
    desc: '提炼核心议题、关键决议及待办责任清单（Action Items）',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    icon: <ListChecks className="w-4 h-4 text-white" />,
    defaultPrompt: '快速提炼2025年度全员战略研讨会议纪要与行动清单'
  },
  {
    id: 'sum-2',
    name: '1页高管决策摘要',
    desc: '将长篇报告、可行性方案精简为1页高管决策简报',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    icon: <FileSpreadsheet className="w-4 h-4 text-white" />,
    defaultPrompt: '将这份40页的可行性研究报告精简为1页高管决策摘要'
  },
  {
    id: 'sum-3',
    name: '核心要点与数据速览',
    desc: '高密提取文档中的关键数据指标、核心论点与结论',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    icon: <Sparkles className="w-4 h-4 text-white" />,
    defaultPrompt: '提取该财务审计与经营报告的核心数据与风险要点'
  },
  {
    id: 'sum-4',
    name: '政策法规条款速读',
    desc: '结构化梳理行业监管政策要点、合规红线与落地要求',
    iconBg: 'bg-indigo-500',
    iconColor: 'text-white',
    icon: <ShieldAlert className="w-4 h-4 text-white" />,
    defaultPrompt: '请帮我解读最新监管合规政策并提炼落地执行要点'
  },
  {
    id: 'sum-5',
    name: '项目进展周报/月报',
    desc: '汇总多部门进度、里程碑达成情况及堵点问题',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    icon: <Layers className="w-4 h-4 text-white" />,
    defaultPrompt: '整理本周各项目组研发进展与下一阶段里程碑计划'
  },
  {
    id: 'sum-6',
    name: '结构化对比备忘录',
    desc: '横向对比多个供应商、方案或竞品的核心差异与建议',
    iconBg: 'bg-rose-500',
    iconColor: 'text-white',
    icon: <GitCompare className="w-4 h-4 text-white" />,
    defaultPrompt: '对比两套供应商采购方案并输出优劣势决策备忘录'
  }
];

interface SummaryTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: SummaryTypeItem) => void;
}

export const SummaryTypeDrawer: React.FC<SummaryTypeDrawerProps> = ({
  isOpen,
  onClose,
  onSelectType
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Bottom Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
            {/* Header */}
            <div className="p-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">选择摘要类型</h3>
                  <p className="text-xs text-slate-400">选择适合当前场景的结构化摘要提取模式</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Summary Types */}
            <div className="p-4 space-y-2.5 overflow-y-auto flex-1 max-h-[60vh]">
              {SUMMARY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onSelectType(type)}
                  className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-left flex items-start gap-3.5 group active:scale-[0.99]"
                >
                  <div className={`w-10 h-10 rounded-xl ${type.iconBg} ${type.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {type.name}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {type.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Safe Area */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-400">点击任意摘要类型即可快速发起智能提炼</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
