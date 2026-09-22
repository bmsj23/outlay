import { useEffect, useState } from 'react'
import { AppLayout } from './components/AppLayout.jsx'
import { loadExpenses, saveExpenses } from './utils/expenseStorage.js'
import './App.css'
import './styles/expense-entry.css'
import './styles/expense-history.css'
import './styles/weekly-summary.css'

const App = () => {
  const [activeView, setActiveView] = useState('expenses')
  const [expenses, setExpenses] = useState(loadExpenses)
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState(null)

  const selectedExpense =
    expenses.find((expense) => expense.id === selectedExpenseId) ?? null

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const handleViewChange = (nextView) => setActiveView(nextView)
  const handleOpenExpenseForm = () => setIsExpenseFormOpen(true)
  const handleCloseExpenseForm = () => setIsExpenseFormOpen(false)
  const handleSelectExpense = (expenseId) => setSelectedExpenseId(expenseId)
  const handleCloseExpenseDetails = () => setSelectedExpenseId(null)

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
      selectedExpense={selectedExpense}
      onAddExpense={handleAddExpense}
      onCloseExpenseDetails={handleCloseExpenseDetails}
      onCloseExpenseForm={handleCloseExpenseForm}
      onOpenExpenseForm={handleOpenExpenseForm}
      onSelectExpense={handleSelectExpense}
      onViewChange={handleViewChange}
    />
  )
}

export default App