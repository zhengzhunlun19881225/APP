import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MessageItem } from '../types';
import { SearchBar } from './SearchBar';
import { Avatar } from './Avatar';
import { HeaderPlusMenu } from './HeaderPlusMenu';
import { StatusBar } from './StatusBar';

interface MessagesPageProps {
  messages: MessageItem[];
  onSelectMessage?: (item: MessageItem) => void;
  onOpenSearch?: () => void;
  onCreateGroup?: () => void;
  onScanQr?: () => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  messages,
  onSelectMessage,
  onOpenSearch,
  onCreateGroup,
  onScanQr
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredMessages = messages.filter((msg) =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-6 relative">
      <div className="app-plan-query-bg px-3 pb-3 relative z-10">
        <div className="-mx-3 mb-1">
          <StatusBar />
        </div>

        {/* Top Header */}
        <div className="pb-3 flex items-center justify-between">
          <div className="w-8"></div> {/* Spacer for symmetry */}
          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight leading-[22px]">消息</h1>
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

      {/* Main Message List Card */}
      <div className="px-3 flex-1">
        <div className="bg-white rounded-[12px] p-2.5 shadow-2xs border border-slate-100/80">
          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-[15px]">
              未找到相关消息
            </div>
          ) : (
            <div className="divide-y divide-slate-100/70">
              {filteredMessages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectMessage?.(item)}
                  className="flex items-center gap-3 py-3 px-2 rounded-[12px] hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors cursor-pointer group"
                >
                  {/* CIRCULAR Avatar */}
                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    avatarType={item.avatarType}
                    gridAvatars={item.gridAvatars}
                    unreadCount={item.unreadCount}
                    size="sm"
                  />

                  {/* Message Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold text-slate-900 truncate leading-[20px]">
                        {item.name}
                      </span>
                      <span className="text-[12px] text-slate-400 font-normal flex-shrink-0 ml-2 leading-[16px]">
                        {item.time}
                      </span>
                    </div>

                    <div className="text-[12px] text-slate-500 truncate leading-[16px]">
                      {item.highlightText ? (
                        <span>
                          <span className="text-orange-500 font-medium mr-1">
                            {item.highlightText}
                          </span>
                          {item.lastMessage.replace(item.highlightText, '')}
                        </span>
                      ) : (
                        <span>{item.lastMessage}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
