import React, { useState, useRef } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  User,
  ChevronDown,
  X,
  UploadCloud,
  CheckCircle2,
  Check,
  AlertCircle,
  HelpCircle,
  BookOpen,
  FileCheck
} from 'lucide-react';

// ======================== Types ========================

export interface LeaveApplicationData {
  id?: string;
  applicant: string;
  positionInfo: string; // 任职信息
  leaveType: string; // 休假项目: 事假 / 年假 / 病假 / 调休 / 婚假 / 产假
  startTime: string; // e.g. "2025-07-07 08:30"
  endTime: string; // e.g. "2025-07-09 17:30"
  startDate?: string;
  startTimeSlot?: string;
  endDate?: string;
  endTimeSlot?: string;
  reason: string; // 申请原因
  isSubmitted?: boolean;
}

export interface OvertimeApplicationData {
  id?: string;
  applicant: string;
  overtimeType: '加整班' | '加点';
  overtimeDate: string; // e.g. "2025-08-13"
  startTime?: string; // e.g. "18:00" (for 加点)
  endTime?: string; // e.g. "21:30" (for 加点)
  durationText?: string; // e.g. "3小时30分钟"
  overtimeProject: string; // 加班项目: 工作日加班 / 休息日加班 / 节假日加班
  positionInfo?: string; // 集团总部/人力资源部/招聘专员
  hasRest?: boolean; // 是否休息: 否 / 是
  transferToCompOff: boolean; // 是否转调休额度: 是 / 否
  reason: string; // 申请原因
  attachments?: { id: string; name: string; size: string }[];
  isSubmitted?: boolean;
}

export interface EmployeeManualQueryData {
  title: string;
  category: string;
  summary: string;
  details: string[];
}

export interface ProofApplicationData {
  proofType: string; // 收入证明 / 在职证明
  applicant: string;
  department: string;
  purpose: string;
  deliveryMethod: string;
  isSubmitted?: boolean;
}

// ======================== Cards ========================

// 1. 请假申请卡片 (Match Screenshot 2)
interface LeaveApplicationCardProps {
  data: LeaveApplicationData;
  onEdit: () => void;
  onSubmit: () => void;
}

