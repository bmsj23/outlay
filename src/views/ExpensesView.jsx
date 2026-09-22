import { AddExpenseButton } from '../components/AddExpenseButton.jsx'
import emptyReceiptIcon from '../assets/icons/empty-receipt.svg'

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

export const ExpensesView = ({ expenses, onAddExpense }) => {
  const expenseCount = expenses.length
  const orderedExpenses = [...expenses].sort((firstExpense, secondExpense) =>
    secondExpense.date.localeCompare(firstExpense.date),
  )
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  )
  const currentWeekTotal = expenses.reduce(
    (total, expense) =>
      isDateInCurrentWeek(expense.date) ? total + expense.amount : total,
    0,
  )

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
            {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'}
          </span>
        </div>

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
                    <tr key={expense.id}>
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
                  <div>
                    <p className="expense-description">{expense.description}</p>
                    <p className="expense-date">
                      {formatExpenseDate(expense.date)}
                    </p>
                  </div>
                  <p className="expense-amount">
                    {currencyFormatter.format(expense.amount)}
                  </p>
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