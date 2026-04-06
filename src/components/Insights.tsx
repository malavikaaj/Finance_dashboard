import React, { useMemo } from 'react';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Info,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const Insights: React.FC = () => {
  const { transactions } = useStore();

  const insightsData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    
    const categories: Record<string, number> = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1]);
    
    const highestCategory = sortedCategories[0];
    
    const monthlyData = [
      { name: 'Jan', income: 4500, expenses: 3200 },
      { name: 'Feb', income: 4800, expenses: 3500 },
      { name: 'Mar', income: totalIncome, expenses: totalExpenses },
    ];

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    return {
      totalExpenses,
      totalIncome,
      highestCategory,
      monthlyData,
      savingsRate,
      categoryCount: Object.keys(categories).length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0
    };
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard 
          title="Savings Rate" 
          value={`${insightsData.savingsRate.toFixed(1)}%`}
          icon={Target}
          color="indigo"
          description="Percentage of income saved"
        />
        <InsightCard 
          title="Avg. Transaction" 
          value={`$${insightsData.averageExpense.toFixed(2)}`}
          icon={Zap}
          color="amber"
          description="Average per expense"
        />
        <InsightCard 
          title="Categories" 
          value={insightsData.categoryCount.toString()}
          icon={Info}
          color="blue"
          description="Unique spending categories"
        />
        <InsightCard 
          title="Top Category" 
          value={insightsData.highestCategory?.[0] || 'N/A'}
          icon={Trophy}
          color="rose"
          description={`$${insightsData.highestCategory?.[1].toLocaleString() || 0} spent`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
            <p className="text-sm text-gray-500">Monthly performance comparison</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insightsData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
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
                   cursor={{ fill: '#f9fafb' }}
                   contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Observations</h3>
            <div className="space-y-6">
              <ObservationItem 
                icon={TrendingUp}
                color="green"
                title="Income is Healthy"
                description={`Your income is ${((insightsData.totalIncome / insightsData.totalExpenses) * 100).toFixed(0)}% higher than your expenses this month.`}
              />
              <ObservationItem 
                icon={AlertTriangle}
                color="amber"
                title="Spending Alert"
                description={`You've spent the most on ${insightsData.highestCategory?.[0] || 'N/A'}. Consider setting a budget for this category.`}
              />
              <ObservationItem 
                icon={TrendingDown}
                color="indigo"
                title="Potential Savings"
                description={`If you reduce your top spending category by 10%, you could save an additional $${insightsData.highestCategory ? (insightsData.highestCategory[1] * 0.1).toFixed(2) : "0"} per month.`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InsightCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: 'indigo' | 'amber' | 'blue' | 'rose';
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, icon: Icon, color, description }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="mb-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-xs text-gray-400 font-medium">{description}</p>
    </div>
  );
};

interface ObservationItemProps {
  icon: React.ElementType;
  color: 'green' | 'amber' | 'indigo';
  title: string;
  description: string;
}

const ObservationItem: React.FC<ObservationItemProps> = ({ icon: Icon, color, title, description }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="flex gap-4">
      <div className={`p-3 rounded-xl h-fit ${colorClasses[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <h5 className="text-sm font-bold text-gray-900 mb-1">{title}</h5>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Insights;
