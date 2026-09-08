export const RATES = Object.freeze({ MDL: 1, EUR: 19.5, USD: 17.5 })

export const toMdl = (amount, currency = 'MDL') => Number(amount || 0) * (RATES[currency] || 1)
export const fromMdl = (amount, currency = 'MDL') => Number(amount || 0) / (RATES[currency] || 1)

export const localDateKey = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const localMonthKey = (date = new Date()) => localDateKey(date).slice(0, 7)

export const isSameLocalMonth = (value, date = new Date()) =>
  localMonthKey(value) === localMonthKey(date)

export const sumBy = (items, selector = item => item) =>
  items.reduce((sum, item) => sum + Number(selector(item) || 0), 0)

export const calculateBalance = ({ income = 0, expenses = 0, savings = 0 }) =>
  Number(income) - Number(expenses) - Number(savings)

export const calculateHealth = ({
  income = 0,
  expenses = 0,
  savings = 0,
  weeklySpent = 0,
  weeklyBudget = 0,
  emergencyMonths = 0,
}) => {
  const safeIncome = Math.max(Number(income) || 0, 1)
  const spendingRate = Math.min(1.5, Math.max(0, Number(expenses) / safeIncome))
  const savingRate = Math.min(1, Math.max(0, Number(savings) / safeIncome))
  const budgetScore = weeklyBudget > 0
    ? Math.max(0, Math.min(1, 1 - Number(weeklySpent) / Number(weeklyBudget)))
    : 0.5
  const emergencyScore = Math.min(1, Math.max(0, Number(emergencyMonths) / 3))

  const score =
    30 * Math.max(0, 1 - spendingRate) +
    25 * savingRate +
    20 * budgetScore +
    15 * emergencyScore +
    10 * (savingRate > 0 ? 1 : 0)

  return Math.round(Math.max(0, Math.min(100, score)))
}

export const formatMoney = (amount, currency = 'MDL', locale = 'ro-MD') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(fromMdl(amount, currency))
