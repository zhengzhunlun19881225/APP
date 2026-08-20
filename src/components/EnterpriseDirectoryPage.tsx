import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Phone, Search, X } from 'lucide-react';
import { mockEnterpriseData } from '../data/enterpriseDirectoryData';
import { ContactItem } from '../types';
import { Avatar } from './Avatar';

interface EnterpriseDirectoryPageProps {
  initialDepartmentId?: string;
  onBack: () => void;
  onSelectMember: (member: ContactItem) => void;
  onChatWithMember: (member: ContactItem) => void;
  onCallMember: (member: ContactItem) => void;
}

export const EnterpriseDirectoryPage: React.FC<EnterpriseDirectoryPageProps> = ({
  initialDepartmentId,
  onBack,
  onSelectMember,
  onChatWithMember,
  onCallMember
}) => {
  const company = mockEnterpriseData;
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(initialDepartmentId || null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentDept = useMemo(() => {
    if (!selectedDeptId) return null;
    return company.departments.find((d) => d.id === selectedDeptId) || null;
  }, [selectedDeptId, company.departments]);

  // Filtered departments for Level 1
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return company.departments;
    const q = searchQuery.toLowerCase().trim();
    return company.departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(q) ||
        dept.members.some((m) => m.name.toLowerCase().includes(q) || (m.role && m.role.toLowerCase().includes(q)))
    );
  }, [company.departments, searchQuery]);

  // Filtered members for Level 2
  const filteredMembers = useMemo(() => {
    if (!currentDept) return [];
    if (!searchQuery.trim()) return currentDept.members;
    const q = searchQuery.toLowerCase().trim();
    return currentDept.members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.phone && m.phone.includes(q))
    );
  }, [currentDept, searchQuery]);

  const handleBackNav = () => {
    if (searchQuery) {
      setSearchQuery('');
      return;
    }
    if (selectedDeptId) {
      setSelectedDeptId(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f5f8] select-none">
      {/* Top Header */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2.5 flex items-center justify-between bg-white border-b border-slate-100/90 sticky top-0 z-20">
        <button
          onClick={handleBackNav}
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2]" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">企业通讯录</h1>
        <div className="w-9"></div> {/* Spacer balance */}
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Search Bar - White background, 12px (px-3) left/right padding */}
        <div className="flex-shrink-0 px-3 pt-3 pb-2">
          <div className="flex items-center bg-white rounded-[12px] px-3.5 py-2.5 border border-slate-100 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索"
              className="w-full text-[14px] text-slate-800 placeholder-slate-400 bg-transparent outline-none leading-normal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 ml-1 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumbs navigation - 12px (px-3) aligned with explicit height and flex-shrink-0 */}
        <div className="flex-shrink-0 px-3.5 py-2 mb-1 flex items-center gap-1.5 text-[14px] text-slate-500 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedDeptId(null);
              setSearchQuery('');
            }}
            className="text-blue-600 font-normal hover:underline whitespace-nowrap flex-shrink-0"
          >
            企业通讯录
          </button>
          <span className="text-slate-400 text-[13px] flex-shrink-0">&gt;</span>

          {currentDept ? (
            <>
              <button
                onClick={() => {
                  setSelectedDeptId(null);
                  setSearchQuery('');
                }}
                className="text-blue-600 font-normal hover:underline whitespace-nowrap truncate max-w-[150px] flex-shrink-0"
              >
                {company.name}
              </button>
              <span className="text-slate-400 text-[13px] flex-shrink-0">&gt;</span>
              <span className="text-slate-700 font-medium whitespace-nowrap truncate max-w-[130px] flex-shrink-0">
                {currentDept.name}
              </span>
            </>
          ) : (
            <span className="text-slate-700 font-medium whitespace-nowrap truncate flex-shrink-0">
              {company.name}
            </span>
          )}
        </div>

        {/* Content List Card - 12px margin on left and right (px-3), White Card with rounded-[12px] */}
        <div className="px-3">
          <div className="bg-white rounded-[12px] p-2.5 shadow-2xs border border-slate-100/90">
            {!selectedDeptId ? (
              /* Level 1: Departments List */
              filteredDepartments.length === 0 ? (
                <div className="py-14 text-center text-slate-400 text-sm">
                  未找到相关部门或人员
                </div>
              ) : (
                <div className="divide-y divide-slate-100/80">
                  {filteredDepartments.map((dept) => (
                    <div
                      key={dept.id}
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50/80 active:bg-slate-100/70 rounded-[10px] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-semibold text-slate-900">{dept.name}</span>
                        <span className="text-[13px] text-slate-400">({dept.memberCount}人)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 stroke-[2]" />
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Level 2: Department Members List */
              filteredMembers.length === 0 ? (
                <div className="py-14 text-center text-slate-400 text-sm">
                  该部门暂无符合条件的成员
                </div>
              ) : (
                <div className="divide-y divide-slate-100/80">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-3 px-2 hover:bg-slate-50/80 rounded-[10px] transition-colors"
                    >
                      {/* Member Info Clickable to Profile */}
                      <div
                        onClick={() => onSelectMember(member)}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none active:opacity-75 transition-opacity"
                      >
                        <Avatar src={member.avatar} name={member.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[15px] font-semibold text-slate-900 truncate">
                            {member.name}
                          </div>
                          <div className="text-[12px] text-slate-400 mt-0.5 truncate">
                            {member.role || '成员'}
                          </div>
                        </div>
                      </div>

                      {/* Action Icons: Chat bubble with dots + Phone Call */}
                      <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                        {/* Chat Bubble Icon */}
                        <button
                          onClick={() => onChatWithMember(member)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 active:scale-95 transition-all"
                          title={`发消息给 ${member.name}`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-none stroke-current stroke-[2]"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            <circle cx="9" cy="10" r="1" fill="currentColor" />
                            <circle cx="15" cy="10" r="1" fill="currentColor" />
                          </svg>
                        </button>

                        {/* Phone Call Icon */}
                        <button
                          onClick={() => onCallMember(member)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 active:scale-95 transition-all"
                          title={`拨打电话给 ${member.name}`}
                        >
                          <Phone className="w-5 h-5 stroke-[2]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

