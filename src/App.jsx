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
  const [editingExpenseId, setEditingExpenseId] = useState(null)

  const selectedExpense =
    expenses.find((expense) => expense.id === selectedExpenseId) ?? null
  const editingExpense =
    expenses.find((expense) => expense.id === editingExpenseId) ?? null

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const handleViewChange = (nextView) => setActiveView(nextView)
  const handleOpenExpenseForm = () => {
    setEditingExpenseId(null)
    setIsExpenseFormOpen(true)
  }
  const handleCloseExpenseForm = () => {
    setEditingExpenseId(null)
    setIsExpenseFormOpen(false)
  }
  const handleSelectExpense = (expenseId) => setSelectedExpenseId(expenseId)
  const handleCloseExpenseDetails = () => setSelectedExpenseId(null)
  const handleEditExpense = (expenseId) => {
    setEditingExpenseId(expenseId)
    setIsExpenseFormOpen(true)
  }

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

  const handleUpdateExpense = (expense) => {
    setExpenses((currentExpenses) =>
      currentExpenses.map((currentExpense) =>
        currentExpense.id === editingExpenseId
          ? { ...currentExpense, ...expense }
          : currentExpense,
      ),
    )
    handleCloseExpenseForm()
  }

  const handleDeleteExpense = (expenseId) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== expenseId),
    )
    setSelectedExpenseId(null)
  }

  return (
    <AppLayout
      activeView={activeView}
      expenses={expenses}
      editingExpense={editingExpense}
      isExpenseFormOpen={isExpenseFormOpen}
      selectedExpense={selectedExpense}
      onAddExpense={handleAddExpense}
      onCloseExpenseDetails={handleCloseExpenseDetails}
      onCloseExpenseForm={handleCloseExpenseForm}
      onDeleteExpense={handleDeleteExpense}
      onEditExpense={handleEditExpense}
      onOpenExpenseForm={handleOpenExpenseForm}
      onSelectExpense={handleSelectExpense}
      onUpdateExpense={handleUpdateExpense}
      onViewChange={handleViewChange}
    />
  )
}

export default App