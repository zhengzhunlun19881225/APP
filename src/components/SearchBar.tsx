import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  onClick?: () => void;
  onFocus?: () => void;
  readOnly?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '搜索',
  onClick,
  onFocus,
  readOnly = false
}) => {
  return (
    <div className="relative w-full" onClick={onClick}>
      <div className="flex items-center bg-white rounded-[12px] px-4 py-2.5 border border-slate-100 shadow-2xs transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 cursor-pointer">
        <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onClick={onClick}
          onFocus={onFocus}
          readOnly={readOnly}
          placeholder={placeholder}
          className="w-full text-[14px] text-slate-800 placeholder-slate-400 bg-transparent outline-none cursor-pointer"
        />
        {value && onChange && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

