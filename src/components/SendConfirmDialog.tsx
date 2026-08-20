import React, { useState } from 'react';
import { ChevronRight, FileSpreadsheet, FileText, Link2, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Avatar } from './Avatar';
import { ForwardTargetItem } from '../data/forwardData';
import { RecentChatPreviewModal } from './RecentChatPreviewModal';
import { FullContentPreviewModal, FullContentPreviewData } from './FullContentPreviewModal';

export type SendConfirmContentType = 'image' | 'file' | 'text' | 'chat_record' | 'link';

export interface SendConfirmItemData {
  type: SendConfirmContentType;
  // For image
  imageUrl?: string;
  // For file
  fileName?: string;
  fileSize?: string;
  fileExt?: string;
  // For text / quote / note
  textContent?: string;
  // For chat record
  recordTitle?: string;
  recordSenders?: string;
  // For link
  linkTitle?: string;
  linkUrl?: string;
}

interface SendConfirmDialogProps {
  isOpen: boolean;
  targetUser?: {
    name: string;
    avatar?: string;
    avatarType?: 'image' | 'custom' | 'grid';
    gridAvatars?: string[];
  };
  itemData: SendConfirmItemData;
  onClose: () => void;
  onSend: (comment: string, targetName: string) => void;
  onChangeTarget?: () => void;
}

const defaultTargetUser: NonNullable<SendConfirmDialogProps['targetUser']> = {
  name: '孔眉鹏',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  avatarType: 'image'
};

