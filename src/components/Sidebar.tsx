import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: 'dashboard' | 'transactions' | 'insights';
  setActiveTab: (tab: 'dashboard' | 'transactions' | 'insights') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, setRole } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-mono">F</span>
          FinDash
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Role</span>
            {role === 'admin' ? (
              <ShieldCheck size={16} className="text-green-500" />
            ) : (
              <ShieldAlert size={16} className="text-blue-500" />
            )}
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <p className="mt-2 text-[10px] text-gray-400">
            {role === 'admin' ? 'Full access to edit data' : 'Read-only access'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
