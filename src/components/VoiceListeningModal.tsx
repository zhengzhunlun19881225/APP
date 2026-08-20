import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, AlertCircle } from 'lucide-react';

interface VoiceListeningModalProps {
  isOpen: boolean;
  agentName?: string;
  onClose: () => void;
  onSend: (recognizedText: string) => void;
}

export const VoiceListeningModal: React.FC<VoiceListeningModalProps> = ({
  isOpen,
  agentName = '云一朵',
  onClose,
  onSend
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [voiceVolume, setVoiceVolume] = useState<number[]>([
    0.3, 0.4, 0.5, 0.7, 0.9, 1.2, 1.6, 2.2, 3.0, 2.2, 1.6, 1.2, 0.9, 0.7, 0.5, 0.4, 0.3
  ]);
  const [transcript, setTranscript] = useState('');
  const [listeningSeconds, setListeningSeconds] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  // Default sample voice queries
  const sampleVoiceQueries = [
    '分析一下本季度集团经营数据与财务预算执行情况',
    '请帮我查询差旅报销标准与审批流转规定',
    '起草一份推进企业数字化转型项目立项提案',
    '对比分析今年 Q1 与 Q2 华东大区的销售业绩',
    '查询集团法务合同审查与合规管理细则'
  ];

  // Dynamic sound wave simulation
  useEffect(() => {
    if (!isOpen) {
      setListeningSeconds(0);
      setIsCancelling(false);
      setTranscript('');
      return;
    }

    const timer = setInterval(() => {
      setListeningSeconds((prev) => prev + 1);
    }, 1000);

    let phase = 0;
    const animateWave = () => {
      phase += 0.12;
      const newVols = Array.from({ length: 17 }).map((_, i) => {
        const distFromCenter = Math.abs(i - 8);
        const centerFactor = Math.max(0.2, 1 - distFromCenter * 0.1);
        const wave = Math.sin(phase + i * 0.45) * 0.6 + Math.cos(phase * 1.3 - i * 0.3) * 0.4;
        const heightMultiplier = Math.max(0.2, (wave + 1) * centerFactor * 1.5);
        return heightMultiplier;
      });
      setVoiceVolume(newVols);
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    animationFrameRef.current = requestAnimationFrame(animateWave);

    return () => {
      clearInterval(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen]);

  const handleFinishAndSend = () => {
    if (isCancelling) {
      onClose();
      return;
    }
    const finalQuery =
      transcript.trim() ||
      sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)];
    onSend(finalQuery);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsCancelling(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const deltaY = startY - e.touches[0].clientY;
      // If swiped up more than 50px, mark as cancel
      if (deltaY > 50) {
        setIsCancelling(true);
      } else {
        setIsCancelling(false);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isCancelling) {
      onClose();
    } else {
      handleFinishAndSend();
    }
    setStartY(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col justify-between select-none overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Cancel Action */}
        <div className="pt-5 px-6 flex items-center justify-between z-20">
          <div className="w-8" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 text-slate-500 text-[12px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>实时录音中 {listeningSeconds}s</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-95 transition-all"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Prompt & Wave Section (Matches Image 3) */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10 space-y-6">
          {/* Main Title */}
          <div className="text-center space-y-2">
            <h2 className="text-[26px] font-extrabold text-[#1e293b] tracking-tight">
              正在听，请说话
            </h2>
            <p
              className={`text-[15px] font-medium transition-colors ${
                isCancelling ? 'text-rose-500 font-bold' : 'text-[#64748b]'
              }`}
            >
              {isCancelling ? '松开手指，取消发送' : '松手发送 上滑取消'}
            </p>
          </div>

          {/* Audio Waveform Equalizer Dots (Exact representation of Image 3) */}
          <div className="flex items-center justify-center gap-2.5 h-12 px-4 py-2">
            {voiceVolume.map((vol, idx) => {
              const distFromCenter = Math.abs(idx - 8);
              // Center dots are darker purple, outer dots are lighter pastel lavender
              const isCenter = distFromCenter === 0;
              const opacity = Math.max(0.25, 1 - distFromCenter * 0.08);
              const height = Math.min(24, Math.max(5, vol * 9));

              return (
                <motion.span
                  key={idx}
                  className={`rounded-full transition-all duration-75 ${
                    isCenter
                      ? 'w-2 bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                      : distFromCenter <= 3
                      ? 'w-1.5 bg-[#818cf8]'
                      : 'w-1.5 bg-[#c7d2fe]'
                  }`}
                  style={{
                    height: `${height}px`,
                    opacity: opacity
                  }}
                  animate={{
                    scaleY: isCancelling ? 0.3 : [1, 1.2, 0.9, 1],
                    opacity: isCancelling ? 0.3 : opacity
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + (idx % 3) * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Lavender Dome Arch with Purple Mic (Exact representation of Image 3) */}
        <div className="relative w-full flex flex-col items-center justify-end pb-8">
          {/* Curved Light Purple Arch Background */}
          <div className="w-[120%] h-44 -mb-8 rounded-t-[100%] bg-gradient-to-t from-[#ede9fe] via-[#f5f3ff]/70 to-[#faf5ff]/20 border-t border-purple-200/50 shadow-[0_-10px_30px_rgba(139,92,246,0.06)] flex items-center justify-center pointer-events-none relative overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute bottom-0 w-48 h-32 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Center Purple Microphone Button */}
          <div className="absolute top-10 flex flex-col items-center gap-2 z-10">
            <button
              onClick={handleFinishAndSend}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                isCancelling
                  ? 'bg-rose-500 text-white shadow-rose-200'
                  : 'bg-gradient-to-tr from-[#7c3aed] to-[#8b5cf6] text-white shadow-purple-200 hover:shadow-purple-300'
              }`}
              title={isCancelling ? '取消' : '松手发送'}
            >
              {isCancelling ? (
                <AlertCircle className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8 animate-pulse" />
              )}
            </button>
            <span className="text-[12px] text-slate-400 font-medium tracking-tight">
              点击直接发送
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
