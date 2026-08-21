import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Play,
  Maximize2,
  Clock,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  Volume2,
  FileText,
  VolumeX,
  X
} from 'lucide-react';

export interface CourseData {
  id: string;
  title: string;
  type: 'video' | 'document';
  status: string; // e.g. "学习中", "已完成"
  category: string; // e.g. "线上课"
  validUntil: string;
  duration: string;
  progress: number;
  teacher: string;
  plan: string;
  requiredDuration: string;
  description: string;
  materials: {
    id: string;
    title: string;
    type: 'doc' | 'ppt' | 'mp4';
    learnedTime: string;
  }[];
}

interface CourseDetailPageProps {
  course?: CourseData;
  onBack: () => void;
}

const defaultVideoCourse: CourseData = {
  id: 'c1',
  title: '应急预案学习',
  type: 'video',
  status: '学习中',
  category: '线上课',
  validUntil: '2026-07-16',
  duration: '1小时30分钟',
  progress: 50,
  teacher: '沈浩',
  plan: '应急预案培训',
  requiredDuration: '30分钟',
  description:
    '本课程系统梳理机场突发事件应急预案体系，帮助学员掌握各类事故的处置流程与职责分工，提升应急响应与协同救援能力。',
  materials: [
    {
      id: 'm1',
      title: '突发事件应急救援预案.mp4',
      type: 'mp4',
      learnedTime: '已学3分4秒'
    },
    {
      id: 'm2',
      title: '暴雨事件安全事故培训方案.mp4',
      type: 'mp4',
      learnedTime: '已学0秒'
    }
  ]
};

