import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JingXiaobeiPage } from './JingXiaobeiPage';
import { AiAgentAvatar } from './AiAgentAvatar';
import { SkillTreePage } from './SkillTreePage';
import { ScheduleShareManagement } from './ScheduleShareManagement';
import { QaAgentChatView } from './QaAgentChatView';
import { VoiceListeningModal } from './VoiceListeningModal';
import {
  WritingTemplateDrawer,
  WritingKnowledgeBaseSelector,
  DocumentReaderAndEditorModal,
  AttachedDocument,
  GeneratedArticle,
  DEFAULT_WRITING_ARTICLE,
  WritingTemplateItem
} from './WritingAgentComponents';
import {
  FinancialTemplatesDrawer,
  FinancialTemplateItem,
  TravelApplicationCard,
  TravelApplicationData,
  TravelTransportCard,
  TravelHotelRecommendCard,
  HotelListCard,
  HotelItem,
  MOCK_HOTELS_DATA,
  UnreimbursedInvoicesCard,
  UnreimbursedItem,
  MOCK_UNREIMBURSED_ITEMS,
  TravelApplicationConfirmModal
} from './TravelAgentComponents';
import {
  TravelRecordsPage,
  TravelRecordItem,
  INITIAL_TRAVEL_RECORDS
} from './TravelRecordsPage';
import {
  LeaveApplicationCard,
  LeaveApplicationData,
  LeaveApplicationModal,
  OvertimeApplicationCard,
  OvertimeApplicationData,
  OvertimeApplicationModal
} from './EmployeeServiceComponents';
import {
  SummaryTypeDrawer,
  SummaryTypeItem
} from './SummaryTypeDrawer';
import {
  Bell,
  Clock,
  Calendar,
  Cloud,
  FolderKanban,
  Bot,
  Feather,
  RefreshCw,
  FileText,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  PlusCircle,
  Atom,
  Folder,
  FileCode,
  Paperclip,
  Mic,
  X,
  Send,
  ChevronDown,
  Check,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  Users,
  Award,
  Volume2,
  VolumeX,
  Copy,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  BarChart2,
  PieChart,
  LineChart,
  Table,
  Maximize2,
  Grid,
  Camera,
  MessageSquare,
  Plus,
  Receipt,
  AlertCircle,
  HelpCircle,
  Globe,
  Bookmark,
  ExternalLink,
  FileEdit,
  ChevronUp,
  ChevronRight
} from 'lucide-react';

interface AgentItem {
  id: string;
  name: string;
  category: 'qa' | 'writing' | 'travel' | 'summary' | 'data' | 'legal' | 'employee_service';
  iconBg: string;
  icon: React.ReactNode;
  description: string;
  heat: string;
  tag: string;
}

const mockAgents: AgentItem[] = [
  {
    id: 'a0',
    name: '智能问数',
    category: 'data',
    iconBg: 'bg-amber-500',
    icon: <BarChart3 className="w-5 h-5 text-white stroke-[2]" />,
    description: '咨询业务数据与报表，定位关键指标与一键可视化分析...',
    heat: '3.2万+',
    tag: '@广新集团'
  },
  {
    id: 'a1',
    name: '智能问答',
    category: 'qa',
    iconBg: 'bg-blue-500',
    icon: <Bot className="w-5 h-5 text-white stroke-[2]" />,
    description: '一站式为您解答集团通用政策、人力、财务、法务等专业问题及日常疑问。',
    heat: '2.8万+',
    tag: '@广新集团'
  },
  {
    id: 'a2',
    name: '智能写作',
    category: 'writing',
    iconBg: 'bg-purple-500',
    icon: <Feather className="w-5 h-5 text-white stroke-[2]" />,
    description: '快速生成高质量公文、新闻稿、总结汇报等文案方案',
    heat: '2.5万+',
    tag: '@广新集团'
  },
  {
    id: 'a3',
    name: 'AI+财务自动差旅',
    category: 'travel',
    iconBg: 'bg-sky-500',
    icon: <RefreshCw className="w-5 h-5 text-white stroke-[2]" />,
    description: '智能预订机票、自动比价与报销凭证全流程合规校验',
    heat: '2.1万+',
    tag: '@广新集团'
  },
  {
    id: 'a4',
    name: '智能摘要',
    category: 'summary',
    iconBg: 'bg-emerald-500',
    icon: <FileText className="w-5 h-5 text-white stroke-[2]" />,
    description: '长文档一键提炼核心要点，快速生成会议纪要与简报',
    heat: '2万+',
    tag: '@广新集团'
  },
  {
    id: 'a_emp',
    name: 'AI+员工服务',
    category: 'employee_service',
    iconBg: 'bg-amber-500',
    icon: <Users className="w-5 h-5 text-white stroke-[2]" />,
    description: '为您提供自动服务如：请休假、加班申请、员工手册、收入证明等，助您高效工作。',
    heat: '2.6万+',
    tag: '@广新集团'
  },
  {
    id: 'a6',
    name: '法智小新',
    category: 'legal',
    iconBg: 'bg-teal-500',
    icon: <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />,
    description: '合同智能审核、法律条款风险排查与合规问答',
    heat: '1.9万+',
    tag: '@广新集团'
  }
];

const quickTemplates = [
  '新闻稿',
  '通知公告',
  '总结汇报',
  '述职报告',
  '方案策划',
  '工作请示'
];

const dataQuickQueries = [
  '查询2025年集团总部的人均薪酬',
  '查询2025年集团总部的工资总额',
  '查询今年集团所有的报销单据',
  '查询2024年集团差旅费报销单据'
];

interface AiPlusPageProps {
  onSubViewChange?: (isSubView: boolean) => void;
}

