import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { role } = useStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800 capitalize">{title}</h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700 leading-none capitalize">{role}</p>
              <p className="text-[10px] text-gray-400 mt-1">Online</p>
            </div>
            <UserCircle size={32} className="text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
