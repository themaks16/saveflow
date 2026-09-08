import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const financeCoreBuildPatch = () => ({
  name: 'saveflow-finance-core-build-patch',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/App.jsx')) return null
    let s = code
    s = s.replace("import './ReferenceTheme.css'", "import './ReferenceTheme.css'\nimport { RATES, toMdl, fromMdl, localDateKey, localMonthKey, calculateHealth } from './lib/financeCore'")
    s = s.replace("\nconst RATES = { MDL: 1, EUR: 19.5, USD: 17.5 }\n", "\n")
    s = s.replace("const todayKey = () => new Date().toISOString().slice(0, 10)", "const todayKey = () => localDateKey()")
    s = s.replace("const mdlToDisplay = (v, c) => Number(v || 0) / (RATES[c] || 1)", "const mdlToDisplay = (v, c) => fromMdl(v, c)")
    s = s.replace("const displayToMdl = (v, c) => Number(v || 0) * (RATES[c] || 1)", "const displayToMdl = (v, c) => toMdl(v, c)")
    s = s.replace('const currentMonthKey = todayKey().slice(0, 7)', 'const currentMonthKey = localMonthKey()')
    s = s.replace('const availableBalance = Math.max(0, totalIncome - totalExpenses - totalSaved)', 'const availableBalance = totalIncome - totalExpenses - totalSaved')
    s = s.replace(/const financialHealth = useMemo\(\(\) => \{\n    const income = Math\.max\(profileMonthlyIncome, totalIncome, 1\)\n    const saveRate = Math\.min\(1, totalSaved \/ income\)\n    const spendingRate = Math\.min\(1, monthTotal \/ income\)\n    const budget = weeklyBudget > 0 \? Math\.max\(0, 1 - weekTotal \/ weeklyBudget\) : \.5\n    return Math\.round\(Math\.min\(100, Math\.max\(0, 35\*saveRate \+ 35\*\(1-spendingRate\) \+ 20\*budget \+ 10\)\)\)\n  \}, \[profileMonthlyIncome,totalIncome,totalSaved,monthTotal,weeklyBudget,weekTotal\]\)/, `const financialHealth = useMemo(() => calculateHealth({\n    income: Math.max(profileMonthlyIncome, totalIncome, 0),\n    expenses: monthTotal,\n    savings: totalSaved,\n    weeklySpent: weekTotal,\n    weeklyBudget,\n    emergencyMonths: 0,\n  }), [profileMonthlyIncome, totalIncome, monthTotal, totalSaved, weekTotal, weeklyBudget])`)
    s = s.replace("    if (e) { setError(e.message); return }\n    setAmount(''); setNote(''); setModal(null); await load()", `    if (e) { setError(e.message); return }\n    if (paymentMethod === 'cash' || paymentMethod === 'card') {\n      const nextCash = paymentMethod === 'cash' ? Number(data.cash || 0) - mdl : Number(data.cash || 0)\n      const nextCard = paymentMethod === 'card' ? Number(data.card || 0) - mdl : Number(data.card || 0)\n      const { error: balanceError } = await supabase.from('daily_balances').upsert({\n        user_id: session.user.id, balance_date: todayKey(), cash_amount: nextCash, card_amount: nextCard,\n      }, { onConflict: 'user_id,balance_date' })\n      if (balanceError) { setError(balanceError.message); return }\n    }\n    setAmount(''); setNote(''); setModal(null); await load()`)
    s = s.replace("      user_id: session.user.id, type: 'income', amount: incomeMdl, category: 'Income', note: incomeSource || 'Venit',\n      payment_method: null, transaction_date: todayKey(),", "      user_id: session.user.id, type: 'income', amount: incomeMdl, category: 'Income', note: incomeSource || 'Venit',\n      payment_method: paymentMethod, transaction_date: todayKey(),")
    s = s.replace("    if (save > 0) {", `    if (paymentMethod === 'cash' || paymentMethod === 'card') {\n      const netIncomeMdl = incomeMdl - saveMdl\n      const nextCash = paymentMethod === 'cash' ? Number(data.cash || 0) + netIncomeMdl : Number(data.cash || 0)\n      const nextCard = paymentMethod === 'card' ? Number(data.card || 0) + netIncomeMdl : Number(data.card || 0)\n      const { error: balanceError } = await supabase.from('daily_balances').upsert({\n        user_id: session.user.id, balance_date: todayKey(), cash_amount: nextCash, card_amount: nextCard,\n      }, { onConflict: 'user_id,balance_date' })\n      if (balanceError) { setError(balanceError.message); return }\n    }\n    if (save > 0) {`)
    s = s.replace("<label>{ui('Sursă','Source','Источник')}</label><input value={incomeSource} onChange={e=>setIncomeSource(e.target.value)} placeholder=\"Salariu\"/>", "<label>{ui('Sursă','Source','Источник')}</label><input value={incomeSource} onChange={e=>setIncomeSource(e.target.value)} placeholder=\"Salariu\"/><label>{ui('Unde ai primit banii?','Where did you receive the money?','Куда поступили деньги?')}</label><div className=\"payment-choice\"><button className={paymentMethod==='cash'?'selected':''} onClick={()=>setPaymentMethod('cash')}>💵 {t.cash}</button><button className={paymentMethod==='card'?'selected':''} onClick={()=>setPaymentMethod('card')}>💳 {t.card}</button></div>")
    return { code: s, map: null }
  },
})

export default defineConfig({
  plugins: [financeCoreBuildPatch(), react()],
})
