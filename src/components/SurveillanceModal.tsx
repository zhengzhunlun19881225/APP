import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Scissors,
  Mic,
  Video,
  PlayCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Plus,
  Minus,
  LayoutGrid,
  Camera,
  Layers,
  Clock,
  Bell,
  Siren,
  Play,
  Activity,
  Move
} from 'lucide-react';
import { SurveillanceCamera } from '../data/surveillanceData';

interface PlaybackEvent {
  id: string;
  time: string;
  decimalHour: number;
  type: 'person' | 'motion' | 'doorbell' | 'alarm';
  title: string;
  thumbnail: string;
  videoUrl: string;
}

const TEST_SURVEILLANCE_VIDEO = '/surveillance-test/people-detection.mp4';

const PLAYBACK_EVENTS: PlaybackEvent[] = [
  {
    id: 'evt-1',
    time: '17:20',
    decimalHour: 17 + 20 / 60,
    type: 'person',
    title: '检测到有人活动',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    videoUrl: TEST_SURVEILLANCE_VIDEO
  },
  {
    id: 'evt-2',
    time: '17:18',
    decimalHour: 17 + 18 / 60,
    type: 'motion',
    title: '检测到画面变化',
    thumbnail: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80',
    videoUrl: TEST_SURVEILLANCE_VIDEO
  },
  {
    id: 'evt-3',
    time: '17:16',
    decimalHour: 17 + 16 / 60,
    type: 'doorbell',
    title: '门铃推送',
    thumbnail: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80',
    videoUrl: TEST_SURVEILLANCE_VIDEO
  },
  {
    id: 'evt-4',
    time: '17:11',
    decimalHour: 17 + 11 / 60,
    type: 'alarm',
    title: '紧急报警',
    thumbnail: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=400&q=80',
    videoUrl: TEST_SURVEILLANCE_VIDEO
  },
  {
    id: 'evt-5',
    time: '16:50',
    decimalHour: 16 + 50 / 60,
    type: 'person',
    title: '检测到有人活动',
    thumbnail: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    videoUrl: TEST_SURVEILLANCE_VIDEO
  },
  {
    id: 'evt-6',
    time: '16:32',
    decimalHour: 16 + 32 / 60,
    type: 'motion',
    title: '检测到画面变化',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    videoUrl: TEST_SURVEILLANCE_VIDEO
  }
];

interface SurveillanceModalProps {
  camera: SurveillanceCamera;
  onClose: () => void;
  onToggleFavorite?: (cameraId?: string) => void;
  onFullscreenToggle?: () => void;
  onEnterFullscreen?: () => void;
  isFavorite?: boolean;
  isFullscreen?: boolean;
}

