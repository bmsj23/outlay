import { useState } from 'react'
import { AddExpenseButton } from '../components/AddExpenseButton.jsx'
import { ExpenseSortButton } from '../components/ExpenseSortButton.jsx'
import closeIcon from '../assets/icons/close.svg'
import emptyReceiptIcon from '../assets/icons/empty-receipt.svg'
import searchIcon from '../assets/icons/search.svg'

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const formatExpenseDate = (date) =>
  dateFormatter.format(new Date(`${date}T00:00:00`))

const isDateInCurrentWeek = (date) => {
  const today = new Date()
  const dayOffset = (today.getDay() + 6) % 7
  const weekStart = new Date(today)
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(today.getDate() - dayOffset)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  const expenseDate = new Date(`${date}T00:00:00`)
  return expenseDate >= weekStart && expenseDate < weekEnd
}

export const ExpensesView = ({
  expenses,
  onAddExpense,
  onSelectExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const expenseCount = expenses.length
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase()

  const filteredExpenses = normalizedSearchQuery
    ? expenses.filter((expense) =>
        expense.description.toLocaleLowerCase().includes(normalizedSearchQuery),
      )
    : expenses

  const orderedExpenses =
    sortOrder === 'newest'
      ? [...filteredExpenses].reverse()
      : filteredExpenses

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  )

  const currentWeekTotal = expenses.reduce(
    (total, expense) =>
      isDateInCurrentWeek(expense.date) ? total + expense.amount : total,
    0,
  )

  const handleExpenseKeyDown = (event, expenseId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectExpense(expenseId)
    }
  }

  return (
    <section
      className="view-panel"
      id="expenses-panel"
      role="tabpanel"
      aria-labelledby="expenses-tab"
    >
      <div className="metric-grid" aria-label="Expense overview">
        <article className="metric-card metric-card-primary">
          <p className="metric-label">Total expenses</p>
          <p className="metric-value">{currencyFormatter.format(totalExpenses)}</p>
          <p className="metric-note">
            {expenseCount === 0
              ? 'No expenses recorded'
              : `${expenseCount} ${expenseCount === 1 ? 'expense' : 'expenses'} recorded`}
          </p>
        </article>

        <article className="metric-card">
          <p className="metric-label">This week</p>
          <p className="metric-value">
            {currencyFormatter.format(currentWeekTotal)}
          </p>
          <p className="metric-note">
            {currentWeekTotal === 0 ? 'No activity yet' : 'Monday to Sunday'}
          </p>
        </article>
      </div>

      <section className="ledger-card" aria-labelledby="history-heading">
        <div className="section-heading">
          <div>
            <h2 id="history-heading">Expense History</h2>
            <p>Your submitted work expenses will appear here.</p>
          </div>
          <span className="count-badge">
            {normalizedSearchQuery
              ? `${filteredExpenses.length} of ${expenseCount}`
              : expenseCount}{' '}
            {expenseCount === 1 ? 'expense' : 'expenses'}
          </span>
        </div>

        {expenseCount > 0 ? (
          <div className="history-search-row">
            <div className="expense-search">
              <img src={searchIcon} alt="" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                aria-label="Search expenses by description"
                placeholder="Search expenses by description..."
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear expense search"
                  onClick={() => setSearchQuery('')}
                >
                  <img src={closeIcon} alt="" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <ExpenseSortButton
              sortOrder={sortOrder}
              onToggle={() =>
                setSortOrder((currentOrder) =>
                  currentOrder === 'newest' ? 'oldest' : 'newest',
                )
              }
            />
          </div>
        ) : null}

        {expenseCount === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">
              <img src={emptyReceiptIcon} alt="" aria-hidden="true" />
            </span>
            <div>
              <h3>No expenses yet</h3>
              <p>Once an expense is added, it will be listed in this workspace.</p>
            </div>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="empty-state search-empty-state">
            <span className="empty-state-icon">
              <img src={searchIcon} alt="" aria-hidden="true" />
            </span>
            <div>
              <h3>No matching expenses</h3>
              <p>Try a different description or clear your search.</p>
              <button type="button" onClick={() => setSearchQuery('')}>
                Clear search
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="expense-table-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${expense.description} expense details`}
                      onClick={() => onSelectExpense(expense.id)}
                      onKeyDown={(event) =>
                        handleExpenseKeyDown(event, expense.id)
                      }
                    >
                      <td>{formatExpenseDate(expense.date)}</td>
                      <td>{expense.description}</td>
                      <td>{currencyFormatter.format(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="expense-list" aria-label="Expense history">
              {orderedExpenses.map((expense) => (
                <li className="expense-list-item" key={expense.id}>
                  <button
                    className="expense-list-button"
                    type="button"
                    aria-label={`View ${expense.description} expense details`}
                    onClick={() => onSelectExpense(expense.id)}
                  >
                    <div>
                      <p className="expense-description">
                        {expense.description}
                      </p>
                      <p className="expense-date">
                        {formatExpenseDate(expense.date)}
                      </p>
                    </div>
                    <p className="expense-amount">
                      {currencyFormatter.format(expense.amount)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <AddExpenseButton
        className="mobile-add-expense"
        onClick={onAddExpense}
      />
    </section>
  )
}