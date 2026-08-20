import { ContactItem } from '../types';

export interface EnterpriseMember extends ContactItem {
  company?: string;
  departmentId: string;
}

export interface EnterpriseDepartment {
  id: string;
  name: string;
  memberCount: number;
  companyName: string;
  members: EnterpriseMember[];
}

export interface EnterpriseCompany {
  id: string;
  name: string;
  shortName: string;
  fullName: string;
  departments: EnterpriseDepartment[];
}

export const mockEnterpriseData: EnterpriseCompany = {
  id: 'comp_1',
  name: '深圳市星网信通科技有限公司',
  shortName: '星网信通',
  fullName: '广东省广新控股集团有限公司',
  departments: [
    {
      id: 'dept_dsh',
      name: '董事会',
      memberCount: 9,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_dsh_1',
          name: '石梁雅',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          phone: '13812345610',
          email: 'shiliangya@example.com',
          department: '董事会',
          departmentId: 'dept_dsh',
          role: '董事长',
          gender: '男',
          status: '在线',
          nativePlace: '广东 广州'
        },
        {
          id: 'mbr_dsh_2',
          name: '董巧琬',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          phone: '14938770337',
          email: 'dongqiaowan@example.com',
          department: '董事会',
          departmentId: 'dept_dsh',
          role: '副董事长 / 副总经理',
          gender: '女',
          status: '在线',
          nativePlace: '广东 深圳'
        },
        {
          id: 'mbr_dsh_3',
          name: '赵国庆',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          phone: '13900112233',
          email: 'zhao@example.com',
          department: '董事会',
          departmentId: 'dept_dsh',
          role: '执行董事',
          gender: '男',
          status: '在线'
        },
        {
          id: 'mbr_dsh_4',
          name: '钱学锋',
          avatar: '',
          phone: '13900112234',
          email: 'qian@example.com',
          department: '董事会',
          departmentId: 'dept_dsh',
          role: '独立董事',
          gender: '男',
          status: '离线'
        },
        {
          id: 'mbr_dsh_5',
          name: '孙敏',
          avatar: '',
          phone: '13900112235',
          email: 'sun@example.com',
          department: '董事会',
          departmentId: 'dept_dsh',
          role: '董事会秘书',
          gender: '女',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_cwb',
      name: '财务部',
      memberCount: 8,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_cwb_1',
          name: '石梁雅',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          phone: '13812345610',
          email: 'shiliangya@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '总经理',
          gender: '男',
          status: '在线',
          nativePlace: '广东 广州'
        },
        {
          id: 'mbr_cwb_2',
          name: '董巧琬',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          phone: '14938770337',
          email: 'dongqiaowan@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '副总经理',
          gender: '女',
          status: '在线',
          nativePlace: '广东 深圳'
        },
        {
          id: 'mbr_cwb_3',
          name: '官文',
          avatar: '',
          phone: '13922334455',
          email: 'guanwen@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '会计',
          gender: '男',
          status: '在线'
        },
        {
          id: 'mbr_cwb_4',
          name: '越秋',
          avatar: '',
          phone: '13933445566',
          email: 'yueqiu@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '会计',
          gender: '男',
          status: '在线'
        },
        {
          id: 'mbr_cwb_5',
          name: '禹爱',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          phone: '13944556677',
          email: 'yuai@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '会计',
          gender: '男',
          status: '在线'
        },
        {
          id: 'mbr_cwb_6',
          name: '后彬先',
          avatar: '',
          phone: '13955667788',
          email: 'houbinxian@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '会计',
          gender: '男',
          status: '在线'
        },
        {
          id: 'mbr_cwb_7',
          name: '全刚保',
          avatar: '',
          phone: '13966778899',
          email: 'quangangbao@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '会计',
          gender: '男',
          status: '离线'
        },
        {
          id: 'mbr_cwb_8',
          name: '法山娣',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          phone: '13977889900',
          email: 'fashandi@example.com',
          department: '财务部',
          departmentId: 'dept_cwb',
          role: '会计',
          gender: '女',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_jyglb',
      name: '经营管理部',
      memberCount: 12,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_jy_1',
          name: '拓晓',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          phone: '13812345620',
          email: 'tuoxiao@example.com',
          department: '经营管理部',
          departmentId: 'dept_jyglb',
          role: '部门经理',
          gender: '男',
          status: '在线'
        },
        {
          id: 'mbr_jy_2',
          name: '斯璐悦',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          phone: '13812345621',
          email: 'siluyue@example.com',
          department: '经营管理部',
          departmentId: 'dept_jyglb',
          role: '运营主管',
          gender: '女',
          status: '在线'
        },
        {
          id: 'mbr_jy_3',
          name: '殷霭东',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          phone: '13812345622',
          email: 'yinaidong@example.com',
          department: '经营管理部',
          departmentId: 'dept_jyglb',
          role: '经营分析师',
          gender: '男',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_zlglb',
      name: '质量管理部',
      memberCount: 23,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_zl_1',
          name: '饶韵',
          avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
          phone: '13812345630',
          email: 'raoyun@example.com',
          department: '质量管理部',
          departmentId: 'dept_zlglb',
          role: '质量总监',
          gender: '女',
          status: '在线'
        },
        {
          id: 'mbr_zl_2',
          name: '蒙浩',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
          phone: '13812345631',
          email: 'menghao@example.com',
          department: '质量管理部',
          departmentId: 'dept_zlglb',
          role: 'QA主管',
          gender: '男',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_rjtx',
      name: '软件及通信解决方案部',
      memberCount: 17,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_rj_1',
          name: '李树洁',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          phone: '13812345601',
          email: 'lishujie@example.com',
          department: '软件及通信解决方案部',
          departmentId: 'dept_rjtx',
          role: '首席架构师',
          gender: '女',
          status: '在线'
        },
        {
          id: 'mbr_rj_2',
          name: '李玉',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          phone: '13812345602',
          email: 'liyu@example.com',
          department: '软件及通信解决方案部',
          departmentId: 'dept_rjtx',
          role: '高级开发工程师',
          gender: '男',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_zhjjfa',
      name: '综合解决方案部',
      memberCount: 5,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_zh_1',
          name: '裴莎',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          phone: '13812345640',
          email: 'peisha@example.com',
          department: '综合解决方案部',
          departmentId: 'dept_zhjjfa',
          role: '方案总监',
          gender: '女',
          status: '在线'
        },
        {
          id: 'mbr_zh_2',
          name: '佘狐克秋',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
          phone: '13812345641',
          email: 'shehu@example.com',
          department: '综合解决方案部',
          departmentId: 'dept_zhjjfa',
          role: '咨询顾问',
          gender: '女',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_cwb_2',
      name: '财务部 (二处)',
      memberCount: 9,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_cwb2_1',
          name: '常琼艳',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          phone: '13812345650',
          email: 'chang@example.com',
          department: '财务部 (二处)',
          departmentId: 'dept_cwb_2',
          role: '财务经理',
          gender: '女',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_scyyb',
      name: '生产运营部',
      memberCount: 12,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_sc_1',
          name: '王勇',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          phone: '13812345660',
          email: 'wangyong@example.com',
          department: '生产运营部',
          departmentId: 'dept_scyyb',
          role: '运营主管',
          gender: '男',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_khfwb',
      name: '客户服务部',
      memberCount: 23,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_kh_1',
          name: '汪红和',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
          phone: '13812345670',
          email: 'wanghonghe@example.com',
          department: '客户服务部',
          departmentId: 'dept_khfwb',
          role: '服务经理',
          gender: '男',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_yfcx',
      name: '研发中心',
      memberCount: 17,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_yf_1',
          name: '荆宁若',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          phone: '13812345680',
          email: 'jingningruo@example.com',
          department: '研发中心',
          departmentId: 'dept_yfcx',
          role: '研发总监',
          gender: '女',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_aqjcb',
      name: '安全监察部',
      memberCount: 5,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_aq_1',
          name: '褚霞哲',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
          phone: '13812345690',
          email: 'chuxiazhe@example.com',
          department: '安全监察部',
          departmentId: 'dept_aqjcb',
          role: '安全总监',
          gender: '男',
          status: '在线'
        }
      ]
    },
    {
      id: 'dept_xzrlb',
      name: '行政人力资源部',
      memberCount: 5,
      companyName: '深圳市星网信通科技有限公司',
      members: [
        {
          id: 'mbr_xz_1',
          name: '谷菲婷',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
          phone: '13812345699',
          email: 'gufeiting@example.com',
          department: '行政人力资源部',
          departmentId: 'dept_xzrlb',
          role: '人事主管',
          gender: '女',
          status: '在线'
        }
      ]
    }
  ]
};
