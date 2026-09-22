const EXPENSE_STORAGE_KEY = 'outlay.expenses.v1'

const isValidExpense = (expense) =>
  expense !== null &&
  typeof expense === 'object' &&
  typeof expense.id === 'string' &&
  expense.id.trim().length > 0 &&
  typeof expense.date === 'string' &&
  !Number.isNaN(Date.parse(`${expense.date}T00:00:00`)) &&
  typeof expense.description === 'string' &&
  expense.description.trim().length > 0 &&
  typeof expense.amount === 'number' &&
  Number.isFinite(expense.amount) &&
  expense.amount > 0

export const loadExpenses = () => {
  if (typeof window === 'undefined') return []

  try {
    const storedExpenses = window.localStorage.getItem(EXPENSE_STORAGE_KEY)
    if (!storedExpenses) return []

    const parsedExpenses = JSON.parse(storedExpenses)

    return Array.isArray(parsedExpenses)
      ? parsedExpenses.filter(isValidExpense)
      : []
  } catch {
    return []
  }
}

export const saveExpenses = (expenses) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(expenses))
  } catch {
    // the app will remain usable when browser storage is unavailable.
  }
}