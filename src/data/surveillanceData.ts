export interface SurveillanceCamera {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  code: string;
  node: string;
  type: '枪机' | '球机' | '云台摄像机' | '半球摄像机';
  status: 'online' | 'warning' | 'offline'; // teal, orange, grey
  qualityRecent: string;
  qualityDuration: string;
  lat: number;
  lng: number;
  isFavorite?: boolean;
  isHistory?: boolean;
  isHotspot?: boolean;
  planIds?: string[];
  videoPoster: string;
  historyTime?: string;
}

export interface SurveillanceCity {
  id: string;
  name: string;
  count: number;
  districts: {
    id: string;
    name: string;
    count: number;
  }[];
}

export interface SurveillancePlan {
  id: string;
  name: string;
  count: number;
  category?: string;
}

export const SURVEILLANCE_CITIES: SurveillanceCity[] = [
  {
    id: 'gz',
    name: '广州市',
    count: 362,
    districts: [
      { id: 'gz-yx', name: '越秀区', count: 362 },
      { id: 'gz-hz', name: '海珠区', count: 362 },
      { id: 'gz-lw', name: '荔湾区', count: 362 },
      { id: 'gz-th', name: '天河区', count: 162 },
      { id: 'gz-by', name: '白云区', count: 127 },
      { id: 'gz-hp', name: '黄埔区', count: 227 },
      { id: 'gz-hd', name: '花都区', count: 362 },
      { id: 'gz-py', name: '番禺区', count: 227 },
      { id: 'gz-ns', name: '南沙区', count: 217 },
      { id: 'gz-zc', name: '增城区', count: 137 },
      { id: 'gz-ch', name: '从化区', count: 137 }
    ]
  },
  {
    id: 'sz',
    name: '深圳市',
    count: 362,
    districts: [
      { id: 'sz-ns', name: '南山区', count: 362 },
      { id: 'sz-ft', name: '福田区', count: 362 },
      { id: 'sz-ba', name: '宝安区', count: 362 },
      { id: 'sz-lh', name: '罗湖区', count: 162 },
      { id: 'sz-lg', name: '龙岗区', count: 227 },
      { id: 'sz-lh2', name: '龙华区', count: 180 },
      { id: 'sz-ps', name: '坪山区', count: 120 },
      { id: 'sz-gm', name: '光明区', count: 130 },
      { id: 'sz-yt', name: '盐田区', count: 98 },
      { id: 'sz-dp', name: '大鹏新区', count: 85 }
    ]
  },
  {
    id: 'zh',
    name: '珠海市',
    count: 362,
    districts: [
      { id: 'zh-xz', name: '香洲区', count: 210 },
      { id: 'zh-dw', name: '斗门区', count: 85 },
      { id: 'zh-jw', name: '金湾区', count: 67 }
    ]
  },
  {
    id: 'jm',
    name: '江门市',
    count: 162,
    districts: [
      { id: 'jm-pj', name: '蓬江区', count: 80 },
      { id: 'jm-jh', name: '江海区', count: 42 },
      { id: 'jm-xh', name: '新会区', count: 40 }
    ]
  },
  {
    id: 'st',
    name: '汕头市',
    count: 127,
    districts: [
      { id: 'st-jp', name: '金平区', count: 65 },
      { id: 'st-lj', name: '龙湖区', count: 62 }
    ]
  },
  {
    id: 'fs',
    name: '佛山市',
    count: 227,
    districts: [
      { id: 'fs-cc', name: '禅城区', count: 110 },
      { id: 'fs-nh', name: '南海区', count: 65 },
      { id: 'fs-sd', name: '顺德区', count: 52 }
    ]
  },
  {
    id: 'sg',
    name: '韶关市',
    count: 362,
    districts: [
      { id: 'sg-zj', name: '浈江区', count: 180 },
      { id: 'sg-wj', name: '武江区', count: 182 }
    ]
  },
  {
    id: 'hy',
    name: '河源市',
    count: 227,
    districts: [
      { id: 'hy-yc', name: '源城区', count: 227 }
    ]
  },
  {
    id: 'mz',
    name: '梅州市',
    count: 217,
    districts: [
      { id: 'mz-mj', name: '梅江区', count: 217 }
    ]
  },
  {
    id: 'hz',
    name: '惠州市',
    count: 137,
    districts: [
      { id: 'hz-hc', name: '惠城区', count: 85 },
      { id: 'hz-hy', name: '惠阳区', count: 52 }
    ]
  },
  {
    id: 'sw',
    name: '汕尾市',
    count: 137,
    districts: [
      { id: 'sw-sc', name: '城区', count: 137 }
    ]
  }
];

