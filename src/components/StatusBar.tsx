import React from 'react';
import { Wifi, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="flex h-[54px] items-start justify-between px-6 pt-[17px] text-slate-900 select-none text-xs font-semibold tracking-tight">
      {/* Time */}
      <span className="text-[14px] font-bold">19:41</span>

      {/* Right icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-4 h-4 fill-current text-slate-900 stroke-[3]" />
        <Wifi className="w-4 h-4 text-slate-900 stroke-[3]" />
        {/* Battery SVG pill */}
        <div className="w-[22px] h-3 border-2 border-slate-900 rounded-[3px] p-[2px] flex items-center relative ml-0.5">
          <div className="bg-slate-900 h-full w-[80%] rounded-[1px]"></div>
          <div className="absolute -right-[5px] top-[3px] bottom-[3px] w-[3px] bg-slate-900 rounded-r-[2px]"></div>
        </div>
      </div>
    </div>
  );
};
