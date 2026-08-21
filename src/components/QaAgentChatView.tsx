import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Clock,
  PlusCircle,
  MoreHorizontal,
  RefreshCw,
  ArrowRight,
  Atom,
  Folder,
  Award,
  Users,
  Camera,
  Mic,
  Send,
  Volume2,
  VolumeX,
  Copy,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  FileText,
  HelpCircle,
  Sparkles,
  BookOpen,
  Plus,
  AlertCircle
} from 'lucide-react';
import { SkillTreePage } from './SkillTreePage';
import { ScheduleShareManagement } from './ScheduleShareManagement';
import { VoiceListeningModal } from './VoiceListeningModal';

export interface AgentItem {
  id: string;
  name: string;
  category: string;
  iconBg: string;
  icon: React.ReactNode;
  description: string;
  heat: string;
  tag: string;
}

interface QaPromptCard {
  id: string;
  question: string;
  responseTitle: string;
  responseText: string;
  sections?: Array<{ title: string; content: string | string[] }>;
  categoryTag?: string;
}

const qaPromptCards: QaPromptCard[] = [
  {
    id: 'qa-card-1',
    question: '集团差旅报销标准与审批流程是什么？',
    categoryTag: '财务与差旅',
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
    ]
  },
  {
    id: 'qa-card-2',
    question: '年休假与调休政策规定及申请条件？',
    categoryTag: '人力资源',
    responseTitle: '集团员工年休假与调休管理规程',
    responseText: '根据国家《职工带薪年休假条例》及集团人力资源管理制度规定：\n\n📅 **一、带薪年休假核算天数**：\n- **累计工龄 1 年至 10 年**：每年享受年休假 **5 天**；\n- **累计工龄 10 年至 20 年**：每年享受年休假 **10 天**；\n- **累计工龄 20 年及以上**：每年享受年休假 **15 天**。\n\n⏱️ **二、加班调休管理原则**：\n- 休息日或法定节假日加班经部门分管领导事前审批后，可按 1:1 累计调休时长；\n- 调休额度原则上需在当自然年度内休完，特殊情况经人力资源部备案可顺延至次年一季度末。',
    sections: [
      {
        title: '📝 申请与审批流程',
        content: '通过移动OA【请假申请】模块，选择【年休假/调休】，系统将自动拉取剩余可用天数并智能校验考勤排班。'
      }
    ]
  },
  {
    id: 'qa-card-3',
    question: '合同法律审核流程与法务风险把控要点？',
    categoryTag: '法务风控',
    responseTitle: '重大合同法务审查与合规风险防范指引',
    responseText: '法智小新协同集团风控法务部为您提供全生命周期合同审核规范：\n\n⚖️ **一、合同审查分类与时效**：\n- **标准范本合同**：法务审核时效为 1 个工作日内；\n- **非标准商业合同（金额<500万）**：审核时效 2 个工作日；\n- **重大战略协议/涉外投资合同（金额≥500万）**：由法务部会同外聘律师团队在 3 个工作日内出具专业法律意见书。\n\n🛡️ **二、重点风险把控维度**：\n1. **主体资格与履约能力审查**：核查对方工商征信、司法涉诉及失信被执行记录；\n2. **标的交付与验收标准**：明确量化检验指标与异议期；\n3. **违约责任与争议解决**：约定争议管辖地优先为集团所在地人民法院。',
    sections: [
      {
        title: '📑 用印归档要求',
        content: '合同正式文本签署完毕后需在 3 个工作日内将原件扫描件上传至法务协同系统进行电子归档编号。'
      }
    ]
  },
  {
    id: 'qa-card-4',
    question: '员工福利体检与补充商业保险如何申请？',
    categoryTag: '员工福利',
    responseTitle: '集团员工健康体检与补充医疗保险指南',
    responseText: '集团始终关爱员工健康，为您提供多层次福利保障计划：\n\n🏥 **一、年度健康体检**：\n- **体检周期**：每年 5 月至 10 月；\n- **预约方式**：在员工服务中心【健康体检】通道自主选择指定三甲医院或专业体检机构预约；\n- **家属特惠**：员工直系亲属可按集团协议优惠价预约同等级体检套餐。\n\n🩺 **二、补充商业医疗保险**：\n- **保障范围**：门急诊医疗费（免赔额后按80%~90%赔付）、住院医疗（100%全额赔付）、重大疾病津贴及意外伤害险；\n- **理赔申报**：发生就诊后，通过保险公司官方移动端上传发票及就诊病历，小额理赔 3 个工作日内极速赔付到账。'
  },
  {
    id: 'qa-card-5',
    question: '高新技术企业申报政策与研发费用加计扣除指引？',
    categoryTag: '科技政策',
    responseTitle: '高新申报与科技财税政策要点',
    responseText: '针对科技创新型分子公司的高新申报与税收优惠归集要点如下：\n\n🔬 **一、高新技术企业核心认定条件**：\n1. 核心技术需拥有自主知识产权（I类知识产权 1 项以上或 II 类 5 项以上）；\n2. 近一年高新技术产品（服务）收入占企业同期总收入的比例不低于 **60%**；\n3. 研发费用占销售收入比例：销售收入≤5000万的企业不低于 5%，5000万~2亿不低于 4%，2亿以上不低于 3%。\n\n💰 **二、研发费用加计扣除新规**：\n- 科技型中小企业及符合条件的制造业企业开展研发活动中实际发生的研发费用，未形成无形资产计入当期损益的，按实际发生额的 **100%** 在税前加计扣除。'
  },
  {
    id: 'qa-card-6',
    question: '集团公文流转、用印申请与保密管理规程？',
    categoryTag: '综合行政',
    responseTitle: '公文运转、电子印章与信息安全管理要求',
    responseText: '根据集团综合办公室公文与行政管理规程：\n\n📨 **一、公文流转时效要求**：\n- **特急公文**：随到随办，原则上 2 小时内核转；\n- **紧急公文**：1 个工作日内完成会签与批转；\n- **常规文件**：3 个工作日内办结。\n\n🖋️ **二、用印合规规范**：\n- 严禁在空白纸张、空白凭证或未经审批的文件上加盖公章；\n- 电子印章系统已与CA数字证书及水印防伪加密全面绑定，打印自动附带防伪追溯防伪码。'
  }
];

