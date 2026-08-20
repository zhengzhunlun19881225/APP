import React from 'react';
import {
  ChevronRight,
  Shield,
  Bell,
  HardDrive,
  FileQuestion,
  Info,
  LogOut,
  Moon,
  Smartphone,
  Bookmark,
  BookOpen,
  Users
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateToKnowledgeBase?: () => void;
  onNavigateToFavorites?: () => void;
  onNavigateToContacts?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToKnowledgeBase,
  onNavigateToFavorites,
  onNavigateToContacts
}) => {
  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-8 select-none">
      {/* User Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-md flex items-center gap-4">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-bold tracking-tight leading-[25px]">刘强</h2>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-[11px] font-semibold leading-[14px]">应急值班长</span>
          </div>
          <p className="text-[13px] text-blue-100 mt-1 leading-[18px]">广东省应急管理厅 · 应急指挥中心</p>
          <p className="text-[12px] text-blue-200 mt-0.5 leading-[16px]">工号：GD-EMC-0824</p>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onNavigateToFavorites}
          className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <Bookmark className="w-5 h-5 text-amber-500" />
          <span className="text-[13px] font-medium text-slate-700 leading-[18px]">我的收藏</span>
        </button>
        <button
          onClick={onNavigateToKnowledgeBase}
          className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-blue-500" />
          <span className="text-[13px] font-medium text-slate-700 leading-[18px]">知识文档</span>
        </button>
        <button
          onClick={onNavigateToContacts}
          className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <Users className="w-5 h-5 text-emerald-500" />
          <span className="text-[13px] font-medium text-slate-700 leading-[18px]">群组协同</span>
        </button>
      </div>

      {/* System Settings List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="text-[17px] font-normal text-slate-900 leading-[22px]">消息通知与提醒</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[13px] text-blue-600 font-medium leading-[18px]">已开启高优先级</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-600" />
            <span className="text-[17px] font-normal text-slate-900 leading-[22px]">账号安全与认证</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-slate-600" />
            <span className="text-[17px] font-normal text-slate-900 leading-[22px]">缓存清理与存储</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[13px] text-slate-400 leading-[18px]">128 MB</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-slate-600" />
            <span className="text-[17px] font-normal text-slate-900 leading-[22px]">终端设备管理</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <FileQuestion className="w-5 h-5 text-slate-600" />
            <span className="text-[17px] font-normal text-slate-900 leading-[22px]">帮助与用户反馈</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-600" />
            <span className="text-[17px] font-normal text-slate-900 leading-[22px]">关于平台</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[13px] text-slate-400 leading-[18px]">v2.4.1 Build 202608</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => alert('已退出当前账号')}
        className="w-full py-3 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 rounded-xl text-[17px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer leading-[22px]"
      >
        <LogOut className="w-4 h-4" />
        <span>退出当前账号</span>
      </button>
    </div>
  );
};
