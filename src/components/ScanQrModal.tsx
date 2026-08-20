import React, { useState, useEffect } from 'react';
import { ChevronLeft, Flashlight, Image as ImageIcon, QrCode, ScanLine, X } from 'lucide-react';

interface ScanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult?: (result: string) => void;
}

export const ScanQrModal: React.FC<ScanQrModalProps> = ({
  isOpen,
  onClose,
  onScanResult
}) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setScanStatus('scanning');
      setFlashlightOn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanStatus('success');
    setTimeout(() => {
      onScanResult?.('https://work.tencent.com/group/join/mock123');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none animate-fade-in">
      {/* Top Header */}
      <div className="pt-8 px-4 pb-4 flex items-center justify-between text-white z-20">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
        <h2 className="text-[17px] font-medium tracking-wide">扫一扫</h2>
        <div className="w-10"></div>
      </div>

      {/* Center Scan Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8">
        {/* Viewfinder frame */}
        <div
          onClick={handleSimulateScan}
          className="relative w-64 h-64 border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer group"
          title="点击模拟扫描二维码"
        >
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-blue-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-blue-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-blue-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-blue-500 rounded-br-lg"></div>

          {/* Animated Scanning Laser Line */}
          <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#3b82f6] animate-bounce duration-1000 top-2"></div>

          {/* Grid background illusion */}
          <div className="w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {scanStatus === 'success' && (
            <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-xs flex items-center justify-center text-white font-medium text-sm">
              识别成功...
            </div>
          )}
        </div>

        <p className="text-white/70 text-[13px] mt-6 tracking-wide">
          将二维码放入框内，即可自动扫描
        </p>

        {/* Flashlight toggle */}
        <button
          onClick={() => setFlashlightOn(!flashlightOn)}
          className={`mt-6 flex flex-col items-center gap-1 text-xs transition-colors ${
            flashlightOn ? 'text-blue-400' : 'text-white/60 hover:text-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${flashlightOn ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
            <Flashlight className="w-5 h-5" />
          </div>
          <span>{flashlightOn ? '关闭手电筒' : '轻触点亮'}</span>
        </button>
      </div>

      {/* Bottom Bar: Album / My QR code */}
      <div className="pb-10 pt-4 px-12 flex items-center justify-around text-white/80 z-20">
        <button
          onClick={handleSimulateScan}
          className="flex flex-col items-center gap-1.5 active:scale-95 transition-all hover:text-white"
        >
          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-xs">相册</span>
        </button>

        <button
          onClick={() => {
            alert('我的二维码名片');
          }}
          className="flex flex-col items-center gap-1.5 active:scale-95 transition-all hover:text-white"
        >
          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-xs">我的二维码</span>
        </button>
      </div>
    </div>
  );
};
