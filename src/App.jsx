import { useState } from 'react'
import { AppFooter } from './components/AppFooter.jsx'
import { AppHeader } from './components/AppHeader.jsx'
import { ViewSwitcher } from './components/ViewSwitcher.jsx'
import { ExpensesView } from './views/ExpensesView.jsx'
import { WeeklySummaryView } from './views/WeeklySummaryView.jsx'
import './App.css'

const App = () => {
  const [activeView, setActiveView] = useState('expenses')
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

          <ViewSwitcher
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {isExpensesView ? <ExpensesView /> : <WeeklySummaryView />}
      </main>

      <AppFooter />
    </div>
  )
}

export default App