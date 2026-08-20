import React, { useState } from 'react';
import { ChevronLeft, Search, X } from 'lucide-react';

interface CityPickerModalProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
}

interface ProvinceData {
  name: string;
  cities: string[];
}

const PROVINCE_LIST: ProvinceData[] = [
  { name: '广东省', cities: ['广州市', '深圳市', '佛山市', '东莞市', '珠海市', '中山市', '惠州市', '汕头市', '江门市', '湛江市'] },
  { name: '北京市', cities: ['北京市'] },
  { name: '天津市', cities: ['天津市'] },
  { name: '上海市', cities: ['上海市'] },
  { name: '重庆市', cities: ['重庆市'] },
  { name: '河北省', cities: ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'] },
  { name: '山西省', cities: ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'] },
  { name: '内蒙古自治区', cities: ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市'] },
  { name: '辽宁省', cities: ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市'] },
  { name: '吉林省', cities: ['长春市', '吉林市', '四平市', '辽源市', '通化市'] },
  { name: '黑龙江省', cities: ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市'] },
  { name: '江苏省', cities: ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市'] },
  { name: '浙江省', cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市'] },
  { name: '安徽省', cities: ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市'] },
  { name: '福建省', cities: ['福州市', '厦门市', '莆田市', '三明市', '泉州市'] }
];

export const CityPickerModal: React.FC<CityPickerModalProps> = ({
  selectedCity,
  onSelectCity,
  onClose
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('广东省');
  const [keyword, setKeyword] = useState<string>('');

  const currentProvinceData = PROVINCE_LIST.find((p) => p.name === selectedProvince) || PROVINCE_LIST[0];

  const filteredProvinces = keyword.trim()
    ? PROVINCE_LIST.filter(
        (p) =>
          p.name.includes(keyword) ||
          p.cities.some((c) => c.includes(keyword))
      )
    : PROVINCE_LIST;

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
      {/* Top Header Search Bar */}
      <div className="px-3 pt-3 pb-2.5 bg-white border-b border-slate-100 flex items-center gap-2">
        <button
          onClick={onClose}
          className="system-back-button"
        >
          <ChevronLeft />
        </button>
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入名称"
            className="w-full h-10 pl-3.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout: Left Provinces, Right Cities (Matches 3.4搜索-市区.png) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Provinces Column */}
        <div className="w-[120px] bg-slate-50/80 border-r border-slate-100 overflow-y-auto">
          {filteredProvinces.map((prov) => {
            const isActive = prov.name === selectedProvince;
            return (
              <button
                key={prov.name}
                onClick={() => setSelectedProvince(prov.name)}
                className={`w-full py-3.5 px-3 text-left text-[14px] transition-colors relative cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100/70 font-normal'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r" />
                )}
                <span className="truncate block">{prov.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Cities Area */}
        <div className="flex-1 bg-white p-3.5 overflow-y-auto">
          {keyword ? (
            // Search Mode Results
            <div className="space-y-4">
              {filteredProvinces.map((p) => {
                const matchedCities = p.cities.filter((c) => c.includes(keyword));
                if (matchedCities.length === 0) return null;
                return (
                  <div key={p.name} className="space-y-2">
                    <div className="text-[13px] font-bold text-slate-500">{p.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {matchedCities.map((city) => {
                        const isChosen = city === selectedCity;
                        return (
                          <button
                            key={city}
                            onClick={() => {
                              onSelectCity(city);
                              onClose();
                            }}
                            className={`px-3.5 py-2 rounded-lg text-[13px] flex items-center gap-1.5 transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-blue-600 text-white font-medium shadow-xs'
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            }`}
                          >
                            <span>{city}</span>
                            {isChosen && <X className="w-3.5 h-3.5 opacity-80" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Regular Province Browse Mode
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-slate-900">{currentProvinceData.name}</span>
                <span className="text-[12px] text-slate-400">点击选择城市</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {currentProvinceData.cities.map((city) => {
                  const isChosen = city === selectedCity;
                  return (
                    <button
                      key={city}
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className={`h-11 px-3 rounded-lg text-[13px] flex items-center justify-between transition-all border cursor-pointer ${
                        isChosen
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                          : 'bg-slate-50/90 text-slate-800 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{city}</span>
                      {isChosen ? (
                        <X className="w-3.5 h-3.5 text-white/80" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Other Hot Provinces Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[13px] font-bold text-slate-600 mb-2.5">常用城市</div>
                <div className="flex flex-wrap gap-2">
                  {['广州市', '深圳市', '北京市', '上海市', '天津市', '杭州市', '成都市'].map((hotCity) => (
                    <button
                      key={hotCity}
                      onClick={() => {
                        onSelectCity(hotCity);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition-colors ${
                        hotCity === selectedCity
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {hotCity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
