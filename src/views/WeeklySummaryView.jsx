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
  const selectedYear = new Date().getFullYear()
  const weeks = aggregateExpensesByWeek(expenses, selectedYear)
  const annualTotal = weeks.reduce((total, week) => total + week.total, 0)
  const averagePerWeek = weeks.length > 0 ? annualTotal / weeks.length : 0
  const peakWeek =
    annualTotal > 0
      ? weeks.reduce((peak, week) => (week.total > peak.total ? week : peak))
      : null

  return (
    <section
      className="view-panel weekly-summary"
      id="weekly-panel"
      role="tabpanel"
      aria-labelledby="weekly-tab"
    >
      <div className="weekly-context">
        <p>Calendar year</p>
        <strong>{selectedYear}</strong>
      </div>

      <div className="weekly-metric-grid" aria-label="Annual expense overview">
        <article className="weekly-metric-card weekly-metric-primary">
          <p>Total for {selectedYear}</p>
          <strong>{currencyFormatter.format(annualTotal)}</strong>
          <span>All recorded expenses this year</span>
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
                <tr key={week.weekNumber} data-current={week.isCurrentWeek}>
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
              <div>
                <strong>Week {week.weekNumber}</strong>
                <span>{formatDateRange(week.startDate, week.endDate)}</span>
              </div>
              <p>{currencyFormatter.format(week.total)}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}