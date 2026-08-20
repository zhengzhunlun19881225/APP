import React, { useState } from 'react';
import { ChevronLeft, Plus, Search } from 'lucide-react';
import { CreateGroupPage } from './CreateGroupPage';

export type GroupType = 'temp' | 'event' | 'none';

export interface GroupInfo {
  id: string;
  name: string;
  memberCount: number;
  type?: GroupType;
  gridAvatars: string[];
  createdByMe?: boolean;
}

export const initialJoinedGroups: GroupInfo[] = [
  {
    id: 'g1',
    name: '业务沟通组',
    memberCount: 10,
    type: 'temp',
    createdByMe: false,
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
    ]
  },
  {
    id: 'g2',
    name: '客户沟通群',
    memberCount: 12,
    type: 'event',
    createdByMe: false,
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80'
    ]
  },
  {
    id: 'g5',
    name: '安全保障综合群',
    memberCount: 18,
    type: 'none',
    createdByMe: false,
    gridAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
    ]
  }
];

export const initialCreatedGroups: GroupInfo[] = [
  {
    id: 'g3',
    name: '应急救援指挥群',
    memberCount: 8,
    type: 'event',
    createdByMe: true,
    gridAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
    ]
  },
  {
    id: 'g4',
    name: '机场安全监督组',
    memberCount: 15,
    type: 'none',
    createdByMe: true,
    gridAvatars: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'
    ]
  },
  {
    id: 'g6',
    name: '三季度安全培训答疑群',
    memberCount: 20,
    type: 'temp',
    createdByMe: true,
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'
    ]
  }
];

interface MyGroupsPageProps {
  onBack: () => void;
  onOpenGroupChat?: (groupName: string) => void;
  createdGroups?: GroupInfo[];
  joinedGroups?: GroupInfo[];
  onAddCreatedGroup?: (newGroup: GroupInfo) => void;
}

export const MyGroupsPage: React.FC<MyGroupsPageProps> = ({
  onBack,
  onOpenGroupChat,
  createdGroups: propCreatedGroups,
  joinedGroups: propJoinedGroups,
  onAddCreatedGroup
}) => {
  const [activeTab, setActiveTab] = useState<'joined' | 'created'>('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const [localCreatedGroups, setLocalCreatedGroups] = useState<GroupInfo[]>(
    propCreatedGroups || initialCreatedGroups
  );
  const [localJoinedGroups] = useState<GroupInfo[]>(
    propJoinedGroups || initialJoinedGroups
  );

  const currentCreatedGroups = propCreatedGroups || localCreatedGroups;
  const currentJoinedGroups = propJoinedGroups || localJoinedGroups;

  const handleCreateSuccess = (groupName: string, selectedMembersCount: number) => {
    const newGroup: GroupInfo = {
      id: 'g_' + Date.now(),
      name: groupName,
      memberCount: selectedMembersCount,
      type: 'none',
      createdByMe: true,
      gridAvatars: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
      ]
    };

    if (onAddCreatedGroup) {
      onAddCreatedGroup(newGroup);
    } else {
      setLocalCreatedGroups((prev) => [newGroup, ...prev]);
    }

    setIsCreatingGroup(false);
    setActiveTab('created'); // Switch to "我创建的" tab to see newly created group
    onOpenGroupChat?.(groupName);
  };

  if (isCreatingGroup) {
    return (
      <CreateGroupPage
        onBack={() => setIsCreatingGroup(false)}
        onCreateSuccess={handleCreateSuccess}
      />
    );
  }

  const currentGroups = activeTab === 'joined' ? currentJoinedGroups : currentCreatedGroups;
  const filteredGroups = currentGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none overflow-y-auto pb-8">
      {/* Top Navigation Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-[#f4f5f8]/90 backdrop-blur-xs z-10">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight leading-[22px]">
          我的群组
        </h1>

        <button
          onClick={() => setIsCreatingGroup(true)}
          className="system-plus-button"
          title="创建群组"
        >
          <Plus />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="px-4 mt-1 mb-3">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索"
            className="w-full h-10 bg-white rounded-xl pl-9 pr-4 py-0 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-100/80 shadow-2xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Group Content Card Container */}
      <div className="px-4 flex-1">
        <div className="bg-white rounded-[24px] p-4 shadow-2xs border border-slate-100/80 min-h-[420px] space-y-4">
          {/* Tabs Navigation */}
          <div className="flex items-center justify-around border-b border-slate-100 pb-3 pt-1">
            <button
              onClick={() => setActiveTab('joined')}
              className={`text-[16px] font-medium relative transition-colors cursor-pointer px-4 ${
                activeTab === 'joined'
                  ? 'text-[#0070f3] font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              我加入的
              {activeTab === 'joined' && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#0070f3] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('created')}
              className={`text-[16px] font-medium relative transition-colors cursor-pointer px-4 ${
                activeTab === 'created'
                  ? 'text-[#0070f3] font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              我创建的
              {activeTab === 'created' && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#0070f3] rounded-full" />
              )}
            </button>
          </div>

          {/* Group Items List */}
          <div className="divide-y divide-slate-100/80 pt-1">
            {filteredGroups.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-[14px]">
                {activeTab === 'joined' ? '暂无加入的群组' : '暂无创建的群组'}
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => onOpenGroupChat?.(group.name)}
                  className="flex items-center justify-between py-3.5 px-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                    {/* CIRCULAR Avatar Grid (2x2) */}
                    <div className="w-10 h-10 rounded-full overflow-hidden grid grid-cols-2 gap-0.5 p-0.5 bg-slate-200/80 shadow-2xs border border-slate-100 flex-shrink-0">
                      {group.gridAvatars.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ))}
                    </div>

                    {/* Group Title & Member Count with Tag underneath */}
                    <div className="flex flex-col min-w-0 justify-center">
                      <span className="text-[16px] font-semibold text-slate-900 truncate leading-tight">
                        {group.name} ({group.memberCount})
                      </span>

                      {group.type === 'temp' && (
                        <div className="mt-1.5">
                          <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-[#d97706] bg-[#fef3c7] rounded-[6px]">
                            临时群
                          </span>
                        </div>
                      )}

                      {group.type === 'event' && (
                        <div className="mt-1.5">
                          <span className="inline-block px-2 py-0.5 text-[11px] font-medium text-[#e11d48] bg-[#ffe4e6] rounded-[6px]">
                            事件群
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Icon Button (Blue chat bubble matching screenshot) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGroupChat?.(group.name);
                    }}
                    className="w-9 h-9 flex items-center justify-center text-[#0070f3] hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
                    title={`进入 ${group.name}`}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 28 28" fill="none">
                      <rect
                        x="3.5"
                        y="6"
                        width="21"
                        height="15"
                        rx="5"
                        stroke="#0070f3"
                        strokeWidth="2.2"
                        fill="none"
                      />
                      <circle cx="10.5" cy="13.5" r="1.3" fill="#0070f3" />
                      <circle cx="17.5" cy="13.5" r="1.3" fill="#0070f3" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
