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
      <div className="app-search-shell cursor-pointer">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onClick={onClick}
          onFocus={onFocus}
          readOnly={readOnly}
          placeholder={placeholder}
          className="app-search-input cursor-pointer"
        />
        {value && onChange && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
