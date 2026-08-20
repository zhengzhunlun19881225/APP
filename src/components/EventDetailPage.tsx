import React, { useState } from 'react';
import {
  ChevronLeft,
  Phone,
  Video,
  Globe2,
  Camera,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Layers,
  Sparkles,
  ChevronDown,
  X,
  Play,
  Share2,
  Eye,
  AlertTriangle,
  Radio,
  Maximize2
} from 'lucide-react';

interface EventDetailPageProps {
  onBack: () => void;
  onNavigateToMeeting?: () => void;
  onNavigateToPersonnelDispatch?: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  onBack,
  onNavigateToMeeting,
  onNavigateToPersonnelDispatch
}) => {
  const [activeRecordTab, setActiveRecordTab] = useState<'process' | 'circulate'>('process');
  const [showMoreCirculate, setShowMoreCirculate] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ type: 'image' | 'video'; url: string; title: string } | null>(null);
  const [actionModal, setActionModal] = useState<'situation' | 'cctv' | 'video-meet' | 'contacts' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const circulateList = [
    {
      id: '1',
      name: '胡强',
      department: '增城区监督中心',
      status: '未阅',
      readTime: null,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: '2',
      name: '张东林',
      department: '增城区监督中心',
      status: '未阅',
      readTime: null,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: '3',
      name: '宋佳',
      department: '增城区监督中心',
      status: '已阅',
      readTime: '2026-08-14 10:05:14',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: '4',
      name: '陈杰',
      department: '增城区监督中心',
      status: '已阅',
      readTime: '2026-08-14 10:05:14',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: '5',
      name: '赵立德',
      department: '增城区应急管理局指挥中心',
      status: '已阅',
      readTime: '2026-08-14 10:06:22',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    {
      id: '6',
      name: '刘敏华',
      department: '荔城街道综治维稳中心',
      status: '已阅',
      readTime: '2026-08-14 10:07:45',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    }
  ];

  const displayedCirculates = showMoreCirculate ? circulateList : circulateList.slice(0, 4);

  return (
    <div className="flex flex-col h-full bg-[#f5f6fa] select-none relative overflow-hidden">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-[13px] px-4 py-2 rounded-full shadow-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 animate-in fade-in zoom-in-95">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <div className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-slate-100 shadow-xs z-10">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 active:scale-95 transition-transform flex items-center cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">事件详情</h1>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
        {/* Card 1: Event Summary & Scene Photos */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 relative">
          {/* Top Right Status Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 bg-[#007aff] text-white text-[12px] font-bold rounded-[4px] shadow-xs">
              已响应
            </span>
          </div>

          {/* Title & Incident No. */}
          <div className="pr-18 mb-1.5">
            <h2 className="text-[18px] font-bold text-slate-900 leading-snug tracking-tight">
              202608140898 人员踩踏事件
            </h2>
            <p className="text-[12px] text-slate-400 mt-1 flex items-center gap-2">
              <span>2026-08-14 10:04:34</span>
              <span>来源 常态化巡查</span>
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-1.5 my-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-[12px] font-medium border border-sky-100/60 w-full">
              <Layers className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span className="truncate">事件-突发应急-人员踩踏事件</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[12px] font-medium border border-emerald-100/60 w-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">增城区-荔城街道-新天美地社区-网格责任3</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-slate-700 leading-relaxed text-justify mb-3.5 font-normal">
            关于巡查发现广东省广州市增城区民生街与育才路交叉口往西北约70米广场活动区域，突发超大人流量过度拥挤，出现人员倒地及踩踏险情，影响公共安全秩序。（请注明工作人员几日几时几分到达现场处置与医疗救援，以便案件视频核查。）
          </p>

          {/* Scene Media Thumbnails (3 items) */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            {/* Image 1: Police / Emergency vehicle */}
            <div
              onClick={() =>
                setPreviewMedia({
                  type: 'image',
                  url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
                  title: '现场处置车辆与救援通道'
                })
              }
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80"
                alt="处置车辆"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 py-0.5 text-center text-white text-[11px] font-medium">
                处置
              </div>
            </div>

            {/* Image 2: Crowd situation */}
            <div
              onClick={() =>
                setPreviewMedia({
                  type: 'image',
                  url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80',
                  title: '现场人流密集管控区域'
                })
              }
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=300&q=80"
                alt="现场人流"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 py-0.5 text-center text-white text-[11px] font-medium">
                处置
              </div>
            </div>

            {/* Video 3: CCTV Playback */}
            <div
              onClick={() =>
                setPreviewMedia({
                  type: 'video',
                  url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
                  title: '高清监控回放与疏导实况'
                })
              }
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group shadow-xs"
            >
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80"
                alt="处置视频"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white border border-white/40 shadow-sm">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 py-0.5 text-center text-white text-[11px] font-medium">
                处置
              </div>
            </div>
          </div>

          {/* Dashed Separator */}
          <div className="border-t border-dashed border-slate-200 pt-2.5 flex items-start gap-1.5 text-[12px] text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">
              广东省广州市增城区民生街与育才路交叉口往西北约70米
            </span>
          </div>
        </div>

        {/* Card 2: Incident Metadata Table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 divide-y divide-slate-100">
          <div className="flex items-center justify-between py-2.5 first:pt-0">
            <span className="text-[13px] text-slate-500 font-medium">立案条件</span>
            <span className="text-[13px] text-slate-900 font-medium">公共场所人员过度聚集与踩踏险情</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[13px] text-slate-500 font-medium">单元网格</span>
            <span className="text-[13px] text-slate-900 font-medium">网格责任3</span>
          </div>
          <div className="flex items-center justify-between py-2.5 last:pb-0">
            <span className="text-[13px] text-slate-500 font-medium">道路类型</span>
            <span className="text-[13px] text-slate-900 font-medium">商业步行街 / 内街内巷</span>
          </div>
        </div>

        {/* Card 3: Supervisor (监督员) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
            <h3 className="text-[14px] font-bold text-slate-900">监督员</h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                  alt="李维文"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-slate-900">李维文</h4>
                <p className="text-[12px] text-slate-400">监督员 · 增城区监督中心</p>
              </div>
            </div>

            <button
              onClick={() => showToast('正在发起与监督员【李维文】的应急直连呼叫...')}
              className="px-3.5 py-1.5 text-[12px] font-bold text-blue-600 border border-blue-500 hover:bg-blue-50 rounded-full active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              联系TA
            </button>
          </div>
        </div>

        {/* Card 4: Tabbed Records (处理记录 / 传阅记录) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
          {/* Tabs Bar */}
          <div className="flex items-center justify-center gap-12 border-b border-slate-100 pb-3 mb-4">
            <button
              onClick={() => setActiveRecordTab('process')}
              className={`text-[15px] font-bold pb-1 relative cursor-pointer transition-colors ${
                activeRecordTab === 'process'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              处理记录
              {activeRecordTab === 'process' && (
                <span className="absolute bottom-[-13px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveRecordTab('circulate')}
              className={`text-[15px] font-bold pb-1 relative cursor-pointer transition-colors ${
                activeRecordTab === 'circulate'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              传阅记录
              {activeRecordTab === 'circulate' && (
                <span className="absolute bottom-[-13px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* TAB 1: 处理记录 (Timeline) */}
          {activeRecordTab === 'process' && (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-3 before:w-0.5 before:bg-blue-200">
              {/* Timeline Item 1: 办结 */}
              <div className="relative">
                <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <p className="text-[12px] text-slate-400 mb-1 font-medium">2026-08-14 10:05:14</p>
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/90">
                  <h4 className="text-[13px] font-bold text-blue-600 mb-1">
                    张旭（荔城街道）
                  </h4>
                  <div className="space-y-1 text-[12px]">
                    <p className="text-slate-700">
                      <span className="text-slate-400 mr-2 font-medium">处理操作</span>
                      <span className="font-semibold text-slate-900">事件办结</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="text-slate-400 mr-2 font-medium">处理意见</span>
                      收到，已调派民警及网格防暴巡逻组现场拉设警戒隔离带、疏导人流离场，医疗救护队就位，秩序平稳。
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2: 批转 */}
              <div className="relative">
                <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <p className="text-[12px] text-slate-400 mb-1 font-medium">2026-08-14 10:05:14</p>
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/90">
                  <h4 className="text-[13px] font-bold text-blue-600 mb-1">
                    增城区监督中心（李明）
                  </h4>
                  <div className="space-y-1 text-[12px]">
                    <p className="text-slate-700">
                      <span className="text-slate-400 mr-2 font-medium">处理操作</span>
                      <span className="font-semibold text-slate-900">事件批转</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="text-slate-400 mr-2 font-medium">处理意见</span>
                      执行办理工作项，联动荔城街道安监中队与交警增援管控
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3: 接报 */}
              <div className="relative">
                <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-blue-400 ring-4 ring-blue-100 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <p className="text-[12px] text-slate-400 mb-1 font-medium">2026-08-14 10:05:14</p>
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/90">
                  <h4 className="text-[13px] font-bold text-blue-600 mb-1">
                    林鸣（增城区指挥中心）
                  </h4>
                  <div className="space-y-1 text-[12px]">
                    <p className="text-slate-700">
                      <span className="text-slate-400 mr-2 font-medium">处理操作</span>
                      <span className="font-semibold text-slate-900">事件接报</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="text-slate-400 mr-2 font-medium">处理意见</span>
                      执行办理工作项
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Item 4: APP上报 */}
              <div className="relative">
                <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-blue-300 ring-4 ring-blue-100 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </span>
                <p className="text-[12px] text-slate-400 mb-1 font-medium">2026-08-14 10:08:21</p>
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/90">
                  <h4 className="text-[13px] font-bold text-blue-600 mb-1">
                    王利明（荔城街道）
                  </h4>
                  <div className="space-y-1 text-[12px]">
                    <p className="text-slate-700">
                      <span className="text-slate-400 mr-2 font-medium">处理操作</span>
                      <span className="font-semibold text-slate-900">APP上报</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 传阅记录 (Circulation List) */}
          {activeRecordTab === 'circulate' && (
            <div className="space-y-3 divide-y divide-slate-100">
              {displayedCirculates.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[12px] text-slate-400">{item.department}</p>
                      {item.readTime && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.readTime}</p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[13px] font-bold ${
                      item.status === '已阅' ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    【{item.status}】
                  </span>
                </div>
              ))}

              {/* Expand button */}
              <div className="pt-3 text-center">
                <button
                  onClick={() => setShowMoreCirculate(!showMoreCirculate)}
                  className="text-[12px] font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{showMoreCirculate ? '收起记录' : '展开更多 (共6人)'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showMoreCirculate ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Operations Toolbar (4 Action Buttons matching Design) */}
      <div className="bg-white border-t border-slate-100 px-2 py-2 flex items-center justify-around shadow-lg z-20">
        {/* 1. 态势研判 */}
        <button
          onClick={() => setActionModal('situation')}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-700 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
        >
          <Globe2 className="w-5 h-5 stroke-[2.2] text-blue-600 mb-0.5" />
          <span className="text-[11px] font-bold">态势研判</span>
        </button>

        {/* 2. 监控研判 */}
        <button
          onClick={() => setActionModal('cctv')}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-700 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
        >
          <Camera className="w-5 h-5 stroke-[2.2] text-blue-600 mb-0.5" />
          <span className="text-[11px] font-bold">监控研判</span>
        </button>

        {/* 3. 视频会商 */}
        <button
          onClick={() => {
            if (onNavigateToMeeting) {
              onNavigateToMeeting();
            } else {
              setActionModal('video-meet');
            }
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-700 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
        >
          <Video className="w-5 h-5 stroke-[2.2] text-blue-600 mb-0.5" />
          <span className="text-[11px] font-bold">视频会商</span>
        </button>

        {/* 4. 通讯联络 */}
        <button
          onClick={() => {
            if (onNavigateToPersonnelDispatch) {
              onNavigateToPersonnelDispatch();
            } else {
              setActionModal('contacts');
            }
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 text-slate-700 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
        >
          <Users className="w-5 h-5 stroke-[2.2] text-blue-600 mb-0.5" />
          <span className="text-[11px] font-bold">通讯联络</span>
        </button>
      </div>

      {/* Modal 1: 态势研判分析 */}
      {actionModal === 'situation' && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe2 className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900">人员踩踏·态势综合研判</h3>
              </div>
              <button
                onClick={() => setActionModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-3 text-[13px]">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>核心风险指标 (高危预警)</span>
                </div>
                <p className="text-slate-700 text-[12px] leading-relaxed">
                  当前该网格人流密度达 <span className="font-bold text-rose-600">4.8人/㎡</span>，已触发三级踩踏险情预警阀值。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <p className="text-slate-400 text-[11px]">预计疏散耗时</p>
                  <p className="text-blue-600 font-black text-[16px] mt-0.5">12 分钟</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <p className="text-slate-400 text-[11px]">就近应急警力</p>
                  <p className="text-emerald-600 font-black text-[16px] mt-0.5">18 人已到达</p>
                </div>
              </div>

              <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 text-[12px] text-slate-700 space-y-1.5">
                <p className="font-bold text-blue-900">AI 联动研判建议：</p>
                <p>1. 立即关闭民生街往育才路南侧单向入口，实施人流分流。</p>
                <p>2. 开启应急广播，播放防踩踏避险疏导音频指令。</p>
                <p>3. 调度网格医疗巡查车于育才路东口设立临时救护接驳点。</p>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('已向荔城街道指挥分中心下发态势研判指令');
                setActionModal(null);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-xl shadow-md cursor-pointer"
            >
              一键下发处置指令
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: 监控研判 (CCTV Multi-view) */}
      {actionModal === 'cctv' && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900">现场天网高点监控视频</h3>
              </div>
              <button
                onClick={() => setActionModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-3">
              {/* CCTV Live View Player 1 */}
              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-black shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80"
                  alt="监控1"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-white text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>民生街育才路高点01·实时LIVE</span>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded">
                    AI人流追踪
                  </span>
                </div>
              </div>

              {/* CCTV Live View Player 2 */}
              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-black shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80"
                  alt="监控2"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-white text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>新天美地广场东门03·实时LIVE</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast('已抓取监控快照并归档入事件附件库');
                  setActionModal(null);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] rounded-xl cursor-pointer"
              >
                抓拍留证
              </button>
              <button
                onClick={() => {
                  showToast('已将现场画面推流至应急指挥中心大屏');
                  setActionModal(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-xl shadow-md cursor-pointer"
              >
                推流到大屏
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Media Lightbox Preview */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md bg-black/40 rounded-2xl overflow-hidden flex flex-col items-center relative">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-3 text-white text-center text-[14px] font-bold">
              {previewMedia.title}
            </div>
            <img
              src={previewMedia.url}
              alt={previewMedia.title}
              className="max-h-[60vh] w-auto object-contain rounded-lg"
            />
            <p className="text-white/60 text-[12px] p-3">点击任意位置关闭预览</p>
          </div>
        </div>
      )}
    </div>
  );
};
