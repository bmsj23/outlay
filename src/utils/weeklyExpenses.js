const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

const toDateKey = (date) => date.toISOString().slice(0, 10)

const toLocalDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date, numberOfDays) =>
  new Date(date.getTime() + numberOfDays * DAY_IN_MILLISECONDS)

export const createWeeksForYear = (year, currentDate = new Date()) => {
  const yearStart = new Date(Date.UTC(year, 0, 1))
  const yearEnd = new Date(Date.UTC(year, 11, 31))
  const currentDateKey = toLocalDateKey(currentDate)
  const weeks = []
  let weekStart = yearStart

  while (weekStart <= yearEnd) {
    const daysUntilSunday = (7 - weekStart.getUTCDay()) % 7
    const naturalWeekEnd = addDays(weekStart, daysUntilSunday)
    const weekEnd = naturalWeekEnd > yearEnd ? yearEnd : naturalWeekEnd
    const startDate = toDateKey(weekStart)
    const endDate = toDateKey(weekEnd)

    weeks.push({
      weekNumber: weeks.length + 1,
      startDate,
      endDate,
      total: 0,
      isCurrentWeek:
        currentDateKey >= startDate && currentDateKey <= endDate,
    })

    weekStart = addDays(weekEnd, 1)
  }

  return weeks
}

export const aggregateExpensesByWeek = (
  expenses,
  year,
  currentDate = new Date(),
) =>
  createWeeksForYear(year, currentDate).map((week) => ({
    ...week,
    total: expenses.reduce(
      (total, expense) =>
        expense.date >= week.startDate && expense.date <= week.endDate
          ? total + expense.amount
          : total,
      0,
    ),
  }))