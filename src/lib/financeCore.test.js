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
} from './financeCore.js'

assert.equal(toMdl(100, 'EUR'), 1950)
assert.equal(toMdl(100, 'USD'), 1750)
assert.equal(fromMdl(1950, 'EUR'), 100)
assert.match(localDateKey(new Date(2026, 8, 8, 12)), /^2026-09-08$/)

const tx = [
  { type: 'income', amount: 10000, transaction_date: '2026-09-01' },
  { type: 'expense', amount: 2500, transaction_date: '2026-09-02' },
  { type: 'expense', amount: 500, transaction_date: '2026-09-03' },
]

assert.equal(calculateBalance(tx), 7000)
assert.equal(calculateAffordability({ balance: 7000, monthlyIncome: 10000, monthlyExpenses: 3000, price: 500 }), true)
assert.equal(calculateAffordability({ balance: 7000, monthlyIncome: 10000, monthlyExpenses: 3000, price: 8000 }), false)

const metrics = calculateMonthlyMetrics(tx, new Date(2026, 8, 8, 12))
assert.equal(metrics.income, 10000)
assert.equal(metrics.expenses, 3000)
assert.equal(metrics.net, 7000)

assert.equal(calculateEmergencyMonths(9000, 3000), 3)
assert.ok(calculateSpendingPace(3000, 8, 30) > 0)
assert.ok(calculateHealth({ monthlyIncome: 10000, monthlyExpenses: 3000, savings: 2000, emergencyMonths: 3 }) >= 0)

console.log('SaveFlow financeCore tests: OK')
