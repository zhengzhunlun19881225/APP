import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  X,
  Send,
  Atom,
  Folder,
  Check,
  Search,
  ChevronRight,
  Eye,
  FileText,
  Copy,
  Download,
  RotateCcw,
  RotateCw,
  Sparkles,
  Scissors,
  Clipboard,
  Type,
  AlignLeft,
  AlignCenter,
  Plus,
  Edit3,
  Keyboard,
  Grid,
  FileEdit,
  CheckCircle2
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Types & Data                                                               */
/* -------------------------------------------------------------------------- */
export interface AttachedDocument {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc';
}

export interface WritingTemplateItem {
  id: string;
  name: string;
  iconBg: string;
  iconColor: string;
  defaultPrompt: string;
  placeholder: string;
}

export const WRITING_TEMPLATES: WritingTemplateItem[] = [
  {
    id: 'report-duty',
    name: '述职报告',
    iconBg: 'bg-blue-500',
    iconColor: 'text-white',
    defaultPrompt: '生成2024年度中层管理述职报告',
    placeholder: '请输入述职报告主题或要求'
  },
  {
    id: 'announcement',
    name: '通知公告',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    defaultPrompt: '起草关于2025年春节放假安排与值班通知',
    placeholder: '请输入通知公告主题或要求'
  },
  {
    id: 'proposal',
    name: '方案策划',
    iconBg: 'bg-cyan-500',
    iconColor: 'text-white',
    defaultPrompt: '帮我起草一份关于“深化数字化转型”的实施方案',
    placeholder: '请输入方案策划主题或要求'
  },
  {
    id: 'weekly',
    name: '周报总结',
    iconBg: 'bg-purple-500',
    iconColor: 'text-white',
    defaultPrompt: '生成本周研发与技术支持工作总结周报',
    placeholder: '请输入周报总结主题或要求'
  },
  {
    id: 'meeting-minutes',
    name: '会议纪要',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    defaultPrompt: '整理总经理办公会关于业务拓展与预算决议纪要',
    placeholder: '请输入会议纪要主题或要求'
  },
  {
    id: 'work-summary',
    name: '总结汇报',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    defaultPrompt: '生成安全生产与隐患排查工作总结汇报',
    placeholder: '请输入总结汇报主题或要求'
  }
];

export interface GeneratedArticle {
  id: string;
  title: string;
  createTime: string;
  introText?: string;
  followupText?: string;
  content: string;
  attachedDocs?: AttachedDocument[];
}

export const DEFAULT_WRITING_ARTICLE: GeneratedArticle = {
  id: 'doc-1',
  title: '数据监测与优化策略',
  createTime: '创建时间 13:32',
  introText: '我将数据监测和优化策略两大部分来编写文档，详细阐述各功能的操作方法，帮助用户快速掌握策略。',
  followupText: '这份操作手册涵盖了系统主要功能的要点。你若对某些功能的描述有更细致的或者想补充其他内容，欢迎随时告知。',
  content: `一、概念与价值

数据监测与优化策略是指在业务全链路中，通过实时采集、清洗、分析与反馈数据，持续迭代产品、运营与技术方案，以提升关键指标（KPI）的系统化方法。它将原本事后复盘的经验管理，转变为前瞻式、闭环式、量化的科学管理，帮助企业降低试错成本、放大增长杠杆。

二、指标体系设计

a. 北极星指标：唯一且最能代表长期价值的指标，如SaaS企业的“月活跃付费账户数”。

b. OSM模型：Objective（业务目标）➔Signal（用户行为信号）➔Metric（可量化指标），确保每个指标都能向上溯源到商业目标。

c. 分层拆解：战略层➔战术层➔执行层，逐层细化，既防止“只见树木不见森林”，又避免“空洞口号”。

d. 指标分级：核心指标、辅助指标、观察指标，分别对应决策、分析与预警场景。

三、数据采集与治理

a. 埋点体系：采用“who-when-where-what-how”五维模型，统一事件命名规范。

b. 质量治理：建立数据血缘链路与异常波动监控机制，保障数据准确性与及时性。`
};