export const SURVEILLANCE_CUSTOM_DIRS = [
  { id: 'cd-1', name: '广州市应急管理综合目录 1L', count: 362 },
  { id: 'cd-2', name: '深圳市公共安全重点监控 1L', count: 362 },
  { id: 'cd-3', name: '珠海市口岸与边防监控 1L', count: 362 },
  { id: 'cd-4', name: '佛山市城市防汛排涝监控 1L', count: 227 },
  { id: 'cd-5', name: '东莞市工业园区安全视讯 1L', count: 362 }
];

export const SURVEILLANCE_PLANS: SurveillancePlan[] = [
  { id: 'plan-1', name: '防汛防风 I 级应急响应预案', count: 362, category: '自然灾害' },
  { id: 'plan-2', name: '突发公共卫生事件应急处置预案', count: 362, category: '公共卫生' },
  { id: 'plan-3', name: '交通枢纽大客流疏导管控预案', count: 362, category: '交通保障' },
  { id: 'plan-4', name: '城市内涝与地质灾害预警响应预案', count: 162, category: '自然灾害' },
  { id: 'plan-5', name: '危化品运输与仓储泄漏处置预案', count: 127, category: '安全生产' },
  { id: 'plan-6', name: '消防联动与疏散应急预案', count: 227, category: '消防救援' },
  { id: 'plan-7', name: '大型活动安保协同预案', count: 362, category: '社会治安' },
  { id: 'plan-8', name: '重点危险源监控防护预案', count: 227, category: '安全生产' }
];

