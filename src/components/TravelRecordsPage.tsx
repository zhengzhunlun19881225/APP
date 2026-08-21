import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  User,
  CreditCard,
  Layers,
  ArrowUpDown,
  X
} from 'lucide-react';

export interface TravelRecordItem {
  id: string;
  code: string;
  applicant: string;
  applicantDept?: string;
  date: string;
  type: string;
  amount: number;
  status: '草稿' | '完成' | '审批中' | '已驳回';
  // 详情字段
  businessType?: string;
  accountingEntity?: string;
  currency?: string;
  summary?: string;
  currentNode?: string;
  currentHandler?: string;
  deliveryStatus?: string;
  paymentStatus?: string;
  imageStatus?: string;
}

export const INITIAL_TRAVEL_RECORDS: TravelRecordItem[] = [
  {
    id: 'tr-1',
    code: 'GHG-BX2608190036',
    applicant: '曾珂',
    applicantDept: '广新集团本部/财务部',
    date: '-',
    type: 'GHG-出差申请单',
    amount: 0,
    status: '草稿',
    businessType: '出差申请单',
    accountingEntity: '广新集团本部',
    currency: '人民币',
    summary: '广州至北京项目方案讨论',
    currentNode: '填单草稿',
    currentHandler: '曾珂',
    deliveryStatus: '无需投递',
    paymentStatus: '无需付款',
    imageStatus: '未上传'
  },
  {
    id: 'tr-2',
    code: 'GHG-BX2607290028',
    applicant: '曾珂',
    applicantDept: '广新集团本部/财务部',
    date: '-',
    type: 'GHG-出差申请单',
    amount: 4570,
    status: '草稿',
    businessType: '出差申请单',
    accountingEntity: '广新集团本部',
    currency: '人民币',
    summary: '上海业务线商务考察及系统验收',
    currentNode: '填单草稿',
    currentHandler: '曾珂',
    deliveryStatus: '无需投递',
    paymentStatus: '无需付款',
    imageStatus: '未上传'
  },
  {
    id: 'tr-3',
    code: 'GHG-BX2607270024',
    applicant: '曾珂',
    applicantDept: '广新集团本部/财务部',
    date: '-',
    type: 'GHG-出差申请单',
    amount: 0,
    status: '草稿',
    businessType: '出差申请单',
    accountingEntity: '广新集团本部',
    currency: '人民币',
    summary: '深圳分公司季度例会',
    currentNode: '填单草稿',
    currentHandler: '曾珂',
    deliveryStatus: '无需投递',
    paymentStatus: '无需付款',
    imageStatus: '无需上传'
  },
  {
    id: 'tr-4',
    code: 'GHG-BA21233232323233',
    applicant: '张贺山',
    applicantDept: '广新集团本部',
    date: '2022-08-23 12:29:20',
    type: '出差申请单',
    amount: 4212.00,
    status: '完成',
    businessType: '出差申请单',
    accountingEntity: '广新集团本部',
    currency: '人民币',
    summary: '人力系统现场指导',
    currentNode: '结束流程',
    currentHandler: '张三',
    deliveryStatus: '无需投递',
    paymentStatus: '无需付款',
    imageStatus: '无需上传'
  },
  {
    id: 'tr-5',
    code: 'GHG-BX2607150019',
    applicant: '李明',
    applicantDept: '广新集团本部/经营管理部',
    date: '2025-07-07 09:30:15',
    type: 'GHG-出差申请单',
    amount: 5000.00,
    status: '审批中',
    businessType: '出差申请单',
    accountingEntity: '广新集团本部',
    currency: '人民币',
    summary: '北京出差三天，与代理商讨论项目方案',
    currentNode: '部门负责人审批',
    currentHandler: '王总监',
    deliveryStatus: '无需投递',
    paymentStatus: '待付款',
    imageStatus: '已上传'
  }
];

interface TravelRecordsPageProps {
  onBack: () => void;
  onSelectRecord?: (record: TravelRecordItem) => void;
}

