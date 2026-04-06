# FinDash - Finance Dashboard UI

**[Live Demo](https://malavikaaj.github.io/Finance_dashboard/)**

A clean and interactive finance dashboard built with React, TypeScript, and Tailwind CSS. This project was developed as part of a Frontend Developer Intern assignment.

## 🚀 Features

### 1. Dashboard Overview
- **Summary Cards**: Real-time tracking of Total Balance, Income, and Expenses.
- **Balance Trend Chart**: Time-based visualization of net balance using area charts.
- **Spending Breakdown**: Categorical breakdown of expenses using interactive pie charts.

### 2. Transactions Management
- **Transaction List**: Detailed history with date, amount, category, and type.
- **Filtering**: Filter by income/expense type and category.
- **Search & Sort**: Real-time search by description and sorting by date/amount.
- **Pagination**: Efficiently handle large lists of transactions.

### 3. Role-Based UI
- **Toggle Roles**: Switch between `Admin` and `Viewer` roles via the sidebar.
- **Admin Access**: Full permissions to Add, Edit, and Delete transactions.
- **Viewer Access**: Read-only access to all dashboards and lists.

### 4. Insights Section
- **Key Metrics**: Savings rate, average transaction amount, and top spending category.
- **Visual Comparison**: Bar charts comparing monthly income vs. expenses.
- **Actionable Insights**: Automated observations based on transaction data.

### 5. Technical Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand (with Local Storage persistence)
- **Date Handling**: date-fns

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure
- `/src/components`: Reusable UI components (Sidebar, Header, Dashboard, etc.)
- `/src/store`: Zustand store for state management
- `/src/data`: Mock data for initial state
- `/src/types.ts`: TypeScript interfaces and types
- `/src/utils`: Helper functions

## 📝 Approach & Decisions
- **Zustand**: Chosen for its simplicity and lightweight nature compared to Redux, perfect for a single-page dashboard.
- **Tailwind CSS**: Used for rapid UI development and maintaining a consistent design system.
- **Recharts**: Selected for its React-native approach and ease of customization.
- **Persistence**: Used Zustand's `persist` middleware to save state in local storage, ensuring data remains after refreshes.
- **Role Simulation**: Implemented as a global state property that conditionally renders UI elements (e.g., "Add Transaction" button).

## 🎨 Design Choices
- **Minimalist Aesthetic**: Focused on white space and subtle shadows for a modern, clean look.
- **Color Coding**: Consistent use of Indigo for primary actions, Green for income, and Rose for expenses.
- **Animations**: Subtle entry animations using Tailwind's `animate-in` for a polished feel.