// Curated Seed Cameras for multiple key districts (Matches 列表-区划 3.png)
export const SURVEILLANCE_CAMERAS: SurveillanceCamera[] = [
  // 1. 越秀区 Cameras (Matches 列表-区划 3.png)
  {
    id: 'cam-yx-1',
    name: '办公 A 区西北',
    address: '广州市越秀区东风中路238号大楼西北角',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000001',
    node: '广东省广州市越秀区',
    type: '枪机',
    status: 'online', // teal
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 23.1328,
    lng: 113.2681,
    isFavorite: false,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-2'],
    videoPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-12 15:30:22'
  },
  {
    id: 'cam-yx-2',
    name: '走廊东-东向',
    address: '广州市越秀区东风中路大楼A座东侧走廊',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000002',
    node: '广东省广州市越秀区',
    type: '枪机',
    status: 'online', // teal
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 23.1332,
    lng: 113.2688,
    isFavorite: false,
    isHistory: true,
    isHotspot: false,
    planIds: ['plan-1'],
    videoPoster: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-12 14:15:10'
  },
  {
    id: 'cam-yx-3',
    name: '走廊东-西向',
    address: '广州市越秀区东风中路大楼A座东走廊西向通道',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000003',
    node: '广东省广州市越秀区',
    type: '枪机',
    status: 'online', // teal
    qualityRecent: '标清',
    qualityDuration: '稳定',
    lat: 23.1335,
    lng: 113.2685,
    isFavorite: false,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-6'],
    videoPoster: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-12 11:20:05'
  },
  {
    id: 'cam-yx-4',
    name: '办公 A 区东',
    address: '广州市越秀区东风中路大楼东门大厅',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000004',
    node: '广东省广州市越秀区',
    type: '云台摄像机',
    status: 'warning', // orange
    qualityRecent: '速开设备',
    qualityDuration: '轻度丢包',
    lat: 23.1325,
    lng: 113.2695,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-12 10:05:44'
  },
  {
    id: 'cam-yx-5',
    name: '办公 A 区西北',
    address: '广州市越秀区东风中路大楼B2层通道',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000005',
    node: '广东省广州市越秀区',
    type: '枪机',
    status: 'warning', // orange
    qualityRecent: '低延迟',
    qualityDuration: '不稳定',
    lat: 23.1321,
    lng: 113.2678,
    isFavorite: false,
    isHistory: true,
    isHotspot: false,
    planIds: ['plan-6'],
    videoPoster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-11 18:22:30'
  },
  {
    id: 'cam-yx-6',
    name: '办公 A 区中控室',
    address: '广州市越秀区东风中路大楼3楼监控中心',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000006',
    node: '广东省广州市越秀区',
    type: '球机',
    status: 'warning', // orange
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 23.1338,
    lng: 113.2689,
    isFavorite: false,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-2', 'plan-5'],
    videoPoster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-11 16:40:12'
  },
  {
    id: 'cam-yx-7',
    name: '办公 A 区出入口',
    address: '广州市越秀区东风中路大楼车辆主闸口',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000007',
    node: '广东省广州市越秀区',
    type: '枪机',
    status: 'online', // teal
    qualityRecent: '车牌识别',
    qualityDuration: '稳定',
    lat: 23.1329,
    lng: 113.2672,
    isFavorite: false,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-3', 'plan-7'],
    videoPoster: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-11 09:12:00'
  },
  {
    id: 'cam-yx-8',
    name: '办公 A 区外围绿化带',
    address: '广州市越秀区东风中路大楼南侧周界',
    city: '广州市',
    district: '越秀区',
    code: '44010400001320000008',
    node: '广东省广州市越秀区',
    type: '枪机',
    status: 'offline', // grey
    qualityRecent: '离线',
    qualityDuration: '信号中断',
    lat: 23.1315,
    lng: 113.2682,
    isFavorite: false,
    isHistory: true,
    isHotspot: false,
    planIds: ['plan-8'],
    videoPoster: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-10 20:01:15'
  },

  // 2. 天河区 Cameras
  {
    id: 'cam-th-1',
    name: '天河城南门广场',
    address: '广东省广州市天河区天河路208号天河城南门',
    city: '广州市',
    district: '天河区',
    code: '44010600001320001001',
    node: '广东省广州市天河区',
    type: '球机',
    status: 'online',
    qualityRecent: '4K超清',
    qualityDuration: '稳定',
    lat: 23.1338,
    lng: 113.3235,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-3', 'plan-7'],
    videoPoster: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cam-th-2',
    name: '天河体育中心东大门',
    address: '广东省广州市天河区体育东路天河体育中心东门',
    city: '广州市',
    district: '天河区',
    code: '44010600001320001002',
    node: '广东省广州市天河区',
    type: '枪机',
    status: 'online',
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 23.1385,
    lng: 113.3320,
    isFavorite: false,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-7'],
    videoPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
  },

  // 3. 深圳市南山区 (matching 1.1地图.png)
  {
    id: 'cam-shenda',
    name: '深大地铁站',
    address: '广东省深圳市南山区深大地铁站',
    city: '深圳市',
    district: '南山区',
    code: '104096957013102986832024',
    node: '广东省深圳市南山区',
    type: '枪机',
    status: 'online',
    qualityRecent: '速开设备',
    qualityDuration: '不稳定',
    lat: 22.5365,
    lng: 113.9438,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-4', 'plan-7'],
    videoPoster: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    historyTime: '2024-08-12 16:49:08'
  },
  {
    id: 'cam-sz-nanguang',
    name: '南光高速西丽立交',
    address: '广东省深圳市南山区南光高速与同乐路交汇处',
    city: '深圳市',
    district: '南山区',
    code: '44030500001320001002',
    node: '广东省深圳市南山区',
    type: '枪机',
    status: 'online', // teal
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 22.5850,
    lng: 113.9350,
    isFavorite: false,
    isHistory: false,
    isHotspot: true,
    planIds: ['plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cam-sz-beihuan',
    name: '北环大道科苑立交',
    address: '广东省深圳市南山区北环大道与科苑北路交叉口',
    city: '深圳市',
    district: '南山区',
    code: '44030500001320001003',
    node: '广东省深圳市南山区',
    type: '云台摄像机',
    status: 'warning', // orange
    qualityRecent: '速开设备',
    qualityDuration: '稳定',
    lat: 22.5530,
    lng: 113.9480,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-12 14:00:25'
  },
  {
    id: 'cam-sz-nanshan',
    name: '南山公园南门广场',
    address: '广东省深圳市南山区沿山路南山公园南入口',
    city: '深圳市',
    district: '南山区',
    code: '44030500001320001004',
    node: '广东省深圳市南山区',
    type: '球机',
    status: 'warning', // orange
    qualityRecent: '夜视开启',
    qualityDuration: '稳定',
    lat: 22.4980,
    lng: 113.9180,
    isFavorite: false,
    isHistory: false,
    isHotspot: false,
    planIds: ['plan-6'],
    videoPoster: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cam-sz-guangshen',
    name: '广深沿江高速前海收费站',
    address: '广东省深圳市南山区前海湾沿江高速入口',
    city: '深圳市',
    district: '南山区',
    code: '44030500001320001005',
    node: '广东省深圳市南山区',
    type: '枪机',
    status: 'offline', // grey
    qualityRecent: '离线',
    qualityDuration: '检修中',
    lat: 22.5290,
    lng: 113.8980,
    isFavorite: false,
    isHistory: false,
    isHotspot: false,
    planIds: ['plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cam-sz-xinwei',
    name: '新围社区主干道监控',
    address: '广东省深圳市南山区新围社区商业街东口',
    city: '深圳市',
    district: '南山区',
    code: '44030500001320001007',
    node: '广东省深圳市南山区',
    type: '枪机',
    status: 'offline', // grey
    qualityRecent: '离线',
    qualityDuration: '故障排查',
    lat: 22.5620,
    lng: 113.9620,
    isFavorite: false,
    isHistory: false,
    isHotspot: false,
    planIds: ['plan-1'],
    videoPoster: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80'
  },

  // 4. 深圳市福田区
  {
    id: 'cam-sz-ft-1',
    name: '市民中心南广场西侧',
    address: '广东省深圳市福田区福中三路市民中心广场',
    city: '深圳市',
    district: '福田区',
    code: '44030400001320001001',
    node: '广东省深圳市福田区',
    type: '云台摄像机',
    status: 'online',
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 22.5415,
    lng: 114.0580,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-1', 'plan-7'],
    videoPoster: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cam-sz-ft-2',
    name: '南悦花苑防汛隐患区主出入口',
    address: '广东省深圳市福田区莲花街道福中一路南悦花苑1号门',
    city: '深圳市',
    district: '福田区',
    code: '44030400001320001002',
    node: '广东省深圳市福田区',
    type: '枪机',
    status: 'warning',
    qualityRecent: 'AI人脸布控',
    qualityDuration: '稳定',
    lat: 22.5488,
    lng: 114.0556,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-2', 'plan-8'],
    videoPoster: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cam-sz-ft-3',
    name: '莲花山公园东南门',
    address: '广东省深圳市福田区红荔路莲花山公园东南入口',
    city: '深圳市',
    district: '福田区',
    code: '44030400001320001003',
    node: '广东省深圳市福田区',
    type: '球机',
    status: 'online',
    qualityRecent: '高清全景',
    qualityDuration: '稳定',
    lat: 22.5520,
    lng: 114.0620,
    isFavorite: false,
    isHistory: false,
    isHotspot: true,
    planIds: ['plan-6'],
    videoPoster: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
  },

  // 5. 深圳市宝安区
  {
    id: 'cam-sz-baoan',
    name: '宝安公园北门',
    address: '广东省深圳市宝安区宝安公园北门路口',
    city: '深圳市',
    district: '宝安区',
    code: '44030600001320001001',
    node: '广东省深圳市宝安区',
    type: '球机',
    status: 'online', // teal
    qualityRecent: '高清流畅',
    qualityDuration: '稳定',
    lat: 22.5780,
    lng: 113.9050,
    isFavorite: true,
    isHistory: true,
    isHotspot: true,
    planIds: ['plan-2', 'plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=80',
    historyTime: '2024-08-12 16:10:00'
  },
  {
    id: 'cam-sz-g107',
    name: 'G107国道西乡立交',
    address: '广东省深圳市宝安区G107国道与新安五路交叉口',
    city: '深圳市',
    district: '宝安区',
    code: '44030600001320001006',
    node: '广东省深圳市宝安区',
    type: '枪机',
    status: 'warning', // orange
    qualityRecent: '高频车流',
    qualityDuration: '稳定',
    lat: 22.5650,
    lng: 113.8820,
    isFavorite: false,
    isHistory: false,
    isHotspot: true,
    planIds: ['plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1000&q=80'
  }
];

/**
 * Universal dynamic fallback camera resolver
 * Ensures that ANY selected city and district (the lowest administrative level)
 * will render a realistic, full list of surveillance camera records without empty states.
 */
export function getCamerasForDistrict(city: string, district: string): SurveillanceCamera[] {
  // First check if explicit seeded cameras exist for this district
  const existing = SURVEILLANCE_CAMERAS.filter(
    (c) =>
      (c.city.includes(city) || city.includes(c.city)) &&
      (c.district.includes(district) || district.includes(c.district))
  );

  if (existing.length >= 4) {
    return existing;
  }

  // Base sample locations to generate realistic camera entries for any district
  const sampleSpots = [
    { name: '行政服务中心东门主干道', type: '球机' as const, status: 'online' as const, quality: '4K超清' },
    { name: '应急指挥大楼西门通道', type: '枪机' as const, status: 'online' as const, quality: '高清流畅' },
    { name: '重点防汛排涝闸站水文监控', type: '云台摄像机' as const, status: 'online' as const, quality: 'AI水位识别' },
    { name: '中心商业区人行天桥高点', type: '球机' as const, status: 'warning' as const, quality: '速开设备' },
    { name: '交通枢纽公交客运站出入口', type: '枪机' as const, status: 'online' as const, quality: '车牌布控' },
    { name: '重点危化园区东侧周界', type: '枪机' as const, status: 'warning' as const, quality: '热成像双光谱' },
    { name: '街道避难广场综合监控', type: '球机' as const, status: 'online' as const, quality: '高清全景' },
    { name: '后备物资储备库北门闸口', type: '枪机' as const, status: 'offline' as const, quality: '离线检修' }
  ];

  // Base coordinate offsets
  let baseLat = 23.13;
  let baseLng = 113.28;

  if (city.includes('深圳')) {
    baseLat = 22.55;
    baseLng = 114.05;
  } else if (city.includes('珠海')) {
    baseLat = 22.27;
    baseLng = 113.57;
  } else if (city.includes('佛山')) {
    baseLat = 23.02;
    baseLng = 113.12;
  } else if (city.includes('东莞')) {
    baseLat = 23.02;
    baseLng = 113.75;
  }

  const generated: SurveillanceCamera[] = sampleSpots.map((spot, index) => ({
    id: `dyn-cam-${city}-${district}-${index}`,
    name: `${district}${spot.name}`,
    address: `广东省${city}${district}中心大道${(index + 1) * 38}号`,
    city,
    district,
    code: `44${String(index + 1).padStart(2, '0')}00000132000${String(index + 1).padStart(4, '0')}`,
    node: `广东省${city}${district}`,
    type: spot.type,
    status: spot.status,
    qualityRecent: spot.quality,
    qualityDuration: spot.status === 'offline' ? '检修中' : '稳定',
    lat: baseLat + (index % 4) * 0.008 - 0.015,
    lng: baseLng + Math.floor(index / 4) * 0.012 - 0.01,
    isFavorite: index === 0 || index === 3,
    isHistory: index < 4,
    isHotspot: index % 2 === 0,
    planIds: ['plan-1', 'plan-3'],
    videoPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
  }));

  // Combine existing with generated to ensure rich list
  return [...existing, ...generated.slice(existing.length)];
}
