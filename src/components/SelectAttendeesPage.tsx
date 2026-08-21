import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Building2,
  Check,
  X,
  XCircle,
  FolderOpen
} from 'lucide-react';

export interface AttendeePerson {
  id: string;
  name: string;
  title?: string;
  department?: string;
  avatar: string;
}

export interface AttendeeGroup {
  id: string;
  name: string;
  count: number;
  members: AttendeePerson[];
}

export interface AttendeeDepartment {
  id: string;
  name: string;
  count: number;
  members: AttendeePerson[];
}

export interface SelectAttendeesPageProps {
  selectedAttendees: AttendeePerson[];
  onConfirm: (attendees: AttendeePerson[]) => void;
  onCancel: () => void;
}

// 丰富的联系人数据
export const MOCK_ALL_ATTENDEES: AttendeePerson[] = [
  {
    id: 'p_0002',
    name: '员工0002',
    title: '系统工程师',
    department: '融合指挥研发部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_0001',
    name: '员工0001',
    title: '高级运维',
    department: '融合指挥研发部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_003',
    name: '员工003',
    title: '技术主管',
    department: '融合指挥研发部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_sly',
    name: '石梁雅',
    title: '总经理',
    department: '通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_dqw',
    name: '董巧琬',
    title: '副总经理',
    department: '经营管理部',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_gw',
    name: '官文',
    title: '会计',
    department: '财务部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_lsj',
    name: '李树洁',
    title: '系统架构师',
    department: '融合指挥研发部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_wf',
    name: '王沣',
    title: '网络工程师',
    department: '通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_cp',
    name: '陈鹏',
    title: '安全监督员',
    department: '质量管理部',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_lq',
    name: '雷奇',
    title: '应急响应员',
    department: '智能客服研发部',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_yq',
    name: '越秋',
    title: '副总经理',
    department: '通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_qgb',
    name: '全刚保',
    title: '会计',
    department: '财务部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'p_fsd',
    name: '法山娣',
    title: '高级会计',
    department: '财务部',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'
  }
];

// 最近联系人列表
const RECENT_LIST = MOCK_ALL_ATTENDEES.slice(0, 7);

// 我的群组数据
const GROUPS_DATA: AttendeeGroup[] = [
  {
    id: 'g1',
    name: '融合指挥研发专班',
    count: 6,
    members: [
      MOCK_ALL_ATTENDEES[0],
      MOCK_ALL_ATTENDEES[1],
      MOCK_ALL_ATTENDEES[2],
      MOCK_ALL_ATTENDEES[6],
      MOCK_ALL_ATTENDEES[7],
      MOCK_ALL_ATTENDEES[8]
    ]
  },
  {
    id: 'g2',
    name: '高管协调与决策委员会',
    count: 4,
    members: [
      MOCK_ALL_ATTENDEES[3],
      MOCK_ALL_ATTENDEES[4],
      MOCK_ALL_ATTENDEES[5],
      MOCK_ALL_ATTENDEES[10]
    ]
  },
  {
    id: 'g3',
    name: '视频会议与通信支撑组',
    count: 5,
    members: [
      MOCK_ALL_ATTENDEES[3],
      MOCK_ALL_ATTENDEES[7],
      MOCK_ALL_ATTENDEES[9],
      MOCK_ALL_ATTENDEES[1],
      MOCK_ALL_ATTENDEES[0]
    ]
  }
];

