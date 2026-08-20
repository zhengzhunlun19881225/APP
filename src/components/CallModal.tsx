import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  RefreshCw,
  Video,
  VideoOff,
  Users,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Avatar } from './Avatar';

export type CallType = 'audio' | 'video' | 'meeting';
export type CallRole = 'outgoing' | 'incoming';
export type CallStatus = 'calling' | 'ringing' | 'connected' | 'ended';

export interface CallSession {
  id: string;
  type: CallType;
  role: CallRole;
  status: CallStatus;
  targetName: string;
  targetAvatar: string;
  meetingTitle?: string;
  meetingTime?: string;
  startTime?: number;
  durationSeconds?: number;
}

interface CallModalProps {
  session: CallSession;
  onClose: (durationSeconds: number, endReason: 'hangup' | 'rejected' | 'cancelled' | 'normal') => void;
  onUpdateSession?: (newSession: Partial<CallSession>) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  session: initialSession,
  onClose,
  onUpdateSession
}) => {
  const [session, setSession] = useState<CallSession>(initialSession);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [isPipSwapped, setIsPipSwapped] = useState(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync prop updates
  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  // Handle call timer when connected
  useEffect(() => {
    if (session.status === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session.status]);

  // Simulate remote pickup after 3.5 seconds if outgoing
  useEffect(() => {
    if (session.status === 'calling') {
      const autoAnswerTimer = setTimeout(() => {
        setSession((prev) => ({
          ...prev,
          status: 'connected',
          startTime: Date.now()
        }));
      }, 3500);

      return () => clearTimeout(autoAnswerTimer);
    }
  }, [session.status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Actions
  const handleAccept = () => {
    setSession((prev) => ({
      ...prev,
      status: 'connected',
      startTime: Date.now()
    }));
  };

  const handleReject = () => {
    onClose(0, 'rejected');
  };

  const handleHangup = () => {
    const finalDuration = callDuration;
    const endReason = session.status === 'calling' ? 'cancelled' : 'normal';
    onClose(finalDuration, endReason);
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  // Office background matching design screenshots
  const videoBgUrl =
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  const pipBgUrl =
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

  // -------------------------------------------------------------
  // FLOATING MINIMIZED WIDGET
  // -------------------------------------------------------------
  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed top-14 right-3 z-60 cursor-pointer select-none animate-in zoom-in-95 duration-200"
      >
        <div className="bg-[#1e222a]/95 backdrop-blur-md text-white border border-white/20 rounded-2xl p-2.5 shadow-2xl flex items-center gap-3 hover:bg-[#282d38] transition-all group">
          <div className="relative">
            <Avatar
              src={session.targetAvatar}
              name={session.targetName}
              size="sm"
            />
            {session.status === 'connected' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1e222a] animate-pulse" />
            )}
          </div>

          <div className="pr-1 text-left">
            <div className="text-[12px] font-bold text-white leading-tight">
              {session.type === 'meeting'
                ? session.meetingTitle || '部门会议'
                : session.targetName}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              {session.status === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{formatDuration(callDuration)}</span>
                </>
              ) : session.status === 'calling' ? (
                <span className="text-slate-300">正在呼叫...</span>
              ) : (
                <span className="text-emerald-300">邀请通话中...</span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(false);
            }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULLSCREEN CALL OVERLAY
  // -------------------------------------------------------------
  const isVideoMode = session.type === 'video';
  const isMeetingMode = session.type === 'meeting';

  return (
    <div className="absolute inset-0 z-50 bg-[#2a2c35] text-white flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-200">
      {/* Background for Video Calls */}
      {isVideoMode && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={isPipSwapped ? pipBgUrl : videoBgUrl}
            alt="Video Feed"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark gradient overlay for top & bottom contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
      )}

      {/* 1. TOP HEADER / STATUS BAR */}
      <div className="relative z-10 pt-10 px-5 flex items-center justify-between">
        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
          title="最小化通话"
        >
          <Minimize2 className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Call Status / Timer */}
        <div className="text-center">
          {session.status === 'connected' ? (
            <div className="text-[18px] font-mono font-medium tracking-wider text-white">
              {formatDuration(callDuration || 156)}
            </div>
          ) : session.status === 'calling' ? (
            <div className="text-[16px] text-white/90 font-normal">
              正在等待对方接听...
            </div>
          ) : session.type === 'meeting' ? (
            <div className="text-[14px] text-white/80">会议邀请</div>
          ) : (
            <div className="text-[16px] text-white/90 font-normal">
              邀请你{isVideoMode ? '视频' : '语音'}通话...
            </div>
          )}
        </div>

        {/* Top Right: Flip Camera (Video Calls only) or placeholder */}
        <div className="w-10 flex justify-end">
          {isVideoMode && (
            <button
              onClick={toggleCameraFacing}
              className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
              title="翻转摄像头"
            >
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
        </div>
      </div>

      {/* Picture-in-Picture (PIP) for Connected Video Calls */}
      {isVideoMode && session.status === 'connected' && (
        <div
          onClick={() => setIsPipSwapped(!isPipSwapped)}
          className="absolute top-24 right-4 z-20 w-28 h-40 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl cursor-pointer active:scale-95 transition-transform group"
          title="点击切换主副画面"
        >
          <img
            src={isPipSwapped ? videoBgUrl : pipBgUrl}
            alt="Self Camera"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
      )}

      {/* 2. CENTER CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* When video is connected, we hide central avatar to show fullscreen camera */}
        {!(isVideoMode && session.status === 'connected') && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Avatar with pulse ring */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                <img
                  src={session.targetAvatar}
                  alt={session.targetName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {session.status === 'calling' && (
                <div className="absolute inset-0 rounded-full border border-white/40 animate-ping pointer-events-none opacity-60" />
              )}
            </div>

            {/* User or Meeting Title Info */}
            {isMeetingMode ? (
              <div className="mt-4 text-center">
                <div className="text-[14px] text-slate-300">
                  {session.targetName}邀请你加入
                </div>
                <div className="text-[22px] font-bold text-white mt-1.5">
                  {session.meetingTitle || '部门周例会'}
                </div>
                <div className="text-[14px] text-slate-400 mt-2">
                  开会时间：{session.meetingTime || '7/12 14:00'}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-[22px] font-bold text-white tracking-wide drop-shadow-sm">
                {session.targetName}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. BOTTOM CONTROLS ROW */}
      <div className="relative z-10 pb-12 pt-6 px-8">
        {session.status === 'ringing' ? (
          /* Incoming Call Buttons: 拒绝 (Red) + 接听 (Green) */
          <div className="flex items-center justify-around max-w-[280px] mx-auto">
            {/* 拒绝 */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleReject}
                className="w-18 h-18 rounded-full bg-[#ea4335] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-[#d93025] cursor-pointer"
              >
                <PhoneOff className="w-8 h-8 stroke-[2.2]" />
              </button>
              <span className="text-[14px] text-white/90 font-medium">拒绝</span>
            </div>

            {/* 接听 */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleAccept}
                className="w-18 h-18 rounded-full bg-[#22c55e] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-[#16a34a] cursor-pointer"
              >
                <Phone className="w-8 h-8 stroke-[2.2]" />
              </button>
              <span className="text-[14px] text-white/90 font-medium">接听</span>
            </div>
          </div>
        ) : (
          /* Calling or Connected Actions: 静音 + 挂断 + 免提 */
          <div className="flex items-center justify-between max-w-[320px] mx-auto">
            {/* 静音 Toggle */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md cursor-pointer ${
                  isMuted
                    ? 'bg-white text-slate-900'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-7 h-7 stroke-[2.2]" />
                ) : (
                  <Mic className="w-7 h-7 stroke-[2.2]" />
                )}
              </button>
              <span className="text-[13px] text-white/90 font-medium">
                {isMuted ? '解除静音' : '静音'}
              </span>
            </div>

            {/* 挂断 (Red Button) */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleHangup}
                className="w-18 h-18 rounded-full bg-[#ea4335] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-[#d93025] cursor-pointer"
              >
                <PhoneOff className="w-8 h-8 stroke-[2.2]" />
              </button>
              <span className="text-[13px] text-white/90 font-medium">挂断</span>
            </div>

            {/* 免提 Toggle */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md cursor-pointer ${
                  isSpeakerOn
                    ? 'bg-white text-slate-900'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
                }`}
              >
                {isSpeakerOn ? (
                  <Volume2 className="w-7 h-7 stroke-[2.2]" />
                ) : (
                  <VolumeX className="w-7 h-7 stroke-[2.2]" />
                )}
              </button>
              <span className="text-[13px] text-white/90 font-medium">免提</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
