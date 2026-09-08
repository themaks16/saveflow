export const RATES = Object.freeze({ MDL: 1, EUR: 19.5, USD: 17.5 })

export const toMdl = (amount, currency = 'MDL') => Number(amount || 0) * (RATES[currency] || 1)
export const fromMdl = (amount, currency = 'MDL') => Number(amount || 0) / (RATES[currency] || 1)

export const localDateKey = (date = new Date()) => {
  const d = date instanceof Date ? new Date(date) : new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const localMonthKey = (date = new Date()) => localDateKey(date).slice(0, 7)
export const isSameLocalMonth = (value, date = new Date()) => localMonthKey(value) === localMonthKey(date)
export const daysAgo = (days, date = new Date()) => { const d = new Date(date); d.setDate(d.getDate() - Number(days || 0)); return d }
export const isWithinDays = (value, days, now = new Date()) => { const d = new Date(value); const limit = Number(days || 0) * 86400000; return !Number.isNaN(d.getTime()) && d.getTime() <= now.getTime() && now.getTime() - d.getTime() <= limit }
export const sumBy = (items = [], selector = item => item) => items.reduce((sum, item) => sum + Number(selector(item) || 0), 0)
export const calculateBalance = ({ income = 0, expenses = 0, savings = 0 }) => Number(income) - Number(expenses) - Number(savings)

export const calculatePaymentBalances = ({ transactions = [], initialCash = 0, initialCard = 0, savings = 0 }) => {
  let cash = Number(initialCash) || 0
  let card = Number(initialCard) || 0
  for (const tx of transactions) {
    const amount = Math.max(0, Number(tx.amount) || 0)
    if (tx.type === 'income') {
      if (tx.payment_method === 'cash') cash += amount
      else if (tx.payment_method === 'card') card += amount
    } else if (tx.type === 'expense') {
      if (tx.payment_method === 'cash') cash -= amount
      else if (tx.payment_method === 'card') card -= amount
    }
  }
  const total = cash + card
  return { cash, card, total, afterSavings: total - (Number(savings) || 0) }
}

export const calculateAffordability = ({ balance = 0, purchase = 0, safeDailySpend = 0, safetyDays = 3 }) => {
  const b = Number(balance) || 0
  const p = Math.max(0, Number(purchase) || 0)
  const safeLimit = Math.max(0, Number(safeDailySpend) || 0) * Math.max(0, Number(safetyDays) || 0)
  return { purchase: p, after: b - p, safeLimit, affordable: p > 0 && p <= b && p <= safeLimit }
}

export const calculateDailyBudget = ({ monthlyIncome = 0, fixedCosts = 0, savingsTargetPercent = 0, daysInMonth = 30, spentToday = 0 }) => {
  const income = Math.max(0, Number(monthlyIncome) || 0)
  const fixed = Math.max(0, Number(fixedCosts) || 0)
  const target = Math.min(100, Math.max(0, Number(savingsTargetPercent) || 0))
  const days = Math.max(1, Number(daysInMonth) || 30)
  const savingsTarget = income * target / 100
  const discretionary = Math.max(0, income - fixed - savingsTarget)
  const daily = discretionary / days
  const spent = Math.max(0, Number(spentToday) || 0)
  return { savingsTarget, discretionary, daily, spentToday: spent, remainingToday: Math.max(0, daily - spent) }
}

export const calculateHealth = ({ income = 0, expenses = 0, savings = 0, weeklySpent = 0, weeklyBudget = 0, emergencyMonths = 0 }) => {
  const safeIncome = Number(income) || 0
  if (safeIncome <= 0) return 10
  const spendingRate = Math.max(0, Number(expenses) || 0) / safeIncome
  const savingRate = Math.max(0, Number(savings) || 0) / safeIncome
  const budgetScore = weeklyBudget > 0 ? Math.max(0, Math.min(1, 1 - Math.max(0, Number(weeklySpent) || 0) / Number(weeklyBudget))) : 0.5
  const emergencyScore = Math.max(0, Math.min(1, Number(emergencyMonths) / 3))
  const spendingScore = Math.max(0, Math.min(1, 1 - spendingRate))
  const savingScore = Math.max(0, Math.min(1, savingRate))
  const score = 30 * spendingScore + 25 * savingScore + 20 * budgetScore + 15 * emergencyScore + 10 * (savingRate > 0 ? 1 : 0)
  return Math.round(Math.max(0, Math.min(100, score)))
}

export const calculateMonthlyMetrics = ({ transactions = [], savings = [], month = localMonthKey() }) => {
  const inMonth = item => localMonthKey(item.transaction_date || item.created_at) === month
  const income = sumBy(transactions.filter(x => x.type === 'income' && inMonth(x)), x => x.amount)
  const expenses = sumBy(transactions.filter(x => x.type === 'expense' && inMonth(x)), x => x.amount)
  const saved = sumBy(savings.filter(inMonth), x => x.amount)
  const balanceChange = calculateBalance({ income, expenses, savings: saved })
  return { income, expenses, saved, balanceChange, savingsRate: income > 0 ? saved / income * 100 : 0, spendingRate: income > 0 ? expenses / income * 100 : 0 }
}

export const calculateEmergencyMonths = ({ savings = 0, monthlyEssentialCosts = 0 }) => { const costs = Number(monthlyEssentialCosts) || 0; return costs > 0 ? Math.max(0, Number(savings) || 0) / costs : 0 }
export const calculateSpendingPace = ({ spent = 0, daysElapsed = 1, monthDays = 30, budget = 0 }) => { const elapsed = Math.max(1, Number(daysElapsed) || 1); const projected = Number(spent || 0) / elapsed * Number(monthDays || 30); return { projected, ratio: budget > 0 ? projected / budget : 0 } }
export const formatMoney = (amount, currency = 'MDL', locale = 'ro-MD') => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(fromMdl(amount, currency))
