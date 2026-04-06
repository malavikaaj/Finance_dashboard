export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type Role = 'admin' | 'viewer';

export interface DashboardState {
  transactions: Transaction[];
  role: Role;
  searchQuery: string;
  filterType: 'all' | TransactionType;
  filterCategory: string;
  sortBy: keyof Transaction;
  sortOrder: 'asc' | 'desc';
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: Role) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: 'all' | TransactionType) => void;
  setFilterCategory: (category: string) => void;
  setSort: (sortBy: keyof Transaction) => void;
}
