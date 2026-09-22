import plusIcon from '../assets/icons/plus.svg'

export const AddExpenseButton = ({ className = '', onClick }) => (
  <button
    className={`add-expense-button ${className}`.trim()}
    type="button"
    onClick={onClick}
  >
    <img src={plusIcon} alt="" aria-hidden="true" />
    <span>Add Expense</span>
  </button>
)