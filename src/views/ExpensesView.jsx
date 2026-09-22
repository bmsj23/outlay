import { AddExpenseButton } from '../components/AddExpenseButton.jsx'
import emptyReceiptIcon from '../assets/icons/empty-receipt.svg'

export const ExpensesView = ({ expenseCount, onAddExpense }) => (
  <section
    className="view-panel"
    id="expenses-panel"
    role="tabpanel"
    aria-labelledby="expenses-tab"
  >
    <div className="metric-grid" aria-label="Expense overview">
      <article className="metric-card metric-card-primary">
        <p className="metric-label">Total expenses</p>
        <p className="metric-value">₱0.00</p>
        <p className="metric-note">No expenses recorded</p>
      </article>

      <article className="metric-card">
        <p className="metric-label">This week</p>
        <p className="metric-value">₱0.00</p>
        <p className="metric-note">No activity yet</p>
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

      <div className="empty-state">
        <span className="empty-state-icon">
          <img src={emptyReceiptIcon} alt="" aria-hidden="true" />
        </span>
        <div>
          <h3>{expenseCount === 0 ? 'No expenses yet' : 'Expense saved'}</h3>
          <p>
            {expenseCount === 0
              ? 'Once an expense is added, it will be listed in this workspace.'
              : `${expenseCount} ${expenseCount === 1 ? 'expense is' : 'expenses are'} ready for review.`}
          </p>
        </div>
      </div>
    </section>

    <AddExpenseButton
      className="mobile-add-expense"
      onClick={onAddExpense}
    />
  </section>
)