export const SurveillanceModal: React.FC<SurveillanceModalProps> = ({
  camera,
  onClose,
  onToggleFavorite,
  onFullscreenToggle,
  onEnterFullscreen,
  isFavorite: initialFavorite,
  isFullscreen = false
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'ptz'>('info');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoQuality, setVideoQuality] = useState<'高清' | '超清' | '标清'>('高清');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isGridMode, setIsGridMode] = useState(false);

  // Video element refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Quick Action States
  const [isIntercomActive, setIsIntercomActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);

  // PTZ Simulated Transform & Joystick
  const [ptzTransform, setPtzTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });
  const [activeDirectionAngle, setActiveDirectionAngle] = useState<number | null>(null);
  const [speed, setSpeed] = useState(30);
  const joystickDialRef = useRef<HTMLDivElement>(null);
  const isDraggingJoystick = useRef(false);

  // Playback Mode State (Image 1 Integration)
  const [showPlayback, setShowPlayback] = useState(false);
  const [selectedPlaybackDate, setSelectedPlaybackDate] = useState('12/03');
  const [activeEventId, setActiveEventId] = useState('evt-1');
  const [activeEventTime, setActiveEventTime] = useState('17:20:00');
  const [rulerOffset, setRulerOffset] = useState(48); // scrubber drag percentage 0..100
  const isDraggingRuler = useRef(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const playbackDates = ['11/30', '12/01', '12/02', '12/03'];

  // Current Video URL
  const currentEvent = PLAYBACK_EVENTS.find((e) => e.id === activeEventId) || PLAYBACK_EVENTS[0];
  const currentVideoSrc = showPlayback
    ? currentEvent.videoUrl
    : TEST_SURVEILLANCE_VIDEO;

  // Handle Video AutoPlay & Mute sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [currentVideoSrc, isMuted]);

  // Real-time ticking live clock formatted YYYY/MM/DD HH:mm:ss
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${year}/${month}/${day} ${hours}:${mins}:${secs}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 2000);
  };

  // Toggle Video Play/Pause
  const handleTogglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      showToast('继续播放');
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      showToast('暂停播放');
    }
  };

  // 1. 截屏 (Grab actual frame from video element)
  const handleTakeScreenshot = () => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    if (videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }
      } catch (err) {
        // fallback
      }
    }

    setSnapshotToast(`已保存快照：${camera.name}_${new Date().getTime().toString().slice(-6)}.jpg`);
    setTimeout(() => setSnapshotToast(null), 2500);
  };

  // 2. 对讲
  const handleToggleIntercom = () => {
    const next = !isIntercomActive;
    setIsIntercomActive(next);
    showToast(next ? '语音对讲已开启，请对准麦克风说话' : '已关闭语音对讲');
  };

  // 3. 录制
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast(`录像已保存 (${recordingSeconds}s)`);
    } else {
      setIsRecording(true);
      showToast('开始录像');
    }
  };

  // 4. 回放 (Toggle Playback Mode)
  const handleTogglePlayback = () => {
    const nextState = !showPlayback;
    setShowPlayback(nextState);
    if (nextState) {
      showToast('已进入历史视频回放');
    } else {
      showToast('已切换至实时监控');
    }
  };

  // PTZ Movement
  const handlePtzMove = (direction: string, dx: number, dy: number, angle?: number) => {
    const moveFactor = (speed / 30) * 10;
    setPtzTransform((prev) => ({
      ...prev,
      x: Math.max(-50, Math.min(50, prev.x + dx * (moveFactor / 10))),
      y: Math.max(-35, Math.min(35, prev.y + dy * (moveFactor / 10)))
    }));
    if (angle !== undefined) {
      setActiveDirectionAngle(angle);
      setTimeout(() => setActiveDirectionAngle(null), 600);
    }
    showToast(`云台向${direction}转动`);
  };

  // Zoom In / Out
  const handleZoom = (type: 'in' | 'out') => {
    setPtzTransform((prev) => ({
      ...prev,
      scale: type === 'in' ? Math.min(3, prev.scale + 0.25) : Math.max(1, prev.scale - 0.25)
    }));
    showToast(type === 'in' ? '画面放大 +' : '画面缩小 -');
  };

  // Fullscreen Container Request
  const handleContainerFullscreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        videoContainerRef.current.requestFullscreen?.().catch(() => {});
      }
    }
    if (onFullscreenToggle) {
      onFullscreenToggle();
    }
  };

  // Joystick Drag Handling
  const handleJoystickStart = (clientX: number, clientY: number) => {
    if (!joystickDialRef.current) return;
    isDraggingJoystick.current = true;
    updateJoystickPosition(clientX, clientY);
  };

  const updateJoystickPosition = (clientX: number, clientY: number) => {
    if (!joystickDialRef.current) return;
    const rect = joystickDialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const maxRadius = rect.width / 2 - 35;
    const angle = Math.atan2(dy, dx);

    const clampedDist = Math.min(distance, maxRadius);
    const offsetX = Math.cos(angle) * clampedDist;
    const offsetY = Math.sin(angle) * clampedDist;

    setJoystickOffset({ x: offsetX, y: offsetY });
    setActiveDirectionAngle((angle * 180) / Math.PI + 90);

    const normalizedIntensity = clampedDist / maxRadius;
    const moveFactor = (speed / 30) * 1.5;
    setPtzTransform((prev) => ({
      ...prev,
      x: Math.max(-50, Math.min(50, prev.x - Math.cos(angle) * normalizedIntensity * moveFactor)),
      y: Math.max(-35, Math.min(35, prev.y - Math.sin(angle) * normalizedIntensity * moveFactor))
    }));
  };

  const handleJoystickEnd = () => {
    isDraggingJoystick.current = false;
    setJoystickOffset({ x: 0, y: 0 });
    setTimeout(() => setActiveDirectionAngle(null), 300);
  };

  // Playback Ruler Drag Handling
  const handleRulerScrub = (clientX: number) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setRulerOffset(percentage);
    // calculate simulated minute
    const totalMinutes = Math.round((percentage / 100) * 60) + 11 * 60 + 10;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    setActiveEventTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
  };

  // Select a playback event item
  const handleSelectEvent = (evt: PlaybackEvent) => {
    setActiveEventId(evt.id);
    setActiveEventTime(`${evt.time}:00`);
    showToast(`播放录像：${evt.time} ${evt.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f4f6fa] flex flex-col select-none overflow-y-auto min-h-screen">
      {/* 1. Top Video Player Section (Real Playable Video with Grid Mode & Controls) */}
      <div
        ref={videoContainerRef}
        className="relative w-full aspect-[16/10] sm:aspect-video bg-slate-950 overflow-hidden flex-shrink-0 group"
      >
        {/* Flash Animation on Screenshot */}
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-out fade-out duration-300" />
        )}

        {/* Video Player Display: Single View vs 4-Split Grid Mode */}
        {!isGridMode ? (
          <div
            className="w-full h-full relative transition-transform duration-200 ease-out cursor-pointer"
            onClick={handleTogglePlayPause}
            style={{
              transform: `scale(${ptzTransform.scale}) translate(${ptzTransform.x}px, ${ptzTransform.y}px)`
            }}
          >
            <video
              ref={videoRef}
              src={currentVideoSrc}
              poster={
                showPlayback && activeEventId === 'evt-1'
                  ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80'
                  : camera.videoPoster || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
              }
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />

            {/* Paused state overlay icon */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-20">
                <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 4-Split Multi-Camera Grid Matrix View */
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 bg-black p-1">
            {[
              { id: '1', name: camera.name || '办公 A 区西北 (主路)', src: currentVideoSrc, active: true },
              { id: '2', name: '大堂主入口 (辅路)', src: TEST_SURVEILLANCE_VIDEO, active: false },
              { id: '3', name: '东侧走廊通道', src: TEST_SURVEILLANCE_VIDEO, active: false },
              { id: '4', name: '南区地下车库', src: TEST_SURVEILLANCE_VIDEO, active: false }
            ].map((cell, idx) => (
              <div
                key={cell.id}
                onClick={() => {
                  if (cell.active) {
                    setIsGridMode(false);
                    showToast('已切换至单目大屏');
                  } else {
                    showToast(`已选中通道 0${idx + 1}：${cell.name}`);
                  }
                }}
                className={`relative rounded overflow-hidden cursor-pointer ${
                  cell.active ? 'ring-2 ring-blue-500' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <video
                  src={cell.src}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] text-white rounded font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CH-0{idx + 1}</span>
                </div>
                <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white/90 truncate font-medium drop-shadow">
                  {cell.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subtle Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60 pointer-events-none" />

        {/* --- Video Overlay Top Bar --- */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between z-30 text-white pointer-events-auto">
          {/* Left: Back Button + Camera Title + Bitrate Stats */}
          <div className="flex items-start gap-2.5">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-white hover:text-blue-300 active:scale-95 transition-transform cursor-pointer"
              title="返回"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.4]" />
            </button>

            <div className="space-y-0.5">
              <h1 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md leading-tight">
                {camera.name || '办公 A 区西北'}
              </h1>
              <div className="text-[11px] text-white/80 font-mono flex items-center gap-2 drop-shadow">
                <span>1.91KB/s</span>
                <span>27fps</span>
              </div>
            </div>
          </div>

          {/* Right: Grid 4-split Icon */}
          <button
            onClick={() => {
              setIsGridMode(!isGridMode);
              showToast(!isGridMode ? '已开启四分屏多目监控预览' : '已切换回单屏全景模式');
            }}
            className={`p-1.5 rounded-lg transition-all drop-shadow cursor-pointer ${
              isGridMode ? 'bg-blue-600 text-white' : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            title="四分屏视图"
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* --- Video Overlay: 实时 / 回放 Status Indicator Pill --- */}
        <div className="absolute top-14 left-3 z-30 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/55 backdrop-blur-xs text-white text-[11px] font-medium border border-white/15 pointer-events-none">
          <Video className={`w-3.5 h-3.5 ${showPlayback ? 'text-blue-400' : 'text-emerald-400'}`} />
          <span>{showPlayback ? '回放' : '实时'}</span>
        </div>

        {/* Video Overlay: Recording active timer badge */}
        {isRecording && (
          <div className="absolute top-14 right-3 z-30 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-bold animate-pulse shadow-md pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>REC {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
        )}

        {/* --- Video Overlay Bottom Left: Timestamp --- */}
        <div className="absolute bottom-2.5 left-3 text-white/95 font-mono text-[13px] font-medium tracking-wide drop-shadow-md z-30 pointer-events-none">
          {showPlayback ? `2024/05/05 ${activeEventTime}` : currentTimeStr || '2024/05/05 19:33:00'}
        </div>

        {/* --- Video Overlay Bottom Right: Controls (Mute, Quality, PIP, Fullscreen) --- */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-30 text-white pointer-events-auto">
          {/* Mute / Unmute Button */}
          <button
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              if (videoRef.current) {
                videoRef.current.muted = nextMute;
              }
              showToast(!nextMute ? '已开启声音' : '已静音');
            }}
            className="w-7 h-7 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10 active:scale-95 cursor-pointer"
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quality Pill */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="h-7 px-2 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-[11px] font-bold text-white transition-all border border-white/10 active:scale-95 cursor-pointer"
              title="切换画质"
            >
              {videoQuality}
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-9 right-0 bg-slate-900/95 border border-slate-700/80 rounded-lg py-1 shadow-xl flex flex-col z-40 text-[12px] min-w-[64px]">
                {(['超清', '高清', '标清'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setVideoQuality(q);
                      setShowQualityMenu(false);
                      showToast(`已切换至 ${q} 模式`);
                    }}
                    className={`px-3 py-1.5 text-left transition-colors cursor-pointer ${
                      videoQuality === q ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Picture-in-Picture / Float Mode */}
          <button
            onClick={() => showToast('已开启画中画小窗播放')}
            className="w-7 h-7 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10 active:scale-95 cursor-pointer"
            title="画中画小窗"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Fullscreen Expand Button */}
          <button
            onClick={handleContainerFullscreen}
            className="w-7 h-7 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10 active:scale-95 cursor-pointer"
            title="全屏预览"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Snapshot Feedback Banner */}
        {snapshotToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/85 text-white text-[12px] px-3.5 py-2 rounded-full shadow-2xl border border-white/20 z-40 flex items-center gap-1.5 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>{snapshotToast}</span>
          </div>
        )}

        {/* Action Toast */}
        {actionToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600/90 text-white text-[12px] font-medium px-4 py-1.5 rounded-full shadow-2xl border border-blue-400/40 z-40 whitespace-nowrap animate-in zoom-in-95 pointer-events-none">
            {actionToast}
          </div>
        )}
      </div>

      {/* 2. Middle Quick Function Action Bar Card (截屏 / 对讲 / 录制 / 回放) */}
      <div className="mx-3 mt-3 bg-white rounded-2xl p-3 shadow-2xs border border-slate-100/80 flex items-center justify-around">
        {/* 1. 截屏 (Screenshot) */}
        <button
          onClick={handleTakeScreenshot}
          className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-[#f0f2f5] group-hover:bg-[#e4e7ec] flex items-center justify-center text-slate-700 transition-colors shadow-2xs">
            <Scissors className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-[12px] text-slate-700 font-medium">截屏</span>
        </button>

        {/* 2. 对讲 (Intercom) */}
        <button
          onClick={handleToggleIntercom}
          className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-2xs ${
              isIntercomActive
                ? 'bg-blue-600 text-white animate-pulse ring-4 ring-blue-100'
                : 'bg-[#f0f2f5] group-hover:bg-[#e4e7ec] text-slate-700'
            }`}
          >
            <Mic className="w-5 h-5 stroke-[2]" />
          </div>
          <span className={`text-[12px] font-medium ${isIntercomActive ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
            对讲
          </span>
        </button>

        {/* 3. 录制 (Record) */}
        <button
          onClick={handleToggleRecord}
          className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-2xs ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100'
                : 'bg-[#f0f2f5] group-hover:bg-[#e4e7ec] text-slate-700'
            }`}
          >
            <Video className="w-5 h-5 stroke-[2]" />
          </div>
          <span className={`text-[12px] font-medium ${isRecording ? 'text-red-500 font-bold' : 'text-slate-700'}`}>
            录制
          </span>
        </button>

        {/* 4. 回放 (Playback Toggle Button) */}
        <button
          onClick={handleTogglePlayback}
          className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-2xs ${
              showPlayback
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-[#f0f2f5] group-hover:bg-[#e4e7ec] text-slate-700'
            }`}
          >
            <PlayCircle className="w-5 h-5 stroke-[2]" />
          </div>
          <span className={`text-[12px] font-medium ${showPlayback ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
            回放
          </span>
        </button>
      </div>

      {/* 3. Bottom Dynamic Card: If showPlayback is TRUE -> Render Image 1 UI. Otherwise -> Render Image 2/3 (基本信息 / 云台控制) */}
      <div className="mx-3 mt-3 mb-4 bg-white rounded-2xl shadow-2xs border border-slate-100/80 flex-1 flex flex-col overflow-hidden min-h-[420px]">
        {showPlayback ? (
          /* =========================================================================
             PLAYBACK MODE: EXACT REPRODUCTION OF IMAGE 1 (编组 1 / image.png)
             ========================================================================= */
          <div className="flex-1 flex flex-col bg-white">
            {/* Top Date Selector Row (11/30, 12/01, 12/02, 12/03 + Clock Icon) */}
            <div className="px-4 pt-3.5 pb-2 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-2">
                {playbackDates.map((dateStr) => {
                  const isSelected = selectedPlaybackDate === dateStr;
                  return (
                    <div key={dateStr} className="relative flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedPlaybackDate(dateStr);
                          showToast(`已切换至 ${dateStr} 日期回放`);
                        }}
                        className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#c49c50] text-white shadow-2xs'
                            : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-400'
                        }`}
                      >
                        {dateStr}
                      </button>

                      {/* Small Blue Arrow Indicator Pointer below the selected date */}
                      {isSelected && (
                        <div className="w-0 h-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-blue-500 absolute -bottom-2 z-20" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Clock Icon */}
              <button
                onClick={() => showToast('选择回放时间段')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
                title="选择时间"
              >
                <div className="w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                  <div className="w-[1.5px] h-1.5 bg-slate-800 absolute top-1 left-[7.5px]" />
                  <div className="w-1.5 h-[1.5px] bg-slate-800 absolute top-[7.5px] left-[7.5px]" />
                </div>
              </button>
            </div>

            {/* Continuous Video Timeline Scrubbing Ruler (Sky blue / Orange Segments + Ruler ticks) */}
            <div
              ref={rulerRef}
              onMouseDown={(e) => {
                isDraggingRuler.current = true;
                handleRulerScrub(e.clientX);
              }}
              onMouseMove={(e) => isDraggingRuler.current && handleRulerScrub(e.clientX)}
              onMouseUp={() => (isDraggingRuler.current = false)}
              onMouseLeave={() => (isDraggingRuler.current = false)}
              onTouchStart={(e) => {
                isDraggingRuler.current = true;
                handleRulerScrub(e.touches[0].clientX);
              }}
              onTouchMove={(e) => isDraggingRuler.current && handleRulerScrub(e.touches[0].clientX)}
              onTouchEnd={() => (isDraggingRuler.current = false)}
              className="relative w-full h-16 bg-[#eef4fe]/70 border-b border-slate-100 select-none cursor-pointer overflow-hidden flex-shrink-0"
            >
              {/* Colored Recording Blocks Header (Upper Half) */}
              <div className="w-full h-8 flex relative overflow-hidden">
                {/* 1. Left normal continuous recording block (Sky blue) */}
                <div className="h-full bg-[#9ec5fe]/90 w-[35%]" />

                {/* 2. Motion / Event recorded block (Warm Orange) */}
                <div className="h-full bg-[#fca566] w-[24%]" />

                {/* 3. Thin Orange Alarm Event Bar */}
                <div className="h-full w-[2%] bg-[#fca566] ml-[12%]" />

                {/* 4. Normal recording block (Light Sky blue) */}
                <div className="h-full bg-[#d0e2fe]/70 flex-1 ml-1" />
              </div>

              {/* Time Numbers & Ruler Graduations (Lower Half) */}
              <div className="w-full h-8 relative flex items-center justify-between px-4 text-[11px] font-mono text-slate-400 overflow-hidden">
                <span className="z-10 bg-[#eef4fe]/80 px-1 rounded">11:20</span>
                <span className="z-10 bg-[#eef4fe]/80 px-1 rounded">11:40</span>
                <span className="z-10 bg-[#eef4fe]/80 px-1 rounded">12:00</span>

                {/* Fine Ruler Tick Marks */}
                <div className="absolute inset-x-0 bottom-0 top-0 flex justify-between items-end px-2 pb-0.5 pointer-events-none opacity-40 overflow-hidden">
                  {Array.from({ length: 45 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[1px] bg-slate-500 ${i % 5 === 0 ? 'h-3' : 'h-1.5'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Center Playhead Needle (Blue line with triangle top) */}
              <div
                className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center transition-all duration-75"
                style={{ left: `${rulerOffset}%` }}
              >
                <div className="w-0 h-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-blue-600" />
                <div className="w-[1.5px] flex-1 bg-blue-500 shadow-sm" />
              </div>
            </div>

            {/* Scrollable Event Timeline List (Matches Image 1 exactly) */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {PLAYBACK_EVENTS.map((event, idx) => {
                const isActive = activeEventId === event.id;

                return (
                  <div
                    key={event.id}
                    onClick={() => handleSelectEvent(event)}
                    className="flex items-center justify-between group cursor-pointer active:scale-[0.99] transition-transform"
                  >
                    {/* Left: Time + Connector Timeline Dot + Icon + Title */}
                    <div className="flex items-center gap-3">
                      {/* Event Timestamp */}
                      <span
                        className={`text-[13px] font-mono w-10 flex-shrink-0 ${
                          isActive ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'
                        }`}
                      >
                        {event.time}
                      </span>

                      {/* Timeline Dot with Connecting Line */}
                      <div className="relative flex flex-col items-center justify-center">
                        {/* Connecting Line */}
                        {idx !== PLAYBACK_EVENTS.length - 1 && (
                          <div className="absolute top-3.5 w-[1.5px] h-14 bg-slate-200 pointer-events-none" />
                        )}

                        {/* Dot */}
                        <div
                          className={`rounded-full z-10 transition-all ${
                            isActive
                              ? 'w-2.5 h-2.5 bg-[#ff7a29] ring-4 ring-orange-100'
                              : 'w-2 h-2 bg-slate-300'
                          }`}
                        />
                      </div>

                      {/* Event Icon & Name */}
                      <div className="flex items-center gap-2 pl-1">
                        {event.type === 'person' && (
                          <div className={isActive ? 'text-[#ff6b00]' : 'text-slate-400'}>
                            {/* Running Person Icon representation */}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z" />
                            </svg>
                          </div>
                        )}
                        {event.type === 'motion' && (
                          <Move className={`w-4 h-4 ${isActive ? 'text-[#ff6b00]' : 'text-slate-400'}`} />
                        )}
                        {event.type === 'doorbell' && (
                          <Bell className={`w-4 h-4 ${isActive ? 'text-[#ff6b00]' : 'text-slate-400'}`} />
                        )}
                        {event.type === 'alarm' && (
                          <Siren className={`w-4 h-4 ${isActive ? 'text-[#ff6b00]' : 'text-slate-400'}`} />
                        )}

                        <span
                          className={`text-[14px] tracking-tight ${
                            isActive ? 'text-slate-900 font-bold' : 'text-slate-700 font-normal'
                          }`}
                        >
                          {event.title}
                        </span>
                      </div>
                    </div>

                    {/* Right: Snapshot Thumbnail Preview */}
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-slate-200/80 shadow-2xs flex-shrink-0 bg-slate-100">
                      <video
                        src={event.videoUrl}
                        poster={event.thumbnail}
                        aria-label={event.title}
                        autoPlay
                        loop
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />

                      {/* Active Tag Overlay: "▷ 正在预览" (Matches Image 1) */}
                      {isActive && (
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] flex items-center justify-center gap-1 text-white text-[10.5px] font-medium tracking-tight">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>正在预览</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =========================================================================
             LIVE MODE: DUAL TABS (基本信息 / 云台控制 - Image 2 & 3)
             ========================================================================= */
          <div className="p-4 flex-1 flex flex-col">
            {/* Dual Tab Segmented Control */}
            <div className="bg-[#f0f2f5] p-1 rounded-xl grid grid-cols-2 gap-1 mb-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 text-[14px] font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'info'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                基本信息
              </button>
              <button
                onClick={() => setActiveTab('ptz')}
                className={`py-2 text-[14px] font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ptz'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                云台控制
              </button>
            </div>

            {activeTab === 'info' ? (
              /* --- Tab 1: 基本信息 Content (Image 2: 编组 5.png) --- */
              <div className="flex-1 space-y-3.5 text-[14px]">
                {/* 安装位置 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">安装位置</span>
                  <span className="text-slate-800 font-medium leading-relaxed">
                    {camera.address || '广州市越秀区东风中路238号大楼西北角'}
                  </span>
                </div>

                {/* 行政区域 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">行政区域</span>
                  <span className="text-slate-800 font-medium">
                    {camera.city || '广州市'}{camera.district || '越秀区'}
                  </span>
                </div>

                {/* 监控编码 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">监控编码</span>
                  <span className="text-slate-800 font-mono text-[13px]">
                    {camera.code || '44010400001320000001'}
                  </span>
                </div>

                {/* 所属节点 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">所属节点</span>
                  <span className="text-slate-800 font-medium">
                    {camera.node || '广东省广州市越秀区'}
                  </span>
                </div>

                {/* 监控类型 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">监控类型</span>
                  <span className="text-slate-800 font-medium">
                    {camera.type || '枪机'}
                  </span>
                </div>

                {/* 设备质量 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">设备质量</span>
                  <span className="text-slate-800 font-medium">
                    最近质量：{camera.qualityRecent || '高清流畅'}&nbsp;&nbsp;持续质量：{camera.qualityDuration || '稳定'}
                  </span>
                </div>

                {/* 经纬度 */}
                <div className="flex items-start">
                  <span className="text-slate-400 w-24 flex-shrink-0">经纬度</span>
                  <span className="text-slate-800 font-mono text-[13px]">
                    经度：{camera.lng || 113.2681}&nbsp;&nbsp;&nbsp;&nbsp;纬度：{camera.lat || 23.1328}
                  </span>
                </div>
              </div>
            ) : (
              /* --- Tab 2: 云台控制 Content (Image 3: 编组 6.png) --- */
              <div className="flex-1 flex flex-col justify-between items-center py-1">
                {/* Center Area: PTZ Rocker Disc Dial + Left/Right Zoom Buttons */}
                <div className="w-full flex items-center justify-between px-2 my-2 relative">
                  {/* Left Zoom In Button (+) */}
                  <button
                    onClick={() => handleZoom('in')}
                    className="w-12 h-12 rounded-full bg-[#f0f2f5] hover:bg-[#e4e7ec] flex items-center justify-center text-slate-700 active:scale-95 shadow-2xs transition-all flex-shrink-0 cursor-pointer"
                    title="放大画面"
                  >
                    <Plus className="w-6 h-6 stroke-[2.2]" />
                  </button>

                  {/* Center PTZ Joystick Rocker Disc (Exact match to Image 3) */}
                  <div
                    ref={joystickDialRef}
                    onMouseDown={(e) => handleJoystickStart(e.clientX, e.clientY)}
                    onMouseMove={(e) => isDraggingJoystick.current && updateJoystickPosition(e.clientX, e.clientY)}
                    onMouseUp={handleJoystickEnd}
                    onMouseLeave={handleJoystickEnd}
                    onTouchStart={(e) => handleJoystickStart(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchMove={(e) => isDraggingJoystick.current && updateJoystickPosition(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchEnd={handleJoystickEnd}
                    className="w-56 h-56 rounded-full bg-[#e8eef5]/80 border border-slate-200/80 shadow-inner relative flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden"
                  >
                    {/* Dynamic Direction Indicator Arc on perimeter */}
                    {activeDirectionAngle !== null && (
                      <div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 transition-transform duration-75 pointer-events-none"
                        style={{ transform: `rotate(${activeDirectionAngle}deg)` }}
                      />
                    )}

                    {/* 1. North / Up Direction Triangle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzMove('上', 0, -10, 0);
                      }}
                      className="absolute top-2.5 left-1/2 -translate-x-1/2 p-2 text-slate-400 hover:text-blue-600 active:scale-90 transition-transform cursor-pointer"
                      title="向上"
                    >
                      <div className="w-0 h-0 border-x-[7px] border-x-transparent border-b-[11px] border-b-slate-400 hover:border-b-blue-600" />
                    </button>

                    {/* 2. North-East / Up-Right marker */}
                    <div className="absolute top-6 right-6 w-0 h-0 border-x-[5px] border-x-transparent border-b-[8px] border-b-slate-300 rotate-45 pointer-events-none" />

                    {/* 3. East / Right Direction Triangle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzMove('右', 10, 0, 90);
                      }}
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 active:scale-90 transition-transform cursor-pointer"
                      title="向右"
                    >
                      <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[11px] border-l-slate-400 hover:border-l-blue-600" />
                    </button>

                    {/* 4. South-East / Down-Right marker */}
                    <div className="absolute bottom-6 right-6 w-0 h-0 border-x-[5px] border-x-transparent border-t-[8px] border-t-slate-300 rotate-[-45deg] pointer-events-none" />

                    {/* 5. South / Down Direction Triangle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzMove('下', 0, 10, 180);
                      }}
                      className="absolute bottom-2.5 left-1/2 -translate-x-1/2 p-2 text-slate-400 hover:text-blue-600 active:scale-90 transition-transform cursor-pointer"
                      title="向下"
                    >
                      <div className="w-0 h-0 border-x-[7px] border-x-transparent border-t-[11px] border-t-slate-400 hover:border-t-blue-600" />
                    </button>

                    {/* 6. South-West / Down-Left marker */}
                    <div className="absolute bottom-6 left-6 w-0 h-0 border-x-[5px] border-x-transparent border-t-[8px] border-t-slate-300 rotate-45 pointer-events-none" />

                    {/* 7. West / Left Direction Triangle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePtzMove('左', -10, 0, 270);
                      }}
                      className="absolute top-1/2 left-2.5 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 active:scale-90 transition-transform cursor-pointer"
                      title="向左"
                    >
                      <div className="w-0 h-0 border-y-[7px] border-y-transparent border-r-[11px] border-r-slate-400 hover:border-r-blue-600" />
                    </button>

                    {/* 8. North-West / Up-Left marker */}
                    <div className="absolute top-6 left-6 w-0 h-0 border-x-[5px] border-x-transparent border-b-[8px] border-b-slate-300 rotate-[-45deg] pointer-events-none" />

                    {/* Center Joystick Knob with Red Core Dot (Image 3) */}
                    <div
                      className="w-14 h-14 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center transition-transform duration-75 z-20 pointer-events-none"
                      style={{
                        transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`
                      }}
                    >
                      {/* Vibrant Red Inner Core Dot */}
                      <div className="w-7 h-7 rounded-full bg-[#ff2d55] shadow-xs flex items-center justify-center ring-2 ring-red-100" />
                    </div>
                  </div>

                  {/* Right Zoom Out Button (-) */}
                  <button
                    onClick={() => handleZoom('out')}
                    className="w-12 h-12 rounded-full bg-[#f0f2f5] hover:bg-[#e4e7ec] flex items-center justify-center text-slate-700 active:scale-95 shadow-2xs transition-all flex-shrink-0 cursor-pointer"
                    title="缩小画面"
                  >
                    <Minus className="w-6 h-6 stroke-[2.2]" />
                  </button>
                </div>

                {/* Bottom Movement Speed Slider ("移动速度") (Image 3) */}
                <div className="w-full pt-2 space-y-1 px-1">
                  <div className="flex items-center justify-between text-[13px] text-slate-700">
                    <span className="font-medium text-slate-600">移动速度</span>
                    <span className="font-mono font-semibold text-slate-700">{speed}</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                      className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#007aff] transition-all"
                      style={{
                        background: `linear-gradient(to right, #007aff 0%, #007aff ${speed}%, #e2e8f0 ${speed}%, #e2e8f0 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