const defaultDocCourse: CourseData = {
  id: 'c2',
  title: '应急预案学习',
  type: 'document',
  status: '学习中',
  category: '线上课',
  validUntil: '2026-07-16',
  duration: '1小时30分钟',
  progress: 50,
  teacher: '沈浩',
  plan: '应急预案培训',
  requiredDuration: '30分钟',
  description:
    '本课程系统梳理机场突发事件应急预案体系，帮助学员掌握各类事故的处置流程与职责分工，提升应急响应与协同救援能力。',
  materials: [
    {
      id: 'm3',
      title: '突发事件应急救援预案.doc',
      type: 'doc',
      learnedTime: '已学3分4秒'
    },
    {
      id: 'm4',
      title: '暴雨事件安全事故培训方案.ppt',
      type: 'ppt',
      learnedTime: '已学0秒'
    }
  ]
};

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course: initialCourse,
  onBack
}) => {
  const [course, setCourse] = useState<CourseData>(initialCourse || defaultDocCourse);
  const [activeTab, setActiveTab] = useState<'info' | 'list'>('info');

  // Fullscreen view modes
  const [readingDoc, setReadingDoc] = useState<string | null>(null);
  const [playingVideoFullscreen, setPlayingVideoFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('倍速');
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [docTimer, setDocTimer] = useState<number>(192); // 3m 12s

  // Document Timer effect
  useEffect(() => {
    let interval: any;
    if (readingDoc) {
      interval = setInterval(() => {
        setDocTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [readingDoc]);

  const formatDocTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // Toggle course type (for testing video vs document mode seamlessly)
  const toggleCourseType = () => {
    if (course.type === 'document') {
      setCourse(defaultVideoCourse);
    } else {
      setCourse(defaultDocCourse);
    }
  };

  // Fullscreen Document Reader View
  if (readingDoc) {
    return (
      <div className="flex flex-col h-full bg-white select-none overflow-hidden z-50">
        {/* Doc Header */}
        <div className="px-2 py-3 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
          <button
            onClick={() => setReadingDoc(null)}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>

          <h1 className="text-[15px] font-bold text-slate-900 truncate max-w-[200px]">
            {readingDoc}
          </h1>

          <div className="flex items-center gap-1 text-[13px] text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDocTime(docTimer)}</span>
          </div>
        </div>

        {/* Doc Content Area */}
        <div className="flex-1 overflow-y-auto p-4 text-[13px] text-slate-800 leading-relaxed font-sans space-y-4 bg-slate-50">
          <div className="bg-white p-5 rounded-lg shadow-2xs border border-slate-200/80 space-y-4">
            <p className="text-slate-600">
              失事、空中相撞、冲偏出跑道等风险。可能性等级为 B 很少发生，严重度等级为 5，风险等级为 II（中）。事故特点是：人员伤亡多、经济损失较大、具有不确定性。是机场事故灾难应急处置工作的重点。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900 pt-1">
              4.2.3 机场周边飞鸟（鸽群、鹰等大型鸟类）
            </h3>
            <p className="text-slate-600">
              鸟击航空器造成飞机失事、发动机故障等风险。可能性等级为 C 偶尔发生，严重度等级为 2，风险等级为 III（较低）。事故特点是：经济损失较大、具有突然性和不确定性。是机场事故灾难应急处置工作的关注重点。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900 pt-1">
              4.2.4 跑道上的外来物（航空器与车辆侵入，石头等异物）
            </h3>
            <p className="text-slate-600">
              造成航空器撞击失事、航空器受损的风险。可能性等级为 B 很少发生，严重度等级为 3。
            </p>

            <div className="flex justify-between text-[11px] text-slate-400 py-2 border-t border-slate-100">
              <span>应急预案手册</span>
              <span>综合应急预案</span>
              <span>E1-4-3</span>
            </div>

            <p className="text-slate-600 pt-2">
              风险等级为 III（较低）。事故特点是：人员伤亡较大、经济损失较大。是机场事故灾难应急处置的关注重点。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900 pt-1">
              4.2.5 机场运行过程中管理失控，操作人员工作失误，环境不良等导致的涉及航空器事故的其他因素
            </h3>
            <p className="text-slate-600">
              造成人员伤亡、航空器受损。可能性等级为 C 偶尔发生，严重度等级为2，风险等级为 III（较低）。事故特点是：人员伤亡小、经济损失较小。是机场事故灾难应急处置应关注的重点。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900 pt-1">
              4.2.6 机场净空范围内的超高障碍物
            </h3>
            <p className="text-slate-600">
              造成航空器撞击导致飞机失事，地面人员伤亡的风险。可能性等级为 0 不可能发生，严重度等级为 6，风险等级为 IV（低）。事故特点是：人员伤亡众多、经济损失巨大，具有突然性和不确定性。是机场事故灾难应急处置应关注的内容。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900 pt-1">
              4.2.7 机坪运行的航空器与各类保障车辆
            </h3>
            <p className="text-slate-600">
              造成与航空器相撞的风险。可能性等级为 B 很少发生，严重度等级为 2，风险等级为 IV（低）。事故特点是：人员伤亡较小、经济损失较小、具有突然性。是机场事故灾难应急处置应关注的重点。
            </p>

            <h3 className="font-bold text-[15px] text-slate-900 pt-2 border-t border-slate-100">
              4.3 非航空器相关危险源风险分析
            </h3>

            <h3 className="font-bold text-[14px] text-slate-900">
              4.3.1 航站楼内电器设备
            </h3>
            <p className="text-slate-600">
              防护失效、短路等引起航站楼火灾、人员触电伤害。可能性等级为 B 很少发生，严重度等级为 3，风险等级为 III（较低）。事故特点是：人员伤亡较大、经济损失较大。是机场事故灾难应急处置关注的重点。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900">
              4.3.2 恐怖分子在人员密集场所放置的爆炸物、有毒危险化学品
            </h3>
            <p className="text-slate-600">
              造成大量人员伤亡，设施损毁。可能性等级为 A 几乎不发生，严重度等级为 5，风险等级为 II（中）。事故特点是：人员伤亡较大、经济损失较大、国际影响较大，具有突然性和不确定性。对于此外部恐怖威胁，已超出机场风险管控能力范围。但机场应将其作为事故灾难应急处置的防范和关注重点。
            </p>

            <h3 className="font-bold text-[14px] text-slate-900">
              4.3.3 高强度地震等自然灾害
            </h3>
            <p className="text-slate-600">
              造成大量人员伤亡、设施设备严重受损，具有突然性的特征。可能性等级为 A 几乎不发生，严重度等级为 5。
            </p>

            <div className="flex justify-between text-[11px] text-slate-400 py-2 border-t border-slate-100">
              <span>应急预案手册</span>
              <span>综合应急预案</span>
              <span>E1-4-4</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen Video Player View
  if (playingVideoFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between text-white select-none">
        {/* Video Top Bar */}
        <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlayingVideoFullscreen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-[15px] font-medium tracking-tight truncate max-w-[240px]">
              {course.materials[0]?.title || course.title}
            </h2>
          </div>

          <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Simulation */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
            alt="Airport Video"
            className="w-full h-full object-cover"
          />

          {/* Pause overlay button if paused */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}
        </div>

        {/* Video Bottom Controls */}
        <div className="p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-3 z-10">
          {/* Progress Slider */}
          <div className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer">
            <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full w-[35%]" />
            <div className="absolute top-1/2 left-[35%] -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md" />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-[13px] text-white/90">
            <div className="flex items-center gap-4">
              <button className="hover:text-white">
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-white"
              >
                {isPlaying ? (
                  <span className="font-bold text-lg leading-none">||</span>
                ) : (
                  <Play className="w-5 h-5 fill-white" />
                )}
              </button>

              <button className="hover:text-white">
                <SkipForward className="w-5 h-5" />
              </button>

              <Volume2 className="w-5 h-5 opacity-80" />

              <span className="text-[12px] opacity-80 font-mono">
                02:10 / 01:03:32
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[12px] font-medium transition-colors"
              >
                {playbackSpeed}
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-slate-900/95 border border-slate-700/80 rounded-lg p-1.5 space-y-1 text-center text-[12px] w-18 backdrop-blur-md">
                  {['1.0x', '1.25x', '1.5x', '2.0x'].map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setPlaybackSpeed(s);
                        setShowSpeedMenu(false);
                      }}
                      className="py-1 hover:bg-white/20 rounded cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-10">
      {/* Top Header Navigation */}
      <div className="px-2 py-3 flex items-center justify-between app-plan-query-bg sticky top-0 z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          课程详情
        </h1>

        {/* Demo Toggle Mode Switcher */}
        <button
          onClick={toggleCourseType}
          className="text-[11px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors"
        >
          切为{course.type === 'video' ? '图文' : '视频'}
        </button>
      </div>

      {/* Main Course Header Area */}
      {course.type === 'video' ? (
        /* Video Player Header */
        <div className="w-full bg-slate-900">
          <div className="relative w-full aspect-video bg-black flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
              alt="Airport Preview"
              className="w-full h-full object-cover opacity-90"
            />
            {/* Play overlay button */}
            <button
              onClick={() => setPlayingVideoFullscreen(true)}
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </button>

            {/* Fullscreen Trigger Icon */}
            <button
              onClick={() => setPlayingVideoFullscreen(true)}
              className="absolute bottom-2 right-2 p-1.5 text-white/90 hover:text-white bg-black/40 rounded-lg backdrop-blur-xs"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Video Info under Player */}
          <div className="p-3.5 bg-white space-y-1.5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-slate-900">
                {course.title}
              </h2>
              <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {course.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-[12px] text-slate-400 pt-1">
              <span>{course.duration}</span>
              <span className="text-slate-500 font-medium">{course.progress}%</span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Document Poster Header */
        <div className="p-3.5 bg-white border-b border-slate-100 flex gap-3.5 items-center">
          {/* Blue Poster Thumbnail */}
          <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#3ba2ff] to-[#0a7aff] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
            <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
            <span className="text-[13px] font-bold leading-tight">
              {course.title}
            </span>
            <div className="w-full h-8 bg-white/10 rounded-lg absolute -bottom-2 -right-2" />
          </div>

          <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-slate-900 truncate">
                  {course.title}
                </h2>
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
                  {course.status}
                </span>
              </div>

              <div className="mt-1">
                <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                  {course.category}
                </span>
              </div>

              <p className="text-[12px] text-slate-400 mt-1.5">
                有效期至： {course.validUntil}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                <span>{course.duration}</span>
                <span className="text-slate-500 font-medium">{course.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Container (课件信息 vs 课件列表) */}
      <div className="mt-3 mx-3 app-card p-4 shadow-2xs border border-slate-100/80 min-h-[380px]">
        {/* Tab Headers */}
        <div className="flex items-center justify-center gap-16 border-b border-slate-100/60 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`text-[16px] font-bold relative transition-colors ${
              activeTab === 'info' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            课件信息
            {activeTab === 'info' && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`text-[16px] font-bold relative transition-colors ${
              activeTab === 'list' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            课件列表
            {activeTab === 'list' && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content 1: 课件信息 */}
        {activeTab === 'info' && (
          <div className="space-y-4 pt-1">
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2">
                课程介绍
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed font-sans">
                {course.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-[13px]">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">学习时长</span>
                <span className="text-slate-800">{course.duration}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">必学时长</span>
                <span className="text-slate-800">{course.requiredDuration}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">课程教师</span>
                <span className="text-slate-800">{course.teacher}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">培训计划</span>
                <span className="text-slate-800">{course.plan}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">课程类型</span>
                <span className="text-slate-800">{course.category}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">有效期至</span>
                <span className="text-slate-800">{course.validUntil}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: 课件列表 */}
        {activeTab === 'list' && (
          <div className="space-y-4 pt-1">
            {course.materials.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between pb-3.5 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* Custom Icon based on doc/ppt/mp4 */}
                  {m.type === 'doc' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] text-white flex items-center justify-center font-bold text-sm shadow-2xs flex-shrink-0">
                      W
                    </div>
                  )}

                  {m.type === 'ppt' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center font-bold text-sm shadow-2xs flex-shrink-0">
                      P
                    </div>
                  )}

                  {m.type === 'mp4' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center shadow-2xs flex-shrink-0">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-[14px] font-semibold text-slate-800 truncate">
                      {m.title}
                    </h4>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      {m.learnedTime}
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    if (m.type === 'mp4') {
                      setPlayingVideoFullscreen(true);
                    } else {
                      setReadingDoc(m.title);
                    }
                  }}
                  className="px-4 py-1.5 bg-[#0070f3] hover:bg-[#005bb5] text-white text-[13px] font-medium rounded-full shadow-2xs transition-colors flex-shrink-0"
                >
                  {m.type === 'mp4' ? '播放' : '学习'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
