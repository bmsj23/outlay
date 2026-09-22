import { useEffect, useRef, useState } from 'react'
import closeIcon from '../assets/icons/close.svg'
import plusIcon from '../assets/icons/plus.svg'

const DESCRIPTION_MAX_LENGTH = 120

const formatDateForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const createInitialFormValues = (expense) =>
  expense
    ? {
        description: expense.description,
        date: expense.date,
        amount: String(expense.amount),
      }
    : {
        description: '',
        date: formatDateForInput(new Date()),
        amount: '',
      }

export const ExpenseFormDialog = ({ expense, onClose, onSubmitExpense }) => {
  const dialogRef = useRef(null)
  const descriptionInputRef = useRef(null)
  const [formValues, setFormValues] = useState(() =>
    createInitialFormValues(expense),
  )
  const [errors, setErrors] = useState({})
  const isEditing = Boolean(expense)

  useEffect(() => {
    const dialog = dialogRef.current
    const previouslyFocusedElement = document.activeElement
    const previousBodyOverflow = document.body.style.overflow

    dialog.showModal()
    descriptionInputRef.current?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousBodyOverflow
      previouslyFocusedElement?.focus()
    }
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))

    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors

      const nextErrors = { ...currentErrors }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const description = formValues.description.trim()
    const amount = Number(formValues.amount)
    const nextErrors = {}

    if (!description) {
      nextErrors.description = 'Enter an expense description.'
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
      nextErrors.description = `Keep the description within ${DESCRIPTION_MAX_LENGTH} characters.`
    }

    if (!formValues.date) {
      nextErrors.date = 'Select the transaction date.'
    }

    if (
      !formValues.amount.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      nextErrors.amount = 'Enter an amount greater than zero.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }

    setFormValues(createInitialFormValues(expense))
    setErrors({})
    onSubmitExpense({
      date: formValues.date,
      description,
      amount,
    })
  }

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
      aria-labelledby="expense-dialog-title"
      aria-describedby="expense-dialog-description"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="expense-dialog-card">
        <span className="sheet-handle" aria-hidden="true" />

        <header className="expense-dialog-header">
          <div>
            <h2 id="expense-dialog-title">
              {isEditing ? 'Edit Expense' : 'Add Expense'}
            </h2>
            <p id="expense-dialog-description">
              {isEditing
                ? 'Update this recorded expense.'
                : 'Log a new work expense.'}
            </p>
          </div>
          <button
            className="dialog-close-button"
            type="button"
            aria-label={`Close ${isEditing ? 'Edit' : 'Add'} Expense`}
            onClick={onClose}
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </header>

        <form className="expense-form" noValidate onSubmit={handleSubmit}>
          <div className="form-field form-field-description">
            <label htmlFor="expense-description">Description</label>
            <input
              id="expense-description"
              ref={descriptionInputRef}
              name="description"
              type="text"
              value={formValues.description}
              maxLength={DESCRIPTION_MAX_LENGTH}
              placeholder="e.g. Client lunch meeting"
              autoComplete="off"
              aria-invalid={Boolean(errors.description)}
              aria-describedby="expense-description-message"
              onChange={handleInputChange}
            />
            <div
              id="expense-description-message"
              className="field-message field-message-with-count"
              data-error={Boolean(errors.description)}
            >
              <span aria-live="polite">
                {errors.description ||
                  'Brief description of the work-related expense.'}
              </span>
              <span aria-label={`${formValues.description.length} of ${DESCRIPTION_MAX_LENGTH} characters used`}>
                {formValues.description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="expense-date">Date</label>
            <input
              id="expense-date"
              name="date"
              type="date"
              value={formValues.date}
              autoComplete="off"
              aria-invalid={Boolean(errors.date)}
              aria-describedby="expense-date-message"
              onChange={handleInputChange}
            />
            <p
              id="expense-date-message"
              className="field-message"
              data-error={Boolean(errors.date)}
              aria-live="polite"
            >
              {errors.date || 'Transaction date'}
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="expense-amount">Amount</label>
            <div className="amount-input">
              <span aria-hidden="true">₱</span>
              <input
                id="expense-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={formValues.amount}
                placeholder="0.00"
                autoComplete="off"
                aria-invalid={Boolean(errors.amount)}
                aria-describedby="expense-amount-message"
                onChange={handleInputChange}
              />
              <span className="currency-suffix">PHP</span>
            </div>
            <p
              id="expense-amount-message"
              className="field-message"
              data-error={Boolean(errors.amount)}
              aria-live="polite"
            >
              {errors.amount || 'Philippine Peso (PHP)'}
            </p>
          </div>

          <div className="expense-form-actions">
            <button
              className="form-button form-button-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="form-button form-button-primary"
              type="submit"
            >
              {isEditing ? null : (
                <img src={plusIcon} alt="" aria-hidden="true" />
              )}
              {isEditing ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}