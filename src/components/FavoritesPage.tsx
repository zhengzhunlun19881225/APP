import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  Bookmark,
  Share2,
  FileText,
  FileSpreadsheet,
  Link2,
  MessageSquare,
  Image as ImageIcon,
  MoreHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SendConfirmDialog, SendConfirmItemData, SendConfirmContentType } from './SendConfirmDialog';

export interface FavoriteItem {
  id: string;
  type: SendConfirmContentType;
  title: string;
  subtitle?: string;
  source: string;
  time: string;
  data: SendConfirmItemData;
}

const mockFavorites: FavoriteItem[] = [
  {
    id: 'fav_img_1',
    type: 'image',
    title: '会议室实景照片',
    source: '来自聊天：常琼艳',
    time: '2026/02/12',
    data: {
      type: 'image',
      imageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'fav_file_1',
    type: 'file',
    title: '应急救援物资明细表.xlsx',
    subtitle: '4.2 MB · 电子表格',
    source: '来自聊天：业务沟通群(9)',
    time: '2026/02/11',
    data: {
      type: 'file',
      fileName: '应急救援物资明细表.xlsx',
      fileSize: '4.2 MB',
      fileExt: 'xlsx'
    }
  },
  {
    id: 'fav_text_1',
    type: 'text',
    title: '我想用艺术感动人们的内心。我希望他们这样说到：他的感受深刻而温...',
    subtitle: '名言摘录 · 文艺笔记',
    source: '来自笔记收藏',
    time: '2026/02/10',
    data: {
      type: 'text',
      textContent:
        '我想用艺术感动人们的内心。我希望他们这样说到：他的感受深刻而温...'
    }
  },
  {
    id: 'fav_chat_1',
    type: 'chat_record',
    title: '崔文敏与常琼艳的聊天记录',
    subtitle: '包含5条会话记录',
    source: '合并转发聊天记录',
    time: '2026/02/09',
    data: {
      type: 'chat_record',
      recordTitle: '崔文敏与常琼艳的聊天记录',
      recordSenders: '崔文敏、常琼艳'
    }
  },
  {
    id: 'fav_link_1',
    type: 'link',
    title: '暴雨橙色预警持续生效，全市进入暴雨防御状态！',
    subtitle: '广东省应急管理厅发布 · 应急科普与防汛指引',
    source: '来自应急资讯共享',
    time: '2026/02/08',
    data: {
      type: 'link',
      linkTitle: '暴雨橙色预警持续生效，全市进入暴雨防御状态！',
      linkUrl: 'https://yjgl.gd.gov.cn/news/warning/202602'
    }
  }
];

interface FavoritesPageProps {
  onBack: () => void;
  onSendToChat?: (item: FavoriteItem, comment: string, targetName: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onBack,
  onSendToChat
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'file' | 'text' | 'chat_record' | 'link'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSendItem, setActiveSendItem] = useState<FavoriteItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const filteredItems = mockFavorites.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleConfirmSend = (comment: string, targetName: string) => {
    if (activeSendItem) {
      if (onSendToChat) {
        onSendToChat(activeSendItem, comment, targetName);
      }
      showToast(`已发送给 ${targetName}`);
      setActiveSendItem(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none">
      {/* Top Header Navigation */}
      <div className="bg-white px-2 py-3.5 flex items-center justify-between border-b border-slate-100/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900">我的收藏</h1>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[12px] text-slate-400">共 {mockFavorites.length} 条</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-2 py-2.5 bg-white border-b border-slate-100">
        <div className="app-search-shell !bg-[#f8fafc] !border-slate-200/70 !backdrop-blur-none">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索收藏内容"
            className="app-search-input"
          />
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center bg-white px-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: '全部' },
          { id: 'image', label: '图片' },
          { id: 'file', label: '文件' },
          { id: 'text', label: '文本' },
          { id: 'chat_record', label: '聊天记录' },
          { id: 'link', label: '链接' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-3 text-[13px] font-medium whitespace-nowrap relative transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2.5px] bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Favorite Items List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveSendItem(item)}
            className="app-card p-4 hover:border-blue-200 transition-all cursor-pointer group active:scale-[0.99]"
          >
            {/* Top Info */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5">
              <span>{item.source}</span>
              <span>{item.time}</span>
            </div>

            {/* Content Display based on Type */}
            {item.type === 'image' && (
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-150 shadow-2xs flex-shrink-0">
                  <img
                    src={item.data.imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-slate-400 mt-1">点击查看或转发给好友</p>
                </div>
              </div>
            )}

            {item.type === 'file' && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#107c41] flex items-center justify-center text-white font-bold text-sm shadow-2xs flex-shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            )}

            {item.type === 'text' && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-slate-700 leading-snug line-clamp-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">{item.subtitle}</p>
                </div>
              </div>
            )}

            {item.type === 'chat_record' && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    <span className="text-blue-600 mr-1">[聊天记录]</span>
                    <span>{item.data.recordTitle}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            )}

            {item.type === 'link' && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-2xs flex-shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <span className="text-blue-600 mr-1">[链接]</span>
                    <span>{item.data.linkTitle}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-0.5 truncate">{item.subtitle}</p>
                </div>
              </div>
            )}

            {/* Bottom Card Action Prompt */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12px] text-blue-600 font-medium">
              <span className="text-slate-400 text-[11px]">点击弹出标准转发窗口</span>
              <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <Share2 className="w-3.5 h-3.5" />
                <span>转发发送</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Send Confirmation Dialog Modal Matching Design */}
      {activeSendItem && (
        <SendConfirmDialog
          isOpen={!!activeSendItem}
          targetUser={{
            name: '孔眉鹏',
            avatar:
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
            avatarType: 'image'
          }}
          itemData={activeSendItem.data}
          onClose={() => setActiveSendItem(null)}
          onSend={handleConfirmSend}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-60 bg-slate-900/90 backdrop-blur-xs text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-in fade-in zoom-in-95 duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
