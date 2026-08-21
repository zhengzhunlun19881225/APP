import React from 'react';
import { TabType } from '../types';
import { LayoutGrid, MapPin, MessageSquare, Contact } from 'lucide-react';
import { AiAgentAvatar } from './AiAgentAvatar';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  messagesUnreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  messagesUnreadCount = 0
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-1 py-1 flex items-center justify-around select-none">
      {/* 1. 工作 (Work / Home) */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center relative mb-0.5">
          <LayoutGrid className="w-5 h-5 stroke-[2]" />
        </div>
        <span className="text-[10px] font-medium leading-[12px]">工作</span>
      </button>

      {/* 2. 地图 (Map) */}
      <button
        onClick={() => onTabChange('map')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'map' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center mb-0.5">
          <MapPin className={`w-5 h-5 stroke-[2] ${activeTab === 'map' ? 'fill-blue-600/20' : ''}`} />
        </div>
        <span className="text-[10px] font-medium leading-[12px]">地图</span>
      </button>

      {/* 3. 智小星 (AI Assistant / JingXiaobei Hub) */}
      <button
        onClick={() => onTabChange('ai')}
        aria-label="智小星"
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer group ${
          activeTab === 'ai' ? 'text-purple-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center mb-0.5 relative">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
              activeTab === 'ai' ? 'ring-2 ring-purple-400 ring-offset-1 shadow-xs' : ''
            }`}
          >
            <AiAgentAvatar type="qa" className="w-5 h-5 drop-shadow-xs" />
          </div>
        </div>
        <span aria-hidden="true" className="h-[12px]" />
      </button>

      {/* 4. 消息 (Messages) */}
      <button
        onClick={() => onTabChange('messages')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer relative ${
          activeTab === 'messages' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center relative mb-0.5">
          <MessageSquare className="w-5 h-5 stroke-[2]" />
          {messagesUnreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight shadow-xs">
              {messagesUnreadCount > 99 ? '99+' : messagesUnreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium leading-[12px]">消息</span>
      </button>

      {/* 5. 通讯录 (Contacts) */}
      <button
        onClick={() => onTabChange('contacts')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors cursor-pointer ${
          activeTab === 'contacts' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="w-6 h-6 flex items-center justify-center mb-0.5">
          <Contact className="w-5 h-5 stroke-[2]" />
        </div>
        <span className="text-[10px] font-medium leading-[12px]">通讯录</span>
      </button>
    </div>
  );
};
