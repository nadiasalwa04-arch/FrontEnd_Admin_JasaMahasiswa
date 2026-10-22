import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = 'Cari...' }) => {
  return (
    <div className="relative w-80">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#EEF2F6] border border-transparent rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
      />
    </div>
  );
};

export default SearchInput;