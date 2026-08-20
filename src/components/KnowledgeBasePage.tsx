import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Folder,
  Layers,
  ChevronRight,
  Eye,
  FileText,
  Download,
  Share2,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { StatusBar } from './StatusBar';

interface KnowledgeBasePageProps {
  onBack: () => void;
}

type TabCategory = 'group' | 'team' | 'personal';

interface DepartmentItem {
  id: string;
  name: string;
  hasSubFolder?: boolean;
  type: 'department' | 'folder' | 'doc';
  fileCount?: number;
  size?: string;
  children?: DepartmentItem[];
  docs?: KnowledgeDoc[];
}

interface KnowledgeDoc {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'folder' | 'xls';
  size: string;
  date?: string;
  author?: string;
  summary?: string;
  content?: string;
  children?: KnowledgeDoc[];
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('group');
  const [searchQuery, setSearchQuery] = useState('');
  // Breadcrumb navigation stack: [{ title: string, items: any[], docs?: any[] }]
  const [navStack, setNavStack] = useState<Array<{ title: string; type: 'dept_list' | 'folder_view' | 'doc_list'; data?: any }>>([]);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Group Category Data Structure
  const groupDepartments: DepartmentItem[] = [
    {
      id: 'g-cw',
      name: '财务部',
      hasSubFolder: false,
      type: 'department',
      docs: [
        {
          id: 'cw-1',
          title: '关于印发《税务管理办法》.pdf',
          type: 'pdf',
          size: '1.45MB',
          date: '2026-03-12',
          author: '财务部·税控科',
          summary: '本办法规范了集团及各下属公司税务筹划、申报缴纳及风险防范流程，明确了专项增值税发票与企业所得税汇算清缴审核标准。',
          content: `集团税务管理办法（2026年修订版）\n\n第一章 总则\n第一条 为规范广新集团及下属各业务板块的税务管理活动，保障依法纳税与税务合规，特制定本办法。\n第二条 本办法适用于集团总部及全资、控股子公司。\n\n第二章 发票与纳税申报\n第三条 各子公司应严格执行增值税专用发票进项认证抵扣管理。\n第四条 跨部门大额采购及服务合同须附带税务合规审核联。`
        },
        {
          id: 'cw-2',
          title: '2026年度预算编制与费用报销规范.doc',
          type: 'doc',
          size: '2.10MB',
          date: '2026-01-15',
          author: '财务部·预算管理处',
          summary: '2026年度各部门资金预算申报模板与差旅、会务等日常费用报销核算准则。'
        },
        {
          id: 'cw-3',
          title: '集团资金集中管理调度实施细则.pdf',
          type: 'pdf',
          size: '980KB',
          date: '2025-11-20',
          author: '财务部·资金中心'
        }
      ]
    },
    {
      id: 'g-jy',
      name: '经营管理部',
      hasSubFolder: false,
      type: 'department',
      docs: [
        {
          id: 'jy-1',
          title: '综合监督体系建设实施方案.pdf',
          type: 'pdf',
          size: '1.45MB',
          date: '2026-02-18',
          author: '经管部·综合监督办公室',
          summary: '推进大监督格局，实现纪检、审计、法务、财务多维协同与穿透式监管。'
        },
        {
          id: 'jy-2',
          title: '战略规划与季度绩效考核指标表.xls',
          type: 'xls',
          size: '3.40MB',
          date: '2026-03-01'
        }
      ]
    },
    {
      id: 'g-rj',
      name: '软件及通信解决方案部...',
      hasSubFolder: false,
      type: 'department',
      docs: [
        {
          id: 'rj-1',
          title: '通信专网应急指挥调度系统技术白皮书.pdf',
          type: 'pdf',
          size: '5.80MB',
          date: '2026-01-20'
        },
        {
          id: 'rj-2',
          title: '5G融合通信终端接入规范标准.doc',
          type: 'doc',
          size: '1.65MB',
          date: '2025-12-10'
        }
      ]
    },
    {
      id: 'g-zh',
      name: '综合解决方案部',
      hasSubFolder: true,
      type: 'department',
      children: [
        {
          id: 'zh-f1',
          name: '行业解决方案库',
          hasSubFolder: true,
          type: 'folder',
          docs: [
            { id: 'zh-f1-1', title: '智能矿山一体化调度系统方案.pdf', type: 'pdf', size: '12.4MB', date: '2026-02-11' },
            { id: 'zh-f1-2', title: '智慧化工园区安监一张图.pdf', type: 'pdf', size: '8.7MB', date: '2026-01-28' }
          ]
        },
        {
          id: 'zh-f2',
          name: '招投标标准模版',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 'zh-f2-1', title: '技术方案标准应答范例2026.doc', type: 'doc', size: '4.2MB', date: '2026-02-05' }
          ]
        }
      ]
    },
    {
      id: 'g-zl',
      name: '质量管理部',
      hasSubFolder: false,
      type: 'department',
      docs: [
        {
          id: 'zl-1',
          title: 'ISO9001质量管理体系审查自查手册.pdf',
          type: 'pdf',
          size: '2.30MB',
          date: '2025-10-15'
        },
        {
          id: 'zl-2',
          title: '产品出厂合格检验与追溯流程.doc',
          type: 'doc',
          size: '1.15MB',
          date: '2025-11-02'
        }
      ]
    },
    {
      id: 'g-xt',
      name: '系统集成部',
      hasSubFolder: true,
      type: 'department',
      children: [
        {
          id: 'xt-f1',
          name: '通知类资料',
          hasSubFolder: true,
          type: 'folder',
          docs: [
            {
              id: 'xt-dir1',
              title: '文件夹名称',
              type: 'folder',
              size: '123.MB',
              children: [
                { id: 'xt-sub-1', title: '2026第一季度设备采购清单.xls', type: 'xls', size: '1.2MB' },
                { id: 'xt-sub-2', title: '机房配电升级施工安全许可.pdf', type: 'pdf', size: '3.4MB' }
              ]
            },
            {
              id: 'xt-dir2',
              title: '文件夹名称',
              type: 'folder',
              size: '23.MB',
              children: [
                { id: 'xt-sub-3', title: '应急物资调配交接单.doc', type: 'doc', size: '540KB' }
              ]
            },
            {
              id: 'xt-pdf1',
              title: '关于印发《税务管理办法》.pdf',
              type: 'pdf',
              size: '1.45MB',
              date: '2026-02-15',
              author: '集团总部·财务管理部',
              summary: '发文字号：广新财发〔2026〕08号。本办法明确了各项目部及驻外工程队的进项专用发票核销及电子档案留存标准。',
              content: `广新集团文件\n广新财发〔2026〕08号\n\n关于印发《税务管理办法》的通知\n\n各部室、直属各项目组、分公司：\n为进一步加强集团税务合规管理，防范税收征管法律风险，提升企业财税管控效益，经集团领导班子研究同意，现将《广新集团税务管理办法》予以印发，请结合实际遵照执行。\n\n一、加强税务发票合规查验，杜绝虚开冒领。\n二、严格执行跨区域涉税事项预缴。\n三、规范研发费用加计扣除台账。`
            },
            {
              id: 'xt-pdf2',
              title: '综合监督体系建设实施方案..pdf',
              type: 'pdf',
              size: '1.45MB',
              date: '2026-01-20',
              author: '集团监督考核委',
              summary: '落实党风廉政与业务监督全覆盖，建立跨部门线索移交与联席会议制度。'
            },
            {
              id: 'xt-doc1',
              title: '党支部主要工作制度.doc',
              type: 'doc',
              size: '1.45MB',
              date: '2025-12-05',
              author: '集团党群工作部',
              summary: '涵盖三会一课、主题党日、组织生活会、民主评议党员等党建核心制度汇编。',
              content: `党支部主要工作制度汇编\n\n第一章 “三会一课”制度\n第一条 支部党员大会每季度至少召开一次。\n第二条 支部委员会每月至少召开一次。\n第三条 党小组会每月至少召开一次。\n第四条 党课每季度至少安排一次。\n\n第二章 组织生活会制度\n组织生活会一般每半年或一年召开一次，开展批评与自我批评。`
            }
          ]
        },
        {
          id: 'xt-f2',
          name: '工程项目验收标准',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 'xt-f2-1', title: '机房工程及弱电管网验收细则.pdf', type: 'pdf', size: '4.8MB', date: '2026-02-01' }
          ]
        }
      ]
    },
    {
      id: 'g-yf',
      name: '研发部',
      hasSubFolder: true,
      type: 'department',
      children: [
        {
          id: 'yf-yw',
          name: '业务开发',
          hasSubFolder: true,
          type: 'folder',
          docs: [
            {
              id: 'yw-1',
              title: '通知类资料',
              type: 'folder',
              size: '123.MB',
              children: [
                {
                  id: 'yw-1-1',
                  title: '关于印发《税务管理办法》.pdf',
                  type: 'pdf',
                  size: '1.45MB',
                  date: '2026-02-15',
                  author: '集团总部·财务管理部',
                  summary: '集团税务管理办法与各级业务开发团队专项税务发票报销规范。',
                  content: `关于印发《税务管理办法》的通知\n各研发及业务团队：\n请按照最新税控系统要求，对技术开发合同、技术服务合同做好技术合同认定登记，享受研发税收优惠。`
                },
                {
                  id: 'yw-1-2',
                  title: '综合监督体系建设实施方案..pdf',
                  type: 'pdf',
                  size: '1.45MB',
                  date: '2026-01-20',
                  author: '经营管理部'
                },
                {
                  id: 'yw-1-3',
                  title: '党支部主要工作制度.doc',
                  type: 'doc',
                  size: '1.45MB',
                  date: '2025-12-05',
                  author: '党群工作部'
                }
              ]
            },
            {
              id: 'yw-2',
              title: '业务开发代码规范与API网关接入文档.pdf',
              type: 'pdf',
              size: '3.12MB',
              date: '2026-03-01'
            }
          ]
        },
        {
          id: 'yf-sc',
          name: '市场规划部',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 'sc-1', title: '2026-2028年技术产品市场趋势调研报告.pdf', type: 'pdf', size: '6.45MB', date: '2026-02-10' }
          ]
        },
        {
          id: 'yf-cs',
          name: '测试部',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 'cs-1', title: '自动化测试流水线集成与性能压测指南.doc', type: 'doc', size: '2.80MB', date: '2026-01-18' }
          ]
        },
        {
          id: 'yf-pt',
          name: '平台开发',
          hasSubFolder: true,
          type: 'folder',
          docs: [
            { id: 'pt-1', title: '微服务架构底座中间件部署手册.pdf', type: 'pdf', size: '8.20MB', date: '2026-02-22' },
            { id: 'pt-2', title: '统一身份认证SSO接入指南.doc', type: 'doc', size: '1.95MB', date: '2026-02-25' }
          ]
        }
      ]
    }
  ];

  // Team Category Data Structure (Matching screenshot 5.3)
  const teamFolders: DepartmentItem[] = [
    {
      id: 't-yf',
      name: '研发团队',
      hasSubFolder: true,
      type: 'department',
      children: [
        {
          id: 't-yf-1',
          name: '架构设计与组件规范',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 'ty-1', title: '前端微模块设计指导手册.pdf', type: 'pdf', size: '2.8MB', date: '2026-02-12' },
            { id: 'ty-2', title: '服务端高并发容灾演练记录.doc', type: 'doc', size: '1.6MB', date: '2026-01-10' }
          ]
        },
        {
          id: 't-yf-2',
          name: '通知类资料',
          hasSubFolder: true,
          type: 'folder',
          docs: [
            {
              id: 't-dir1',
              title: '文件夹名称',
              type: 'folder',
              size: '123.MB',
              children: [
                { id: 't-sub-1', title: '团队春季团建与技术沙龙总结.pdf', type: 'pdf', size: '15.2MB' }
              ]
            },
            {
              id: 't-dir2',
              title: '文件夹名称',
              type: 'folder',
              size: '23.MB',
              children: []
            },
            {
              id: 't-pdf1',
              title: '关于印发《税务管理办法》.pdf',
              type: 'pdf',
              size: '1.45MB',
              date: '2026-02-15',
              summary: '关于团队报销及差旅发票开具的税务管理指引。'
            },
            {
              id: 't-pdf2',
              title: '综合监督体系建设实施方案..pdf',
              type: 'pdf',
              size: '1.45MB',
              date: '2026-01-20'
            },
            {
              id: 't-doc1',
              title: '党支部主要工作制度.doc',
              type: 'doc',
              size: '1.45MB',
              date: '2025-12-05'
            }
          ]
        }
      ]
    },
    {
      id: 't-cs',
      name: '测试团队',
      hasSubFolder: false,
      type: 'department',
      docs: [
        { id: 't-cs-1', title: '全链路压力测试用例集.xls', type: 'xls', size: '3.1MB', date: '2026-02-28' },
        { id: 't-cs-2', title: 'Bug生命周期流转与评级规范.doc', type: 'doc', size: '1.2MB', date: '2026-01-15' }
      ]
    },
    {
      id: 't-sq',
      name: '售前团队',
      hasSubFolder: true,
      type: 'department',
      children: [
        {
          id: 't-sq-1',
          name: '通用行业PPT方案',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 't-sq-p1', title: '智慧城市与应急调度标杆案例讲解.pdf', type: 'pdf', size: '18.5MB', date: '2026-03-02' },
            { id: 't-sq-p2', title: '数字政府一网统管方案介绍2026.pdf', type: 'pdf', size: '24.1MB', date: '2026-02-19' }
          ]
        },
        {
          id: 't-sq-2',
          name: '产品价格与配置表',
          hasSubFolder: false,
          type: 'folder',
          docs: [
            { id: 't-sq-p3', title: '硬件终端及软件授权指导报价清单.xls', type: 'xls', size: '2.5MB', date: '2026-02-01' }
          ]
        }
      ]
    },
    {
      id: 't-sj',
      name: '设计团队',
      hasSubFolder: false,
      type: 'department',
      docs: [
        { id: 't-sj-1', title: '企业UI设计规范组件库V3.2.sketch', type: 'doc', size: '42.6MB', date: '2026-02-10' },
        { id: 't-sj-2', title: '移动端图标设计原则与色彩系统.pdf', type: 'pdf', size: '5.4MB', date: '2026-01-25' }
      ]
    }
  ];

  // Personal Category Data Structure
  const personalFolders: DepartmentItem[] = [
    {
      id: 'p-wd',
      name: '我的收藏',
      hasSubFolder: false,
      type: 'department',
      docs: [
        { id: 'p-1', title: '关于印发《税务管理办法》.pdf', type: 'pdf', size: '1.45MB', date: '2026-02-15' },
        { id: 'p-2', title: '党支部主要工作制度.doc', type: 'doc', size: '1.45MB', date: '2025-12-05' }
      ]
    },
    {
      id: 'p-bg',
      name: '个人工作草稿',
      hasSubFolder: false,
      type: 'department',
      docs: [
        { id: 'p-3', title: '2026年个人季度工作总结与述职.doc', type: 'doc', size: '890KB', date: '2026-03-10' },
        { id: 'p-4', title: '项目实施复盘备忘录.doc', type: 'doc', size: '520KB', date: '2026-02-28' }
      ]
    },
    {
      id: 'p-sc',
      name: '常用制度与合规指南',
      hasSubFolder: false,
      type: 'department',
      docs: [
        { id: 'p-5', title: '集团员工考勤休假及出差补助管理办法.pdf', type: 'pdf', size: '1.1MB', date: '2025-10-10' }
      ]
    }
  ];

  // Determine current active root dataset
  const currentRootItems =
    activeTab === 'group'
      ? groupDepartments
      : activeTab === 'team'
      ? teamFolders
      : personalFolders;

  // Handler to open folder/department
  const handleItemClick = (item: DepartmentItem) => {
    if (item.children && item.children.length > 0) {
      setNavStack((prev) => [
        ...prev,
        {
          title: item.name.replace('...', ''),
          type: 'dept_list',
          data: item.children
        }
      ]);
    } else if (item.docs && item.docs.length > 0) {
      setNavStack((prev) => [
        ...prev,
        {
          title: item.name.replace('...', ''),
          type: 'doc_list',
          data: item.docs
        }
      ]);
    } else {
      // Default empty folder or mock docs
      setNavStack((prev) => [
        ...prev,
        {
          title: item.name.replace('...', ''),
          type: 'doc_list',
          data: [
            { id: `${item.id}-d1`, title: `${item.name}工作规程.pdf`, type: 'pdf', size: '1.2MB', date: '2026-01-10' },
            { id: `${item.id}-d2`, title: `${item.name}业务操作指南.doc`, type: 'doc', size: '940KB', date: '2026-02-05' }
          ]
        }
      ]);
    }
  };

  // Handler to open nested doc / folder
  const handleDocClick = (doc: KnowledgeDoc) => {
    if (doc.type === 'folder') {
      setNavStack((prev) => [
        ...prev,
        {
          title: doc.title,
          type: 'doc_list',
          data: doc.children || [
            { id: `${doc.id}-sub1`, title: `${doc.title}-资料归档01.pdf`, type: 'pdf', size: '2.1MB', date: '2026-01-20' },
            { id: `${doc.id}-sub2`, title: `${doc.title}-数据明细.xls`, type: 'xls', size: '1.8MB', date: '2026-02-01' }
          ]
        }
      ]);
    } else {
      setSelectedDoc(doc);
      setAiSummary(doc.summary || null);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (selectedDoc) {
      setSelectedDoc(null);
      setAiSummary(null);
    } else if (navStack.length > 0) {
      setNavStack((prev) => prev.slice(0, prev.length - 1));
    } else {
      onBack();
    }
  };

  // Generate AI Summary for document
  const handleGenerateAiSummary = () => {
    if (!selectedDoc) return;
    setAiSummaryLoading(true);
    setTimeout(() => {
      setAiSummary(
        selectedDoc.summary ||
          `【AI 智能提炼核心要点】\n1. 文件类别：${selectedDoc.title}\n2. 文件大小：${selectedDoc.size}，审核状态：已归档有效。\n3. 核心内容涵盖企业合规、业务推进与标准化流程，建议各执行团队遵照执行。`
      );
      setAiSummaryLoading(false);
    }, 800);
  };

  // Current view content
  const currentNav = navStack[navStack.length - 1];

  // Breadcrumb title for secondary levels
  const currentHeaderTitle = selectedDoc
    ? selectedDoc.title
    : navStack.length > 0
    ? currentNav.title
    : '知识库';

  return (
    <div className="flex flex-col h-full app-plan-query-page-bg select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-20">
        <StatusBar />
        <div className="px-3 pb-2.5 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>

          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight truncate max-w-[240px] text-center">
            {currentHeaderTitle}
          </h1>

          <div className="w-6" /> {/* Placeholder for balance */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Document Preview Full View */}
        {selectedDoc ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Document Action Bar */}
            <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase">
                  {selectedDoc.type}
                </span>
                <span className="text-xs text-slate-500">{selectedDoc.size}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateAiSummary}
                  disabled={aiSummaryLoading}
                  className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-medium shadow-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiSummaryLoading ? '提炼中...' : 'AI 摘要'}</span>
                </button>
                <button
                  onClick={() => alert('文件已下载至本地存储')}
                  className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  title="下载"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Body & AI Summary Box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI Summary Card */}
              {aiSummary && (
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200/70 rounded-xl p-3.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold mb-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI 智能要点提炼</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {aiSummary}
                  </p>
                </div>
              )}

              {/* Document Mock Viewer / Content */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs space-y-4 min-h-[420px]">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-[16px] font-bold text-slate-900 leading-snug">
                    {selectedDoc.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span>发布部门：{selectedDoc.author || '集团总部管理中心'}</span>
                    <span>日期：{selectedDoc.date || '2026-02-15'}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-[13px] text-slate-700 leading-loose space-y-3 font-serif">
                  {selectedDoc.content ? (
                    <div className="whitespace-pre-line">{selectedDoc.content}</div>
                  ) : (
                    <>
                      <p>
                        各部室、直属各单位、各驻外办事处及控股子公司：
                      </p>
                      <p>
                        为了进一步完善集团内部治理体系，提高规范化、标准化运行水平，结合现阶段业务开展的实际需求与最新国家法律法规要求，特下发本指导文件。
                      </p>
                      <p className="font-semibold text-slate-800">一、指导思想与总体要求</p>
                      <p>
                        坚持安全第一、预防为主、综合治理的方针，构建纵向到底、横向到边的全员责任网络，健全闭环督办与考核问责长效机制。
                      </p>
                      <p className="font-semibold text-slate-800">二、核心职责与实施细则</p>
                      <p>
                        1. 建立健全定期巡查与随机抽查相结合的监管机制；
                        <br />
                        2. 强化数字化系统录入与实时在线报送，杜绝信息瞒报漏报；
                        <br />
                        3. 落实跨部门协同联动，形成高效联动的工作合力。
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Tabs (集团 / 团队 / 个人) - Shown on root level */}
            {navStack.length === 0 && (
              <div className="px-3 pt-3 pb-1 bg-transparent">
                <div className="bg-slate-100/90 p-1 rounded-xl flex items-center">
                  <button
                    onClick={() => {
                      setActiveTab('group');
                      setSearchQuery('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeTab === 'group'
                        ? 'bg-white text-blue-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    集团
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('team');
                      setSearchQuery('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeTab === 'team'
                        ? 'bg-white text-blue-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    团队
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('personal');
                      setSearchQuery('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeTab === 'personal'
                        ? 'bg-white text-blue-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    个人
                  </button>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="px-3 py-2 bg-transparent">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索"
                  className="w-full h-10 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-0 rounded-xl border border-slate-200/70 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Breadcrumb path for nested levels (Matching Screenshot 5.2) */}
            {navStack.length > 0 && (
              <div className="px-3 py-2 bg-white text-xs flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setNavStack([])}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {activeTab === 'group' ? '集团' : activeTab === 'team' ? '团队' : '个人'}
                </button>
                {navStack.map((nav, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-slate-400">&gt;</span>
                    <button
                      onClick={() => setNavStack(navStack.slice(0, idx + 1))}
                      className={`font-medium ${
                        idx === navStack.length - 1
                          ? 'text-slate-700'
                          : 'text-blue-600 hover:underline'
                      }`}
                    >
                      {nav.title}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* List Content Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {/* Level 1: Root Department / Folder Grid & List */}
              {navStack.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {currentRootItems
                    .filter((item) =>
                      item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/80 active:bg-slate-100/70 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* Folder/Department Icon Matching Screenshot 5.1/5.3 */}
                          {activeTab === 'team' ? (
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                              {/* Blue Multi-user/Team Icon */}
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500 fill-current">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                <circle cx="18" cy="8" r="2.5" className="text-cyan-400 fill-current opacity-75" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-sky-50 to-blue-50 border border-blue-100/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                              {/* 3-layer cyan/blue stacked rhombus icon matching Screenshot 5.1 */}
                              <div className="relative w-6 h-6 flex items-center justify-center">
                                <div className="absolute top-0.5 w-4.5 h-2.5 bg-sky-300 rounded-sm transform rotate-45 skew-x-12 opacity-80" />
                                <div className="absolute top-2 w-4.5 h-2.5 bg-blue-400 rounded-sm transform rotate-45 skew-x-12 opacity-90" />
                                <div className="absolute top-3.5 w-4.5 h-2.5 bg-blue-600 rounded-sm transform rotate-45 skew-x-12" />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-medium text-slate-800">
                              {item.name}
                            </span>
                            {item.hasSubFolder && (
                              <span className="inline-flex items-center text-blue-500 ml-0.5">
                                <Folder className="w-3.5 h-3.5 stroke-[2] fill-blue-50" />
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </div>
                    ))}
                </div>
              )}

              {/* Level 2: Sub-Level Department / Sub-folders (e.g. 研发部 -> 业务开发, 平台开发) */}
              {navStack.length > 0 && currentNav.type === 'dept_list' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {(currentNav.data as DepartmentItem[])
                    .filter((sub) =>
                      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleItemClick(sub)}
                        className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/80 active:bg-slate-100/70 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-sky-50 to-blue-50 border border-blue-100/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                            <div className="relative w-6 h-6 flex items-center justify-center">
                              <div className="absolute top-0.5 w-4.5 h-2.5 bg-sky-300 rounded-sm transform rotate-45 skew-x-12 opacity-80" />
                              <div className="absolute top-2 w-4.5 h-2.5 bg-blue-400 rounded-sm transform rotate-45 skew-x-12 opacity-90" />
                              <div className="absolute top-3.5 w-4.5 h-2.5 bg-blue-600 rounded-sm transform rotate-45 skew-x-12" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-medium text-slate-800">
                              {sub.name}
                            </span>
                            {sub.hasSubFolder && (
                              <span className="inline-flex items-center text-blue-500 ml-0.5">
                                <Folder className="w-3.5 h-3.5 stroke-[2] fill-blue-50" />
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </div>
                    ))}
                </div>
              )}

              {/* Level 3: Files & Sub-folder Items (Matching Screenshot 5.4) */}
              {navStack.length > 0 && currentNav.type === 'doc_list' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {(currentNav.data as KnowledgeDoc[])
                    .filter((doc) =>
                      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((doc) => {
                      const isFolder = doc.type === 'folder';
                      return (
                        <div
                          key={doc.id}
                          onClick={() => handleDocClick(doc)}
                          className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/80 active:bg-slate-100/70 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Icon Based on File Type */}
                            {isFolder ? (
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-xs">
                                <Folder className="w-6 h-6 text-white fill-white/80" />
                              </div>
                            ) : doc.type === 'pdf' ? (
                              <div className="w-11 h-11 rounded-xl bg-[#e53935] flex items-center justify-center flex-shrink-0 shadow-xs">
                                {/* PDF Adobe Acrobat Style Icon */}
                                <span className="text-white font-extrabold text-[15px] italic tracking-tighter">
                                  &amp;
                                </span>
                              </div>
                            ) : doc.type === 'doc' ? (
                              <div className="w-11 h-11 rounded-xl bg-[#1e88e5] flex items-center justify-center flex-shrink-0 shadow-xs">
                                {/* Word W style icon */}
                                <span className="text-white font-black text-[15px] tracking-tight">
                                  W
                                </span>
                              </div>
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-[#43a047] flex items-center justify-center flex-shrink-0 shadow-xs">
                                <span className="text-white font-black text-[15px] tracking-tight">
                                  X
                                </span>
                              </div>
                            )}

                            <div>
                              <h3 className="text-[14px] font-medium text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                                {doc.title}
                              </h3>
                              <p className="text-[12px] text-slate-400 mt-0.5 font-normal">
                                {doc.size}
                              </p>
                            </div>
                          </div>

                          {/* Right action */}
                          {isFolder ? (
                            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <div className="p-1.5 text-blue-500 hover:text-blue-700 flex-shrink-0">
                              <Eye className="w-4.5 h-4.5 stroke-[2]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