interface QaMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  title?: string;
  categoryTag?: string;
  sections?: Array<{ title: string; content: string | string[] }>;
  timestamp?: string;
}

interface QaAgentChatViewProps {
  agent: AgentItem;
  onBack: () => void;
}

export const QaAgentChatView: React.FC<QaAgentChatViewProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<QaMessage[]>([]);
  const [cardIndex, setCardIndex] = useState(0);

  const [activeSubView, setActiveSubView] = useState<'chat' | 'skillTree' | 'scheduleShare'>('chat');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [likedMsgs, setLikedMsgs] = useState<Record<string, 'like' | 'dislike'>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Avatar eye tracking
  const avatarRef = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  const showToast = (txt: string) => {
    setToastMsg(txt);
    setTimeout(() => setToastMsg(null), 2000);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const deltaX = clientX - avatarCenterX;
      const deltaY = clientY - avatarCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 3.5;
      const angle = Math.atan2(deltaY, deltaX);

      const moveDist = Math.min(distance / 25, maxDistance);
      setEyePos({
        x: Math.cos(angle) * moveDist,
        y: Math.sin(angle) * moveDist
      });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Hello，上午好';
    if (hour < 18) return 'Hello，下午好';
    return 'Hello，晚上好';
  };

  const handleNextCard = () => {
    setCardIndex((prev) => (prev + 1) % qaPromptCards.length);
  };

  const handleSendQuery = (questionText: string) => {
    if (!questionText.trim()) return;

    const matchedCard = qaPromptCards.find((c) => c.question === questionText);
    const userMsgId = 'user_' + Date.now();
    const aiMsgId = 'ai_' + (Date.now() + 1);

    const newMessages: QaMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: questionText,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(newMessages);

    setTimeout(() => {
      if (matchedCard) {
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            title: matchedCard.responseTitle,
            text: matchedCard.responseText,
            categoryTag: matchedCard.categoryTag || '专业解答',
            sections: matchedCard.sections,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            title: `关于“${questionText}”的解答`,
            categoryTag: '智能问答',
            text: `针对您咨询的【${questionText}】，智能问答助手已检索集团知识库与最新规章制度：\n\n📌 **核心政策解答**：\n已精准匹配集团制度与操作指引，相关流程已实现全面线上化与智能化流转。\n\n📋 **办理与推进建议**：\n1. 请在企业移动办公平台【我的待办】或相关专区进行申报流转；\n2. 如涉及重大合规事项或资金支出，请提前完成事前审批程序；\n3. 遇到疑问可随时向我发起追问或联系集团对应主管部门。`,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }, 700);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const q = inputText.trim();
    setInputText('');
    handleSendQuery(q);
  };

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

  const currentCard = qaPromptCards[cardIndex] || qaPromptCards[0];

  return (
    <div
      className="flex flex-col h-full bg-cover bg-top bg-no-repeat relative overflow-hidden select-none animate-fade-in font-sans"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}agent-bg.svg'), linear-gradient(180deg, #edf4fe 0%, #f6f8fd 40%, #ffffff 100%)`
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
            showToast('已开启全新问答会话');
          }}
          className="system-plus-button"
          title="新增对话"
        >
          <Plus />
        </button>
      </div>

      {/* Main Content Area */}
      {messages.length === 0 ? (
        /* ================= 1:1 REPLICA INITIAL STATE WITH AVATAR & CARD DECK ================= */
        <div className="flex-1 flex flex-col items-center justify-between px-4 pb-2 pt-1 overflow-y-auto">
          {/* Top Animated Avatar Section */}
          <div className="flex flex-col items-center mt-2 relative">
            {/* Ambient Background Gradient Glow behind Mascot */}
            <div className="absolute -top-3 w-36 h-36 bg-blue-300/30 rounded-full blur-2xl pointer-events-none" />

            {/* Glowing 3D Robot Mascot with interactive eye tracking */}
            <div
              ref={avatarRef}
              className="w-24 h-24 relative flex items-center justify-center mb-3 transition-transform hover:scale-105"
            >
              {/* Outer Head Body */}
              <div className="w-22 h-20 bg-gradient-to-b from-white to-slate-100 rounded-[28px] shadow-[0_8px_20px_rgba(0,112,243,0.18)] border-2 border-white flex items-center justify-center relative overflow-hidden">
                {/* Robot Face Screen */}
                <div className="w-[72px] h-[52px] bg-slate-900 rounded-[18px] flex items-center justify-center gap-3 relative shadow-inner">
                  {/* Left Eye */}
                  <div className="w-3.5 h-3.5 bg-sky-400 rounded-full flex items-center justify-center shadow-[0_0_8px_#38bdf8] overflow-hidden">
                    <div
                      className="w-2 h-2 bg-white rounded-full transition-transform duration-75"
                      style={{
                        transform: `translate(${eyePos.x}px, ${eyePos.y}px)`
                      }}
                    />
                  </div>
                  {/* Right Eye */}
                  <div className="w-3.5 h-3.5 bg-sky-400 rounded-full flex items-center justify-center shadow-[0_0_8px_#38bdf8] overflow-hidden">
                    <div
                      className="w-2 h-2 bg-white rounded-full transition-transform duration-75"
                      style={{
                        transform: `translate(${eyePos.x}px, ${eyePos.y}px)`
                      }}
                    />
                  </div>
                  {/* Cute Pink Blushes */}
                  <div
                    className="absolute bottom-1.5 left-2.5 w-2 h-1 bg-pink-400/80 rounded-full blur-[0.5px] transition-transform duration-75"
                    style={{
                      transform: `translate(${eyePos.x * 0.5}px, ${eyePos.y * 0.5}px)`
                    }}
                  />
                  <div
                    className="absolute bottom-1.5 right-2.5 w-2 h-1 bg-pink-400/80 rounded-full blur-[0.5px] transition-transform duration-75"
                    style={{
                      transform: `translate(${eyePos.x * 0.5}px, ${eyePos.y * 0.5}px)`
                    }}
                  />
                </div>

                {/* Ear Antennas Left & Right */}
                <div className="absolute -left-1 w-2.5 h-4 bg-gradient-to-r from-blue-400 to-sky-400 rounded-l-md" />
                <div className="absolute -right-1 w-2.5 h-4 bg-gradient-to-l from-blue-400 to-sky-400 rounded-r-md" />
              </div>
            </div>

            {/* Time-based Greeting */}
            <p className="text-[14px] text-slate-500 font-medium mb-0.5">
              {getGreeting()}
            </p>

            {/* Agent Name */}
            <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight mb-1.5">
              智能问答
            </h2>

            {/* Subtitle Description */}
            <p className="text-[13px] text-slate-500 max-w-[280px] text-center leading-relaxed font-normal">
              一站式为您解答集团通用政策、人力、财务、法务等专业问题及日常疑问。
            </p>
          </div>

          {/* Interactive Card Deck with Drag-to-Switch and Quotes (Scaled to 90%) */}
          <div className="w-full max-w-[340px] my-auto pt-3 pb-1 flex flex-col items-center scale-90 origin-center">
            {/* Card Stack Container */}
            <div className="relative w-full h-[210px] flex items-center justify-center">
              {/* Layer 3 - Back Bottom Card */}
              <div
                className="absolute w-[86%] h-[180px] bg-white/70 rounded-3xl border border-white/80 shadow-sm"
                style={{ transform: 'translateY(16px) scale(0.92)' }}
              />

              {/* Layer 2 - Middle Card */}
              <div
                className="absolute w-[93%] h-[185px] bg-white/90 rounded-3xl border border-white shadow-md"
                style={{ transform: 'translateY(8px) scale(0.96)' }}
              />

              {/* Layer 1 - Active Top Interactive Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cardIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.65}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold || info.velocity.x < -300) {
                      setCardIndex((prev) => (prev + 1) % qaPromptCards.length);
                    } else if (info.offset.x > swipeThreshold || info.velocity.x > 300) {
                      setCardIndex((prev) => (prev - 1 + qaPromptCards.length) % qaPromptCards.length);
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.94, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -10 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="absolute inset-0 bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,112,243,0.12)] border border-slate-100 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Top Quote Mark & Category Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[32px] text-slate-300 font-serif leading-none select-none">
                      “
                    </span>
                    {currentCard.categoryTag && (
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80">
                        {currentCard.categoryTag}
                      </span>
                    )}
                  </div>

                  {/* Centered Question Content */}
                  <div className="flex-1 flex items-center justify-center px-3 py-1">
                    <p className="text-[16px] font-bold text-slate-800 text-center leading-relaxed">
                      {currentCard.question}
                    </p>
                  </div>

                  {/* Bottom Quote & Action Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[32px] text-slate-300 font-serif leading-none select-none">
                      ”
                    </span>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextCard();
                        }}
                        className="flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 active:scale-95 transition-all font-medium"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>换一换</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendQuery(currentCard.question);
                        }}
                        className="flex items-center gap-1 text-[13px] text-white bg-[#0070f3] hover:bg-blue-600 px-3.5 py-1.5 rounded-full font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                      >
                        <span>问一问</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* ================= CONVERSATION LOG STREAM ================= */
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end animate-fade-in">
                  <div className="bg-[#0070f3] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-[14px] font-medium shadow-2xs max-w-[85%]">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // AI Response Cards
            return (
              <div key={msg.id} className="flex flex-col gap-2.5 animate-fade-in max-w-[96%]">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/90 space-y-3.5 text-slate-800">
                  {/* AI Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white text-[12px] font-bold shadow-2xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[14px] text-slate-900">智能问答</span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {msg.categoryTag || '专业解答'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {msg.timestamp || '刚刚'}
                    </span>
                  </div>

                  {/* Title */}
                  {msg.title && (
                    <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                      {msg.title}
                    </h3>
                  )}

                  {/* Main Text Content */}
                  {msg.text && (
                    <div className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>
                  )}

                  {/* Extra Structured Sections */}
                  {msg.sections && msg.sections.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {msg.sections.map((sec, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-[13px] space-y-1"
                        >
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                            <span>{sec.title}</span>
                          </div>
                          {Array.isArray(sec.content) ? (
                            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                              {sec.content.map((cItem, cIdx) => (
                                <li key={cIdx}>{cItem}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-600">{sec.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Action Icons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (playingMsgId === msg.id) {
                            setPlayingMsgId(null);
                            showToast('已暂停朗读');
                          } else {
                            setPlayingMsgId(msg.id);
                            showToast('正在为您语音朗读回答...');
                          }
                        }}
                        className={`hover:text-blue-600 transition-colors p-1 flex items-center gap-1 ${
                          playingMsgId === msg.id ? 'text-blue-600 font-semibold' : ''
                        }`}
                        title="朗读"
                      >
                        {playingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-4 h-4 animate-pulse" />
                            <span className="text-[11px]">朗读中</span>
                          </>
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
                        onClick={() => showToast('文档已导出为 PDF / 政策简报')}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="导出文档"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          showToast('正在重新检索集团知识库...');
                          setTimeout(() => showToast('已更新为最新政策版本'), 1000);
                        }}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="重新生成"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveSubView('scheduleShare')}
                        className="hover:text-blue-600 transition-colors p-1"
                        title="定时分享 / 推送"
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
                          showToast('已记录您的反馈，将持续优化政策库回答');
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

      {/* Bottom Control & Input Bar (Exact match to Image 1: Pure White Background) */}
      <div className="bg-white border-t border-slate-100 p-3 space-y-2 z-20">
        {/* Pills Row with #465467 */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[12px]">
          {/* 1. 深度思考 Toggle */}
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

          {/* 2. 政策知识库 */}
          <button
            type="button"
            onClick={() => setIsKnowledgeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
          >
            <Folder className="w-3.5 h-3.5 text-[#465467]" />
            <span className="text-[#465467]">政策知识库</span>
          </button>

          {/* 3. 分享管理 */}
          <button
            type="button"
            onClick={() => setActiveSubView('scheduleShare')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-[#465467]" />
            <span className="text-[#465467]">分享管理</span>
          </button>

          {/* 4. 技能树 */}
          <button
            type="button"
            onClick={() => setActiveSubView('skillTree')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-[#465467] font-medium hover:bg-slate-50 transition-colors active:scale-95 shadow-2xs"
          >
            <Award className="w-3.5 h-3.5 text-[#465467]" />
            <span className="text-[#465467]">技能树</span>
          </button>
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={handleFormSubmit}
          className="bg-white rounded-full px-3.5 py-2 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-2.5 focus-within:border-slate-300 focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all"
        >
          {/* Left Camera Icon */}
          <button
            type="button"
            onClick={() => showToast('已调起相机拍照 / 上传文件')}
            className="w-7 h-7 flex items-center justify-center text-[#465467] hover:text-blue-600 active:scale-95 transition-all flex-shrink-0"
            title="拍照 / 上传"
          >
            <Camera className="w-[21px] h-[21px] stroke-[1.9]" />
          </button>

          {/* Middle Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="发消息或按住说话..."
            className="flex-1 bg-transparent text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none leading-normal min-w-0"
          />

          {/* Voice Wave Button (Image 2: Triggers VoiceListeningModal in Image 3) */}
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

          {/* Right Send Action Button */}
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
              onClick={() => showToast('更多扩展功能：文档检索、制度关联、法条引用')}
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

      {/* Policy Knowledge Base Modal */}
      {isKnowledgeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-5 space-y-4 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                <h3 className="text-[16px] font-bold text-slate-900">集团政策知识库</h3>
              </div>
              <button
                onClick={() => setIsKnowledgeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {[
                { title: '广新集团差旅及业务支出管理办法（2025版）', type: '财务制度', count: '124条' },
                { title: '职工带薪年休假与考勤休假实施细则', type: '人力规章', count: '86条' },
                { title: '重大合同审查与法务合规防范指引汇编', type: '法务风控', count: '210条' },
                { title: '高新技术企业申报与研发费用税前加计扣除指引', type: '科技政策', count: '52条' },
                { title: '综合公文流转、用印及商业秘密保护规定', type: '行政规程', count: '98条' }
              ].map((kb, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setIsKnowledgeModalOpen(false);
                    showToast(`已挂载《${kb.title}》知识库`);
                  }}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[13px] font-medium text-slate-800 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="line-clamp-1">{kb.title}</span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-normal">{kb.type}</span>
                      <span>收录 {kb.count} 细则</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-blue-600 stroke-[2.5] shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
