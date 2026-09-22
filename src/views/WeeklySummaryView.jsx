import { useState } from 'react'
import calendarAccentIcon from '../assets/icons/calendar-accent.svg'
import chevronDownIcon from '../assets/icons/chevron-down.svg'
import { WeeklyDetailDialog } from '../components/WeeklyDetailDialog.jsx'
import { aggregateExpensesByWeek } from '../utils/weeklyExpenses.js'

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const formatDateRange = (startDate, endDate) =>
  `${dateFormatter.format(new Date(`${startDate}T00:00:00Z`))} - ${dateFormatter.format(new Date(`${endDate}T00:00:00Z`))}`

export const WeeklySummaryView = ({ expenses }) => {
  const currentYear = new Date().getFullYear()
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(null)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const availableYears = [
    ...new Set([
      currentYear,
      ...expenses
        .map((expense) => Number(expense.date.slice(0, 4)))
        .filter(Number.isInteger),
    ]),
  ].sort((firstYear, secondYear) => secondYear - firstYear)
  const weeks = aggregateExpensesByWeek(expenses, selectedYear)
  const annualTotal = weeks.reduce((total, week) => total + week.total, 0)
  const averagePerWeek = weeks.length > 0 ? annualTotal / weeks.length : 0
  const highestWeeklyTotal = Math.max(...weeks.map((week) => week.total), 0)
  const currentWeek = weeks.find((week) => week.isCurrentWeek)
  const peakWeek =
    annualTotal > 0
      ? weeks.reduce((peak, week) => (week.total > peak.total ? week : peak))
      : null
  const selectedWeek =
    weeks.find((week) => week.weekNumber === selectedWeekNumber) ?? null
  const selectedWeekExpenses = selectedWeek
    ? expenses
        .filter(
          (expense) =>
            expense.date >= selectedWeek.startDate &&
            expense.date <= selectedWeek.endDate,
        )
    : []

  const handleWeekKeyDown = (event, weekNumber) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedWeekNumber(weekNumber)
    }
  }

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value))
    setSelectedWeekNumber(null)
  }

  return (
    <section
      className="view-panel weekly-summary"
      id="weekly-panel"
      role="tabpanel"
      aria-labelledby="weekly-tab"
    >
      <div className="weekly-context">
        <label htmlFor="summary-year">Calendar year</label>
        <div className="weekly-year-control">
          <img
            className="weekly-year-icon"
            src={calendarAccentIcon}
            alt=""
            aria-hidden="true"
          />
          <select
            id="summary-year"
            className="weekly-year-select"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <img
            className="weekly-year-chevron"
            src={chevronDownIcon}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="weekly-metric-grid" aria-label="Annual expense overview">
        <article className="weekly-metric-card weekly-metric-primary">
          <p>Total for {selectedYear}</p>
          <strong>{currencyFormatter.format(annualTotal)}</strong>
          <span>All recorded expenses this year</span>
        </article>
        <article className="weekly-metric-card weekly-metric-current">
          <p>Current week</p>
          <strong>
            {currencyFormatter.format(currentWeek?.total ?? 0)}
          </strong>
          <span>
            {currentWeek
              ? `Week ${currentWeek.weekNumber} · ${formatDateRange(currentWeek.startDate, currentWeek.endDate)}`
              : 'Outside the selected year'}
          </span>
        </article>
        <article className="weekly-metric-card">
          <p>Average per week</p>
          <strong>{currencyFormatter.format(averagePerWeek)}</strong>
          <span>Across {weeks.length} calendar weeks</span>
        </article>
        <article className="weekly-metric-card">
          <p>Peak week</p>
          <strong>{peakWeek ? `Week ${peakWeek.weekNumber}` : 'No activity'}</strong>
          <span>
            {peakWeek
              ? currencyFormatter.format(peakWeek.total)
              : 'No expenses recorded'}
          </span>
        </article>
      </div>

      <section className="weekly-chart" aria-labelledby="chart-heading">
        <div className="weekly-chart-heading">
          <div>
            <h2 id="chart-heading">Expenses by Week</h2>
            <p>All {weeks.length} weeks of {selectedYear}</p>
          </div>
          <span>PHP</span>
        </div>

        <div className="weekly-chart-body">
          <div className="weekly-chart-scale" aria-hidden="true">
            <span>{currencyFormatter.format(highestWeeklyTotal)}</span>
            <span>{currencyFormatter.format(0)}</span>
          </div>
          <div
            className="weekly-chart-scroll"
            role="group"
            aria-label={`Weekly expense chart for ${selectedYear}`}
            tabIndex={0}
          >
            <ol
              className="weekly-chart-bars"
              style={{ '--week-count': weeks.length }}
            >
              {weeks.map((week) => {
                const barHeight =
                  highestWeeklyTotal > 0
                    ? (week.total / highestWeeklyTotal) * 100
                    : 0

                return (
                  <li
                    key={week.weekNumber}
                    aria-current={week.isCurrentWeek ? 'date' : undefined}
                    data-current={week.isCurrentWeek}
                    data-has-value={week.total > 0}
                  >
                    <button
                      className="weekly-chart-bar-button"
                      type="button"
                      aria-label={`View Week ${week.weekNumber}, ${formatDateRange(week.startDate, week.endDate)}, ${currencyFormatter.format(week.total)}`}
                      onClick={() => setSelectedWeekNumber(week.weekNumber)}
                    >
                      <span className="weekly-chart-tooltip" aria-hidden="true">
                        <strong>Week {week.weekNumber}</strong>
                        <span>{formatDateRange(week.startDate, week.endDate)}</span>
                        <b>{currencyFormatter.format(week.total)}</b>
                      </span>
                      <span
                        className="weekly-chart-bar-fill"
                        style={{ '--bar-height': `${barHeight}%` }}
                      />
                      <span className="weekly-chart-label" aria-hidden="true">
                        {week.weekNumber % 4 === 1 ||
                        week.weekNumber === weeks.length
                          ? week.weekNumber
                          : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="weekly-breakdown" aria-labelledby="breakdown-heading">
        <div className="weekly-breakdown-heading">
          <div>
            <h2 id="breakdown-heading">Weekly Breakdown</h2>
            <p>Monday-to-Sunday totals for the complete calendar year.</p>
          </div>
          <span>{weeks.length} weeks</span>
        </div>

        <div className="weekly-table-wrap">
          <table className="weekly-table">
            <thead>
              <tr>
                <th scope="col">Week</th>
                <th scope="col">Date range</th>
                <th scope="col">Total amount</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr
                  key={week.weekNumber}
                  role="button"
                  tabIndex={0}
                  aria-label={`View Week ${week.weekNumber} details`}
                  data-current={week.isCurrentWeek}
                  onClick={() => setSelectedWeekNumber(week.weekNumber)}
                  onKeyDown={(event) =>
                    handleWeekKeyDown(event, week.weekNumber)
                  }
                >
                  <td>Week {week.weekNumber}</td>
                  <td>{formatDateRange(week.startDate, week.endDate)}</td>
                  <td>{currencyFormatter.format(week.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ol className="weekly-list" aria-label="Weekly expense totals">
          {weeks.map((week) => (
            <li key={week.weekNumber} data-current={week.isCurrentWeek}>
              <button
                className="weekly-list-button"
                type="button"
                aria-label={`View Week ${week.weekNumber}, ${formatDateRange(week.startDate, week.endDate)}, ${currencyFormatter.format(week.total)}`}
                onClick={() => setSelectedWeekNumber(week.weekNumber)}
              >
                <div>
                  <strong>Week {week.weekNumber}</strong>
                  <span>{formatDateRange(week.startDate, week.endDate)}</span>
                </div>
                <p>{currencyFormatter.format(week.total)}</p>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {selectedWeek ? (
        <WeeklyDetailDialog
          expenses={selectedWeekExpenses}
          week={selectedWeek}
          onClose={() => setSelectedWeekNumber(null)}
        />
      ) : null}
    </section>
  )
}