// 星网信通 部门架构数据
const XINGWANG_DEPARTMENTS: AttendeeDepartment[] = [
  {
    id: 'xw_d1',
    name: '1总裁办',
    count: 4,
    members: [
      { id: 'xw_m1', name: '芦丽云', title: '总裁', department: '1总裁办', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80' },
      { id: 'xw_m2', name: '石梁雅', title: '总经理', department: '1总裁办', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
      { id: 'xw_m3', name: '董巧琬', title: '副总经理', department: '1总裁办', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
      { id: 'xw_m4', name: '张助理', title: '行政主管', department: '1总裁办', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' }
    ]
  },
  {
    id: 'xw_d2',
    name: '2财务部',
    count: 10,
    members: [
      MOCK_ALL_ATTENDEES[5], // 官文
      MOCK_ALL_ATTENDEES[11], // 全刚保
      MOCK_ALL_ATTENDEES[12]  // 法山娣
    ]
  },
  {
    id: 'xw_d3',
    name: '3经营管理部',
    count: 13,
    members: [
      MOCK_ALL_ATTENDEES[4], // 董巧琬
      MOCK_ALL_ATTENDEES[10] // 越秋
    ]
  },
  {
    id: 'xw_d4',
    name: '4通信解决方案部',
    count: 14,
    members: [
      MOCK_ALL_ATTENDEES[3], // 石梁雅
      MOCK_ALL_ATTENDEES[7], // 王沣
      MOCK_ALL_ATTENDEES[10] // 越秋
    ]
  },
  {
    id: 'xw_d5',
    name: '5综合解决方案部',
    count: 8,
    members: [
      MOCK_ALL_ATTENDEES[7],
      MOCK_ALL_ATTENDEES[8]
    ]
  },
  {
    id: 'xw_d6',
    name: '6系统集成总部',
    count: 67,
    members: [
      MOCK_ALL_ATTENDEES[1],
      MOCK_ALL_ATTENDEES[2],
      MOCK_ALL_ATTENDEES[0]
    ]
  },
  {
    id: 'xw_d7',
    name: '7质量管理部',
    count: 18,
    members: [
      MOCK_ALL_ATTENDEES[8], // 陈鹏
      MOCK_ALL_ATTENDEES[9]  // 雷奇
    ]
  },
  {
    id: 'xw_d8',
    name: '8融合指挥研发部',
    count: 65,
    members: [
      MOCK_ALL_ATTENDEES[3], // 石梁雅
      MOCK_ALL_ATTENDEES[4], // 董巧琬
      MOCK_ALL_ATTENDEES[5], // 官文
      MOCK_ALL_ATTENDEES[10], // 越秋
      MOCK_ALL_ATTENDEES[11], // 全刚保
      MOCK_ALL_ATTENDEES[12], // 法山娣
      MOCK_ALL_ATTENDEES[6]   // 李树洁
    ]
  },
  {
    id: 'xw_d9',
    name: '9智能客服研发部',
    count: 73,
    members: [
      MOCK_ALL_ATTENDEES[9],
      MOCK_ALL_ATTENDEES[1]
    ]
  }
];

// 广新集团 部门架构数据
const GUANGXIN_DEPARTMENTS: AttendeeDepartment[] = [
  {
    id: 'gx_d1',
    name: '集团总部战略发展部',
    count: 12,
    members: [
      { id: 'gx_m1', name: '黄总监', title: '战略总监', department: '战略发展部', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
      { id: 'gx_m2', name: '林主管', title: '投资规划', department: '战略发展部', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80' }
    ]
  },
  {
    id: 'gx_d2',
    name: '华南区域运营中心',
    count: 24,
    members: [
      { id: 'gx_m3', name: '陈区域总', title: '大区总经理', department: '华南区域运营中心', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
      { id: 'gx_m4', name: '吴经理', title: '项目运营', department: '华南区域运营中心', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' }
    ]
  }
];

export const SelectAttendeesPage: React.FC<SelectAttendeesPageProps> = ({
  selectedAttendees,
  onConfirm,
  onCancel
}) => {
  // 当前选中的人员列表
  const [selectedList, setSelectedList] = useState<AttendeePerson[]>(selectedAttendees || []);

  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 页面层级导航: 'root' | 'groups' | 'group_members' | 'company' | 'dept_members'
  const [navPath, setNavPath] = useState<string>('root');
  const [currentCompany, setCurrentCompany] = useState<'星网信通' | '广新集团'>('星网信通');
  const [activeGroup, setActiveGroup] = useState<AttendeeGroup | null>(null);
  const [activeDept, setActiveDept] = useState<AttendeeDepartment | null>(null);

  // 是否弹出“已选择”列表弹层 (对应原型图3)
  const [showSelectedSheet, setShowSelectedSheet] = useState<boolean>(false);

  // 辅助Map以便快速判断选中
  const selectedMap = useMemo(() => {
    const map = new Map<string, AttendeePerson>();
    selectedList.forEach(p => map.set(p.id, p));
    return map;
  }, [selectedList]);

  // 切换人员勾选状态
  const handleTogglePerson = (person: AttendeePerson) => {
    if (selectedMap.has(person.id)) {
      setSelectedList(prev => prev.filter(p => p.id !== person.id));
    } else {
      setSelectedList(prev => [...prev, person]);
    }
  };

  // 移除指定人员
  const handleRemovePerson = (personId: string) => {
    setSelectedList(prev => prev.filter(p => p.id !== personId));
  };

  // 切换部门全选
  const handleToggleDeptAll = (dept: AttendeeDepartment) => {
    if (!dept.members || dept.members.length === 0) return;
    const allSelected = dept.members.every(m => selectedMap.has(m.id));
    if (allSelected) {
      const deptMemberIds = new Set(dept.members.map(m => m.id));
      setSelectedList(prev => prev.filter(p => !deptMemberIds.has(p.id)));
    } else {
      const missingMembers = dept.members.filter(m => !selectedMap.has(m.id));
      setSelectedList(prev => [...prev, ...missingMembers]);
    }
  };

  // 返回上一级
  const handleGoBack = () => {
    if (navPath === 'dept_members') {
      setNavPath('company');
    } else if (navPath === 'company') {
      setNavPath('root');
    } else if (navPath === 'group_members') {
      setNavPath('groups');
    } else if (navPath === 'groups') {
      setNavPath('root');
    } else {
      onCancel();
    }
  };

  // 全局搜索匹配过滤
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    return MOCK_ALL_ATTENDEES.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.department && p.department.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const departmentsList = currentCompany === '星网信通' ? XINGWANG_DEPARTMENTS : GUANGXIN_DEPARTMENTS;

  return (
    <div className="fixed inset-0 z-50 app-plan-query-page-bg flex flex-col select-none overflow-hidden animate-fade-in font-sans">
      {/* 顶部导航 Header (对照原型图2) */}
      <div className="px-2 py-3 bg-transparent flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={handleGoBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          {navPath === 'root'
            ? '选择群聊人员'
            : navPath === 'groups'
            ? '我的群组'
            : navPath === 'group_members'
            ? activeGroup?.name || '群组成员'
            : navPath === 'company'
            ? currentCompany
            : activeDept?.name || '部门人员'}
        </h1>

        <div className="w-8" />
      </div>

      {/* 搜索框 (对照原型图2) */}
      <div className="px-2 pt-3 pb-2 bg-transparent">
        <div className="app-search-shell">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索"
            className="app-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 主体滚动内容区 */}
      <div className="flex-1 overflow-y-auto px-2 pb-28 space-y-2">
        {/* 如果正在搜索，优先展示搜索结果 */}
        {searchResults !== null ? (
          <div>
            <p className="text-[12px] font-medium text-slate-400 px-1 mb-2">
              搜索结果 ({searchResults.length})
            </p>
            <div className="app-card p-3 divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-[14px]">
                  未找到匹配的联系人
                </div>
              ) : (
                searchResults.map(person => {
                  const isChecked = selectedMap.has(person.id);
                  return (
                    <div
                      key={person.id}
                      onClick={() => handleTogglePerson(person)}
                      className="flex items-center gap-3.5 py-3 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>

                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover shadow-2xs"
                      />

                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[15px] font-medium text-slate-900 truncate">
                          {person.name}
                        </span>
                        {person.title && (
                          <span className="text-[12px] text-slate-400 truncate">
                            {person.title} · {person.department || '综合部'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <>
            {/* ---------------- 视图 1: 根视图 (我的群组 / 企业通讯录 / 最近联系人) ---------------- */}
            {navPath === 'root' && (
              <>
                {/* 分组与通讯录入口卡片 (对照原型图2) */}
                <div className="app-card p-3 space-y-2">
                  {/* 我的群组 */}
                  <div
                    onClick={() => setNavPath('groups')}
                    className="flex items-center justify-between py-2 px-1 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-xs">
                        <Users className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-[15px] font-bold text-slate-900">
                        我的群组
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>

                  {/* 企业通讯录 */}
                  <div className="pt-1">
                    <div className="flex items-center gap-3 py-1 px-1">
                      <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-xs">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-[15px] font-bold text-slate-900">
                        企业通讯录
                      </span>
                    </div>

                    {/* 下属公司分支 */}
                    <div className="pl-6 pt-1 space-y-1.5">
                      {/* 星网信通 */}
                      <div
                        onClick={() => {
                          setCurrentCompany('星网信通');
                          setNavPath('company');
                        }}
                        className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-mono text-sm">└</span>
                          <span className="text-[14px] font-medium text-slate-800">
                            星网信通
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>

                      {/* 广新集团 */}
                      <div
                        onClick={() => {
                          setCurrentCompany('广新集团');
                          setNavPath('company');
                        }}
                        className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-mono text-sm">└</span>
                          <span className="text-[14px] font-medium text-slate-800">
                            广新集团
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 最近联系人列表 (对照原型图2) */}
                <div className="pt-2">
                  <p className="text-[12px] font-medium text-slate-400 px-1 mb-2">
                    最近联系人
                  </p>

                  <div className="app-card p-3 divide-y divide-slate-100">
                    {RECENT_LIST.map(contact => {
                      const isChecked = selectedMap.has(contact.id);
                      return (
                        <div
                          key={contact.id}
                          onClick={() => handleTogglePerson(contact)}
                          className="flex items-center gap-3.5 py-3 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                        >
                          {/* 勾选框 */}
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </div>

                          {/* 头像 */}
                          <img
                            src={contact.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover shadow-2xs"
                          />

                          {/* 姓名与职位 */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[15px] font-medium text-slate-900 truncate">
                              {contact.name}
                            </span>
                            {contact.title && (
                              <span className="text-[12px] text-slate-400 truncate">
                                {contact.title}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ---------------- 视图 2: 我的群组列表 ---------------- */}
            {navPath === 'groups' && (
              <div>
                <p className="text-[12px] font-medium text-slate-400 px-1 mb-2">
                  全部群组 ({GROUPS_DATA.length})
                </p>

                <div className="app-card p-3 divide-y divide-slate-100">
                  {GROUPS_DATA.map(group => (
                    <div
                      key={group.id}
                      onClick={() => {
                        setActiveGroup(group);
                        setNavPath('group_members');
                      }}
                      className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[15px] font-medium text-slate-900 block">
                            {group.name}
                          </span>
                          <span className="text-[12px] text-slate-400">
                            {group.count} 位成员
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------- 视图 3: 群组成员列表 ---------------- */}
            {navPath === 'group_members' && activeGroup && (
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <p className="text-[12px] font-medium text-[#0070f3]">
                    {activeGroup.name} · {activeGroup.members.length}人
                  </p>
                  <button
                    onClick={() => {
                      const allSelected = activeGroup.members.every(m => selectedMap.has(m.id));
                      if (allSelected) {
                        const ids = new Set(activeGroup.members.map(m => m.id));
                        setSelectedList(prev => prev.filter(p => !ids.has(p.id)));
                      } else {
                        const missing = activeGroup.members.filter(m => !selectedMap.has(m.id));
                        setSelectedList(prev => [...prev, ...missing]);
                      }
                    }}
                    className="text-[12px] text-[#0070f3] font-medium hover:underline cursor-pointer"
                  >
                    {activeGroup.members.every(m => selectedMap.has(m.id)) ? '取消全选' : '本群全选'}
                  </button>
                </div>

                <div className="app-card p-3 divide-y divide-slate-100">
                  {activeGroup.members.map(member => {
                    const isChecked = selectedMap.has(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleTogglePerson(member)}
                        className="flex items-center gap-3.5 py-3 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>

                        <img
                          src={member.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shadow-2xs"
                        />

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[15px] font-bold text-slate-900">
                            {member.name}
                          </span>
                          {member.title && (
                            <span className="text-[12px] text-slate-400 truncate">
                              {member.title}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- 视图 4: 企业部门列表 (星网信通 / 广新集团) ---------------- */}
            {navPath === 'company' && (
              <div>
                <p className="text-[12px] font-medium text-slate-400 px-1 mb-2">
                  {currentCompany} 组织架构
                </p>

                <div className="app-card p-3 divide-y divide-slate-100">
                  {departmentsList.map(dept => {
                    const deptMemberIds = dept.members.map(m => m.id);
                    const isChecked =
                      deptMemberIds.length > 0 &&
                      deptMemberIds.every(id => selectedMap.has(id));

                    return (
                      <div
                        key={dept.id}
                        onClick={() => {
                          setActiveDept(dept);
                          setNavPath('dept_members');
                        }}
                        className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {/* 部门全选 Checkbox */}
                          <div
                            onClick={e => {
                              e.stopPropagation();
                              handleToggleDeptAll(dept);
                            }}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </div>

                          <span className="text-[15px] font-medium text-slate-900">
                            {dept.name}{' '}
                            <span className="text-slate-400 font-normal">
                              ({dept.count}人)
                            </span>
                          </span>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- 视图 5: 部门人员明细列表 ---------------- */}
            {navPath === 'dept_members' && activeDept && (
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <p className="text-[12px] font-medium text-[#0070f3] flex items-center gap-1">
                    <span>{currentCompany}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-500">{activeDept.name}</span>
                  </p>

                  <button
                    onClick={() => handleToggleDeptAll(activeDept)}
                    className="text-[12px] text-[#0070f3] font-medium hover:underline cursor-pointer"
                  >
                    {activeDept.members.every(m => selectedMap.has(m.id)) ? '取消全选' : '本部门全选'}
                  </button>
                </div>

                <div className="app-card p-3 divide-y divide-slate-100">
                  {activeDept.members.map(member => {
                    const isChecked = selectedMap.has(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleTogglePerson(member)}
                        className="flex items-center gap-3.5 py-3 px-2 hover:bg-slate-50 active:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>

                        <img
                          src={member.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shadow-2xs"
                        />

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[15px] font-bold text-slate-900">
                            {member.name}
                          </span>
                          {member.title && (
                            <span className="text-[12px] text-slate-400 truncate">
                              {member.title}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部固定栏: 已选择数量与确定按钮 (对照原型图2) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between max-w-md mx-auto z-30 shadow-lg">
        {/* 点击“已选择”区域触发弹出已选列表 (支持点击触发) */}
        <button
          type="button"
          onClick={() => setShowSelectedSheet(true)}
          className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg hover:bg-slate-100 active:scale-95 transition-all text-left cursor-pointer group"
        >
          <span className="text-[14px] text-slate-700 font-medium group-hover:text-blue-600">
            已选择:{' '}
            <span className="text-[#0070f3] font-bold text-[16px]">
              {selectedList.length}
            </span>{' '}
            <span className="text-slate-400 font-normal">/ 1000</span>
          </span>
          <span className="text-[11px] text-[#0070f3] bg-blue-50 px-1.5 py-0.5 rounded font-medium border border-blue-100 group-hover:bg-blue-100">
            查看
          </span>
        </button>

        {/* 确定按钮 */}
        <button
          type="button"
          onClick={() => onConfirm(selectedList)}
          className="bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white text-[15px] font-bold px-7 py-2.5 rounded-[10px] transition-all shadow-xs cursor-pointer"
        >
          确定
        </button>
      </div>

      {/* ---------------- 弹窗: 已选择人员列表 Sheet / Modal (对照原型图3: 8-消息-发起群聊-选择联系人（组织架构）-已选择.png) ---------------- */}
      {showSelectedSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
          <div className="w-full max-w-md app-bottom-sheet overflow-hidden shadow-2xl flex flex-col max-h-[85vh] h-[580px] animate-slide-up">
            {/* Header: 已选择 (3) 与 确定 (对照图3) */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 relative">
              <div className="w-12">
                <button
                  onClick={() => setShowSelectedSheet(false)}
                  className="text-[15px] text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  关闭
                </button>
              </div>

              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight text-center">
                已选择 ({selectedList.length})
              </h2>

              <button
                onClick={() => {
                  setShowSelectedSheet(false);
                  onConfirm(selectedList);
                }}
                className="text-[15px] text-[#0070f3] font-bold hover:text-blue-700 cursor-pointer text-right w-12"
              >
                确定
              </button>
            </div>

            {/* 已选人员列表 (对照图3: 头像 + 姓名 + 职位 + 右侧圆形 (X) 移除按钮) */}
            <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-slate-100">
              {selectedList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                  <Users className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                  <p className="text-[14px]">暂无已选参会人员</p>
                  <p className="text-[12px] text-slate-300 mt-1">
                    请在通讯录或群组中勾选人员
                  </p>
                </div>
              ) : (
                selectedList.map(person => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 transition-colors"
                  >
                    {/* 左侧头像与姓名职位 */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-11 h-11 rounded-full object-cover shadow-2xs border border-slate-100 shrink-0"
                      />

                      <div className="flex flex-col min-w-0">
                        <span className="text-[15px] font-bold text-slate-900 truncate">
                          {person.name}
                        </span>
                        <span className="text-[13px] text-slate-400 truncate mt-0.5">
                          {person.title || person.department || '员工'}
                        </span>
                      </div>
                    </div>

                    {/* 右侧灰色圆形 (X) 移除按钮 (对照图3) */}
                    <button
                      onClick={() => handleRemovePerson(person.id)}
                      className="p-1.5 text-slate-300 hover:text-slate-500 active:scale-90 transition-all cursor-pointer rounded-full"
                      title="移除"
                    >
                      <XCircle className="w-6 h-6 stroke-[1.8] text-slate-400 hover:text-slate-600" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 底部快捷清空/完成栏 */}
            {selectedList.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedList([])}
                  className="text-[13px] text-rose-500 hover:text-rose-600 font-medium px-2 py-1 cursor-pointer"
                >
                  清空已选
                </button>
                <button
                  onClick={() => setShowSelectedSheet(false)}
                  className="px-5 py-2 bg-[#0070f3] text-white text-[14px] font-bold rounded-lg cursor-pointer"
                >
                  完成
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
