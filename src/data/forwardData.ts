export interface ForwardTargetItem {
  id: string;
  name: string;
  avatar: string;
  avatarType?: 'image' | 'grid' | 'custom';
  gridAvatars?: string[];
  department?: string;
  role?: string;
  memberCount?: number;
  isGroup?: boolean;
  matchSnippet?: string;
}

export interface DepartmentNode {
  id: string;
  name: string;
  memberCount: number;
  members: ForwardTargetItem[];
}

export interface GroupNode {
  id: string;
  name: string;
  memberCount: number;
  avatar?: string;
  gridAvatars?: string[];
  members: ForwardTargetItem[];
}

// 1. 最近转发 (Recent Forwarded)
export const mockRecentForwarded: ForwardTargetItem[] = [
  {
    id: 'rf_1',
    name: '殷霭东',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '高级架构师',
    department: '技术研发部'
  },
  {
    id: 'rf_2',
    name: '拓晓',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '产品经理',
    department: '产品规划部'
  },
  {
    id: 'rf_3',
    name: '斯璐悦',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '交互设计师',
    department: '体验设计部'
  },
  {
    id: 'rf_4',
    name: '胜利队羽毛球活动...',
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    memberCount: 12,
    isGroup: true
  },
  {
    id: 'rf_5',
    name: '蓝蓓春',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '运营专家',
    department: '市场运营部'
  }
];

// 2. 最近聊天 (Recent Chats)
export const mockRecentChats: ForwardTargetItem[] = [
  {
    id: 'rc_1',
    name: '客户沟通群',
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'
    ],
    memberCount: 9,
    isGroup: true
  },
  {
    id: 'rc_2',
    name: '业务沟通组',
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    memberCount: 9,
    isGroup: true
  },
  {
    id: 'rc_3',
    name: '蒙浩',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '一线执行人员',
    department: '广东省广新控股集团有限公司'
  },
  {
    id: 'rc_4',
    name: '孔眉鹏',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '项目总监',
    department: '星网信通信'
  },
  {
    id: 'rc_5',
    name: '羽毛球活动群',
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    memberCount: 16,
    isGroup: true
  },
  {
    id: 'rc_6',
    name: '邢韵',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '技术支持工程师',
    department: '广东省广新控股集团有限公司'
  },
  {
    id: 'rc_7',
    name: '洪和',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '客户顾问',
    department: '客户支持部'
  }
];

// 3. 通讯录一级页面 - 最近联系人
export const mockRecentContacts: ForwardTargetItem[] = [
  {
    id: 'cnt_chen',
    name: '陈海峰',
    avatar: '',
    avatarType: 'image',
    role: '副总指挥长',
    department: '应急指挥中心'
  },
  {
    id: 'cnt_1',
    name: '荆宁若',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '一线执行人员',
    department: '广东省广新控股集团有限公司'
  },
  {
    id: 'cnt_zhao',
    name: '赵立新',
    avatar: '',
    avatarType: 'image',
    role: '系统架构师',
    department: '数字化创新中心'
  },
  {
    id: 'cnt_2',
    name: '褚霞哲',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '一线执行人员',
    department: '广东省广新控股集团有限公司'
  },
  {
    id: 'cnt_zhou',
    name: '周明浩',
    avatar: '',
    avatarType: 'image',
    role: '物资调配主管',
    department: '应急保障部'
  },
  {
    id: 'cnt_david',
    name: 'David King',
    avatar: '',
    avatarType: 'image',
    role: '资深技术顾问',
    department: '国际技术合作部'
  },
  {
    id: 'cnt_3',
    name: '蒙浩',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '一线执行人员',
    department: '广东省广新控股集团有限公司'
  },
  {
    id: 'cnt_4',
    name: '饶韵',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '安全巡检员',
    department: '广东省广新控股集团有限公司'
  },
  {
    id: 'cnt_5',
    name: '佘狐克秋',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '物资协调员',
    department: '广东省广新控股集团有限公司'
  }
];

