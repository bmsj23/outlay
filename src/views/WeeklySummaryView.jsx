import calendarAccentIcon from '../assets/icons/calendar-accent.svg'

export const WeeklySummaryView = () => (
  <section
    className="view-panel"
    id="weekly-panel"
    role="tabpanel"
    aria-labelledby="weekly-tab"
  >
    <section className="weekly-placeholder" aria-labelledby="weekly-heading">
      <span className="empty-state-icon">
        <img src={calendarAccentIcon} alt="" aria-hidden="true" />
      </span>
      <div>
        <h2 id="weekly-heading">No weekly activity yet</h2>
        <p>
          Weekly totals for the year will appear here after work expenses are
          recorded.
        </p>
      </div>
    </section>
  </section>
)
