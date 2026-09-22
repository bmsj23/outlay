import { useEffect, useMemo, useRef, useState } from 'react'
import calendarIcon from '../assets/icons/calendar.svg'

const dayHeaders = [
  ['Sun', 'S'],
  ['Mon', 'M'],
  ['Tue', 'T'],
  ['Wed', 'W'],
  ['Thu', 'T'],
  ['Fri', 'F'],
  ['Sat', 'S'],
]

const monthFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'long',
  year: 'numeric',
})

const selectedDateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const accessibleDateFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'full',
})

const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fromDateKey = (dateKey) => {
  if (!dateKey) return null
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? null : date
}

const createMonthStart = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1)

const moveToMonth = (date, monthOffset) => {
  const targetMonth = new Date(
    date.getFullYear(),
    date.getMonth() + monthOffset,
    1,
  )
  const lastDay = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate()

  return new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    Math.min(date.getDate(), lastDay),
  )
}

const addDays = (date, numberOfDays) => {
  const nextDate = new Date(date)
  nextDate.setDate(date.getDate() + numberOfDays)
  return nextDate
}

export const DatePicker = ({
  value,
  onChange,
  invalid,
  describedBy,
}) => {
  const today = useMemo(() => new Date(), [])
  const pickerRef = useRef(null)
  const toggleRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() =>
    createMonthStart(fromDateKey(value) ?? today),
  )
  const [focusedDateKey, setFocusedDateKey] = useState(
    value || toDateKey(today),
  )
  const selectedDate = fromDateKey(value)
  const todayKey = toDateKey(today)

  const calendarDays = useMemo(() => {
    const gridStart = addDays(visibleMonth, -visibleMonth.getDay())
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [visibleMonth])

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    pickerRef.current
      ?.querySelector(`[data-date="${focusedDateKey}"]`)
      ?.focus()
  }, [focusedDateKey, isOpen, visibleMonth])

  const closePicker = () => {
    setIsOpen(false)
    toggleRef.current?.focus()
  }

  const handleToggle = () => {
    if (isOpen) {
      closePicker()
      return
    }

    const initialDate = selectedDate ?? today
    setVisibleMonth(createMonthStart(initialDate))
    setFocusedDateKey(toDateKey(initialDate))
    setIsOpen(true)

    if (window.matchMedia('(max-width: 47.99rem)').matches) {
      requestAnimationFrame(() => {
        pickerRef.current?.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        })
      })
    }
  }

  const handleSelectDate = (date) => {
    onChange(toDateKey(date))
    closePicker()
  }

  const handleMonthChange = (monthOffset) => {
    const focusedDate = fromDateKey(focusedDateKey) ?? visibleMonth
    const nextDate = moveToMonth(focusedDate, monthOffset)
    setVisibleMonth(createMonthStart(nextDate))
    setFocusedDateKey(toDateKey(nextDate))
  }

  const handleDayKeyDown = (event, date) => {
    let nextDate = null

    if (event.key === 'ArrowLeft') nextDate = addDays(date, -1)
    if (event.key === 'ArrowRight') nextDate = addDays(date, 1)
    if (event.key === 'ArrowUp') nextDate = addDays(date, -7)
    if (event.key === 'ArrowDown') nextDate = addDays(date, 7)
    if (event.key === 'Home') nextDate = addDays(date, -date.getDay())
    if (event.key === 'End') nextDate = addDays(date, 6 - date.getDay())
    if (event.key === 'PageUp') nextDate = moveToMonth(date, -1)
    if (event.key === 'PageDown') nextDate = moveToMonth(date, 1)

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closePicker()
      return
    }

    if (!nextDate) return

    event.preventDefault()
    setVisibleMonth(createMonthStart(nextDate))
    setFocusedDateKey(toDateKey(nextDate))
  }

  return (
    <div className="date-picker" ref={pickerRef}>
      <button
        className="date-picker-trigger"
        id="expense-date"
        ref={toggleRef}
        name="date"
        type="button"
        aria-label={
          selectedDate
            ? `Change date, ${accessibleDateFormatter.format(selectedDate)}`
            : 'Choose expense date'
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={handleToggle}
      >
        <span data-placeholder={!selectedDate}>
          {selectedDate
            ? selectedDateFormatter.format(selectedDate)
            : 'Select date'}
        </span>
        <img src={calendarIcon} alt="" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          className="date-picker-popover"
          role="dialog"
          aria-label="Choose expense date"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              closePicker()
            }
          }}
        >
          <div className="date-picker-header">
            <p aria-live="polite">{monthFormatter.format(visibleMonth)}</p>
            <div>
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => handleMonthChange(-1)}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => handleMonthChange(1)}
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>

          <div className="date-picker-weekdays" aria-hidden="true">
            {dayHeaders.map(([name, abbreviation]) => (
              <span title={name} key={name}>{abbreviation}</span>
            ))}
          </div>

          <div className="date-picker-grid" role="grid" aria-label={monthFormatter.format(visibleMonth)}>
            {calendarDays.map((date) => {
              const dateKey = toDateKey(date)
              const isSelected = dateKey === value
              const isToday = dateKey === todayKey
              const isOutsideMonth =
                date.getMonth() !== visibleMonth.getMonth()

              return (
                <button
                  type="button"
                  role="gridcell"
                  data-date={dateKey}
                  data-outside={isOutsideMonth}
                  data-today={isToday}
                  aria-label={accessibleDateFormatter.format(date)}
                  aria-selected={isSelected}
                  tabIndex={dateKey === focusedDateKey ? 0 : -1}
                  key={dateKey}
                  onClick={() => handleSelectDate(date)}
                  onKeyDown={(event) => handleDayKeyDown(event, date)}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="date-picker-footer">
            <button
              type="button"
              onClick={() => {
                onChange('')
                closePicker()
              }}
            >
              Clear
            </button>
            <button type="button" onClick={() => handleSelectDate(today)}>
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}