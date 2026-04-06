import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardState, Role, Transaction, TransactionType } from '../types';
import { mockTransactions } from '../data/mockData';

export const useStore = create<DashboardState>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin',
      searchQuery: '',
      filterType: 'all',
      filterCategory: 'all',
      sortBy: 'date',
      sortOrder: 'desc',

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, id: crypto.randomUUID() },
          ],
        })),

      updateTransaction: (id, updatedFields) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedFields } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setRole: (role: Role) => set({ role }),
      
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      
      setFilterType: (filterType: 'all' | TransactionType) => set({ filterType }),
      
      setFilterCategory: (filterCategory: string) => set({ filterCategory }),
      
      setSort: (sortBy: keyof Transaction) =>
        set((state) => ({
          sortBy,
          sortOrder: state.sortBy === sortBy && state.sortOrder === 'desc' ? 'asc' : 'desc',
        })),
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
