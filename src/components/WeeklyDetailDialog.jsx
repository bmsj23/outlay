import { useEffect, useRef } from 'react'
import closeIcon from '../assets/icons/close.svg'

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const expenseDateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const formatDateRange = (startDate, endDate) =>
  `${shortDateFormatter.format(new Date(`${startDate}T00:00:00Z`))} - ${shortDateFormatter.format(new Date(`${endDate}T00:00:00Z`))}`

const formatExpenseDate = (date) =>
  expenseDateFormatter.format(new Date(`${date}T00:00:00`))

export const WeeklyDetailDialog = ({ expenses, week, onClose }) => {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previouslyFocusedElement = document.activeElement
    const previousBodyOverflow = document.body.style.overflow

    dialog.showModal()
    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousBodyOverflow
      previouslyFocusedElement?.focus()
    }
  }, [])

  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      className="expense-dialog"
      ref={dialogRef}
      aria-labelledby="weekly-detail-title"
      aria-describedby="weekly-detail-description"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="expense-dialog-card">
        <span className="sheet-handle" aria-hidden="true" />

        <header className="expense-dialog-header">
          <div>
            <h2 id="weekly-detail-title">Week {week.weekNumber}</h2>
            <p id="weekly-detail-description">
              {formatDateRange(week.startDate, week.endDate)}
            </p>
          </div>
          <button
            className="dialog-close-button"
            ref={closeButtonRef}
            type="button"
            aria-label={`Close Week ${week.weekNumber} Details`}
            onClick={onClose}
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </header>

        <div className="weekly-detail-body">
          <div className="weekly-detail-total">
            <div>
              <span>Weekly Total</span>
              <strong>{currencyFormatter.format(week.total)}</strong>
            </div>
            <span className="weekly-detail-count">
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          </div>

          {expenses.length > 0 ? (
            <ul className="weekly-detail-expenses">
              {expenses.map((expense) => (
                <li key={expense.id}>
                  <div>
                    <strong>{expense.description}</strong>
                    <span>{formatExpenseDate(expense.date)}</span>
                  </div>
                  <p>{currencyFormatter.format(expense.amount)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="weekly-detail-empty">
              <strong>No expenses this week</strong>
              <p>This week has no recorded spending.</p>
            </div>
          )}

        </div>
      </div>
    </dialog>
  )
}