// Open-Source & Public Map Providers & City Geolocation Data
export interface TileProvider {
  id: string;
  name: string;
  category?: string;
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string[];
}

export const OPEN_SOURCE_TILE_PROVIDERS: Record<string, TileProvider> = {
  amapVector: {
    id: 'amapVector',
    name: '高德标准街道 (国内极速)',
    category: '标准街道',
    url: 'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    attribution: '&copy; 高德地图 AutoNavi',
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 18
  },
  cartoVoyager: {
    id: 'cartoVoyager',
    name: 'CartoDB 综合街景 (全球精细)',
    category: '精细街景',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19
  },
  cartoPositron: {
    id: 'cartoPositron',
    name: 'CartoDB 极简浅色 (大屏/商务)',
    category: '浅色极简',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19
  },
  cartoDark: {
    id: 'cartoDark',
    name: 'CartoDB 暗夜深色 (指挥中心)',
    category: '深色模式',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap 标准开源',
    category: '开源标准',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  },
  amapSatellite: {
    id: 'amapSatellite',
    name: '高德卫星遥感影像',
    category: '遥感卫星',
    url: 'https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}',
    attribution: '&copy; AutoNavi Satellite',
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 18
  }
};

export const CITY_COORDINATES: Record<string, [number, number]> = {
  '广州市': [23.1291, 113.2644],
  '深圳市': [22.5431, 114.0579],
  '佛山市': [23.0215, 113.1214],
  '东莞市': [23.0205, 113.7518],
  '珠海市': [22.2707, 113.5767],
  '中山市': [22.5176, 113.3928],
  '惠州市': [23.1118, 114.4162],
  '汕头市': [23.3541, 116.6820],
  '北京市': [39.9042, 116.4074],
  '上海市': [31.2304, 121.4737],
  '天津市': [39.0842, 117.2009],
  '重庆市': [29.5630, 106.5516],
  '杭州市': [30.2741, 120.1551],
  '南京市': [32.0603, 118.7969],
  '苏州市': [31.2989, 120.5853],
  '成都市': [30.5728, 104.0668],
  '武汉市': [30.5928, 114.3055],
  '西安市': [34.3416, 108.9398]
};
