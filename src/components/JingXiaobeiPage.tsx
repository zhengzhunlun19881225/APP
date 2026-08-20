import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MessageSquare, Volume2, Send, Sparkles, RefreshCw, Copy, Check, Bot, BarChart3, FileText, PenTool, Grid, HelpCircle, ShieldCheck, X, ChevronRight, ArrowRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AiAgentAvatar } from './AiAgentAvatar';
import { VoiceListeningModal } from './VoiceListeningModal';

interface JingXiaobeiPageProps {
  onBack: () => void;
  onSelectAgent?: (agentName: string, initialQuestion?: string) => void;
  onOpenAgentHub?: () => void;
}

interface PromptCard {
  id: string;
  question: string;
  category: string;
  response: string;
  suggestions: string[];
}

// Agent-specific prompt card dataset
const agentPromptCards: Record<string, PromptCard[]> = {
  '智能问答': [
    {
      id: 'qa-1',
      question: '爸妈年纪大了，该为他们考虑什么保障？',
      category: '智能问答',
      response: '父母随着年龄增长，身体机能与医疗开支风险逐步增加。建议优先按顺序考虑以下三类基础保障：\n\n1. **国家医保/城乡居民医保**（必须保留）：这是最基础的兜底保障。\n2. **百万医疗险 / 防癌医疗险**：如果父母身体健康，首选百万医疗险；若有慢性病，选择健康告知极宽松的防癌医疗险。\n3. **意外险（重点含意外医疗与骨折保障）**：老年人摔倒风险较高，意外险保费低廉且无健康告知要求。\n\n如需为您定制父母保障方案，可告诉我父母的具体年龄与身体健康状况。',
      suggestions: [
        '防癌医疗险和百万医疗险有什么区别？',
        '60岁以上老人买什么意外险划算？',
        '有高血压和糖尿病还能买保险吗？'
      ]
    },
    {
      id: 'qa-2',
      question: '当前市场下，有哪些适合稳健投资的理财选择？',
      category: '智能问答',
      response: '在低利率时代，针对稳健型投资需求，建议构建“金字塔型”低风险组合：\n\n1. **流动资金**：国债逆回购、货币基金，保证日常随时用钱。\n2. **稳健底仓**：大额存单、高评级信用债基金、储蓄型年金险。\n3. **增强收益**：“固收+”基金、红利低波ETF，利用高股息蓝筹股票的分红增强整体收益。',
      suggestions: [
        '“固收+”基金最近收益如何？',
        '低利率时代如何锁定长期收益？',
        '红利低波ETF适合长期持有吗？'
      ]
    },
    {
      id: 'qa-3',
      question: '跨部门协作项目中，如何高效跟进进度与管理风险？',
      category: '智能问答',
      response: '高效跟进跨部门项目建议采取“三步法”：\n\n1. **明确单一点对点责任人（DRI）**：每个模块指定唯一责任人。\n2. **建立例会与可视化看板**：利用协同看板实时更新 Task 状态。\n3. **建立风险预警机制**：对卡点延期提前 48 小时向上升级排查。',
      suggestions: [
        '如何制定跨部门沟通机制？',
        '项目卡点如何向上升级沟通？'
      ]
    }
  ],
  '智能问数': [
    {
      id: 'data-1',
      question: '对比分析今年 Q1 与 Q2 华东大区的销售业绩与转化率',
      category: '智能问数',
      response: '智小星已为您检索数据库并完成多维指标对比：\n\n📊 **华东大区 Q1 vs Q2 业绩看板**：\n- **总销售额**：Q1 (¥1,280万) vs Q2 (¥1,640万)，环比增长 **+28.1%**\n- **线索转化率**：Q1 (14.2%) vs Q2 (18.6%)，提升 **+4.4%**\n- **客单价**：Q1 (¥2.4万) vs Q2 (¥2.9万)，提升 **+20.8%**\n\n💡 **核心增长驱动力**：Q2 上线的“企业AI套餐”带动大客户签单量提升 35%。',
      suggestions: [
        '导出 Q1 与 Q2 详细数据 Excel 报表',
        '分析华南大区同期业绩对比',
        '预测 Q3 华东大区销售走势'
      ]
    },
    {
      id: 'data-2',
      question: '生成近 6 个月客户退款率走势及主要退款原因占比分析',
      category: '智能问数',
      response: '根据售后系统近 180 天日志分析：\n\n📉 **退款率走势**：平均退款率为 **2.1%**，整体呈平稳下降趋势（最高点为 3月 2.8%，最低点为 7月 1.5%）。\n\n🔍 **主要退款原因归因**：\n1. **功能不符合预期**：占比 42%\n2. **交付周期过长**：占比 28%\n3. **售后服务响应慢**：占比 18%\n4. **其他/无理由**：占比 12%',
      suggestions: [
        '查看功能不符合预期的具体客户反馈',
        '生成售后响应时效分析报告'
      ]
    }
  ],
  '智能摘要': [
    {
      id: 'sum-1',
      question: '提取这份 50 页《集团年度 AI 数字化转型战略规划》的核心要点',
      category: '智能摘要',
      response: '智小星已为您快速阅读并提炼出 3 大核心战略方向：\n\n🎯 **一、总体目标**：3年内实现集团核心业务流程 80% AI 智能化覆盖。\n⚡ **二、三大落地抓手**：\n1. **搭建统一 AI 智能体集**：赋能前端营销与内部行政提效；\n2. **数据中台治理**：打通各部门数据孤岛，实现智能问数；\n3. **全员 AI 技能培训**：提升员工人效，降低重置成本。\n💰 **三、预算与 ROI 预期**：预算投入 2500万，预计年化降本增效 4000万+。',
      suggestions: [
        '生成 PDF 一页纸摘要简报',
        '提取第一阶段 Key Milestones',
        '列出该规划涉及的部门负责人名单'
      ]
    },
    {
      id: 'sum-2',
      question: '总结今天上午 2 小时跨部门例会的决议与待办事项清单',
      category: '智能摘要',
      response: '📝 **例会摘要与 Action Items**：\n\n✅ **三项核心决议**：\n1. 确定新版本 App 于本月 25 日正式上线公测；\n2. 同意增加 20万 运营推流预算；\n3. 组建专项保障小组负责运维首发。\n\n📌 **待办事项（Action Items）**：\n- **[张伟/技术部]**：20日前完成压力测试与安全审计（截止日期：08-20）\n- **[李娜/市场部]**：22日前确定第一批 KOL 合作名单（截止日期：08-22）',
      suggestions: [
        '一键同步到钉钉/飞书待办任务',
        '生成会议纪要邮件模板'
      ]
    }
  ],
  '智能写作': [
    {
      id: 'write-1',
      question: '撰写一份关于推进企业 AI 智能体集落地的项目立项提案',
      category: '智能写作',
      response: '智小星已为您生成《关于建设集团企业级 AI 智能体集平台的立项提案》草稿：\n\n**【项目背景与痛点】**\n当前内部重复性工作较多，员工跨系统查询数据耗时长，亟需智能化 AI 工具提效。\n\n**【建设内容】**\n1. **智能问答**：解答员工人事、财务、制度政策等日常问询；\n2. **智能问数**：自然语言直接查询经营数据与报表；\n3. **智能写作与摘要**：快速起草公文与会议纪要提炼。\n\n**【预期效益】**\n预计缩短日常信息检索时间 60%，提升公文写作效率 40%。',
      suggestions: [
        '扩展充实项目预算与实施路径章节',
        '润色为PPT演示大纲格式',
        '生成项目风险控制说明'
      ]
    },
    {
      id: 'write-2',
      question: '起草一篇产品新功能发版活动的公众号推广软文',
      category: '智能写作',
      response: '🚀 **标题推荐**：《重磅升级！智小星 AI 智能体集上线，让你的工作效率翻倍！》\n\n**正文**：\n你是否也曾被冗长繁琐的数据报表折磨？\n你是否也曾为了找一份制度文件翻遍文件夹？\n\n今天，智小星全新“智能体集”重磅上线！涵盖智能问答、智能问数、智能摘要、智能写作等全能AI助手，一键帮您搞定日常难题！...',
      suggestions: [
        '更换为更专业严肃的商务风格',
        '增加用户限时福利活动文案'
      ]
    }
  ],
  '更多': [
    {
      id: 'more-1',
      question: '智能翻译：将这份英文商务合作协议翻译成中文并校验关键条款',
      category: '更多',
      response: '🌐 **智小星多语言协作**：\n已为您完成契约条款的精确翻译，并重点标注了违约责任、争议解决地（Arbitration Clause）以及知识产权归属三处关键风险条款。',
      suggestions: [
        '对比中英双语对照格式',
        '导出 Word 格式修订文档'
      ]
    },
    {
      id: 'more-2',
      question: '智能审核：自动核对采购合同中的付款节点与发票合规条款',
      category: '更多',
      response: '🛡️ **智小星风控合规校验**：\n经过智能扫描，发现 1 处潜在风险：合同第 4.2 条中未明确增值税专用发票开具时限，建议补充“在首笔预付款到达后 5 个工作日内开具”。',
      suggestions: [
        '插入标准发票合规条款',
        '生成合规审查意见表'
      ]
    }
  ]
};

