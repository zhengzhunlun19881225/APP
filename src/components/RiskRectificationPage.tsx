import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Grid,
  X,
  AlertTriangle,
  MapPin,
  Calendar,
  Edit3,
  Upload,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Plus
} from 'lucide-react';

interface RiskRectificationPageProps {
  onBack: () => void;
}

export const RiskRectificationPage: React.FC<RiskRectificationPageProps> = ({ onBack }) => {
  // Current Inspection Item Index (1 to 5)
  const [currentItemIndex, setCurrentItemIndex] = useState(2); // 0-based index: 2 means item 3 (3/5 or 2/4 in mock)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'hazard1' | 'hazard2'>('hazard1');
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Form View State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'rectified' | 'postpone'>('rectified');

  // Form inputs
  const [rectifyPerson, setRectifyPerson] = useState('龙少华');
  const [rectifyPhone, setRectifyPhone] = useState('15986808142');
  const [rectifyDate, setRectifyDate] = useState('2026-04-13 10:00');
  const [postponeDate, setPostponeDate] = useState('2026-04-18 10:00');
  const [remarkText, setRemarkText] = useState('有柔性连接管，天花上。施工设施设备及劳动防护用品的安全管理制度');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  ]);

  // Submitted info state
  const [submittedData, setSubmittedData] = useState<{
    status: 'none' | 'rectified' | 'postpone';
    person?: string;
    phone?: string;
    date?: string;
    remark?: string;
    photos?: string[];
  }>({
    status: 'none',
  });

  // Mock list of 5 inspection items
  const inspectionItems = [
    { id: 1, name: '消防- 主体建筑区', status: 'completed' },
    { id: 2, name: '消防- 附属、辅助功能区', status: 'completed' },
    { id: 3, name: '消防- 附属、辅助功能区', status: 'current' },
    { id: 4, name: '电气- 高低压配电室', status: 'pending' },
    { id: 5, name: '给排水- 水泵房系统', status: 'pending' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'rectified') {
      setSubmittedData({
        status: 'rectified',
        person: rectifyPerson,
        phone: rectifyPhone,
        date: rectifyDate,
        remark: remarkText,
        photos: uploadedPhotos,
      });
    } else {
      setSubmittedData({
        status: 'postpone',
        person: rectifyPerson,
        phone: rectifyPhone,
        date: postponeDate,
        remark: remarkText,
        photos: uploadedPhotos,
      });
    }
    setIsFormOpen(false);
  };

  const handleUploadClick = () => {
    // Add a mock photo
    const samplePhotos = [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
    ];
    if (uploadedPhotos.length < 3) {
      setUploadedPhotos([...uploadedPhotos, samplePhotos[uploadedPhotos.length % 2]]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  // Render Full-Screen Fill Form Mode
  if (isFormOpen) {
    return (
      <div className="flex flex-col h-full bg-[#f4f5f8] relative overflow-hidden select-none animate-fade-in">
        {/* Top Bar */}
        <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-2xs">
          <button
            onClick={() => setIsFormOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">整改填报</h1>
          <div className="w-8" />
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-4">
            {/* 整改结果 Selection */}
            <div>
              <label className="text-[13px] font-bold text-slate-900 block mb-2">
                <span className="text-rose-500 mr-0.5">*</span>整改结果：
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-[14px] text-slate-800 font-medium">
                  <input
                    type="radio"
                    name="formMode"
                    checked={formMode === 'rectified'}
                    onChange={() => setFormMode('rectified')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>已整改</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[14px] text-slate-800 font-medium">
                  <input
                    type="radio"
                    name="formMode"
                    checked={formMode === 'postpone'}
                    onChange={() => setFormMode('postpone')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>申请延期</span>
                </label>
              </div>
            </div>

            {/* Postpone Mode Inputs */}
            {formMode === 'postpone' && (
              <>
                <div>
                  <label className="text-[13px] font-bold text-slate-900 block mb-1.5">
                    <span className="text-rose-500 mr-0.5">*</span>延期时间
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={postponeDate}
                      onChange={(e) => setPostponeDate(e.target.value)}
                      placeholder="选择日期"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-bold text-slate-900 block mb-1.5">
                    <span className="text-rose-500 mr-0.5">*</span>备注
                  </label>
                  <textarea
                    rows={5}
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="请输入延期说明及处置规划..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>
              </>
            )}

            {/* Rectified Mode Inputs */}
            {formMode === 'rectified' && (
              <>
                <div>
                  <label className="text-[13px] font-bold text-slate-900 block mb-1.5">
                    <span className="text-rose-500 mr-0.5">*</span>备注
                  </label>
                  <textarea
                    rows={4}
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="请输入整改说明..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-slate-900 block mb-1.5">
                    <span className="text-rose-500 mr-0.5">*</span>整改责任人：
                  </label>
                  <input
                    type="text"
                    value={rectifyPerson}
                    onChange={(e) => setRectifyPerson(e.target.value)}
                    placeholder="请输入责任人姓名"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-slate-900 block mb-1.5">
                    <span className="text-rose-500 mr-0.5">*</span>责任人电话：
                  </label>
                  <input
                    type="text"
                    value={rectifyPhone}
                    onChange={(e) => setRectifyPhone(e.target.value)}
                    placeholder="请输入责任人联系电话"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-slate-900 block mb-1.5">
                    <span className="text-rose-500 mr-0.5">*</span>整改完成时间：
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={rectifyDate}
                      onChange={(e) => setRectifyDate(e.target.value)}
                      placeholder="选择日期"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div>
                  <label className="text-[13px] text-slate-700 font-medium block mb-2">
                    上传图片（支持 JPG,PNG）
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {uploadedPhotos.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="w-20 h-20 rounded-xl overflow-hidden relative border border-slate-200 group"
                      >
                        <img src={imgUrl} alt="整改现场照片" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {uploadedPhotos.length < 3 && (
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50 flex flex-col items-center justify-center gap-1 text-blue-500 active:scale-95 transition-all"
                      >
                        <Upload className="w-5 h-5 stroke-[2]" />
                        <span className="text-[11px] font-bold">上传</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 pb-6">
            <button
              type="submit"
              className="w-full bg-[#0070f3] text-white py-3.5 rounded-xl font-bold text-[16px] shadow-md hover:bg-blue-600 active:scale-98 transition-all"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] relative overflow-hidden select-none">
      {/* Top Header Section with Soft Blue Gradient */}
      <div className="bg-gradient-to-b from-[#3a84f3] via-[#4d90f6] to-[#609df8] pt-3 pb-3 px-4 text-white relative z-20 shadow-xs">
        <div className="flex items-center justify-between relative">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 active:bg-white/40 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <h1 className="text-[17px] font-bold text-white tracking-tight">整改填报</h1>

          <button
            onClick={() => setIsChecklistModalOpen(true)}
            className="flex items-center gap-1 bg-white/20 active:bg-white/30 px-2.5 py-1 rounded-lg text-[13px] font-bold text-white transition-colors"
          >
            <Grid className="w-4 h-4 stroke-[2.2]" />
            <span>2/4</span>
          </button>
        </div>
      </div>

      {/* Main Body Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">
        {/* Card 1: Header Inspection Area Card */}
        <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0070f3] text-white font-bold text-[15px] flex items-center justify-center shadow-2xs">
                1
              </div>
              <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
                消防- 附属、辅助功能区
              </h2>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200/60 text-[12px] font-bold rounded-md whitespace-nowrap">
              待整改
            </span>
          </div>

          <div className="space-y-1.5 text-[13px] text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>检查人：李敏浩</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>填报时间：2026-04-13 10:00</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 text-[12px] text-slate-600 leading-relaxed border border-slate-100">
            {isHeaderExpanded ? (
              <p>
                消防控制室、供氧站、高压氧舱、胶片室、锅炉房、变配电室、定灭火系统的设备房、消防水泵房、发电机房荫品库房等资料库
              </p>
            ) : (
              <p className="line-clamp-2">
                消防控制室、供氧站、高压氧舱、胶片室、锅炉房、变配电室、定灭火系统的设备房、消防水泵房、发电机...
              </p>
            )}
            <button
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              className="w-full text-center text-blue-600 font-bold text-[12px] flex items-center justify-center gap-1 pt-1 hover:opacity-80"
            >
              <span>{isHeaderExpanded ? '收起' : '展开'}</span>
              {isHeaderExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Card 2: Hazard Details & Tabs Card */}
        <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-3.5">
          {/* Hazard Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-2">
            <button
              onClick={() => setActiveTab('hazard1')}
              className={`text-[15px] font-bold relative pb-1 transition-colors ${
                activeTab === 'hazard1' ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              隐患1
              {activeTab === 'hazard1' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('hazard2')}
              className={`text-[15px] font-bold relative pb-1 transition-colors ${
                activeTab === 'hazard2' ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              隐患2
              {activeTab === 'hazard2' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Hazard Info Content */}
          <div className="space-y-2.5 text-[13px]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">隐患级别：</span>
              <span className="text-rose-600 font-bold">一级隐患</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">检查位置：</span>
              <span className="text-slate-800 font-medium">深圳市人民医院三楼电房</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">整改期限：</span>
              <span className="text-slate-800 font-medium">2026-04-13 10:00</span>
              <span className="text-rose-500 font-bold ml-1">(剩余2天)</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2">
                <Edit3 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-500 font-medium">隐患描述：</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-6">
                消防控制蜜、供氧站、高压气舱、胶片室、锅炉房、变配电室、定义火果系统的设备房、消防水泵房、发电机房荫品库房等资料库
              </p>
            </div>

            {/* Photo List Thumbnails */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-24 rounded-xl overflow-hidden border border-slate-100 shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
                  alt="现场照片1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-24 rounded-xl overflow-hidden border border-slate-100 shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80"
                  alt="现场照片2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-24 rounded-xl overflow-hidden border border-slate-100 shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80"
                  alt="现场照片3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Opinion / Difficulty / Basis Card */}
        <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-4">
          {/* 整改意见 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-[14px]">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>整改意见</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed pl-6">
              无生产管理制度安全检查和改进制度、施工设施设备及劳动防护用品的安全管理制度、事故隐患排查治理制度
            </p>
          </div>

          {/* 整改难度 */}
          <div className="space-y-1.5 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-[14px]">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>整改难度</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed pl-6">
              施工设施设备及劳动防护用品的安全管理制度、事故隐患排查治理制度
            </p>
          </div>

          {/* 整改依据 */}
          <div className="space-y-1.5 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-[14px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>整改依据</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed pl-6">
              安全生产责任制及考核制度、安全教育培训制度、安全生产技术管理制度、安全检查和改进制度、施工设施设备及劳动防护用品的安全管理制度、事故隐患排查治理制度
            </p>
          </div>
        </div>

        {/* Card 4 (Conditional): Filled Form Result Summary Card */}
        {submittedData.status !== 'none' && (
          <div className="bg-white rounded-[20px] p-4 shadow-2xs border border-slate-100/80 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-[15px] font-bold text-slate-900">整改填报信息</h3>
              </div>
              {submittedData.status === 'postpone' && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-md">
                  待审批
                </span>
              )}
            </div>

            <div className="space-y-2 text-[13px]">
              {submittedData.status === 'postpone' ? (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">整改结果：</span>
                    <span className="text-rose-600 font-bold">申请延期</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">延期时间：</span>
                    <span className="text-slate-800 font-medium">{submittedData.date}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">整改完成时间：</span>
                  <span className="text-slate-800 font-medium">{submittedData.date}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">整改责任人：</span>
                <span className="text-slate-800 font-medium">{submittedData.person}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">责任人电话：</span>
                <span className="text-slate-800 font-medium">{submittedData.phone}</span>
              </div>

              {submittedData.remark && (
                <div className="space-y-1">
                  <span className="text-slate-500 block">
                    {submittedData.status === 'postpone' ? '备注：' : '隐患描述：'}
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {submittedData.remark}
                  </p>
                </div>
              )}

              {/* Photos preview */}
              {submittedData.photos && submittedData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {submittedData.photos.map((p, idx) => (
                    <div key={idx} className="h-20 rounded-xl overflow-hidden border border-slate-100">
                      <img src={p} alt="整改后照片" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="bg-white border-t border-slate-100 p-3 flex items-center justify-between gap-3 shadow-lg z-10">
        <button
          onClick={() => {
            if (currentItemIndex > 0) setCurrentItemIndex(currentItemIndex - 1);
          }}
          className="text-slate-600 font-bold text-[14px] px-3 py-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
        >
          上一项
        </button>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex-1 bg-[#0070f3] text-white py-2.5 px-4 rounded-xl font-bold text-[15px] shadow-sm hover:bg-blue-600 active:scale-98 transition-all text-center"
        >
          整改填报
        </button>

        {submittedData.status !== 'none' ? (
          <button
            onClick={() => {
              alert('整改结果已成功提交！');
              onBack();
            }}
            className="text-blue-600 font-bold text-[14px] px-3 py-2 rounded-xl hover:bg-blue-50 active:scale-95 transition-all"
          >
            提交
          </button>
        ) : (
          <button
            onClick={() => {
              if (currentItemIndex < inspectionItems.length - 1) {
                setCurrentItemIndex(currentItemIndex + 1);
              }
            }}
            className="text-slate-600 font-bold text-[14px] px-3 py-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
          >
            下一项
          </button>
        )}
      </div>

      {/* Checklist Selector Modal */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-5 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 space-y-4 animate-scale-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[17px] font-bold text-slate-900">检查项</h3>
              <button
                onClick={() => setIsChecklistModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-around text-[12px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>未填报</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>已填报</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>当前项</span>
              </div>
            </div>

            {/* Grid options 1-5 */}
            <div className="grid grid-cols-5 gap-2.5 pt-2">
              {inspectionItems.map((item, index) => {
                const isCurrent = index === currentItemIndex;
                const isCompleted = item.status === 'completed';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentItemIndex(index);
                      setIsChecklistModalOpen(false);
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center font-bold text-[15px] transition-all active:scale-95 ${
                      isCurrent
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-400'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
