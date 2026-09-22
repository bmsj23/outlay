import { useEffect, useState } from 'react'
import { AppLayout } from './components/AppLayout.jsx'
import { loadExpenses, saveExpenses } from './utils/expenseStorage.js'
import './App.css'
import './styles/expense-entry.css'
import './styles/expense-history.css'

const App = () => {
  const [activeView, setActiveView] = useState('expenses')
  const [expenses, setExpenses] = useState(loadExpenses)
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const handleViewChange = (nextView) => setActiveView(nextView)
  const handleOpenExpenseForm = () => setIsExpenseFormOpen(true)
  const handleCloseExpenseForm = () => setIsExpenseFormOpen(false)

  const handleAddExpense = (expense) => {
    setExpenses((currentExpenses) => [
      ...currentExpenses,
      {
        id: crypto.randomUUID(),
        ...expense,
      },
    ])
    handleCloseExpenseForm()
  }

  return (
    <AppLayout
      activeView={activeView}
      expenses={expenses}
      isExpenseFormOpen={isExpenseFormOpen}
      onAddExpense={handleAddExpense}
      onCloseExpenseForm={handleCloseExpenseForm}
      onOpenExpenseForm={handleOpenExpenseForm}
      onViewChange={handleViewChange}
    />
  )
}

export default App