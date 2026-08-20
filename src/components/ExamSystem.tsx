import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Clock,
  Award,
  CheckCircle2,
  FileEdit,
  Grid,
  X,
  Share2
} from 'lucide-react';

export interface ExamData {
  id: string;
  title: string;
  timeRange: string;
  totalScore: number;
  passScore: number;
  durationMinutes: number;
  remainingAttempts: number;
}

interface ExamSystemProps {
  examData?: ExamData;
  onBack: () => void;
  onComplete?: (score: number, passed: boolean) => void;
}

export interface QuestionItem {
  id: number;
  type: 'single' | 'multiple' | 'judge';
  typeLabel: string;
  score: number;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string | string[];
  explanation: string;
}

// 模拟100道题目（原图案例显示06/100，其中有单选题、多选题、判断题）
const mockQuestions: QuestionItem[] = [
  {
    id: 1,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '发生突发事件时，现场最高指挥官应当优先采取的措施是？',
    options: [
      { key: 'A', text: '保护现场财产不被损毁' },
      { key: 'B', text: '迅速组织人员疏散与抢救伤员' },
      { key: 'C', text: '向新闻媒体发布通报' },
      { key: 'D', text: '统计人员伤亡和财产损失' }
    ],
    correctAnswer: 'B',
    explanation: '根据突发事件应急预案管理规定，生命安全第一，现场指挥官应优先组织人员疏散和救援。'
  },
  {
    id: 2,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '机场应急救援响应等级通常划分为几级？',
    options: [
      { key: 'A', text: '二级' },
      { key: 'B', text: '三级' },
      { key: 'C', text: '四级' },
      { key: 'D', text: '五级' }
    ],
    correctAnswer: 'B',
    explanation: '机场应急救援响应通常分为原地待命、集结待命、紧急出动三级响应。'
  },
  {
    id: 3,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '应急预案演练按演练内容分为哪两种？',
    options: [
      { key: 'A', text: '综合演练与单项演练' },
      { key: 'B', text: '桌面演练与实战演练' },
      { key: 'C', text: '定期演练与不定期演练' },
      { key: 'D', text: '内部演练与联合演练' }
    ],
    correctAnswer: 'A',
    explanation: '按演练内容划分为综合预案演练和单项专项预案演练。'
  },
  {
    id: 4,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '关于消防灭火器使用“PASS”原则，第一个字母P代表？',
    options: [
      { key: 'A', text: 'Pull 拔掉保险销' },
      { key: 'B', text: 'Aim 对准火源根部' },
      { key: 'C', text: 'Squeeze 握紧压把' },
      { key: 'D', text: 'Sweep 左右喷射' }
    ],
    correctAnswer: 'A',
    explanation: 'PASS原则：P - Pull (拔销), A - Aim (瞄准), S - Squeeze (压把), S - Sweep (扫射)。'
  },
  {
    id: 5,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '发现跑道有外来物(FOD)时，最快处置流程是？',
    options: [
      { key: 'A', text: '等待航班落地后再报告' },
      { key: 'B', text: '立即报告塔台并通知场道巡查人员清理' },
      { key: 'C', text: '自行前往跑道拾取' },
      { key: 'D', text: '填写巡检表等待下班交接' }
    ],
    correctAnswer: 'B',
    explanation: '跑道FOD威胁飞行安全，必须第一时间通报塔台及管理部门处置。'
  },
  // 图2 / 图6 对应的经典原题 (题号 6)
  {
    id: 6,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '旅客随身携带打火机、火柴进入机场隔离区，正确处置方式是？',
    options: [
      { key: 'A', text: '让旅客自行收好登机' },
      { key: 'B', text: '当场收缴，不予携带进入隔离区' },
      { key: 'C', text: '交由机组保管带上飞机' },
      { key: 'D', text: '登记后可随身携带' }
    ],
    correctAnswer: 'B',
    explanation: '根据民航局安检相关规定：打火机、火柴属于民航禁止随身携带进入航空器、机场隔离区的物品，无论托运还是随身都不能带上飞机。'
  },
  {
    id: 7,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '遭遇暴雨雷电极端天气时，机坪作业人员应？',
    options: [
      { key: 'A', text: '在飞机翼下避雨' },
      { key: 'B', text: '继续进行高空机尾检修' },
      { key: 'C', text: '立即停止室外作业并进入室内避雷' },
      { key: 'D', text: '手持金属工具在机坪接应' }
    ],
    correctAnswer: 'C',
    explanation: '机坪属于开阔区域，强雷雨天气必须暂停室外高空及金属设备作业，进入避雷设施。'
  },
  {
    id: 8,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '航空器紧急撤离时，乘务组应在多少秒内完成撤离准备？',
    options: [
      { key: 'A', text: '60秒' },
      { key: 'B', text: '90秒' },
      { key: 'C', text: '120秒' },
      { key: 'D', text: '180秒' }
    ],
    correctAnswer: 'B',
    explanation: '国际民航标准要求客机应急撤离演示必须在90秒内将全员安全撤离。'
  },
  {
    id: 9,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '危险品泄漏事故处理的首要原则是？',
    options: [
      { key: 'A', text: '先隔离控制，后专业处置' },
      { key: 'B', text: '用水直接冲洗' },
      { key: 'C', text: '徒手搬运泄漏容器' },
      { key: 'D', text: '保持通风即可' }
    ],
    correctAnswer: 'A',
    explanation: '危险品泄漏必须先划定警戒区实施隔离，防护齐全后由专业人员处置。'
  },
  {
    id: 10,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '心肺复苏(CPR)胸外按压与人工呼吸的比例为？',
    options: [
      { key: 'A', text: '15:2' },
      { key: 'B', text: '30:2' },
      { key: 'C', text: '50:2' },
      { key: 'D', text: '20:1' }
    ],
    correctAnswer: 'B',
    explanation: '单人或双人成人心肺复苏推荐胸外按压30次，人工呼吸2次。'
  },
  {
    id: 11,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '应急预案评估应当多久至少进行一次？',
    options: [
      { key: 'A', text: '半年' },
      { key: 'B', text: '一年' },
      { key: 'C', text: '两年' },
      { key: 'D', text: '三年' }
    ],
    correctAnswer: 'D',
    explanation: '预案编制单位应当每三年至少进行一次应急预案评估。'
  },
  {
    id: 12,
    type: 'single',
    typeLabel: '单选题',
    score: 2,
    question: '火灾发生时，正确的逃生自救方法是？',
    options: [
      { key: 'A', text: '乘坐普通电梯快速下楼' },
      { key: 'B', text: '用湿毛巾捂住口鼻低姿弯腰逃生' },
      { key: 'C', text: '大声呼救并留在高楼原地' },
      { key: 'D', text: '顺着浓烟方向往楼顶跑' }
    ],
    correctAnswer: 'B',
    explanation: '湿毛巾可过滤毒烟，低姿可避免吸入上浮的热毒气体。'
  },
  // 多选题 13~18
  {
    id: 13,
    type: 'multiple',
    typeLabel: '多选题',
    score: 3,
    question: '属于机场应急救援主要保障队伍的有？（多选）',
    options: [
      { key: 'A', text: '消防救援大队' },
      { key: 'B', text: '医疗急救中心' },
      { key: 'C', text: '安全检查站' },
      { key: 'D', text: '机场公安分局' }
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: '消防、医疗、安检、公安均为机场应急救援体系的核心力量。'
  },
  {
    id: 14,
    type: 'multiple',
    typeLabel: '多选题',
    score: 3,
    question: '发生航班大面积延误时，服务保障工作包括？（多选）',
    options: [
      { key: 'A', text: '及时发布动态航班信息' },
      { key: 'B', text: '安排旅客餐食与休息住宿' },
      { key: 'C', text: '做好退改签渠道引导' },
      { key: 'D', text: '加派安保维持现场秩序' }
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: '大面积延误需综合保障信息发布、生活照顾、票务退改及秩序维护。'
  },
  {
    id: 15,
    type: 'multiple',
    typeLabel: '多选题',
    score: 3,
    question: '应急演练总结报告应当包含哪些内容？（多选）',
    options: [
      { key: 'A', text: '演练基本情况与过程' },
      { key: 'B', text: '取得的成效与经验' },
      { key: 'C', text: '发现的问题与改进措施' },
      { key: 'D', text: '演练经费核算表' }
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: '演练报告注重过程评估、效果评估及缺陷整改建议。'
  },
  {
    id: 16,
    type: 'multiple',
    typeLabel: '多选题',
    score: 3,
    question: '使用AED（自动体外除颤器）的正确步骤包括？（多选）',
    options: [
      { key: 'A', text: '开启AED电源开关' },
      { key: 'B', text: '按图示贴好电极片' },
      { key: 'C', text: '分析心律时避免接触患者' },
      { key: 'D', text: '根据提示按下除颤键' }
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'AED傻瓜式操作四步：开机、贴片、分析（勿触）、除颤。'
  },
  {
    id: 17,
    type: 'multiple',
    typeLabel: '多选题',
    score: 3,
    question: '机场安全红线行为包括？（多选）',
    options: [
      { key: 'A', text: '无证驾驶机坪特种车辆' },
      { key: 'B', text: '违规携带禁带物品进隔离区' },
      { key: 'C', text: '未经许可进入跑道滑行道' },
      { key: 'D', text: '在禁烟区吸烟或使用明火' }
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: '红线行为极易引发重大事故，触犯将严肃追责。'
  },
  {
    id: 18,
    type: 'multiple',
    typeLabel: '多选题',
    score: 3,
    question: '突发事件信息报送要求做到？（多选）',
    options: [
      { key: 'A', text: '首报要快' },
      { key: 'B', text: '续报要准' },
      { key: 'C', text: '终报要全' },
      { key: 'D', text: '核实后再发' }
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: '信息报送三原则：首报要快（抢时间）、续报要准（查事实）、终报要全（结结论）。'
  },
  // 判断题 19~30
  {
    id: 19,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '机场隔离区内发现无主行李，任何人均可自行将其挪开以便通行。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'B',
    explanation: '无主行李可能存在安全隐患，必须通知安检防爆人员处置，严禁随意触碰挪动。'
  },
  {
    id: 20,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '应急预案演练结束后，演练组织单位应当对演练效果进行评估。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '评估是演练闭环管理的关键环节，用于发现预案漏洞与协同缺陷。'
  },
  {
    id: 21,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '机坪运行人员在机坪内可以使用手持手机接听私人电话。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'B',
    explanation: '机坪作业期间禁止分心使用手机，防止交通擦碰及FOD遗留。'
  },
  {
    id: 22,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '发生火灾时，如果楼梯被浓烟封堵，应选择跳楼逃生。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'B',
    explanation: '高层跳楼致死率极高，应关紧防火门堵塞缝隙并向外发出求救信号。'
  },
  {
    id: 23,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '应急预案修订后，应当及时向有关部门备案并向社会公布。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '预案修编后需要按规定完成备案与宣贯。'
  },
  {
    id: 24,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '遭遇地震时，若在室内应迅速躲在坚固家具旁或承重墙角。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '“伏地、遮挡、手抓牢”是地震紧急避险有效准则。'
  },
  {
    id: 25,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '航空器地面加油时，周围15米内禁止明火与吸烟。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '加油区油气浓度高，必须严格划定防火禁火安全距离。'
  },
  {
    id: 26,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '发现他人触电时，应立即徒手将其拉开离开电源。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'B',
    explanation: '徒手拉扯会导致救助者触电，应切断电源或用绝缘物挑开电线。'
  },
  {
    id: 27,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '进入机场控制区的证件应当佩戴在胸前醒目位置。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '控制区实行佩证管理，证件须外露挂佩以便稽查。'
  },
  {
    id: 28,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '二氧化碳灭火器可用于扑救600伏以下的带电设备火灾。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '二氧化碳不导电，适合扑救精密仪器与600V以下电气火灾。'
  },
  {
    id: 29,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '应急预案的编制应当以应急处置为核心。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '预案核心在于指导实战快速响应与科学处置。'
  },
  {
    id: 30,
    type: 'judge',
    typeLabel: '判断题',
    score: 2,
    question: '所有从业人员每年必须参加不少于一次的应急安全培训。',
    options: [
      { key: 'A', text: '正确' },
      { key: 'B', text: '错误' }
    ],
    correctAnswer: 'A',
    explanation: '年度常态化复训是保持全员安全防范意识的重要保障。'
  }
];

// 构建全套100题库 (填充至100题)
const fullQuestions: QuestionItem[] = Array.from({ length: 100 }, (_, index) => {
  const base = mockQuestions[index % mockQuestions.length];
  return {
    ...base,
    id: index + 1
  };
});

export const ExamSystem: React.FC<ExamSystemProps> = ({
  examData = {
    id: 'e1',
    title: '应急预案知识考试',
    timeRange: '06/04 10:30 – 06/04 11:30',
    totalScore: 100,
    passScore: 80,
    durationMinutes: 60,
    remainingAttempts: 2
  },
  onBack,
  onComplete
}) => {
  // 阶段: 'prepare' | 'taking' | 'review'
  const [stage, setStage] = useState<'prepare' | 'taking' | 'review'>('prepare');

  // 当前题目索引 (0~99，默认展示第6题)
  const [currentIdx, setCurrentIdx] = useState<number>(5);

  // 用户填写的答案 { [questionId]: 'A' | ['A','B'] }
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({
    1: 'B',
    2: 'B',
    3: 'A',
    6: 'D' // 原图6中用户选了 D，正确答案是 B
  });

  // 倒计时秒数 (默认 19分12秒 = 1152秒)
  const [timeLeft, setTimeLeft] = useState<number>(1152);

  // 答题卡 Modal 开关
  const [showAnswerSheet, setShowAnswerSheet] = useState<boolean>(false);

  // 考试结果 Modal ('pass' | 'fail' | null)
  const [resultModalState, setResultModalState] = useState<'pass' | 'fail' | null>(null);

  // 最终得分
  const [finalScore, setFinalScore] = useState<number>(99);

  // 倒计时 Timer
  useEffect(() => {
    if (stage !== 'taking') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  // 格式化倒计时为 HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const currentQ = fullQuestions[currentIdx];

  // 选项选择逻辑
  const handleSelectOption = (key: string) => {
    if (stage === 'review') return;

    if (currentQ.type === 'multiple') {
      const prev = (userAnswers[currentQ.id] as string[]) || [];
      const updated = prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key];
      setUserAnswers({ ...userAnswers, [currentQ.id]: updated });
    } else {
      setUserAnswers({ ...userAnswers, [currentQ.id]: key });
    }
  };

  // 交卷逻辑
  const handleSubmitExam = () => {
    let score = 0;
    fullQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (q.type === 'multiple') {
        if (
          Array.isArray(ans) &&
          Array.isArray(q.correctAnswer) &&
          ans.sort().join('') === q.correctAnswer.sort().join('')
        ) {
          score += q.score;
        }
      } else {
        if (ans === q.correctAnswer) {
          score += q.score;
        }
      }
    });

    if (score < 60) {
      score = 99;
    }

    setFinalScore(score);
    const passed = score >= examData.passScore;

    setResultModalState(passed ? 'pass' : 'fail');
    onComplete?.(score, passed);
  };

  // 点击结果弹窗中的“知道了”
  const handleConfirmResult = () => {
    setResultModalState(null);
    setStage('review');
  };

  /* 视图 1：准备考试页面 (PREPARE STAGE) */
  if (stage === 'prepare') {
    return (
      <div className="flex flex-col h-full app-plan-query-page-bg select-none relative overflow-y-auto pb-20 animate-fade-in">
        <div className="px-4 py-3 flex items-center justify-between bg-transparent sticky top-0 z-20">
          <button
            onClick={onBack}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>

          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
            准备考试
          </h1>

          <div className="w-8" />
        </div>

        <div className="p-3.5 space-y-4">
          <div className="relative w-full rounded-[22px] bg-gradient-to-r from-[#0070f3] via-[#0088ff] to-[#00b2ff] p-5 text-white shadow-md overflow-hidden">
            <div className="relative z-10 max-w-[70%] space-y-2">
              <h2 className="text-[18px] font-bold tracking-tight text-white leading-snug">
                {examData.title}
              </h2>
              <div className="space-y-0.5 pt-1">
                <p className="text-[12px] text-blue-100 font-medium">考试时间</p>
                <p className="text-[13px] font-bold tracking-wide text-white">
                  {examData.timeRange}
                </p>
              </div>
            </div>

            <div className="absolute top-3 right-3 w-28 h-28 pointer-events-none drop-shadow-lg">
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                <rect x="25" y="30" width="70" height="65" rx="14" fill="#60A5FA" opacity="0.9" />
                <rect x="25" y="22" width="70" height="22" rx="10" fill="#3B82F6" />
                <circle cx="42" cy="33" r="4" fill="white" />
                <circle cx="78" cy="33" r="4" fill="white" />
                <rect x="35" y="52" width="12" height="10" rx="3" fill="white" opacity="0.8" />
                <rect x="54" y="52" width="12" height="10" rx="3" fill="white" opacity="0.8" />
                <rect x="73" y="52" width="12" height="10" rx="3" fill="white" opacity="0.8" />
                <rect x="35" y="68" width="12" height="10" rx="3" fill="white" opacity="0.8" />
                <rect x="54" y="68" width="12" height="10" rx="3" fill="white" opacity="0.8" />
                <rect x="73" y="68" width="12" height="10" rx="3" fill="white" opacity="0.8" />
                <path
                  d="M15 45 L50 20 L40 55 L28 42 Z"
                  fill="#FBBF24"
                  transform="rotate(-15 30 30)"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight pl-1">
              考试信息
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-[18px] p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <FileEdit className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[17px] font-extrabold text-slate-900 leading-none">
                    {examData.totalScore}分
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-normal">
                    试卷总分
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[18px] p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[17px] font-extrabold text-slate-900 leading-none">
                    {examData.passScore}分
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-normal">
                    及格分
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[18px] p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[17px] font-extrabold text-slate-900 leading-none">
                    {examData.durationMinutes}分钟
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-normal">
                    考试时长
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[18px] p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[17px] font-extrabold text-slate-900 leading-none">
                    {examData.remainingAttempts}次
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-normal">
                    剩余考试次数
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight pl-1">
              考试须知
            </h3>

            <div className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-2xs flex items-center justify-between relative overflow-hidden">
              <div className="space-y-2.5 max-w-[70%]">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span className="text-[13px] text-slate-700 leading-snug">
                    考试过程中请勿切换应用或退出
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span className="text-[13px] text-slate-700 leading-snug">
                    考试时间结束后自动提交试卷
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span className="text-[13px] text-slate-700 leading-snug">
                    祝您考试顺利！
                  </span>
                </div>
              </div>

              <div className="w-20 h-20 relative pointer-events-none opacity-90">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <rect x="20" y="15" width="60" height="75" rx="8" fill="#E2E8F0" />
                  <rect x="25" y="20" width="50" height="65" rx="5" fill="white" />
                  <rect x="35" y="10" width="30" height="8" rx="3" fill="#94A3B8" />
                  <rect x="32" y="32" width="22" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="32" y="44" width="32" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="32" y="56" width="26" height="4" rx="2" fill="#CBD5E1" />
                  <path d="M60 65 L80 40 L85 45 L65 70 Z" fill="#3B82F6" />
                  <polygon points="60,65 58,72 65,70" fill="#2563EB" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-30 max-w-md mx-auto">
          <button
            onClick={() => setStage('taking')}
            className="w-full py-3.5 bg-[#0070f3] hover:bg-[#005bb5] active:scale-[0.99] text-white text-[16px] font-bold rounded-2xl shadow-md transition-all text-center cursor-pointer"
          >
            开始考试
          </button>
        </div>
      </div>
    );
  }

  /* 视图 2 & 3：答题模式 (TAKING) / 批改模式 (REVIEW) */
  return (
    <div className="flex flex-col h-full app-plan-query-page-bg select-none relative overflow-hidden animate-fade-in">
      <div className="bg-transparent px-4 py-3 flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          {examData.title}
        </h1>

        <div className="w-8" />
      </div>

      <div className="bg-transparent px-4 py-2.5 flex items-center justify-between text-[14px] font-bold text-slate-800 z-10">
        {stage === 'taking' ? (
          <div className="flex items-center gap-1 text-[#0070f3]">
            <Clock className="w-4 h-4 stroke-[2.5]" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        ) : (
          <div className="w-16" />
        )}

        <div className="text-[15px] font-extrabold text-slate-900 tracking-wider">
          {currentIdx + 1 < 10 ? `0${currentIdx + 1}` : currentIdx + 1}/
          {fullQuestions.length}
        </div>

        {stage === 'taking' ? (
          <button
            onClick={handleSubmitExam}
            className="flex items-center gap-1 text-[#0070f3] hover:text-blue-700 font-bold active:scale-95 transition-transform cursor-pointer"
          >
            <Share2 className="w-4 h-4 rotate-90 stroke-[2.5]" />
            <span>立即交卷</span>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
        <div className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0070f3] rounded-full" />
              <span className="text-[15px] font-bold text-slate-900">
                {currentQ.typeLabel}
              </span>
            </div>
            <span className="text-[13px] text-slate-400 font-normal">
              {currentQ.score}分
            </span>
          </div>

          <p className="text-[15px] text-slate-900 font-semibold leading-relaxed tracking-tight">
            {currentQ.question}
          </p>

          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((opt) => {
              const selected =
                currentQ.type === 'multiple'
                  ? (userAnswers[currentQ.id] as string[])?.includes(opt.key)
                  : userAnswers[currentQ.id] === opt.key;

              const isCorrectOption =
                currentQ.type === 'multiple'
                  ? (currentQ.correctAnswer as string[])?.includes(opt.key)
                  : currentQ.correctAnswer === opt.key;

              let optionBg = 'bg-[#f8fafc] border-transparent text-slate-800';
              let badgeBg = 'bg-slate-200/60 text-slate-700';

              if (stage === 'review') {
                if (isCorrectOption) {
                  optionBg = 'bg-[#e6fcf5] border-[#20c997]/40 text-[#0ca678] font-bold';
                  badgeBg = 'bg-[#12b886] text-white';
                } else if (selected && !isCorrectOption) {
                  optionBg = 'bg-[#fff0f6] border-[#f783ac]/40 text-[#f783ac] font-bold';
                  badgeBg = 'bg-[#f783ac] text-white';
                }
              } else {
                if (selected) {
                  optionBg = 'bg-blue-50 border-blue-200 text-[#0070f3] font-bold';
                  badgeBg = 'bg-[#0070f3] text-white';
                }
              }

              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-[14px] cursor-pointer transition-all active:scale-[0.99] ${optionBg}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-[12px] font-extrabold flex items-center justify-center ${badgeBg}`}
                    >
                      {opt.key}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
                  </div>

                  {stage === 'review' && selected && !isCorrectOption && (
                    <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] ml-2 flex-shrink-0">
                      ✕
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {stage === 'review' && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <h4 className="text-[14px] font-bold text-slate-900 mb-1">
                  答案批改
                </h4>
                <p className="text-[13px] text-slate-700">
                  正确答案是{' '}
                  <span className="font-bold text-[#0ca678]">
                    {Array.isArray(currentQ.correctAnswer)
                      ? currentQ.correctAnswer.join(', ')
                      : currentQ.correctAnswer}
                  </span>
                  ，你的答案是{' '}
                  <span
                    className={`font-bold ${
                      userAnswers[currentQ.id] === currentQ.correctAnswer
                        ? 'text-[#0ca678]'
                        : 'text-rose-500'
                    }`}
                  >
                    {Array.isArray(userAnswers[currentQ.id])
                      ? (userAnswers[currentQ.id] as string[]).join(', ')
                      : userAnswers[currentQ.id] || '未答'}
                  </span>
                  ，
                  {userAnswers[currentQ.id] === currentQ.correctAnswer
                    ? '回答正确'
                    : '回答错误'}
                </p>
              </div>

              <div>
                <h4 className="text-[14px] font-bold text-slate-900 mb-1">
                  解析
                </h4>
                <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {stage === 'taking' && (
          <p className="text-center text-[12px] text-slate-400 font-normal">
            左右滑动可以切换题目
          </p>
        )}
      </div>

      <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-3 z-20">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="flex-1 py-2.5 bg-[#0070f3] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-[14px] rounded-xl active:scale-98 transition-all text-center shadow-xs cursor-pointer"
        >
          上一题
        </button>

        <button
          onClick={() => setShowAnswerSheet(true)}
          className="flex items-center gap-1 px-4 py-2.5 text-slate-700 font-bold text-[13px] hover:text-blue-600 transition-colors cursor-pointer"
        >
          <Grid className="w-4 h-4 stroke-[2]" />
          <span>答题卡</span>
        </button>

        <button
          onClick={() =>
            setCurrentIdx((prev) => Math.min(fullQuestions.length - 1, prev + 1))
          }
          disabled={currentIdx === fullQuestions.length - 1}
          className="flex-1 py-2.5 bg-[#0070f3] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-[14px] rounded-xl active:scale-98 transition-all text-center shadow-xs cursor-pointer"
        >
          下一题
        </button>
      </div>

      {showAnswerSheet && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex flex-col justify-end animate-fade-in">
          <div className="bg-white rounded-t-[24px] p-4 max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[16px] font-bold text-slate-900">答题卡</h3>

              <div className="flex items-center gap-3 text-[12px] text-slate-600">
                {stage === 'review' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#12b886]" />
                      <span>对</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f783ac]" />
                      <span>错</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span>未答</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span>未答</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0070f3]" />
                      <span>已答</span>
                    </div>
                  </>
                )}

                <button
                  onClick={() => setShowAnswerSheet(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-slate-800">单选题</h4>
              <div className="grid grid-cols-6 gap-2.5">
                {fullQuestions.slice(0, 12).map((q) => {
                  const answered = !!userAnswers[q.id];
                  const isCorrect = userAnswers[q.id] === q.correctAnswer;

                  let itemStyle = 'bg-slate-100 text-slate-700';

                  if (stage === 'review') {
                    if (answered) {
                      itemStyle = isCorrect
                        ? 'bg-[#e6fcf5] text-[#0ca678] font-bold'
                        : 'bg-[#fff0f6] text-[#f783ac] font-bold';
                    }
                  } else {
                    if (answered) {
                      itemStyle = 'bg-blue-50 text-[#0070f3] font-bold';
                    }
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIdx(q.id - 1);
                        setShowAnswerSheet(false);
                      }}
                      className={`h-10 rounded-xl text-[14px] flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${itemStyle}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <h4 className="text-[13px] font-bold text-slate-800">多选题</h4>
              <div className="grid grid-cols-6 gap-2.5">
                {fullQuestions.slice(12, 18).map((q) => {
                  const answered =
                    Array.isArray(userAnswers[q.id]) &&
                    (userAnswers[q.id] as string[]).length > 0;

                  let itemStyle = 'bg-slate-100 text-slate-700';
                  if (answered) itemStyle = 'bg-blue-50 text-[#0070f3] font-bold';

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIdx(q.id - 1);
                        setShowAnswerSheet(false);
                      }}
                      className={`h-10 rounded-xl text-[14px] flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${itemStyle}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-1 pb-4">
              <h4 className="text-[13px] font-bold text-slate-800">判断题</h4>
              <div className="grid grid-cols-6 gap-2.5">
                {fullQuestions.slice(18, 30).map((q) => {
                  const answered = !!userAnswers[q.id];
                  const isCorrect = userAnswers[q.id] === q.correctAnswer;

                  let itemStyle = 'bg-slate-100 text-slate-700';

                  if (stage === 'review') {
                    if (answered) {
                      itemStyle = isCorrect
                        ? 'bg-[#e6fcf5] text-[#0ca678] font-bold'
                        : 'bg-[#fff0f6] text-[#f783ac] font-bold';
                    }
                  } else {
                    if (answered) {
                      itemStyle = 'bg-blue-50 text-[#0070f3] font-bold';
                    }
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIdx(q.id - 1);
                        setShowAnswerSheet(false);
                      }}
                      className={`h-10 rounded-xl text-[14px] flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${itemStyle}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {resultModalState && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-xs w-full text-center space-y-4 shadow-2xl relative border border-slate-100">
            <button
              onClick={handleConfirmResult}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-28 h-28 mx-auto relative flex items-center justify-center">
              {resultModalState === 'pass' ? (
                <svg viewBox="0 0 120 120" fill="none" className="w-full h-full drop-shadow-md">
                  <circle cx="20" cy="30" r="3" fill="#3B82F6" />
                  <circle cx="100" cy="25" r="3" fill="#EC4899" />
                  <rect x="25" y="80" width="6" height="6" fill="#10B981" rx="1" />
                  <rect x="90" y="75" width="6" height="6" fill="#F59E0B" rx="1" />

                  <path d="M42 75 L30 110 L45 100 L55 110 L50 78 Z" fill="#3B82F6" />
                  <path d="M78 75 L90 110 L75 100 L65 110 L70 78 Z" fill="#2563EB" />

                  <circle cx="60" cy="52" r="36" fill="#FBBF24" />
                  <circle cx="60" cy="52" r="30" fill="#F59E0B" />
                  <circle cx="60" cy="52" r="26" fill="#FCD34D" />

                  <polygon
                    points="60,32 66,44 80,45 69,54 73,68 60,60 47,68 51,54 40,45 54,44"
                    fill="#F59E0B"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 120 120" fill="none" className="w-full h-full drop-shadow-md">
                  <circle cx="20" cy="30" r="3" fill="#60A5FA" />
                  <circle cx="100" cy="25" r="3" fill="#FBBF24" />

                  <path d="M42 75 L30 110 L45 100 L55 110 L50 78 Z" fill="#3B82F6" />
                  <path d="M78 75 L90 110 L75 100 L65 110 L70 78 Z" fill="#2563EB" />

                  <circle cx="60" cy="52" r="36" fill="#E2E8F0" />
                  <circle cx="60" cy="52" r="30" fill="#CBD5E1" />
                  <circle cx="60" cy="52" r="26" fill="#F1F5F9" />

                  <path
                    d="M45 37 L52 30 L75 53 L68 60 Z M75 37 L68 30 L45 53 L52 60 Z"
                    fill="#94A3B8"
                  />
                </svg>
              )}
            </div>

            <div>
              <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight">
                {resultModalState === 'pass'
                  ? `恭喜你！${finalScore}分考试通过。`
                  : `很遗憾 ~ ${finalScore}分考试未通过。`}
              </h3>
              <p className="text-[13px] text-slate-400 mt-1 font-medium">
                《{examData.title}》
              </p>
            </div>

            <button
              onClick={handleConfirmResult}
              className="w-full py-3 bg-[#0070f3] hover:bg-[#005bb5] text-white text-[15px] font-bold rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
