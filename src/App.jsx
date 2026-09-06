import { useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'saveflow-mdl-v2'

const defaultData = {
  balance: 0,
  savings: 0,
  debt: 12000,
  incomeThisMonth: 0,
  monthlyBudget: 29600,
  weeklyBudget: 7400,
  goal: 100000,
  expenses: [],
  incomes: [],
}

const categories = [
  ['Food', '🍽️'],
  ['Rent', '🏠'],
  ['Bills', '💡'],
  ['Smoking', '🚬'],
  ['Transport', '🚗'],
  ['Subscriptions', '📱'],
  ['Entertainment', '🍿'],
  ['Shopping', '🛍️'],
  ['Other', '📦'],
]

const money = (value) => `${Math.round(value).toLocaleString('ro-MD')} MDL`

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData
  } catch {
    return defaultData
  }
}

function App() {
  const [data, setData] = useState(loadData)
  const [tab, setTab] = useState('home')
  const [modal, setModal] = useState(null)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [note, setNote] = useState('')
  const [budget, setBudget] = useState(String(data.monthlyBudget))
  const [weekly, setWeekly] = useState(String(data.weeklyBudget))
  const [goal, setGoal] = useState(String(data.goal))

  const update = (next) => {
    setData(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const expensesTotal = useMemo(
    () => data.expenses.reduce((sum, item) => sum + item.amount, 0),
    [data.expenses]
  )

  const weeklySpent = useMemo(() => {
    const now = Date.now()
    const week = 7 * 24 * 60 * 60 * 1000
    return data.expenses
      .filter((item) => now - item.createdAt < week)
      .reduce((sum, item) => sum + item.amount, 0)
  }, [data.expenses])

  const remainingWeek = Math.max(data.weeklyBudget - weeklySpent, 0)
  const dailyLimit = remainingWeek / Math.max(1, 7 - new Date().getDay())
  const savingsProgress = Math.min((data.savings / Math.max(data.goal, 1)) * 100, 100)
  const debtProgress = data.debt <= 0 ? 100 : Math.max(0, 100 - (data.debt / 12000) * 100)

  const addExpense = () => {
    const value = Number(amount)
    if (!value || value <= 0) return
    update({
      ...data,
      balance: Math.max(0, data.balance - value),
      expenses: [
        { id: Date.now(), amount: value, category, note: note || category, createdAt: Date.now() },
        ...data.expenses,
      ],
    })
    setAmount(''); setNote(''); setModal(null)
  }

  const addIncome = () => {
    const value = Number(amount)
    if (!value || value <= 0) return
    update({
      ...data,
      balance: data.balance + value,
      incomeThisMonth: data.incomeThisMonth + value,
      incomes: [{ id: Date.now(), amount: value, createdAt: Date.now() }, ...data.incomes],
    })
    setAmount(''); setModal(null)
  }

  const saveBudget = () => {
    const m = Number(budget)
    const w = Number(weekly)
    const g = Number(goal)
    if (m > 0 && w > 0 && g > 0) update({ ...data, monthlyBudget: m, weeklyBudget: w, goal: g })
    setModal(null)
  }

  const moveSavings = () => {
    const suggested = Math.min(Math.max(data.balance - 500, 0), Math.max(0, data.incomeThisMonth - data.monthlyBudget))
    const value = suggested > 0 ? suggested : Math.min(500, data.balance)
    if (value <= 0) return
    update({ ...data, balance: data.balance - value, savings: data.savings + value })
  }

  const payDebt = () => {
    const value = Math.min(data.debt, data.balance)
    if (value <= 0) return
    update({ ...data, balance: data.balance - value, debt: data.debt - value })
  }

  const reset = () => {
    if (window.confirm('Ștergi toate datele SaveFlow?')) update(defaultData)
  }

  return (
    <div className="app-shell">
      <div className="app">
        <header className="topbar">
          <div><span className="eyebrow">FINANȚELE MELE</span><h1>SaveFlow</h1></div>
          <button className="avatar" onClick={() => setModal('settings')}>E</button>
        </header>

        {tab === 'home' && <>
          <section className="hero-card">
            <div><span>SOLD DISPONIBIL</span><h2>{money(data.balance)}</h2><p>Cheltuiești cu un plan, nu din impuls.</p></div>
            <div className="hero-side"><span>VENIT LUNA</span><strong>{money(data.incomeThisMonth)}</strong></div>
          </section>

          <div className="stats-grid">
            <section className="card stat"><div className="icon">💰</div><div><span>ECONOMII</span><h3>{money(data.savings)}</h3></div></section>
            <section className="card stat"><div className="icon">💳</div><div><span>DATORIE</span><h3>{money(data.debt)}</h3></div></section>
          </div>

          <section className="card">
            <div className="section-title"><div><span className="eyebrow">SĂPTĂMÂNA ACEASTA</span><h2>Buget săptămânal</h2></div><strong>{money(weeklySpent)} / {money(data.weeklyBudget)}</strong></div>
            <div className="progress-track"><div className="progress-bar" style={{ width: `${Math.min((weeklySpent / Math.max(data.weeklyBudget, 1)) * 100, 100)}%` }} /></div>
            <div className="budget-row"><span>Rămas</span><strong>{money(remainingWeek)}</strong></div>
            <div className="tip">Poți cheltui aproximativ <b>{money(dailyLimit)}</b> pe zi și să rămâi în buget.</div>
          </section>

          <div className="actions"><button className="primary" onClick={() => setModal('expense')}>＋ Cheltuială</button><button className="secondary" onClick={() => setModal('income')}>＋ Venit</button></div>

          <section className="card">
            <div className="section-title"><div><span className="eyebrow">OBIECTIV</span><h2>Fond de siguranță</h2></div><strong>{Math.round(savingsProgress)}%</strong></div>
            <div className="progress-track"><div className="progress-bar savings" style={{ width: `${savingsProgress}%` }} /></div>
            <div className="budget-row"><span>{money(data.savings)} din {money(data.goal)}</span><button className="link-button" onClick={moveSavings}>Mută bani →</button></div>
          </section>

          <section className="card debt-card"><div><span className="eyebrow">DATORIE</span><h2>{data.debt > 0 ? `${money(data.debt)} rămași` : 'Datoria este achitată 🎉'}</h2><p>Plătește din sold fără să depășești banii disponibili.</p></div><button className="secondary small" disabled={!data.debt || !data.balance} onClick={payDebt}>Plătește</button></section>
        </>}

        {tab === 'expenses' && <>
          <section className="page-heading"><span className="eyebrow">ISTORIC</span><h2>Cheltuieli</h2><p>Total înregistrat: <b>{money(expensesTotal)}</b></p></section>
          <section className="card expense-list">{data.expenses.length === 0 ? <div className="empty">Nu ai cheltuieli înregistrate.</div> : data.expenses.map((item) => <div className="expense" key={item.id}><div className="expense-icon">{categories.find((x) => x[0] === item.category)?.[1] || '📦'}</div><div className="expense-name"><strong>{item.note}</strong><span>{item.category} · {new Date(item.createdAt).toLocaleDateString('ro-MD')}</span></div><b>-{money(item.amount)}</b></div>)}</section>
          <button className="primary full" onClick={() => setModal('expense')}>＋ Adaugă cheltuială</button>
        </>}

        {tab === 'goals' && <>
          <section className="page-heading"><span className="eyebrow">PLAN</span><h2>Obiective</h2><p>Construiește o rezervă înainte să crești cheltuielile.</p></section>
          <section className="card big-goal"><div className="goal-icon">🛡️</div><h2>Fond de siguranță</h2><div className="goal-amount">{money(data.savings)}</div><p>Țintă: {money(data.goal)}</p><div className="progress-track"><div className="progress-bar savings" style={{ width: `${savingsProgress}%` }} /></div><button className="primary full" onClick={moveSavings}>Mută bani în economii</button></section>
          <section className="card"><div className="section-title"><div><span className="eyebrow">DATORIE</span><h2>Achitare datorie</h2></div><strong>{Math.round(debtProgress)}%</strong></div><div className="progress-track"><div className="progress-bar savings" style={{ width: `${debtProgress}%` }} /></div><p className="muted">Sold datorie: {money(data.debt)}</p><button className="secondary full" disabled={!data.debt || !data.balance} onClick={payDebt}>Plătește din sold</button></section>
        </>}

        <nav className="bottom-nav"><button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>⌂<span>Acasă</span></button><button className={tab === 'expenses' ? 'active' : ''} onClick={() => setTab('expenses')}>↘<span>Cheltuieli</span></button><button className={tab === 'goals' ? 'active' : ''} onClick={() => setTab('goals')}>◎<span>Obiective</span></button></nav>

        {modal && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            {modal === 'expense' && <><div className="modal-head"><h2>Adaugă cheltuială</h2><button onClick={() => setModal(null)}>×</button></div><label>SUMĂ (MDL)</label><input className="big-input" autoFocus type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"/><label>CATEGORIE</label><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map(([name, icon]) => <option key={name} value={name}>{icon} {name}</option>)}</select><label>NOTĂ</label><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. cumpărături"/><button className="primary full" onClick={addExpense}>Salvează cheltuiala</button></>}
            {modal === 'income' && <><div className="modal-head"><h2>Adaugă venit</h2><button onClick={() => setModal(null)}>×</button></div><label>SUMĂ (MDL)</label><input className="big-input" autoFocus type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"/><p className="muted">Introdu salariul sau orice alt venit primit.</p><button className="primary full" onClick={addIncome}>Adaugă venit</button></>}
            {modal === 'settings' && <><div className="modal-head"><h2>Setări buget</h2><button onClick={() => setModal(null)}>×</button></div><label>BUGET LUNAR (MDL)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}/><label>BUGET SĂPTĂMÂNAL (MDL)</label><input type="number" value={weekly} onChange={(e) => setWeekly(e.target.value)}/><label>ȚINTĂ ECONOMII (MDL)</label><input type="number" value={goal} onChange={(e) => setGoal(e.target.value)}/><button className="primary full" onClick={saveBudget}>Salvează bugetul</button><button className="danger full" onClick={reset}>Șterge toate datele</button></>}
          </div>
        </div>}
      </div>
    </div>
  )
}

export default App
