import React from 'react';
import { ChevronLeft, ChevronRight, Phone, MessageSquare } from 'lucide-react';
import { ContactItem } from '../types';
import { Avatar } from './Avatar';

interface ContactProfilePageProps {
  contact: ContactItem;
  onBack: () => void;
  onAction?: (action: 'chat' | 'call') => void;
  onShowToast?: (msg: string) => void;
}

export const ContactProfilePage: React.FC<ContactProfilePageProps> = ({
  contact,
  onBack,
  onAction,
  onShowToast
}) => {
  // Derived details with realistic fallback values if not present
  const phone = contact.phone || '14938770337';
  const email = contact.email || `${contact.name ? 'contact' : 'user'}@engihkek.bi`;
  const department = contact.department || '研发部';
  const role = contact.role || '工程师';
  const gender = contact.gender || '女';
  const birthday = contact.birthday || '1990-04-21';
  const nativePlace = contact.nativePlace || '广东 广州';
  const motto = contact.motto || '快乐和烦恼都是自己给的';

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] select-none relative animate-fade-in">
      {/* Top Header with Back button */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between bg-white z-10 sticky top-0">
        <button
          onClick={onBack}
          className="system-back-button"
          title="返回"
        >
          <ChevronLeft />
        </button>
        <div className="w-10"></div> {/* Balanced Spacer */}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* User Profile Header Card */}
        <div className="bg-white px-5 pt-2 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Large Avatar */}
            <div className="relative">
              <Avatar
                src={contact.avatar}
                name={contact.name}
                size="lg"
                className="w-16 h-16 rounded-full border-2 border-white shadow-xs object-cover"
              />
            </div>

            {/* Name & Motto */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[20px] font-bold text-slate-900 leading-tight truncate">
                {contact.name}
              </h2>
              <p className="text-[13px] text-slate-400 mt-1.5 leading-snug truncate">
                {motto}
              </p>
            </div>
          </div>
        </div>

        {/* Separator block space */}
        <div className="h-3 bg-[#f4f5f8]"></div>

        {/* User Detailed Attributes Table */}
        <div className="bg-white divide-y divide-slate-100">
          {/* 手机 */}
          <div
            onClick={() => onShowToast?.(`已复制手机号: ${phone}`)}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              手机
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1 tracking-wide">
              {phone}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
          </div>

          {/* 邮箱 */}
          <div
            onClick={() => onShowToast?.(`已复制邮箱: ${email}`)}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              邮箱
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1 truncate">
              {email}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
          </div>

          {/* 部门 */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              部门
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1">
              {department}
            </span>
          </div>

          {/* 职务 */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              职务
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1">
              {role}
            </span>
          </div>

          {/* 性别 */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              性别
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1">
              {gender}
            </span>
          </div>

          {/* 生日 */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              生日
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1">
              {birthday}
            </span>
          </div>

          {/* 籍贯 */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[15px] text-slate-400 font-normal w-20 flex-shrink-0">
              籍贯
            </span>
            <span className="text-[15px] text-slate-800 font-normal flex-1">
              {nativePlace}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Bar: 2 Circular Blue Action Buttons (语音通话, 发消息) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 pt-3 pb-6 flex items-center justify-around z-20 max-w-sm mx-auto">
        {/* 语音通话 */}
        <button
          onClick={() => {
            if (onAction) onAction('call');
          }}
          className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <Phone className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[12px] font-medium text-[#2563eb]">
            语音通话
          </span>
        </button>

        {/* 发消息 */}
        <button
          onClick={() => {
            if (onAction) onAction('chat');
          }}
          className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <MessageSquare className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[12px] font-medium text-[#2563eb]">
            发消息
          </span>
        </button>
      </div>
    </div>
  );
};
