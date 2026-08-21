import React, { useState } from 'react';
import { ChevronLeft, XCircle, Check } from 'lucide-react';
import { Avatar } from './Avatar';
import { SearchBar } from './SearchBar';

export interface WhitelistMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// Candidate group members available to add to whitelist
export const allCandidateMembers: WhitelistMember[] = [
  {
    id: 'm1',
    name: '石梁雅',
    role: '软件及通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'm2',
    name: '董巧碗',
    role: '副总经理',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'm3',
    name: '官文',
    role: '会计',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'm4',
    name: '越秋',
    role: '副总经理',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'm5',
    name: '全刚保',
    role: '会计',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'm6',
    name: '法山梯',
    role: '会计',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'm7',
    name: '李树洁',
    role: '会计',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  }
];

interface WhitelistPageProps {
  onBack: () => void;
  whitelist: WhitelistMember[];
  onUpdateWhitelist: (newList: WhitelistMember[]) => void;
}

export const WhitelistPage: React.FC<WhitelistPageProps> = ({
  onBack,
  whitelist,
  onUpdateWhitelist
}) => {
  const [subView, setSubView] = useState<'list' | 'add'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdsToAdd, setSelectedIdsToAdd] = useState<string[]>([]);

  // Open 'add' view pre-selecting existing whitelist members
  const handleOpenAddView = () => {
    setSelectedIdsToAdd(whitelist.map((m) => m.id));
    setSearchQuery('');
    setSubView('add');
  };

  // Toggle selection in 'add' view
  const toggleSelectMember = (id: string) => {
    if (selectedIdsToAdd.includes(id)) {
      setSelectedIdsToAdd(selectedIdsToAdd.filter((item) => item !== id));
    } else {
      setSelectedIdsToAdd([...selectedIdsToAdd, id]);
    }
  };

  // Confirm additions
  const handleConfirmAdd = () => {
    const newMembers = allCandidateMembers.filter((m) =>
      selectedIdsToAdd.includes(m.id)
    );
    onUpdateWhitelist(newMembers);
    setSubView('list');
    setSearchQuery('');
  };

  // Remove a member directly from whitelist
  const handleRemoveMember = (id: string) => {
    onUpdateWhitelist(whitelist.filter((m) => m.id !== id));
  };

  // Filtered members for Whitelist List view
  const filteredWhitelist = whitelist.filter(
    (m) =>
      m.name.includes(searchQuery) ||
      m.role.includes(searchQuery)
  );

  // Filtered candidate members for Add Members view
  const filteredCandidates = allCandidateMembers.filter(
    (m) =>
      m.name.includes(searchQuery) ||
      m.role.includes(searchQuery)
  );

  // ================= 2. ADD MEMBERS VIEW =================
  if (subView === 'add') {
    return (
      <div className="flex flex-col h-full bg-[#f4f5f8] select-none relative overflow-hidden">
        {/* Top Header */}
        <div className="px-2 py-3 flex items-center justify-between bg-[#f4f5f8]/95 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={() => setSubView('list')}
            className="system-back-button"
          >
            <ChevronLeft />
          </button>

          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
            添加成员
          </h1>

          <div className="w-8"></div>
        </div>

        {/* Search Bar */}
        <div className="px-2 mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索"
          />
        </div>

        {/* Member Candidates List */}
        <div className="px-2 flex-1 overflow-y-auto pb-20">
          <div className="bg-white rounded-[16px] p-2 shadow-2xs border border-slate-100/80 divide-y divide-slate-100">
            {filteredCandidates.map((member) => {
              const isChecked = selectedIdsToAdd.includes(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleSelectMember(member.id)}
                  className="flex items-center gap-3.5 p-3 hover:bg-slate-50 rounded-[12px] cursor-pointer transition-colors"
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-colors flex-shrink-0 ${
                      isChecked
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Avatar */}
                  <Avatar src={member.avatar} name={member.name} size="md" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold text-slate-900 truncate">
                      {member.name}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5 truncate">
                      {member.role}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Confirm Bar */}
        <div className="bg-[#f4f5f8]/95 backdrop-blur-md border-t border-slate-200/60 px-4 py-3 flex items-center justify-between absolute bottom-0 left-0 right-0 z-20">
          <div className="text-[14px] text-slate-700">
            已选择：<span className="text-blue-600 font-semibold">{selectedIdsToAdd.length}人</span>
          </div>
          <button
            onClick={handleConfirmAdd}
            className="px-5 py-2 bg-blue-600 text-white text-[14px] font-medium rounded-xl shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            确定
          </button>
        </div>
      </div>
    );
  }

  // ================= 1. WHITELIST LIST VIEW =================
  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none relative overflow-hidden">
      {/* Top Header */}
      <div className="px-2 py-3 flex items-center justify-between bg-[#f4f5f8]/95 backdrop-blur-md sticky top-0 z-20">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          白名单
        </h1>

        <button
          onClick={handleOpenAddView}
          className="text-[15px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          添加成员
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 mb-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="搜索"
        />
      </div>

      {/* Main Content Area */}
      <div className="px-3 flex-1 overflow-y-auto pb-6 flex flex-col">
        {whitelist.length === 0 ? (
          /* Empty State Illustration matching Screenshot 1 */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
            <div className="relative mb-6">
              {/* Soft decorative background circles */}
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200/80 absolute -top-1 -right-3" />
              <div className="w-2 h-2 rounded-full bg-slate-200/80 absolute top-10 -left-4" />

              {/* Folder Tray Graphic */}
              <div className="w-24 h-20 bg-[#cbd5e1] rounded-2xl relative flex items-center justify-center shadow-2xs">
                {/* Paper document sticking out */}
                <div className="w-16 h-16 bg-white rounded-xl shadow-xs absolute -top-4 flex flex-col p-2 gap-1 border border-slate-100">
                  <div className="w-8 h-1 bg-slate-300 rounded-full" />
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                  <div className="w-10 h-1 bg-slate-200 rounded-full" />
                </div>
                {/* Front Tray lip */}
                <div className="w-24 h-10 bg-[#94a3b8] rounded-b-2xl absolute bottom-0 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-300/80 rounded-full" />
                </div>
              </div>
            </div>

            <p className="text-[14px] text-slate-400 font-normal max-w-[240px] leading-relaxed">
              暂无成员，请在右上角点击添加成员
            </p>
          </div>
        ) : (
          /* Populated Whitelist Card matching Screenshot 3 */
          <div className="bg-white rounded-[16px] p-2 shadow-2xs border border-slate-100/80 divide-y divide-slate-100">
            {filteredWhitelist.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-[12px] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={member.avatar} name={member.name} size="md" />
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-slate-900 truncate">
                      {member.name}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5 truncate">
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Remove button (XCircle) */}
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1 text-slate-300 hover:text-slate-600 transition-colors flex-shrink-0"
                  title="移除"
                >
                  <XCircle className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
