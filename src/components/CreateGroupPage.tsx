import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Search,
  Plus,
  Minus,
  Users,
  Building2,
  ChevronRight,
  Check,
  X,
  XCircle,
  Minus as MinusIcon
} from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  title?: string;
  avatar: string;
  department?: string;
  phone?: string;
}

export interface OrgNode {
  id: string;
  name: string;
  count: number;
  children?: OrgNode[];
  members?: Contact[];
}

export interface CreateGroupPageProps {
  onBack: () => void;
  onCreateSuccess: (groupName: string, selectedMembersCount: number) => void;
}

// 当前登录用户 (管理员)
export const CURRENT_USER: Contact = {
  id: 'sys_admin',
  name: '系统管理员',
  title: '管理员',
  department: '广新集团 / 总指挥部',
  avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'
};

// 预置全部通讯录/成员库 (用于快速查找和生成)
export const ALL_MEMBERS_REPO: Contact[] = [
  CURRENT_USER,
  // 1总裁办 (4人)
  {
    id: 'm_ceo_1',
    name: '陈建国',
    title: '集团总裁',
    department: '1总裁办',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_ceo_2',
    name: '李慧',
    title: '执行副总裁',
    department: '1总裁办',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_ceo_3',
    name: '王雪助理',
    title: '总裁特助',
    department: '1总裁办',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_ceo_4',
    name: '张宇秘书',
    title: '机要秘书',
    department: '1总裁办',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },

  // 测试部门群 (1人)
  {
    id: 'm_test_1',
    name: '周建伟',
    title: '高级测试主管',
    department: '测试部门群',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },

  // cs1aaa (1人)
  {
    id: 'm_cs_1',
    name: '吴一凡',
    title: '客服系统运维专员',
    department: 'cs1aaa',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },

  // 2财务部 (10人)
  {
    id: 'm_fin_1',
    name: '官文',
    title: '财务部总经理',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_2',
    name: '全刚保',
    title: '资深会计师',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_3',
    name: '法山娣',
    title: '高级税务主管',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_4',
    name: '林婉莹',
    title: '资金出纳',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_5',
    name: '郑浩',
    title: '内部审计专家',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_6',
    name: '赵敏敏',
    title: '结算主管',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_7',
    name: '孙凯',
    title: '成本核算师',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_8',
    name: '钱雪',
    title: '财务专员',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_9',
    name: '冯涛',
    title: '预算管理专员',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_fin_10',
    name: '蒋丽',
    title: '报税分析师',
    department: '2财务部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },

  // 3经营管理部 (13人)
  {
    id: 'm_biz_1',
    name: '董巧琬',
    title: '经营管理部副总经理',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_2',
    name: '范志坚',
    title: '战略规划经理',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_3',
    name: '韩梅梅',
    title: '商务合同主管',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_4',
    name: '梁峰',
    title: '法务合规经理',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_5',
    name: '孙悦',
    title: '投资分析师',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_6',
    name: '沈波',
    title: '风险控制专员',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_7',
    name: '顾青',
    title: '运营统筹专员',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_8',
    name: '卢俊',
    title: '绩效管理专员',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_9',
    name: '曹颖',
    title: '业务督办专员',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_10',
    name: '魏明',
    title: '公共事务专员',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_11',
    name: '陶然',
    title: '合规审计员',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_12',
    name: '邹杰',
    title: '数据统计师',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_biz_13',
    name: '彭丽',
    title: '行政秘书',
    department: '3经营管理部',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },

  // 4通信解决方案部 (14人)
  {
    id: 'm_comm_1',
    name: '石梁雅',
    title: '部门总经理',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_2',
    name: '王沣',
    title: '首席通信工程师',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_3',
    name: '越秋',
    title: '副总经理',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_4',
    name: '邓超文',
    title: '5G融合调度专家',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_5',
    name: '汪海洋',
    title: '音视频编解码专家',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_6',
    name: '尤静',
    title: '网络架构师',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_7',
    name: '严明',
    title: '应急通信保障专员',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_8',
    name: '华雷',
    title: '无线射频专员',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_9',
    name: '舒敏',
    title: '光纤传输专家',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_10',
    name: '庞志远',
    title: '调度平台研发工程师',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_11',
    name: '薛强',
    title: '核心网技术顾问',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_12',
    name: '崔琳',
    title: '卫星应急通导专员',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_13',
    name: '焦阳',
    title: '微波通信专家',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_comm_14',
    name: '关月',
    title: '物联网协议支持专员',
    department: '4通信解决方案部',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },

  // 5综合解决方案部 (8人)
  {
    id: 'm_sol_1',
    name: '郑海东',
    title: '解决方案总监',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_2',
    name: '齐心',
    title: '售前咨询专家',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_3',
    name: '陆天宇',
    title: '智慧城市架构师',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_4',
    name: '谭晶',
    title: '应急管理规划师',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_5',
    name: '姜伟',
    title: '安防联动方案专家',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_6',
    name: '卞蓉',
    title: '工业互联网顾问',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_7',
    name: '盛凯',
    title: '技术文档与招投标主管',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sol_8',
    name: '鲍平',
    title: '方案交付专员',
    department: '5综合解决方案部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },

  // 6系统集成总部 (下属子部门)
  {
    id: 'm_sys_1',
    name: '何国栋',
    title: '集成总部总经理',
    department: '6系统集成总部',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sys_2',
    name: '肖鹏',
    title: '工程一部主管',
    department: '6系统集成总部 / 工程一部',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sys_3',
    name: '田雨',
    title: '工程二部主管',
    department: '6系统集成总部 / 工程二部',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_sys_4',
    name: '高健',
    title: '运维服务中心主任',
    department: '6系统集成总部 / 运维服务中心',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },

  // 7质量管理部 (18人)
  {
    id: 'm_qa_1',
    name: '陈鹏',
    title: '安全监督与质检总监',
    department: '7质量管理部',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_qa_2',
    name: '孙敏质检',
    title: 'QA品控主管',
    department: '7质量管理部',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_qa_3',
    name: '庄磊',
    title: '安全合规官',
    department: '7质量管理部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },

  // 8融合指挥研发部 (65人)
  {
    id: 'm_rd_0002',
    name: '员工0002',
    title: '系统架构工程师',
    department: '8融合指挥研发部 / 前端及终端研发组',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_rd_0001',
    name: '员工0001',
    title: '高级运维专家',
    department: '8融合指挥研发部 / 业务后台组',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_rd_003',
    name: '员工003',
    title: '技术主管',
    department: '8融合指挥研发部 / 音视频通信组',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_rd_lsj',
    name: '李树洁',
    title: '融合通信首席架构师',
    department: '8融合指挥研发部',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'
  },

  // 9智能客服研发部 (73人)
  {
    id: 'm_ai_lq',
    name: '雷奇',
    title: '应急响应与智能客服专员',
    department: '9智能客服研发部',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_ai_2',
    name: '章博',
    title: '大模型算法专家',
    department: '9智能客服研发部 / NLP算法组',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'm_ai_3',
    name: '刘雅婷',
    title: '知识图谱研发工程师',
    department: '9智能客服研发部 / 语料知识库组',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
  }
];

// 构建广新集团组织架构树 (完全匹配用户截图及各级节点)
export const GUANGXIN_GROUP_TREE: OrgNode = {
  id: 'root_gx',
  name: '广新集团',
  count: 220,
  children: [
    {
      id: 'd1',
      name: '1总裁办',
      count: 4,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '1总裁办')
    },
    {
      id: 'd2',
      name: '龙俊杰·两人公司',
      count: 0,
      members: []
    },
    {
      id: 'd3',
      name: '测试部门群',
      count: 1,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '测试部门群')
    },
    {
      id: 'd4',
      name: 'cs1aaa',
      count: 1,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === 'cs1aaa')
    },
    {
      id: 'd5',
      name: '2财务部',
      count: 10,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '2财务部')
    },
    {
      id: 'd6',
      name: '3经营管理部',
      count: 13,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '3经营管理部')
    },
    {
      id: 'd7',
      name: '4通信解决方案部',
      count: 14,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '4通信解决方案部')
    },
    {
      id: 'd8',
      name: '5综合解决方案部',
      count: 8,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '5综合解决方案部')
    },
    {
      id: 'd9',
      name: '6系统集成总部',
      count: 67,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '6系统集成总部'),
      children: [
        {
          id: 'd9_1',
          name: '工程一部',
          count: 22,
          members: [
            ALL_MEMBERS_REPO.find((m) => m.id === 'm_sys_2')!,
            {
              id: 'm_sys_eng_1',
              name: '宋明',
              title: '系统实施专员',
              department: '工程一部',
              avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
            },
            {
              id: 'm_sys_eng_2',
              name: '卢华',
              title: '现场安防技术员',
              department: '工程一部',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
            }
          ]
        },
        {
          id: 'd9_2',
          name: '工程二部',
          count: 25,
          members: [
            ALL_MEMBERS_REPO.find((m) => m.id === 'm_sys_3')!,
            {
              id: 'm_sys_eng2_1',
              name: '韩雷',
              title: '弱电智能化工程师',
              department: '工程二部',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
            }
          ]
        },
        {
          id: 'd9_3',
          name: '运维服务中心',
          count: 20,
          members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_sys_4')!]
        }
      ]
    },
    {
      id: 'd10',
      name: '7质量管理部',
      count: 18,
      members: ALL_MEMBERS_REPO.filter((m) => m.department === '7质量管理部')
    },
    {
      id: 'd11',
      name: '8融合指挥研发部',
      count: 65,
      members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_rd_lsj')!],
      children: [
        {
          id: 'd11_1',
          name: '前端及终端研发组',
          count: 18,
          members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_rd_0002')!]
        },
        {
          id: 'd11_2',
          name: '音视频通信研发组',
          count: 24,
          members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_rd_003')!]
        },
        {
          id: 'd11_3',
          name: '业务后台与分布式组',
          count: 23,
          members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_rd_0001')!]
        }
      ]
    },
    {
      id: 'd12',
      name: '9智能客服研发部',
      count: 73,
      members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_ai_lq')!],
      children: [
        {
          id: 'd12_1',
          name: 'NLP大模型算法组',
          count: 28,
          members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_ai_2')!]
        },
        {
          id: 'd12_2',
          name: '语料与知识图谱组',
          count: 20,
          members: [ALL_MEMBERS_REPO.find((m) => m.id === 'm_ai_3')!]
        }
      ]
    }
  ]
};