/* -------------------------------------------------------------------------- */
/* 1. 写作模版 Drawer (Image 2)                                               */
/* -------------------------------------------------------------------------- */
interface WritingTemplateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isThinking: boolean;
  onToggleThinking: () => void;
  onOpenKnowledgeBase: () => void;
  onSelectAndSend: (template: WritingTemplateItem, customText: string) => void;
}

export const WritingTemplateDrawer: React.FC<WritingTemplateDrawerProps> = ({
  isOpen,
  onClose,
  isThinking,
  onToggleThinking,
  onOpenKnowledgeBase,
  onSelectAndSend
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<WritingTemplateItem>(WRITING_TEMPLATES[2]); // Default 方案策划
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    const query = inputText.trim() || selectedTemplate.defaultPrompt;
    onSelectAndSend(selectedTemplate, query);
    setInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div
        className="bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border-t border-slate-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">写作模版</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Template Badges Grid */}
        <div className="p-4 grid grid-cols-2 gap-2.5">
          {WRITING_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all active:scale-98 border ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-blue-600 shadow-2xs font-semibold'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg ${tmpl.iconBg} ${tmpl.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                    <line x1="16" y1="8" x2="2" y2="22" />
                    <line x1="17.5" y1="15" x2="9" y2="15" />
                  </svg>
                </div>
                <span className="text-[13px] tracking-tight">{tmpl.name}</span>
              </button>
            );
          })}
        </div>

        {/* Input prompt line */}
        <div className="px-4 pb-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={selectedTemplate.placeholder}
            className="w-full bg-transparent text-[13px] text-blue-500 placeholder-blue-400/80 focus:outline-none py-1"
          />
        </div>

        {/* Bottom Actions Row inside Template popup (Image 2) */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Grid icon */}
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-white border border-slate-200/90 text-slate-600 flex items-center justify-center hover:bg-slate-50 active:scale-95 shadow-2xs"
            >
              <Grid className="w-4 h-4 text-slate-700" />
            </button>

            {/* 深度思考 */}
            <button
              type="button"
              onClick={onToggleThinking}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border ${
                isThinking
                  ? 'bg-white border-blue-200 text-[#465467] shadow-2xs'
                  : 'bg-white/80 border-slate-200/80 text-[#465467]'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-[#465467] stroke-[2.2]" />
              <span>深度思考</span>
              {isThinking && <Check className="w-3 h-3 text-[#465467] stroke-[3]" />}
            </button>

            {/* 知识库 */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenKnowledgeBase();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] text-[12px] font-medium hover:bg-slate-50 active:scale-95 shadow-2xs"
            >
              <Folder className="w-3.5 h-3.5 text-[#465467]" />
              <span>知识库</span>
              <ChevronRight className="w-3 h-3 text-[#465467] rotate-90" />
            </button>
          </div>

          {/* Blue Send Paper Plane Button */}
          <button
            type="button"
            onClick={handleSend}
            className="w-8 h-8 rounded-full bg-[#0070f3] text-white flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all shadow-xs flex-shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. 知识库 Selector View (Image 3, 4, 5)                                    */
/* -------------------------------------------------------------------------- */
interface KnowledgeBaseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedDocs: AttachedDocument[]) => void;
}

const mockKnowledgeBases = [
  {
    id: 'kb-1',
    name: '知识库名称',
    desc: '知识库描述描述描述描述描述描述描述描述...',
    docs: [
      { id: 'f-1', name: '数据监测与优化策略.PDF', size: '154.12KB', type: 'pdf' as const },
      { id: 'f-2', name: '企业数字化转型实施纲要.pdf', size: '12.2MB', type: 'pdf' as const },
      { id: 'f-3', name: '新业务线市场开拓立项方案.pdf', size: '12.4MB', type: 'pdf' as const },
      { id: 'f-4', name: '安全生产与隐患治理规范.pdf', size: '22.2MB', type: 'pdf' as const },
      { id: 'f-5', name: '2025年度工作总结与规划汇报.pdf', size: '12.4MB', type: 'pdf' as const }
    ]
  },
  {
    id: 'kb-2',
    name: '组织规章与制度知识库',
    desc: '集团组织架构、行政公文与会务规章制度汇总',
    docs: [
      { id: 'f-6', name: '集团公文格式规范及模板指引.pdf', size: '14.2MB', type: 'pdf' as const },
      { id: 'f-7', name: '总经理办公会决议与执行规程.pdf', size: '8.6MB', type: 'pdf' as const }
    ]
  },
  {
    id: 'kb-3',
    name: '财务与差旅管理规定',
    desc: '预算编制、报销标准与资金集中调度细则',
    docs: [
      { id: 'f-8', name: '差旅及业务支出管理办法(2025版).pdf', size: '18.1MB', type: 'pdf' as const }
    ]
  },
  {
    id: 'kb-4',
    name: '人力资源与绩效考核',
    desc: '员工招聘、职级评定与带薪年休假条例',
    docs: [
      { id: 'f-9', name: '考勤工时与休假管理规范.pdf', size: '9.4MB', type: 'pdf' as const }
    ]
  }
];