const agentTabs = [
  { id: '智能问答', label: '智能问答', icon: HelpCircle },
  { id: '智能问数', label: '智能问数', icon: BarChart3 },
  { id: '智能摘要', label: '智能摘要', icon: FileText },
  { id: '智能写作', label: '智能写作', icon: PenTool },
  { id: '更多', label: '更多', icon: Grid }
];

export const JingXiaobeiPage: React.FC<JingXiaobeiPageProps> = ({ onBack, onSelectAgent, onOpenAgentHub }) => {
  const [selectedAgentTab, setSelectedAgentTab] = useState<string>('智能问答');
  const [cardIndex, setCardIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; suggestions?: string[] }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMoreAgentsModalOpen, setIsMoreAgentsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

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

  // Time-based dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Hello，上午好';
    if (hour < 18) return 'Hello，下午好';
    return 'Hello，晚上好';
  };

  const currentCards = agentPromptCards[selectedAgentTab] || agentPromptCards['智能问答'];
  const currentCard = currentCards[cardIndex % currentCards.length] || currentCards[0];
  const nextCard = currentCards[(cardIndex + 1) % currentCards.length] || currentCards[0];

  const handleSwitchAgentTab = (tabId: string) => {
    if (tabId === '更多') {
      setIsMoreAgentsModalOpen(true);
      return;
    }
    if (onSelectAgent) {
      onSelectAgent(tabId);
    } else {
      setSelectedAgentTab(tabId);
      setCardIndex(0);
    }
  };

  const handleAskQuestion = (customQ?: string) => {
    const questionToAsk = customQ || currentCard.question;
    
    if (onSelectAgent) {
      onSelectAgent(selectedAgentTab, questionToAsk);
      return;
    }

    setChatMode(true);
    // Add user question
    const userMsg = { role: 'user' as const, text: questionToAsk };
    setMessages([userMsg]);
    setIsTyping(true);

    // Simulate AI response stream / thinking
    setTimeout(() => {
      const allCards = Object.values(agentPromptCards).flat();
      const foundCard = allCards.find(c => c.question === questionToAsk) || {
        response: `关于“${questionToAsk}”，智小星已为您整理出专业解答：\n\n作为您的 AI 智能助理，智小星可以结合企业数据库与业务流程为您提供多维分析、智能创作或决策参考。\n\n如需进一步调取具体数据或生成报告，请随时告诉我！`,
        suggestions: ['对比相关数据报表', '生成PDF方案导出', '联系人工专家跟进']
      };

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: foundCard.response,
          suggestions: foundCard.suggestions
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendInput = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');

    if (onSelectAgent) {
      onSelectAgent(selectedAgentTab, text);
      return;
    }

    if (!chatMode) {
      handleAskQuestion(text);
    } else {
      const userMsg = { role: 'user' as const, text };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: `收到您的提问：“${text}”。根据智小星的智能分析，为您总结以下核心要点：\n\n1. **精准定位**：针对您描述的场景，已自动关联相关数据与制度规章。\n2. **最佳实践**：建议优先选择合规、高收益方案，实现降本增效。\n3. **下一步执行**：智小星可为您自动一键导出排期表或生成公文草案。`,
            suggestions: ['导出详细计算数据', '生成演示PPT提纲', '咨询专家团队']
          }
        ]);
        setIsTyping(false);
      }, 1100);
    }
  };

  const handleNextCard = () => {
    setCardIndex((prev) => (prev + 1) % currentCards.length);
  };

  const handlePrevCard = () => {
    setCardIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className="flex flex-col h-full bg-cover bg-top bg-no-repeat relative overflow-hidden select-none"
      style={{
        backgroundImage: `url('/agent-bg.svg'), linear-gradient(180deg, #edf4fe 0%, #f6f8fd 40%, #ffffff 100%)`
      }}
    >
      {/* Header */}
      <div className="pt-3 pb-2 px-4 flex items-center justify-between z-20">
        <button
          onClick={chatMode ? () => setChatMode(false) : onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">智小星</h1>

        <div className="w-9 h-9" />
      </div>

      {/* Main Content Body */}
      {!chatMode ? (
        /* Default Landing View */
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
                小星是您的专业AI助理，懂金融，更懂你
              </p>
            </div>
          </div>

          {/* Stacked Cards Deck Area */}
          <div className="w-full max-w-[340px] relative my-auto py-4 flex flex-col items-center">
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
                key={`${selectedAgentTab}-${cardIndex}`}
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
                      handleAskQuestion();
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

          {/* Quick Agent Switcher Pills Row */}
          <div className="w-full max-w-[390px] flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
            {agentTabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = selectedAgentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchAgentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                    isActive
                      ? 'bg-[#0f172a] text-white shadow-md'
                      : 'bg-white shadow-2xs border border-slate-100/90 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Chat Conversation View */
        <div className="flex-1 flex flex-col justify-between overflow-hidden pb-20">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {/* Role Header */}
                <div className="flex items-center gap-1.5 px-1">
                  {msg.role === 'assistant' ? (
                    <>
                      <AiAgentAvatar size="xs" />
                      <span className="text-[12px] text-slate-500 font-medium">智小星 AI</span>
                    </>
                  ) : (
                    <span className="text-[12px] text-slate-400 font-medium">您</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-[14px] leading-relaxed shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#0f172a] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Copy Button for Assistant */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2.5">
                      <span className="text-[10px] text-slate-400">已为您智能整理解答</span>
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px] active:scale-95 transition-transform"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>复制</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Followup Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 pl-1 max-w-[90%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleAskQuestion(sug)}
                        className="bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-slate-50 rounded-full px-3 py-1 text-[12px] active:scale-95 transition-all shadow-2xs"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-[13px] bg-white border border-slate-100 rounded-full px-4 py-2 w-max shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>智小星正在思考中...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Input Bar (Always Visible) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent z-30">
        <div className="max-w-[420px] mx-auto space-y-1">
          {/* Main Input Box */}
          <div className="bg-white rounded-full shadow-lg border border-slate-100 px-4 py-2.5 flex items-center justify-between gap-2 transition-shadow focus-within:ring-2 focus-within:ring-blue-500/20">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendInput()}
              placeholder="有问题就找智小星"
              className="w-full bg-transparent text-[14px] text-slate-800 placeholder-slate-400 outline-none font-normal"
            />

            {inputText.trim() ? (
              <button
                onClick={handleSendInput}
                className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center active:scale-95 transition-all flex-shrink-0"
                title="语音输入"
              >
                <Volume2 className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>

          {/* Bottom Disclaimer Note */}
          <p className="text-[11px] text-slate-400 font-normal tracking-tight text-center pt-0.5">
            本服务内容为AI生成，仅供参考
          </p>
        </div>
      </div>

      {/* Voice Listening Modal (Matches Image 3) */}
      <VoiceListeningModal
        isOpen={isVoiceModalOpen}
        agentName="云一朵"
        onClose={() => setIsVoiceModalOpen(false)}
        onSend={(voiceText) => {
          setIsVoiceModalOpen(false);
          setInputText(voiceText);
          setChatMode(true);
          const activeCard = agentPromptCards[selectedAgentTab]?.[cardIndex] || agentPromptCards['智能问答'][0];
          setMessages((prev) => [
            ...prev,
            { role: 'user', text: voiceText },
            {
              role: 'assistant',
              text: `收到您的语音提问：“${voiceText}”\n\n${activeCard.response}`,
              suggestions: activeCard.suggestions
            }
          ]);
        }}
      />

      {/* 更多智能体弹窗 / Drawer */}
      <AnimatePresence>
        {isMoreAgentsModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreAgentsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-[420px] mx-auto bg-white rounded-t-[28px] shadow-2xl p-5 z-10 flex flex-col max-h-[82vh] overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-900">选择智能体</h3>
                    <p className="text-[11px] text-slate-400">点击直接开启与专属智能体的对话</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMoreAgentsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Agent Items Grid / List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                {[
                  {
                    name: '智能问答',
                    desc: '集团制度、政策答疑与业务咨询',
                    icon: <Bot className="w-5 h-5 text-white" />,
                    bg: 'bg-blue-500',
                    heat: '2.8万+'
                  },
                  {
                    name: '智能问数',
                    desc: '指标穿透、图表洞察与报表查询',
                    icon: <BarChart3 className="w-5 h-5 text-white" />,
                    bg: 'bg-amber-500',
                    heat: '3.2万+'
                  },
                  {
                    name: '智能写作',
                    desc: '公文、发言稿、立项报告智能起草',
                    icon: <PenTool className="w-5 h-5 text-white" />,
                    bg: 'bg-purple-500',
                    heat: '2.5万+'
                  },
                  {
                    name: '智能摘要',
                    desc: '长文档速读、会议纪要与决策简报',
                    icon: <FileText className="w-5 h-5 text-white" />,
                    bg: 'bg-emerald-500',
                    heat: '2万+'
                  },
                  {
                    name: 'AI+财务自动差旅',
                    desc: '差旅比价、发票验真与免垫资报销',
                    icon: <RefreshCw className="w-5 h-5 text-white" />,
                    bg: 'bg-sky-500',
                    heat: '2.1万+'
                  },
                  {
                    name: 'AI+员工服务',
                    desc: '请休假、加班申请、员工手册与证明办理',
                    icon: <Users className="w-5 h-5 text-white" />,
                    bg: 'bg-amber-500',
                    heat: '2.6万+'
                  },
                  {
                    name: '法智小新',
                    desc: '合同合规审查、风控条款与法律支持',
                    icon: <ShieldCheck className="w-5 h-5 text-white" />,
                    bg: 'bg-teal-500',
                    heat: '1.9万+'
                  }
                ].map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setIsMoreAgentsModalOpen(false);
                      onSelectAgent?.(item.name);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-amber-600 font-medium">🔥 {item.heat}</span>
                        </div>
                        <p className="text-[12px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 flex-shrink-0 pl-2">
                      <span>进入</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Footer Action */}
              {onOpenAgentHub && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsMoreAgentsModalOpen(false);
                      onOpenAgentHub();
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                  >
                    <span>进入智能体群大厅</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
