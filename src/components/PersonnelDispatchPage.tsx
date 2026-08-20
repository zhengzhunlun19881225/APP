import React, { useState } from 'react';
import {
  ChevronLeft,
  Phone,
  Mic,
  Video,
  MessageSquare,
  X,
  FileText,
  Download,
  MapPin,
  Camera,
  Play,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Plus,
  AlertTriangle,
  Send,
  Eye,
  Check
} from 'lucide-react';
import { ContactItem } from '../types';
import { initialContacts } from '../data/mockData';

export interface PersonnelDispatchPageProps {
  onBack: () => void;
  onOpenChatWithPerson?: (personName: string, avatarUrl?: string) => void;
  contacts?: ContactItem[];
}

export type TaskStatus = 'received' | 'on_the_way' | 'arrived' | 'completed';

interface PersonnelInfo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  gender: string;
  status: string;
  phone: string;
  taskStatus?: string;
  taskStatusType?: 'received' | 'on_the_way' | 'arrived' | 'completed';
  isCurrentUser?: boolean;
}

interface FeedbackItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  isProxy?: boolean; // e.g. (调度员代发)
  time: string;
  content: string;
  images?: string[];
  video?: {
    thumbnail: string;
    duration?: string;
  };
  isMe?: boolean;
}

export const PersonnelDispatchPage: React.FC<PersonnelDispatchPageProps> = ({
  onBack,
  onOpenChatWithPerson,
  contacts = initialContacts
}) => {
  // Current user's task status progression: received -> on_the_way -> arrived -> completed
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('received');

  // Sub-view: 'main' (人员调派) | 'feedback' (调派反馈)
  const [currentView, setCurrentView] = useState<'main' | 'feedback'>('main');

  // Modals & Drawers state
  const [selectedPerson, setSelectedPerson] = useState<PersonnelInfo | null>(null);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [statusChangeMessage, setStatusChangeMessage] = useState('调度员已更改您的任务状态为：路途中');
  const [showNavSheet, setShowNavSheet] = useState(false);
  const [showOutOfRangeBanner, setShowOutOfRangeBanner] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Feedback View States
  const [onlyFocusMe, setOnlyFocusMe] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);

  const getContactByName = (name: string, fallbackAvatar: string, fallbackPhone = '13800000000') => {
    const found = contacts.find((c) => c.name === name);
    return {
      avatar: found?.avatar || fallbackAvatar,
      phone: found?.phone || fallbackPhone,
      department: found?.department || '广东省广新控股集团有限公司',
      role: found?.role || '执行人员',
      gender: found?.gender || '男',
      status: found?.status || '在线'
    };
  };

  const guInfo = getContactByName('谷菲婷', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', '13800138000');
  const jingInfo = getContactByName('荆宁若', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', '13912345678');
  const chuInfo = getContactByName('褚霞哲', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', '13456445567');
  const mengInfo = getContactByName('蒙浩', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', '13698765432');

  // Dispatcher Information (谷菲婷)
  const dispatcher: PersonnelInfo = {
    id: 'p-dispatcher',
    name: '谷菲婷',
    avatar: guInfo.avatar,
    role: '现场指挥官',
    department: '应急指挥中心',
    gender: '女',
    status: '在线',
    phone: guInfo.phone
  };

  // Execution Personnel List
  const executionPersonnel: PersonnelInfo[] = [
    {
      id: 'p-1',
      name: '荆宁若',
      avatar: jingInfo.avatar,
      role: '一线执行人员',
      department: '广东省广新控股集团有限公司',
      gender: '女',
      status: '在线',
      phone: jingInfo.phone,
      isCurrentUser: true,
      taskStatusType: taskStatus,
      taskStatus:
        taskStatus === 'received'
          ? '已接收'
          : taskStatus === 'on_the_way'
          ? '路途中'
          : taskStatus === 'arrived'
          ? '已到达'
          : '已完成'
    },
    {
      id: 'p-2',
      name: '褚霞哲',
      avatar: chuInfo.avatar,
      role: '一线执行人员',
      department: '广东省广新控股集团有限公司',
      gender: '男',
      status: '在线',
      phone: chuInfo.phone,
      taskStatus: '已完成'
    },
    {
      id: 'p-3',
      name: '蒙浩',
      avatar: mengInfo.avatar,
      role: '一线执行人员',
      department: '广东省广新控股集团有限公司',
      gender: '男',
      status: '在线',
      phone: mengInfo.phone,
      taskStatus: '已完成'
    }
  ];

  // Feedback Messages Data (Connected to address book contacts)
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: 'fb-1',
      senderName: '谷菲婷',
      senderAvatar: guInfo.avatar,
      senderRole: '现场指挥官',
      time: '04-12 10:04:34',
      content: '情况紧急，建议直接上报指挥中心',
      isMe: false
    },
    {
      id: 'fb-2',
      senderName: '褚霞哲',
      senderAvatar: chuInfo.avatar,
      senderRole: '一线执行人员',
      time: '04-12 10:04:34',
      content: '现场第一组已到位，正在进行道路疏导与排查',
      images: [
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
      ],
      video: {
        thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
        duration: '00:15'
      },
      isMe: false
    },
    {
      id: 'fb-3',
      senderName: '荆宁若',
      senderAvatar: jingInfo.avatar,
      isProxy: true, // (调度员代发)
      time: '04-12 10:04:34',
      content: '已到达指定救援位置，正在全力配合安置转移群众',
      isMe: true
    }
  ]);

  // Progression Action Handler
  const handleMainActionClick = () => {
    if (taskStatus === 'received') {
      // Step 1: Click "执行" -> transitions to "路途中" and prompts "任务状态变动"
      setTaskStatus('on_the_way');
      setStatusChangeMessage('调度员已更改您的任务状态为：路途中');
      setShowStatusChangeModal(true);
    } else if (taskStatus === 'on_the_way') {
      // Step 2: Click "签到"
      // If toggled out of range, show warning banner
      if (showOutOfRangeBanner) {
        triggerToast('当前未在签到范围内，请靠近目的地后再签到');
      } else {
        setTaskStatus('arrived');
        triggerToast('签到成功！状态已更新为：已到达');
      }
    } else if (taskStatus === 'arrived') {
      // Step 3: Click "完成任务" -> transitions to "已完成"
      setTaskStatus('completed');
      triggerToast('调派任务已圆满完成！');
    }
  };

  // Submit Feedback
  const handleSendFeedback = () => {
    if (!feedbackInput.trim() && attachedPhotos.length === 0 && !attachedVideo) {
      triggerToast('请输入反馈内容或添加照片/视频');
      return;
    }

    const newFb: FeedbackItem = {
      id: `fb-${Date.now()}`,
      senderName: '荆宁若',
      senderAvatar: jingInfo.avatar,
      senderRole: '一线执行人员',
      time: '刚刚 10:45:12',
      content: feedbackInput.trim() || '已提交现场最新处置情况反馈',
      images: attachedPhotos.length > 0 ? [...attachedPhotos] : undefined,
      video: attachedVideo
        ? {
            thumbnail: attachedVideo,
            duration: '00:10'
          }
        : undefined,
      isMe: true
    };

    setFeedbacks((prev) => [...prev, newFb]);
    setFeedbackInput('');
    setAttachedPhotos([]);
    setAttachedVideo(null);
    triggerToast('调派反馈提交成功！');
  };

  // Add mock photo
  const handleAddPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80'
    ];
    const pick = samplePhotos[attachedPhotos.length % samplePhotos.length];
    setAttachedPhotos((prev) => [...prev, pick]);
    triggerToast('已添加现场照片');
  };

  // Add mock video
  const handleAddVideo = () => {
    setAttachedVideo('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80');
    triggerToast('已添加现场视频记录');
  };

  // Render Real Photo Avatar from Contacts with Online Status
  const renderPersonnelAvatar = (name: string, avatarUrl?: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    const resolvedAvatar =
      avatarUrl ||
      contacts.find((c) => c.name === name)?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

    return (
      <div className="relative flex-shrink-0 inline-block">
        <img
          src={resolvedAvatar}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover shadow-2xs border border-slate-200/80 ring-2 ring-white`}
          referrerPolicy="no-referrer"
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
      </div>
    );
  };

  const filteredFeedbacks = onlyFocusMe
    ? feedbacks.filter((f) => f.isMe)
    : feedbacks;

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-hidden relative font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-slate-700 backdrop-blur-sm flex items-center gap-1.5 animate-fade-in pointer-events-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: 人员调派 主视图 (Exact match to Images 1, 2, 3, 4, 5) */}
      {/* ========================================================================= */}
      {currentView === 'main' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Blue Header */}
          <div className="bg-[#0070f3] text-white px-3.5 py-3 flex items-center justify-between shadow-xs sticky top-0 z-20">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-[17px] font-bold tracking-tight text-white">
              人员调派
            </h1>
            <div className="w-8 h-8" />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pb-24 p-3 space-y-3">
            {/* Out of Range Banner (Image 3: "未到签到范围") */}
            {showOutOfRangeBanner && (
              <div className="bg-[#8b7f58] text-[#fef08a] px-4 py-2 rounded-xl text-[13px] font-bold text-center shadow-xs flex items-center justify-between">
                <span className="flex-1 text-center">未到签到范围</span>
                <button
                  onClick={() => setShowOutOfRangeBanner(false)}
                  className="text-white/80 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 1. Main Task Summary Card (Card 1) */}
            <div className="bg-white rounded-[18px] p-4 shadow-2xs border border-slate-100/80 space-y-3.5">
              {/* Title */}
              <h2 className="text-[16px] font-bold text-slate-900 leading-snug tracking-tight">
                派出由民政部负责人带队、有关部门参加的联合工作组赴灾区慰问受灾群众
              </h2>

              {/* Meta details list */}
              <div className="space-y-2 text-[13px]">
                <div className="flex items-start">
                  <span className="text-slate-400 w-20 flex-shrink-0">调派时间</span>
                  <span className="text-slate-800 font-medium">2022-04-12 10:04:34</span>
                </div>

                <div className="flex items-start">
                  <span className="text-slate-400 w-20 flex-shrink-0">剩余时间</span>
                  <span className="text-[#f97316] font-bold">1小时54分</span>
                </div>

                <div className="flex items-center">
                  <span className="text-slate-400 w-20 flex-shrink-0">关联事件</span>
                  <div
                    onClick={() => triggerToast('关联自然灾害事件应急预案详情')}
                    className="flex items-center gap-1 text-slate-800 font-medium cursor-pointer hover:text-blue-600"
                  >
                    <span>自然灾害事件</span>
                    <span className="w-4 h-4 rounded-xs border border-blue-500 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                      <FileText className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-slate-400 w-20 flex-shrink-0">前往位置</span>
                  <span className="text-slate-800 font-medium flex-1">
                    深圳市南山区南坪快速路NOCC大厦南侧约100米
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Task Attachments Card (Card 2) */}
            <div className="bg-white rounded-[18px] p-4 shadow-2xs border border-slate-100/80 space-y-3">
              {/* Section Header with Blue Vertical Indicator */}
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#0070f3] rounded-full inline-block" />
                <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                  任务附件
                </h3>
              </div>

              {/* Attachments List */}
              <div className="space-y-2.5">
                {/* Word Attachment */}
                <div
                  onClick={() => triggerToast('正在预览：729暴雨事件安全事故方案.doc')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {/* W Icon */}
                    <div className="w-10 h-10 rounded-lg bg-[#2b579a] flex items-center justify-center text-white font-bold text-[18px] shadow-2xs flex-shrink-0">
                      W
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        729暴雨事件安全事故方案.doc
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">146K</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerToast('已开始下载文档 (146K)');
                    }}
                    className="p-2 text-[#0070f3] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* PPT Attachment */}
                <div
                  onClick={() => triggerToast('正在预览：729暴雨事件安全事故培训方案.ppt')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {/* P Icon */}
                    <div className="w-10 h-10 rounded-lg bg-[#d24726] flex items-center justify-center text-white font-bold text-[18px] shadow-2xs flex-shrink-0">
                      P
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        729暴雨事件安全事故培训方案.ppt
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">546K</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerToast('已开始下载培训方案 (546K)');
                    }}
                    className="p-2 text-[#0070f3] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Dispatcher Card (Card 3) */}
            <div className="bg-white rounded-[18px] p-4 shadow-2xs border border-slate-100/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#0070f3] rounded-full inline-block" />
                <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                  调度员
                </h3>
              </div>

              <div
                onClick={() => setSelectedPerson(dispatcher)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
              >
                {renderPersonnelAvatar(dispatcher.name, dispatcher.avatar, 'md')}
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600">
                    {dispatcher.name}
                  </h4>
                  <p className="text-[12px] text-slate-400 font-medium">
                    {dispatcher.role}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Execution Personnel Card (Card 4) */}
            <div className="bg-white rounded-[18px] p-4 shadow-2xs border border-slate-100/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#0070f3] rounded-full inline-block" />
                <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                  执行人员
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {executionPersonnel.map((person) => {
                  return (
                    <div
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                      className="flex items-center justify-between py-2.5 px-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        {renderPersonnelAvatar(person.name, person.avatar, 'md')}
                        <div>
                          <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600">
                            {person.name}
                            {person.isCurrentUser && (
                              <span className="text-[11px] font-normal text-slate-400 ml-1.5">
                                (我)
                              </span>
                            )}
                          </h4>
                          <p className="text-[12px] text-slate-400 font-medium">
                            {person.role}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge right */}
                      <div>
                        {person.taskStatus === '已接收' && (
                          <span className="bg-[#0070f3] text-white px-2.5 py-1 rounded-[6px] text-[12px] font-bold shadow-2xs">
                            已接收
                          </span>
                        )}
                        {person.taskStatus === '路途中' && (
                          <span className="text-[#0070f3] bg-[#f0f7ff] border border-[#bedaff] px-2.5 py-0.5 rounded-[6px] text-[12px] font-medium">
                            路途中
                          </span>
                        )}
                        {person.taskStatus === '已到达' && (
                          <span className="text-[#0070f3] bg-[#f0f7ff] border border-[#bedaff] px-2.5 py-0.5 rounded-[6px] text-[12px] font-medium">
                            已到达
                          </span>
                        )}
                        {person.taskStatus === '已完成' && (
                          <span className="text-[#0ca678] bg-[#e6fcf5] border border-[#b2f2bb] px-2.5 py-0.5 rounded-[6px] text-[12px] font-medium">
                            已完成
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Demo Toggle Toolbar for easy review */}
            <div className="p-3 bg-white/60 backdrop-blur-xs rounded-xl border border-slate-200/60 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">状态演示切换：</span>
                <button
                  onClick={() => setShowOutOfRangeBanner(!showOutOfRangeBanner)}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    showOutOfRangeBanner
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {showOutOfRangeBanner ? '已开启【未到签到范围】' : '切换【未到签到范围】'}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {(['received', 'on_the_way', 'arrived', 'completed'] as TaskStatus[]).map((st) => {
                  const labels = {
                    received: '1.已接收 (执行)',
                    on_the_way: '2.路途中 (签到)',
                    arrived: '3.已到达 (完成任务)',
                    completed: '4.已完成'
                  };
                  return (
                    <button
                      key={st}
                      onClick={() => setTaskStatus(st)}
                      className={`flex-1 py-1 rounded text-center font-bold transition-all ${
                        taskStatus === st
                          ? 'bg-[#0070f3] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {labels[st].split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Floating Action Bar (Exact match to design images) */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2 flex items-center justify-between z-30 shadow-lg">
            {/* Left: 线路导航 */}
            <button
              onClick={() => setShowNavSheet(true)}
              className="flex flex-col items-center justify-center text-[#0070f3] hover:opacity-80 active:scale-95 transition-all cursor-pointer min-w-[60px]"
            >
              <Navigation className="w-5 h-5 stroke-[2] mb-0.5" />
              <span className="text-[11px] font-bold text-slate-700">线路导航</span>
            </button>

            {/* Center: Large Round Prominent Action Button */}
            <div className="relative -top-3">
              {taskStatus === 'received' && (
                <button
                  onClick={handleMainActionClick}
                  className="w-16 h-16 rounded-full bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white font-bold text-[15px] flex items-center justify-center shadow-md shadow-blue-500/30 border-4 border-white transition-all cursor-pointer"
                >
                  执行
                </button>
              )}

              {taskStatus === 'on_the_way' && (
                <button
                  onClick={handleMainActionClick}
                  className={`w-16 h-16 rounded-full text-white font-bold text-[15px] flex items-center justify-center shadow-md border-4 border-white transition-all cursor-pointer ${
                    showOutOfRangeBanner
                      ? 'bg-[#f59f00] hover:bg-[#e67700] shadow-amber-500/30'
                      : 'bg-[#0070f3] hover:bg-[#005bb5] shadow-blue-500/30 active:scale-95'
                  }`}
                >
                  签到
                </button>
              )}

              {taskStatus === 'arrived' && (
                <button
                  onClick={handleMainActionClick}
                  className="w-16 h-16 rounded-full bg-[#0070f3] hover:bg-[#005bb5] active:scale-95 text-white font-bold text-[13px] leading-tight text-center px-1 flex items-center justify-center shadow-md shadow-blue-500/30 border-4 border-white transition-all cursor-pointer"
                >
                  完成<br />任务
                </button>
              )}

              {taskStatus === 'completed' && (
                <button
                  disabled
                  className="w-16 h-16 rounded-full bg-slate-400 text-white font-bold text-[14px] flex items-center justify-center shadow-md border-4 border-white cursor-not-allowed"
                >
                  已完成
                </button>
              )}
            </div>

            {/* Right: 调派反馈 */}
            <button
              onClick={() => setCurrentView('feedback')}
              className="flex flex-col items-center justify-center text-[#0070f3] hover:opacity-80 active:scale-95 transition-all cursor-pointer min-w-[60px] relative"
            >
              <div className="relative">
                <MessageSquare className="w-5 h-5 stroke-[2] mb-0.5 text-[#0070f3]" />
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                  8
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-700">调派反馈</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: 调派反馈 / 反馈记录 子页面 (Exact match to Images 8 & 10) */}
      {/* ========================================================================= */}
      {currentView === 'feedback' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f5f8]">
          {/* Top Blue Header */}
          <div className="bg-[#0070f3] text-white px-3.5 py-3 flex items-center justify-between shadow-xs sticky top-0 z-20">
            <button
              onClick={() => setCurrentView('main')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-[17px] font-bold tracking-tight text-white">
              调派反馈
            </h1>
            {/* Top Right "仅关注我" Checkbox Toggle */}
            <button
              onClick={() => setOnlyFocusMe(!onlyFocusMe)}
              className="flex items-center gap-1.5 text-[13px] text-white/95 hover:text-white cursor-pointer select-none"
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  onlyFocusMe ? 'bg-white text-[#0070f3] border-white' : 'border-white/80'
                }`}
              >
                {onlyFocusMe && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </span>
              <span className="font-medium">仅关注我</span>
            </button>
          </div>

          {/* Scrollable Feedbacks Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
            <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-4">
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-[13px]">
                  暂无您的反馈记录
                </div>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <div key={fb.id} className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    {/* Header Row: Avatar, Name + Proxy tag, Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {renderPersonnelAvatar(fb.senderName, fb.senderAvatar, 'sm')}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-bold text-slate-900">
                            {fb.senderName}
                          </span>
                          {fb.isProxy && (
                            <span className="text-[12px] font-bold text-[#f97316]">
                              (调度员代发)
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {fb.time}
                      </span>
                    </div>

                    {/* Speech Bubble / Message Content */}
                    <div className="ml-12 space-y-2.5">
                      <div className="bg-[#f0f2f5] text-slate-800 text-[13px] px-3 py-2 rounded-xl rounded-tl-xs leading-relaxed inline-block max-w-[90%]">
                        {fb.content}
                      </div>

                      {/* Attachments: Images & Videos */}
                      {(fb.images?.length || fb.video) && (
                        <div className="grid grid-cols-2 gap-2 max-w-xs pt-1">
                          {/* Photos */}
                          {fb.images?.map((imgUrl, iIdx) => (
                            <div
                              key={iIdx}
                              onClick={() => setPreviewMedia({ type: 'image', url: imgUrl })}
                              className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 relative cursor-pointer group"
                            >
                              <img
                                src={imgUrl}
                                alt="现场照片"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          ))}

                          {/* Video */}
                          {fb.video && (
                            <div
                              onClick={() => setPreviewMedia({ type: 'video', url: fb.video!.thumbnail })}
                              className="w-full h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 relative cursor-pointer group"
                            >
                              <img
                                src={fb.video.thumbnail}
                                alt="现场视频"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 fill-white ml-0.5" />
                                </div>
                              </div>
                              {fb.video.duration && (
                                <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.2 rounded font-medium">
                                  {fb.video.duration}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Feedback Input Form (Exact match to Image 8) */}
            <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-3">
              {/* Text Input Area */}
              <textarea
                rows={3}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="请输入反馈内容"
                className="w-full text-[13px] text-slate-800 placeholder:text-slate-400 outline-none resize-none bg-transparent"
              />

              {/* Media Previews when user selects something */}
              {(attachedPhotos.length > 0 || attachedVideo) && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {attachedPhotos.map((photo, pIdx) => (
                    <div key={pIdx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={photo} alt="Attached" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setAttachedPhotos(attachedPhotos.filter((_, idx) => idx !== pIdx))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {attachedVideo && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-black flex-shrink-0">
                      <img src={attachedVideo} alt="Attached Video" className="w-full h-full object-cover opacity-70" />
                      <Play className="w-4 h-4 text-white absolute inset-0 m-auto fill-white" />
                      <button
                        onClick={() => setAttachedVideo(null)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Add Media Buttons Row (Dotted Boxes) */}
              <div className="flex items-center gap-3 pt-1">
                {/* Add Photo Button */}
                <button
                  onClick={handleAddPhoto}
                  className="w-24 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-6 h-6 stroke-[1.6] mb-1" />
                  <span className="text-[11px] font-medium">添加照片</span>
                </button>

                {/* Add Video Button */}
                <button
                  onClick={handleAddVideo}
                  className="w-24 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Video className="w-6 h-6 stroke-[1.6] mb-1" />
                  <span className="text-[11px] font-medium">添加视频</span>
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={handleSendFeedback}
                  className="w-full py-3 bg-[#0070f3] hover:bg-[#005bb5] active:scale-[0.99] text-white font-bold text-[14px] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: 名片 (User Contact Profile Card - Exact match to Image 7) */}
      {/* ========================================================================= */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] p-5 w-full max-w-[320px] shadow-2xl space-y-4 relative">
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Header: Avatar & Name */}
            <div className="flex items-center gap-3 pr-6">
              {renderPersonnelAvatar(selectedPerson.name, selectedPerson.avatar, 'lg')}
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">
                  {selectedPerson.name}
                </h3>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-2.5 text-[13px] pt-1">
              <div className="flex items-start">
                <span className="text-slate-400 w-18 flex-shrink-0">所属部门</span>
                <span className="text-slate-800 font-medium">
                  {selectedPerson.department}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-slate-400 w-18 flex-shrink-0">职务</span>
                <span className="text-slate-800 font-medium">
                  {selectedPerson.role}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-slate-400 w-18 flex-shrink-0">性别</span>
                <span className="text-slate-800 font-medium">
                  {selectedPerson.gender}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-slate-400 w-18 flex-shrink-0">当前状态</span>
                <span className="text-[#10b981] font-bold">
                  {selectedPerson.status}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-slate-400 w-18 flex-shrink-0">联系电话</span>
                <span className="text-slate-800 font-medium font-mono">
                  {selectedPerson.phone}
                </span>
              </div>
            </div>

            {/* 4 Action Buttons Row (Exact match to Image 7) */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
              {/* 电话呼叫 */}
              <button
                onClick={() => {
                  triggerToast(`正在拨打电话给 ${selectedPerson.name} (${selectedPerson.phone})`);
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-[#0070f3] text-white flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                  <Phone className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">电话呼叫</span>
              </button>

              {/* 语音呼叫 */}
              <button
                onClick={() => {
                  triggerToast(`正在发起与 ${selectedPerson.name} 的语音呼叫...`);
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-[#0070f3] text-white flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                  <Mic className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">语音呼叫</span>
              </button>

              {/* 视频呼叫 */}
              <button
                onClick={() => {
                  triggerToast(`正在发起与 ${selectedPerson.name} 的视频呼叫...`);
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-[#0070f3] text-white flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                  <Video className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">视频呼叫</span>
              </button>

              {/* IM聊天 */}
              <button
                onClick={() => {
                  const personToChat = selectedPerson;
                  setSelectedPerson(null);
                  if (onOpenChatWithPerson) {
                    onOpenChatWithPerson(personToChat.name, personToChat.avatar);
                  } else {
                    triggerToast(`已开启与 ${personToChat.name} 的IM即时聊天`);
                  }
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-[#0070f3] text-white flex items-center justify-center shadow-xs group-active:scale-95 transition-transform">
                  <MessageSquare className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-medium text-slate-700">IM聊天</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 任务状态变动 (Exact match to Image 6) */}
      {/* ========================================================================= */}
      {showStatusChangeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[22px] p-5 w-full max-w-[290px] shadow-2xl space-y-4 text-center">
            <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
              任务状态变动
            </h3>

            <p className="text-[13px] text-slate-600 leading-relaxed px-1">
              {statusChangeMessage}
            </p>

            <button
              onClick={() => setShowStatusChangeModal(false)}
              className="w-full py-2.5 bg-[#0070f3] hover:bg-[#005bb5] active:scale-98 text-white font-bold text-[14px] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 导航路线 Action Sheet (Exact match to Image 9) */}
      {/* ========================================================================= */}
      {showNavSheet && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end justify-center animate-fade-in">
          <div className="bg-white rounded-t-[24px] w-full max-w-sm overflow-hidden shadow-2xl divide-y divide-slate-100">
            <button
              onClick={() => {
                setShowNavSheet(false);
                triggerToast('正在打开高德地图进行路线导航...');
              }}
              className="w-full py-3.5 text-center text-[15px] font-medium text-slate-900 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
            >
              高德地图
            </button>

            <button
              onClick={() => {
                setShowNavSheet(false);
                triggerToast('正在打开百度地图进行路线导航...');
              }}
              className="w-full py-3.5 text-center text-[15px] font-medium text-slate-900 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
            >
              百度地图
            </button>

            <button
              onClick={() => {
                setShowNavSheet(false);
                triggerToast('正在打开腾讯地图进行路线导航...');
              }}
              className="w-full py-3.5 text-center text-[15px] font-medium text-slate-900 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
            >
              腾讯地图
            </button>

            <div className="h-2 bg-slate-100" />

            <button
              onClick={() => setShowNavSheet(false)}
              className="w-full py-3.5 text-center text-[15px] font-bold text-slate-500 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Media Preview Modal (Image / Video player) */}
      {/* ========================================================================= */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl overflow-hidden bg-black relative shadow-2xl"
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={previewMedia.url} alt="Media Preview" className="w-full max-h-[70vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
