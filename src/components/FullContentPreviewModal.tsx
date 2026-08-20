import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  FileSpreadsheet,
  FileText,
  Link2,
  ExternalLink,
  Download,
  Share2,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ChatMessage } from '../types';

export interface FullContentPreviewData {
  type: 'text' | 'image' | 'file' | 'chat_record' | 'link';
  title?: string;
  textContent?: string;
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  linkTitle?: string;
  linkUrl?: string;
  recordTitle?: string;
  recordMessages?: Array<{
    id: string;
    senderName: string;
    senderAvatar?: string;
    time: string;
    content: string;
  }>;
}

interface FullContentPreviewModalProps {
  isOpen: boolean;
  data: FullContentPreviewData | null;
  onClose: () => void;
}

export const FullContentPreviewModal: React.FC<FullContentPreviewModalProps> = ({
  isOpen,
  data,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHeaderTitle = () => {
    switch (data.type) {
      case 'text':
        return '正文详情';
      case 'image':
        return '图片预览';
      case 'file':
        return '文件详情';
      case 'chat_record':
        return '聊天记录详情';
      case 'link':
        return '链接详情';
      default:
        return '内容预览';
    }
  };

  return (
    <div
      className="fixed inset-0 z-80 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-full max-w-[380px] max-h-[85vh] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部 Header */}
        <div className="px-4.5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
              {getHeaderTitle()}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* 主体内容预览区 */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#fafbfe]">
          {/* 1. 文本全部内容预览 */}
          {data.type === 'text' && (
            <div className="space-y-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <p className="text-[16px] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap select-text selection:bg-blue-100">
                  {data.textContent || '暂无内容'}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px] text-slate-400">
                  <span>共 {(data.textContent || '').length} 个字符</span>
                  <button
                    onClick={() => handleCopy(data.textContent || '')}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制全文</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. 图片预览 */}
          {data.type === 'image' && (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div className="w-full max-h-[380px] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 flex items-center justify-center">
                <img
                  src={
                    data.imageUrl ||
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
                  }
                  alt="full-preview"
                  className="w-full h-auto max-h-[380px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[12px] text-slate-400">点击图片可全屏查看</span>
            </div>
          )}

          {/* 3. 文件详情预览 */}
          {data.type === 'file' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-[18px] font-bold shadow-xs">
                  S
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">
                    {data.fileName || '应急救援物资明细表.xlsx'}
                  </h3>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {data.fileSize || '2.4 MB'} · {data.fileType || 'Microsoft Excel 工作表'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[12px] text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>安全扫描完毕，文件可正常转发与下载</span>
              </div>
            </div>
          )}

          {/* 4. 聊天记录详情 */}
          {data.type === 'chat_record' && (
            <div className="space-y-3">
              <div className="bg-blue-50/70 border border-blue-100 px-3.5 py-2.5 rounded-xl text-[13px] text-blue-800 font-medium">
                {data.recordTitle || '崔文敏与常琼艳的聊天记录'}
              </div>

              <div className="space-y-3 pt-1">
                {(
                  data.recordMessages || [
                    {
                      id: 'rec_1',
                      senderName: '崔文敏',
                      time: '14:20',
                      content: '已将本次演练的预案手册发您，请查阅确认。'
                    },
                    {
                      id: 'rec_2',
                      senderName: '常琼艳',
                      time: '14:22',
                      content: '收到，物资保障部分我们正在加紧核实。'
                    },
                    {
                      id: 'rec_3',
                      senderName: '崔文敏',
                      time: '14:30',
                      content: '好的，如有增补需求随时在群内同步。'
                    }
                  ]
                ).map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[12px] text-slate-400">
                      <span className="font-semibold text-slate-700">{m.senderName}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-[14px] text-slate-800 leading-relaxed">{m.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. 链接详情 */}
          {data.type === 'link' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
                    {data.linkTitle || '暴雨橙色预警持续生效，全市进入暴雨防御状态！'}
                  </h3>
                  <p className="text-[12px] text-slate-400 truncate mt-1">
                    {data.linkUrl || 'https://news.gov.cn/weather/emergency/20260408'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleCopy(data.linkUrl || data.linkTitle || '')}
                  className="flex items-center gap-1.5 text-[13px] text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制链接</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 底部关闭按钮 */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white text-[14px] font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
