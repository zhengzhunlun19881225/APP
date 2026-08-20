import React, { useEffect, useRef } from 'react';
import { UserPlus } from 'lucide-react';

interface HeaderPlusMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: () => void;
  onCreateGroup: () => void;
}

export const HeaderPlusMenu: React.FC<HeaderPlusMenuProps> = ({
  isOpen,
  onClose,
  onScan,
  onCreateGroup
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to capture outside taps cleanly */}
      <div
        className="fixed inset-0 z-40 bg-black/5"
        onClick={onClose}
      />

      {/* Floating Popover Container matching 3.1消息.png */}
      <div
        ref={menuRef}
        className="absolute right-0 top-10 z-50 w-[142px] bg-white rounded-[16px] shadow-[0_8px_28px_rgba(0,0,0,0.14)] border border-slate-100/90 py-1.5 px-1 animate-in fade-in zoom-in-95 duration-150 origin-top-right select-none"
      >
        {/* Menu Item 1: 扫一扫 */}
        <button
          onClick={() => {
            onClose();
            onScan();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-slate-800 hover:bg-slate-50 active:bg-slate-100/80 transition-colors text-left group"
        >
          {/* Custom Scan / Frame Icon to match design */}
          <div className="w-5 h-5 flex items-center justify-center text-slate-800 group-hover:text-blue-600 transition-colors flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-[20px] h-[20px] fill-none stroke-current stroke-[2.2]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8V5a1 1 0 0 1 1-1h3" />
              <path d="M16 4h3a1 1 0 0 1 1 1v3" />
              <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
              <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
              <line x1="8" y1="12" x2="16" y2="12" strokeDasharray="1.5 2.5" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-slate-800 tracking-tight whitespace-nowrap">
            扫一扫
          </span>
        </button>

        {/* Menu Item 2: 创建群 */}
        <button
          onClick={() => {
            onClose();
            onCreateGroup();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-slate-800 hover:bg-slate-50 active:bg-slate-100/80 transition-colors text-left group"
        >
          <div className="w-5 h-5 flex items-center justify-center text-slate-800 group-hover:text-blue-600 transition-colors flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-[20px] h-[20px] fill-none stroke-current stroke-[2.2]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-slate-800 tracking-tight whitespace-nowrap">
            创建群
          </span>
        </button>
      </div>
    </>
  );
};
