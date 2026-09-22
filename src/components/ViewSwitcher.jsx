import calendarIcon from '../assets/icons/calendar.svg'
import receiptIcon from '../assets/icons/receipt.svg'

const views = [
  { id: 'expenses', label: 'Expenses', icon: receiptIcon },
  { id: 'weekly', label: 'Weekly Summary', icon: calendarIcon },
]

export const ViewSwitcher = ({ activeView, onViewChange }) => {
  const handleKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()
    const tabs = Array.from(
      event.currentTarget.querySelectorAll('[role="tab"]'),
    )
    const activeIndex = views.findIndex((view) => view.id === activeView)
    let nextIndex = activeIndex

    if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % views.length
    if (event.key === 'ArrowLeft') {
      nextIndex = (activeIndex - 1 + views.length) % views.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = views.length - 1

    onViewChange(views[nextIndex].id)
    tabs[nextIndex]?.focus()
  }

  return (
    <div
      className="view-switcher"
      role="tablist"
      aria-label="Expense views"
      onKeyDown={handleKeyDown}
    >
      {views.map(({ id, label, icon }) => {
        const isActive = activeView === id

        return (
          <button
            className="view-tab"
            type="button"
            role="tab"
            id={`${id}-tab`}
            aria-controls={`${id}-panel`}
            aria-selected={isActive}
            data-active={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onViewChange(id)}
            key={id}
          >
            <img src={icon} alt="" aria-hidden="true" />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}