// 辅助函数：递归获取一个 OrgNode 下的所有人员列表
function getAllMembersInNode(node: OrgNode): Contact[] {
  let list: Contact[] = [];
  if (node.members && node.members.length > 0) {
    list = list.concat(node.members);
  }
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      list = list.concat(getAllMembersInNode(child));
    }
  }
  return list;
}

export const CreateGroupPage: React.FC<CreateGroupPageProps> = ({
  onBack,
  onCreateSuccess
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Contact[]>([CURRENT_USER]);
  const [isRemovingMode, setIsRemovingMode] = useState(false);

  // Sub-view flow: 'main' | 'picker'
  const [currentStep, setCurrentStep] = useState<'main' | 'picker'>('picker');

  // 组织架构路径面包屑堆栈（默认根节点：广新集团）
  const [navStack, setNavStack] = useState<OrgNode[]>([GUANGXIN_GROUP_TREE]);

  // 搜索关键词
  const [pickerSearch, setPickerSearch] = useState('');

  // 临时选中的成员 ID 列表
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([CURRENT_USER.id]);
  const [showSelectedSheet, setShowSelectedSheet] = useState<boolean>(false);

  // 全量联系人字典映射
  const allContactsMap = useMemo(() => {
    const map = new Map<string, Contact>();
    ALL_MEMBERS_REPO.forEach((m) => map.set(m.id, m));
    // 递归遍历树补充
    const traverse = (node: OrgNode) => {
      node.members?.forEach((m) => map.set(m.id, m));
      node.children?.forEach((child) => traverse(child));
    };
    traverse(GUANGXIN_GROUP_TREE);
    return map;
  }, []);

  // 当前所在组织节点
  const currentNode = navStack[navStack.length - 1];

  // 打开选人界面
  const handleOpenPicker = () => {
    setTempSelectedIds(selectedMembers.map((m) => m.id));
    setNavStack([GUANGXIN_GROUP_TREE]);
    setPickerSearch('');
    setCurrentStep('picker');
  };

  // 单选/反选单个人员
  const handleToggleContact = (contact: Contact) => {
    setTempSelectedIds((prev) =>
      prev.includes(contact.id)
        ? prev.filter((id) => id !== contact.id)
        : [...prev, contact.id]
    );
  };

  // 点击部门复选框：把该节点下的所有人员带入已选择列表；若已全选则取消全选
  const handleToggleNodeCheckbox = (node: OrgNode, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止进入下级节点
    const nodeMembers = getAllMembersInNode(node);
    if (nodeMembers.length === 0) return;

    const nodeMemberIds = nodeMembers.map((m) => m.id);
    const isAllSelected = nodeMemberIds.every((id) => tempSelectedIds.includes(id));

    if (isAllSelected) {
      // 取消选中该节点所有人员
      setTempSelectedIds((prev) => prev.filter((id) => !nodeMemberIds.includes(id)));
    } else {
      // 全选该节点下的所有人员带入已选择列表
      setTempSelectedIds((prev) => Array.from(new Set([...prev, ...nodeMemberIds])));
    }
  };

  // 点击列表项：进入下级节点或者人员列表
  const handleEnterNode = (node: OrgNode) => {
    // 无论是有 children 还是有 members，都可作为下级展开
    setNavStack((prev) => [...prev, node]);
    setPickerSearch('');
  };

  // 面包屑点击跳转到某一层
  const handleBreadcrumbClick = (index: number) => {
    setNavStack((prev) => prev.slice(0, index + 1));
    setPickerSearch('');
  };

  // 左上角“取消”/返回
  const handleCancelOrBack = () => {
    if (navStack.length > 1) {
      // 处于下级，返回上一级
      setNavStack((prev) => prev.slice(0, prev.length - 1));
    } else {
      // 处于根节点，退出选人器回到建群主页面或外部
      if (selectedMembers.length > 1 || groupName) {
        setCurrentStep('main');
      } else {
        onBack();
      }
    }
  };

  // 确认选人
  const handleConfirmPicker = () => {
    const newSelected: Contact[] = [];
    tempSelectedIds.forEach((id) => {
      const found = allContactsMap.get(id);
      if (found) newSelected.push(found);
    });

    setSelectedMembers(newSelected.length > 0 ? newSelected : [CURRENT_USER]);
    setShowSelectedSheet(false);
    setCurrentStep('main');
  };

  // 从已选列表中移除某人
  const handleRemoveTempMember = (memberId: string) => {
    setTempSelectedIds((prev) => prev.filter((id) => id !== memberId));
  };

  const handleRemoveMember = (memberId: string) => {
    if (memberId === CURRENT_USER.id) return;
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleSubmitGroup = () => {
    const finalName = groupName.trim() || '新建群聊';
    onCreateSuccess(finalName, selectedMembers.length);
  };

  // 计算某个节点的勾选状态：'checked' | 'indeterminate' | 'unchecked'
  const getNodeCheckState = (node: OrgNode): 'checked' | 'indeterminate' | 'unchecked' => {
    const members = getAllMembersInNode(node);
    if (members.length === 0) return 'unchecked';
    const memberIds = members.map((m) => m.id);
    const selectedCount = memberIds.filter((id) => tempSelectedIds.includes(id)).length;

    if (selectedCount === memberIds.length) return 'checked';
    if (selectedCount > 0) return 'indeterminate';
    return 'unchecked';
  };

  // 全局搜索匹配过滤（当有输入搜索内容时）
  const searchResults = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();
    if (!query) return null;

    const matchedMembers: Contact[] = [];
    const matchedNodes: OrgNode[] = [];

    // 搜索人员
    allContactsMap.forEach((contact) => {
      if (
        contact.name.toLowerCase().includes(query) ||
        (contact.department && contact.department.toLowerCase().includes(query)) ||
        (contact.title && contact.title.toLowerCase().includes(query))
      ) {
        matchedMembers.push(contact);
      }
    });

    // 递归搜索部门节点
    const searchNode = (node: OrgNode) => {
      if (node.name.toLowerCase().includes(query) && node.id !== 'root_gx') {
        matchedNodes.push(node);
      }
      node.children?.forEach((child) => searchNode(child));
    };
    searchNode(GUANGXIN_GROUP_TREE);

    return { matchedMembers, matchedNodes };
  }, [pickerSearch, allContactsMap]);

  // STEP 2: MEMBER PICKER SCREEN (完全对照用户需求与截图)
  if (currentStep === 'picker') {
    return (
      <div className="flex flex-col h-full app-plan-query-page-bg select-none relative">
        {/* Top Header Bar */}
        <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-transparent z-10">
          <button
            onClick={handleCancelOrBack}
            className="h-8 min-w-[56px] flex items-center justify-start rounded-full text-[14px] font-medium text-[#0070f3] hover:bg-blue-50 active:scale-95 transition-all"
          >
            {navStack.length > 1 ? (
              <span className="flex items-center gap-0.5 font-medium">
                <ChevronLeft className="w-5 h-5 -ml-1 stroke-[2.2]" />
                <span>返回</span>
              </span>
            ) : (
              <span>取消</span>
            )}
          </button>

          <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight leading-[22px]">
            选择群聊人员
          </h1>

          <div className="w-10" />
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-1 mb-2">
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              placeholder="搜索"
              className="w-full h-10 bg-white rounded-xl pl-9 pr-4 py-0 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-100/80 shadow-2xs focus:outline-none focus:border-blue-500 transition-colors"
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

        {/* Breadcrumb Path (面包屑层级导航) */}
        {!pickerSearch && (
          <div className="px-4 py-1.5 flex items-center flex-wrap gap-1 text-[13px] text-slate-500 overflow-x-auto">
            {navStack.map((item, index) => {
              const isLast = index === navStack.length - 1;
              return (
                <React.Fragment key={item.id}>
                  {index > 0 && <span className="text-slate-300 mx-0.5">&gt;</span>}
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    disabled={isLast}
                    className={`font-medium transition-colors ${
                      isLast
                        ? 'text-slate-700 font-semibold cursor-default'
                        : 'text-blue-600 hover:text-blue-700 hover:underline cursor-pointer'
                    }`}
                  >
                    {item.name}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Main List Area */}
        <div className="px-4 flex-1 overflow-y-auto pb-24 space-y-2.5">
          {/* SEARCH MODE */}
          {searchResults ? (
            <div className="bg-white rounded-[16px] p-2 shadow-2xs border border-slate-100/80 divide-y divide-slate-100/80">
              {searchResults.matchedNodes.length === 0 &&
              searchResults.matchedMembers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-[14px]">
                  未找到相关部门或人员
                </div>
              ) : (
                <>
                  {/* 匹配到的部门节点 */}
                  {searchResults.matchedNodes.map((node) => {
                    const checkState = getNodeCheckState(node);
                    return (
                      <div
                        key={node.id}
                        onClick={() => handleEnterNode(node)}
                        className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* 复选框 */}
                          <div
                            onClick={(e) => handleToggleNodeCheckbox(node, e)}
                            className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all cursor-pointer ${
                              checkState === 'checked'
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : checkState === 'indeterminate'
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : 'border-slate-300 bg-white hover:border-slate-400'
                            }`}
                          >
                            {checkState === 'checked' && (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                            {checkState === 'indeterminate' && (
                              <MinusIcon className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[16px] font-normal text-slate-900">
                              {node.name}
                            </span>
                            <span className="text-[14px] text-slate-400">
                              ({node.count}人)
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      </div>
                    );
                  })}

                  {/* 匹配到的人员 */}
                  {searchResults.matchedMembers.map((member) => {
                    const isChecked = tempSelectedIds.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleToggleContact(member)}
                        className="flex items-center gap-3.5 py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                              : 'border-slate-300 bg-white hover:border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>

                        <img
                          src={member.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shadow-2xs shrink-0"
                        />

                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-semibold text-slate-900 truncate">
                            {member.name}
                          </span>
                          <span className="text-[12px] text-slate-400 truncate">
                            {member.department || '广新集团'} · {member.title || '成员'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            /* NORMAL TREE HIERARCHY (广新集团及各级子部门) */
            <div className="bg-white rounded-[16px] p-2 shadow-2xs border border-slate-100/80 divide-y divide-slate-100/80">
              {/* 1. 下级子部门 / 节点列表 */}
              {currentNode.children && currentNode.children.length > 0 && (
                <>
                  {currentNode.children.map((childNode) => {
                    const checkState = getNodeCheckState(childNode);
                    return (
                      <div
                        key={childNode.id}
                        onClick={() => handleEnterNode(childNode)}
                        className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* 复选框: 点击只勾选人员，不进入下级 */}
                          <div
                            onClick={(e) => handleToggleNodeCheckbox(childNode, e)}
                            className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all cursor-pointer ${
                              checkState === 'checked'
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : checkState === 'indeterminate'
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : 'border-slate-300 bg-white hover:border-slate-400'
                            }`}
                            title={
                              checkState === 'checked'
                                ? '取消全选该部门'
                                : '全选该部门所有人员'
                            }
                          >
                            {checkState === 'checked' && (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                            {checkState === 'indeterminate' && (
                              <MinusIcon className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>

                          {/* 节点名称与人数 */}
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[16px] font-normal text-slate-900 group-hover:text-blue-600 transition-colors">
                              {childNode.name}
                            </span>
                            <span className="text-[14px] text-slate-400 font-normal">
                              ({childNode.count}人)
                            </span>
                          </div>
                        </div>

                        {/* 下级指示箭头 */}
                        <div className="flex items-center gap-1 text-slate-300 group-hover:text-slate-500 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* 2. 当前节点下的直接成员列表 */}
              {currentNode.members && currentNode.members.length > 0 && (
                <>
                  {currentNode.members.map((member) => {
                    const isChecked = tempSelectedIds.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleToggleContact(member)}
                        className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-[#0070f3] border-[#0070f3] text-white shadow-2xs'
                                : 'border-slate-300 bg-white hover:border-slate-400'
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>

                          {/* Avatar */}
                          <img
                            src={member.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover shadow-2xs shrink-0 border border-slate-100"
                          />

                          {/* Name & Title */}
                          <div className="flex flex-col min-w-0">
                            <span className="text-[15px] font-medium text-slate-900 truncate">
                              {member.name}
                            </span>
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

              {/* 空数据占位 */}
              {(!currentNode.children || currentNode.children.length === 0) &&
                (!currentNode.members || currentNode.members.length === 0) && (
                  <div className="py-12 text-center text-slate-400 text-[14px]">
                    该部门暂无下级节点或人员
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Bottom Bar: Selection Summary & Confirm Button (对照截图) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between z-20 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-[15px] text-slate-800 font-normal">
              已选择: <span className="text-[#0070f3] font-bold text-[17px]">{tempSelectedIds.length}</span> <span className="text-slate-400 font-normal text-[14px]">/ 1000</span>
            </span>
            <button
              type="button"
              onClick={() => setShowSelectedSheet(true)}
              className="text-[13px] text-[#0070f3] bg-blue-50 hover:bg-blue-100 active:scale-95 px-2 py-0.5 rounded font-normal transition-all cursor-pointer border border-blue-100"
            >
              查看
            </button>
          </div>

          <button
            onClick={handleConfirmPicker}
            className="bg-[#0070f3] hover:bg-blue-600 active:scale-95 text-white text-[15px] font-semibold px-7 py-2 rounded-xl transition-all shadow-xs"
          >
            确定
          </button>
        </div>

        {/* 已选择人员抽屉 / Modal */}
        {showSelectedSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-2xs animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-t-[20px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] h-[540px] animate-slide-up">
              {/* Header */}
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
                    handleConfirmPicker();
                  }}
                  className="text-[15px] text-[#0070f3] font-bold hover:text-blue-700 cursor-pointer"
                >
                  确定
                </button>
              </div>

              {/* Member List with delete icon */}
              <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-slate-100">
                {tempSelectedIds.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                    <Users className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                    <p className="text-[14px]">暂无已选人员</p>
                  </div>
                ) : (
                  tempSelectedIds.map((id) => {
                    const person = allContactsMap.get(id) || {
                      id,
                      name: id,
                      title: '成员',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    };

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
                              {person.department || '广新集团'} · {person.title || '成员'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveTempMember(id)}
                          className="p-1 text-slate-300 hover:text-rose-500 active:scale-90 transition-all cursor-pointer rounded-full"
                          title="移除"
                        >
                          <XCircle className="w-5 h-5 stroke-[1.8]" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom quick finish */}
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

  // STEP 1: CREATE GROUP FORM (群组创建主界面)
  return (
    <div className="flex flex-col h-full app-plan-query-page-bg select-none overflow-y-auto pb-24">
      {/* Navigation Top Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-transparent z-10">
        <button
          onClick={onBack}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>

        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
          创建群组
        </h1>

        <div className="w-8" />
      </div>

      <div className="px-4 mt-2 space-y-4 flex-1">
        {/* Card 1: 群组名称 Input */}
        <div className="bg-white rounded-[16px] px-4 py-3.5 shadow-2xs border border-slate-100/80 flex items-center justify-between">
          <span className="text-[15px] font-bold text-slate-900">群组名称</span>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="请输入"
            className="text-right text-[15px] text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent w-48 font-medium"
          />
        </div>

        {/* Card 2: 群组成员 Grid */}
        <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-slate-900">群组成员</span>
            <span className="text-[14px] text-slate-400 font-medium">
              {selectedMembers.length} 人
            </span>
          </div>

          {/* Member Avatars & Buttons Grid */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-1">
            {/* Selected Members */}
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center group relative"
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover shadow-2xs border border-slate-100"
                  />
                  {/* Remove Minus Badge when removing mode is active */}
                  {isRemovingMode && member.id !== CURRENT_USER.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xs active:scale-90 transition-transform"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  )}
                </div>
                <span className="text-[12px] font-medium text-slate-700 mt-1.5 max-w-[64px] truncate text-center">
                  {member.name}
                </span>
              </div>
            ))}

            {/* Plus Button (+) */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleOpenPicker}
                className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 active:scale-95 transition-all"
                title="添加成员"
              >
                <Plus className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Minus Button (-) */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsRemovingMode((prev) => !prev)}
                className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                  isRemovingMode
                    ? 'border-rose-500 text-rose-500 bg-rose-50'
                    : 'border-slate-300 text-slate-400 hover:border-slate-400 active:scale-95'
                }`}
                title="删除成员"
              >
                <Minus className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Blue Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleSubmitGroup}
          className="w-full bg-[#0070f3] hover:bg-blue-600 active:scale-[0.99] text-white text-[16px] font-bold py-3.5 rounded-[16px] transition-all shadow-md shadow-blue-500/20"
        >
          提交
        </button>
      </div>
    </div>
  );
};
