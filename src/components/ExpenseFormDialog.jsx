import { useEffect, useRef, useState } from 'react'
import closeIcon from '../assets/icons/close.svg'
import plusIcon from '../assets/icons/plus.svg'

const initialFormValues = {
  description: '',
  date: '',
  amount: '',
}

export const ExpenseFormDialog = ({ onAddExpense, onClose }) => {
  const dialogRef = useRef(null)
  const descriptionInputRef = useRef(null)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [errors, setErrors] = useState({})

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

    setFormValues(initialFormValues)
    setErrors({})
    onAddExpense({
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
            <h2 id="expense-dialog-title">Add Expense</h2>
            <p id="expense-dialog-description">Log a new work expense.</p>
          </div>
          <button
            className="dialog-close-button"
            type="button"
            aria-label="Close Add Expense"
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
              placeholder="e.g. Client lunch meeting"
              autoComplete="off"
              aria-invalid={Boolean(errors.description)}
              aria-describedby="expense-description-message"
              onChange={handleInputChange}
            />
            <p
              id="expense-description-message"
              className="field-message"
              data-error={Boolean(errors.description)}
            >
              {errors.description ||
                'Brief description of the work-related expense.'}
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="expense-date">Date</label>
            <input
              id="expense-date"
              name="date"
              type="date"
              value={formValues.date}
              aria-invalid={Boolean(errors.date)}
              aria-describedby="expense-date-message"
              onChange={handleInputChange}
            />
            <p
              id="expense-date-message"
              className="field-message"
              data-error={Boolean(errors.date)}
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
              <img src={plusIcon} alt="" aria-hidden="true" />
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}