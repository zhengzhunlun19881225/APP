import React, { useState } from 'react';
import { ChevronLeft, Calendar, Search } from 'lucide-react';
import { CourseDetailPage, CourseData } from './CourseDetailPage';
import { ExamSystem, ExamData } from './ExamSystem';

interface TrainingExamPageProps {
  onBack: () => void;
}

type TabType = 'todo' | 'training' | 'exam';

export const TrainingExamPage: React.FC<TrainingExamPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingFilter, setTrainingFilter] = useState<'all' | 'learning' | 'done'>('all');
  const [examFilter, setExamFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [activeExam, setActiveExam] = useState<ExamData | null>(null);

  if (activeExam) {
    return (
      <ExamSystem
        examData={activeExam}
        onBack={() => setActiveExam(null)}
        onComplete={() => {}}
      />
    );
  }

  if (selectedCourse) {
    return (
      <CourseDetailPage
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full app-plan-query-page-bg select-none overflow-y-auto pb-8">
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-transparent sticky top-0 z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          培训考试
        </h1>

        <div className="w-8"></div>
      </div>

      {/* Main Content Area */}
      <div className="px-3 space-y-3.5 mt-2">
        {/* 我的学习数据 Blue Card */}
        <div className="relative w-full rounded-[20px] bg-gradient-to-r from-[#0070f3] via-[#0088ff] to-[#00b2ff] p-4 text-white overflow-hidden shadow-md">
          {/* Decorative Gold Trophy Image/Graphic */}
          <div className="absolute top-2 right-2 w-20 h-20 pointer-events-none drop-shadow-md">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              {/* Cup handles */}
              <path d="M22 28 C12 28 12 48 28 50" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M78 28 C88 28 88 48 72 50" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Main Cup */}
              <path d="M26 22 H74 V46 C74 58 60 66 50 66 C40 66 26 58 26 46 V22 Z" fill="#FFC700" />
              <path d="M26 22 H74 V30 H26 V22 Z" fill="#FFE042" />
              {/* Star on trophy */}
              <polygon points="50,30 53,38 61,38 55,43 57,51 50,46 43,51 45,43 39,38 47,38" fill="white" fillOpacity="0.95" />
              {/* Stem & Base */}
              <rect x="44" y="66" width="12" height="12" fill="#E6A100" />
              <rect x="32" y="78" width="36" height="8" rx="3" fill="#FFC700" />
            </svg>
          </div>

          <h2 className="text-[16px] font-bold tracking-tight text-white mb-4">
            我的学习数据
          </h2>

          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/20 text-center">
            {/* Metric 1 */}
            <div>
              <div className="text-[11px] text-white/80 font-normal mb-1">累计学习</div>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-[22px] font-black leading-none tracking-tight">126</span>
                <span className="text-[11px] text-white/90">小时</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="text-[11px] text-white/80 font-normal mb-1">通过考试/总场次</div>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-[22px] font-black leading-none tracking-tight">12/13</span>
                <span className="text-[11px] text-white/90">次</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div className="text-[11px] text-white/80 font-normal mb-1">平均成绩</div>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-[22px] font-black leading-none tracking-tight">76.5</span>
                <span className="text-[11px] text-white/90">分</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('todo')}
              className={`text-[16px] font-bold relative pb-1.5 transition-colors ${
                activeTab === 'todo' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              待办
              {activeTab === 'todo' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('training')}
              className={`text-[16px] font-bold relative pb-1.5 transition-colors ${
                activeTab === 'training' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              培训记录
              {activeTab === 'training' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`text-[16px] font-bold relative pb-1.5 transition-colors ${
                activeTab === 'exam' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              考试记录
              {activeTab === 'exam' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          <button className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors">
            <Calendar className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索"
            className="w-full h-10 bg-white rounded-xl pl-9 pr-4 py-0 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-100 shadow-2xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Pills for 培训记录 & 考试记录 */}
        {activeTab === 'training' && (
          <div className="flex items-center gap-2 pt-0.5 text-[13px]">
            <span className="text-slate-400 mr-1 font-normal">状态</span>
            <button
              onClick={() => setTrainingFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                trainingFilter === 'all'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setTrainingFilter('learning')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                trainingFilter === 'learning'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              学习中
            </button>
            <button
              onClick={() => setTrainingFilter('done')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                trainingFilter === 'done'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              已完成
            </button>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="flex items-center gap-2 pt-0.5 text-[13px]">
            <span className="text-slate-400 mr-1 font-normal">状态</span>
            <button
              onClick={() => setExamFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                examFilter === 'all'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setExamFilter('pass')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                examFilter === 'pass'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              及格
            </button>
            <button
              onClick={() => setExamFilter('fail')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                examFilter === 'fail'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              未及格
            </button>
          </div>
        )}

        {/* List Items depending on activeTab */}
        <div className="space-y-3 pt-1">
          {/* ================ TAB 1: 待办 (TODO) ================ */}
          {activeTab === 'todo' && (
            <>
              {/* Card 1: 应急预案知识考试 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                {/* Green Cover Poster */}
                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#1cd99b] to-[#12bd84] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案知识考试
                  </span>
                  <div className="w-full h-8 bg-white/10 rounded-lg absolute -bottom-2 -right-2" />
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate">
                      应急预案知识考试
                    </h3>

                    {/* Tag */}
                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1.5">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>60分钟 &nbsp;|&nbsp; 25题 &nbsp;|&nbsp; 100分</span>
                    <button
                      onClick={() =>
                        setActiveExam({
                          id: 'e1',
                          title: '应急预案知识考试',
                          timeRange: '06/04 10:30 – 06/04 11:30',
                          totalScore: 100,
                          passScore: 80,
                          durationMinutes: 60,
                          remainingAttempts: 2
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white text-[12px] font-medium rounded-full shadow-2xs transition-colors active:scale-95 cursor-pointer"
                    >
                      开始考试
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: 应急预案学习 (继续学习 50%) */}
              <div
                onClick={() =>
                  setSelectedCourse({
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
                  })
                }
                className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
              >
                {/* Blue Cover Poster */}
                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#3ba2ff] to-[#0a7aff] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案学习
                  </span>
                  <div className="w-full h-8 bg-white/10 rounded-lg absolute -bottom-2 -right-2" />
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate">
                      应急预案学习
                    </h3>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        线上课
                      </span>
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                      <span>1小时30分钟</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">50%</span>
                        <button className="px-3.5 py-1.5 bg-[#0070f3] hover:bg-[#005bb5] text-white text-[12px] font-medium rounded-full shadow-2xs transition-colors">
                          继续学习
                        </button>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[50%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: 应急预案学习 (开始学习 0%) */}
              <div
                onClick={() =>
                  setSelectedCourse({
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
                  })
                }
                className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
              >
                {/* Blue Cover Poster */}
                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#3ba2ff] to-[#0a7aff] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案学习
                  </span>
                  <div className="w-full h-8 bg-white/10 rounded-lg absolute -bottom-2 -right-2" />
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate">
                      应急预案学习
                    </h3>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        线上课
                      </span>
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                      <span>1小时30分钟</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">0%</span>
                        <button className="px-3.5 py-1.5 bg-[#0070f3] hover:bg-[#005bb5] text-white text-[12px] font-medium rounded-full shadow-2xs transition-colors">
                          开始学习
                        </button>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[0%]" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================ TAB 2: 培训记录 (TRAINING RECORDS) ================ */}
          {activeTab === 'training' && (
            <>
              {/* Card 1: 学习中 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                {/* Status Badge */}
                <span className="absolute top-2 right-2 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  学习中
                </span>

                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#3ba2ff] to-[#0a7aff] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案学习
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate pr-12">
                      应急预案学习
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        线上课
                      </span>
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                      <span>1小时30分钟</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">50%</span>
                        <button className="px-3.5 py-1.5 bg-[#0070f3] text-white text-[12px] font-medium rounded-full shadow-2xs">
                          继续学习
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[50%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: 已完成 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  已完成
                </span>

                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#3ba2ff] to-[#0a7aff] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案学习
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate pr-12">
                      突发事件应急救援预案...
                    </h3>

                    <p className="text-[12px] text-slate-400 mt-1">
                      课程类型： 应急预案培训
                    </p>

                    <p className="text-[12px] text-slate-400 mt-0.5">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                      <span>1小时30分钟</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">100%</span>
                        <button className="px-3.5 py-1.5 bg-[#0070f3] text-white text-[12px] font-medium rounded-full shadow-2xs">
                          查看详情
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[100%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: 已完成 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  已完成
                </span>

                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#3ba2ff] to-[#0a7aff] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案学习
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate pr-12">
                      应急预案学习
                    </h3>

                    <p className="text-[12px] text-slate-400 mt-1">
                      课程类型： 应急预案培训
                    </p>

                    <p className="text-[12px] text-slate-400 mt-0.5">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                      <span>1小时30分钟</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">100%</span>
                        <button className="px-3.5 py-1.5 bg-[#0070f3] text-white text-[12px] font-medium rounded-full shadow-2xs">
                          查看详情
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full w-[100%]" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================ TAB 3: 考试记录 (EXAM RECORDS) ================ */}
          {activeTab === 'exam' && (
            <>
              {/* Card 1: 及格 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  及格
                </span>

                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#1cd99b] to-[#12bd84] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案知识考试
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate pr-12">
                      应急预案知识考试
                    </h3>

                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1.5">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>60分钟 &nbsp;|&nbsp; 25题 &nbsp;|&nbsp; 100分</span>
                    <button
                      onClick={() =>
                        setActiveExam({
                          id: 'e1',
                          title: '应急预案知识考试',
                          timeRange: '06/04 10:30 – 06/04 11:30',
                          totalScore: 100,
                          passScore: 80,
                          durationMinutes: 60,
                          remainingAttempts: 2
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#0070f3] text-white text-[12px] font-medium rounded-full shadow-2xs hover:bg-[#005bb5] active:scale-95 transition-all cursor-pointer"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: 及格 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  及格
                </span>

                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#1cd99b] to-[#12bd84] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案知识考试
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate pr-12">
                      应急预案知识考试
                    </h3>

                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1.5">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>60分钟 &nbsp;|&nbsp; 25题 &nbsp;|&nbsp; 100分</span>
                    <button
                      onClick={() =>
                        setActiveExam({
                          id: 'e1',
                          title: '应急预案知识考试',
                          timeRange: '06/04 10:30 – 06/04 11:30',
                          totalScore: 100,
                          passScore: 80,
                          durationMinutes: 60,
                          remainingAttempts: 2
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#0070f3] text-white text-[12px] font-medium rounded-full shadow-2xs hover:bg-[#005bb5] active:scale-95 transition-all cursor-pointer"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: 未及格 */}
              <div className="bg-white rounded-[16px] p-3 shadow-2xs border border-slate-100/80 flex gap-3 items-center relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                  未及格
                </span>

                <div className="w-22 h-26 rounded-[12px] bg-gradient-to-b from-[#1cd99b] to-[#12bd84] p-2 flex flex-col justify-between text-white flex-shrink-0 shadow-xs relative overflow-hidden">
                  <div className="w-8 h-1 bg-white/40 rounded-full mb-1" />
                  <span className="text-[13px] font-bold leading-tight">
                    应急预案知识考试
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between h-26">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 truncate pr-12">
                      应急预案知识考试
                    </h3>

                    <div className="mt-1">
                      <span className="px-2 py-0.5 text-[11px] text-slate-500 bg-slate-100 rounded-[6px]">
                        应急预案培训
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-400 mt-1.5">
                      有效期至： 2026–07-16
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>60分钟 &nbsp;|&nbsp; 25题 &nbsp;|&nbsp; 100分</span>
                    <button
                      onClick={() =>
                        setActiveExam({
                          id: 'e1',
                          title: '应急预案知识考试',
                          timeRange: '06/04 10:30 – 06/04 11:30',
                          totalScore: 100,
                          passScore: 80,
                          durationMinutes: 60,
                          remainingAttempts: 2
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#0070f3] text-white text-[12px] font-medium rounded-full shadow-2xs hover:bg-[#005bb5] active:scale-95 transition-all cursor-pointer"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
