import React from 'react';
import { X, MessageSquare, Clock, ArrowLeft, ShieldCheck, CheckCheck } from 'lucide-react';
import { Avatar } from './Avatar';

export interface RecentChatTarget {
  name: string;
  avatar?: string;
  avatarType?: 'image' | 'grid' | 'custom';
  gridAvatars?: string[];
  isGroup?: boolean;
  role?: string;
  department?: string;
  memberCount?: number;
}

export interface RecentChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  time: string;
  isSelf: boolean;
  content: string;
  type?: 'text' | 'image' | 'file';
  fileName?: string;
  fileSize?: string;
}

interface RecentChatPreviewModalProps {
  isOpen: boolean;
  target: RecentChatTarget | null;
  onClose: () => void;
}

// Generate realistic and rich chat history dynamically for any person or group
export const getMockRecentChatHistory = (target: RecentChatTarget): { timeGroup: string; messages: RecentChatMessage[] }[] => {
  const isGroup = target.isGroup || (target.name.includes('群') || target.name.includes('组') || target.name.includes('队') || (target.gridAvatars && target.gridAvatars.length > 0));

  if (isGroup) {
    return [
      {
        timeGroup: '昨天 16:20',
        messages: [
          {
            id: 'g_1',
            senderName: '陈志远',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            time: '16:20',
            isSelf: false,
            content: `大家好，关于「${target.name}」的最新工作安排已整理完毕，请各位查收确认。`
          },
          {
            id: 'g_2',
            senderName: '林舒涵',
            senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
            time: '16:22',
            isSelf: false,
            content: '收到，方案整体很清晰，我们组已在推进中。'
          },
          {
            id: 'g_3',
            senderName: '我',
            senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
            time: '16:25',
            isSelf: true,
            content: '相关模块的技术方案也同步更新了，大家随时沟通。'
          }
        ]
      },
      {
        timeGroup: '今天 09:40',
        messages: [
          {
            id: 'g_4',
            senderName: '张经理',
            senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
            time: '09:40',
            isSelf: false,
            content: '上午的协调会纪要已上传至群文件，有疑问可在群内随时讨论。'
          },
          {
            id: 'g_5',
            senderName: '我',
            senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
            time: '09:45',
            isSelf: true,
            content: '收到！'
          }
        ]
      }
    ];
  }

  // 1-on-1 Person Chat history
  return [
    {
      timeGroup: '昨天 14:15',
      messages: [
        {
          id: 'p_1',
          senderName: target.name,
          senderAvatar: target.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          time: '14:15',
          isSelf: false,
          content: '少即是多'
        },
        {
          id: 'p_2',
          senderName: '我',
          senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
          time: '14:18',
          isSelf: true,
          content: '收到，正在针对交互做减法优化。'
        },
        {
          id: 'p_3',
          senderName: target.name,
          senderAvatar: target.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          time: '14:28',
          isSelf: false,
          content: '塑造本来就在石头里，我只是把不要的部分去掉'
        }
      ]
    },
    {
      timeGroup: '今天 10:30',
      messages: [
        {
          id: 'p_4',
          senderName: target.name,
          senderAvatar: target.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          time: '10:30',
          isSelf: false,
          content: '今天下午的技术评审会议，记得准时参加。'
        },
        {
          id: 'p_5',
          senderName: '我',
          senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
          time: '10:32',
          isSelf: true,
          content: '好的，资料已经全部备齐。'
        }
      ]
    }
  ];
};

export const RecentChatPreviewModal: React.FC<RecentChatPreviewModalProps> = ({
  isOpen,
  target,
  onClose
}) => {
  if (!isOpen || !target) return null;

  const chatGroups = getMockRecentChatHistory(target);
  const isGroup = target.isGroup || (target.name.includes('群') || target.name.includes('组') || target.name.includes('队') || (target.gridAvatars && target.gridAvatars.length > 0));

  return (
    <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 select-none">
      <div
        className="bg-[#f2f3f5] rounded-2xl w-full max-w-[360px] h-[520px] max-h-[88vh] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部 Header: 标题栏与联系人信息 */}
        <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              src={target.avatar}
              name={target.name}
              avatarType={target.avatarType}
              gridAvatars={target.gridAvatars}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-slate-900 truncate">
                  {target.name}
                </span>
                {isGroup && (
                  <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded border border-blue-100 shrink-0">
                    群聊
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 truncate">
                {target.department || (isGroup ? '群聊消息记录' : '最近私聊消息')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* 提示条 */}
        <div className="bg-[#e8ebf0]/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200/50">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            最近聊天记录预览
          </span>
          <span className="text-slate-400">仅供查阅</span>
        </div>

        {/* 消息滚动区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              {/* 时间标签 */}
              <div className="flex justify-center">
                <span className="text-[11px] text-slate-500 bg-[#e1e4ea] px-2.5 py-0.5 rounded-full font-medium">
                  {group.timeGroup}
                </span>
              </div>

              {/* 消息气泡列表 */}
              {group.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${
                    msg.isSelf ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* 头像 */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 shadow-2xs border border-white">
                    <img
                      src={
                        msg.senderAvatar ||
                        (msg.isSelf
                          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
                          : target.avatar ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80')
                      }
                      alt={msg.senderName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 消息内容与姓名 */}
                  <div
                    className={`flex flex-col max-w-[75%] ${
                      msg.isSelf ? 'items-end' : 'items-start'
                    }`}
                  >
                    {!msg.isSelf && isGroup && (
                      <span className="text-[11px] text-slate-400 mb-1 ml-0.5">
                        {msg.senderName}
                      </span>
                    )}

                    <div
                      className={`px-3.5 py-2 rounded-2xl text-[14px] leading-relaxed shadow-2xs break-words ${
                        msg.isSelf
                          ? 'bg-[#0070f3] text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/60'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 底部关闭与返回按钮 */}
        <div className="p-3 bg-white border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-[12px] text-slate-400 pl-1">
            共 {chatGroups.reduce((acc, g) => acc + g.messages.length, 0)} 条最近消息
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white text-[13px] font-medium rounded-lg transition-all shadow-xs cursor-pointer"
          >
            返回转发
          </button>
        </div>
      </div>
    </div>
  );
};
