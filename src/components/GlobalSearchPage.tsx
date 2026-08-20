import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import { ContactItem, MessageItem } from '../types';
import { Avatar } from './Avatar';

export type SearchTabType = 'all' | 'contacts' | 'groups' | 'chat_records';

interface GlobalSearchPageProps {
  initialQuery?: string;
  initialTab?: SearchTabType;
  contacts: ContactItem[];
  messages: MessageItem[];
  onClose: () => void;
  onSelectContact: (contact: ContactItem) => void;
  onSelectChat: (chat: MessageItem) => void;
}

// Group information interface for search
export interface SearchGroupItem {
  id: string;
  name: string;
  gridAvatars: string[];
  members: { name: string; department?: string; role?: string }[];
}

export const defaultSearchGroups: SearchGroupItem[] = [
  {
    id: 'g_yw',
    name: '业务沟通群(9)',
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'
    ],
    members: [
      { name: '李梅梅', department: '业务发展部', role: '产品经理' },
      { name: '李彬浩', department: '应急指挥研发部-平台开发部', role: '开发工程师' },
      { name: '李玉', department: '应急指挥研发部-平台开发部', role: '开发工程师' },
      { name: '李树洁', department: '应急指挥研发部-平台开发部', role: '开发工程师' },
      { name: '谷菲婷', department: '应急指挥中心', role: '指挥官' },
      { name: '褚霞哲', department: '应急保障部', role: '执行专员' },
      { name: '蒙浩', department: '一线执行部', role: '执行专员' },
      { name: '石梁雅', department: '数字化创新中心', role: '交互设计师' },
      { name: '我', department: '指挥中心', role: '管理员' }
    ]
  },
  {
    id: 'g_kh',
    name: '客户沟通群',
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80'
    ],
    members: [
      { name: '常琼艳', department: '后勤保障部' },
      { name: '汪红和', department: '架构部' },
      { name: '沈真', department: 'UI架构部' },
      { name: '李梅梅', department: '业务部' }
    ]
  },
  {
    id: 'g_aq',
    name: '安全保障综合群',
    gridAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
    ],
    members: [
      { name: '刘福', department: '综合保障部' },
      { name: '王勇', department: '安保部' },
      { name: '李敏', department: '开发部' },
      { name: '李树人', department: '开发部' }
    ]
  }
];

// Mock chat history records database for accurate search count & snippets
interface MockChatHistoryRecord {
  chatId: string;
  chatName: string;
  avatar: string;
  avatarType?: 'image' | 'custom' | 'grid';
  gridAvatars?: string[];
  isGroup?: boolean;
  messages: {
    id: string;
    senderName: string;
    text: string;
    time: string;
  }[];
}

const mockHistoryRecords: MockChatHistoryRecord[] = [
  {
    chatId: 'm_group_yw',
    chatName: '业务沟通群(9)',
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'
    ],
    isGroup: true,
    messages: [
      { id: 'h1', senderName: '李梅梅', text: '大家好，今天下午两点我们进行新一轮方案评审', time: '09:00' },
      { id: 'h2', senderName: '李树洁', text: '好的，开发端模块已经准备就绪', time: '09:12' },
      { id: 'h3', senderName: '李玉', text: '好，我也准时参加', time: '09:15' },
      { id: 'h4', senderName: '褚霞哲', text: '好方案，支持上线', time: '09:18' },
      { id: 'h5', senderName: '谷菲婷', text: '非常好，指挥中心已做好协同准备', time: '09:20' },
      { id: 'h6', senderName: '李彬浩', text: '但无论是哪种类型用户，都一定会有相同的核心交互诉求。', time: '09:21' }
    ]
  },
  {
    chatId: 'c_peisha',
    chatName: '裴莎',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    isGroup: false,
    messages: [
      { id: 'hp1', senderName: '裴莎', text: '收到，好方案已经同步给指挥部', time: '10:15' },
      { id: 'hp2', senderName: '裴莎', text: '好，那就按这个计划执行', time: '10:18' },
      { id: 'hp3', senderName: '裴莎', text: '好的！', time: '10:20' }
    ]
  },
  {
    chatId: 'c_wanghonghe',
    chatName: '汪红和',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    isGroup: false,
    messages: [
      { id: 'hw1', senderName: '汪红和', text: '好的，下午两点准时参加会议讨论', time: '11:05' },
      { id: 'hw2', senderName: '汪红和', text: '好，服务器配置已经更新完毕', time: '11:10' },
      { id: 'hw3', senderName: '汪红和', text: '好的明白', time: '11:12' },
      { id: 'hw4', senderName: '汪红和', text: '好的收到', time: '11:15' },
      { id: 'hw5', senderName: '汪红和', text: '好设计，视觉非常清晰', time: '11:20' },
      { id: 'hw6', senderName: '汪红和', text: '好的，随时沟通', time: '11:25' }
    ]
  },
  {
    chatId: 'm1',
    chatName: '沈真',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    avatarType: 'custom',
    isGroup: false,
    messages: [
      { id: 'hs1', senderName: '沈真', text: '好设计是不过时的', time: '昨天17:00' },
      { id: 'hs2', senderName: '沈真', text: '好设计是不唐突的', time: '昨天17:05' }
    ]
  },
  {
    chatId: 'c1',
    chatName: '谷菲婷',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    isGroup: false,
    messages: [
      { id: 'hg1', senderName: '谷菲婷', text: '下午5点开会，请大家做好准备', time: '09:10' }
    ]
  },
  {
    chatId: 'm7',
    chatName: '常琼艳',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    isGroup: false,
    messages: [
      { id: 'hc1', senderName: '常琼艳', text: '好的，资料已发送到您的邮箱', time: '26/02/12' }
    ]
  }
];

