import assert from 'node:assert/strict'
import {
  toMdl,
  fromMdl,
  localDateKey,
  calculateBalance,
  calculateHealth,
  calculateAffordability,
  calculateMonthlyMetrics,
  calculateEmergencyMonths,
  calculateSpendingPace,
  calculatePaymentBalances,
  calculateDailyBudget,
} from './financeCore.js'

assert.equal(toMdl(100, 'EUR'), 1950)
assert.equal(toMdl(100, 'USD'), 1750)
assert.equal(fromMdl(1950, 'EUR'), 100)
assert.equal(localDateKey(new Date(2026, 8, 8, 12)), '2026-09-08')

const tx = [
  { type: 'income', amount: 10000, transaction_date: '2026-09-01' },
  { type: 'expense', amount: 2500, transaction_date: '2026-09-02' },
  { type: 'expense', amount: 500, transaction_date: '2026-09-03' },
]

assert.equal(calculateBalance({ income: 10000, expenses: 3000, savings: 0 }), 7000)

const balances = calculatePaymentBalances({
  initialCash: 100,
  initialCard: 500,
  savings: 50,
  transactions: [
    { type: 'expense', amount: 50, payment_method: 'cash' },
    { type: 'income', amount: 200, payment_method: 'card' },
  ],
})
assert.equal(balances.cash, 50)
assert.equal(balances.card, 700)
assert.equal(balances.total, 750)
assert.equal(balances.afterSavings, 700)

const affordable = calculateAffordability({ balance: 7000, purchase: 500, safeDailySpend: 300, safetyDays: 3 })
assert.equal(affordable.affordable, true)
assert.equal(affordable.after, 6500)
assert.equal(affordable.safeLimit, 900)

const expensive = calculateAffordability({ balance: 7000, purchase: 8000, safeDailySpend: 300, safetyDays: 3 })
assert.equal(expensive.affordable, false)
assert.equal(expensive.after, -1000)

const daily = calculateDailyBudget({ monthlyIncome: 3000, fixedCosts: 1500, savingsTargetPercent: 10, daysInMonth: 30 })
assert.equal(daily.daily, 40)
assert.equal(calculateDailyBudget({ monthlyIncome: 1000, fixedCosts: 900, savingsTargetPercent: 10, daysInMonth: 30, spentToday: 20 }).remainingToday, 0)

const savings = [{ amount: 1000, contribution_date: '2026-09-04' }]
const metrics = calculateMonthlyMetrics({ transactions: tx, savings, month: '2026-09' })
assert.equal(metrics.income, 10000)
assert.equal(metrics.expenses, 3000)
assert.equal(metrics.saved, 1000)
assert.equal(metrics.balanceChange, 6000)
assert.equal(metrics.savingsRate, 10)
assert.equal(metrics.spendingRate, 30)

assert.equal(calculateEmergencyMonths({ savings: 9000, monthlyEssentialCosts: 3000 }), 3)
const pace = calculateSpendingPace({ spent: 3000, daysElapsed: 8, monthDays: 30, budget: 12000 })
assert.equal(pace.projected, 11250)
assert.equal(pace.ratio, 0.9375)

assert.ok(calculateHealth({ income: 10000, expenses: 3000, savings: 2000, weeklySpent: 500, weeklyBudget: 1000, emergencyMonths: 3 }) >= 0)

console.log('SaveFlow financeCore tests: OK')
