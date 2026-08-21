import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  Clock,
  Phone,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Radio,
  ArrowRight,
  Check,
  X,
  Send,
  Edit3,
  Activity
} from 'lucide-react';
import { Avatar } from './Avatar';

export interface DutyMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  department: string;
  shiftType: '早班' | '中班' | '晚班' | '总值班';
  shiftTime: string;
  duration: string;
  phone: string;
}

export interface HandoverLog {
  id: string;
  date: string;
  shiftType: '早班' | '中班' | '晚班';
  handoverPerson: string;
  handoverPersonAvatar?: string;
  handoverPersonRole: string;
  takeoverPerson: string;
  takeoverPersonAvatar?: string;
  takeoverPersonRole: string;
  handoverTime: string;
  status: 'confirmed' | 'pending';
  eventCount: number;
  incidentSummary: string;
  pendingTasks: string;
  equipmentStatus: string;
  materialStatus: string;
  attachments?: string[];
  signature?: string;
}

interface DutyHandoverPageProps {
  onBack: () => void;
  onOpenChat?: (contactName: string) => void;
  onCall?: (contactName: string, phone: string) => void;
  onShowToast?: (msg: string) => void;
}

export const DutyHandoverPage: React.FC<DutyHandoverPageProps> = ({
  onBack,
  onCall,
  onShowToast
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(20); // 20日 (周三)
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('2026年8月');
  const [logFilterShift, setLogFilterShift] = useState<string>('all');
  const [selectedLogDetail, setSelectedLogDetail] = useState<HandoverLog | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showHandoverLogsModal, setShowHandoverLogsModal] = useState(false);

  // Form states for creating handover log
  const [formShift, setFormShift] = useState<'早班' | '中班' | '晚班'>('早班');
  const [formHandoverPerson, setFormHandoverPerson] = useState('李明');
  const [formTakeoverPerson, setFormTakeoverPerson] = useState('王芳');
  const [formSummary, setFormSummary] = useState('');
  const [formPending, setFormPending] = useState('');
  const [formEquipment, setFormEquipment] = useState('各监控终端及指挥大屏运行正常，对讲信道通畅');
  const [formMaterial, setFormMaterial] = useState('应急物资储备齐全，防汛物资就绪');
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);

  const parseMonthLabel = (label: string) => {
    const match = label.match(/^(\d{4})年(\d{1,2})月$/);
    return {
      year: match ? Number(match[1]) : 2026,
      month: match ? Number(match[2]) : 8
    };
  };

  const { year: selectedYear, month: selectedMonth } = parseMonthLabel(currentMonth);
  const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const monthDays = Array.from({ length: daysInSelectedMonth }, (_, index) => {
    const date = index + 1;
    const day = new Date(selectedYear, selectedMonth - 1, date).getDay();
    return {
      date,
      dayName: weekNames[day]
    };
  });

  useEffect(() => {
    selectedDateRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [currentMonth, selectedDay]);

  const handleMonthChange = (monthLabel: string) => {
    const { year, month } = parseMonthLabel(monthLabel);
    const monthDayCount = new Date(year, month, 0).getDate();
    setCurrentMonth(monthLabel);
    setSelectedDay((prev) => Math.min(prev, monthDayCount));
    setMonthDropdownOpen(false);
    onShowToast?.(`已切换至 ${monthLabel}`);
  };

  // Schedule mock by date
  const scheduleData: Record<
    number,
    {
      leader: DutyMember;
      members: DutyMember[];
    }
  > = {
    20: {
      leader: {
        id: 'ldr_20',
        name: '张建国',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: '应急管理部 部长',
        department: '应急管理部',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13800112201'
      },
      members: [
        {
          id: 'mem_20_1',
          name: '李明',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          role: '综合协调',
          department: '应急指挥中心',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13800112202'
        },
        {
          id: 'mem_20_2',
          name: '王芳',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: '信息报送',
          department: '信息通信保障组',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13800112203'
        },
        {
          id: 'mem_20_3',
          name: '刘强',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
          role: '应急处置',
          department: '现场应急大队',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13800112204'
        },
        {
          id: 'mem_20_4',
          name: '陈雨',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          role: '后勤保障',
          department: '后勤物资保障部',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13800112205'
        },
        {
          id: 'mem_20_5',
          name: '赵磊',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
          role: '值班记录',
          department: '秘书督查处',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13800112206'
        }
      ]
    },
    18: {
      leader: {
        id: 'ldr_18',
        name: '陈海峰',
        avatar: '',
        role: '应急指挥中心 副总指挥长',
        department: '应急指挥中心',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13822334455'
      },
      members: [
        {
          id: 'mem_18_1',
          name: '赵立新',
          avatar: '',
          role: '系统架构与技术保障',
          department: '数字化创新中心',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13911223344'
        },
        {
          id: 'mem_18_2',
          name: '周明浩',
          avatar: '',
          role: '物资调配与调度',
          department: '应急保障部',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13700112233'
        },
        {
          id: 'mem_18_3',
          name: '常琼艳',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          role: '后勤调度',
          department: '综合保障部',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13655443322'
        }
      ]
    },
    19: {
      leader: {
        id: 'ldr_19',
        name: '汪红和',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        role: '数字化创新中心 首席架构师',
        department: '数字化创新中心',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13812345608'
      },
      members: [
        {
          id: 'mem_19_1',
          name: '徐雅琴',
          avatar: '',
          role: '通信保障专员',
          department: '通信保障组',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13612349988'
        },
        {
          id: 'mem_19_2',
          name: '裴莎',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          role: '应急协调主管',
          department: '应急保障部',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13812345607'
        },
        {
          id: 'mem_19_3',
          name: '王勇',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          role: '安全保卫队长',
          department: '安保大队',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13344556677'
        }
      ]
    },
    21: {
      leader: {
        id: 'ldr_21',
        name: '石梁雅',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        role: '高级总监',
        department: '运营保障中心',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13299881122'
      },
      members: [
        {
          id: 'mem_21_1',
          name: '李敏',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
          role: '系统巡检',
          department: '应急指挥研发部',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13812345604'
        },
        {
          id: 'mem_21_2',
          name: '谷菲婷',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          role: '现场调度',
          department: '应急指挥中心',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13800138000'
        },
        {
          id: 'mem_21_3',
          name: '冯建华',
          avatar: '',
          role: '现场特勤',
          department: '现场救援大队',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13544332211'
        }
      ]
    },
    22: {
      leader: {
        id: 'ldr_22',
        name: '张建国',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: '应急管理部 部长',
        department: '应急管理部',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13800112201'
      },
      members: [
        {
          id: 'mem_22_1',
          name: '黄嘉丽',
          avatar: '',
          role: '综合协调',
          department: '综合管理部',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13599887766'
        },
        {
          id: 'mem_22_2',
          name: 'David King',
          avatar: '',
          role: '涉外技术联络',
          department: '国际技术合作部',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13800223344'
        },
        {
          id: 'mem_22_3',
          name: '刘强',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
          role: '应急处置',
          department: '现场应急大队',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13800112204'
        }
      ]
    },
    23: {
      leader: {
        id: 'ldr_23',
        name: '陈海峰',
        avatar: '',
        role: '应急指挥中心 副总指挥长',
        department: '应急指挥中心',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13822334455'
      },
      members: [
        {
          id: 'mem_23_1',
          name: 'Kevin',
          avatar: '',
          role: '智能运维保障',
          department: '智能运维部',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13800334455'
        },
        {
          id: 'mem_23_2',
          name: '马晓东',
          avatar: '',
          role: '安全巡视',
          department: '安全监察部',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13988771122'
        },
        {
          id: 'mem_23_3',
          name: '蒙浩',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
          role: '一线待命',
          department: '广新集团',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13698765432'
        }
      ]
    },
    24: {
      leader: {
        id: 'ldr_24',
        name: '汪红和',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        role: '数字化创新中心 首席架构师',
        department: '数字化创新中心',
        shiftType: '总值班',
        shiftTime: '08:00 - 24:00',
        duration: '16小时',
        phone: '13812345608'
      },
      members: [
        {
          id: 'mem_24_1',
          name: '李树洁',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          role: '平台开发与保障',
          department: '平台开发部',
          shiftType: '早班',
          shiftTime: '08:00 - 16:00',
          duration: '8小时',
          phone: '13812345601'
        },
        {
          id: 'mem_24_2',
          name: '孙敏',
          avatar: '',
          role: '督办协调',
          department: '董事会',
          shiftType: '中班',
          shiftTime: '16:00 - 24:00',
          duration: '8小时',
          phone: '13900112235'
        },
        {
          id: 'mem_24_3',
          name: '饶韵',
          avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
          role: '安全巡检',
          department: '广新集团',
          shiftType: '晚班',
          shiftTime: '00:00 - 08:00',
          duration: '8小时',
          phone: '13811223344'
        }
      ]
    }
  };

  // Initial Handover Logs
  const [handoverLogs, setHandoverLogs] = useState<HandoverLog[]>([
    {
      id: 'log_20_1',
      date: '2026-08-20',
      shiftType: '早班',
      handoverPerson: '李明',
      handoverPersonAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      handoverPersonRole: '综合协调',
      takeoverPerson: '王芳',
      takeoverPersonAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      takeoverPersonRole: '信息报送',
      handoverTime: '16:00',
      status: 'confirmed',
      eventCount: 3,
      incidentSummary:
        '早班期间共接听外部调度电话 4 起，完成防汛Ⅲ级应急响应预案自查；协助水务局排查市区 2 处低洼易涝点排水监控情况，均恢复正常水位。',
      pendingTasks:
        '1. 气象局通报傍晚可能有短时强降雨，需密切关注雷达回波图；\n2. 跟踪二号抽水泵站备用发电机组调试进度；\n3. 晚8点向市应急局报送今日值班日报。',
      equipmentStatus: '视频会议专线、卫星电话测试正常，指挥大屏无报警故障。',
      materialStatus: '防汛沙袋、救生衣储备充裕，一号物资库调拨车辆处于热备状态。',
      signature: '李明 (已电子签署 16:02:15)'
    },
    {
      id: 'log_20_0',
      date: '2026-08-20',
      shiftType: '晚班',
      handoverPerson: '刘强',
      handoverPersonAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      handoverPersonRole: '应急处置',
      takeoverPerson: '李明',
      takeoverPersonAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      takeoverPersonRole: '综合协调',
      handoverTime: '08:00',
      status: 'confirmed',
      eventCount: 1,
      incidentSummary: '夜间全市重点危险源监控无异常报警，03:20 接到园区管网压力小幅波动警报，经值班人员远程排查确认属于正常保压测试，已解除预警。',
      pendingTasks: '交接白班对园区西区阀门室进行现场例行巡检复核。',
      equipmentStatus: '指挥调度系统全链路正常。',
      materialStatus: '物资库正常封存受控。',
      signature: '刘强 (已电子签署 08:01:10)'
    },
    {
      id: 'log_19_2',
      date: '2026-08-19',
      shiftType: '中班',
      handoverPerson: '裴莎',
      handoverPersonAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      handoverPersonRole: '应急协调主管',
      takeoverPerson: '王勇',
      takeoverPersonAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      takeoverPersonRole: '安全保卫队长',
      handoverTime: '24:00',
      status: 'confirmed',
      eventCount: 2,
      incidentSummary: '完成联合巡检任务，联合安监部对危险化学品储存库进行温度湿度核验，记录完备。',
      pendingTasks: '重点关注夜间园区周界红外报警情况。',
      equipmentStatus: '红外周界安防系统运转良好。',
      materialStatus: '消防器材点检合格。',
      signature: '裴莎 (已电子签署 23:58:30)'
    },
    {
      id: 'log_19_1',
      date: '2026-08-19',
      shiftType: '早班',
      handoverPerson: '徐雅琴',
      handoverPersonAvatar: '',
      handoverPersonRole: '通信保障专员',
      takeoverPerson: '裴莎',
      takeoverPersonAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      takeoverPersonRole: '应急协调主管',
      handoverTime: '16:00',
      status: 'confirmed',
      eventCount: 2,
      incidentSummary: '完成全省应急指挥链路定期例会通信测试，音频与高清视频回传丢包率均低于0.01%。',
      pendingTasks: '明日演练专线信道提前锁定。',
      equipmentStatus: '通信专线设备正常。',
      materialStatus: '应急备用通信电台已满电。',
      signature: '徐雅琴 (已电子签署 16:05:00)'
    }
  ]);

  const fallbackScheduleDays = [18, 19, 20, 21, 22, 23, 24];
  const fallbackScheduleDay = fallbackScheduleDays[(selectedDay - 1) % fallbackScheduleDays.length];
  const currentSchedule = scheduleData[selectedDay] || scheduleData[fallbackScheduleDay] || scheduleData[20];

  // Filter logs
  const filteredLogs = handoverLogs.filter((log) => {
    if (logFilterShift === 'all') return true;
    return log.shiftType === logFilterShift;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSummary.trim()) {
      onShowToast?.('请填写本班次处置情况简述');
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

    const newLog: HandoverLog = {
      id: `log_${Date.now()}`,
      date: dateStr,
      shiftType: formShift,
      handoverPerson: formHandoverPerson,
      handoverPersonRole: '值班员',
      takeoverPerson: formTakeoverPerson,
      takeoverPersonRole: '接班员',
      handoverTime: timeStr,
      status: 'confirmed',
      eventCount: formSummary.split('\n').filter(Boolean).length || 1,
      incidentSummary: formSummary,
      pendingTasks: formPending || '暂无特殊遗留事项',
      equipmentStatus: formEquipment,
      materialStatus: formMaterial,
      signature: `${formHandoverPerson} (已电子签署 ${timeStr}:12)`
    };

    setHandoverLogs([newLog, ...handoverLogs]);
    setIsCreateModalOpen(false);
    setFormSummary('');
    setFormPending('');
    onShowToast?.('交班日志已成功提交并归档！');
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none relative overflow-hidden">
      {/* Top Banner Header with Sky Blue Gradient */}
      <div className="relative app-plan-query-bg text-slate-900 pt-3 pb-3 px-2 flex-shrink-0">
        {/* Navigation & Month bar */}
        <div className="relative flex items-center justify-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <button
              onClick={onBack}
              className="system-back-button"
            >
              <ChevronLeft />
            </button>
          </div>

          {/* Month dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
              className="flex items-center gap-1.5 text-[20px] font-bold text-slate-900 hover:opacity-90 active:scale-98 transition-all cursor-pointer"
            >
              <span>{currentMonth}</span>
              <ChevronDown className="w-4 h-4 text-slate-900 stroke-[2.5]" />
            </button>

            {monthDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 w-36 animate-in fade-in zoom-in-95">
                {['2026年7月', '2026年8月', '2026年9月', '2026年10月'].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      handleMonthChange(m);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 flex items-center justify-between ${
                      currentMonth === m ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{m}</span>
                    {currentMonth === m && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Week Day Selector Strip */}
        <div className="mt-5 flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {monthDays.map((w) => {
            const isSelected = selectedDay === w.date;
            return (
              <button
                key={w.date}
                ref={isSelected ? selectedDateRef : null}
                onClick={() => setSelectedDay(w.date)}
                className={`flex h-[58px] w-11 flex-none flex-col items-center justify-center rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#007aff] text-white shadow-md font-bold scale-[1.03]'
                    : 'bg-white/90 hover:bg-white text-slate-700 shadow-2xs font-medium'
                }`}
              >
                <span className={`text-[16px] leading-tight ${isSelected ? 'font-black text-white' : 'font-bold text-slate-800'}`}>
                  {w.date}
                </span>
                <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/95' : 'text-slate-500'}`}>
                  {w.dayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 pb-24">
        {/* Section 1: 值班领导 */}
        <div className="space-y-2">
          <div className="text-[16px] font-bold text-slate-900 px-1">
            <span>值班领导</span>
          </div>

          <div className="app-card p-4 flex items-center justify-between relative overflow-hidden">
            {/* Left Info: Avatar + Details */}
            <div className="flex items-center gap-3.5">
              <Avatar
                src={currentSchedule.leader.avatar}
                name={currentSchedule.leader.name}
                size="sm"
                className="w-10 h-10 rounded-full border-2 border-blue-50 shadow-xs"
              />
              <div>
                <h4 className="text-[17px] font-bold text-slate-900 leading-snug">
                  {currentSchedule.leader.name}
                </h4>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  {currentSchedule.leader.role}
                </p>
                <div className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[11px] font-bold">
                  值班类型：{currentSchedule.leader.shiftType}
                </div>
              </div>
            </div>

            {/* Right Info: Time & Call Button */}
            <div className="text-right flex items-center gap-3">
              <div>
                <div className="flex items-center justify-end gap-1 text-[12px] text-blue-600 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>值班时间</span>
                </div>
                <div className="text-[17px] font-extrabold text-slate-900 mt-0.5 tracking-tight">
                  {currentSchedule.leader.shiftTime}
                </div>
              </div>

              {/* Call Button */}
              <button
                onClick={() => onCall?.(currentSchedule.leader.name, currentSchedule.leader.phone)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
                title="拨打电话"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: 值班成员 */}
        <div className="space-y-2">
          <div className="text-[16px] font-bold text-slate-900 px-1">
            <span>值班成员</span>
          </div>

          <div className="app-card divide-y divide-slate-100 overflow-hidden">
            {currentSchedule.members.map((member) => {
              const isMorning = member.shiftType === '早班';
              const isMiddle = member.shiftType === '中班';

              return (
                <div
                  key={member.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="sm"
                      className="w-10 h-10 rounded-full border border-slate-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-slate-900">
                          {member.name}
                        </span>
                        {/* Shift Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isMorning
                              ? 'bg-[#eefdf5] text-[#10b981]'
                              : isMiddle
                              ? 'bg-[#fef9ee] text-[#f59e0b]'
                              : 'bg-[#eff6ff] text-[#3b82f6]'
                          }`}
                        >
                          {member.shiftType}
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-500 mt-0.5">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  {/* Right: Shift Time & Call action */}
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-[15px] font-bold text-slate-900 tracking-tight">
                        {member.shiftTime}
                      </div>
                    </div>

                    <button
                      onClick={() => onCall?.(member.name, member.phone)}
                      className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
                      title="拨打电话"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Dock: 填写交班日志 & 交班记录 */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-lg flex items-center gap-2.5">
        <button
          onClick={() => setShowHandoverLogsModal(true)}
          className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>交班记录</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[14px] shadow-sm shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>填写交班日志</span>
        </button>
      </div>

      {/* Modal: View Handover Logs Sheet */}
      {showHandoverLogsModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="app-bottom-sheet !bg-[#f4f5f8] max-h-[85%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Header */}
            <div className="px-4 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-[16px] font-bold text-slate-900">
                  交班日志记录 ({handoverLogs.length}条)
                </h3>
              </div>
              <button
                onClick={() => setShowHandoverLogsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Chips */}
            <div className="px-4 py-2 bg-white flex items-center gap-2 overflow-x-auto border-b border-slate-100">
              {[
                { id: 'all', label: '全部班次' },
                { id: '早班', label: '早班日志' },
                { id: '中班', label: '中班日志' },
                { id: '晚班', label: '晚班日志' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setLogFilterShift(chip.id)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    logFilterShift === chip.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Logs List */}
            <div className="p-4 overflow-y-auto space-y-3">
              {filteredLogs.map((log) => {
                const isMorning = log.shiftType === '早班';
                const isMiddle = log.shiftType === '中班';

                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      setSelectedLogDetail(log);
                    }}
                    className="app-card p-4 hover:border-blue-200 transition-all cursor-pointer"
                  >
                    {/* Header: Date + Shift Tag + Status */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-slate-900">
                          {log.date}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isMorning
                              ? 'bg-emerald-50 text-emerald-600'
                              : isMiddle
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {log.shiftType}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>已交接</span>
                      </div>
                    </div>

                    {/* Handover Flow */}
                    <div className="flex items-center justify-between py-2.5 bg-slate-50/80 px-3 rounded-xl my-2">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={log.handoverPersonAvatar}
                          name={log.handoverPerson}
                          size="sm"
                          className="w-7 h-7"
                        />
                        <div className="text-[12px] font-bold text-slate-800">
                          交班：{log.handoverPerson}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400" />

                      <div className="flex items-center gap-2">
                        <div className="text-[12px] font-bold text-slate-800">
                          接班：{log.takeoverPerson}
                        </div>
                        <Avatar
                          src={log.takeoverPersonAvatar}
                          name={log.takeoverPerson}
                          size="sm"
                          className="w-7 h-7"
                        />
                      </div>
                    </div>

                    {/* Incident Summary Snippet */}
                    <p className="line-clamp-2 text-slate-600 text-[14px] leading-relaxed">
                      {log.incidentSummary}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>交接时间：{log.handoverTime}</span>
                      <span className="text-blue-600 font-medium">查看详情 ➔</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Handover Log Detail */}
      {selectedLogDetail && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="app-bottom-sheet max-h-[90%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Modal Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-[16px] font-bold text-slate-900">
                  交接班日志详情 ({selectedLogDetail.date} {selectedLogDetail.shiftType})
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-slate-800 text-[13px]">
              {/* Personnel Flow Card */}
              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 flex items-center justify-around">
                <div className="text-center">
                  <Avatar
                    src={selectedLogDetail.handoverPersonAvatar}
                    name={selectedLogDetail.handoverPerson}
                    size="md"
                    className="mx-auto w-11 h-11 mb-1"
                  />
                  <div className="font-bold text-slate-900">{selectedLogDetail.handoverPerson}</div>
                  <div className="text-[11px] text-slate-500">{selectedLogDetail.handoverPersonRole} (交班)</div>
                </div>

                <div className="flex flex-col items-center text-blue-600">
                  <span className="text-[10px] font-bold mb-0.5">{selectedLogDetail.handoverTime} 交接</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5">双方已确认</span>
                </div>

                <div className="text-center">
                  <Avatar
                    src={selectedLogDetail.takeoverPersonAvatar}
                    name={selectedLogDetail.takeoverPerson}
                    size="md"
                    className="mx-auto w-11 h-11 mb-1"
                  />
                  <div className="font-bold text-slate-900">{selectedLogDetail.takeoverPerson}</div>
                  <div className="text-[11px] text-slate-500">{selectedLogDetail.takeoverPersonRole} (接班)</div>
                </div>
              </div>

              {/* 1. 本班次处置事件与运行情况 */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>本班次处置情况简述</span>
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 leading-relaxed text-slate-700 whitespace-pre-wrap text-[13px]">
                  {selectedLogDetail.incidentSummary}
                </div>
              </div>

              {/* 2. 遗留待办事项与交接备忘 */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>遗留待办与交接备忘</span>
                </label>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 leading-relaxed text-amber-900 whitespace-pre-wrap text-[13px]">
                  {selectedLogDetail.pendingTasks}
                </div>
              </div>

              {/* 3. 设施设备与物资状态 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-blue-500" />
                    <span>设备终端状态</span>
                  </div>
                  <div className="text-[12px] text-slate-800 font-medium">
                    {selectedLogDetail.equipmentStatus}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>应急物资状态</span>
                  </div>
                  <div className="text-[12px] text-slate-800 font-medium">
                    {selectedLogDetail.materialStatus}
                  </div>
                </div>
              </div>

              {/* 4. 电子签署状态 */}
              <div className="p-3 bg-slate-100/80 rounded-xl flex items-center justify-between text-[12px]">
                <span className="text-slate-500">电子签名核验</span>
                <span className="font-bold text-slate-800">{selectedLogDetail.signature}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                onClick={() => {
                  onShowToast?.('日志归档信息已导出至手机文件');
                  setSelectedLogDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-bold hover:bg-slate-100 transition-colors"
              >
                导出日志
              </button>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Write / Submit New Handover Log */}
      {isCreateModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateSubmit}
            className="app-bottom-sheet max-h-[92%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-250"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-[16px] font-bold text-slate-900">
                  填写交班日志 ({selectedMonth}月{selectedDay}日)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-slate-800 text-[13px]">
              {/* 班次选择 */}
              <div>
                <label className="block text-[13px] font-bold text-slate-900 mb-1.5">
                  交班班次
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['早班', '中班', '晚班'] as const).map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => setFormShift(shift)}
                      className={`py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                        formShift === shift
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
              </div>

              {/* 交班人 与 接班人 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="app-form-label">
                    交班人
                  </label>
                  <input
                    type="text"
                    value={formHandoverPerson}
                    onChange={(e) => setFormHandoverPerson(e.target.value)}
                    className="app-form-control font-bold"
                  />
                </div>
                <div>
                  <label className="app-form-label">
                    接班人
                  </label>
                  <input
                    type="text"
                    value={formTakeoverPerson}
                    onChange={(e) => setFormTakeoverPerson(e.target.value)}
                    className="app-form-control font-bold"
                  />
                </div>
              </div>

              {/* 本班处置情况 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="app-form-label !mb-0">
                    本班处置情况与重要事项 <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormSummary(
                        '1. 完成本班次重点区域监控例行巡检，未见异常；\n2. 组织开展防汛物资快速抽查，全部完好在位；\n3. 接报调度电话2起，均已按规程处置完毕。'
                      )
                    }
                    className="text-[11px] text-blue-600 font-medium hover:underline"
                  >
                    填入常用模板
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="请输入本班次发生的主要事件、处置措施及当前状态..."
                  className="app-form-textarea"
                />
              </div>

              {/* 遗留待办与交接备忘 */}
              <div>
                <label className="app-form-label">
                  遗留事项与交接备忘
                </label>
                <textarea
                  rows={2}
                  value={formPending}
                  onChange={(e) => setFormPending(e.target.value)}
                  placeholder="交由接班人员继续跟进或留意的注意事项..."
                  className="app-form-textarea"
                />
              </div>

              {/* 设备与物资运行情况 */}
              <div>
                <label className="app-form-label">
                  系统设备与应急物资检查情况
                </label>
                <input
                  type="text"
                  value={formEquipment}
                  onChange={(e) => setFormEquipment(e.target.value)}
                  className="app-form-control"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>提交交班并签署</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