export const WritingKnowledgeBaseSelector: React.FC<KnowledgeBaseSelectorProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [activeTab, setActiveTab] = useState<'common' | 'org' | 'team' | 'personal'>('org');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentKb, setCurrentKb] = useState<typeof mockKnowledgeBases[0] | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<Record<string, boolean>>({
    'f-1': true,
    'f-2': true,
    'f-3': true
  });
  const [previewDoc, setPreviewDoc] = useState<AttachedDocument | null>(null);

  if (!isOpen) return null;

  const currentDocs = currentKb ? currentKb.docs : mockKnowledgeBases[0].docs;
  const filteredDocs = currentDocs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = Object.values(selectedDocIds).filter(Boolean).length;
  const isAllSelected = filteredDocs.length > 0 && filteredDocs.every((d) => selectedDocIds[d.id]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const next = { ...selectedDocIds };
      filteredDocs.forEach((d) => {
        delete next[d.id];
      });
      setSelectedDocIds(next);
    } else {
      const next = { ...selectedDocIds };
      filteredDocs.forEach((d) => {
        next[d.id] = true;
      });
      setSelectedDocIds(next);
    }
  };

  const handleConfirm = () => {
    const allDocs = mockKnowledgeBases.flatMap((k) => k.docs);
    const selected = allDocs.filter((d) => selectedDocIds[d.id]);
    onConfirm(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in select-none">
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20">
        <button
          type="button"
          onClick={() => {
            if (currentKb) {
              setCurrentKb(null);
            } else {
              onClose();
            }
          }}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-[17px] font-bold text-slate-800">
          {currentKb ? currentKb.name : '知识库'}
        </h2>

        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="p-1 text-slate-600 hover:text-slate-900"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Row (Image 3 & 4) */}
      {!currentKb && (
        <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-[13px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('common')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'common' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            通用
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('org')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'org' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            组织
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'team' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            团队
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'personal' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            个人
          </button>
        </div>
      )}

      {/* Search Input Box */}
      <div className="p-3 bg-white border-b border-slate-100">
        <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2 border border-slate-200/80 focus-within:border-blue-400">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索"
            className="w-full bg-transparent text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')}>
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb row if deep inside (Image 4) */}
      <div className="px-4 py-2 bg-slate-50/50 text-[12px] text-blue-600 flex items-center gap-1 font-medium border-b border-slate-100">
        <span className="cursor-pointer hover:underline" onClick={() => setCurrentKb(null)}>集团</span>
        <span className="text-slate-400">&gt;</span>
        <span className="cursor-pointer hover:underline" onClick={() => setCurrentKb(null)}>研发部</span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-600">{currentKb ? currentKb.name : '知识库'}</span>
      </div>

      {/* Main Content List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {!currentKb ? (
          /* Level 1: Knowledge Bases List (Image 3 & 4) */
          <div>
            {mockKnowledgeBases.map((kb) => (
              <div
                key={kb.id}
                onClick={() => setCurrentKb(kb)}
                className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-slate-800 truncate">{kb.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{kb.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          /* Level 2: Inside KB with Checkboxes (Image 5) */
          <div>
            {filteredDocs.map((doc) => {
              const isChecked = !!selectedDocIds[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocIds((prev) => ({
                      ...prev,
                      [doc.id]: !prev[doc.id]
                    }));
                  }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#0070f3] text-white border border-[#0070f3]'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Red PDF icon */}
                    <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs font-bold text-[11px]">
                      PDF
                    </div>

                    {/* File details */}
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-semibold text-slate-800 truncate">{doc.name}</h4>
                      <p className="text-[11px] text-slate-400">{doc.size}</p>
                    </div>
                  </div>

                  {/* Eye preview icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDoc(doc);
                    }}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                    title="预览文档"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar (Image 5) */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between z-20 shadow-lg">
        <label
          onClick={toggleSelectAll}
          className="flex items-center gap-2 text-[13px] font-medium text-slate-700 cursor-pointer select-none"
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
              isAllSelected
                ? 'bg-[#0070f3] text-white border border-[#0070f3]'
                : 'border border-slate-300 bg-white'
            }`}
          >
            {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>全选</span>
        </label>

        <button
          type="button"
          onClick={handleConfirm}
          className="px-6 py-2 rounded-xl bg-[#0070f3] text-white text-[14px] font-semibold hover:bg-blue-600 active:scale-95 transition-all shadow-xs"
        >
          确定{selectedCount > 0 ? selectedCount : ''}
        </button>
      </div>

      {/* Doc Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
                  PDF
                </div>
                <h3 className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{previewDoc.name}</h3>
              </div>
              <button type="button" onClick={() => setPreviewDoc(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
              【文件摘要】本文件为《{previewDoc.name}》，包含数字化转型战略路径规划、关键KPI监测矩阵以及组织协同细则。文件大小 {previewDoc.size}，已通过合规校验。
            </div>
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2 rounded-xl bg-[#0070f3] text-white text-xs font-semibold"
            >
              关闭预览
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Document Reader & Editor Modal (Image 7 & Image 8)                       */
/* -------------------------------------------------------------------------- */
interface DocumentReaderAndEditorProps {
  isOpen: boolean;
  onClose: () => void;
  article: GeneratedArticle;
  onSaveArticle: (updated: GeneratedArticle) => void;
}

export const DocumentReaderAndEditorModal: React.FC<DocumentReaderAndEditorProps> = ({
  isOpen,
  onClose,
  article,
  onSaveArticle
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [history, setHistory] = useState<string[]>([article.content]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Floating Context Menu Tooltip (Image 8)
  const [showFloatingMenu, setShowFloatingMenu] = useState(true);
  const [toastText, setToastText] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (txt: string) => {
    setToastText(txt);
    setTimeout(() => setToastText(null), 1800);
  };

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(newContent);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setContent(history[historyIdx - 1]);
      showToast('已撤回');
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setContent(history[historyIdx + 1]);
      showToast('已重做');
    }
  };

  const handleAiContinueWriting = () => {
    const continuation = `\n\n四、长效运营与成果固化\n\n1. 闭环反馈：每周召开数据复盘周会，针对转化漏斗流失环节实施 A/B 敏捷实验；\n2. 激励机制：建立数字化创新成果专项激励基金，推动全员用数赋能业务。`;
    const nextContent = content + continuation;
    handleUpdateContent(nextContent);
    showToast('✨ AI智能续写已自动插入新章节');
  };

  const handleDone = () => {
    onSaveArticle({
      ...article,
      title,
      content
    });
    setMode('view');
    showToast('已保存文档修改');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in select-none">
      {/* Toast */}
      {toastText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[12px] px-3.5 py-1.5 rounded-full shadow-lg z-50 animate-fade-in">
          {toastText}
        </div>
      )}

      {/* Mode 1: View Header (Image 7) */}
      {mode === 'view' ? (
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20">
          <button
            type="button"
            onClick={onClose}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-8" />
          <button
            type="button"
            onClick={() => showToast('已下载文章至本地')}
            className="p-1.5 text-slate-700 hover:text-blue-600 active:scale-95"
            title="下载"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Mode 2: Edit Header (Image 8) */
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20">
          <button
            type="button"
            onClick={() => {
              // Cancel edits
              setTitle(article.title);
              setContent(article.content);
              setMode('view');
            }}
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 active:scale-95"
          >
            取消
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIdx === 0}
              className={`p-1.5 transition-colors ${
                historyIdx > 0 ? 'text-slate-700 hover:text-blue-600' : 'text-slate-300 cursor-not-allowed'
              }`}
              title="撤销"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIdx >= history.length - 1}
              className={`p-1.5 transition-colors ${
                historyIdx < history.length - 1 ? 'text-slate-700 hover:text-blue-600' : 'text-slate-300 cursor-not-allowed'
              }`}
              title="重做"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="text-[15px] font-bold text-[#0070f3] hover:text-blue-700 active:scale-95"
          >
            完成
          </button>
        </div>
      )}

      {/* Document Body Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Title & Creation Time */}
        <div className="space-y-1">
          {mode === 'view' ? (
            <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">{title}</h1>
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[18px] font-bold text-slate-900 tracking-tight w-full bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-blue-500 py-1"
            />
          )}
          <p className="text-[12px] text-slate-400">{article.createTime}</p>
        </div>

        {/* Floating Context Menu Tooltip in Edit Mode (Image 8) */}
        {mode === 'edit' && showFloatingMenu && (
          <div className="relative my-2">
            <div className="bg-white border-2 border-fuchsia-400/80 rounded-2xl px-3 py-2 shadow-lg flex items-center justify-around gap-2 text-[12px] font-medium text-slate-700 animate-scale-up">
              <button
                type="button"
                onClick={handleAiContinueWriting}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">智能续写</span>
              </button>
              <span className="w-px h-3.5 bg-slate-200" />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  showToast('已复制全文');
                }}
                className="flex items-center gap-1 hover:text-blue-600 active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>复制</span>
              </button>
              <span className="w-px h-3.5 bg-slate-200" />
              <button
                type="button"
                onClick={() => showToast('已从剪贴板粘贴内容')}
                className="flex items-center gap-1 hover:text-blue-600 active:scale-95"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                <span>粘贴</span>
              </button>
              <span className="w-px h-3.5 bg-slate-200" />
              <button
                type="button"
                onClick={() => {
                  showToast('已剪切所选内容');
                }}
                className="flex items-center gap-1 hover:text-rose-600 active:scale-95"
              >
                <Scissors className="w-3.5 h-3.5 text-slate-500" />
                <span>剪切</span>
              </button>
            </div>
          </div>
        )}

        {/* Text Content */}
        {mode === 'view' ? (
          <div className="text-[14px] leading-relaxed text-slate-800 space-y-4 whitespace-pre-wrap select-text font-normal font-sans">
            {content}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleUpdateContent(e.target.value)}
            rows={16}
            className="w-full bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 text-[14px] leading-relaxed text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none font-sans"
            placeholder="在此编辑文档内容..."
          />
        )}
      </div>

      {/* Bottom Sticky Bar: View Mode (Image 7) */}
      {mode === 'view' && (
        <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center gap-3 z-20">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[14px] font-semibold hover:bg-slate-50 active:scale-98 transition-all shadow-2xs"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(`【${title}】\n\n${content}`);
              showToast('全文已复制到剪贴板');
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#0070f3] text-white text-[14px] font-semibold hover:bg-blue-600 active:scale-98 transition-all shadow-xs"
          >
            复制
          </button>
        </div>
      )}

      {/* Bottom Sticky Bar: Edit Mode Rich Toolbar (Image 8) */}
      {mode === 'edit' && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between text-slate-600 z-20">
          <button
            type="button"
            onClick={handleAiContinueWriting}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg active:scale-95"
            title="智能续写"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => showToast('排版字号调整')}
            className="p-2 hover:text-blue-600 hover:bg-slate-50 rounded-lg active:scale-95"
            title="字号排版"
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => showToast('对齐方式切换')}
            className="p-2 hover:text-blue-600 hover:bg-slate-50 rounded-lg active:scale-95"
            title="文本对齐"
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              handleUpdateContent(content + '\n\n【新增段落】：\n请输入补充内容...');
              showToast('已插入新段落');
            }}
            className="p-2 hover:text-blue-600 hover:bg-slate-50 rounded-lg active:scale-95"
            title="插入模块"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => showToast('文本样式切换')}
            className="p-2 hover:text-blue-600 hover:bg-slate-50 rounded-lg active:scale-95"
            title="文本样式"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            className="p-2 hover:text-blue-600 hover:bg-slate-50 rounded-lg active:scale-95"
            title="切换工具栏"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
