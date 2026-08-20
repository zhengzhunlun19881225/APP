import React, { useState, useEffect } from 'react';
import {
  Star,
  Scissors,
  Minimize2,
  Mic,
  Camera,
  Volume2,
  VolumeX,
  Plus,
  Minus
} from 'lucide-react';
import { SurveillanceCamera } from '../data/surveillanceData';

interface SurveillanceFullscreenModalProps {
  camera: SurveillanceCamera;
  onClose: () => void;
  onToggleFavorite?: (cameraId: string) => void;
}

const TEST_SURVEILLANCE_VIDEO = '/surveillance-test/people-detection.mp4';

export const SurveillanceFullscreenModal: React.FC<SurveillanceFullscreenModalProps> = ({
  camera,
  onClose,
  onToggleFavorite
}) => {
  const [isFavorite, setIsFavorite] = useState(camera.isFavorite || false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [flashEffect, setFlashEffect] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [scale, setScale] = useState(1);

  // Live timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${year}-${month}-${day} ${hours}:${mins}:${secs}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    if (onToggleFavorite) onToggleFavorite(camera.id);
  };

  const handleSnapshot = () => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 250);
    setSnapshotToast(`已保存全屏高清快照：${camera.name}.jpg`);
    setTimeout(() => setSnapshotToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      {/* Flash Effect */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* Main Video Stream Frame */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          src={TEST_SURVEILLANCE_VIDEO}
          poster={camera.videoPoster}
          aria-label={camera.name}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        />

        {/* Top Floating Overlay (Matches 实时监控-全屏.png) */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between text-white z-20">
          {/* Timestamp */}
          <div className="font-mono text-[14px] sm:text-[16px] font-medium tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{currentTimeStr || '2024-08-12 16:49:08'}</span>
          </div>

          {/* Action Icons (Star, Scissors, Exit Fullscreen) */}
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={handleFavorite}
              className="p-2 hover:text-amber-300 transition-colors"
              title="收藏"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
            </button>

            <button
              onClick={handleSnapshot}
              className="p-2 hover:text-sky-300 transition-colors"
              title="抓拍"
            >
              <Scissors className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:text-sky-300 transition-colors"
              title="声音"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:text-sky-300 transition-colors"
              title="退出全屏"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Floating Overlay (Camera Name) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-between text-white z-20">
          <div className="text-[16px] sm:text-[18px] font-bold drop-shadow-md">
            {camera.name}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(1, s - 0.2))}
              className="w-8 h-8 rounded-full bg-black/50 border border-white/30 flex items-center justify-center text-white active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[12px] font-mono text-white/80">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(3, s + 0.2))}
              className="w-8 h-8 rounded-full bg-black/50 border border-white/30 flex items-center justify-center text-white active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Snapshot Toast */}
        {snapshotToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-[13px] px-4 py-2 rounded-full shadow-2xl border border-white/20 z-30 flex items-center gap-2 animate-in fade-in">
            <Camera className="w-4 h-4 text-emerald-400" />
            {snapshotToast}
          </div>
        )}
      </div>
    </div>
  );
};