export const TravelRecordsPage: React.FC<TravelRecordsPageProps> = ({
  onBack,
  onSelectRecord
}) => {
  const [records, setRecords] = useState<TravelRecordItem[]>(INITIAL_TRAVEL_RECORDS);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<'全部' | '草稿' | '审批中' | '完成'>('全部');
  const [selectedRecord, setSelectedRecord] = useState<TravelRecordItem | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 搜索和状态过滤
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        !searchText.trim() ||
        r.code.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        r.applicant.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        r.type.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        (r.summary && r.summary.toLowerCase().includes(searchText.toLowerCase().trim()));

      const matchFilter = activeFilter === '全部' || r.status === activeFilter;

      return matchSearch && matchFilter;
    });
  }, [records, searchText, activeFilter]);

  // 如果处于详情查看状态，渲染单据详情页面（完全还原用户上传的「单据记录详情.png」）
  if (selectedRecord) {
    return (
      <div className="flex flex-col h-full bg-[#f4f6f9] select-none overflow-y-auto">
        {/* Navigation Bar */}
        <div className="px-2 py-3 flex items-center justify-between sticky top-0 bg-[#f4f6f9]/95 backdrop-blur-md z-20 border-b border-slate-200/50">
          <button
            onClick={() => setSelectedRecord(null)}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>

          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
            详情
          </h1>

          <div className="w-8" />
        </div>

        {/* Detail Content Cards */}
        <div className="px-2 py-2 space-y-2 pb-16">
          {/* Top Status & Summary Card */}
          <div className="app-card p-4 relative overflow-hidden">
            {/* Header with Code and Status Badge */}
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight break-all">
                {selectedRecord.code}
              </h2>
              <span
                className={`text-[12px] px-2.5 py-0.5 rounded-[4px] font-medium shrink-0 ${
                  selectedRecord.status === '完成'
                    ? 'bg-[#10b981] text-white'
                    : selectedRecord.status === '审批中'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {selectedRecord.status}
              </span>
            </div>

            {/* Meta Key-Value Pairs */}
            <div className="space-y-2.5 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">申请人：</span>
                <span className="text-slate-800 font-medium">
                  {selectedRecord.applicant} {selectedRecord.applicantDept ? `(${selectedRecord.applicantDept})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">单据日期：</span>
                <span className="text-slate-800">
                  {selectedRecord.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">单据类型：</span>
                <span className="text-slate-800 font-medium">
                  {selectedRecord.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">金额：</span>
                <span className="text-slate-900 font-semibold">
                  {selectedRecord.amount.toFixed(2)}元
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: 基本信息 Card */}
          <div className="app-card p-4 space-y-3.5">
            {/* Title with Blue Accent Bar */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-[#0070f3] rounded-full" />
              <h3 className="text-[15px] font-bold text-slate-900">
                基本信息
              </h3>
            </div>

            <div className="space-y-3 text-[14px] divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">业务类型</span>
                <span className="text-slate-800 font-medium">
                  {selectedRecord.businessType || '出差申请单'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">核算主体</span>
                <span className="text-slate-800">
                  {selectedRecord.accountingEntity || '广新集团本部'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">币种</span>
                <span className="text-slate-800">
                  {selectedRecord.currency || '人民币'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">摘要</span>
                <span className="text-slate-800">
                  {selectedRecord.summary || '人力系统现场指导'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: 状态信息 Card */}
          <div className="app-card p-4 space-y-3.5">
            {/* Title with Blue Accent Bar */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-[#0070f3] rounded-full" />
              <h3 className="text-[15px] font-bold text-slate-900">
                状态信息
              </h3>
            </div>

            <div className="space-y-3 text-[14px] divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">当前节点</span>
                <span className="text-slate-800 font-medium">
                  {selectedRecord.currentNode || '结束流程'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">当前处理人</span>
                <span className="text-slate-800">
                  {selectedRecord.currentHandler || '张三'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">投递状态</span>
                <span className="text-slate-800">
                  {selectedRecord.deliveryStatus || '无需投递'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">付款状态</span>
                <span className="text-slate-800">
                  {selectedRecord.paymentStatus || '无需付款'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">影像状态</span>
                <span className="text-slate-800">
                  {selectedRecord.imageStatus || '无需上传'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 默认：单据记录列表页面（完全还原用户上传的「单据记录.png」）
  return (
    <div className="flex flex-col h-full bg-[#f4f6f9] select-none overflow-hidden">
      {/* Navigation Bar */}
      <div className="px-2 py-3 flex items-center justify-between sticky top-0 bg-[#f4f6f9]/95 backdrop-blur-md z-20 border-b border-slate-200/50">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          单据记录
        </h1>

        <div className="w-8" />
      </div>

      {/* Search and Date Filter Bar (Match Screenshot 2) */}
      <div className="px-2 pt-3 pb-2 flex items-center gap-2.5">
        <div className="app-search-shell flex-1 !bg-white !border-slate-200/80">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索"
            className="app-search-input"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date Filter Button */}
        <button
          type="button"
          onClick={() => setShowDatePicker((prev) => !prev)}
          className={`w-10 h-10 rounded-xl bg-white border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
            showDatePicker
              ? 'border-blue-500 text-[#0070f3] bg-blue-50/40'
              : 'border-slate-200/80 text-slate-600 hover:text-slate-900'
          }`}
          title="日期筛选"
        >
          <Calendar className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>

      {/* Filter Tabs if date picker opened */}
      {showDatePicker && (
        <div className="px-2 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-100/70 border-b border-slate-200/60 animate-in fade-in duration-200">
          {(['全部', '草稿', '审批中', '完成'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-lg text-[13px] font-medium transition-all ${
                activeFilter === tab
                  ? 'bg-[#0070f3] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Record List Items (Match Screenshot 2) */}
      <div className="flex-1 px-2 py-2 overflow-y-auto space-y-2 pb-20">
        {filteredRecords.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-[14px]">
            未找到匹配的单据记录
          </div>
        ) : (
          filteredRecords.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedRecord(item)}
              className="app-card p-4 hover:border-blue-200/80 active:scale-[0.99] transition-all cursor-pointer space-y-2.5"
            >
              {/* Header Row: 单据编号 + 箭头 */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100/60">
                <span className="text-[16px] font-bold text-slate-900 tracking-tight">
                  单据: {item.code}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Rows matching screenshot 2 */}
              <div className="space-y-1.5 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">申请人：</span>
                  <span className="text-slate-800 font-medium">
                    {item.applicant}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">单据日期：</span>
                  <span className="text-slate-800">
                    {item.date}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">单据类型：</span>
                  <span className="text-slate-800">
                    {item.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">金额：</span>
                  <span className="text-slate-900 font-medium">
                    {item.amount} 元
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">状态：</span>
                  <span
                    className={`font-medium ${
                      item.status === '完成'
                        ? 'text-emerald-600'
                        : item.status === '审批中'
                        ? 'text-blue-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