export const AiPlusPage: React.FC<AiPlusPageProps> = ({ onSubViewChange }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);
  const [showJingXiaobei, setShowJingXiaobei] = useState<boolean>(false);
  const [initialQuestion, setInitialQuestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'frequent' | 'hot' | 'default'>('all');

  useEffect(() => {
    onSubViewChange?.(showJingXiaobei || !!selectedAgent);
  }, [showJingXiaobei, selectedAgent, onSubViewChange]);

  const handleSelectAgentByName = (agentName: string, question?: string) => {
    setShowJingXiaobei(false);
    const found = mockAgents.find((a) => a.name === agentName || a.name.includes(agentName) || agentName.includes(a.name)) || mockAgents[0];
    setSelectedAgent(found);
    if (question) {
      setInitialQuestion(question);
    } else {
      setInitialQuestion(null);
    }
  };

  if (showJingXiaobei) {
    return (
      <JingXiaobeiPage
        onBack={() => setShowJingXiaobei(false)}
        onSelectAgent={(agentName, question) => {
          handleSelectAgentByName(agentName, question);
        }}
        onOpenAgentHub={() => {
          setShowJingXiaobei(false);
          setSelectedAgent(null);
        }}
      />
    );
  }

  if (selectedAgent) {
    return (
      <DataAgentChatView
        agent={selectedAgent}
        initialQuestion={initialQuestion}
        onBack={() => {
          setSelectedAgent(null);
          setInitialQuestion(null);
        }}
        onSwitchAgent={(newAg) => {
          setSelectedAgent(newAg);
          setInitialQuestion(null);
        }}
      />
    );
  }

  // Primary Agent Hub View ("智能体群")
  return (
    <div
      className="flex flex-col h-full bg-cover bg-top bg-no-repeat relative overflow-hidden select-none"
      style={{
        backgroundImage: `url('/agent-bg.svg'), linear-gradient(180deg, #edf4fe 0%, #f6f8fd 40%, #ffffff 100%)`
      }}
    >
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs z-20">
        <div className="w-8" />
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">智能体群</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('暂无新通知')}
            className="relative text-slate-700 hover:text-slate-900 active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          <button
            onClick={() => alert('历史创作记录空')}
            className="text-slate-700 hover:text-slate-900 active:scale-95 transition-transform"
          >
            <Clock className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">
        {/* Banner Card: 创作助手 (Dark Forest Emerald Gradient) */}
        <div className="bg-gradient-to-r from-[#0d2a1f] via-[#12382a] to-[#1a4a38] rounded-[22px] p-4 text-white shadow-md relative overflow-hidden space-y-3">
          {/* Decorative Background Glowing Circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Title & Mascot */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-extrabold tracking-tight text-emerald-300">
                创作助手
              </h2>
              <p className="text-[12px] text-emerald-100/70 mt-0.5 font-normal">
                有什么创作难题，尽管告诉我
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center border border-emerald-400/30 text-emerald-300 shadow-inner">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          {/* Sub Action Blocks Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => setShowJingXiaobei(true)}
              className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-left active:scale-98 transition-all"
            >
              <div>
                <p className="text-[13px] font-bold text-white">智能体集</p>
                <p className="text-[10px] text-emerald-100/70">专业AI助理，专属问答</p>
              </div>
              <Bot className="w-6 h-6 text-emerald-300 stroke-[1.8] flex-shrink-0 ml-1" />
            </button>

            <button
              onClick={() => setSelectedAgent(mockAgents[0])}
              className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-left active:scale-98 transition-all"
            >
              <div>
                <p className="text-[13px] font-bold text-white">创作管理</p>
                <p className="text-[10px] text-emerald-100/70">一键查看、编辑</p>
              </div>
              <FolderKanban className="w-6 h-6 text-emerald-300 stroke-[1.8] flex-shrink-0 ml-1" />
            </button>
          </div>
        </div>

        {/* Agents Listing Section */}
        <div className="bg-white rounded-[22px] p-4 shadow-2xs border border-slate-100 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-1">
            {[
              { id: 'all', label: '全部' },
              { id: 'created', label: '自己创建' },
              { id: 'frequent', label: '常用' },
              { id: 'hot', label: '热门' },
              { id: 'default', label: '默认' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-[14px] font-bold relative pb-1 transition-colors ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Agents List Items */}
          <div className="divide-y divide-slate-50">
            {mockAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="py-3.5 flex items-center gap-3.5 group cursor-pointer active:scale-[0.99] transition-all"
              >
                {/* Agent Icon */}
                <div
                  className={`w-11 h-11 rounded-2xl ${agent.iconBg} flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {agent.icon}
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="text-[15px] font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-[12px] text-slate-400 font-normal truncate">
                    {agent.description}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                      🔥 {agent.heat}
                    </span>
                    <span>·</span>
                    <span>{agent.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 智能问数 / 智能数据 / 智能问答 视图组件 (DataAgentChatView)                */
/* -------------------------------------------------------------------------- */
interface DataAgentChatViewProps {
  agent: AgentItem;
  onBack: () => void;
  initialQuestion?: string | null;
  onSwitchAgent?: (agent: AgentItem) => void;
}

export interface KnowledgeCitation {
  id: string;
  name: string;
  type: 'doc' | 'docx' | 'pdf';
  size?: string;
  date?: string;
  sourceChapter?: string;
  matchScore?: string;
  excerpt: string;
  contextSnippet?: string;
}

interface DataMessage {
  id: string;
  sender: 'user' | 'ai';
  type?:
    | 'text'
    | 'chart_report'
    | 'report_analysis'
    | 'writing_article'
    | 'travel_application'
    | 'travel_transport'
    | 'travel_hotel_recommend'
    | 'travel_hotel_list'
    | 'travel_unreimbursed'
    | 'leave_application'
    | 'overtime_application';
  text?: string;
  title?: string;
  chartData?: any;
  sections?: Array<{ title: string; content: string | string[] }>;
  citations?: KnowledgeCitation[];
  article?: GeneratedArticle;
  attachedDocs?: AttachedDocument[];
  travelApp?: TravelApplicationData;
  leaveApp?: LeaveApplicationData;
  overtimeApp?: OvertimeApplicationData;
  transportData?: {
    date: string;
    from: string;
    to: string;
    preference: string;
  };
  hotelRecommendData?: {
    destination: string;
    checkIn: string;
    checkOut: string;
    durationText: string;
    roomText: string;
    preference: string;
  };
  hotelListData?: {
    locationTitle: string;
    dateRangeText: string;
    hotels?: HotelItem[];
  };
  unreimbursedData?: {
    items?: UnreimbursedItem[];
  };
  quickChips?: string[];
}

interface DataPromptCard {
  id: string;
  question: string;
  responseTitle: string;
  responseText: string;
  chartType?: 'bar' | 'line' | 'horizontal' | 'pie' | 'table';
  sections?: Array<{ title: string; content: string | string[] }>;
  citations?: KnowledgeCitation[];
}

const agentPromptConfigs: Record<string, {
  subtitle: string;
  cards: DataPromptCard[];
}> = {
  '智能问数': {
    subtitle: '您可以向我咨询各类业务数据与报表信息',
    cards: [
      {
        id: 'data-card-1',
        question: '2024财务收入报表',
        responseTitle: '2024财务收入报表',
        responseText: '根据财政部公开数据，2024年全国一般公共预算收入约XXX万元，同比增长6.8%，其中税收收入占比约 85%，非税收入占比约15%。具体分类如下：',
        chartType: 'bar',
        citations: [
          {
            id: 'kb-data-1-1',
            name: '《2024年度全国一般公共预算执行与收支决算表》.doc',
            type: 'doc',
            size: '580KB',
            date: '2025-01-20',
            sourceChapter: '第一部分 财政收入总体规模与结构分布',
            matchScore: '98.5%',
            excerpt: '2024年全国一般公共预算收入保持平稳增长，增幅为6.8%；其中税收收入占一般公共预算收入比重约为85.0%，非税收入占比约为15.0%，财政收支运行总体稳健。',
            contextSnippet: '【第一部分 财政收入总体规模与结构分布】\n一、一般公共预算收入保持平稳增长，增幅为6.8%。\n二、税收收入占一般公共预算收入比重约为85.0%，非税收入占比约为15.0%。\n三、各项专项转移支付与增值税留抵退税机制规范运行。'
          },
          {
            id: 'kb-data-1-2',
            name: '《集团财务中台2024年度收支多维核算明细表》.pdf',
            type: 'pdf',
            size: '1.8MB',
            date: '2025-01-15',
            sourceChapter: '第三章 业务板块税费与非税贡献拆解 第九条',
            matchScore: '96.2%',
            excerpt: '集团合并财务报表口径下，制造业与供应链两大主力板块贡献税收收入占比超七成，非税收益主要来源于资产盘活与利息收益。',
            contextSnippet: '【第三章 业务板块税费与非税贡献拆解】\n第八条 各分子公司按季上报税收筹划与返还数据。\n第九条 制造业与供应链板块为核心支撑，资产经营与投资收益形成有力补充。'
          }
        ]
      },
      {
        id: 'data-card-2',
        question: '查询2025年集团总部的人均薪酬与工资总额？',
        responseTitle: '2025年集团总部薪酬统计看板',
        responseText: '根据集团人力与财务数据中台核算：\n\n💰 **2025年度预算总览**：\n- **年度工资总额预算**：¥1.82 亿元（同比增幅控制在 +3.5% 内）\n- **人均年薪中位数**：¥28.6 万元/年\n- **绩效浮动薪酬占比**：42.5%\n- **福利及津补贴总额**：¥2,430 万元\n\n各部门薪酬与人效分布明细已同步生成结构表。',
        sections: [
          {
            title: '一、薪酬支出结构',
            content: [
              '研发与技术序列：占比 45.2%，平均薪酬高于行业 75 分位；',
              '营销与业务序列：占比 32.8%，高提成高弹性激励机制；',
              '运营与职能序列：占比 22.0%，保持稳健基本薪酬结构。'
            ]
          },
          {
            title: '二、人工成本利润率与人效指标',
            content: '人均创收达 ¥215 万元/年，人均创利 ¥38.2 万元/年，人效指标较去年同期提升 +8.4%。'
          }
        ],
        citations: [
          {
            id: 'kb-data-2-1',
            name: '《广新集团2025年度人力成本与工资总额预算方案》.doc',
            type: 'doc',
            size: '430KB',
            date: '2024-12-28',
            sourceChapter: '第二章 工资总额与人均薪酬中位数指标',
            matchScore: '98.8%',
            excerpt: '2025年度集团总部工资总额预算核定为 ¥1.82 亿元，同比增幅控制在 +3.5% 警戒线内；总部人均年薪中位数测算为 ¥28.6 万元/年，绩效浮动薪酬占比达 42.5%。',
            contextSnippet: '【第二章 工资总额与人均薪酬中位数指标】\n第一条 严格落实工效挂钩联动机制。\n第二条 工资总额核定 ¥1.82 亿元，重点向核心关键技术与高价值业务序列倾斜。'
          },
          {
            id: 'kb-data-2-2',
            name: '《集团各序列人效创收与人工成本利润率评估报告》.pdf',
            type: 'pdf',
            size: '2.4MB',
            date: '2025-01-05',
            sourceChapter: '第四节 组织人效与创利分析',
            matchScore: '95.4%',
            excerpt: '人均创收达 ¥215 万元/年，人均创利达 ¥38.2 万元/年，人效指标同比提升 +8.4%，研发序列薪酬竞争力位列行业前 25% 水平。',
            contextSnippet: '【第四节 组织人效与创利分析】\n人效指标持续提升，全员劳动生产率稳步攀升，为高质量发展提供有力组织保障。'
          }
        ]
      },
      {
        id: 'data-card-3',
        question: '对比分析今年华东与华南大区销售业绩与转化率？',
        responseTitle: '华东 vs 华南 销售业绩与转化看板',
        responseText: '智小星已为您完成跨区域多维指标检索与对比：\n\n📊 **华东 vs 华南业绩对比**：\n- **华东大区**：总销售额 ¥1,640万，环比增长 +28.1%，线索转化率 18.6%\n- **华南大区**：总销售额 ¥1,420万，环比增长 +19.4%，线索转化率 16.2%\n- **客单价**：华东 (¥2.9万) vs 华南 (¥2.6万)\n\n💡 **主要结论**：华东大区得益于“企业AI套餐”推广，大客户成单周期缩短了 32%。',
        chartType: 'bar',
        citations: [
          {
            id: 'kb-data-3-1',
            name: '《2025年第一季度跨区域大区销售运营战报》.doc',
            type: 'doc',
            size: '720KB',
            date: '2025-02-10',
            sourceChapter: '华东与华南战区业绩PK与商机转化',
            matchScore: '97.6%',
            excerpt: '华东大区总销售额 ¥1,640万，线索转化率 18.6%；华南大区总销售额 ¥1,420万，线索转化率 16.2%。华东大区客单价达到 ¥2.9 万元。',
            contextSnippet: '【华东与华南战区业绩PK与商机转化】\n华东大区聚焦头部KA客户成效显著，商机跟进周期显著提速。'
          }
        ]
      },
      {
        id: 'data-card-4',
        question: '查询今年集团所有的差旅费报销单据与支出明细？',
        responseTitle: '今年集团差旅费报销分析',
        responseText: '经财务系统全量单据归集，截至当前：\n\n📋 **报销单据总览**：\n- **累计有效报销单**：1,428 笔\n- **已审批入账总额**：¥384.6 万元\n- **待审核单据**：36 笔（金额约 ¥12.8 万元）\n- **主要支出构成**：机票/高铁交通费 54.2%、酒店住宿 31.5%、差旅津贴 14.3%',
        sections: [
          {
            title: '合规与成本优化提示',
            content: '通过“AI+财务自动差旅”预订比价，累计为集团节约差旅预算支出约 ¥46.8 万元。'
          }
        ],
        citations: [
          {
            id: 'kb-data-4-1',
            name: '《财务共享中心全量差旅报销台账与成本管控月报》.doc',
            type: 'doc',
            size: '890KB',
            date: '2025-02-15',
            sourceChapter: '差旅支出结构与费用节约成效',
            matchScore: '99.1%',
            excerpt: '累计审批通过有效报销单据 1,428 笔，入账金额 ¥384.6 万元；交通费占比 54.2%、住宿费占比 31.5%、差旅津贴 14.3%；通过企业商旅平台集中比价节约支出约 ¥46.8 万元。',
            contextSnippet: '【差旅支出结构与费用节约成效】\n系统自动拦截不合规报销单据 48 笔，合规执行率由 91.2% 提升至 99.4%。'
          }
        ]
      },
      {
        id: 'data-card-5',
        question: '生成近6个月客户退款率走势及主要退款原因占比分析？',
        responseTitle: '近6个月客户退款率及归因分析',
        responseText: '根据售后系统近 180 天日志分析：\n\n📉 **退款率走势**：平均退款率为 **2.1%**，整体呈平稳下降趋势（最高点为 3月 2.8%，最低点为 7月 1.5%）。\n\n🔍 **主要退款原因归因**：\n1. **功能不符合预期**：占比 42%\n2. **交付周期过长**：占比 28%\n3. **售后服务响应慢**：占比 18%\n4. **其他/无理由**：占比 12%',
        chartType: 'line',
        citations: [
          {
            id: 'kb-data-5-1',
            name: '《客户成功与售后工单退款归因深度诊断报告》.pdf',
            type: 'pdf',
            size: '1.6MB',
            date: '2025-01-30',
            sourceChapter: '退款根因排查与满意度追踪',
            matchScore: '98.0%',
            excerpt: '平均退款率稳步降至 2.1%；主要退款原因分布为：功能不符合预期占比42%、交付周期过长占比28%、售后服务响应慢占比18%、其他占比12%。',
            contextSnippet: '【退款根因排查与满意度追踪】\n持续优化产品易用性与售前需求匹配度，强化交付周期管控。'
          }
        ]
      }
    ]
  },
  '智能问答': {
    subtitle: '您可以向我咨询集团通用政策、人力、财务、法务等专业问题及日常疑问',
    cards: [
      {
        id: 'qa-card-1',
        question: '集团差旅报销标准与审批流程是什么？',
        responseTitle: '集团差旅报销管理规定与审批指引',
        responseText: '依据《广新集团差旅及业务支出管理办法（2025版）》，现为您梳理差旅标准与报销流程：\n\n📌 **一、差旅交通与住宿标准**：\n- **城市交通**：高铁原则上乘坐二等座；直线距离超过800公里可申请经济舱飞机。\n- **住宿限额**：一类城市（北上广深）标准上限 ¥500/间夜；二类省会城市标准上限 ¥380/间夜；其他城市 ¥280/间夜。\n- **伙食及交通补助**：包干伙食补助标准为 ¥100/人/天，市内交通补助为 ¥80/人/天。\n\n📋 **二、线上报销审批流程**：\n1. 出发前在移动办公端发起《出差事前审批单》；\n2. 差旅结束后 7 个工作日内，关联原出差申请单并上传电子发票与行程单凭据；\n3. 部门负责人审批 ➔ 财务共享中心合规稽核 ➔ 财务总监核准 ➔ 银行系统自动转账入账。',
        sections: [
          {
            title: '💡 智能合规提示',
            content: [
              '使用“AI+财务自动差旅”统一预订平台的单据可享免贴票、免垫资一键自动入账；',
              '发票抬头需准确填写集团全称与统一社会信用代码。'
            ]
          }
        ],
        citations: [
          {
            id: 'kb-qa-1-1',
            name: '《广新集团差旅及业务支出管理办法(2025版)》.doc',
            type: 'doc',
            size: '520KB',
            date: '2025-01-01',
            sourceChapter: '第二章 差旅标准与交通住宿限额 第八条',
            matchScore: '99.5%',
            excerpt: '高铁原则上乘坐二等座；直线距离超过800公里可申请经济舱飞机。一类城市（北上广深）标准上限 ¥500/间夜；二类省会城市标准上限 ¥380/间夜；包干伙食补助标准为 ¥100/人/天，市内交通补助为 ¥80/人/天。',
            contextSnippet: '【第二章 差旅标准与交通住宿限额】\n第七条 员工出差必须坚持“事前审批、按标报销、规范高效”的原则。\n第八条 差旅住宿及交通标准严格执行分区分级上限管控，超出标准部分由个人自行承担。'
          },
          {
            id: 'kb-qa-1-2',
            name: '《财务共享中心全流程电子发票报销与入账指引》.doc',
            type: 'doc',
            size: '410KB',
            date: '2024-12-15',
            sourceChapter: '第三章 报销单据提交与时效规范 第十四条',
            matchScore: '97.8%',
            excerpt: '差旅结束后 7 个工作日内，须在移动办公端关联原出差申请单并上传电子发票与行程单凭据；部门负责人审批后经财务共享中心合规稽核，核准后通过银企直联系统自动转账入账。',
            contextSnippet: '【第三章 报销单据提交与时效规范】\n第十三条 电子发票须符合国家税务总局统一格式规范，抬头与纳税人识别号必须与集团一致。\n第十四条 出差行程结束后原则上应在7个工作日内完成报销提报，跨月提报需说明原因。'
          },
          {
            id: 'kb-qa-1-3',
            name: '《企业国内差旅统一预订与免垫资平台操作指南》.pdf',
            type: 'pdf',
            size: '2.1MB',
            date: '2024-11-10',
            sourceChapter: '第一章 统一商旅平台预订与集中结算 第四条',
            matchScore: '95.2%',
            excerpt: '通过“AI+财务自动差旅”预订平台预订的机票和协议酒店，直接由集团公户月结支付，员工免贴票、免垫资、免人工验真，行程结束自动生成入账凭证。',
            contextSnippet: '【第一章 统一商旅平台预订与集中结算】\n第三条 平台自动匹配企业协议最优折扣价，差旅预订自动比对合规差标。\n第四条 预订完成后免垫资直联结算，财务后台自动归集进项税发票。'
          }
        ]
      },
      {
        id: 'qa-card-2',
        question: '年休假与调休政策规定及申请条件？',
        responseTitle: '集团员工年休假与调休管理规程',
        responseText: '根据国家《职工带薪年休假条例》及集团人力资源管理制度规定：\n\n📅 **一、带薪年休假核算天数**：\n- **累计工龄 1 年至 10 年**：每年享受年休假 **5 天**；\n- **累计工龄 10 年至 20 年**：每年享受年休假 **10 天**；\n- **累计工龄 20 年及以上**：每年享受年休假 **15 天**。\n\n⏱️ **二、加班调休管理原则**：\n- 休息日或法定节假日加班经部门分管领导事前审批后，可按 1:1 累计调休时长；\n- 调休额度原则上需在当自然年度内休完，特殊情况经人力资源部备案可顺延至次年一季度末。',
        sections: [
          {
            title: '📝 申请与审批流程',
            content: '通过移动OA【请假申请】模块，选择【年休假/调休】，系统将自动拉取剩余可用天数并智能校验考勤排班。'
          }
        ],
        citations: [
          {
            id: 'kb-qa-2-1',
            name: '《广新集团员工考勤、工时与休假管理规范》.doc',
            type: 'doc',
            size: '480KB',
            date: '2024-12-01',
            sourceChapter: '第四章 带薪年休假与调休管理 第十九条',
            matchScore: '99.0%',
            excerpt: '累计工龄1年至10年享受5天年休假；10年至20年享受10天；20年及以上享受15天。休息日加班经事前审批后按1:1折算调休额度。',
            contextSnippet: '【第四章 带薪年休假与调休管理】\n第十八条 年休假天数根据社保缴纳记录与有效工龄证明综合核算。\n第十九条 调休额度应在当年内合理安排休完，保障员工身心健康与劳逸结合。'
          },
          {
            id: 'kb-qa-2-2',
            name: '《国家职工带薪年休假条例及企业实施细则释义》.pdf',
            type: 'pdf',
            size: '1.5MB',
            date: '2024-06-18',
            sourceChapter: '第二条 职工年休假享受资格与跨年清零规定',
            matchScore: '96.3%',
            excerpt: '职工累计工作已满1年不满10年的，年休假5天；已满10年不满20年的，年休假10天；已满20年的，年休假15天。国家法定休假日、休息日不计入年休假的假期。',
            contextSnippet: '【第二条 职工年休假享受资格与跨年清零规定】\n单位确因工作需要不能安排职工休年休假的，经职工本人同意，可以不安排职工休年休假。'
          }
        ]
      },
      {
        id: 'qa-card-3',
        question: '新员工入职试用期考核与转正流程指引？',
        responseTitle: '新员工试用期考核及转正办理规范',
        responseText: '新员工入职试用期管理分为月度跟踪辅导与期满综合述职考核：\n\n📋 **转正考核关键节点**：\n1. **入职第 1-2 个月**：导师制定双周辅导计划并完成阶段目标跟进；\n2. **试用期届满前 15 天**：员工在线填写《试用期工作总结及转正申请》；\n3. **部门考评**：直属主管组织转正述职评分并出具考核意见；\n4. **人力审核与定级定薪**：集团人力资源部复核并办结正式劳动合同转正手续。',
        sections: [
          {
            title: '💡 重点考核维度',
            content: [
              '岗位专业履职能力与核心KPI达成率（权重 50%）',
              '团队协作、沟通与企业文化践行度（权重 30%）',
              '规章制度与安全保密纪律执行（权重 20%）'
            ]
          }
        ],
        citations: [
          {
            id: 'kb-qa-3-1',
            name: '《集团新员工入职导师制与试用期考评实施办法》.doc',
            type: 'doc',
            size: '390KB',
            date: '2024-11-05',
            sourceChapter: '第三章 试用期转正考核流程与评分权重 第十一条',
            matchScore: '98.2%',
            excerpt: '试用期届满前15天员工发起转正申请；专业KPI考核权重占50%、团队协作与价值观占30%、制度与保密纪律占20%；人力资源部复核后正式定级定薪。',
            contextSnippet: '【第三章 试用期转正考核流程与评分权重】\n第十条 直属主管需每月开展不少于1次辅导面谈并记录于中台系统。\n第十一条 综合评分达到80分及以上方可办理正常转正手续。'
          }
        ]
      },
      {
        id: 'qa-card-4',
        question: '集团企业年金与补充医疗保险申请及报销流程？',
        responseTitle: '企业年金与补充医疗保障申领指引',
        responseText: '集团为在职合同制员工构建了多层次福利保障体系：\n\n🏥 **补充医疗保险福利**：\n- 门诊自费部分按 80% 比例二次报销，年度限额 ¥20,000 元；\n- 住院自费合规费用报销比例高达 95%；\n- 手机端拍照上传发票与费用清单即可完成极速理赔。\n\n🏦 **企业年金缴费计划**：\n- 单位按员工基准工资的 8% 配套缴存，个人按 4% 缴存，享受税收递延优惠。',
        sections: [
          {
            title: '申报入口',
            content: '进入集团OA【人事福利】➔【企业年金/补充医疗】即可随时查询个人账户明细与提交理赔单。'
          }
        ],
        citations: [
          {
            id: 'kb-qa-4-1',
            name: '《广新集团员工补充商业医疗保险理赔服务指南》.pdf',
            type: 'pdf',
            size: '2.8MB',
            date: '2025-01-08',
            sourceChapter: '第二部分 门诊与住院理赔比例及额度核算',
            matchScore: '98.9%',
            excerpt: '门诊自费合规费用二次报销比例为80%，个人年度累计理赔限额为¥20,000元；住院费用自费部分报销比例达95%；支持移动端拍照直赔。',
            contextSnippet: '【第二部分 门诊与住院理赔比例及额度核算】\n一、理赔申请人应在就诊或出院后60个自然日内完成单据上传。\n二、指定公立二级及以上医院就诊费用均纳入保障范围。'
          },
          {
            id: 'kb-qa-4-2',
            name: '《企业年金实施方案与个人账户缴费细则》.doc',
            type: 'doc',
            size: '460KB',
            date: '2024-09-01',
            sourceChapter: '第三章 缴费比例与税延优惠政策 第七条',
            matchScore: '96.5%',
            excerpt: '单位缴费比例为基准工资的8%，个人缴费比例为4%，按月随工资发放时代扣代缴并计入个人年金专户，享受企业年金个税递延优惠政策。',
            contextSnippet: '【第三章 缴费比例与税延优惠政策】\n第六条 员工自愿签署《企业年金加入确认书》后生效。\n第七条 个人账户资金由专业受托金融机构进行稳健组合投资运作。'
          }
        ]
      },
      {
        id: 'qa-card-5',
        question: '集团保密制度与信息安全规范核心要点？',
        responseTitle: '集团商业秘密与信息安全管理红线',
        responseText: '🛡️ **信息安全管理“五严禁”**：\n1. 严禁使用非官方即时通讯软件传输涉密商业文档与未公开财务数据；\n2. 严禁私自将内部系统源代码、客户数据导出至个人私有设备；\n3. 办公电脑离开工位须随时锁定屏幕，办公网络统一接入企业安全网关；\n4. 涉密会议期间严禁携带录音设备与手机入场；\n5. 对外合作共享敏感数据必须经风控法务部签署专项保密协议（NDA）。',
        citations: [
          {
            id: 'kb-qa-5-1',
            name: '知识库名称知识库名称知识库.doc',
            type: 'doc',
            size: '428KB',
            date: '2025-01-15',
            sourceChapter: '第三章 涉密载体与数字化传输安全管理 第十八条',
            matchScore: '99.4%',
            excerpt: '严禁使用非官方即时通讯软件传输涉密商业文档与未公开财务数据；严禁私自将内部系统源代码、核心客户清单等敏感数据导出至个人私有设备。办公电脑离开工位须随时锁定屏幕，办公网络统一接入企业安全网关。',
            contextSnippet: '【第三章 涉密载体与数字化传输安全管理】\n第十七条 各事业部应对核心技术参数、战略投资决议、未公开财报等定密资料建立专属台账。\n第十八条 严禁使用非官方即时通讯软件传输涉密商业文档；违规外发一经查实立即停职并启动法纪调查。\n第十九条 外发商务文件必须经部门负责人与风控法务部双重审核并加盖电子防伪动态水印。'
          },
          {
            id: 'kb-qa-5-2',
            name: '知识库名称知识库名称知识库名称识库名称...doc',
            type: 'doc',
            size: '612KB',
            date: '2024-11-20',
            sourceChapter: '第二章 会议保密与涉密场所物理管控 第十二条',
            matchScore: '97.2%',
            excerpt: '涉密会议期间严禁携带任何具备录音、录像或无线信号传输功能的电子设备入场；敏感合作项目开展前必须由风控法务部前置签署专项《保密协议与廉洁自律承诺书（NDA）》。',
            contextSnippet: '【第二章 会议保密与涉密场所物理管控】\n第十一条 涉及上市公司重大重组、重大招投标或未公开核心财务数据的会议定为特级涉密会议。\n第十二条 参会人员须在安检处将手机等移动通讯设备统一交存专用屏蔽柜；会议纪要不得私自复印或外泄。'
          },
          {
            id: 'kb-qa-5-3',
            name: '知识库名称知识库名称知识库.doc',
            type: 'doc',
            size: '380KB',
            date: '2024-10-08',
            sourceChapter: '第四章 违规追责与司法移交 第三十一条',
            matchScore: '95.6%',
            excerpt: '办公电脑离开工位须随时锁定屏幕，办公网络统一接入企业安全网关；员工因故意或重大过失导致商业机密泄露、给集团造成直接经济损失或商誉损害的，集团保留依法追究其民事赔偿责任及刑事立案的权利。',
            contextSnippet: '【第四章 违规追责与司法移交】\n第三十条 违反保密义务的行为纳入个人年度绩效考核与职级晋升一票否决机制。\n第三十一条 触犯国家反不正当竞争法、商业秘密保护法及刑法相关条款的，依法移送公安及司法机关追究刑事责任。'
          },
          {
            id: 'kb-qa-5-4',
            name: '知识库名称.pdf',
            type: 'pdf',
            size: '1.4MB',
            date: '2024-08-30',
            sourceChapter: '第一章 数据分类与核心资产防护矩阵 第五条',
            matchScore: '93.8%',
            excerpt: '对外合作共享敏感数据必须经风控法务部签署专项保密协议（NDA）。所有核心数据库实施动态脱敏与细粒度访问控制，数据导出需触发双人复核审批机制。',
            contextSnippet: '【第一章 数据分类与核心资产防护矩阵】\n第四条 企业数据资产划分为：公开级、内部级、秘密级、机密级四个等级。\n第五条 机密级数据严禁离线存储，严禁跨网络环境传输，访问权限按最小够用原则每季度动态复核。'
          }
        ]
      }
    ]
  },
  '智能写作': {
    subtitle: '您可以向我提出公文、新闻稿、总结汇报等各类文案起草需求',
    cards: [
      {
        id: 'writing-card-1',
        question: '帮我起草一份关于“深化数字化转型”的总经理办公会讲话稿',
        responseTitle: '总经理办公会讲话稿：聚焦数字赋能，深化全面转型',
        responseText: '同志们：\n\n今天我们召开总经理办公会，专题研究部署集团数字化转型深化推进工作。当前，产业变革浪潮奔涌，数字化不仅是技术升级，更是推动高质量发展的必由之路。\n\n**一、统一思想，深刻领会数字化转型的战略意义**\n我们要以“业务数字化、数据业务化”为核心导向，破除信息孤岛，全面打通数据中台。\n\n**二、聚焦重点，狠抓三项核心任务落地**\n1. **夯实数字底座**：加快智能问数、自动差旅与统一审批系统全场景覆盖；\n2. **赋能一线业务**：让数据说话，为前线经营单元提供精准决策支持；\n3. **筑牢安全防线**：坚决守住数据合规与信息安全底线。\n\n**三、强化保障，确保各项任务取得扎实成效**\n各部门要明确责任分工，挂图作战，以实干实效为集团现代化治理注入强劲动能！',
        sections: [
          {
            title: '💡 润色建议',
            content: [
              '可根据会场实际氛围调整开头致辞语气；',
              '如需嵌入具体分管业务线指标，可继续输入补充数据指令。'
            ]
          }
        ]
      },
      {
        id: 'writing-card-2',
        question: '生成一份2024年度安全生产与隐患排查工作总结汇报',
        responseTitle: '2024年度安全生产与隐患排查治理总结汇报',
        responseText: '为全面总结 2024 年度安全生产管理成果，现将全年重点工作汇报如下：\n\n📊 **一、全年安全运行核心指标**\n- 全年实现“零重大安全事故、零人员伤亡、零重大火灾”的三零目标；\n- 累计开展安全专项巡查 **342 次**，发现并完成整改闭环安全隐患 **128 项**，隐患整改率达 **100%**。\n\n🛠️ **二、主要工作推进举措**\n1. **健全制度体系**：修订《安全生产责任制考核办法》，层层签订安全责任书；\n2. **强化数智监控**：引入 AI 视频巡检与物联网传感器，实现重点区域 24 小时风险预警；\n3. **深化全员宣教**：组织应急演练 12 场，员工安全培训覆盖率达 100%。\n\n🎯 **三、2025年重点工作计划**\n持续优化应急联动机制，加大安全数字化投入，筑牢本质安全防线。'
      },
      {
        id: 'writing-card-3',
        question: '撰写一篇关于集团荣获“年度创新企业奖”的企业新闻通稿',
        responseTitle: '喜报：广新集团荣膺“2024年度数字化创新先锋企业奖”',
        responseText: '【本报讯】近日，在 2024 现代企业数智创新峰会上，广新集团凭借在智能中台建设、AI智能体群应用及产业数字化升级领域的卓越实践，荣获“2024年度数字化创新先锋企业奖”。\n\n近年来，广新集团坚定践行创新驱动发展战略，打造集智能问数、智能写作、财务自动差旅等于一体的协同办公生态，全面提升管理效能与决策敏捷度。\n\n集团相关负责人表示，此次获奖是对集团数字化转型成果的充分肯定。未来，集团将继续携手行业伙伴，以数智之力赋能实体产业高质量发展！'
      },
      {
        id: 'writing-card-4',
        question: '起草一份关于举办2025集团春季员工运动会的通知文件',
        responseTitle: '关于举办广新集团2025年春季趣味员工运动会的通知',
        responseText: '各部门、各分子公司：\n\n为丰富员工业余文化生活，增强团队凝聚力与向心力，集团工会定于 2025 年 4 月举办春季趣味员工运动会。现将有关事项通知如下：\n\n一、活动主题：“昂扬奋进，智创未来”\n二、活动时间：2025年4月18日（周五）全天\n三、活动地点：集团总部体育中心运动场\n四、比赛项目：\n1. 团体项目：拔河比赛、无敌风火轮、旱地龙舟\n2. 个人项目：羽毛球单打、乒乓球单打、男子/女子长跑\n五、报名要求：请各部门于 4 月 5 日前将参赛人员名单汇总报送至工会邮箱。'
      },
      {
        id: 'writing-card-5',
        question: '编写一份关于新业务线市场推广与客户拓展的立项方案',
        responseTitle: '新业务线市场开拓与精准拓客立项实施方案',
        responseText: '📋 **方案概要**：\n一、市场背景与机遇分析：针对目标行业企业数智化转型痛点，切入垂直细分场景；\n二、目标客群定位：聚焦年营收 5,000万以上的中大型制造及供应链企业；\n三、核心推广策略：\n1. 行业展会与线下闭门研讨会；\n2. 标杆客户案例精准营销与搜索引擎/内容矩阵投放；\n3. 渠道生态伙伴分销激励机制。\n四、预期 ROI 与财务预算测算：首期预算 ¥60 万元，预计实现新增合同额 ¥450 万元。'
      }
    ]
  },
  'AI+财务自动差旅': {
    subtitle: '您可以向我咨询差旅预订、机票比价与报销凭证全流程合规校验',
    cards: [
      {
        id: 'travel-card-1',
        question: '申请出差北京三天，与代理商讨论项目方案',
        responseTitle: '已为您预生成出差申请单，请确认：',
        responseText: '已为您预生成出差申请单，请确认：'
      },
      {
        id: 'travel-card-2',
        question: '明天要去北京出差帮我推荐附近的酒店',
        responseTitle: '推荐北京市国贸地区附近酒店',
        responseText: '可以提供具体的出差拜访地点，我会为您推荐附近的酒店'
      },
      {
        id: 'travel-card-3',
        question: '我还有哪些发票没有报销',
        responseTitle: '未报销差旅发票与单据明细',
        responseText: '已为您查询未报销单据发票明细，请确认：'
      },
      {
        id: 'travel-card-4',
        question: '查询北京到上海往返最优惠差旅航班与比价方案',
        responseTitle: '北京 ⇄ 上海 差旅合规航班智能比价方案',
        responseText: '✈️ **根据集团差旅商旅企业协议库比价推荐**：\n\n🛫 **去程：北京首都 (PEK) ➔ 上海虹桥 (SHA)**\n- **推荐航班**：国航 CA1519（08:30 - 10:45）\n- **企业协议价**：¥680（含机建燃油，低于航司官网直报价 22%）\n- **合规校验**：符合集团《差旅标准：经济舱且折扣低于6折》\n\n🛬 **返程：上海虹桥 (SHA) ➔ 北京大兴 (PKX)**\n- **推荐航班**：东航 MU5183（18:00 - 20:20）\n- **企业协议价**：¥640\n\n🏨 **推荐差旅酒店**：虹桥商务区指定协议酒店（¥420/晚，免押金免查房）\n\n💡 **一键预订**：点击下方即可由企业公账户直接结算，员工无需垫资。',
        sections: [
          {
            title: '差旅报销省心优势',
            content: [
              '电子行程单与增值税发票自动归集入账；',
              '免贴票、免打印、出差结束即自动生成报销凭据。'
            ]
          }
        ]
      },
      {
        id: 'travel-card-5',
        question: '差旅报销发票验真与自动归集流程怎么操作？',
        responseTitle: '电子发票验真、查重与一键归集操作指南',
        responseText: '🧾 **发票自动归集与验真操作步骤**：\n\n1. **微信/支付宝卡包一键同步**：授权绑定后，差旅期间产生的滴滴打车、航旅纵横机票发票自动拉取；\n2. **智能 OCR 拍照验真**：纸质发票使用手机拍照，系统自动识别发票代码、号码、金额并连接全国增值税发票查验平台核验；\n3. **防重防伪拦截**：若同一发票被重复提交，系统将在 0.1 秒内标红阻断；\n4. **自动生成记账凭证**：校验通过后自动关联对应的出差事前审批单，直达财务共享中心。'
      }
    ]
  },
  '智能摘要': {
    subtitle: '您可以向我提供长文档，一键提炼核心要点、会议纪要与决策简报',
    cards: [
      {
        id: 'summary-card-1',
        question: '快速提炼2025年度全员战略研讨会议纪要与行动清单',
        responseTitle: '2025年度全员战略研讨会核心纪要与责任清单',
        responseText: '📝 **会议核心要点提炼**：\n\n**一、战略共识**：\n- 坚定以“数智赋能、稳健经营、提质增效”为 2025 年度战略基调；\n- 目标全年实现集团营业总收入增长 12%，科技研发投入占比提升至 8.5%。\n\n**二、重点决议与行动计划（Action Items）**：\n1. **数据中台全面贯通**（责任人：IT中台部 | 截止时间：5月30日）\n2. **海外市场渠道拓新工程**（责任人：国际业务部 | 截止时间：6月15日）\n3. **全员人效提升考核体系上线**（责任人：人力资源部 | 截止时间：4月30日）\n\n**三、风险预警**：\n严控大宗原材料采购价格波动风险，强化资金流动性与应收账款周转率监管。',
        sections: [
          {
            title: '纪要分发提示',
            content: '本纪要已同步抄送各事业部负责人，点击右上角可一键导出 PDF 简报。'
          }
        ]
      },
      {
        id: 'summary-card-2',
        question: '将这份40页的可行性研究报告精简为1页高管决策摘要',
        responseTitle: '1页纸高管决策摘要：新材料智能制造产业基地项目',
        responseText: '📌 **核心指标与决策要素**：\n\n1. **项目定位**：年产 10万吨高性能复合新材料绿色制造基地；\n2. **投资规模**：总投资 ¥3.2 亿元（固定资产投资 75%，流动资金 25%）；\n3. **建设周期**：18 个月（预计 2026 年 Q3 试投产）；\n4. **财务收益**：投资回收期 4.8 年，内部收益率（IRR）达 19.4%，年均净利润预计 ¥5,800 万元；\n5. **结论与建议**：技术路线成熟，产业政策契合度高，建议提交投决会进入实质落地审批。'
      },
      {
        id: 'summary-card-3',
        question: '提炼近一周集团各业务板块工作周报的核心成果与卡点',
        responseTitle: '本周集团各业务板块周报综合精炼',
        responseText: '📊 **本周重点推进成果**：\n- **研发线**：完成 AI 问答大模型 2.0 升级，响应延迟降低 38%；\n- **市场线**：新签约 3 家行业头部客户，合同总额 ¥860 万元；\n- **供应链**：关键元器件安全备件库存已补充到位。\n\n⚠️ **当前关键阻碍与卡点**：\n- 华南二期厂房供电扩容审批进度滞后，需协调政府相关部门加快并网验收。'
      },
      {
        id: 'summary-card-4',
        question: '生成今日集团要闻与行业竞品动态舆情简报',
        responseTitle: '每日行业与舆情动态要报',
        responseText: '📰 **行业要闻速递**：\n1. 国资委印发《关于加快推进国有企业数智化转型行动方案》；\n2. 同业竞品 A 公司发布最新工业物联网云平台，主打低代码集成与预测性维护；\n3. 集团所属上市公司今日股价表现稳健，券商研报维持“买入”评级。'
      },
      {
        id: 'summary-card-5',
        question: '提取商业合同中的核心关键条款、履约节点与风险责任清单',
        responseTitle: '合同关键信息提炼表',
        responseText: '📑 **提取结果明细**：\n- **签约主体**：广新集团（甲方） vs 某智能科技公司（乙方）\n- **合同总额**：¥8,500,000 元（分三期支付：30% - 40% - 30%）\n- **第一期付款前置条件**：完成系统基础部署与初步需求确认书签署；\n- **违约金标准**：每日延期按未付款项的 0.05% 计算，上限 5%。'
      }
    ]
  },
  'AI+员工服务': {
    subtitle: '您可以向我申请请休假、加班、开具证明或查询员工手册规范',
    cards: [
      {
        id: 'emp-card-1',
        question: '明天家中有事请假2天',
        responseTitle: '已为您预生成出差申请单，请确认',
        responseText: '已为您智能提取请假时间与事由并预填申请单，请核对信息后提交：'
      },
      {
        id: 'emp-card-2',
        question: '我要申请加班1天，与客户线下会议',
        responseTitle: '已为您预生成加班申请单，请确认',
        responseText: '已为您根据工作日加班规则预生成加整班申请单，请确认：'
      },
      {
        id: 'emp-card-3',
        question: '今天晚上加3小时班，与客户线上会议',
        responseTitle: '已为您预生成加班申请单，请确认',
        responseText: '已为您根据加点时段（18:00-21:30）预生成加点申请单，请确认：'
      },
      {
        id: 'emp-card-4',
        question: '查询员工手册中带薪年休假与调休规定',
        responseTitle: '集团员工手册：年休假与调休管理细则',
        responseText: '📖 **员工休假福利制度要点**：\n\n1. **带薪年假天数**：\n- 累计工龄满 1 年不满 10 年：享受 **5 天** 年休假；\n- 累计工龄满 10 年不满 20 年：享受 **10 天** 年休假；\n- 满 20 年以上：享受 **15 天** 年休假。\n\n2. **加班调休额度**：\n- 加班申请经审批同意转调休后，额度按 1:1 计入个人假期账户，有效期为当自然年（可顺延至次年 3 月底清零）。',
        citations: [
          {
            id: 'kb-emp-1',
            name: '《广新控股集团员工考勤与休假管理规范》.pdf',
            type: 'pdf',
            size: '1.2MB',
            date: '2025-01-01',
            sourceChapter: '第二章 年休假与调休核算办法 第五条',
            matchScore: '99.1%',
            excerpt: '员工年休假按国家规定及在司工龄综合核定，调休假需在事前完成加班审批流程并选择转入调休额度。',
            contextSnippet: '【第二章 年休假与调休核算办法】\n第五条 员工请假需通过集团AI员工服务中台提前发起申请并经部门负责人审核。\n第六条 调休额度自产生之日起1年内有效。'
          }
        ]
      },
      {
        id: 'emp-card-5',
        question: '开具个人收入证明与在职证明申请流程',
        responseTitle: '个人在职证明与收入证明办理指南',
        responseText: '📄 **证明办理全流程**：\n\n1. **在线提交申请**：告知开具类型（在职证明 / 收入证明）、开具用途（银行房贷、落户、签证出国等）；\n2. **系统自动核算**：系统直接从财务及人事中台拉取近 12 个月完税及实发薪酬总额，生成标准红头证明；\n3. **电子签章与投递**：支持下载附带防伪校验二维码的电子版 PDF，或选择邮寄/前台自取纸质盖章件。'
      }
    ]
  },
  '法智小新': {
    subtitle: '您可以向我咨询合同智能审核、法律条款风险排查与合规问答',
    cards: [
      {
        id: 'legal-card-1',
        question: '请帮我审查一份大额设备采购合同中的违约责任与付款条款',
        responseTitle: '大额设备采购合同法务风控审查意见',
        responseText: '法智小新已对《智能设备采购及安装调试框架协议》完成合规审查，重点提示如下：\n\n⚠️ **一、付款条件风险提示**：\n原合同约定“发货前支付 80%”，建议修改为“合同签订后付 20% 预付款、设备到场初验合格付 40%、安装调试终验合格付 30%、质保期满 1 年付 10% 尾款”，以切实保障买方履约权益。\n\n⚖️ **二、违约金与赔偿范围**：\n建议补充约定“若卖方延期交货超过 15 个自然日，买方有权单方无条件解除合同并要求卖方退还全部已付款项，并按合同总额 20% 支付违约金”。\n\n🏛️ **三、争议管辖条款**：\n原协议约定“卖方所在地法院管辖”，建议坚决修改为“买方所在地人民法院管辖”。',
        sections: [
          {
            title: '📜 法律合规依据',
            content: [
              '《中华人民共和国民法典》第五百七十七条（违约责任）',
              '《中华人民共和国民法典》第五百八十五条（违约金条款及调整）'
            ]
          }
        ]
      },
      {
        id: 'legal-card-2',
        question: '劳动合同解除与经济补偿金合规计算标准与法律依据',
        responseTitle: '劳动合同解除经济补偿金（N/N+1/2N）法定计算规则',
        responseText: '依据《中华人民共和国劳动合同法》第四十六条、第四十七条：\n\n💰 **一、经济补偿金（N）计算标准**：\n- **基数**：员工离职前 12 个月的月平均工资（包括基本工资、奖金、津贴补贴等全部收入）；\n- **工作年限折算**：每满 1 年支付 1 个月工资；6个月以上不满 1 年的按 1 年算；不满 6 个月的支付半个月工资。\n\n⏱️ **二、“代通知金”（+1）适用情形**：\n仅适用于用人单位依据《劳动合同法》第四十条（非过错性辞退）解除，且未提前 30 天书面通知劳动者时需额外支付 1 个月工资。\n\n🚫 **三、违法解除赔偿金（2N）**：\n若单位无合法事实或违反法定程序单方解除，需按经济补偿标准的 2 倍支付赔偿金。'
      },
      {
        id: 'legal-card-3',
        question: '集团对外签署合作协议必须具备的先决条件与风控清单',
        responseTitle: '对外合作协议签署前置合规审查清单',
        responseText: '📋 **重大合作签署前“六必查”**：\n1. **主体资格及经营资质**：核实统一社会信用代码、最新年报、特许经营许可证；\n2. **涉诉与失信记录**：在中国裁判文书网、执行信息公开网排查是否存在重大被执行或限高记录；\n3. **签字盖章授权**：必须取得法定代表人授权委托书原件或由法人亲笔签署；\n4. **知识产权归属**：明确合作成果与衍生专利的权利归属比例；\n5. **保密与竞业限制**：同步签署专项《商业秘密保护与保密承诺书》；\n6. **反商业贿赂条款**：必须包含阳光合规与廉洁合作承诺条款。'
      },
      {
        id: 'legal-card-4',
        question: '知识产权侵权防范与商业秘密保护合规操作要点',
        responseTitle: '商业秘密保护与知识产权合规指引',
        responseText: '🛡️ **关键防护要点**：\n- **涉密文件打标**：内部技术图纸、源代码及核心客户名单统一加注数字水印与保密级别标签；\n- **离职人员交接**：核心研发与销售人员离职时执行全量设备清查与脱密期竞业限制；\n- **第三方引入审查**：引入开源组件或外部素材前，进行版权合规检索，防范商业侵权诉讼风险。'
      },
      {
        id: 'legal-card-5',
        question: '审查供应商框架协议中的争议解决与管辖权条款',
        responseTitle: '供应商框架协议争议解决条款审查建议',
        responseText: '建议条款范本：\n“凡因本合同引起的或与本合同有关的任何争议，双方应友好协商解决；协商不成的，任何一方均有权向甲方（即本集团）所在地有管辖权的人民法院提起诉讼。”\n\n注：如对方坚持仲裁，应约定在“中国国际经济贸易仲裁委员会（CIETAC）”或“广州/深圳仲裁委员会”，适用简易仲裁程序。'
      }
    ]
  }
};

const DataAgentChatView: React.FC<DataAgentChatViewProps> = ({
  agent,
  onBack,
  initialQuestion,
  onSwitchAgent
}) => {
  const [messages, setMessages] = useState<DataMessage[]>([]);
  const [cardIndex, setCardIndex] = useState(0);

  const activeConfig = agentPromptConfigs[agent.name] || agentPromptConfigs['智能问数'];
  const activeCards = activeConfig.cards;
  const activeSubtitle = activeConfig.subtitle;

  const [activeSubView, setActiveSubView] = useState<'chat' | 'skillTree' | 'scheduleShare' | 'travelRecords'>('chat');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [inputText, setInputText] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'horizontal' | 'pie' | 'table'>('bar');
  const [isThinking, setIsThinking] = useState(true);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [collapsedCitations, setCollapsedCitations] = useState<Record<string, boolean>>({});
  const [selectedCitation, setSelectedCitation] = useState<KnowledgeCitation | null>(null);

  // 智能摘要 Agent State
  const [isSummaryTypeOpen, setIsSummaryTypeOpen] = useState(false);

  // 智能写作 Agent State & Modals
  const [isWritingTemplateOpen, setIsWritingTemplateOpen] = useState(false);
  const [isWritingKbOpen, setIsWritingKbOpen] = useState(false);
  const [selectedWritingDocs, setSelectedWritingDocs] = useState<AttachedDocument[]>([
    { id: 'f-1', name: '数据监测与优化策略.PDF', size: '154.12KB', type: 'pdf' },
    { id: 'f-2', name: '企业数字化转型实施纲要.pdf', size: '12.2MB', type: 'pdf' },
    { id: 'f-3', name: '新业务线市场开拓立项方案.pdf', size: '12.4MB', type: 'pdf' }
  ]);
  const [activeArticleModal, setActiveArticleModal] = useState<GeneratedArticle | null>(null);

  // AI+财务自动差旅 Agent State & Modals
  const [isFinancialTemplateOpen, setIsFinancialTemplateOpen] = useState(false);
  const [editingTravelApp, setEditingTravelApp] = useState<TravelApplicationData | null>(null);
  const [travelRecords, setTravelRecords] = useState<TravelRecordItem[]>(INITIAL_TRAVEL_RECORDS);

  // AI+员工服务 Agent State & Modals
  const [editingLeaveApp, setEditingLeaveApp] = useState<LeaveApplicationData | null>(null);
  const [editingOvertimeApp, setEditingOvertimeApp] = useState<OvertimeApplicationData | null>(null);

  const handleSubmitLeaveApp = (msgId: string, appData: LeaveApplicationData) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.leaveApp
          ? {
              ...m,
              leaveApp: {
                ...m.leaveApp,
                isSubmitted: true
              }
            }
          : m
      )
    );
    showToast('请假申请已提交至HR审批中心！');
  };

  const handleSubmitOvertimeApp = (msgId: string, appData: OvertimeApplicationData) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.overtimeApp
          ? {
              ...m,
              overtimeApp: {
                ...m.overtimeApp,
                isSubmitted: true
              }
            }
          : m
      )
    );
    showToast('加班申请已提交至主管审批！');
  };

  const handleSaveArticle = (updatedArticle: GeneratedArticle) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.article && m.article.id === updatedArticle.id
          ? {
              ...m,
              article: updatedArticle,
              title: updatedArticle.title,
              text: updatedArticle.content
            }
          : m
      )
    );
    setActiveArticleModal(null);
    showToast('已保存文档修改');
  };

  const handleSubmitTravelApp = (msgId: string, appData: TravelApplicationData) => {
    // 1. Mark as submitted in conversation
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.travelApp
          ? {
              ...m,
              travelApp: {
                ...m.travelApp,
                isSubmitted: true
              }
            }
          : m
      )
    );

    // 2. Add to travel records list
    const newRecord: TravelRecordItem = {
      id: 'tr-' + Date.now(),
      code: 'GHG-BX2608' + Math.floor(1000 + Math.random() * 9000),
      applicant: appData.applicant || '李明',
      applicantDept: '广新集团本部/财务部',
      date: new Date().toISOString().slice(0, 10),
      type: 'GHG-出差申请单',
      amount: appData.amount || 5000,
      status: '审批中',
      businessType: '出差申请单',
      accountingEntity: '广新集团本部',
      currency: '人民币',
      summary: `${appData.fromCity || '广州'}至${appData.toCity || '北京'}${appData.notes || '出差讨论'}`,
      currentNode: '部门总监审批',
      currentHandler: '王经理',
      deliveryStatus: '无需投递',
      paymentStatus: '企业月结免垫资',
      imageStatus: '系统自动生成'
    };
    setTravelRecords((prev) => [newRecord, ...prev]);
    showToast('出差申请已提交至财务共享中心审批！');

    // 3. Proactively push transport & hotel recommendation cards
    setTimeout(() => {
      const transportReply: DataMessage = {
        id: 'ai_transport_' + Date.now(),
        sender: 'ai',
        type: 'travel_transport',
        text: '已为您查询广州到北京的交通比价与合规班次：',
        transportData: {
          date: '2025-07-07',
          from: '广州',
          to: '北京',
          preference: '6:00-8:00、南方航空、空客321(中)'
        }
      };

      const hotelReply: DataMessage = {
        id: 'ai_hotel_' + (Date.now() + 1),
        sender: 'ai',
        type: 'travel_hotel_recommend',
        text: '为您推荐出差地点的协议合规酒店：',
        hotelRecommendData: {
          destination: '北京',
          checkIn: '07-07',
          checkOut: '07-09',
          durationText: '3晚',
          roomText: '1间 双人床',
          preference: '如家、四季酒店、4星/钻、免费wifi、免费停车、含早餐'
        }
      };

      setMessages((prev) => [...prev, transportReply, hotelReply]);
    }, 500);
  };

  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<string | null>(null);
  const [likedMsgs, setLikedMsgs] = useState<Record<string, 'like' | 'dislike'>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const avatarRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!avatarRef.current) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
      if (clientX === undefined || clientY === undefined) return;

      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const maxOffset = 5.5;
      const intensity = Math.min(distance / 180, 1);
      const offsetX = Math.cos(angle) * maxOffset * intensity;
      const offsetY = Math.sin(angle) * maxOffset * intensity;

      setEyeOffset({ x: offsetX, y: offsetY });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendQuery(initialQuestion);
    }
  }, [initialQuestion]);

  const showToast = (txt: string) => {
    setToastMsg(txt);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Hello，上午好';
    if (hour < 18) return 'Hello，下午好';
    return 'Hello，晚上好';
  };

  const currentCard = activeCards[cardIndex % activeCards.length];
  const nextCard = activeCards[(cardIndex + 1) % activeCards.length];

  const handleNextCard = () => {
    setCardIndex((prev) => (prev + 1) % activeCards.length);
  };

  const handlePrevCard = () => {
    setCardIndex((prev) => (prev - 1 + activeCards.length) % activeCards.length);
  };

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const isWriting = agent.name === '智能写作';
    const isTravel = agent.name === 'AI+财务自动差旅' || agent.category === 'travel';
    const isEmployee = agent.name === 'AI+员工服务' || agent.category === ('employee_service' as any);

    const userMsg: DataMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: queryText,
      attachedDocs: isWriting && selectedWritingDocs.length > 0 ? [...selectedWritingDocs] : undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const matched = activeCards.find((c) => c.question === queryText || queryText.includes(c.responseTitle));

    // Handle 智能写作 specific article generation response
    if (isWriting) {
      setTimeout(() => {
        const articleTitle = matched?.responseTitle || (queryText.length > 15 ? queryText.slice(0, 16) : queryText);
        const articleContent = matched?.responseText || DEFAULT_WRITING_ARTICLE.content;

        const generatedArticle: GeneratedArticle = {
          id: 'article_' + Date.now(),
          title: articleTitle,
          createTime: '创建时间 13:32',
          introText: '我将数据监测和优化策略两大部分来编写文档，详细阐述各功能的操作方法，帮助用户快速掌握策略。',
          followupText: '这份操作手册涵盖了系统主要功能的要点。你若对某些功能的描述有更细致的或者想补充其他内容，欢迎随时告知。',
          content: articleContent,
          attachedDocs: selectedWritingDocs
        };

        const aiReply: DataMessage = {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          type: 'writing_article',
          title: articleTitle,
          text: articleContent,
          article: generatedArticle,
          sections: matched?.sections
        };
        setMessages((prev) => [...prev, aiReply]);
      }, 600);
      return;
    }

    // Handle AI+财务自动差旅 specific structured cards
    if (isTravel) {
      const q = queryText.toLowerCase();

      // 1. Travel Application Intent
      if (q.includes('申请') || q.includes('出差') || q.includes('三天') || q.includes('方案') || q.includes('讨论')) {
        setTimeout(() => {
          const notes = queryText.includes('与')
            ? queryText.slice(queryText.indexOf('与'))
            : (queryText.includes('讨论') ? queryText.slice(queryText.indexOf('讨论')) : '与代理商讨论项目方案');

          const travelApp: TravelApplicationData = {
            applicant: '李明',
            startTime: '2025-07-07 上午',
            endTime: '2025-07-09 下午',
            fromCity: '广州市',
            toCity: '北京市',
            amount: 5000,
            notes: notes,
            isSubmitted: false
          };

          const aiReply: DataMessage = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            type: 'travel_application',
            text: '已为您预生成出差申请单，请确认：',
            travelApp: travelApp
          };
          setMessages((prev) => [...prev, aiReply]);
        }, 500);
        return;
      }

      // 2. Hotel Recommendations Intent
      if (q.includes('酒店') || q.includes('住宿') || q.includes('国贸') || q.includes('附近')) {
        setTimeout(() => {
          if (q.includes('国贸') || q.includes('地区') || q.includes('商务区')) {
            const aiReply: DataMessage = {
              id: 'ai_' + Date.now(),
              sender: 'ai',
              type: 'travel_hotel_list',
              text: '为您推荐北京市国贸地区附近的酒店，入住时间为2025年8月28日到9月2日',
              hotelListData: {
                locationTitle: '北京市国贸地区',
                dateRangeText: '2025年8月28日到9月2日',
                hotels: MOCK_HOTELS_DATA
              }
            };
            setMessages((prev) => [...prev, aiReply]);
          } else {
            const aiReply: DataMessage = {
              id: 'ai_' + Date.now(),
              sender: 'ai',
              type: 'text',
              text: '可以提供具体的出差拜访地点，我会为您推荐附近的酒店',
              quickChips: ['北京市国贸地区', '望京SOHO商务区', '中关村科技园']
            };
            setMessages((prev) => [...prev, aiReply]);
          }
        }, 500);
        return;
      }

      // 3. Unreimbursed Invoices / Receipts Intent
      if (q.includes('未报销') || q.includes('发票') || q.includes('报销单') || q.includes('报销')) {
        setTimeout(() => {
          const aiReply: DataMessage = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            type: 'travel_unreimbursed',
            text: '已为您查询未报销单据发票明细，请确认：',
            unreimbursedData: {
              items: MOCK_UNREIMBURSED_ITEMS
            }
          };
          setMessages((prev) => [...prev, aiReply]);
        }, 500);
        return;
      }

      // 4. Transportation comparison
      if (q.includes('机票') || q.includes('航班') || q.includes('火车') || q.includes('高铁') || q.includes('交通') || q.includes('比价')) {
        setTimeout(() => {
          const aiReply: DataMessage = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            type: 'travel_transport',
            text: '已为您智能比价广州到北京的差旅交通班次：',
            transportData: {
              date: '2025-07-07',
              from: '广州',
              to: '北京',
              preference: '6:00-8:00、南方航空、空客321(中)'
            }
          };
          setMessages((prev) => [...prev, aiReply]);
        }, 500);
        return;
      }
    }

    // Handle AI+员工服务 specific structured cards (请假 & 加班申请)
    if (isEmployee) {
      const q = queryText.toLowerCase();

      // 1. Leave application intent
      if (q.includes('请假') || q.includes('休假') || q.includes('事假') || q.includes('病假') || q.includes('年假') || q.includes('家中有事')) {
        setTimeout(() => {
          const leaveApp: LeaveApplicationData = {
            applicant: '张三',
            positionInfo: '张三/集团总部/人力资源部/招聘专员',
            leaveType: q.includes('年假') ? '年假' : (q.includes('病假') ? '病假' : '事假'),
            startTime: '2025-07-07 08:30',
            endTime: '2025-07-09 17:30',
            startDate: '2025-07-07',
            startTimeSlot: '08:30',
            endDate: '2025-07-09',
            endTimeSlot: '17:30',
            reason: queryText.includes('家中有事') ? '家中有事' : (queryText.includes('请假') ? queryText : '家中有事处理'),
            isSubmitted: false
          };

          const aiReply: DataMessage = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            type: 'leave_application',
            text: '已为您预生成出差申请单，请确认',
            leaveApp: leaveApp
          };
          setMessages((prev) => [...prev, aiReply]);
        }, 500);
        return;
      }

      // 2. Overtime application intent
      if (q.includes('加班') || q.includes('加点')) {
        setTimeout(() => {
          const isJiaDian = q.includes('小时') || q.includes('加点') || q.includes('晚上') || q.includes('18:00');
          const overtimeApp: OvertimeApplicationData = {
            applicant: '李倩倩',
            overtimeType: isJiaDian ? '加点' : '加整班',
            overtimeDate: '2025-08-13',
            startTime: isJiaDian ? '18:00' : undefined,
            endTime: isJiaDian ? '21:30' : undefined,
            durationText: isJiaDian ? '3小时30分钟' : '1天',
            overtimeProject: '工作日加班',
            positionInfo: '集团总部/人力资源部/招聘专员',
            hasRest: false,
            transferToCompOff: false,
            reason: queryText.includes('线上会议') ? '与客户线上会议' : (queryText.includes('线下会议') ? '与客户线下会议' : (queryText.includes('客户') ? '与客户会议' : '工作日紧急项目会议')),
            attachments: isJiaDian ? [{ id: 'att-1', name: '其他资料原因.pdf', size: '154.12KB' }] : undefined,
            isSubmitted: false
          };

          const aiReply: DataMessage = {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            type: 'overtime_application',
            text: '已为您预生成加班申请单，请确认',
            overtimeApp: overtimeApp
          };
          setMessages((prev) => [...prev, aiReply]);
        }, 500);
        return;
      }
    }

    // Determine default citations if arbitrary user query
    const defaultCitations: KnowledgeCitation[] = matched?.citations || [
      {
        id: 'kb-default-1',
        name: `《${agent.name}相关知识库与规范指引》.doc`,
        type: 'doc',
        size: '420KB',
        date: '2025-01-10',
        sourceChapter: '核心规程与问答规范 第一章',
        matchScore: '98.2%',
        excerpt: `针对您咨询的“${queryText}”，已在知识库中匹配到相对应的业务规定与知识条目，并完成智能精炼。`,
        contextSnippet: `【核心规程与问答规范】\n针对 ${queryText} 的业务逻辑、操作规范及制度依据已完成全量校验与归档。`
      }
    ];

    setTimeout(() => {
      const aiReply: DataMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        type: matched?.chartType ? 'chart_report' : 'report_analysis',
        title: matched?.responseTitle || `${agent.name} 智能分析回复`,
        text: matched?.responseText || `【${agent.name}】已针对您的提问“${queryText}”进行深度思考与多维分析计算，生成如下专业结果：\n\n📌 **核心结论与指引**：\n已依据相关规章与中台数据完成综合推演，各项指标与合规标准校验完毕。如需进一步下钻分析或调整文案，请继续输入指令。`,
        sections: matched?.sections,
        citations: defaultCitations
      };
      if (matched?.chartType) {
        setChartType(matched.chartType);
      }
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  if (activeSubView === 'travelRecords') {
    return (
      <TravelRecordsPage
        records={travelRecords}
        onBack={() => setActiveSubView('chat')}
      />
    );
  }

  if (activeSubView === 'skillTree') {
    return (
      <SkillTreePage
        onBack={() => setActiveSubView('chat')}
        onSelectQuestion={(question) => {
          setActiveSubView('chat');
          handleSendQuery(question);
        }}
      />
    );
  }

  if (activeSubView === 'scheduleShare') {
    return (
      <ScheduleShareManagement
        onBack={() => setActiveSubView('chat')}
      />
    );
  }

  return (
    <div
      className="flex flex-col h-full bg-cover bg-top bg-no-repeat relative overflow-hidden select-none animate-fade-in font-sans"
      style={{
        backgroundImage: `url('/agent-bg.svg'), linear-gradient(180deg, #edf4fe 0%, #f6f8fd 40%, #ffffff 100%)`
      }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[12px] px-3.5 py-1.5 rounded-full shadow-lg z-50 animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Top Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between z-20 relative">
        <button
          onClick={messages.length > 0 ? () => setMessages([]) : onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">{agent.name}</h1>

        <button
          onClick={() => {
            setMessages([]);
            showToast('已开启全新会话');
          }}
          className="system-plus-button"
          title="新增对话"
        >
          <Plus />
        </button>
      </div>

      {/* Main Body Area: 1:1 Initial State vs Conversation Stream */}
      {messages.length === 0 ? (
        /* ================= 1:1 REPLICATED INITIAL STATE ================= */
        <div className="flex-1 flex flex-col items-center justify-between px-4 pt-2 pb-24 overflow-y-auto">
          {/* Top Robot Avatar & Greeting */}
          <div className="flex flex-col items-center text-center mt-2 space-y-2">
            {/* Glowing Avatar Container */}
            <div ref={avatarRef} className="relative group cursor-pointer" onClick={handleNextCard}>
              {/* Soft Pink/Purple Outer Aura */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-pink-400/30 via-purple-400/20 to-sky-400/30 rounded-full blur-lg animate-pulse" />

              {/* Avatar Head Capsule */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-white via-[#f3e8ff]/60 to-[#e0e7ff] p-1.5 shadow-md border border-white flex items-center justify-center">
                {/* Robot Face Graphic */}
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800 shadow-inner">
                  {/* Subtle Faceplate Reflection */}
                  <div className="absolute -top-3 left-0 right-0 h-6 bg-white/15 rounded-full blur-2xs pointer-events-none" />

                  {/* Antenna Ears */}
                  <div className="absolute top-1 flex justify-between w-12 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
                  </div>

                  {/* Eyes tracking mouse */}
                  <div
                    className="flex items-center gap-3 mt-1.5 transition-transform duration-75 ease-out"
                    style={{
                      transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`
                    }}
                  >
                    <div className="w-3.5 h-4 bg-amber-300 rounded-full shadow-[0_0_10px_#f59e0b] flex items-center justify-center relative overflow-hidden">
                      <div
                        className="w-1.5 h-1.5 bg-white rounded-full transition-transform duration-75"
                        style={{
                          transform: `translate(${eyeOffset.x * 0.3}px, ${eyeOffset.y * 0.3}px)`
                        }}
                      />
                    </div>
                    <div className="w-3.5 h-4 bg-amber-300 rounded-full shadow-[0_0_10px_#f59e0b] flex items-center justify-center relative overflow-hidden">
                      <div
                        className="w-1.5 h-1.5 bg-white rounded-full transition-transform duration-75"
                        style={{
                          transform: `translate(${eyeOffset.x * 0.3}px, ${eyeOffset.y * 0.3}px)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Cheek Blush */}
                  <div
                    className="flex items-center justify-between w-10 px-0.5 mt-1 opacity-70 transition-transform duration-75 ease-out"
                    style={{
                      transform: `translate(${eyeOffset.x * 0.35}px, ${eyeOffset.y * 0.35}px)`
                    }}
                  >
                    <span className="w-1.5 h-1 rounded-full bg-rose-400/80 blur-3xs" />
                    <span className="w-1.5 h-1 rounded-full bg-rose-400/80 blur-3xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Greeting Headline */}
            <div className="pt-1">
              <h2 className="text-[21px] font-bold text-slate-900 tracking-tight">
                "{getGreeting()}"
              </h2>
              <p className="text-[12px] text-slate-500 font-normal mt-1 tracking-tight">
                {activeSubtitle}
              </p>
            </div>
          </div>

          {/* Stacked Cards Deck Area (Scaled to 90%) */}
          <div className="w-full max-w-[340px] relative my-auto py-4 flex flex-col items-center scale-90 origin-center">
            {/* Background Layer Card 2 */}
            <div className="absolute top-0 w-[84%] h-[180px] bg-white/40 rounded-[24px] border border-white/60 shadow-xs -translate-y-2 pointer-events-none" />
            
            {/* Background Layer Card 1 (Underneath card showing next question during drag) */}
            <div className="absolute top-2 w-[92%] h-[185px] bg-white/85 backdrop-blur-xs rounded-[24px] border border-white/90 shadow-md -translate-y-1 p-5 flex flex-col justify-center overflow-hidden pointer-events-none transition-all">
              <span className="absolute top-2 left-3 text-3xl text-slate-200/90 font-serif leading-none select-none">“</span>
              <span className="absolute bottom-4 right-3 text-3xl text-slate-200/90 font-serif leading-none select-none">”</span>

              <div className="my-auto py-1 text-center px-2">
                <p className="text-[15px] font-semibold text-slate-700/80 leading-snug tracking-tight line-clamp-3">
                  {nextCard?.question}
                </p>
              </div>
            </div>

            {/* Main Front Draggable Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`data-card-${cardIndex}`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -30 || info.velocity.x < -200) {
                    handleNextCard();
                  } else if (info.offset.x > 30 || info.velocity.x > 200) {
                    handlePrevCard();
                  }
                }}
                initial={{ scale: 0.94, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-full bg-white/95 backdrop-blur-md rounded-[26px] p-6 shadow-xl border border-white/90 flex flex-col justify-between min-h-[200px] z-10 touch-pan-y cursor-grab active:cursor-grabbing select-none"
              >
                {/* Decorative Quotes */}
                <span className="absolute top-3 left-4 text-4xl text-slate-200/90 font-serif leading-none select-none pointer-events-none">
                  “
                </span>
                <span className="absolute bottom-12 right-4 text-4xl text-slate-200/90 font-serif leading-none select-none pointer-events-none">
                  ”
                </span>

                {/* Main Question Text */}
                <div className="my-auto py-2 text-center px-3 pointer-events-none">
                  <p className="text-[16px] font-bold text-slate-800 leading-snug tracking-tight">
                    {currentCard.question}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextCard();
                    }}
                    className="text-[12px] text-slate-400 hover:text-slate-600 flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <RefreshCw className="w-3.5 h-3.5 stroke-[2]" />
                    换一换
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendQuery(currentCard.question);
                    }}
                    className="bg-[#0f172a] hover:bg-slate-800 text-white rounded-full px-4 py-2 flex items-center gap-1.5 text-[13px] font-medium shadow-md active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>问一问</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Drag Hint */}
            <p className="text-[10px] text-slate-400/80 mt-2.5 flex items-center gap-1 font-normal pointer-events-none">
              <span>← 左右滑动卡片可进行切换 →</span>
            </p>
          </div>
        </div>
      ) : (
        /* ================= CONVERSATION LOG STREAM ================= */
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex flex-col items-end space-y-1.5 animate-fade-in">
                  {msg.attachedDocs && msg.attachedDocs.length > 0 && (
                    <div className="flex items-center gap-1.5 justify-end flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-[11px] shadow-2xs">
                        <span className="w-4 h-4 rounded bg-red-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">PDF</span>
                        <span className="font-medium max-w-[140px] truncate">{msg.attachedDocs[0].name}</span>
                        <span className="text-slate-400">{msg.attachedDocs[0].size}</span>
                      </div>
                      {msg.attachedDocs.length > 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          +{msg.attachedDocs.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="bg-[#0070f3] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-[14px] font-medium shadow-2xs max-w-[85%]">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // AI Response Cards
            return (
              <div key={msg.id} className="space-y-3 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-3">
                  {/* For Smart Writing Articles: show intro text + interactive document card + followup text */}
                  {msg.article ? (
                    <div className="space-y-3">
                      {msg.article.introText && (
                        <p className="text-[13px] text-slate-700 leading-relaxed">
                          {msg.article.introText}
                        </p>
                      )}

                      {/* Interactive Document Card (Click to open editable document reader) */}
                      <div
                        onClick={() => setActiveArticleModal(msg.article!)}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#F5F8FF] to-[#FAF5FF] border border-blue-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group active:scale-99"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                            <FileEdit className="w-5 h-5 stroke-[2]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[14px] font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors truncate">
                              {msg.article.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {msg.article.createTime || '创建时间 13:32'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                            点击编辑 / 查看
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white text-slate-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {msg.article.followupText && (
                        <p className="text-[13px] text-slate-700 leading-relaxed">
                          {msg.article.followupText}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {msg.title && (
                        <h3 className="text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-2">
                          {msg.title}
                        </h3>
                      )}

                      {msg.text && (
                        <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </p>
                      )}
                    </>
                  )}

                  {/* Render Sections if present */}
                  {msg.sections && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      {msg.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="bg-slate-50/80 rounded-xl p-3 space-y-1">
                          <h4 className="text-[13px] font-bold text-slate-800">{sec.title}</h4>
                          {Array.isArray(sec.content) ? (
                            <ul className="list-disc list-inside text-[12px] text-slate-600 space-y-0.5">
                              {sec.content.map((item, iIdx) => (
                                <li key={iIdx}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[12px] text-slate-600 leading-relaxed">{sec.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* For AI+财务自动差旅: Travel Application Card */}
                  {msg.travelApp && (
                    <TravelApplicationCard
                      data={msg.travelApp}
                      onConfirm={() => setEditingTravelApp(msg.travelApp!)}
                    />
                  )}

                  {/* For AI+员工服务: Leave Application Card (Image 2) */}
                  {msg.leaveApp && (
                    <LeaveApplicationCard
                      data={msg.leaveApp}
                      onEdit={() => setEditingLeaveApp(msg.leaveApp!)}
                      onSubmit={() => handleSubmitLeaveApp(msg.id, msg.leaveApp!)}
                    />
                  )}

                  {/* For AI+员工服务: Overtime Application Card (Image 4 & 6) */}
                  {msg.overtimeApp && (
                    <OvertimeApplicationCard
                      data={msg.overtimeApp}
                      onEdit={() => setEditingOvertimeApp(msg.overtimeApp!)}
                      onSubmit={() => handleSubmitOvertimeApp(msg.id, msg.overtimeApp!)}
                    />
                  )}

                  {/* For AI+财务自动差旅: Transport Recommendations */}
                  {msg.transportData && (
                    <TravelTransportCard
                      date={msg.transportData.date}
                      from={msg.transportData.from}
                      to={msg.transportData.to}
                      preference={msg.transportData.preference}
                      onViewFlights={() => showToast('已为您检索到南方航空 CZ3101 等符合差标航班')}
                      onViewTrains={() => showToast('已为您检索到 G334 次高铁二等座')}
                    />
                  )}

                  {/* For AI+财务自动差旅: Hotel Recommendations */}
                  {msg.hotelRecommendData && (
                    <TravelHotelRecommendCard
                      destination={msg.hotelRecommendData.destination}
                      checkIn={msg.hotelRecommendData.checkIn}
                      checkOut={msg.hotelRecommendData.checkOut}
                      durationText={msg.hotelRecommendData.durationText}
                      roomText={msg.hotelRecommendData.roomText}
                      preference={msg.hotelRecommendData.preference}
                      onViewHotels={() => handleSendQuery('北京市国贸地区')}
                    />
                  )}

                  {/* For AI+财务自动差旅: Hotel List Details */}
                  {msg.hotelListData && (
                    <HotelListCard
                      locationTitle={msg.hotelListData.locationTitle}
                      dateRangeText={msg.hotelListData.dateRangeText}
                      hotels={msg.hotelListData.hotels}
                      onBookHotel={(hotel) => showToast(`已为您锁定 ${hotel.name} 企业协议价房间（免垫资）`)}
                    />
                  )}

                  {/* For AI+财务自动差旅: Unreimbursed Invoices */}
                  {msg.unreimbursedData && (
                    <UnreimbursedInvoicesCard
                      items={msg.unreimbursedData.items}
                      onReimburse={(item) => showToast(`单据 ${item.code} 已提交财务共享中心报销审核`)}
                      onViewMore={() => setActiveSubView('travelRecords')}
                    />
                  )}

                  {/* Quick Action Suggestion Chips */}
                  {msg.quickChips && msg.quickChips.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {msg.quickChips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSendQuery(chip)}
                          className="px-3 py-1.5 rounded-full bg-blue-50/80 hover:bg-blue-100/90 text-blue-600 border border-blue-200/80 text-[12px] font-medium transition-all active:scale-95 flex items-center gap-1 shadow-2xs"
                        >
                          <span>{chip}</span>
                          <ChevronRight className="w-3 h-3 text-blue-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Visualization Chart Card if type === chart_report */}
                  {msg.type === 'chart_report' && (
                    <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50/50 space-y-3">
                      {/* Chart Toolbar */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setChartType('line')}
                            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                              chartType === 'line'
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="折线图"
                          >
                            <LineChart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setChartType('bar')}
                            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                              chartType === 'bar'
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="柱状图"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setChartType('horizontal')}
                            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                              chartType === 'horizontal'
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="条形图"
                          >
                            <BarChart2 className="w-4 h-4 rotate-90" />
                          </button>
                          <button
                            onClick={() => setChartType('pie')}
                            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                              chartType === 'pie'
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="饼图"
                          >
                            <PieChart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setChartType('table')}
                            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                              chartType === 'table'
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                            title="表格"
                          >
                            <Table className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => showToast('已放大至全屏视图')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          title="全屏"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Chart Legend */}
                      <div className="flex items-center justify-start gap-4 text-[11px] text-slate-600 pt-1">
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#0070f3]" />
                          <span>总收入</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#f59e0b]" />
                          <span>利润增长</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-xs bg-[#14b8a6]" />
                          <span>利润率</span>
                        </div>
                      </div>

                      {/* Chart Visual Graphic Area */}
                      <div className="pt-2">
                        {chartType === 'bar' && (
                          <div className="h-44 relative flex items-end justify-between px-2 pt-4 border-b border-l border-slate-200">
                            {/* Y Axis scale ticks */}
                            <div className="absolute top-0 left-0 text-[9px] text-slate-400">
                              亿元 8
                            </div>
                            <div className="absolute top-1/4 left-0 -ml-1 text-[9px] text-slate-400">
                              6
                            </div>
                            <div className="absolute top-2/4 left-0 -ml-1 text-[9px] text-slate-400">
                              4
                            </div>
                            <div className="absolute top-3/4 left-0 -ml-1 text-[9px] text-slate-400">
                              2
                            </div>
                            <div className="absolute bottom-0 left-0 -ml-1 text-[9px] text-slate-400">
                              0
                            </div>

                            {/* Columns 1月 .. 4月 */}
                            {[
                              { month: '1月', b1: '20%', b2: '45%', b3: '38%' },
                              { month: '2月', b1: '40%', b2: '85%', b3: '78%' },
                              { month: '3月', b1: '25%', b2: '58%', b3: '45%' },
                              { month: '4月', b1: '22%', b2: '45%', b3: '40%' }
                            ].map((col) => (
                              <div
                                key={col.month}
                                className="flex flex-col items-center gap-1 flex-1 h-full justify-end"
                              >
                                <div className="flex items-end gap-1 h-full pt-4">
                                  <div
                                    style={{ height: col.b1 }}
                                    className="w-2.5 bg-[#0070f3] rounded-t-xs transition-all duration-300"
                                  />
                                  <div
                                    style={{ height: col.b2 }}
                                    className="w-2.5 bg-[#f59e0b] rounded-t-xs transition-all duration-300"
                                  />
                                  <div
                                    style={{ height: col.b3 }}
                                    className="w-2.5 bg-[#14b8a6] rounded-t-xs transition-all duration-300"
                                  />
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {col.month}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {chartType === 'line' && (
                          <div className="h-44 p-2 relative flex flex-col justify-center">
                            <svg className="w-full h-32 overflow-visible">
                              <polyline
                                fill="none"
                                stroke="#0070f3"
                                strokeWidth="2.5"
                                points="20,80 80,40 140,65 200,75"
                              />
                              <polyline
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2.5"
                                points="20,60 80,15 140,35 200,50"
                              />
                              <polyline
                                fill="none"
                                stroke="#14b8a6"
                                strokeWidth="2.5"
                                points="20,70 80,25 140,50 200,60"
                              />
                            </svg>
                            <div className="flex justify-between px-3 text-[10px] text-slate-500 pt-1">
                              <span>1月</span>
                              <span>2月</span>
                              <span>3月</span>
                              <span>4月</span>
                            </div>
                          </div>
                        )}

                        {chartType === 'table' && (
                          <div className="overflow-x-auto text-[11px]">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-100 text-slate-600 text-left">
                                  <th className="p-1.5 font-semibold">月份</th>
                                  <th className="p-1.5 font-semibold">总收入</th>
                                  <th className="p-1.5 font-semibold">利润增长</th>
                                  <th className="p-1.5 font-semibold">利润率</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr>
                                  <td className="p-1.5 font-medium text-slate-800">1月</td>
                                  <td className="p-1.5 text-slate-600">2.1 亿元</td>
                                  <td className="p-1.5 text-emerald-600 font-medium">+12.4%</td>
                                  <td className="p-1.5 text-slate-600">18.5%</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5 font-medium text-slate-800">2月</td>
                                  <td className="p-1.5 text-slate-600">3.4 亿元</td>
                                  <td className="p-1.5 text-emerald-600 font-medium">+28.6%</td>
                                  <td className="p-1.5 text-slate-600">24.2%</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5 font-medium text-slate-800">3月</td>
                                  <td className="p-1.5 text-slate-600">2.6 亿元</td>
                                  <td className="p-1.5 text-emerald-600 font-medium">+15.1%</td>
                                  <td className="p-1.5 text-slate-600">21.0%</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5 font-medium text-slate-800">4月</td>
                                  <td className="p-1.5 text-slate-600">2.3 亿元</td>
                                  <td className="p-1.5 text-emerald-600 font-medium">+8.2%</td>
                                  <td className="p-1.5 text-slate-600">19.4%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        {chartType === 'horizontal' && (
                          <div className="space-y-2 py-2">
                            {[
                              { label: '税收收入 (85%)', val: 85, color: 'bg-[#0070f3]' },
                              { label: '非税收入 (15%)', val: 15, color: 'bg-[#f59e0b]' },
                              { label: '专项转移支付 (40%)', val: 40, color: 'bg-[#14b8a6]' }
                            ].map((item) => (
                              <div key={item.label} className="space-y-1">
                                <div className="flex justify-between text-[11px] text-slate-600">
                                  <span>{item.label}</span>
                                  <span>{item.val}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    style={{ width: `${item.val}%` }}
                                    className={`h-full ${item.color} rounded-full`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {chartType === 'pie' && (
                          <div className="flex items-center justify-center py-2">
                            <div className="w-28 h-28 rounded-full border-8 border-[#0070f3] border-t-[#f59e0b] border-r-[#14b8a6] flex items-center justify-center text-center">
                              <span className="text-[11px] font-bold text-slate-700">收入构成</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Citations / Knowledge Base Excerpt Reference Block (Image 3) */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100/90 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-medium text-[#465467]">
                          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                          <span>引用的知识库</span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                            {msg.citations.length}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCollapsedCitations((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id]
                            }));
                          }}
                          className="flex items-center gap-0.5 text-slate-400 hover:text-slate-600 transition-colors text-[11px]"
                        >
                          <span>{collapsedCitations[msg.id] ? '展开' : '收起'}</span>
                          {collapsedCitations[msg.id] ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronUp className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {!collapsedCitations[msg.id] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.citations.map((cite, idx) => (
                            <div
                              key={cite.id || idx}
                              onClick={() => setSelectedCitation(cite)}
                              className="group flex items-center justify-between p-2 rounded-lg bg-slate-50/90 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 cursor-pointer transition-all active:scale-[0.99]"
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <div
                                  className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                                    cite.type === 'pdf'
                                      ? 'bg-red-50 text-red-600 border border-red-200/60'
                                      : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                                  }`}
                                >
                                  {cite.type === 'pdf' ? 'PDF' : 'W'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[12px] text-slate-700 font-medium truncate group-hover:text-blue-600 transition-colors">
                                    {cite.name}
                                  </p>
                                  {cite.sourceChapter && (
                                    <p className="text-[10px] text-slate-400 truncate">
                                      {cite.sourceChapter}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 flex-shrink-0">
                                {cite.matchScore && (
                                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-medium">
                                    {cite.matchScore}
                                  </span>
                                )}
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Response Card Actions Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const isCurrentSpeaking = isSpeakingMsgId === msg.id;
                          if (isCurrentSpeaking) {
                            window.speechSynthesis?.cancel();
                            setIsSpeakingMsgId(null);
                          } else {
                            window.speechSynthesis?.cancel();
                            const utter = new SpeechSynthesisUtterance(msg.text || msg.title || '');
                            utter.lang = 'zh-CN';
                            utter.onend = () => setIsSpeakingMsgId(null);
                            window.speechSynthesis?.speak(utter);
                            setIsSpeakingMsgId(msg.id);
                          }
                        }}
                        className="hover:text-blue-600 transition-colors p-1"
                        title={isSpeakingMsgId === msg.id ? '停止朗读' : '语音朗读'}
                      >
                        {isSpeakingMsgId === msg.id ? (
                          <VolumeX className="w-4 h-4 text-blue-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text || '');
                          showToast('内容已复制到剪贴板');
                        }}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="复制"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => showToast('报表已导出为 Excel/PDF')}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="下载报表"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          showToast('正在重新多维计算与检索...');
                          setTimeout(() => showToast('数据已更新至最新版本'), 1000);
                        }}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="重新生成"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveSubView('scheduleShare')}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="定时分享 / 管理"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setLikedMsgs((prev) => ({
                            ...prev,
                            [msg.id]: prev[msg.id] === 'like' ? undefined! : 'like'
                          }));
                          showToast('感谢您的正面反馈！');
                        }}
                        className={`p-1 transition-colors ${
                          likedMsgs[msg.id] === 'like' ? 'text-blue-600' : 'hover:text-blue-600'
                        }`}
                        title="点赞"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setLikedMsgs((prev) => ({
                            ...prev,
                            [msg.id]: prev[msg.id] === 'dislike' ? undefined! : 'dislike'
                          }));
                          showToast('已记录您的反馈，将持续优化模型回答');
                        }}
                        className={`p-1 transition-colors ${
                          likedMsgs[msg.id] === 'dislike' ? 'text-rose-500' : 'hover:text-rose-500'
                        }`}
                        title="踩"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Control & Input Bar (Exact match to Image 1: Pure White Background, No top border line) */}
      <div className="bg-white p-3 space-y-2 z-20">
        {/* Pills Row with #465467 text and icon color */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[12px]">
          {/* For 智能摘要: ONLY ONE 摘要类型 button */}
          {agent.name === '智能摘要' ? (
            <button
              type="button"
              onClick={() => setIsSummaryTypeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-[#465467]" />
              <span className="text-[#465467]">摘要类型</span>
              <ChevronDown className="w-3 h-3 text-[#465467]" />
            </button>
          ) : (
            <>
              {/* 1. 深度思考 Toggle (For other agents) */}
              <button
                type="button"
                onClick={() => setIsThinking(!isThinking)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all border text-[#465467] ${
                  isThinking
                    ? 'bg-white border-blue-200/90 shadow-2xs'
                    : 'bg-white/80 border-slate-200/80'
                }`}
              >
                <Atom className="w-3.5 h-3.5 text-[#465467] stroke-[2.2]" />
                <span className="text-[#465467]">深度思考</span>
                {isThinking && <Check className="w-3 h-3 text-[#465467] stroke-[3]" />}
              </button>

              {/* Agent-specific button row */}
              {agent.name === 'AI+员工服务' ? (
                <>
                  {/* 2. 请休假 */}
                  <button
                    type="button"
                    onClick={() => handleSendQuery('明天家中有事请假2天')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">请休假</span>
                  </button>

                  {/* 3. 加班申请 */}
                  <button
                    type="button"
                    onClick={() => handleSendQuery('我要申请加班1天，与客户线下会议')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">加班申请</span>
                  </button>
                </>
              ) : agent.name === 'AI+财务自动差旅' ? (
                <>
                  {/* 2. 财务模版 */}
                  <button
                    type="button"
                    onClick={() => setIsFinancialTemplateOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">财务模版</span>
                  </button>

                  {/* 3. 单据记录 */}
                  <button
                    type="button"
                    onClick={() => setActiveSubView('travelRecords')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    <Folder className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">单据记录</span>
                  </button>

                  {/* 4. 未报销单 */}
                  <button
                    type="button"
                    onClick={() => handleSendQuery('我还有哪些发票没有报销')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    <Receipt className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">未报销单</span>
                  </button>
                </>
              ) : agent.name === '智能问答' ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsWebSearch(!isWebSearch);
                    showToast(!isWebSearch ? '已开启联网实时搜索' : '已关闭联网搜索');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all border text-[#465467] ${
                    isWebSearch
                      ? 'bg-white border-blue-200/90 shadow-2xs'
                      : 'bg-white/80 border-slate-200/80'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#465467] stroke-[2.2]" />
                  <span className="text-[#465467]">联网搜索</span>
                  {isWebSearch && <Check className="w-3 h-3 text-[#465467] stroke-[3]" />}
                </button>
              ) : agent.name === '智能写作' ? (
                <>
                  {/* 2. 知识库 (was 分享管理) */}
                  <button
                    type="button"
                    onClick={() => setIsWritingKbOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
                  >
                    <Folder className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">知识库</span>
                    {selectedWritingDocs.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </button>

                  {/* 3. 写作模版 (was 技能树) */}
                  <button
                    type="button"
                    onClick={() => setIsWritingTemplateOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">写作模版</span>
                    <ChevronDown className="w-3 h-3 text-[#465467]" />
                  </button>
                </>
              ) : (
                <>
                  {/* 2. 分享管理 (for other agents) */}
                  <button
                    type="button"
                    onClick={() => setActiveSubView('scheduleShare')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
                  >
                    <Users className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">分享管理</span>
                  </button>

                  {/* 3. 技能树 (for other agents) */}
                  <button
                    type="button"
                    onClick={() => setActiveSubView('skillTree')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5 text-[#465467]" />
                    <span className="text-[#465467]">技能树</span>
                    <ChevronDown className="w-3 h-3 text-[#465467]" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputText);
          }}
          className="bg-white rounded-full px-3.5 py-2 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-2.5 focus-within:border-slate-300 focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all"
        >
          {/* 1. Left Camera Icon */}
          <button
            type="button"
            onClick={() => showToast('已调起相机拍照 / 相册')}
            className="w-7 h-7 flex items-center justify-center text-[#465467] hover:text-blue-600 active:scale-95 transition-all flex-shrink-0"
            title="拍照 / 相册"
          >
            <Camera className="w-[21px] h-[21px] stroke-[1.9]" />
          </button>

          {/* 2. Middle Input Field with placeholder "发消息或按住说话..." */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="发消息或按住说话..."
            className="flex-1 bg-transparent text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none leading-normal min-w-0"
          />

          {/* 3. Voice Wave / Audio Button (Image 2: Click to trigger VoiceListeningModal in Image 3) */}
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#465467] hover:text-blue-600 hover:bg-blue-50/60 active:scale-95 transition-all flex-shrink-0"
            title="语音输入"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[23px] h-[23px] fill-none stroke-current stroke-[1.8]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="8.5" cy="12" r="1" fill="currentColor" />
              <path d="M12.5 8.5a5 5 0 0 1 0 7" />
              <path d="M15.5 6a8.5 8.5 0 0 1 0 12" />
            </svg>
          </button>

          {/* 4. Right Plus / Send Action Button */}
          {inputText.trim() ? (
            <button
              type="submit"
              className="w-7 h-7 rounded-full bg-[#0070f3] text-white flex items-center justify-center active:scale-95 transition-all shadow-xs flex-shrink-0"
              title="发送"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => showToast('更多扩展功能：照片、文件、数据源')}
              className="w-7 h-7 flex items-center justify-center text-[#465467] hover:text-blue-600 active:scale-95 transition-all flex-shrink-0"
              title="更多功能"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-[23px] h-[23px] fill-none stroke-current stroke-[1.8]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="7.5" x2="12" y2="16.5" />
                <line x1="7.5" y1="12" x2="16.5" y2="12" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Voice Listening Modal (Image 3: "云一朵正在听，请说话") */}
      <VoiceListeningModal
        isOpen={isVoiceModalOpen}
        agentName="云一朵"
        onClose={() => setIsVoiceModalOpen(false)}
        onSend={(voiceText) => {
          setIsVoiceModalOpen(false);
          handleSendQuery(voiceText);
        }}
      />

      {/* Citation Excerpt Preview Modal (点击文档查看回答内容的摘取内容) */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    selectedCitation.type === 'pdf'
                      ? 'bg-red-50 text-red-600 border border-red-200/80'
                      : 'bg-blue-50 text-blue-600 border border-blue-200/80'
                  }`}
                >
                  {selectedCitation.type === 'pdf' ? 'PDF' : 'DOC'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    {selectedCitation.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    知识库来源溯源文档
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCitation(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600">
              {/* Meta Tags Row */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedCitation.matchScore && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200/60">
                    匹配置信度 {selectedCitation.matchScore}
                  </span>
                )}
                {selectedCitation.date && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                    更新于 {selectedCitation.date}
                  </span>
                )}
                {selectedCitation.size && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                    文件大小 {selectedCitation.size}
                  </span>
                )}
              </div>

              {/* Source Chapter */}
              {selectedCitation.sourceChapter && (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  <div className="text-[11px] text-slate-400 mb-0.5">引用章节定位</div>
                  <div className="font-semibold text-slate-800 text-[12px]">
                    {selectedCitation.sourceChapter}
                  </div>
                </div>
              )}

              {/* Excerpt Section */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[13px]">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  <span>回答摘取内容</span>
                </div>
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-slate-800 text-[13px] leading-relaxed shadow-2xs">
                  {selectedCitation.excerpt}
                </div>
              </div>

              {/* Context in Knowledge Base */}
              {selectedCitation.contextSnippet && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[12px]">
                    <span>知识库原文上下文片段</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-600 text-[12px] leading-relaxed whitespace-pre-line font-mono bg-opacity-75">
                    {selectedCitation.contextSnippet}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `【${selectedCitation.name}】\n${selectedCitation.excerpt}`
                  );
                  showToast('已复制摘取内容');
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>复制摘录</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0070f3] text-white font-medium hover:bg-blue-600 active:scale-95 transition-all shadow-xs"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 智能写作: 写作模版 Drawer (Image 4 & 5) */}
      <WritingTemplateDrawer
        isOpen={isWritingTemplateOpen}
        onClose={() => setIsWritingTemplateOpen(false)}
        isThinking={isThinking}
        onToggleThinking={() => setIsThinking(!isThinking)}
        onOpenKnowledgeBase={() => setIsWritingKbOpen(true)}
        onSelectAndSend={(_template, customText) => {
          handleSendQuery(customText);
        }}
      />

      {/* 智能写作: 知识库 Selector Modal (Image 5) */}
      <WritingKnowledgeBaseSelector
        isOpen={isWritingKbOpen}
        onClose={() => setIsWritingKbOpen(false)}
        onConfirm={(docs) => {
          setSelectedWritingDocs(docs);
          showToast(`已成功引用 ${docs.length} 份知识库文档`);
        }}
      />

      {/* 智能写作: 生成文章阅读与全功能编辑 Modal (Image 7 & 8) */}
      {activeArticleModal && (
        <DocumentReaderAndEditorModal
          isOpen={!!activeArticleModal}
          onClose={() => setActiveArticleModal(null)}
          article={activeArticleModal}
          onSaveArticle={handleSaveArticle}
        />
      )}

      {/* AI+财务自动差旅: 财务模版 Drawer */}
      <FinancialTemplatesDrawer
        isOpen={isFinancialTemplateOpen}
        onClose={() => setIsFinancialTemplateOpen(false)}
        onSelectTemplate={(template: FinancialTemplateItem) => {
          setIsFinancialTemplateOpen(false);
          handleSendQuery(template.defaultPrompt);
        }}
      />

      {/* AI+财务自动差旅: 出差申请单确认 2步流程弹窗 (Match Screenshots 1 & 2) */}
      {editingTravelApp && (
        <TravelApplicationConfirmModal
          isOpen={!!editingTravelApp}
          initialData={editingTravelApp}
          onClose={() => setEditingTravelApp(null)}
          onConfirm={(updatedData: TravelApplicationData) => {
            const targetMsg = messages.find(m => m.travelApp && !m.travelApp.isSubmitted) || messages.find(m => m.travelApp);
            const msgId = targetMsg?.id || ('ai_' + Date.now());

            setMessages((prev) =>
              prev.map((m) =>
                m.travelApp ? { ...m, travelApp: updatedData } : m
              )
            );
            setEditingTravelApp(null);
            handleSubmitTravelApp(msgId, updatedData);
          }}
        />
      )}

      {/* AI+员工服务: 请假申请单编辑弹窗 (Match Image 3) */}
      {editingLeaveApp && (
        <LeaveApplicationModal
          isOpen={!!editingLeaveApp}
          initialData={editingLeaveApp}
          onClose={() => setEditingLeaveApp(null)}
          onSave={(updatedData) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.leaveApp ? { ...m, leaveApp: updatedData } : m
              )
            );
            setEditingLeaveApp(null);
            showToast('已更新请假申请单');
          }}
        />
      )}

      {/* 智能摘要: 摘要类型选择抽屉 */}
      <SummaryTypeDrawer
        isOpen={isSummaryTypeOpen}
        onClose={() => setIsSummaryTypeOpen(false)}
        onSelectType={(type: SummaryTypeItem) => {
          setIsSummaryTypeOpen(false);
          handleSendQuery(type.defaultPrompt);
        }}
      />

      {/* AI+员工服务: 加班申请单编辑弹窗 (Match Image 5 & 7) */}
      {editingOvertimeApp && (
        <OvertimeApplicationModal
          isOpen={!!editingOvertimeApp}
          initialData={editingOvertimeApp}
          onClose={() => setEditingOvertimeApp(null)}
          onSave={(updatedData) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.overtimeApp ? { ...m, overtimeApp: updatedData } : m
              )
            );
            setEditingOvertimeApp(null);
            showToast('已更新加班申请单');
          }}
        />
      )}
    </div>
  );
};
