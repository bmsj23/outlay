export const ExpenseSortButton = ({ sortOrder, onToggle }) => (
  <button
    className="expense-sort-button"
    type="button"
    aria-label={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} added first`}
    onClick={onToggle}
  >
    <span>Sort</span>
    <strong>
      {sortOrder === 'newest' ? 'Newest added' : 'Oldest added'}
    </strong>
  </button>
)