// 4. 通讯录标准成员池 (财务部 / 羽毛球群 / 我的关注 成员)
export const mockStandardMembers: ForwardTargetItem[] = [
  {
    id: 'mbr_1',
    name: '石梁雅',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '软件及通信解决方案部',
    department: '深圳市星网信通信科技有限公司'
  },
  {
    id: 'mbr_2',
    name: '董巧琬',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '副总经理',
    department: '深圳市星网信通信科技有限公司'
  },
  {
    id: 'mbr_3',
    name: '官文',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '会计',
    department: '财务部'
  },
  {
    id: 'mbr_4',
    name: '越秋',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '会计',
    department: '财务部'
  },
  {
    id: 'mbr_5',
    name: '禹爱',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '会计',
    department: '财务部'
  },
  {
    id: 'mbr_6',
    name: '后彬先',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '会计',
    department: '财务部'
  },
  {
    id: 'mbr_7',
    name: '全刚保',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '会计',
    department: '财务部'
  },
  {
    id: 'mbr_8',
    name: '法山娣',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '会计',
    department: '财务部'
  }
];

// 5. 组织机构各部门列表 (Departments)
export const mockDepartments: DepartmentNode[] = [
  {
    id: 'dept_1',
    name: '董事会',
    memberCount: 9,
    members: mockStandardMembers.slice(0, 5)
  },
  {
    id: 'dept_2',
    name: '财务部',
    memberCount: 8,
    members: mockStandardMembers
  },
  {
    id: 'dept_3',
    name: '经营管理部',
    memberCount: 12,
    members: mockStandardMembers.slice(1, 6)
  },
  {
    id: 'dept_4',
    name: '质量管理部',
    memberCount: 23,
    members: mockStandardMembers.slice(2, 7)
  },
  {
    id: 'dept_5',
    name: '软件及通信解决方案部',
    memberCount: 17,
    members: mockStandardMembers.slice(0, 4)
  },
  {
    id: 'dept_6',
    name: '综合解决方案部',
    memberCount: 5,
    members: mockStandardMembers.slice(3, 8)
  },
  {
    id: 'dept_7',
    name: '产品规划部',
    memberCount: 14,
    members: mockStandardMembers.slice(1, 5)
  }
];

// 6. 我的群组列表 (My Groups)
export const mockMyGroups: GroupNode[] = [
  {
    id: 'grp_1',
    name: '客户沟通群',
    memberCount: 9,
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'
    ],
    members: mockStandardMembers.slice(0, 5)
  },
  {
    id: 'grp_2',
    name: '业务沟通组',
    memberCount: 9,
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    members: mockStandardMembers.slice(1, 6)
  },
  {
    id: 'grp_3',
    name: '董事会会议群',
    memberCount: 4,
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    members: mockStandardMembers.slice(0, 4)
  },
  {
    id: 'grp_4',
    name: '羽毛球活动群',
    memberCount: 16,
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    members: mockStandardMembers
  },
  {
    id: 'grp_5',
    name: '会计群',
    memberCount: 9,
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'
    ],
    members: mockStandardMembers.slice(2, 8)
  }
];

// 7. 我的关注列表 (My Followed)
export const mockMyFollowed: ForwardTargetItem[] = mockStandardMembers.slice(0, 6);

// 8. 搜索用的全量人员与群组库 (Search Database)
export const mockSearchContacts: ForwardTargetItem[] = [
  {
    id: 'sch_c1',
    name: '李树洁',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '开发工程师',
    department: '应急指挥研发部-平台开发部'
  },
  {
    id: 'sch_c2',
    name: '李玉',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '开发工程师',
    department: '应急指挥研发部-平台开发部'
  },
  {
    id: 'sch_c3',
    name: '李彬浩',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '开发工程师',
    department: '应急指挥研发部-平台开发部'
  },
  {
    id: 'sch_c4',
    name: '李梅梅',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    avatarType: 'image',
    role: '产品经理',
    department: '应急指挥研发部'
  },
  ...mockStandardMembers,
  ...mockRecentContacts
];

export const mockSearchGroups: ForwardTargetItem[] = [
  {
    id: 'sch_g1',
    name: '业务沟通群',
    memberCount: 9,
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    isGroup: true,
    matchSnippet: '包含：李梅梅'
  },
  {
    id: 'sch_g2',
    name: '应急技术专家群',
    memberCount: 15,
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80'
    ],
    isGroup: true,
    matchSnippet: '包含：李树洁'
  },
  {
    id: 'sch_g3',
    name: '产品技术协同群',
    memberCount: 8,
    avatar: '',
    avatarType: 'grid',
    gridAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80'
    ],
    isGroup: true,
    matchSnippet: '包含：李玉'
  }
];