export const GlobalSearchPage: React.FC<GlobalSearchPageProps> = ({
  initialQuery = '',
  initialTab = 'all',
  contacts,
  messages,
  onClose,
  onSelectContact,
  onSelectChat
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTabType>(initialTab);

  // Helper to highlight matching text
  const renderHighlighted = (text: string, keyword: string) => {
    if (!keyword.trim() || !text) return text;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-blue-600 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // 1. Search Contacts
  const matchedContacts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.department && c.department.toLowerCase().includes(q)) ||
        (c.role && c.role.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
    );
  }, [contacts, query]);

  // 2. Search Groups (Group Name or Member Name)
  interface MatchedGroupResult {
    group: SearchGroupItem;
    matchedMemberName?: string;
    matchType: 'group_name' | 'member_name';
  }

  const matchedGroups = useMemo<MatchedGroupResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results: MatchedGroupResult[] = [];

    defaultSearchGroups.forEach((group) => {
      // Check if member name matches
      const matchedMembers = group.members.filter((m) => m.name.toLowerCase().includes(q));
      if (matchedMembers.length > 0) {
        matchedMembers.forEach((member) => {
          results.push({
            group,
            matchedMemberName: member.name,
            matchType: 'member_name'
          });
        });
      } else if (group.name.toLowerCase().includes(q)) {
        // Group name matches
        results.push({
          group,
          matchType: 'group_name'
        });
      }
    });

    return results;
  }, [query]);

  // 3. Search Chat History Records
  interface MatchedChatHistoryResult {
    chatId: string;
    chatName: string;
    avatar: string;
    avatarType?: 'image' | 'custom' | 'grid';
    gridAvatars?: string[];
    isGroup?: boolean;
    matchedCount: number;
    sampleText: string;
  }

  const matchedChatRecords = useMemo<MatchedChatHistoryResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results: MatchedChatHistoryResult[] = [];

    mockHistoryRecords.forEach((record) => {
      const matchingMsgs = record.messages.filter(
        (m) => m.text.toLowerCase().includes(q) || m.senderName.toLowerCase().includes(q)
      );

      if (matchingMsgs.length > 0) {
        results.push({
          chatId: record.chatId,
          chatName: record.chatName,
          avatar: record.avatar,
          avatarType: record.avatarType,
          gridAvatars: record.gridAvatars,
          isGroup: record.isGroup,
          matchedCount: matchingMsgs.length,
          sampleText: matchingMsgs[0].text
        });
      } else if (record.chatName.toLowerCase().includes(q)) {
        results.push({
          chatId: record.chatId,
          chatName: record.chatName,
          avatar: record.avatar,
          avatarType: record.avatarType,
          gridAvatars: record.gridAvatars,
          isGroup: record.isGroup,
          matchedCount: 1,
          sampleText: record.messages[0]?.text || ''
        });
      }
    });

    return results;
  }, [query]);

  const hasAnyResults =
    matchedContacts.length > 0 || matchedGroups.length > 0 || matchedChatRecords.length > 0;

  // Handle click on group
  const handleOpenGroupChat = (group: SearchGroupItem) => {
    const existing = messages.find((m) => m.name === group.name);
    if (existing) {
      onSelectChat(existing);
    } else {
      const newGroupChat: MessageItem = {
        id: `chat_${group.id}`,
        name: group.name,
        avatar: '',
        avatarType: 'grid',
        gridAvatars: group.gridAvatars,
        lastMessage: '暂无新消息',
        time: '刚刚',
        isGroup: true
      };
      onSelectChat(newGroupChat);
    }
  };

  // Handle click on chat record
  const handleOpenHistoryChat = (record: MatchedChatHistoryResult) => {
    const existing = messages.find((m) => m.name === record.chatName);
    if (existing) {
      onSelectChat(existing);
    } else {
      const newChat: MessageItem = {
        id: record.chatId,
        name: record.chatName,
        avatar: record.avatar,
        avatarType: record.avatarType,
        gridAvatars: record.gridAvatars,
        lastMessage: record.sampleText,
        time: '刚刚',
        isGroup: record.isGroup
      };
      onSelectChat(newChat);
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Search Header Bar */}
      <div className="pt-2 px-4 pb-2 bg-white flex items-center gap-2.5 border-b border-slate-100/80">
        <div className="flex-1 flex items-center bg-[#f1f3f5] rounded-full px-3.5 py-1.5 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索"
            className="w-full text-[14px] text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="w-4 h-4 rounded-full bg-slate-400/80 text-white flex items-center justify-center hover:bg-slate-500 transition-colors ml-1"
            >
              <X className="w-2.5 h-2.5 stroke-[3]" />
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-[15px] font-medium text-blue-600 hover:text-blue-700 px-1 py-1 transition-colors cursor-pointer"
        >
          取消
        </button>
      </div>

      {/* Tabs Row: 综合 / 联系人 / 群组 / 聊天记录 */}
      <div className="flex items-center justify-around bg-white border-b border-slate-100 px-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-3 text-[14px] font-medium transition-all relative cursor-pointer ${
            activeTab === 'all'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          综合
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`py-2.5 px-3 text-[14px] font-medium transition-all relative cursor-pointer ${
            activeTab === 'contacts'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          联系人
          {activeTab === 'contacts' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`py-2.5 px-3 text-[14px] font-medium transition-all relative cursor-pointer ${
            activeTab === 'groups'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          群组
          {activeTab === 'groups' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('chat_records')}
          className={`py-2.5 px-3 text-[14px] font-medium transition-all relative cursor-pointer ${
            activeTab === 'chat_records'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          聊天记录
          {activeTab === 'chat_records' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        {!query.trim() ? (
          /* Empty initial search state */
          <div className="p-6 text-center text-slate-400 text-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p>输入关键词搜索联系人、群组或聊天记录</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setQuery('李')}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs text-slate-600 transition-colors"
              >
                李
              </button>
              <button
                onClick={() => setQuery('好')}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs text-slate-600 transition-colors"
              >
                好
              </button>
              <button
                onClick={() => setQuery('业务沟通')}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs text-slate-600 transition-colors"
              >
                业务沟通
              </button>
              <button
                onClick={() => setQuery('开发')}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs text-slate-600 transition-colors"
              >
                开发工程师
              </button>
            </div>
          </div>
        ) : !hasAnyResults ? (
          /* No results state */
          <div className="py-16 text-center text-slate-400 text-sm">
            <p>未找到包含 “{query}” 的相关结果</p>
          </div>
        ) : (
          <div className="pb-8">
            {/* ======================= 1. 综合 TAB ======================= */}
            {activeTab === 'all' && (
              <div>
                {/* 1.1 联系人 Section */}
                {matchedContacts.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[13px] text-slate-500 font-normal">
                      联系人
                    </div>
                    <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                      {matchedContacts.slice(0, 3).map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => onSelectContact(contact)}
                          className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Avatar
                            src={contact.avatar}
                            name={contact.name}
                            avatarType="image"
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-medium text-slate-900 truncate">
                              {renderHighlighted(contact.name, query)}
                            </div>
                            <div className="text-[12px] text-slate-400 truncate mt-0.5">
                              {renderHighlighted(
                                `${contact.role || '工程师'} (${contact.department || '应急指挥研发部-平台开发部'})`,
                                query
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 查看更多联系人按钮 */}
                    {matchedContacts.length > 0 && (
                      <button
                        onClick={() => setActiveTab('contacts')}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-blue-600 hover:bg-blue-50/60 active:bg-blue-100/60 transition-colors cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-blue-600" />
                        <span>查看更多联系人</span>
                      </button>
                    )}

                    {/* Section Spacer */}
                    <div className="h-2.5 bg-[#f4f5f8] border-y border-slate-100/80" />
                  </div>
                )}

                {/* 1.2 群组 Section */}
                {matchedGroups.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[13px] text-slate-500 font-normal">
                      群组
                    </div>
                    <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                      {matchedGroups.slice(0, 3).map((item, idx) => (
                        <div
                          key={`${item.group.id}_${idx}`}
                          onClick={() => handleOpenGroupChat(item.group)}
                          className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Avatar
                            name={item.group.name}
                            avatarType="grid"
                            gridAvatars={item.group.gridAvatars}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-medium text-slate-900 truncate">
                              {renderHighlighted(item.group.name, query)}
                            </div>
                            <div className="text-[12px] text-slate-500 truncate mt-0.5">
                              包含：{renderHighlighted(item.matchedMemberName || '', query)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 查看更多群组按钮 */}
                    {matchedGroups.length > 0 && (
                      <button
                        onClick={() => setActiveTab('groups')}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-blue-600 hover:bg-blue-50/60 active:bg-blue-100/60 transition-colors cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-blue-600" />
                        <span>查看更多群组</span>
                      </button>
                    )}

                    {/* Section Spacer */}
                    <div className="h-2.5 bg-[#f4f5f8] border-y border-slate-100/80" />
                  </div>
                )}

                {/* 1.3 聊天记录 Section */}
                {matchedChatRecords.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[13px] text-slate-500 font-normal">
                      聊天记录
                    </div>
                    <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                      {matchedChatRecords.slice(0, 3).map((record) => (
                        <div
                          key={record.chatId}
                          onClick={() => handleOpenHistoryChat(record)}
                          className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Avatar
                            src={record.avatar}
                            name={record.chatName}
                            avatarType={record.avatarType}
                            gridAvatars={record.gridAvatars}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[15px] font-medium text-slate-900 truncate">
                              {renderHighlighted(record.chatName, query)}
                            </div>
                            <div className="text-[12px] text-slate-400 truncate mt-0.5">
                              {record.matchedCount}条相关聊天记录
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 查看更多聊天记录按钮 */}
                    {matchedChatRecords.length > 3 && (
                      <button
                        onClick={() => setActiveTab('chat_records')}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-blue-600 hover:bg-blue-50/60 active:bg-blue-100/60 transition-colors cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-blue-600" />
                        <span>查看更多聊天记录</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ======================= 2. 联系人 TAB ======================= */}
            {activeTab === 'contacts' && (
              <div>
                <div className="px-4 py-2 text-[13px] text-slate-500 font-normal">
                  联系人
                </div>
                {matchedContacts.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    未找到相关联系人
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {matchedContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => onSelectContact(contact)}
                        className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Avatar
                          src={contact.avatar}
                          name={contact.name}
                          avatarType="image"
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-medium text-slate-900 truncate">
                            {renderHighlighted(contact.name, query)}
                          </div>
                          <div className="text-[12px] text-slate-400 truncate mt-0.5">
                            {renderHighlighted(
                              `${contact.role || '工程师'} (${contact.department || '应急指挥研发部-平台开发部'})`,
                              query
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================= 3. 群组 TAB ======================= */}
            {activeTab === 'groups' && (
              <div>
                <div className="px-4 py-2 text-[13px] text-slate-500 font-normal">
                  群组
                </div>
                {matchedGroups.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    未找到相关群组
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {matchedGroups.map((item, idx) => (
                      <div
                        key={`${item.group.id}_${idx}`}
                        onClick={() => handleOpenGroupChat(item.group)}
                        className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Avatar
                          name={item.group.name}
                          avatarType="grid"
                          gridAvatars={item.group.gridAvatars}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-medium text-slate-900 truncate">
                            {renderHighlighted(item.group.name, query)}
                          </div>
                          <div className="text-[12px] text-slate-500 truncate mt-0.5">
                            包含：{renderHighlighted(item.matchedMemberName || '', query)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================= 4. 聊天记录 TAB ======================= */}
            {activeTab === 'chat_records' && (
              <div>
                <div className="px-4 py-2 text-[13px] text-slate-500 font-normal">
                  聊天记录
                </div>
                {matchedChatRecords.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    未找到相关聊天记录
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {matchedChatRecords.map((record) => (
                      <div
                        key={record.chatId}
                        onClick={() => handleOpenHistoryChat(record)}
                        className="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Avatar
                          src={record.avatar}
                          name={record.chatName}
                          avatarType={record.avatarType}
                          gridAvatars={record.gridAvatars}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-medium text-slate-900 truncate">
                            {renderHighlighted(record.chatName, query)}
                          </div>
                          <div className="text-[12px] text-slate-400 truncate mt-0.5">
                            {record.matchedCount}条相关聊天记录
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
