import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Heart,
  Users,
  Building2,
  Send,
  XCircle,
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { ChatMessage } from '../types';
import { Avatar } from './Avatar';
import { RecentChatPreviewModal } from './RecentChatPreviewModal';
import { FullContentPreviewModal, FullContentPreviewData } from './FullContentPreviewModal';
import {
  ForwardTargetItem,
  DepartmentNode,
  GroupNode,
  mockRecentForwarded,
  mockRecentChats,
  mockRecentContacts,
  mockStandardMembers,
  mockDepartments,
  mockMyGroups,
  mockMyFollowed,
  mockSearchContacts,
  mockSearchGroups
} from '../data/forwardData';

interface ForwardModalProps {
  messagesToForward: ChatMessage[];
  isMergeForward?: boolean;
  onClose: () => void;
  onConfirmForward: (
    targetChatNames: string[],
    forwardComment: string,
    forwardedMessages: ChatMessage[],
    isMerge: boolean,
    targetObjects?: ForwardTargetItem[]
  ) => void;
}

type ViewType =
  | 'ROOT'
  | 'ADDRESS_BOOK'
  | 'DEPARTMENTS'
  | 'DEPARTMENT_DETAIL'
  | 'MY_GROUPS'
  | 'GROUP_DETAIL'
  | 'MY_FOLLOWED';