export const SendConfirmDialog: React.FC<SendConfirmDialogProps> = ({
  isOpen,
  targetUser = defaultTargetUser,
  itemData,
  onClose,
  onSend,
  onChangeTarget
}) => {
  const [comment, setComment] = useState('');
  const [showChatPreview, setShowChatPreview] = useState(false);
  const [fullPreviewData, setFullPreviewData] = useState<FullContentPreviewData | null>(null);

  if (!isOpen) return null;

  const handleOpenFullContent = () => {
    if (itemData.type === 'image') {
      setFullPreviewData({
        type: 'image',
        imageUrl: itemData.imageUrl
      });
      return;
    }
    if (itemData.type === 'file') {
      setFullPreviewData({
        type: 'file',
        fileName: itemData.fileName || '应急救援物资明细表.xlsx',
        fileSize: itemData.fileSize || '2.4 MB',
        fileType: itemData.fileExt || 'Microsoft Excel 工作表'
      });
      return;
    }
    if (itemData.type === 'chat_record') {
      setFullPreviewData({
        type: 'chat_record',
        recordTitle: itemData.recordTitle || '崔文敏与常琼艳的聊天记录'
      });
      return;
    }
    if (itemData.type === 'link') {
      setFullPreviewData({
        type: 'link',
        linkTitle: itemData.linkTitle || '暴雨橙色预警持续生效，全市进入暴雨防御状态！',
        linkUrl: itemData.linkUrl || 'https://news.gov.cn/weather/emergency/20260408'
      });
      return;
    }
    // text
    setFullPreviewData({
      type: 'text',
      textContent: itemData.textContent || '塑造本来就在石头里，我只是把不要的部分去掉'
    });
  };

  const handleSend = () => {
    onSend(comment, targetUser.name);
    setComment('');
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div
        className="bg-white rounded-2xl w-full max-w-[320px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: 发送给： */}
        <div className="px-4.5 pt-4 pb-2">
          <h3 className="text-[15px] font-medium text-slate-800">发送给：</h3>
        </div>

        {/* Target Receiver Row: 点击后弹框预览最近聊天，无论是人还是群组 */}
        <div
          onClick={() => setShowChatPreview(true)}
          className="px-4.5 py-2 flex items-center justify-between border-b border-slate-100/90 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors group"
          title="点击预览最近聊天"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={targetUser.avatar}
              name={targetUser.name}
              avatarType={targetUser.avatarType}
              gridAvatars={targetUser.gridAvatars}
              size="md"
            />
            <span className="text-[15px] font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {targetUser.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        {/* Dynamic Content Body according to Type: 点击预览全部内容 */}
        <div
          onClick={handleOpenFullContent}
          className="px-4.5 py-3.5 hover:bg-slate-50 active:bg-slate-100/80 cursor-pointer transition-colors group select-none rounded-xl mx-1"
          title="点击预览全部内容"
        >
          {/* 1. Image Type (图片类型) */}
          {itemData.type === 'image' && (
            <div className="flex justify-center py-1">
              <div className="relative rounded-md overflow-hidden border border-slate-200 shadow-2xs bg-slate-50 max-h-[160px] max-w-[130px] flex items-center justify-center">
                <img
                  src={
                    itemData.imageUrl ||
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
                  }
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* 2. File Type (文件类型) */}
          {itemData.type === 'file' && (
            <div className="flex items-center justify-between py-1 group">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                {/* Green Spreadsheet icon (S style or Excel) */}
                <div className="w-6 h-6 rounded bg-[#107c41] flex items-center justify-center text-white text-[12px] font-bold shadow-2xs flex-shrink-0">
                  S
                </div>
                <span className="text-[14px] text-slate-700 font-normal truncate group-hover:text-blue-600 transition-colors">
                  {itemData.fileName || '应急救援物资明细表.xlsx'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
            </div>
          )}

          {/* 3. Text / Note Type (文本/名言/笔记类型) */}
          {itemData.type === 'text' && (
            <div className="flex items-center justify-between py-1 group">
              <p className="text-[14px] text-slate-700 leading-snug line-clamp-2 pr-2 flex-1 group-hover:text-blue-600 transition-colors">
                {itemData.textContent ||
                  '我想用艺术感动人们的内心。我希望他们这样说到：他的感受深刻而温...'}
              </p>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
            </div>
          )}

          {/* 4. Chat Records Type (聊天记录类型) */}
          {itemData.type === 'chat_record' && (
            <div className="flex items-center justify-between py-1 group">
              <div className="text-[14px] text-slate-700 truncate pr-2 flex-1">
                <span className="text-blue-600 font-medium mr-1">[聊天记录]</span>
                <span className="group-hover:text-blue-600 transition-colors">{itemData.recordTitle || '崔文敏与常琼艳的聊天记录'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
            </div>
          )}

          {/* 5. Link Type (链接类型) */}
          {itemData.type === 'link' && (
            <div className="flex items-center justify-between py-1 group">
              <div className="text-[14px] text-slate-700 line-clamp-2 pr-2 leading-snug flex-1">
                <span className="text-blue-600 font-medium mr-1">[链接]</span>
                <span className="group-hover:text-blue-600 transition-colors">
                  {itemData.linkTitle ||
                    '暴雨橙色预警持续生效，全市进入暴雨防御状态！'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
            </div>
          )}
        </div>

        {/* Comment Input Box */}
        <div className="px-4.5 pb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="留言"
            className="w-full bg-[#f4f5f7] rounded-[8px] px-3 py-2 text-[14px] text-slate-800 placeholder-slate-400 outline-none border border-transparent focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>

        {/* Bottom Button Bar: 取消 | 发送 */}
        <div className="border-t border-slate-100 flex divide-x divide-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-center text-[15px] font-normal text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSend}
            className="flex-1 py-3 text-center text-[15px] font-medium text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
          >
            发送
          </button>
        </div>
      </div>

      {/* 最近聊天预览弹窗 */}
      <RecentChatPreviewModal
        isOpen={showChatPreview}
        target={targetUser}
        onClose={() => setShowChatPreview(false)}
      />

      {/* 转发全部内容详情预览弹窗 */}
      <FullContentPreviewModal
        isOpen={!!fullPreviewData}
        data={fullPreviewData}
        onClose={() => setFullPreviewData(null)}
      />
    </div>
  );
};
