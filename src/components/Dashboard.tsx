import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const Dashboard: React.FC = () => {
  const { transactions } = useStore();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    return {
      balance,
      income: totalIncome,
      expenses: totalExpenses,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    const dailyData: Record<string, { date: string; income: number; expense: number; balance: number }> = {};
    
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningBalance = 0;
    
    sortedTransactions.forEach(t => {
      const dateStr = format(new Date(t.date), 'MMM dd');
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { date: dateStr, income: 0, expense: 0, balance: 0 };
      }
      
      if (t.type === 'income') {
        dailyData[dateStr].income += t.amount;
        runningBalance += t.amount;
      } else {
        dailyData[dateStr].expense += t.amount;
        runningBalance -= t.amount;
      }
      dailyData[dateStr].balance = runningBalance;
    });

    return Object.values(dailyData);
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Overview</h1>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Updated just now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Total Balance" 
          amount={stats.balance} 
          icon={Wallet} 
          color="indigo" 
          trend="+12.5%" 
          isPositive={true}
        />
        <Card 
          title="Total Income" 
          amount={stats.income} 
          icon={TrendingUp} 
          color="green" 
          trend="+8.2%" 
          isPositive={true}
        />
        <Card 
          title="Total Expenses" 
          amount={stats.expenses} 
          icon={TrendingDown} 
          color="rose" 
          trend="-4.1%" 
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Balance Trend</h3>
              <p className="text-sm text-gray-500">Net balance over time</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Spending Breakdown</h3>
              <p className="text-sm text-gray-500">Expenses by category</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  amount: number;
  icon: React.ElementType;
  color: 'indigo' | 'green' | 'rose';
  trend: string;
  isPositive: boolean;
}

const Card: React.FC<CardProps> = ({ title, amount, icon: Icon, color, trend, isPositive }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