export const ForwardModal: React.FC<ForwardModalProps> = ({
  messagesToForward,
  isMergeForward = false,
  onClose,
  onConfirmForward
}) => {
  // Navigation stack
  const [viewStack, setViewStack] = useState<{ type: ViewType; payload?: any }[]>([
    { type: 'ROOT' }
  ]);

  // Current view info
  const currentView = viewStack[viewStack.length - 1];

  // Selection mode on Root view (Single vs Multi)
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  // Selected Target Items across all views
  const [selectedItems, setSelectedItems] = useState<ForwardTargetItem[]>([]);

  // Selected Manager Drawer state (添加人（已选）.png)
  const [showSelectedManager, setShowSelectedManager] = useState(false);

  // Search Mode state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreSearchContacts, setShowMoreSearchContacts] = useState(false);

  // Confirmation Dialog state
  const [confirmDialogData, setConfirmDialogData] = useState<{
    targets: ForwardTargetItem[];
    comment: string;
  } | null>(null);

  // Recent Chat Preview modal state (when user clicks receiver row in confirm dialog)
  const [previewTarget, setPreviewTarget] = useState<ForwardTargetItem | null>(null);

  // Full Content Preview modal state (when user clicks the forwarded content row)
  const [fullPreviewData, setFullPreviewData] = useState<FullContentPreviewData | null>(null);

  const handleOpenFullContentPreview = () => {
    if (isMergeForward || (messagesToForward.length === 1 && messagesToForward[0].type === 'merged_record')) {
      const title =
        messagesToForward.length === 1 && messagesToForward[0].type === 'merged_record'
          ? messagesToForward[0].content
          : `${Array.from(new Set(messagesToForward.map((m) => m.senderName))).join('与')}的聊天记录`;
      setFullPreviewData({
        type: 'chat_record',
        recordTitle: title,
        recordMessages: messagesToForward.map((m) => ({
          id: m.id,
          senderName: m.senderName,
          senderAvatar: m.senderAvatar,
          time: m.time,
          content: m.content
        }))
      });
      return;
    }

    if (messagesToForward.length === 1) {
      const msg = messagesToForward[0];
      if (msg.type === 'image') {
        setFullPreviewData({
          type: 'image',
          imageUrl: msg.content
        });
        return;
      }
      if (msg.type === 'file') {
        setFullPreviewData({
          type: 'file',
          fileName: msg.fileName || msg.content || '应急救援物资明细表.xlsx',
          fileSize: '2.4 MB',
          fileType: 'Microsoft Excel 工作表'
        });
        return;
      }
      if (msg.content.startsWith('http') || msg.content.includes('[链接]')) {
        const cleanTitle = msg.content.replace('[链接]', '').trim();
        setFullPreviewData({
          type: 'link',
          linkTitle: cleanTitle,
          linkUrl: cleanTitle.startsWith('http') ? cleanTitle : 'https://news.gov.cn/weather/emergency/20260408'
        });
        return;
      }
      // Text
      setFullPreviewData({
        type: 'text',
        textContent: msg.content
      });
      return;
    }

    // Multiple messages
    setFullPreviewData({
      type: 'chat_record',
      recordTitle: `逐条转发 (${messagesToForward.length} 条消息)`,
      recordMessages: messagesToForward.map((m) => ({
        id: m.id,
        senderName: m.senderName,
        senderAvatar: m.senderAvatar,
        time: m.time,
        content: m.content
      }))
    });
  };

  // Navigation helpers
  const pushView = (type: ViewType, payload?: any) => {
    setViewStack((prev) => [...prev, { type, payload }]);
  };

  const popView = () => {
    if (viewStack.length > 1) {
      setViewStack((prev) => prev.slice(0, -1));
    } else {
      if (isMultiSelect) {
        setIsMultiSelect(false);
        setSelectedItems([]);
      } else {
        onClose();
      }
    }
  };

  const resetToRoot = () => {
    setViewStack([{ type: 'ROOT' }]);
  };

  // Selection toggle handler
  const toggleSelectItem = (item: ForwardTargetItem) => {
    const isSelected = selectedItems.some((i) => i.id === item.id);
    if (isSelected) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const isItemSelected = (itemId: string) => {
    return selectedItems.some((i) => i.id === itemId);
  };

  // Handle click on target in Single Select mode
  const handleSingleTargetClick = (item: ForwardTargetItem) => {
    setConfirmDialogData({
      targets: [item],
      comment: ''
    });
  };

  // Handle click on Confirm button in Multi Select mode
  const handleMultiConfirmClick = () => {
    if (selectedItems.length === 0) return;
    setConfirmDialogData({
      targets: [...selectedItems],
      comment: ''
    });
  };

  // Execute Final Forward Action
  const handleSendForward = () => {
    if (!confirmDialogData || confirmDialogData.targets.length === 0) return;
    const names = confirmDialogData.targets.map((t) => t.name);
    onConfirmForward(
      names,
      confirmDialogData.comment,
      messagesToForward,
      isMergeForward || false,
      confirmDialogData.targets
    );
  };

  // Batch toggle all items in active view
  const handleToggleSelectAll = (itemsInCurrentView: ForwardTargetItem[]) => {
    const allSelected = itemsInCurrentView.every((item) =>
      selectedItems.some((s) => s.id === item.id)
    );

    if (allSelected) {
      // Unselect all items from this view
      const itemIdsToRemove = new Set(itemsInCurrentView.map((i) => i.id));
      setSelectedItems((prev) => prev.filter((i) => !itemIdsToRemove.has(i.id)));
    } else {
      // Add all missing items
      const existingIds = new Set(selectedItems.map((i) => i.id));
      const missingItems = itemsInCurrentView.filter((i) => !existingIds.has(i.id));
      setSelectedItems((prev) => [...prev, ...missingItems]);
    }
  };

  // Helper for message preview summary in confirmation popup matching 5 UI styles
  const renderMessageSummary = () => {
    if (isMergeForward || (messagesToForward.length === 1 && messagesToForward[0].type === 'merged_record')) {
      const title =
        messagesToForward.length === 1 && messagesToForward[0].type === 'merged_record'
          ? messagesToForward[0].content
          : `${Array.from(new Set(messagesToForward.map((m) => m.senderName))).join('与')}的聊天记录`;
      return (
        <div className="flex items-center justify-between py-1 group cursor-pointer">
          <div className="text-[14px] text-slate-700 truncate pr-2 flex-1">
            <span className="text-blue-600 font-medium mr-1">[聊天记录]</span>
            <span>{title}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
      );
    }

    if (messagesToForward.length === 1) {
      const msg = messagesToForward[0];
      
      // 1. Image Type
      if (msg.type === 'image') {
        return (
          <div className="flex justify-center py-1">
            <div className="relative rounded-md overflow-hidden border border-slate-200 shadow-2xs bg-slate-50 max-h-[160px] max-w-[130px] flex items-center justify-center">
              <img
                src={msg.content}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        );
      }

      // 2. File Type
      if (msg.type === 'file') {
        return (
          <div className="flex items-center justify-between py-1 group cursor-pointer">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
              <div className="w-6 h-6 rounded bg-[#107c41] flex items-center justify-center text-white text-[12px] font-bold shadow-2xs flex-shrink-0">
                S
              </div>
              <span className="text-[14px] text-slate-700 font-normal truncate">
                {msg.fileName || msg.content || '应急救援物资明细表.xlsx'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        );
      }

      // 3. Link Type or Text containing URL
      if (msg.content.startsWith('http') || msg.content.includes('[链接]')) {
        const cleanTitle = msg.content.replace('[链接]', '').trim();
        return (
          <div className="flex items-center justify-between py-1 group cursor-pointer">
            <div className="text-[14px] text-slate-700 line-clamp-2 pr-2 leading-snug flex-1">
              <span className="text-blue-600 font-medium mr-1">[链接]</span>
              <span>{cleanTitle}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        );
      }

      // 4. Text / Note Type
      return (
        <div className="flex items-center justify-between py-1 group cursor-pointer">
          <p className="text-[14px] text-slate-700 leading-snug line-clamp-2 pr-2 flex-1">
            {msg.content}
          </p>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
      );
    }

    // Multiple messages
    return (
      <div className="flex items-center justify-between py-1 group cursor-pointer">
        <div className="text-[14px] text-slate-700 truncate pr-2 flex-1">
          <span className="text-blue-600 font-medium mr-1">[逐条转发]</span>
          <span>共 {messagesToForward.length} 条消息</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>
    );
  };

  // Search Results filtering
  const searchFilteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockSearchContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const searchFilteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockSearchGroups.filter(
      (g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.matchSnippet?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  /* ------------------------------------------------------------- */
  /* RENDER SUB-VIEWS                                              */
  /* ------------------------------------------------------------- */

  // VIEW 1 & 2: ROOT VIEW (Single Select / Multi Select)
  const renderRootView = () => {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {/* Section: 最近转发 (Horizontal Avatar Scroll) */}
        <div className="pt-2 pb-3 border-b border-slate-100">
          <div className="px-4 py-1.5 text-[13px] text-slate-400 font-normal">
            最近转发
          </div>
          <div className="flex items-center gap-4 px-4 overflow-x-auto py-2 no-scrollbar">
            {mockRecentForwarded.map((item) => {
              const selected = isItemSelected(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isMultiSelect) {
                      toggleSelectItem(item);
                    } else {
                      handleSingleTargetClick(item);
                    }
                  }}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group w-[58px]"
                >
                  <div className="relative">
                    <Avatar
                      src={item.avatar}
                      name={item.name}
                      avatarType={item.avatarType}
                      gridAvatars={item.gridAvatars}
                      size="md"
                    />
                  </div>
                  <div className="text-[12px] text-slate-800 mt-1.5 text-center truncate w-full">
                    {item.name}
                  </div>
                  {isMultiSelect && (
                    <div className="mt-1.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          selected
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Row: 创建新聊天 / 从通讯录选择 */}
        <div className="border-b border-slate-100">
          {isMultiSelect ? (
            <div
              onClick={() => pushView('ADDRESS_BOOK')}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
            >
              <span className="text-[15px] text-slate-900 font-normal">
                从通讯录选择
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ) : (
            <div
              onClick={() => {
                setIsMultiSelect(true);
                pushView('ADDRESS_BOOK');
              }}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
            >
              <span className="text-[15px] text-slate-900 font-normal">
                创建新聊天
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>

        {/* Section: 最近聊天 (List) */}
        <div className="flex-1">
          <div className="px-4 py-2 bg-[#f8f9fa] text-[13px] text-slate-400 font-normal border-b border-slate-100/80">
            最近聊天
          </div>

          <div className="divide-y divide-slate-100/60">
            {mockRecentChats.map((item) => {
              const selected = isItemSelected(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isMultiSelect) {
                      toggleSelectItem(item);
                    } else {
                      handleSingleTargetClick(item);
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                >
                  {isMultiSelect && (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  )}

                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    avatarType={item.avatarType}
                    gridAvatars={item.gridAvatars}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-normal text-slate-900 truncate">
                      {item.name}{' '}
                      {item.memberCount ? (
                        <span className="text-slate-400 text-[14px]">
                          ({item.memberCount}人)
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // VIEW 3: ADDRESS BOOK (添加人（一级）.png)
  const renderAddressBookView = () => {
    return (
      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {/* Navigation Categories */}
        <div className="border-b border-slate-100 divide-y divide-slate-100">
          {/* 我的关注 */}
          <div
            onClick={() => pushView('MY_FOLLOWED')}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f97066] flex items-center justify-center text-white shadow-2xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[15px] text-slate-900 font-normal">我的关注</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 我的群组 */}
          <div
            onClick={() => pushView('MY_GROUPS')}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-2xs">
                <Users className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[15px] text-slate-900 font-normal">我的群组</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* 企业通讯录 */}
          <div className="py-2.5">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[15px] text-slate-900 font-normal">企业通讯录</div>
                <div className="text-[12px] text-slate-400">
                  深圳市星网信通信科技有限公司
                </div>
              </div>
            </div>

            {/* Tree Branch Sub-rows */}
            <div className="pl-16 pr-4 space-y-1 mt-1">
              <div
                onClick={() => pushView('DEPARTMENTS')}
                className="flex items-center justify-between py-2 hover:text-blue-600 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-[14px] text-slate-700 group-hover:text-blue-600">
                  <span className="text-slate-300">└</span>
                  <span>组织架构</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => {
                  const dept = mockDepartments.find((d) => d.name === '产品规划部') || mockDepartments[0];
                  pushView('DEPARTMENT_DETAIL', { department: dept });
                }}
                className="flex items-center justify-between py-2 hover:text-blue-600 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-[14px] text-slate-700 group-hover:text-blue-600">
                  <span className="text-slate-300">└</span>
                  <span>产品规划部</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: 最近联系人 */}
        <div className="flex-1">
          <div className="px-4 py-2 bg-[#f8f9fa] text-[13px] text-slate-400 font-normal border-b border-slate-100/80">
            最近联系人
          </div>

          <div className="divide-y divide-slate-100/60">
            {mockRecentContacts.map((item) => {
              const selected = isItemSelected(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelectItem(item)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      selected
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    avatarType={item.avatarType}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-normal text-slate-900 truncate">
                      {item.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // VIEW 4: DEPARTMENTS LIST (添加人（组织机构）.png)
  const renderDepartmentsView = () => {
    return (
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {mockDepartments.map((dept) => {
          const allDeptMembersSelected = dept.members.every((m) =>
            selectedItems.some((s) => s.id === m.id)
          );

          return (
            <div
              key={dept.id}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSelectAll(dept.members);
                }}
                className="flex items-center gap-3 cursor-pointer py-1"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    allDeptMembersSelected
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {allDeptMembersSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="text-[15px] text-slate-900 font-normal">
                  {dept.name}{' '}
                  <span className="text-slate-400 text-[14px]">
                    ({dept.memberCount}人)
                  </span>
                </div>
              </div>

              <div
                onClick={() => pushView('DEPARTMENT_DETAIL', { department: dept })}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // VIEW 4.1: DEPARTMENT DETAIL (编组 4.png - e.g. 财务部)
  const renderDepartmentDetailView = () => {
    const dept: DepartmentNode = currentView.payload?.department || mockDepartments[1];
    return (
      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {/* Clickable Breadcrumb */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1.5 text-[14px]">
          <span
            onClick={() => pushView('DEPARTMENTS')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            企业通讯录
          </span>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-600">{dept.name}</span>
        </div>

        {/* Members List */}
        <div className="flex-1 divide-y divide-slate-100">
          {dept.members.map((member) => {
            const selected = isItemSelected(member.id);
            return (
              <div
                key={member.id}
                onClick={() => toggleSelectItem(member)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <Avatar
                  src={member.avatar}
                  name={member.name}
                  avatarType={member.avatarType}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-normal text-slate-900 truncate">
                    {member.name}
                  </div>
                  {member.role && (
                    <div className="text-[12px] text-slate-400 truncate mt-0.5">
                      {member.role}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // VIEW 5: MY GROUPS LIST (添加人（选择群组）.png)
  const renderMyGroupsView = () => {
    return (
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {mockMyGroups.map((grp) => {
          const allGroupMembersSelected = grp.members.every((m) =>
            selectedItems.some((s) => s.id === m.id)
          );

          return (
            <div
              key={grp.id}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSelectAll(grp.members);
                }}
                className="flex items-center gap-3 cursor-pointer py-1 flex-1 min-w-0"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    allGroupMembersSelected
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {allGroupMembersSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <Avatar
                  src={grp.avatar}
                  name={grp.name}
                  avatarType="grid"
                  gridAvatars={grp.gridAvatars}
                  size="md"
                />

                <div className="text-[15px] text-slate-900 font-normal truncate">
                  {grp.name}{' '}
                  <span className="text-slate-400 text-[14px]">
                    ({grp.memberCount}人)
                  </span>
                </div>
              </div>

              <div
                onClick={() => pushView('GROUP_DETAIL', { group: grp })}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // VIEW 5.1: GROUP DETAIL / 群中选人 (添加人（群中选人）.png)
  const renderGroupDetailView = () => {
    const grp: GroupNode = currentView.payload?.group || mockMyGroups[3];
    return (
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {grp.members.map((member) => {
          const selected = isItemSelected(member.id);
          return (
            <div
              key={member.id}
              onClick={() => toggleSelectItem(member)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {selected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <Avatar
                src={member.avatar}
                name={member.name}
                avatarType={member.avatarType}
                size="md"
              />

              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-normal text-slate-900 truncate">
                  {member.name}
                </div>
                {member.role && (
                  <div className="text-[12px] text-slate-400 truncate mt-0.5">
                    {member.role}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // VIEW 6: MY FOLLOWED (添加人（我的关注）.png)
  const renderMyFollowedView = () => {
    return (
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100">
        {mockMyFollowed.map((member) => {
          const selected = isItemSelected(member.id);
          return (
            <div
              key={member.id}
              onClick={() => toggleSelectItem(member)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {selected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              <Avatar
                src={member.avatar}
                name={member.name}
                avatarType={member.avatarType}
                size="md"
              />

              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-normal text-slate-900 truncate">
                  {member.name}
                </div>
                {member.role && (
                  <div className="text-[12px] text-slate-400 truncate mt-0.5">
                    {member.role}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // SEARCH RESULTS VIEW (搜索.png & 搜索2.png)
  const renderSearchView = () => {
    const displayedContacts = showMoreSearchContacts
      ? searchFilteredContacts
      : searchFilteredContacts.slice(0, 3);

    return (
      <div className="flex-1 overflow-y-auto bg-white">
        {searchFilteredContacts.length === 0 && searchFilteredGroups.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            {searchQuery ? '未找到匹配的联系人或群组' : '输入姓名、职位或部门搜索'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Contacts Section */}
            {searchFilteredContacts.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#f8f9fa] text-[13px] text-slate-400 font-normal">
                  联系人
                </div>
                <div className="divide-y divide-slate-100">
                  {displayedContacts.map((contact) => {
                    const selected = isItemSelected(contact.id);
                    return (
                      <div
                        key={contact.id}
                        onClick={() => {
                          if (isMultiSelect) {
                            toggleSelectItem(contact);
                          } else {
                            handleSingleTargetClick(contact);
                          }
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                      >
                        {isMultiSelect && (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              selected
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        )}

                        <Avatar
                          src={contact.avatar}
                          name={contact.name}
                          avatarType={contact.avatarType}
                          size="md"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-normal text-slate-900 truncate">
                            {contact.name}
                          </div>
                          <div className="text-[12px] text-slate-400 truncate mt-0.5">
                            {contact.role} {contact.department ? `(${contact.department})` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {searchFilteredContacts.length > 3 && !showMoreSearchContacts && (
                  <div
                    onClick={() => setShowMoreSearchContacts(true)}
                    className="flex items-center justify-center gap-1.5 py-3 text-[13px] text-blue-600 hover:bg-slate-50 cursor-pointer font-medium border-t border-slate-100"
                  >
                    <span>查看更多联系人</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            )}

            {/* Groups Section */}
            {searchFilteredGroups.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-[#f8f9fa] text-[13px] text-slate-400 font-normal">
                  群组
                </div>
                <div className="divide-y divide-slate-100">
                  {searchFilteredGroups.map((grp) => {
                    const selected = isItemSelected(grp.id);
                    return (
                      <div
                        key={grp.id}
                        onClick={() => {
                          if (isMultiSelect) {
                            toggleSelectItem(grp);
                          } else {
                            handleSingleTargetClick(grp);
                          }
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                      >
                        {isMultiSelect && (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              selected
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        )}

                        <Avatar
                          src={grp.avatar}
                          name={grp.name}
                          avatarType="grid"
                          gridAvatars={grp.gridAvatars}
                          size="md"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-normal text-slate-900 truncate">
                            {grp.name}({grp.memberCount || 9})
                          </div>
                          {grp.matchSnippet && (
                            <div className="text-[12px] text-slate-400 truncate mt-0.5">
                              {grp.matchSnippet}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ------------------------------------------------------------- */
  /* HEADER BAR CONFIGURATION                                      */
  /* ------------------------------------------------------------- */
  const getHeaderProps = () => {
    switch (currentView.type) {
      case 'ROOT':
        return {
          title: isMultiSelect ? '选择多个聊天' : '选择联系人',
          showBack: true,
          showClose: false,
          rightActionText: isMultiSelect ? '取消' : '多选',
          onRightAction: () => {
            if (isMultiSelect) {
              setIsMultiSelect(false);
              setSelectedItems([]);
            } else {
              setIsMultiSelect(true);
            }
          }
        };
      case 'ADDRESS_BOOK':
        return {
          title: '选择联系人',
          showBack: true,
          showClose: false,
          rightActionText: '',
          onRightAction: undefined
        };
      case 'DEPARTMENTS':
        return {
          title: '组织机构',
          showBack: true,
          showClose: true,
          rightActionText: '全选',
          onRightAction: () => {
            const allMembers = mockDepartments.flatMap((d) => d.members);
            handleToggleSelectAll(allMembers);
          }
        };
      case 'DEPARTMENT_DETAIL':
        return {
          title: '组织机构',
          showBack: true,
          showClose: true,
          rightActionText: '全选',
          onRightAction: () => {
            const dept = currentView.payload?.department || mockDepartments[1];
            handleToggleSelectAll(dept.members);
          }
        };
      case 'MY_GROUPS':
        return {
          title: '我的群组',
          showBack: true,
          showClose: true,
          rightActionText: '全选',
          onRightAction: () => {
            const allGroupMembers = mockMyGroups.flatMap((g) => g.members);
            handleToggleSelectAll(allGroupMembers);
          }
        };
      case 'GROUP_DETAIL':
        return {
          title: currentView.payload?.group?.name || '群中选人',
          showBack: true,
          showClose: true,
          rightActionText: '全选',
          onRightAction: () => {
            const grp = currentView.payload?.group || mockMyGroups[3];
            handleToggleSelectAll(grp.members);
          }
        };
      case 'MY_FOLLOWED':
        return {
          title: '我的关注',
          showBack: true,
          showClose: true,
          rightActionText: '全选',
          onRightAction: () => {
            handleToggleSelectAll(mockMyFollowed);
          }
        };
      default:
        return {
          title: '选择联系人',
          showBack: true,
          showClose: false,
          rightActionText: ''
        };
    }
  };

  const headerProps = getHeaderProps();

  // Bottom bar visibility: shown in all views when in multi-select mode, or in address book subviews
  const isBottomBarVisible = isMultiSelect || viewStack.length > 1;

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col select-none animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="h-11 px-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={popView}
            className="w-8 h-8 -ml-2 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          {headerProps.showClose && (
            <button
              onClick={resetToRoot}
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
        </div>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          {headerProps.title}
        </h1>

        <div className="w-12 text-right">
          {headerProps.rightActionText && (
            <button
              onClick={headerProps.onRightAction}
              className={`text-[15px] font-normal cursor-pointer ${
                headerProps.rightActionText === '全选'
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              {headerProps.rightActionText}
            </button>
          )}
        </div>
      </div>

      {/* 2. Search Input Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2">
        <div className="flex-1 h-9 px-3 bg-[#f4f5f8] rounded-lg flex items-center gap-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchActive(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchActive(true);
            }}
            placeholder="搜索"
            className="w-full bg-transparent text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isSearchActive && (
          <button
            onClick={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}
            className="text-[15px] text-blue-600 font-normal px-1 cursor-pointer"
          >
            取消
          </button>
        )}
      </div>

      {/* 3. Main Content Views */}
      {isSearchActive ? (
        renderSearchView()
      ) : (
        <>
          {currentView.type === 'ROOT' && renderRootView()}
          {currentView.type === 'ADDRESS_BOOK' && renderAddressBookView()}
          {currentView.type === 'DEPARTMENTS' && renderDepartmentsView()}
          {currentView.type === 'DEPARTMENT_DETAIL' && renderDepartmentDetailView()}
          {currentView.type === 'MY_GROUPS' && renderMyGroupsView()}
          {currentView.type === 'GROUP_DETAIL' && renderGroupDetailView()}
          {currentView.type === 'MY_FOLLOWED' && renderMyFollowedView()}
        </>
      )}

      {/* 4. Bottom Selection Bar */}
      {isBottomBarVisible && !isSearchActive && (
        <div className="h-14 px-4 bg-white border-t border-slate-100 flex items-center justify-between z-20">
          <div className="text-[14px] text-slate-800">
            已选择：
            {selectedItems.length > 0 ? (
              <span
                onClick={() => setShowSelectedManager(true)}
                className="text-blue-600 font-medium cursor-pointer hover:underline"
              >
                {selectedItems.length}人
              </span>
            ) : null}
          </div>

          <button
            disabled={selectedItems.length === 0}
            onClick={handleMultiConfirmClick}
            className={`px-5 py-1.5 rounded-md text-[14px] font-medium transition-all ${
              selectedItems.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-xs cursor-pointer'
                : 'bg-[#b4c1f5] text-white opacity-80 cursor-not-allowed'
            }`}
          >
            确定
          </button>
        </div>
      )}

      {/* 5. Selected Members Manager Sheet (添加人（已选）.png) */}
      {showSelectedManager && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-250">
          {/* Header */}
          <div className="h-11 px-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="w-12" />
            <h2 className="text-[17px] font-bold text-slate-900">
              已选择 ({selectedItems.length})
            </h2>
            <button
              onClick={() => setShowSelectedManager(false)}
              className="text-[15px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              完成
            </button>
          </div>

          {/* Selected List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    avatarType={item.avatarType}
                    gridAvatars={item.gridAvatars}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="text-[15px] font-normal text-slate-900 truncate">
                      {item.name}
                    </div>
                    {item.role && (
                      <div className="text-[12px] text-slate-400 truncate mt-0.5">
                        {item.role}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleSelectItem(item)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 active:scale-95 cursor-pointer"
                >
                  <XCircle className="w-5 h-5 stroke-[1.7]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Send Confirmation Popup Modal */}
      {confirmDialogData && (
        <div className="absolute inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
          <div className="bg-white rounded-2xl w-full max-w-[320px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Top Header */}
            <div className="px-4.5 pt-4 pb-2">
              <h3 className="text-[15px] font-medium text-slate-800">
                发送给：
              </h3>
            </div>

            {/* Target Row: 点击后弹框预览最近聊天，支持个人或群组 */}
            <div
              onClick={() => {
                if (confirmDialogData.targets.length > 0) {
                  setPreviewTarget(confirmDialogData.targets[0]);
                }
              }}
              className="px-4.5 py-2 flex items-center justify-between border-b border-slate-100/90 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors group"
              title="点击预览最近聊天"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={confirmDialogData.targets[0]?.avatar}
                  name={confirmDialogData.targets[0]?.name}
                  avatarType={confirmDialogData.targets[0]?.avatarType}
                  gridAvatars={confirmDialogData.targets[0]?.gridAvatars}
                  size="md"
                />
                <span className="text-[15px] font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {confirmDialogData.targets.length === 1
                    ? confirmDialogData.targets[0]?.name
                    : `${confirmDialogData.targets[0]?.name} 等 ${confirmDialogData.targets.length} 个聊天`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Message Preview: 点击预览全部内容 */}
            <div
              onClick={handleOpenFullContentPreview}
              className="px-4.5 py-3.5 hover:bg-slate-50 active:bg-slate-100/80 cursor-pointer transition-colors group select-none rounded-xl mx-1"
              title="点击预览全部内容"
            >
              {renderMessageSummary()}
            </div>

            {/* Note / Leave a message input */}
            <div className="px-4.5 pb-4">
              <input
                type="text"
                value={confirmDialogData.comment}
                onChange={(e) =>
                  setConfirmDialogData({
                    ...confirmDialogData,
                    comment: e.target.value
                  })
                }
                placeholder="留言"
                className="w-full bg-[#f4f5f7] rounded-[8px] px-3 py-2 text-[14px] text-slate-800 placeholder-slate-400 outline-none border border-transparent focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>

            {/* Bottom Split Action Buttons: 取消 | 发送 */}
            <div className="border-t border-slate-100 flex divide-x divide-slate-100">
              <button
                onClick={() => setConfirmDialogData(null)}
                className="flex-1 py-3 text-center text-[15px] font-normal text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSendForward}
                className="flex-1 py-3 text-center text-[15px] font-medium text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 最近聊天预览弹窗 (无论是个人还是群组) */}
      <RecentChatPreviewModal
        isOpen={!!previewTarget}
        target={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />

      {/* 8. 转发全部内容详情预览弹窗 (文字/图片/文件/聊天记录/链接) */}
      <FullContentPreviewModal
        isOpen={!!fullPreviewData}
        data={fullPreviewData}
        onClose={() => setFullPreviewData(null)}
      />
    </div>
  );
};