export const LeaveApplicationCard: React.FC<LeaveApplicationCardProps> = ({
  data,
  onEdit,
  onSubmit
}) => {
  return (
    <div className="app-card p-4.5 bg-gradient-to-b from-[#fffbf8] to-white shadow-2xs space-y-3.5 relative overflow-hidden">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#fa8c16] text-white flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-[15px] font-bold text-slate-900">请假申请</span>
        </div>
        {data.isSubmitted && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>已提交审批</span>
          </span>
        )}
      </div>

      {/* Field List */}
      <div className="space-y-2.5 text-[14px]">
        <div className="flex items-start justify-between">
          <span className="text-slate-400 shrink-0">任职信息：</span>
          <span className="text-slate-800 font-medium text-right max-w-[200px] leading-snug">
            {data.positionInfo}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">休假项目：</span>
          <span className="text-slate-800 font-medium">{data.leaveType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">开始时间：</span>
          <span className="text-slate-800 font-medium">{data.startTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">结束时间：</span>
          <span className="text-slate-800 font-medium">{data.endTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">申请原因：</span>
          <span className="text-slate-800 font-medium">{data.reason}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!data.isSubmitted && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-2 rounded-xl text-[14px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-center cursor-pointer"
          >
            修改
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 py-2 rounded-xl text-[14px] font-medium text-white bg-[#0070f3] hover:bg-blue-600 active:scale-95 transition-all shadow-xs text-center cursor-pointer"
          >
            提交
          </button>
        </div>
      )}
    </div>
  );
};

// 2. 加班申请卡片 (Match Screenshot 4 & Screenshot 6)
interface OvertimeApplicationCardProps {
  data: OvertimeApplicationData;
  onEdit: () => void;
  onSubmit: () => void;
}

export const OvertimeApplicationCard: React.FC<OvertimeApplicationCardProps> = ({
  data,
  onEdit,
  onSubmit
}) => {
  const isJiaDian = data.overtimeType === '加点';

  return (
    <div className="app-card p-4.5 bg-gradient-to-b from-[#fffbf8] to-white shadow-2xs space-y-3.5 relative overflow-hidden">
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#fa8c16] text-white flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-[15px] font-bold text-slate-900">加班申请单</span>
        </div>
        {data.isSubmitted && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>已提交审批</span>
          </span>
        )}
      </div>

      {/* Field List */}
      <div className="space-y-2.5 text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">申请人：</span>
          <span className="text-slate-800 font-medium">{data.applicant}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">加班类型：</span>
          <span className="text-slate-800 font-medium">{data.overtimeType}</span>
        </div>

        {isJiaDian ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">开始时间：</span>
              <span className="text-slate-800 font-medium">
                {data.overtimeDate} {data.startTime || '18:00'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">结束时间：</span>
              <span className="text-slate-800 font-medium">
                {data.overtimeDate} {data.endTime || '21:30'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">加班日期：</span>
            <span className="text-slate-800 font-medium">{data.overtimeDate}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-400">加班项目：</span>
          <span className="text-slate-800 font-medium">{data.overtimeProject}</span>
        </div>

        {isJiaDian && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">是否休息：</span>
            <span className="text-slate-800 font-medium">{data.hasRest ? '是' : '否'}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-400">是否转调休额度：</span>
          <span className="text-slate-800 font-medium">
            {data.transferToCompOff ? '是' : '否'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">申请原因：</span>
          <span className="text-slate-800 font-medium">{data.reason}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!data.isSubmitted && (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-2 rounded-xl text-[14px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-center cursor-pointer"
          >
            修改
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 py-2 rounded-xl text-[14px] font-medium text-white bg-[#0070f3] hover:bg-blue-600 active:scale-95 transition-all shadow-xs text-center cursor-pointer"
          >
            提交
          </button>
        </div>
      )}
    </div>
  );
};

// ======================== Modal Dialogs ========================

// 3. 请假申请单修改弹窗 (Match Screenshot 3)
interface LeaveModalProps {
  isOpen: boolean;
  initialData: LeaveApplicationData;
  onClose: () => void;
  onSave: (data: LeaveApplicationData) => void;
}

export const LeaveApplicationModal: React.FC<LeaveModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave
}) => {
  const [leaveType, setLeaveType] = useState<string>(initialData.leaveType || '事假');
  const [positionInfo, setPositionInfo] = useState<string>(
    initialData.positionInfo || '集团总部/人力资源部/招聘专员'
  );
  const [startDate, setStartDate] = useState<string>(
    initialData.startDate || initialData.startTime.split(' ')[0] || '2025-07-07'
  );
  const [startTimeSlot, setStartTimeSlot] = useState<string>(
    initialData.startTimeSlot || initialData.startTime.split(' ')[1] || '08:30'
  );
  const [endDate, setEndDate] = useState<string>(
    initialData.endDate || initialData.endTime.split(' ')[0] || '2025-07-08'
  );
  const [endTimeSlot, setEndTimeSlot] = useState<string>(
    initialData.endTimeSlot || initialData.endTime.split(' ')[1] || '17:30'
  );
  const [reason, setReason] = useState<string>(initialData.reason || '');

  if (!isOpen) return null;

  const handleReset = () => {
    setLeaveType('事假');
    setPositionInfo('集团总部/人力资源部/招聘专员');
    setStartDate('2025-07-07');
    setStartTimeSlot('08:30');
    setEndDate('2025-07-08');
    setEndTimeSlot('17:30');
    setReason('');
  };

  const handleConfirm = () => {
    onSave({
      ...initialData,
      leaveType,
      positionInfo,
      startDate,
      startTimeSlot,
      endDate,
      endTimeSlot,
      startTime: `${startDate} ${startTimeSlot}`,
      endTime: `${endDate} ${endTimeSlot}`,
      reason: reason || '家中有事'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-sm app-modal shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="w-6" />
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight text-center">
            请假申请单
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-[14px]">
          {/* *休假项目 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>休假项目
            </label>
            <div className="relative">
              <input
                type="text"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                placeholder="事假"
                className="app-form-control"
              />
            </div>
          </div>

          {/* *任职信息 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>任职信息
            </label>
            <div className="relative">
              <select
                value={positionInfo}
                onChange={(e) => setPositionInfo(e.target.value)}
                className="app-form-select"
              >
                <option value="集团总部/人力资源部/招聘专员">集团总部/人力资源部/招聘专员</option>
                <option value="集团总部/数字与人工智能部/开发工程师">集团总部/数字与人工智能部/开发工程师</option>
                <option value="集团总部/财务管理部/总账会计">集团总部/财务管理部/总账会计</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* *开始日期 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>开始日期
            </label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7 relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="app-form-control"
                />
              </div>
              <div className="col-span-5 relative">
                <select
                  value={startTimeSlot}
                  onChange={(e) => setStartTimeSlot(e.target.value)}
                  className="app-form-select"
                >
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="12:00">12:00</option>
                  <option value="14:00">14:00</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* *结束日期 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>结束日期
            </label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7 relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="app-form-control"
                />
              </div>
              <div className="col-span-5 relative">
                <select
                  value={endTimeSlot}
                  onChange={(e) => setEndTimeSlot(e.target.value)}
                  className="app-form-select"
                >
                  <option value="12:00">12:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* *申请原因 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>申请原因
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请输入"
                maxLength={200}
                className="app-form-textarea min-h-[112px] pb-6"
              />
              <span className="absolute right-2.5 bottom-2 text-[11px] text-slate-400">
                {reason.length}/200
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl text-[15px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-center cursor-pointer"
          >
            重置
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-[15px] font-semibold text-white bg-[#0070f3] hover:bg-blue-600 active:scale-[0.99] transition-all shadow-xs text-center cursor-pointer"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. 加班申请单修改弹窗 (Match Screenshot 5 & Screenshot 7)
interface OvertimeModalProps {
  isOpen: boolean;
  initialData: OvertimeApplicationData;
  onClose: () => void;
  onSave: (data: OvertimeApplicationData) => void;
}

export const OvertimeApplicationModal: React.FC<OvertimeModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave
}) => {
  const [overtimeType, setOvertimeType] = useState<'加整班' | '加点'>(
    initialData.overtimeType || '加整班'
  );
  const [overtimeDate, setOvertimeDate] = useState<string>(
    initialData.overtimeDate || '2025-07-07'
  );
  const [startTime, setStartTime] = useState<string>(initialData.startTime || '18:00');
  const [endTime, setEndTime] = useState<string>(initialData.endTime || '21:30');
  const [overtimeProject, setOvertimeProject] = useState<string>(
    initialData.overtimeProject || '工作日加班'
  );
  const [positionInfo, setPositionInfo] = useState<string>(
    initialData.positionInfo || '集团总部/人力资源部/招聘专员'
  );
  const [hasRest, setHasRest] = useState<boolean>(initialData.hasRest || false);
  const [transferToCompOff, setTransferToCompOff] = useState<boolean>(
    initialData.transferToCompOff || false
  );
  const [reason, setReason] = useState<string>(initialData.reason || '');

  // Attachments
  const [attachments, setAttachments] = useState<{ id: string; name: string; size: string }[]>(
    initialData.attachments || [
      { id: 'att-1', name: '其他资料原因.pdf', size: '154.12KB' }
    ]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isJiaDian = overtimeType === '加点';

  const handleReset = () => {
    setOvertimeType(initialData.overtimeType || '加整班');
    setOvertimeDate('2025-07-07');
    setStartTime('18:00');
    setEndTime('21:30');
    setOvertimeProject('工作日加班');
    setPositionInfo('集团总部/人力资源部/招聘专员');
    setHasRest(false);
    setTransferToCompOff(false);
    setReason('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAttachments((prev) => [
        ...prev,
        { id: 'att-' + Date.now(), name: file.name, size: (file.size / 1024).toFixed(2) + 'KB' }
      ]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleConfirm = () => {
    onSave({
      ...initialData,
      overtimeType,
      overtimeDate,
      startTime: isJiaDian ? startTime : undefined,
      endTime: isJiaDian ? endTime : undefined,
      durationText: isJiaDian ? '3小时30分钟' : '1天',
      overtimeProject,
      positionInfo,
      hasRest: isJiaDian ? hasRest : undefined,
      transferToCompOff,
      reason: reason || '与客户线上会议',
      attachments
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-sm app-modal shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="w-6" />
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight text-center">
            加班申请单
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-[14px]">
          {/* *加班类型 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>加班类型
            </label>
            <div className="relative">
              <select
                value={overtimeType}
                onChange={(e) => setOvertimeType(e.target.value as '加整班' | '加点')}
                className="app-form-select"
              >
                <option value="加整班">加整班</option>
                <option value="加点">加点</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* *加班日期 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>加班日期
            </label>
            <input
              type="date"
              value={overtimeDate}
              onChange={(e) => setOvertimeDate(e.target.value)}
              className="app-form-control"
            />
          </div>

          {/* If 加点: 开始时间 & 结束时间 & 预计时长 */}
          {isJiaDian && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span>开始时间
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="app-form-control"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] text-slate-600 font-medium">
                    <span className="text-red-500">*</span>结束时间
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="app-form-control"
                  />
                </div>
              </div>

              {/* 预计时长 */}
              <div className="text-[13px] text-slate-600">
                <span>预计时长：</span>
                <span className="font-semibold text-slate-900">3小时30分钟</span>
              </div>
            </>
          )}

          {/* *加班项目 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>加班项目
            </label>
            <div className="relative">
              <select
                value={overtimeProject}
                onChange={(e) => setOvertimeProject(e.target.value)}
                className="app-form-select"
              >
                <option value="工作日加班">工作日加班</option>
                <option value="休息日加班">休息日加班</option>
                <option value="法定节假日加班">法定节假日加班</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* If 加点: 任职信息 */}
          {isJiaDian && (
            <div className="space-y-1">
              <label className="text-[13px] text-slate-600 font-medium">
                <span className="text-red-500">*</span>任职信息
              </label>
              <div className="relative">
                <select
                  value={positionInfo}
                  onChange={(e) => setPositionInfo(e.target.value)}
                  className="app-form-select"
                >
                  <option value="集团总部/人力资源部/招聘专员">集团总部/人力资源部/招聘专员</option>
                  <option value="集团总部/数字与人工智能部/开发工程师">集团总部/数字与人工智能部/开发工程师</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          {/* If 加点: 是否休息 */}
          {isJiaDian && (
            <div className="space-y-1">
              <label className="text-[13px] text-slate-600 font-medium">
                <span className="text-red-500">*</span>是否休息
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasRest(true)}
                  className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                    hasRest
                      ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  是
                </button>
                <button
                  type="button"
                  onClick={() => setHasRest(false)}
                  className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                    !hasRest
                      ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  否
                </button>
              </div>
            </div>
          )}

          {/* 是否转调休额度 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              是否转调休额度
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransferToCompOff(true)}
                className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                  transferToCompOff
                    ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                是
              </button>
              <button
                type="button"
                onClick={() => setTransferToCompOff(false)}
                className={`py-2 rounded-xl text-[13px] font-medium transition-all ${
                  !transferToCompOff
                    ? 'bg-blue-50 text-[#0070f3] border border-blue-400 font-semibold'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                否
              </button>
            </div>
          </div>

          {/* *申请原因 */}
          <div className="space-y-1">
            <label className="text-[13px] text-slate-600 font-medium">
              <span className="text-red-500">*</span>申请原因
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请输入"
                maxLength={200}
                className="app-form-textarea min-h-[112px] pb-6"
              />
              <span className="absolute right-2.5 bottom-2 text-[11px] text-slate-400">
                {reason.length}/200
              </span>
            </div>
          </div>

          {/* If 加点: 附件 */}
          {isJiaDian && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="text-[13px] font-medium text-slate-700">附件</div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50/70 transition-colors flex items-center justify-center gap-2 text-[#0070f3] text-[13px] font-medium cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>点击上传文件</span>
              </button>

              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{att.name}</div>
                      <div className="text-[11px] text-slate-400">{att.size}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-xl text-[15px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-center cursor-pointer"
          >
            重置
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-[15px] font-semibold text-white bg-[#0070f3] hover:bg-blue-600 active:scale-[0.99] transition-all shadow-xs text-center cursor-pointer"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
