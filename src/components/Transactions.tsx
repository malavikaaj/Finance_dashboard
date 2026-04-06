import React, { useMemo, useState, useEffect } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import TransactionModal from './TransactionModal';
import type { Transaction } from '../types';

const Transactions: React.FC = () => {
  const { 
    transactions, 
    role, 
    searchQuery, 
    filterType, 
    filterCategory,
    sortBy,
    sortOrder,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setSearchQuery,
    setFilterType,
    setFilterCategory,
    setSort
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory]);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'date') {
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * factor;
        }
        if (sortBy === 'amount') {
          return (a.amount - b.amount) * factor;
        }
        return String(a[sortBy]).localeCompare(String(b[sortBy])) * factor;
      });
  }, [transactions, searchQuery, filterType, filterCategory, sortBy, sortOrder]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'transactions.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage and track your financial activities</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Export
          </button>
          {role === 'admin' && (
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <Plus size={18} />
              New Transaction
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-500">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
        </div>

        <div className="relative group flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
           <span className="text-xs font-semibold text-gray-400">Sort by:</span>
           <button 
             onClick={() => setSort('date')}
             className={`p-2 rounded-lg transition-colors ${sortBy === 'date' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}
           >
             Date
           </button>
           <button 
             onClick={() => setSort('amount')}
             className={`p-2 rounded-lg transition-colors ${sortBy === 'amount' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'}`}
           >
             Amount
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                {role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{t.description}</p>
                          <p className="text-xs text-gray-500 capitalize">{t.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${
                      t.type === 'income' ? 'text-green-600' : 'text-rose-600'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(t)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                        <Search size={40} />
                      </div>
                      <p className="text-gray-500 font-medium">No transactions found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="text-gray-900">{filteredTransactions.length}</span> transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
