import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Search,
  Users,
  Check,
  X,
  XCircle,
  Building2,
  Edit3
} from 'lucide-react';
import { MessageItem } from '../types';
import { Avatar } from './Avatar';
import { GroupMutePage } from './GroupMutePage';
import { ChatHistoryPage } from './ChatHistoryPage';
import { ContactProfilePage } from './ContactProfilePage';
import { initialContacts } from '../data/mockData';
import {
  ALL_MEMBERS_REPO,
  GUANGXIN_GROUP_TREE,
  Contact,
  OrgNode
} from './CreateGroupPage';

interface GroupMemberItem {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  department?: string;
}

interface ChatSettingsPageProps {
  chatInfo: MessageItem;
  onBack: () => void;
  onActionNotice?: (msg: string) => void;
  onUpdateChatName?: (newName: string) => void;
}

// 初始群成员列表 (与截图完全一致)
const initialGroupMembers: GroupMemberItem[] = [
  { id: 'gm1', name: '殷霭东', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', department: '3经营管理部', title: '商务主管' },
  { id: 'gm2', name: '拓晓', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', department: '1总裁办', title: '助理' },
  { id: 'gm3', name: '斯瑞悦', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', department: '8融合指挥研发部', title: '系统架构' },
  { id: 'gm4', name: '呼惠', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', department: '2财务部', title: '会计' },
  { id: 'gm5', name: '蓝蓓春', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', department: '4通信解决方案部', title: '网络工程师' },
  { id: 'gm6', name: '钟贵俊', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', department: '8融合指挥研发部', title: '高级运维' },
  { id: 'gm7', name: '尉婷琼', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', department: '3经营管理部', title: '战略规划' },
  { id: 'gm8', name: '李琦', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', department: '2财务部', title: '资金出纳' },
  { id: 'gm9', name: '广超胜', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', department: '4通信解决方案部', title: '应急保障' },
  { id: 'gm10', name: '乌壮菲', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', department: '7质量管理部', title: '品控主管' }
];

export const ChatSettingsPage: React.FC<ChatSettingsPageProps> = ({
  chatInfo,
  onBack,
  onActionNotice,
  onUpdateChatName
}) => {
  const isGroup =
    chatInfo.isGroup ||
    chatInfo.avatarType === 'grid' ||
    chatInfo.name.includes('群') ||
    chatInfo.name.includes('组');

  // 群成员动态状态
  const [members, setMembers] = useState<GroupMemberItem[]>(initialGroupMembers);
  const [currentGroupName, setCurrentGroupName] = useState<string>(chatInfo.name);

  // 交互状态
  const [isRemovingMode, setIsRemovingMode] = useState<boolean>(false);
  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);
  const [isExpandedMembers, setIsExpandedMembers] = useState<boolean>(false);
  const [showEditGroupNameModal, setShowEditGroupNameModal] = useState<boolean>(false);
  const [newGroupNameInput, setNewGroupNameInput] = useState<string>(chatInfo.name);

  // 选人页面相关状态 (组织架构树选人)
  const [pickerNavPath, setPickerNavPath] = useState<OrgNode[]>([GUANGXIN_GROUP_TREE]);
  const [pickerSearch, setPickerSearch] = useState<string>('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [showSelectedSheet, setShowSelectedSheet] = useState<boolean>(false);

  // 其它子页面
  const [isTop, setIsTop] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [showGroupMute, setShowGroupMute] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [viewingContact, setViewingContact] = useState<any>(null);

  const handleNotice = (text: string) => {
    if (onActionNotice) {
      onActionNotice(text);
    } else {
      alert(text);
    }
  };

  // 获取所有候选联系人 Map
  const allContactsMap = useMemo(() => {
    const map = new Map<string, Contact>();
    ALL_MEMBERS_REPO.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  // 开启添加成员弹窗
  const handleOpenAddPicker = () => {
    setIsRemovingMode(false);
    setPickerNavPath([GUANGXIN_GROUP_TREE]);
    setPickerSearch('');
    setTempSelectedIds([]);
    setIsAddingMode(true);
  };

  // 当前组织架构节点
  const currentNode = pickerNavPath[pickerNavPath.length - 1];

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!pickerSearch.trim()) return [];
    const q = pickerSearch.toLowerCase().trim();
    return ALL_MEMBERS_REPO.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q))
    );
  }, [pickerSearch]);

  // 组织树导航
  const handleEnterSubOrg = (subNode: OrgNode) => {
    setPickerNavPath((prev) => [...prev, subNode]);
  };

  const handleNavBreadcrumb = (index: number) => {
    setPickerNavPath((prev) => prev.slice(0, index + 1));
  };

  // 勾选/取消勾选候选人
  const handleToggleContact = (contact: Contact) => {
    setTempSelectedIds((prev) =>
      prev.includes(contact.id)
        ? prev.filter((id) => id !== contact.id)
        : [...prev, contact.id]
    );
  };

  // 确认添加选中的成员
  const handleConfirmAddMembers = () => {
    if (tempSelectedIds.length === 0) {
      setIsAddingMode(false);
      return;
    }

    const newMembersToAdd: GroupMemberItem[] = [];
    tempSelectedIds.forEach((id) => {
      const contact = allContactsMap.get(id);
      if (contact && !members.some((m) => m.name === contact.name)) {
        newMembersToAdd.push({
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
          title: contact.title,
          department: contact.department
        });
      }
    });

    if (newMembersToAdd.length > 0) {
      setMembers((prev) => [...prev, ...newMembersToAdd]);
      handleNotice(`已成功添加 ${newMembersToAdd.length} 位新成员到群聊`);
    } else {
      handleNotice('所选人员已在群聊中');
    }

    setIsAddingMode(false);
    setTempSelectedIds([]);
  };

  // 移除单个成员
  const handleRemoveMember = (member: GroupMemberItem) => {
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    handleNotice(`已将「${member.name}」移出群聊`);
  };

  // 修改群名确认
  const handleSaveGroupName = () => {
    if (!newGroupNameInput.trim()) {
      handleNotice('群名称不能为空');
      return;
    }
    setCurrentGroupName(newGroupNameInput.trim());
    onUpdateChatName?.(newGroupNameInput.trim());
    setShowEditGroupNameModal(false);
    handleNotice(`群聊名称已修改为「${newGroupNameInput.trim()}」`);
  };

  // 1. 联系人详情页
  if (viewingContact) {
    return (
      <ContactProfilePage
        contact={viewingContact}
        onBack={() => setViewingContact(null)}
        onShowToast={handleNotice}
        onAction={(action) => {
          if (action === 'call') {
            handleNotice(`拨打语音通话给 ${viewingContact.name}`);
          } else if (action === 'chat') {
            setViewingContact(null);
            onBack();
          }
        }}
      />
    );
  }

  // 2. 聊天记录页面
  if (showChatHistory) {
    return (
      <ChatHistoryPage
        chatInfo={{ ...chatInfo, name: currentGroupName }}
        onBack={() => setShowChatHistory(false)}
        onShowToast={handleNotice}
      />
    );
  }

  // 3. 群内禁言页面
  if (showGroupMute) {
    return (
      <GroupMutePage
        onBack={() => setShowGroupMute(false)}
        onNotice={handleNotice}
      />
    );
  }

  // 4. 添加成员 (系统标准通讯录组织架构选人页面)
  if (isAddingMode) {
    return (
      <div className="flex flex-col h-full bg-[#f4f5f8] select-none relative overflow-hidden">
        {/* Navigation Bar */}
        <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-[#f4f5f8]/95 backdrop-blur-xs z-10 border-b border-slate-200/50">
          <button
            onClick={() => setIsAddingMode(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
            添加群成员
          </h1>

          <div className="w-8" />
        </div>

        {/* Search Input Bar */}
        <div className="px-4 mt-2.5 mb-2">
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              placeholder="搜索联系人、部门、职位"
              className="w-full bg-white rounded-xl pl-9 pr-8 py-2 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-100/80 shadow-2xs focus:outline-none focus:border-blue-500 transition-colors"
            />
            {pickerSearch && (
              <button
                onClick={() => setPickerSearch('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Department Breadcrumb Navigation */}
        {!pickerSearch && (
          <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[13px] no-scrollbar">
            {pickerNavPath.map((node, idx) => (
              <React.Fragment key={node.id}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                <button
                  onClick={() => handleNavBreadcrumb(idx)}
                  className={`whitespace-nowrap transition-colors ${
                    idx === pickerNavPath.length - 1
                      ? 'font-bold text-[#0070f3]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {node.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Contact List Content Card */}
        <div className="flex-1 px-4 overflow-y-auto pb-24">
          <div className="bg-white rounded-[20px] p-3 shadow-2xs border border-slate-100/80 divide-y divide-slate-100/80">
            {pickerSearch ? (
              /* 搜索结果展示 */
              searchResults.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-[14px]">
                  未找到匹配的联系人
                </div>
              ) : (
                searchResults.map((contact) => {
                  const isChecked = tempSelectedIds.includes(contact.id);
                  const isAlreadyMember = members.some((m) => m.name === contact.name);

                  return (
                    <div
                      key={contact.id}
                      onClick={() => !isAlreadyMember && handleToggleContact(contact)}
                      className={`flex items-center justify-between py-3 px-2 rounded-xl transition-colors ${
                        isAlreadyMember
                          ? 'opacity-50 cursor-not-allowed bg-slate-50/60'
                          : 'cursor-pointer hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all ${
                            isAlreadyMember
                              ? 'bg-slate-300 border-slate-300 text-white'
                              : isChecked
                              ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {(isChecked || isAlreadyMember) && (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </div>

                        <img
                          src={contact.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shadow-2xs shrink-0 border border-slate-100"
                        />

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[15px] font-medium text-slate-900 truncate">
                              {contact.name}
                            </span>
                            {isAlreadyMember && (
                              <span className="text-[11px] px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded">
                                已在群中
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-slate-400 truncate">
                            {contact.department} · {contact.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* 组织架构分类与成员 */
              <>
                {/* 1. 下级部门列表 */}
                {currentNode.children && currentNode.children.length > 0 && (
                  <>
                    {currentNode.children.map((subNode) => (
                      <div
                        key={subNode.id}
                        onClick={() => handleEnterSubOrg(subNode)}
                        className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-[#0070f3] flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-slate-900">
                              {subNode.name}
                            </span>
                            <span className="text-[12px] text-slate-400">
                              {subNode.count} 人
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    ))}
                  </>
                )}

                {/* 2. 当前节点成员列表 */}
                {currentNode.members && currentNode.members.length > 0 && (
                  <>
                    {currentNode.members.map((member) => {
                      const isChecked = tempSelectedIds.includes(member.id);
                      const isAlreadyMember = members.some((m) => m.name === member.name);

                      return (
                        <div
                          key={member.id}
                          onClick={() => !isAlreadyMember && handleToggleContact(member)}
                          className={`flex items-center justify-between py-3 px-2 rounded-xl transition-colors ${
                            isAlreadyMember
                              ? 'opacity-50 cursor-not-allowed bg-slate-50/60'
                              : 'cursor-pointer hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all ${
                                isAlreadyMember
                                  ? 'bg-slate-300 border-slate-300 text-white'
                                  : isChecked
                                  ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {(isChecked || isAlreadyMember) && (
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              )}
                            </div>

                            <img
                              src={member.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover shadow-2xs shrink-0 border border-slate-100"
                            />

                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[15px] font-medium text-slate-900 truncate">
                                  {member.name}
                                </span>
                                {isAlreadyMember && (
                                  <span className="text-[11px] px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded">
                                    已在群中
                                  </span>
                                )}
                              </div>
                              {member.title && (
                                <span className="text-[12px] text-slate-400 truncate">
                                  {member.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {(!currentNode.children || currentNode.children.length === 0) &&
                  (!currentNode.members || currentNode.members.length === 0) && (
                    <div className="py-12 text-center text-slate-400 text-[14px]">
                      该部门暂无人员
                    </div>
                  )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Confirmation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between z-20 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-[15px] text-slate-800 font-normal">
              已选择:{' '}
              <span className="text-[#0070f3] font-bold text-[17px]">
                {tempSelectedIds.length}
              </span>{' '}
              <span className="text-slate-400 font-normal text-[14px]">/ 1000</span>
            </span>
            {tempSelectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSelectedSheet(true)}
                className="text-[13px] text-[#0070f3] bg-blue-50 hover:bg-blue-100 active:scale-95 px-2 py-0.5 rounded font-normal transition-all cursor-pointer border border-blue-100"
              >
                查看
              </button>
            )}
          </div>

          <button
            onClick={handleConfirmAddMembers}
            disabled={tempSelectedIds.length === 0}
            className={`text-[15px] font-semibold px-7 py-2 rounded-xl transition-all shadow-xs ${
              tempSelectedIds.length > 0
                ? 'bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            确定
          </button>
        </div>

        {/* Selected Members Drawer */}
        {showSelectedSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-t-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] h-[520px] animate-slide-up">
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                <button
                  onClick={() => setShowSelectedSheet(false)}
                  className="text-[15px] text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  关闭
                </button>

                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight text-center">
                  已选择 ({tempSelectedIds.length})
                </h2>

                <button
                  onClick={() => {
                    setShowSelectedSheet(false);
                    handleConfirmAddMembers();
                  }}
                  className="text-[15px] text-[#0070f3] font-bold hover:text-blue-700 cursor-pointer"
                >
                  确定
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-slate-100">
                {tempSelectedIds.map((id) => {
                  const person = allContactsMap.get(id);
                  if (!person) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover shadow-2xs border border-slate-100 shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-semibold text-slate-900 truncate">
                            {person.name}
                          </span>
                          <span className="text-[12px] text-slate-400 truncate">
                            {person.department} · {person.title}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setTempSelectedIds((prev) => prev.filter((i) => i !== id))
                        }
                        className="p-1 text-slate-300 hover:text-rose-500 active:scale-90 transition-all cursor-pointer rounded-full"
                        title="移除"
                      >
                        <XCircle className="w-5 h-5 stroke-[1.8]" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setTempSelectedIds([])}
                  className="text-[13px] text-rose-500 hover:text-rose-600 px-2 py-1 font-medium"
                >
                  清空已选
                </button>
                <button
                  onClick={() => setShowSelectedSheet(false)}
                  className="px-5 py-2 bg-[#0070f3] text-white text-[14px] font-bold rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 成员展示切片（未展开时展示前10个）
  const displayedMembers = isExpandedMembers ? members : members.slice(0, 10);

  // 主设置页面
  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-8">
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#f4f5f8]/95 backdrop-blur-md sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/60 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          聊天设置
        </h1>

        <div className="w-8 flex justify-end">
          {isRemovingMode && (
            <button
              onClick={() => setIsRemovingMode(false)}
              className="text-[14px] font-bold text-[#0070f3] hover:text-blue-700"
            >
              完成
            </button>
          )}
        </div>
      </div>

      {/* Removing mode notice banner */}
      {isRemovingMode && (
        <div className="mx-4 mb-2 bg-rose-50 border border-rose-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between animate-in fade-in">
          <span className="text-[13px] text-rose-700 font-medium">
            点击成员右上角减号或点击头像移出群聊
          </span>
          <button
            onClick={() => setIsRemovingMode(false)}
            className="text-[13px] font-bold text-rose-600 hover:text-rose-800 bg-white px-2.5 py-0.5 rounded-lg border border-rose-200 shadow-2xs"
          >
            完成
          </button>
        </div>
      )}

      <div className="px-4 space-y-3 mt-1">
        {/* GROUP CHAT SETTINGS */}
        {isGroup ? (
          <>
            <div className="bg-white rounded-[12px] p-4 shadow-2xs border border-slate-100/80">
              {/* Group Avatar & Name Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Avatar
                  src={chatInfo.avatar}
                  name={currentGroupName}
                  avatarType={chatInfo.avatarType}
                  gridAvatars={chatInfo.gridAvatars}
                  size="md"
                />
                <span className="text-[16px] font-semibold text-slate-900 truncate">
                  {currentGroupName}
                </span>
              </div>

              {/* Group Members Section Title */}
              <div className="mt-3.5 mb-3 flex items-center justify-between text-[13px] font-medium text-slate-800">
                <span>群成员</span>
                <span className="text-[13px] text-slate-400 font-normal">
                  {members.length} 人
                </span>
              </div>

              {/* Members Avatar Grid (5 items per row matching screenshot) */}
              <div className="grid grid-cols-5 gap-y-4 gap-x-2 text-center pt-1">
                {displayedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col items-center group relative cursor-pointer"
                    onClick={() => {
                      if (isRemovingMode) {
                        handleRemoveMember(m);
                      } else {
                        const matched = initialContacts.find(
                          (c) => c.name === m.name
                        ) || {
                          id: m.id,
                          name: m.name,
                          avatar: m.avatar,
                          phone: '13812345678',
                          email: `${m.name}@engihkek.bi`,
                          department: m.department || '应急指挥部',
                          role: m.title || '组员',
                          gender: '女',
                          birthday: '1992-05-18',
                          nativePlace: '广东 广州',
                          motto: '快乐和烦恼都是自己给的',
                          followingCount: 12,
                          followersCount: 16
                        };
                        setViewingContact(matched);
                      }
                    }}
                  >
                    <div className="relative">
                      <Avatar src={m.avatar} name={m.name} size="sm" />
                      {/* Red Minus Badge in Removing Mode (系统减号角标交互) */}
                      {isRemovingMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMember(m);
                          }}
                          className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xs active:scale-90 transition-transform animate-in zoom-in-75"
                          title="移出群聊"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 mt-1 truncate max-w-[56px]">
                      {m.name}
                    </span>
                  </div>
                ))}

                {/* Plus Button (+) 点击进入添加群成员组织架构选人 */}
                <div
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={handleOpenAddPicker}
                >
                  <div className="w-10 h-10 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 active:scale-95 transition-all">
                    <Plus className="w-5 h-5 stroke-[1.5]" />
                  </div>
                </div>

                {/* Minus Button (-) 点击进入/退出删除成员模式 */}
                <div
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setIsRemovingMode((prev) => !prev)}
                >
                  <div
                    className={`w-10 h-10 rounded-full border border-dashed flex items-center justify-center transition-all ${
                      isRemovingMode
                        ? 'border-rose-500 text-rose-500 bg-rose-50 ring-2 ring-rose-300'
                        : 'border-slate-300 text-slate-400 group-hover:border-rose-500 group-hover:text-rose-500 active:scale-95'
                    }`}
                    title={isRemovingMode ? '完成删除' : '移除群成员'}
                  >
                    <Minus className="w-5 h-5 stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {/* View More Members Button */}
              {members.length > 10 && (
                <div className="mt-5 text-center">
                  <button
                    onClick={() => setIsExpandedMembers((prev) => !prev)}
                    className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {isExpandedMembers ? '收起群员' : `查看更多群员 (共 ${members.length} 人)`}
                  </button>
                </div>
              )}
            </div>

            {/* Group Name Setting Item */}
            <div className="bg-white rounded-[12px] p-3 shadow-2xs border border-slate-100/80">
              <div
                onClick={() => {
                  setNewGroupNameInput(currentGroupName);
                  setShowEditGroupNameModal(true);
                }}
                className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
              >
                <span className="text-[15px] font-medium text-slate-800">
                  群聊名称
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] text-slate-400 max-w-[170px] truncate">
                    {currentGroupName}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Other Options */}
            <div className="bg-white rounded-[12px] p-3 shadow-2xs border border-slate-100/80 divide-y divide-slate-100">
              <div
                onClick={() => setShowGroupMute(true)}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
              >
                <span className="text-[15px] font-medium text-slate-800">
                  群内禁言
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div
                onClick={() => setShowChatHistory(true)}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
              >
                <span className="text-[15px] font-medium text-slate-800">
                  聊天记录
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div className="flex items-center justify-between py-2.5 px-2">
                <span className="text-[15px] font-medium text-slate-800">
                  置顶聊天
                </span>
                <button
                  onClick={() => setIsTop(!isTop)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    isTop ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      isTop ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 px-2">
                <span className="text-[15px] font-medium text-slate-800">
                  消息免打扰
                </span>
                <button
                  onClick={() => setIsMute(!isMute)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    isMute ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      isMute ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Exit/Dissolve Group Buttons */}
            <div className="bg-white rounded-[12px] p-3 shadow-2xs border border-slate-100/80 divide-y divide-slate-100 text-center">
              <button
                onClick={() => {
                  handleNotice('已退出群聊');
                  setTimeout(onBack, 400);
                }}
                className="w-full py-2.5 text-[15px] font-medium text-[#f44336] hover:bg-red-50/50 rounded-[12px] transition-colors cursor-pointer"
              >
                退出群聊
              </button>
              <button
                onClick={() => {
                  handleNotice('已解散群聊');
                  setTimeout(onBack, 400);
                }}
                className="w-full py-2.5 text-[15px] font-medium text-[#f44336] hover:bg-red-50/50 rounded-[12px] transition-colors cursor-pointer"
              >
                解散群聊
              </button>
            </div>
          </>
        ) : (
          /* SINGLE 1-ON-1 CHAT SETTINGS */
          <>
            <div className="bg-white rounded-[12px] p-4 shadow-2xs border border-slate-100/80">
              <div
                onClick={() => {
                  const matched = initialContacts.find(
                    (c) => c.name === chatInfo.name
                  ) || {
                    id: chatInfo.id,
                    name: chatInfo.name,
                    avatar: chatInfo.avatar,
                    phone: '14938770337',
                    email: 'nuwtule@engihkek.bi',
                    department: '财务部',
                    role: '副总经理',
                    gender: '女',
                    birthday: '1990-04-21',
                    nativePlace: '广东 广州',
                    motto: '快乐和烦恼都是自己给的',
                    followingCount: 12,
                    followersCount: 16
                  };
                  setViewingContact(matched);
                }}
                className="flex items-center justify-between p-1 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={chatInfo.avatar}
                    name={chatInfo.name}
                    avatarType={chatInfo.avatarType}
                    size="md"
                  />
                  <div>
                    <div className="text-[16px] font-semibold text-slate-900">
                      {chatInfo.name}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5">
                      原昵称: {chatInfo.name === '沈真' ? '菲菲' : chatInfo.name}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>

              {/* 1-on-1 Add Member into Group Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                <div
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={handleOpenAddPicker}
                >
                  <div className="w-10 h-10 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 active:scale-95 transition-all">
                    <Plus className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">创建群聊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[12px] p-3 shadow-2xs border border-slate-100/80 divide-y divide-slate-100">
              <div
                onClick={() => setShowGroupMute(true)}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
              >
                <span className="text-[15px] font-medium text-slate-800">
                  群内禁言
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div
                onClick={() => setShowChatHistory(true)}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
              >
                <span className="text-[15px] font-medium text-slate-800">
                  聊天记录
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div className="flex items-center justify-between py-2.5 px-2">
                <span className="text-[15px] font-medium text-slate-800">
                  置顶聊天
                </span>
                <button
                  onClick={() => setIsTop(!isTop)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    isTop ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      isTop ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 px-2">
                <span className="text-[15px] font-medium text-slate-800">
                  消息免打扰
                </span>
                <button
                  onClick={() => setIsMute(!isMute)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    isMute ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      isMute ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[12px] p-3 shadow-2xs border border-slate-100/80 text-center">
              <button
                onClick={() => handleNotice('已将该联系人拉黑')}
                className="w-full py-2.5 text-[15px] font-medium text-[#f44336] hover:bg-red-50/50 rounded-[12px] transition-colors cursor-pointer"
              >
                拉黑
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Group Name Modal */}
      {showEditGroupNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-2xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-[17px] font-bold text-slate-900 text-center">
              修改群聊名称
            </h3>
            <input
              type="text"
              value={newGroupNameInput}
              onChange={(e) => setNewGroupNameInput(e.target.value)}
              placeholder="请输入群聊名称"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[15px] focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setShowEditGroupNameModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveGroupName}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#0070f3] hover:bg-blue-600 transition-colors shadow-xs"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
