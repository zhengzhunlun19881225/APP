import React from 'react';
import { Wifi, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 text-slate-900 select-none text-xs font-semibold tracking-tight">
      {/* Time */}
      <span className="text-[14px] font-bold">19:41</span>

      {/* Right icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 fill-current text-slate-900" />
        <Wifi className="w-3.5 h-3.5 text-slate-900" />
        {/* Battery SVG pill */}
        <div className="w-5 h-2.5 border border-slate-900 rounded-xs p-0.5 flex items-center relative ml-0.5">
          <div className="bg-slate-900 h-full w-[80%] rounded-[1px]"></div>
          <div className="absolute -right-1 top-0.5 bottom-0.5 w-0.5 bg-slate-900 rounded-r-xs"></div>
        </div>
      </div>
    </div>
  );
};
