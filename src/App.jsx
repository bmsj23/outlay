import { useState } from 'react'
import { AddExpenseButton } from './components/AddExpenseButton.jsx'
import { AppFooter } from './components/AppFooter.jsx'
import { AppHeader } from './components/AppHeader.jsx'
import { ExpenseFormDialog } from './components/ExpenseFormDialog.jsx'
import { ViewSwitcher } from './components/ViewSwitcher.jsx'
import { ExpensesView } from './views/ExpensesView.jsx'
import { WeeklySummaryView } from './views/WeeklySummaryView.jsx'
import './App.css'
import './styles/expense-entry.css'

const App = () => {
  const [activeView, setActiveView] = useState('expenses')
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const isExpensesView = activeView === 'expenses'

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="app-container main-content" id="main-content">
        <div className="page-heading">
          <div className="page-intro">
            <h1>{isExpensesView ? 'Expenses' : 'Weekly Summary'}</h1>
            <p>
              {isExpensesView
                ? 'Report and review your submitted work expenses.'
                : 'Review total work expenses by week for the selected year.'}
            </p>
          </div>

          <div className="page-actions">
            {isExpensesView ? (
              <AddExpenseButton
                className="desktop-add-expense"
                onClick={() => setIsExpenseFormOpen(true)}
              />
            ) : null}
            <ViewSwitcher
              activeView={activeView}
              onViewChange={setActiveView}
            />
          </div>
        </div>

        {isExpensesView ? (
          <ExpensesView onAddExpense={() => setIsExpenseFormOpen(true)} />
        ) : (
          <WeeklySummaryView />
        )}
      </main>

      <AppFooter />

      {isExpenseFormOpen ? (
        <ExpenseFormDialog onClose={() => setIsExpenseFormOpen(false)} />
      ) : null}
    </div>
  )
}

export default App