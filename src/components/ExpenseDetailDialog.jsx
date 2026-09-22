import { useEffect, useRef, useState } from 'react'
import closeIcon from '../assets/icons/close.svg'

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'long',
})

const formatExpenseDate = (date) =>
  dateFormatter.format(new Date(`${date}T00:00:00`))

export const ExpenseDetailDialog = ({
  expense,
  onClose,
  onDelete,
  onEdit,
}) => {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const deleteButtonRef = useRef(null)
  const keepExpenseButtonRef = useRef(null)
  const shouldRestoreDeleteFocusRef = useRef(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

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

  useEffect(() => {
    if (isConfirmingDelete) {
      keepExpenseButtonRef.current?.focus()
    } else if (shouldRestoreDeleteFocusRef.current) {
      deleteButtonRef.current?.focus()
      shouldRestoreDeleteFocusRef.current = false
    }
  }, [isConfirmingDelete])

  const handleCancelDelete = () => {
    shouldRestoreDeleteFocusRef.current = true
    setIsConfirmingDelete(false)
  }

  const handleCancel = (event) => {
    event.preventDefault()

    if (isConfirmingDelete) {
      handleCancelDelete()
    } else {
      onClose()
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      className="expense-dialog detail-dialog"
      ref={dialogRef}
      aria-labelledby="expense-detail-title"
      aria-describedby="expense-detail-description"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="expense-dialog-card">
        <span className="sheet-handle" aria-hidden="true" />

        <header className="expense-dialog-header">
          <div>
            <h2 id="expense-detail-title">Expense Details</h2>
            <p id="expense-detail-description">Review this recorded expense.</p>
          </div>
          <button
            className="dialog-close-button"
            ref={closeButtonRef}
            type="button"
            aria-label="Close Expense Details"
            onClick={onClose}
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </header>

        <div className="expense-detail-body">
          <div className="expense-detail-amount">
            <span>Amount</span>
            <strong>{currencyFormatter.format(expense.amount)}</strong>
          </div>

          <dl className="expense-detail-list">
            <div>
              <dt>Description</dt>
              <dd>{expense.description}</dd>
            </div>
            <div>
              <dt>Transaction Date</dt>
              <dd>{formatExpenseDate(expense.date)}</dd>
            </div>
          </dl>

          {isConfirmingDelete ? (
            <div
              className="expense-delete-confirmation"
              role="alert"
              aria-live="assertive"
            >
              <div>
                <h3>Delete this expense?</h3>
                <p>This action cannot be undone.</p>
              </div>
              <div className="expense-delete-actions">
                <button
                  className="form-button form-button-secondary"
                  ref={keepExpenseButtonRef}
                  type="button"
                  onClick={handleCancelDelete}
                >
                  Keep Expense
                </button>
                <button
                  className="form-button form-button-danger-solid"
                  type="button"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete Expense
                </button>
              </div>
            </div>
          ) : (
            <div className="expense-detail-actions">
              <button
                className="form-button form-button-secondary"
                type="button"
                onClick={() => onEdit(expense.id)}
              >
                Edit Expense
              </button>
              <button
                className="form-button form-button-danger-solid"
                ref={deleteButtonRef}
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}