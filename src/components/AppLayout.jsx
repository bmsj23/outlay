import { ExpensesView } from '../views/ExpensesView.jsx'
import { WeeklySummaryView } from '../views/WeeklySummaryView.jsx'
import { AddExpenseButton } from './AddExpenseButton.jsx'
import { AppFooter } from './AppFooter.jsx'
import { AppHeader } from './AppHeader.jsx'
import { ExpenseDetailDialog } from './ExpenseDetailDialog.jsx'
import { ExpenseFormDialog } from './ExpenseFormDialog.jsx'
import { ViewSwitcher } from './ViewSwitcher.jsx'

export const AppLayout = ({
  activeView,
  expenses,
  isExpenseFormOpen,
  selectedExpense,
  onAddExpense,
  onCloseExpenseDetails,
  onCloseExpenseForm,
  onOpenExpenseForm,
  onSelectExpense,
  onViewChange,
}) => {
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
                onClick={onOpenExpenseForm}
              />
            ) : null}
            <ViewSwitcher
              activeView={activeView}
              onViewChange={onViewChange}
            />
          </div>
        </div>

        {isExpensesView ? (
          <ExpensesView
            expenses={expenses}
            onAddExpense={onOpenExpenseForm}
            onSelectExpense={onSelectExpense}
          />
        ) : (
          <WeeklySummaryView expenses={expenses} />
        )}
      </main>

      <AppFooter />

      {isExpenseFormOpen ? (
        <ExpenseFormDialog
          onAddExpense={onAddExpense}
          onClose={onCloseExpenseForm}
        />
      ) : null}

      {selectedExpense ? (
        <ExpenseDetailDialog
          expense={selectedExpense}
          onClose={onCloseExpenseDetails}
        />
      ) : null}
    </div>
  )
}