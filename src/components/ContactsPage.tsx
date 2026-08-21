import React, { useState } from 'react';
import { Plus, Users, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import { ContactItem } from '../types';
import { SearchBar } from './SearchBar';
import { Avatar } from './Avatar';
import { HeaderPlusMenu } from './HeaderPlusMenu';
import { StatusBar } from './StatusBar';

interface ContactsPageProps {
  contacts: ContactItem[];
  onContactAction?: (contact: ContactItem, action: 'chat' | 'call') => void;
  onSelectContact?: (contact: ContactItem) => void;
  onOpenMyGroups?: () => void;
  onOpenEnterpriseDirectory?: (deptId?: string) => void;
  onOpenSearch?: () => void;
  onCreateGroup?: () => void;
  onScanQr?: () => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({
  contacts,
  onContactAction,
  onSelectContact,
  onOpenMyGroups,
  onOpenEnterpriseDirectory,
  onOpenSearch,
  onCreateGroup,
  onScanQr
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const communicationHeaderStyle: React.CSSProperties = {
    backgroundImage: `url('${import.meta.env.BASE_URL}communication-bg.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat'
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-hidden relative">
      <div className="px-2 pb-3 relative z-20 shrink-0" style={communicationHeaderStyle}>
        <div className="-mx-3 mb-1">
          <StatusBar />
        </div>

        {/* Top Header */}
        <div className="px-2 pb-3 flex items-center justify-between">
          <div className="w-8"></div> {/* Spacer */}
          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight leading-[22px]">通讯录</h1>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="system-plus-button"
              title="更多选项"
            >
              <Plus />
            </button>

            {/* Plus Menu Popover */}
            <HeaderPlusMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onScan={() => {
                setIsMenuOpen(false);
                onScanQr?.();
              }}
              onCreateGroup={() => {
                setIsMenuOpen(false);
                onCreateGroup?.();
              }}
            />
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            if (onOpenSearch) onOpenSearch();
          }}
          onClick={onOpenSearch}
          placeholder="搜索"
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
      {/* Top Navigation Groups Card */}
      <div className="px-2 mb-4">
        <div className="app-card p-3 space-y-3">
          {/* 我的群组 */}
          <div
            onClick={onOpenMyGroups}
            className="flex items-center justify-between py-1 px-1 cursor-pointer hover:bg-slate-50 active:scale-[0.99] rounded-[12px] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-xs">
                <Users className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[15px] font-semibold text-slate-900 leading-[20px]">我的群组</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>

          <div className="h-px bg-slate-100 my-1"></div>

          {/* 企业通讯录 */}
          <div className="space-y-2">
            <div
              onClick={() => onOpenEnterpriseDirectory?.()}
              className="flex items-start justify-between py-1 px-1 cursor-pointer hover:bg-slate-50 active:scale-[0.99] rounded-[12px] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-xs">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M15 8h2" />
                    <path d="M15 12h2" />
                    <path d="M7 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-slate-900 leading-[20px]">企业通讯录</div>
                  <div className="text-[12px] text-slate-500 mt-0.5 leading-[16px]">广东省广新控股集团有限公司</div>
                </div>
              </div>
            </div>

            {/* Sub tree line item: 广新集团 */}
            <div
              onClick={() => onOpenEnterpriseDirectory?.()}
              className="flex items-center justify-between pl-8 pr-1 py-1.5 hover:bg-slate-50 active:bg-slate-100/80 rounded-[12px] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-300 stroke-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 3v10a2 2 0 0 0 2 2h10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[15px] font-medium text-slate-800">广新集团</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Heading: 最近联系人 */}
      <div className="px-2 mb-2">
        <span className="text-[13px] text-slate-500 font-normal leading-[18px]">最近联系人</span>
      </div>

      {/* Contacts List Card */}
      <div className="px-2 flex-1">
        <div className="app-card p-2.5">
          {filteredContacts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-[15px]">
              未找到相关联系人
            </div>
          ) : (
            <div className="divide-y divide-slate-100/70">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between py-3 px-2 hover:bg-slate-50/80 rounded-[12px] transition-colors group"
                >
                  <div
                    onClick={() => onSelectContact?.(contact)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none active:opacity-75 transition-opacity"
                    title={`查看 ${contact.name} 的个人信息`}
                  >
                    {/* CIRCULAR Avatar */}
                    <Avatar src={contact.avatar} name={contact.name} size="sm" />
                    <span className="text-[15px] font-semibold text-slate-900 truncate leading-[20px]">
                      {contact.name}
                    </span>
                  </div>

                  {/* Action Buttons: Message + Call (Blue Outline) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onContactAction?.(contact, 'chat')}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 active:scale-95 transition-all"
                      title={`发消息给 ${contact.name}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 fill-none stroke-current stroke-[2]"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="9" cy="10" r="1" fill="currentColor" />
                        <circle cx="15" cy="10" r="1" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onContactAction?.(contact, 'call')}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 active:scale-95 transition-all"
                      title={`拨打电话给 ${contact.name}`}
                    >
                      <Phone className="w-5 h-5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
