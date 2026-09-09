import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

const LANGS = ['ro', 'en', 'ru']
const CURRENCIES = ['MDL', 'EUR', 'USD']

const RATES = { MDL: 1, EUR: 19.5, USD: 17.5 }

const T = {
  ro: {
    finances: 'FINANȚELE MELE', login: 'Intră în cont', register: 'Creează cont',
    name: 'NUME', email: 'EMAIL', password: 'PAROLĂ', signOut: 'Ieșire din cont',
    noAccount: 'Nu ai cont? Creează unul', haveAccount: 'Ai deja cont? Intră în cont',
    balance: 'SOLD TOTAL', cash: 'CASH', card: 'CARD', income: 'VENITURI',
    expenses: 'CHELTUIELI', savings: 'ECONOMII', debt: 'DATORIE',
    addExpense: 'Cheltuială', addIncome: 'Venit', statistics: 'Statistici',
    goals: 'Obiective', settings: 'Setări', home: 'Acasă',
    weekly: 'SĂPTĂMÂNA ACEASTA', monthly: 'LUNA ACEASTA', total: 'TOTAL',
    amount: 'SUMĂ', category: 'CATEGORIE', payment: 'PLĂTEȘTI CU',
    note: 'NOTĂ', save: 'Salvează', cancel: 'Anulează',
    cashQuestion: 'Câți bani ai astăzi?', cashHelp: 'Introdu cât ai acum în numerar și pe card.',
    continue: 'Continuă', dailyTitle: 'Bună! 👋 Hai să actualizăm banii de azi.',
    cashAmount: 'Cash', cardAmount: 'Pe card', goalAdd: 'Adaugă obiectiv',
    goalName: 'Numele obiectivului', target: 'ȚINTĂ', current: 'ECONOMISIȚI',
    addGoal: 'Creează obiectiv', suggested: 'OBIECTIVE SUGERATE',
    phone: 'Telefon nou', car: 'Mașină nouă', vacation: 'Vacanță',
    homeFund: 'Avans locuință', laptop: 'Laptop nou', emergency: 'Fond de urgență',
    noData: 'Încă nu există date.', byCategory: 'CHELTUIELI PE CATEGORII',
    byPayment: 'CASH VS CARD', last7: 'ULTIMELE 7 ZILE', last30: 'ULTIMELE 30 ZILE',
    averageDay: 'MEDIE / ZI', topCategory: 'CATEGORIA #1', recent: 'RECENTE',
    monthlyBudget: 'BUGET LUNAR', weeklyBudget: 'BUGET SĂPTĂMÂNAL',
    language: 'LIMBĂ', currency: 'MONEDĂ', saved: 'Salvat!',
    selectPayment: 'Alege Cash sau Card', expenseNote: 'Ex. supermarket', incomePayment: 'PRIMEȘTI PE', insufficient: 'Sold insuficient pe această metodă de plată.',
    syncing: 'Se sincronizează...', loading: 'Se încarcă SaveFlow...',
    onboardingTitle: 'Hai să-ți construim planul financiar',
    onboardingSubtitle: 'Câteva întrebări ne ajută să-ți calculăm un ritm sănătos de economisire.',
    next: 'Următorul pas', finish: 'Creează planul meu',
    monthlyIncome: 'VENIT LUNAR', fixedCosts: 'CHELTUIELI LUNARE',
    savingsTarget: 'ȚINTA DE ECONOMISIRE', savingsTargetHelp: 'Procent recomandat din venitul tău disponibil.',
    rent: 'Chirie', bills: 'Facturi', food: 'Mâncare', transport: 'Transport',
    subscriptions: 'Abonamente', otherCosts: 'Alte cheltuieli',
    smartAdvice: 'SFATUL DE AZI', healthyPlan: 'PLAN SĂNĂTOS',
    safeToSpend: 'POȚI CHELTUI', projectedSavings: 'ECONOMII ESTIMATE',
    weekendAdvice: 'PENTRU WEEKEND', spendingPattern: 'TIPARUL TĂU',
    other: 'Altele', food: 'Mâncare', rent: 'Chirie', bills: 'Facturi',
    smoking: 'Fumat', transport: 'Transport', subscriptions: 'Abonamente',
    entertainment: 'Distracție', shopping: 'Cumpărături', health: 'Sănătate',
    education: 'Educație', travel: 'Călătorii', gifts: 'Cadouri',
    family: 'Familie', beauty: 'Frumusețe', home: 'Casă', pets: 'Animale',
    services: 'Servicii', work: 'Muncă', crypto: 'Crypto',
  },
  en: {
    finances: 'MY FINANCES', login: 'Sign in', register: 'Create account',
    name: 'NAME', email: 'EMAIL', password: 'PASSWORD', signOut: 'Sign out',
    noAccount: "Don't have an account? Create one", haveAccount: 'Already have an account? Sign in',
    balance: 'TOTAL BALANCE', cash: 'CASH', card: 'CARD', income: 'INCOME',
    expenses: 'EXPENSES', savings: 'SAVINGS', debt: 'DEBT',
    addExpense: 'Expense', addIncome: 'Income', statistics: 'Statistics',
    goals: 'Goals', settings: 'Settings', home: 'Home',
    weekly: 'THIS WEEK', monthly: 'THIS MONTH', total: 'TOTAL',
    amount: 'AMOUNT', category: 'CATEGORY', payment: 'PAY WITH',
    note: 'NOTE', save: 'Save', cancel: 'Cancel',
    cashQuestion: 'How much money do you have today?', cashHelp: 'Enter what you currently have in cash and on your card.',
    continue: 'Continue', dailyTitle: 'Hi! 👋 Let’s update today’s money.',
    cashAmount: 'Cash', cardAmount: 'On card', goalAdd: 'Add goal',
    goalName: 'Goal name', target: 'TARGET', current: 'SAVED',
    addGoal: 'Create goal', suggested: 'SUGGESTED GOALS',
    phone: 'New phone', car: 'New car', vacation: 'Vacation',
    homeFund: 'Home down payment', laptop: 'New laptop', emergency: 'Emergency fund',
    noData: 'No data yet.', byCategory: 'SPENDING BY CATEGORY',
    byPayment: 'CASH VS CARD', last7: 'LAST 7 DAYS', last30: 'LAST 30 DAYS',
    averageDay: 'AVERAGE / DAY', topCategory: '#1 CATEGORY', recent: 'RECENT',
    monthlyBudget: 'MONTHLY BUDGET', weeklyBudget: 'WEEKLY BUDGET',
    language: 'LANGUAGE', currency: 'CURRENCY', saved: 'Saved!',
    selectPayment: 'Choose Cash or Card', expenseNote: 'E.g. supermarket', incomePayment: 'RECEIVE ON', insufficient: 'Insufficient balance on this payment method.',
    syncing: 'Syncing...', loading: 'Loading SaveFlow...',
    onboardingTitle: 'Let’s build your financial plan',
    onboardingSubtitle: 'A few questions help us calculate a healthy saving pace.',
    next: 'Next step', finish: 'Create my plan',
    monthlyIncome: 'MONTHLY INCOME', fixedCosts: 'MONTHLY COSTS',
    savingsTarget: 'SAVING TARGET', savingsTargetHelp: 'Recommended percentage of your available income.',
    rent: 'Rent', bills: 'Bills', food: 'Food', transport: 'Transport',
    subscriptions: 'Subscriptions', otherCosts: 'Other costs',
    smartAdvice: 'TODAY’S ADVICE', healthyPlan: 'HEALTHY PLAN',
    safeToSpend: 'SAFE TO SPEND', projectedSavings: 'ESTIMATED SAVINGS',
    weekendAdvice: 'FOR THE WEEKEND', spendingPattern: 'YOUR PATTERN',
    other: 'Other', food: 'Food', rent: 'Rent', bills: 'Bills',
    smoking: 'Smoking', transport: 'Transport', subscriptions: 'Subscriptions',
    entertainment: 'Entertainment', shopping: 'Shopping', health: 'Health',
    education: 'Education', travel: 'Travel', gifts: 'Gifts',
    family: 'Family', beauty: 'Beauty', home: 'Home', pets: 'Pets',
    services: 'Services', work: 'Work', crypto: 'Crypto',
  },
  ru: {
    finances: 'МОИ ФИНАНСЫ', login: 'Войти', register: 'Создать аккаунт',
    name: 'ИМЯ', email: 'EMAIL', password: 'ПАРОЛЬ', signOut: 'Выйти',
    noAccount: 'Нет аккаунта? Создать', haveAccount: 'Уже есть аккаунт? Войти',
    balance: 'ОБЩИЙ БАЛАНС', cash: 'НАЛИЧНЫЕ', card: 'КАРТА', income: 'ДОХОДЫ',
    expenses: 'РАСХОДЫ', savings: 'НАКОПЛЕНИЯ', debt: 'ДОЛГ',
    addExpense: 'Расход', addIncome: 'Доход', statistics: 'Статистика',
    goals: 'Цели', settings: 'Настройки', home: 'Главная',
    weekly: 'ЭТА НЕДЕЛЯ', monthly: 'ЭТОТ МЕСЯЦ', total: 'ВСЕГО',
    amount: 'СУММА', category: 'КАТЕГОРИЯ', payment: 'ОПЛАТА',
    note: 'ЗАМЕТКА', save: 'Сохранить', cancel: 'Отмена',
    cashQuestion: 'Сколько денег у вас сегодня?', cashHelp: 'Введите текущую сумму наличных и денег на карте.',
    continue: 'Продолжить', dailyTitle: 'Привет! 👋 Обновим деньги на сегодня.',
    cashAmount: 'Наличные', cardAmount: 'На карте', goalAdd: 'Добавить цель',
    goalName: 'Название цели', target: 'ЦЕЛЬ', current: 'НАКОПЛЕНО',
    addGoal: 'Создать цель', suggested: 'ПРЕДЛОЖЕННЫЕ ЦЕЛИ',
    phone: 'Новый телефон', car: 'Новая машина', vacation: 'Отпуск',
    homeFund: 'Первоначальный взнос', laptop: 'Новый ноутбук', emergency: 'Резерв',
    noData: 'Данных пока нет.', byCategory: 'РАСХОДЫ ПО КАТЕГОРИЯМ',
    byPayment: 'НАЛИЧНЫЕ VS КАРТА', last7: 'ПОСЛЕДНИЕ 7 ДНЕЙ', last30: 'ПОСЛЕДНИЕ 30 ДНЕЙ',
    averageDay: 'СРЕДНЕЕ / ДЕНЬ', topCategory: 'КАТЕГОРИЯ #1', recent: 'ПОСЛЕДНИЕ',
    monthlyBudget: 'МЕСЯЧНЫЙ БЮДЖЕТ', weeklyBudget: 'НЕДЕЛЬНЫЙ БЮДЖЕТ',
    language: 'ЯЗЫК', currency: 'ВАЛЮТА', saved: 'Сохранено!',
    selectPayment: 'Выберите наличные или карту', expenseNote: 'Напр. супермаркет', incomePayment: 'ПОЛУЧИТЬ НА', insufficient: 'Недостаточно средств на этом способе оплаты.',
    syncing: 'Синхронизация...', loading: 'Загрузка SaveFlow...',
    onboardingTitle: 'Давайте создадим ваш финансовый план',
    onboardingSubtitle: 'Несколько вопросов помогут рассчитать здоровый темп накоплений.',
    next: 'Следующий шаг', finish: 'Создать мой план',
    monthlyIncome: 'ДОХОД В МЕСЯЦ', fixedCosts: 'ЕЖЕМЕСЯЧНЫЕ РАСХОДЫ',
    savingsTarget: 'ЦЕЛЬ НАКОПЛЕНИЙ', savingsTargetHelp: 'Рекомендуемый процент от доступного дохода.',
    rent: 'Аренда', bills: 'Счета', food: 'Еда', transport: 'Транспорт',
    subscriptions: 'Подписки', otherCosts: 'Другие расходы',
    smartAdvice: 'СОВЕТ НА СЕГОДНЯ', healthyPlan: 'ЗДОРОВЫЙ ПЛАН',
    safeToSpend: 'МОЖНО ПОТРАТИТЬ', projectedSavings: 'ОЖИДАЕМЫЕ НАКОПЛЕНИЯ',
    weekendAdvice: 'НА ВЫХОДНЫЕ', spendingPattern: 'ВАШ ШАБЛОН',
    other: 'Другое', food: 'Еда', rent: 'Аренда', bills: 'Счета',
    smoking: 'Курение', transport: 'Транспорт', subscriptions: 'Подписки',
    entertainment: 'Развлечения', shopping: 'Покупки', health: 'Здоровье',
    education: 'Образование', travel: 'Путешествия', gifts: 'Подарки',
    family: 'Семья', beauty: 'Красота', home: 'Дом', pets: 'Животные',
    services: 'Услуги', work: 'Работа', crypto: 'Крипто',
  },
}

const categoryList = [
  ['Food', '🍔', 'food'], ['Rent', '🏠', 'rent'], ['Bills', '💡', 'bills'],
  ['Smoking', '🚬', 'smoking'], ['Transport', '🚗', 'transport'],
  ['Subscriptions', '📱', 'subscriptions'], ['Entertainment', '🎮', 'entertainment'],
  ['Shopping', '🛍️', 'shopping'], ['Health', '❤️', 'health'],
  ['Education', '📚', 'education'], ['Travel', '✈️', 'travel'],
  ['Gifts', '🎁', 'gifts'], ['Family', '👨‍👩‍👧', 'family'],
  ['Beauty', '💈', 'beauty'], ['Home', '🛋️', 'home'],
  ['Pets', '🐾', 'pets'], ['Services', '🔧', 'services'],
  ['Work', '💼', 'work'], ['Crypto', '₿', 'crypto'], ['Other', '📦', 'other'],
]

const goalSuggestions = [
  ['phone', '📱'], ['car', '🚗'], ['vacation', '✈️'],
  ['homeFund', '🏡'], ['laptop', '💻'], ['emergency', '🛡️'],
]

const blankData = {
  transactions: [], goals: [], savingsContributions: [], cash: 0, card: 0,
  monthlyBudget: 29600, weeklyBudget: 7400,
}

const todayKey = () => new Date().toISOString().slice(0, 10)
const mdlToDisplay = (v, c) => Number(v || 0) / (RATES[c] || 1)
const displayToMdl = (v, c) => Number(v || 0) * (RATES[c] || 1)

function App() {
  const [session, setSession] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [authLoading, setAuthLoading] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [language, setLanguage] = useState('ro')
  const [currency, setCurrency] = useState('MDL')
  const [data, setData] = useState(blankData)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [tab, setTab] = useState('home')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [note, setNote] = useState('')
  const [goalName, setGoalName] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [savingAmount, setSavingAmount] = useState('')
  const [savingDestination, setSavingDestination] = useState('general')
  const [incomeSource, setIncomeSource] = useState('Salariu')
  const [error, setError] = useState('')
  const [affordAmount, setAffordAmount] = useState('')
  const [onboarding, setOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState({
    monthlyIncome: '', rent: '', bills: '', food: '', transport: '', subscriptions: '', other: '', savingsTarget: '10',
  })

  const t = T[language]
  const ui = (ro, en, ru) => language === 'ro' ? ro : language === 'ru' ? ru : en
  const money = (v) => new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ro-MD', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(mdlToDisplay(v, currency))
  const dateTime = (value) => new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'ro-MD', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(new Date(value))

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data: a, error: e }) => {
      if (!mounted) return
      if (e) setError(e.message)
      setSession(a.session); setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  const load = async () => {
    if (!session?.user?.id) return
    setLoading(true); setError('')
    const uid = session.user.id
    const [{ data: profile, error: pe }, { data: tx, error: te }, { data: goals, error: ge }, { data: savings, error: se }, { data: day, error: de }] = await Promise.all([
      supabase.from('profiles').select('language,currency,monthly_budget,weekly_budget,onboarding_completed,monthly_income,rent,bills,food,transport,subscriptions,other_costs,savings_target_percent').eq('id', uid).maybeSingle(),
      supabase.from('transactions').select('id,type,amount,category,note,payment_method,transaction_date,created_at').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('savings_goals').select('id,name,target_amount,current_amount,created_at').eq('user_id', uid).order('created_at', { ascending: true }),
      supabase.from('savings_contributions').select('id,goal_id,amount,note,contribution_date,created_at').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('daily_balances').select('cash_amount,card_amount,balance_date').eq('user_id', uid).eq('balance_date', todayKey()).maybeSingle(),
    ])
    const firstError = pe || te || ge || se || de
    if (firstError) { setError(firstError.message); setLoading(false); return }
    setLanguage(profile?.language || 'ro'); setCurrency(profile?.currency || 'MDL')
    setData({
      transactions: tx || [], goals: goals || [], savingsContributions: savings || [],
      cash: Number(day?.cash_amount || 0), card: Number(day?.card_amount || 0),
      monthlyBudget: Number(profile?.monthly_budget || 0), weeklyBudget: Number(profile?.weekly_budget || 0),
    })
    setOnboardingData({
      monthlyIncome: profile?.monthly_income ? String(profile.monthly_income) : '', rent: profile?.rent ? String(profile.rent) : '',
      bills: profile?.bills ? String(profile.bills) : '', food: profile?.food ? String(profile.food) : '',
      transport: profile?.transport ? String(profile.transport) : '', subscriptions: profile?.subscriptions ? String(profile.subscriptions) : '',
      other: profile?.other_costs ? String(profile.other_costs) : '', savingsTarget: profile?.savings_target_percent ? String(profile.savings_target_percent) : '10',
    })
    setLoading(false)
    if (!profile?.onboarding_completed) setOnboarding(true)
  }
  useEffect(() => { if (session) load() }, [session])

  const savePreferences = async (nextLang = language, nextCurrency = currency) => {
    const { error: e } = await supabase.from('profiles').update({ language: nextLang, currency: nextCurrency, updated_at: new Date().toISOString() }).eq('id', session.user.id)
    if (e) setError(e.message); else { setLanguage(nextLang); setCurrency(nextCurrency) }
  }

  const addExpense = async () => {
    const value = Number(amount); if (!value || value <= 0) return
    const mdl = displayToMdl(value, currency)
    const { error: e } = await supabase.from('transactions').insert({
      user_id: session.user.id, type: 'expense', amount: mdl, category, note: note || category,
      payment_method: paymentMethod, transaction_date: todayKey(),
    })
    if (e) { setError(e.message); return }
    setAmount(''); setNote(''); setModal(null); await load()
  }

  const addIncome = async () => {
    const income = Number(amount); if (!income || income <= 0) return
    const incomeMdl = displayToMdl(income, currency)
    const save = Math.min(Math.max(0, Number(savingAmount || 0)), income)
    const saveMdl = displayToMdl(save, currency)
    const { data: inserted, error: incomeError } = await supabase.from('transactions').insert({
      user_id: session.user.id, type: 'income', amount: incomeMdl, category: 'Income', note: incomeSource || 'Venit',
      payment_method: null, transaction_date: todayKey(),
    }).select('id').single()
    if (incomeError) { setError(incomeError.message); return }
    if (save > 0) {
      const { error: saveError } = await supabase.from('savings_contributions').insert({
        user_id: session.user.id, goal_id: savingDestination === 'general' ? null : savingDestination,
        amount: saveMdl, note: `Din ${incomeSource || 'venit'}`, contribution_date: todayKey(), transaction_id: inserted.id,
      })
      if (saveError) { setError(saveError.message); return }
      if (savingDestination !== 'general') {
        const goal = data.goals.find(g => g.id === savingDestination)
        if (goal) await supabase.from('savings_goals').update({ current_amount: Number(goal.current_amount || 0) + saveMdl }).eq('id', goal.id).eq('user_id', session.user.id)
      }
    }
    setAmount(''); setSavingAmount(''); setIncomeSource('Salariu'); setSavingDestination('general'); setModal(null); await load()
  }

  const addGoalContribution = async () => {
    const value = Number(savingAmount); if (!value || value <= 0 || !selectedGoalId) return
    const mdl = displayToMdl(value, currency)
    const goal = data.goals.find(g => g.id === selectedGoalId)
    if (!goal) return
    const remaining = Math.max(0, Number(goal.target_amount) - Number(goal.current_amount || 0))
    const actual = Math.min(mdl, remaining, Math.max(0, availableBalance))
    const { error: e } = await supabase.from('savings_contributions').insert({ user_id: session.user.id, goal_id: selectedGoalId, amount: actual, note: 'Contribuție obiectiv', contribution_date: todayKey() })
    if (e) { setError(e.message); return }
    await supabase.from('savings_goals').update({ current_amount: Number(goal.current_amount || 0) + actual }).eq('id', selectedGoalId).eq('user_id', session.user.id)
    setSavingAmount(''); setSelectedGoalId(''); setModal(null); await load()
  }

  const addGeneralSaving = async () => {
    const value = Number(savingAmount); if (!value || value <= 0) return
    const mdl = Math.min(displayToMdl(value, currency), Math.max(0, availableBalance))
    if (mdl <= 0) return
    const { error: e } = await supabase.from('savings_contributions').insert({ user_id: session.user.id, goal_id: null, amount: mdl, note: 'Economii generale', contribution_date: todayKey() })
    if (e) { setError(e.message); return }
    setSavingAmount(''); setModal(null); await load()
  }

  const createGoal = async (name = goalName) => {
    const target = Number(goalTarget); if (!name.trim() || !target || target <= 0) return
    const { error: e } = await supabase.from('savings_goals').insert({ user_id: session.user.id, name: name.trim(), target_amount: displayToMdl(target, currency), current_amount: 0 })
    if (e) { setError(e.message); return }
    setGoalName(''); setGoalTarget(''); setModal(null); await load()
  }

  const expenses = useMemo(() => data.transactions.filter(x => x.type === 'expense'), [data.transactions])
  const incomes = useMemo(() => data.transactions.filter(x => x.type === 'income'), [data.transactions])
  const totalIncome = useMemo(() => incomes.reduce((s, x) => s + Number(x.amount), 0), [incomes])
  const totalExpenses = useMemo(() => expenses.reduce((s, x) => s + Number(x.amount), 0), [expenses])
  const generalSavings = useMemo(() => data.savingsContributions.filter(x => !x.goal_id).reduce((s, x) => s + Number(x.amount), 0), [data.savingsContributions])
  const totalSaved = useMemo(() => data.savingsContributions.reduce((s, x) => s + Number(x.amount), 0), [data.savingsContributions])
  const availableBalance = Math.max(0, totalIncome - totalExpenses - totalSaved)
  const cash = data.cash; const card = data.card
  const now = Date.now()
  const weekExpenses = expenses.filter(x => now - new Date(x.created_at).getTime() <= 7 * 86400000)
  const monthExpenses = expenses.filter(x => { const d = new Date(x.created_at), n = new Date(); return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() })
  const weekIncome = incomes.filter(x => now - new Date(x.created_at).getTime() <= 7 * 86400000).reduce((s,x)=>s+Number(x.amount),0)
  const weekSaved = data.savingsContributions.filter(x => now - new Date(x.created_at).getTime() <= 7 * 86400000).reduce((s,x)=>s+Number(x.amount),0)
  const weekTotal = weekExpenses.reduce((s, x) => s + Number(x.amount), 0)
  const monthTotal = monthExpenses.reduce((s, x) => s + Number(x.amount), 0)
  const categoryTotals = useMemo(() => { const m={}; monthExpenses.forEach(x=>{m[x.category||'Other']=(m[x.category||'Other']||0)+Number(x.amount)}); return Object.entries(m).sort((a,b)=>b[1]-a[1]) }, [monthExpenses])
  const cashSpend = expenses.filter(x => x.payment_method === 'cash').reduce((s,x)=>s+Number(x.amount),0)
  const cardSpend = expenses.filter(x => x.payment_method === 'card').reduce((s,x)=>s+Number(x.amount),0)
  const profileMonthlyIncome = Number(onboardingData.monthlyIncome || 0)
  const profileFixedCosts = [onboardingData.rent,onboardingData.bills,onboardingData.food,onboardingData.transport,onboardingData.subscriptions,onboardingData.other].reduce((s,v)=>s+Number(v||0),0)
  const targetRate = Math.min(30, Math.max(5, Number(onboardingData.savingsTarget || 10)))
  const targetMonthlySavings = profileMonthlyIncome * targetRate / 100
  const discretionary = Math.max(0, profileMonthlyIncome - profileFixedCosts - targetMonthlySavings)
  const safeDailySpend = discretionary / 30
  const avgDay = monthExpenses.length ? monthTotal / Math.max(1,new Date().getDate()) : 0
  const weeklyBudget = data.weeklyBudget || Math.max(1, discretionary / 4.345)
  const financialHealth = useMemo(() => {
    const income = Math.max(profileMonthlyIncome, totalIncome, 1)
    const saveRate = Math.min(1, totalSaved / income)
    const spendingRate = Math.min(1, monthTotal / income)
    const budget = weeklyBudget > 0 ? Math.max(0, 1 - weekTotal / weeklyBudget) : .5
    return Math.round(Math.min(100, Math.max(0, 35*saveRate + 35*(1-spendingRate) + 20*budget + 10)))
  }, [profileMonthlyIncome,totalIncome,totalSaved,monthTotal,weeklyBudget,weekTotal])
  const healthLabel = financialHealth >= 80 ? ui('Excelent','Excellent','Отлично') : financialHealth >= 60 ? ui('Bun','Good','Хорошо') : financialHealth >= 40 ? ui('Stabil','Stable','Стабильно') : ui('De îmbunătățit','Needs attention','Нужно улучшить')
  const weekStart = new Date(); weekStart.setHours(0,0,0,0); weekStart.setDate(weekStart.getDate()-6)
  const previousWeekStart = new Date(weekStart); previousWeekStart.setDate(previousWeekStart.getDate()-7)
  const previousWeekEnd = new Date(weekStart); previousWeekEnd.setDate(previousWeekEnd.getDate()-1); previousWeekEnd.setHours(23,59,59,999)
  const previousWeekExpenses = expenses.filter(x => { const d=new Date(x.created_at); return d>=previousWeekStart && d<=previousWeekEnd }).reduce((s,x)=>s+Number(x.amount),0)
  const weeklyChange = previousWeekExpenses > 0 ? (weekTotal-previousWeekExpenses)/previousWeekExpenses*100 : 0
  const monthSavingsRate = profileMonthlyIncome > 0 ? totalSaved / profileMonthlyIncome * 100 : 0
  const dailyTrend = useMemo(() => Array.from({length:7},(_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-6+i);const key=d.toISOString().slice(0,10);const value=expenses.filter(x=>(x.transaction_date||String(x.created_at).slice(0,10))===key).reduce((s,x)=>s+Number(x.amount),0);return {key,label:d.toLocaleDateString(language==='en'?'en-US':language==='ru'?'ru-RU':'ro-MD',{weekday:'short'}),value}}),[expenses,language])
  const goalStats = useMemo(() => Object.fromEntries(data.goals.map(g=>[g.id,Number(g.current_amount||0)])),[data.goals])
  const estimateMonths = (goal) => { const remaining=Math.max(0,Number(goal.target_amount)-Number(goal.current_amount||0)); const own=data.savingsContributions.filter(x=>x.goal_id===goal.id && Date.now()-new Date(x.created_at).getTime()<=90*86400000).reduce((s,x)=>s+Number(x.amount||0),0)/3; const monthly=Math.max(1,own||targetMonthlySavings/Math.max(1,data.goals.length)); return remaining===0?0:Math.ceil(remaining/monthly) }
  const affordability = useMemo(()=>{const v=Number(affordAmount||0);return {value:v, safe:v>0&&v<=availableBalance&&v<=Math.max(0,safeDailySpend*3),after:Math.max(0,availableBalance-v)}},[affordAmount,availableBalance,safeDailySpend])
  const smartAdvice = availableBalance < 0 ? ui('Ai depășit veniturile înregistrate. Oprește cheltuielile discreționare până revii pe plus.','Recorded spending is above income. Pause discretionary spending until you recover.','Расходы превышают доход. Приостановите необязательные траты.') : monthSavingsRate < targetRate ? ui(`Ai pus deoparte ${Math.round(monthSavingsRate)}% din venit. Ținta ta este ${targetRate}%. Încearcă să economisești imediat când primești salariul.`,`You saved ${Math.round(monthSavingsRate)}% of income. Your target is ${targetRate}%. Save first when income arrives.`,`Вы накопили ${Math.round(monthSavingsRate)}% дохода. Ваша цель — ${targetRate}%. Откладывайте сразу после получения дохода.`) : ui('Foarte bine. Economiile tale sunt în linie cu obiectivul.','Great. Your savings are on track with your goal.','Отлично. Накопления идут по плану.')

  const saveOnboarding = async () => {
    const income=Number(onboardingData.monthlyIncome); if(!income||income<=0){setError(ui('Introdu venitul lunar.','Enter monthly income.','Введите доход за месяц.'));return}
    const monthlyCosts=profileFixedCosts, recommendedWeekly=Math.max(1,(income-monthlyCosts-(income*targetRate/100))/4.345)
    const {error:e}=await supabase.from('profiles').update({monthly_income:income,rent:Number(onboardingData.rent||0),bills:Number(onboardingData.bills||0),food:Number(onboardingData.food||0),transport:Number(onboardingData.transport||0),subscriptions:Number(onboardingData.subscriptions||0),other_costs:Number(onboardingData.other||0),savings_target_percent:targetRate,onboarding_completed:true,monthly_budget:Math.max(1,income-monthlyCosts),weekly_budget:recommendedWeekly,updated_at:new Date().toISOString()}).eq('id',session.user.id)
    if(e){setError(e.message);return};setData(d=>({...d,monthlyBudget:Math.max(1,income-monthlyCosts),weeklyBudget:recommendedWeekly}));setOnboarding(false);setOnboardingStep(1)
  }

  if (authLoading) return <div className="app-shell"><div className="app auth-screen"><div className="card">{t.loading}</div></div></div>

  if (!session) {
    return (
      <div className="app-shell auth-shell-pro">
        <div className="auth-screen-pro">
          <div className="auth-glow auth-glow-one" />
          <div className="auth-glow auth-glow-two" />

          <div className="auth-layout">
            <div className="auth-brand-panel animate-in">
              <div className="brand-mark">S</div>
              <span className="eyebrow">{t.finances}</span>
              <h1>Save<span>Flow</span></h1>
              <p className="auth-tagline">
                {language === 'ro'
                  ? 'Controlează-ți banii. Construiește-ți viitorul.'
                  : language === 'ru'
                    ? 'Контролируйте деньги. Стройте своё будущее.'
                    : 'Control your money. Build your future.'}
              </p>

              <div className="auth-features">
                <div className="auth-feature">
                  <span>◈</span>
                  <div>
                    <strong>{language === 'ro' ? 'Finanțe într-un singur loc' : language === 'ru' ? 'Все финансы в одном месте' : 'All your finances in one place'}</strong>
                    <small>{language === 'ro' ? 'Venituri, cheltuieli și solduri' : language === 'ru' ? 'Доходы, расходы и балансы' : 'Income, expenses and balances'}</small>
                  </div>
                </div>
                <div className="auth-feature">
                  <span>◎</span>
                  <div>
                    <strong>{language === 'ro' ? 'Obiective personale' : language === 'ru' ? 'Личные цели' : 'Personal goals'}</strong>
                    <small>{language === 'ro' ? 'Economisește pentru ce contează' : language === 'ru' ? 'Копите на важное' : 'Save for what matters'}</small>
                  </div>
                </div>
                <div className="auth-feature">
                  <span>⌁</span>
                  <div>
                    <strong>{language === 'ro' ? 'Sincronizare cloud' : language === 'ru' ? 'Облачная синхронизация' : 'Cloud sync'}</strong>
                    <small>{language === 'ro' ? 'Datele tale disponibile oriunde' : language === 'ru' ? 'Ваши данные доступны везде' : 'Your data, available everywhere'}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-card-pro animate-modal">
              <div className="auth-card-top">
                <div>
                  <span className="eyebrow">{authMode === 'login' ? t.login : t.register}</span>
                  <h2>{authMode === 'login'
                    ? (language === 'ro' ? 'Bine ai revenit' : language === 'ru' ? 'С возвращением' : 'Welcome back')
                    : (language === 'ro' ? 'Începe cu SaveFlow' : language === 'ru' ? 'Начните с SaveFlow' : 'Start with SaveFlow')}</h2>
                  <p>{authMode === 'login'
                    ? (language === 'ro' ? 'Intră în contul tău și continuă de unde ai rămas.' : language === 'ru' ? 'Войдите в аккаунт и продолжите с того места, где остановились.' : 'Sign in and continue where you left off.')
                    : (language === 'ro' ? 'Creează un cont și începe să-ți organizezi banii.' : language === 'ru' ? 'Создайте аккаунт и начните управлять финансами.' : 'Create an account and start organizing your finances.')}</p>
                </div>
              </div>

              <div className="auth-lang-switch">
                <button className={language === 'ro' ? 'active' : ''} onClick={() => setLanguage('ro')}>RO</button>
                <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
                <button className={language === 'ru' ? 'active' : ''} onClick={() => setLanguage('ru')}>RU</button>
              </div>

              {authMode === 'register' && (
                <div className="auth-field">
                  <label>{t.name}</label>
                  <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder={language === 'ro' ? 'Numele tău' : language === 'ru' ? 'Ваше имя' : 'Your name'} />
                </div>
              )}

              <div className="auth-field">
                <label>{t.email}</label>
                <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </div>

              <div className="auth-field">
                <label>{t.password}</label>
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} />
              </div>

              {error && <div className="tip auth-error">⚠ {error}</div>}

              <button className="primary full auth-submit" onClick={async () => {
                setError('')
                const result = authMode === 'login'
                  ? await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword })
                  : await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword, options: { data: { full_name: authName.trim() } } })
                if (result.error) setError(result.error.message)
                else if (authMode === 'register' && !result.data.session) setError('Cont creat. Verifică emailul.')
              }}>
                {authMode === 'login' ? t.login : t.register}
                <span>→</span>
              </button>

              <div className="auth-divider"><span>{language === 'ro' ? 'sau' : language === 'ru' ? 'или' : 'or'}</span></div>

              <button className="secondary full auth-switch" onClick={() => {
                setError('')
                setAuthMode(authMode === 'login' ? 'register' : 'login')
              }}>
                {authMode === 'login' ? t.noAccount : t.haveAccount}
              </button>

              <div className="auth-secure">🔒 {language === 'ro' ? 'Conexiune securizată' : language === 'ru' ? 'Защищённое соединение' : 'Secure connection'}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="app-shell saveflow-v4">
      <div className="app sf-app">
        <header className="sf-topbar">
          <div className="sf-brand">
            <div className="sf-brand-mark">S</div>
            <div>
              <span className="sf-eyebrow">{t.finances}</span>
              <h1>Save<span>Flow</span></h1>
            </div>
          </div>
          <div className="sf-top-actions">
            <button className="sf-icon-btn" aria-label="Notifications">♧</button>
            <button className="sf-avatar" onClick={() => setTab('profile')} aria-label="Profile">{(session.user.email||'U')[0].toUpperCase()}</button>
          </div>
        </header>

        {error && <div className="sf-inline-alert">⚠ {error}</div>}
        {loading && <div className="sf-inline-alert sf-loading">{t.syncing}</div>}

        {tab === 'home' && <main className="sf-page sf-home">
          <section className="sf-greeting">
            <div>
              <span className="sf-muted">{ui('Bună seara,','Good evening,','Добрый вечер,')}</span>
              <h2>{session.user.user_metadata?.full_name || 'Maxim'} <span>👋</span></h2>
              <p>{new Intl.DateTimeFormat(language==='en'?'en-US':language==='ru'?'ru-RU':'ro-MD',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}</p>
            </div>
          </section>

          <section className="sf-balance-card">
            <div className="sf-balance-top">
              <div>
                <span className="sf-card-label">{ui('SOLD DISPONIBIL','AVAILABLE BALANCE','ДОСТУПНЫЙ БАЛАНС')}</span>
                <div className="sf-balance-value">{money(availableBalance)}</div>
                <div className="sf-balance-delta">↗ {Math.abs(Math.round((totalIncome>0?((totalIncome-totalExpenses)/totalIncome):0)*100))}% {ui('luna aceasta','this month','в этом месяце')}</div>
              </div>
              <div className="sf-mini-bars" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
            </div>
            <div className="sf-account-split">
              <div><span>💵 {t.cash}</span><b>{money(cash)}</b></div>
              <div><span>💳 {t.card}</span><b>{money(card)}</b></div>
            </div>
          </section>

          <section className="sf-safe-card" onClick={() => setTab('statistics')}>
            <div className="sf-safe-icon">✓</div>
            <div><span>{ui('Poți cheltui azi','Safe to spend today','Можно потратить сегодня')}</span><b>{money(safeDailySpend)}</b><small>{ui('Pe baza bugetului și obiectivelor tale','Based on your budget and goals','На основе вашего бюджета и целей')}</small></div>
            <strong>›</strong>
          </section>

          <div className="sf-two-kpis">
            <section className="sf-kpi-card"><span>CHELTUIT AZI</span><b>{money(expenses.filter(x=>dateKey(x.transaction_date||x.created_at)===todayKey()).reduce((s,x)=>s+Number(x.amount),0))}</b></section>
            <section className="sf-kpi-card"><span>LUNA ACEASTA</span><b>{money(monthTotal)}</b></section>
          </div>

          <section className="sf-health-card">
            <div className="sf-section-head"><div><span className="sf-card-label">FINANCIAL HEALTH</span><h3>{ui('Sănătatea financiară','Financial health','Финансовое здоровье')}</h3></div><button className="sf-text-btn" onClick={()=>setTab('statistics')}>›</button></div>
            <div className="sf-health-body">
              <div className={`sf-score-ring tone-${healthStatus.tone}`} style={{'--p':`${financialHealth*3.6}deg`}}><div><b>{financialHealth}</b><small>/100</small></div></div>
              <div><h4>{healthLabel}</h4><p>{ui('Ești pe drumul bun. Continuă ritmul actual.','You are on track. Keep your current pace.','Вы на правильном пути. Сохраняйте текущий темп.')}</p></div>
            </div>
          </section>

          <section className="sf-home-section">
            <div className="sf-section-head"><div><span className="sf-card-label">YOUR GOALS</span><h3>{ui('Obiective','Goals','Цели')}</h3></div><button className="sf-text-btn" onClick={()=>setTab('goals')}>Vezi toate ›</button></div>
            <div className="sf-goal-list sf-goal-preview">
              {data.goals.slice(0,2).map(g=>{const pct=Math.min(100,Number(g.current_amount||0)/Math.max(Number(g.target_amount),1)*100);return <button className="sf-goal-row" key={g.id} onClick={()=>setTab('goals')}><div><strong>🎯 {g.name}</strong><span>{money(g.current_amount)} / {money(g.target_amount)}</span></div><div className="sf-progress"><i style={{width:`${pct}%`}}/></div><b>{Math.round(pct)}%</b></button>})}
              {!data.goals.length && <button className="sf-empty-goal" onClick={()=>setModal('goal')}>＋ {ui('Creează primul obiectiv','Create your first goal','Создайте первую цель')}</button>}
            </div>
          </section>

          <section className="sf-advisor-card">
            <div className="sf-advisor-mark">✦</div>
            <div><span className="sf-card-label">SMART ADVISOR</span><h3>{ui('Planul tău arată stabil.','Your plan looks stable.','Ваш план выглядит стабильно.')}</h3><p>{smartAdvice}</p></div>
          </section>

          <section className="sf-activity-preview">
            <div className="sf-section-head"><div><span className="sf-card-label">RECENT ACTIVITY</span><h3>{ui('Activitate recentă','Recent activity','Последняя активность')}</h3></div><button className="sf-text-btn" onClick={()=>setTab('expenses')}>Vezi toate ›</button></div>
            {data.transactions.slice(0,4).map(x=>{const item=x.type==='income'?['💼',x.note||'Venit']:([['Food','🍔'],['Rent','🏠'],['Bills','💡'],['Smoking','🚬'],['Transport','🚗'],['Subscriptions','📱'],['Entertainment','🎮'],['Shopping','🛍️']].find(z=>z[0]===x.category)||['📦',x.note||'Cheltuială']); return <div className="sf-activity-row" key={x.id}><div className={`sf-activity-icon ${x.type==='income'?'income':''}`}>{item[0]}</div><div><b>{item[1]}</b><small>{dateTime(x.created_at)}</small></div><strong className={x.type==='income'?'positive':''}>{x.type==='income'?'+':'-'}{money(x.amount)}</strong></div>})}
          </section>

          <button className="sf-add-income" onClick={()=>setModal('income')}><span>＋</span><div><b>{ui('Adaugă venit','Add income','Добавить доход')}</b><small>{ui('Salariu, freelance, bonus...','Salary, freelance, bonus...','Зарплата, фриланс, бонус...')}</small></div><strong>›</strong></button>
        </main>}

        {tab === 'expenses' && <main className="sf-page">
          <section className="sf-page-title"><div><span className="sf-card-label">TRANSACTIONS</span><h2>{ui('Activitate','Activity','Активность')}</h2><p>{ui('Toate mișcările banilor tăi.','Everything moving through your money.','Все движения ваших денег.')}</p></div><button className="sf-round-add" onClick={()=>setModal('expense')}>＋</button></section>
          <div className="sf-filter-row"><button className="active">{ui('Toate','All','Все')}</button><button>{t.income}</button><button>{t.expenses}</button><button>{t.savings}</button></div>
          <section className="sf-activity-card">
            {data.transactions.length ? data.transactions.map(x=>{const item=x.type==='income'?['💼',x.note||'Venit']:([['Food','🍔'],['Rent','🏠'],['Bills','💡'],['Smoking','🚬'],['Transport','🚗'],['Subscriptions','📱'],['Entertainment','🎮'],['Shopping','🛍️'],['Health','❤️'],['Travel','✈️']].find(z=>z[0]===x.category)||['📦',x.note||'Cheltuială']); return <div className="sf-activity-row big" key={x.id}><div className={`sf-activity-icon ${x.type==='income'?'income':''}`}>{item[0]}</div><div><b>{item[1]}</b><small>{x.type==='income'?t.income:t.expenses} · {dateTime(x.created_at)}</small></div><strong className={x.type==='income'?'positive':''}>{x.type==='income'?'+':'-'}{money(x.amount)}</strong></div>}) : <div className="sf-empty">{t.noData}</div>}
          </section>
        </main>}

        {tab === 'statistics' && <main className="sf-page">
          <section className="sf-page-title"><div><span className="sf-card-label">INSIGHTS</span><h2>{ui('Statistici','Insights','Аналитика')}</h2><p>{ui('Înțelege unde se duc banii tăi.','Understand where your money goes.','Понимайте, куда уходят деньги.')}</p></div><button className="sf-month-pill">{new Intl.DateTimeFormat(language==='en'?'en-US':language==='ru'?'ru-RU':'ro-MD',{month:'long',year:'numeric'}).format(new Date())}</button></section>
          <div className="sf-insight-grid">
            <section className="sf-insight-card"><span>TOTAL INCOME</span><b>{money(totalIncome)}</b><small>↗ {Math.round(monthSavingsRate)}%</small></section>
            <section className="sf-insight-card"><span>TOTAL EXPENSES</span><b>{money(monthTotal)}</b><small className="warn">↗ {Math.round(Math.max(0,weeklyChange))}%</small></section>
            <section className="sf-insight-card"><span>TOTAL SAVED</span><b>{money(totalSaved)}</b><small>↗ {Math.round(monthSavingsRate)}%</small></section>
            <section className="sf-insight-card"><span>AVG. DAILY SPEND</span><b>{money(avgDay)}</b><small className="good">↘ 12%</small></section>
          </div>
          <section className="sf-chart-card"><div className="sf-section-head"><div><span className="sf-card-label">SPENDING TREND</span><h3>{ui('Trendul cheltuielilor','Spending trend','Динамика расходов')}</h3></div><strong>{money(weekTotal)}</strong></div><div className="sf-bar-chart">{dailyTrend.map((d,i)=><div className={i===6?'active':''} key={d.key}><i style={{height:`${Math.max(8, d.value/Math.max(...dailyTrend.map(x=>x.value),1)*100)}%`}}/><span>{d.label}</span></div>)}</div></section>
          <section className="sf-chart-card"><div className="sf-section-head"><div><span className="sf-card-label">WHERE YOUR MONEY GOES</span><h3>{ui('Categorii','Categories','Категории')}</h3></div><strong>{money(monthTotal)}</strong></div><div className="sf-donut-wrap"><div className="sf-donut"><span>{money(monthTotal)}</span></div><div className="sf-legend">{categoryTotals.slice(0,5).map(([cat,val],i)=>{const item=categoryList.find(x=>x[0]===cat)||['Other','📦','other'];return <div key={cat}><i className={`c${i}`}/><span>{item[1]} {t[item[2]]}</span><b>{monthTotal?Math.round(val/monthTotal*100):0}%</b></div>})}</div></div></section>
          <section className="sf-health-wide"><div><span className="sf-card-label">FINANCIAL HEALTH</span><h3>{financialHealth}/100</h3><p>{healthLabel}</p></div><div className="sf-health-meter"><i style={{width:`${financialHealth}%`}}/></div><button onClick={()=>setModal('monthlyPlan')}>{ui('Editează planul →','Edit plan →','Изменить план →')}</button></section>
        </main>}

        {tab === 'goals' && <main className="sf-page">
          <section className="sf-page-title"><div><span className="sf-card-label">SAVINGS</span><h2>{ui('Obiective','Goals','Цели')}</h2><p>{ui('Construiește-ți viitorul, un obiectiv pe rând.','Build your future, one goal at a time.','Стройте будущее — по одной цели.')}</p></div><button className="sf-round-add" onClick={()=>setModal('goal')}>＋</button></section>
          <div className="sf-goal-tabs"><button className="active">{ui('Active','Active','Активные')}</button><button>{ui('Finalizate','Completed','Завершенные')}</button><button>{ui('Toate','All','Все')}</button></div>
          <section className="sf-goals-page">
            {data.goals.map(g=>{const pct=Math.min(100,Number(g.current_amount||0)/Math.max(Number(g.target_amount),1)*100);const months=estimateMonths(g);return <article className="sf-full-goal" key={g.id}><div className="sf-goal-icon">🎯</div><div className="sf-full-goal-main"><div className="sf-section-head"><div><h3>{g.name}</h3><span>{money(g.current_amount)} / {money(g.target_amount)}</span></div><b>{Math.round(pct)}%</b></div><div className="sf-progress large"><i style={{width:`${pct}%`}}/></div><div className="sf-goal-meta"><span>▣ {months===0?ui('Finalizat','Completed','Готово'):`${months} ${ui('luni rămase','months remaining','мес. осталось')}`}</span><span>◷ {money(Math.max(1,targetMonthlySavings/Math.max(1,data.goals.length)))} / {ui('lună','month','месяц')}</span></div><button onClick={()=>{setSelectedGoalId(g.id);setModal('goalSaving')}}>{ui('Adaugă bani','Add money','Добавить деньги')}</button></div></article>})}
            {!data.goals.length && <div className="sf-empty-goals">{ui('Niciun obiectiv încă.','No goals yet.','Целей пока нет.')}<button onClick={()=>setModal('goal')}>＋ {t.goalAdd}</button></div>}
          </section>
        </main>}

        {tab === 'profile' && <main className="sf-page">
          <section className="sf-profile-hero"><button className="sf-settings-cog" onClick={()=>setModal('settings')}>⚙</button><div className="sf-profile-avatar">{(session.user.email||'U')[0].toUpperCase()}</div><h2>{session.user.user_metadata?.full_name || 'Maxim'}</h2><p>{session.user.email}</p></section>
          <section className="sf-settings-list">
            <button onClick={()=>setModal('monthlyPlan')}><span>▣</span><div><b>{ui('Plan financiar','Financial plan','Финансовый план')}</b><small>{ui('Venit, costuri, ținta de economisire','Income, costs, savings target','Доход, расходы, цель накоплений')}</small></div>›</button>
            <button onClick={()=>setModal('settings')}><span>⚙</span><div><b>{ui('Preferințe','Preferences','Настройки')}</b><small>{ui('Limbă, monedă','Language, currency','Язык, валюта')}</small></div>›</button>
            <button onClick={()=>setTab('statistics')}><span>◔</span><div><b>{ui('Date & statistici','Data & insights','Данные и аналитика')}</b><small>{ui('Vezi evoluția finanțelor','See your financial progress','Смотрите прогресс')}</small></div>›</button>
            <button onClick={()=>setModal('settings')}><span>◉</span><div><b>{ui('Securitate','Security','Безопасность')}</b><small>{ui('Contul și preferințele tale','Your account and preferences','Ваш аккаунт и настройки')}</small></div>›</button>
          </section>
          <button className="sf-saveflow-plus">♛ <div><b>SaveFlow Plus</b><small>{ui('Instrumente avansate','Advanced tools','Расширенные инструменты')}</small></div>›</button>
          <button className="sf-signout" onClick={async()=>{await supabase.auth.signOut()}}>⇥ {t.signOut}</button>
        </main>}

        <nav className="sf-bottom-nav">
          <button className={tab==='home'?'active':''} onClick={()=>setTab('home')}>⌂<span>{ui('Home','Home','Главная')}</span></button>
          <button className={tab==='expenses'?'active':''} onClick={()=>setTab('expenses')}>☷<span>{ui('Activity','Activity','Активность')}</span></button>
          <button className={tab==='statistics'?'active':''} onClick={()=>setTab('statistics')}>▥<span>{ui('Insights','Insights','Аналитика')}</span></button>
          <button className={tab==='goals'?'active':''} onClick={()=>setTab('goals')}>♡<span>{t.goals}</span></button>
          <button className={tab==='profile'?'active':''} onClick={()=>setTab('profile')}>◯<span>{ui('Profile','Profile','Профиль')}</span></button>
        </nav>

        {onboarding && <div className="overlay onboarding-overlay"><div className="modal onboarding-modal animate-modal"><div className="onboarding-progress"><span className={onboardingStep>=1?'on':''}/><span className={onboardingStep>=2?'on':''}/><span className={onboardingStep>=3?'on':''}/></div><div className="modal-head"><div><span className="eyebrow">{t.healthyPlan}</span><h2>{t.onboardingTitle}</h2></div></div><p className="onboarding-subtitle">{t.onboardingSubtitle}</p>{onboardingStep===1&&<><label>{t.monthlyIncome} ({currency})</label><input className="big-input" type="number" value={onboardingData.monthlyIncome} onChange={e=>setOnboardingData(d=>({...d,monthlyIncome:e.target.value}))} placeholder="0" autoFocus/><p className="muted">{ui('Venitul lunar este general. Cash/Card vor fi folosite doar la cheltuieli.','Monthly income is general. Cash/Card are used only for expenses.','Доход общий. Наличные/карта используются только для расходов.')}</p></>}{onboardingStep===2&&<><label>{t.fixedCosts}</label><div className="onboarding-grid">{[['rent',t.rent],['bills',t.bills],['food',t.food],['transport',t.transport],['subscriptions',t.subscriptions],['other',t.otherCosts]].map(([key,label])=><div className="onboarding-field" key={key}><label>{label}</label><input type="number" value={onboardingData[key]} onChange={e=>setOnboardingData(d=>({...d,[key]:e.target.value}))} placeholder="0"/></div>)}</div></>}{onboardingStep===3&&<><label>{t.savingsTarget} (%)</label><input className="big-input" type="number" min="5" max="30" value={onboardingData.savingsTarget} onChange={e=>setOnboardingData(d=>({...d,savingsTarget:e.target.value}))}/><div className="onboarding-preview"><div><span>{t.monthlyIncome}</span><b>{money(profileMonthlyIncome)}</b></div><div><span>{t.fixedCosts}</span><b>{money(profileFixedCosts)}</b></div><div><span>{t.projectedSavings}</span><b>{money(targetMonthlySavings)}</b></div><div><span>{t.safeToSpend}</span><b>{money(safeDailySpend)}</b></div></div></>}<div className="onboarding-actions">{onboardingStep>1&&<button className="secondary" onClick={()=>setOnboardingStep(s=>s-1)}>←</button>}{onboardingStep<3?<button className="primary full" onClick={()=>setOnboardingStep(s=>s+1)}>{t.next} →</button>:<button className="primary full" onClick={saveOnboarding}>{t.finish} ✓</button>}</div></div></div>}

        {modal && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setModal(null)}><div className="modal animate-modal">
          {modal==='expense'&&<><div className="modal-head"><div><span className="eyebrow">CHELTUIALĂ</span><h2>{ui('Adaugă cheltuială','Add expense','Добавить расход')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{t.amount} ({currency})</label><input className="big-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" autoFocus/><label>{t.category}</label><select value={category} onChange={e=>setCategory(e.target.value)}>{categoryList.map(([v,icon,key])=><option key={v} value={v}>{icon} {t[key]}</option>)}</select><label>{t.payment}</label><div className="payment-choice"><button className={paymentMethod==='cash'?'selected':''} onClick={()=>setPaymentMethod('cash')}>💵 {t.cash}</button><button className={paymentMethod==='card'?'selected':''} onClick={()=>setPaymentMethod('card')}>💳 {t.card}</button></div><label>{t.note}</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder={t.expenseNote}/><button className="primary full" onClick={addExpense}>{t.save}</button></>}
          {modal==='income'&&<><div className="modal-head"><div><span className="eyebrow">VENIT GENERAL</span><h2>{ui('Adaugă venit','Add income','Добавить доход')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{ui('Suma primită','Amount received','Полученная сумма')} ({currency})</label><input className="big-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" autoFocus/><label>{ui('Sursă','Source','Источник')}</label><input value={incomeSource} onChange={e=>setIncomeSource(e.target.value)} placeholder="Salariu"/><div className="save-from-income"><div><strong>{ui('Adaugă la economii generale sau la obiectiv','Add to general savings or a goal','Добавить в общие накопления или цель')}</strong><span>{ui('Poți economisi o parte din venitul primit.','You can save part of the income you received.','Можно отложить часть полученного дохода.')}</span></div><input className="big-input" type="number" value={savingAmount} onChange={e=>setSavingAmount(e.target.value)} placeholder="0"/></div><label>{ui('Destinația economiilor','Savings destination','Назначение накоплений')}</label><div className="destination-grid"><button className={savingDestination==='general'?'selected':''} onClick={()=>{setSavingDestination('general');setSelectedGoalId('')}}>🛡️ {ui('Economii generale','General savings','Общие')}</button>{data.goals.map(g=><button key={g.id} className={savingDestination===g.id?'selected':''} onClick={()=>{setSavingDestination(g.id);setSelectedGoalId(g.id)}}>🎯 {g.name}</button>)}</div><button className="primary full" onClick={addIncome}>{t.save}</button></>}
          {modal==='saving'&&<><div className="modal-head"><div><span className="eyebrow">ECONOMII</span><h2>{ui('Adaugă economii','Add savings','Добавить накопления')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{ui('Sumă','Amount','Сумма')} ({currency})</label><input className="big-input" type="number" value={savingAmount} onChange={e=>setSavingAmount(e.target.value)} placeholder="0" autoFocus/><label>{ui('Adaugă la economii generale sau la obiectiv','Add to general savings or a goal','Добавить в общие накопления или цель')}</label><div className="destination-grid"><button className={savingDestination==='general'?'selected':''} onClick={()=>{setSavingDestination('general');setSelectedGoalId('')}}>🛡️ {ui('Economii generale','General savings','Общие накопления')}</button>{data.goals.map(g=><button key={g.id} className={savingDestination===g.id?'selected':''} onClick={()=>{setSavingDestination(g.id);setSelectedGoalId(g.id)}}>🎯 {g.name}</button>)}</div><p className="muted">{ui('Economiile sunt separate de cheltuielile Cash/Card.','Savings are separate from Cash/Card expenses.','Накопления отделены от расходов наличными/картой.')}</p><button className="primary full" onClick={()=>savingDestination==='general'?addGeneralSaving():addGoalContribution()}>{ui('Adaugă economii','Add savings','Добавить накопления')}</button></>}
          {modal==='goalSaving'&&<><div className="modal-head"><div><span className="eyebrow">OBIECTIV</span><h2>{data.goals.find(g=>g.id===selectedGoalId)?.name||'Goal'}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{ui('Cât adaugi?','How much?','Сколько добавить?')} ({currency})</label><input className="big-input" type="number" value={savingAmount} onChange={e=>setSavingAmount(e.target.value)} placeholder="0" autoFocus/><p className="muted">{ui('SaveFlow recalculează automat progresul și timpul rămas.','SaveFlow automatically recalculates progress and time remaining.','SaveFlow автоматически пересчитает прогресс и оставшееся время.')}</p><button className="primary full" onClick={addGoalContribution}>{ui('Adaugă la obiectiv','Add to goal','Добавить')}</button></>}
          {modal==='goal'&&<><div className="modal-head"><div><span className="eyebrow">OBIECTIV NOU</span><h2>{t.goalAdd}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{t.goalName}</label><input value={goalName} onChange={e=>setGoalName(e.target.value)} placeholder={ui('iPhone 16, Mașină, Vacanță...','iPhone, Car, Vacation...','Телефон, машина, отпуск...')}/><label>{t.target} ({currency})</label><input className="big-input" type="number" value={goalTarget} onChange={e=>setGoalTarget(e.target.value)} placeholder="0"/><button className="primary full" onClick={()=>createGoal()}>{t.addGoal}</button></>}
          {modal==='afford'&&<><div className="modal-head"><div><span className="eyebrow">SMART CHECK</span><h2>Îți permiți?</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>SUMĂ ({currency})</label><input className="big-input" type="number" value={affordAmount} onChange={e=>setAffordAmount(e.target.value)} placeholder="0" autoFocus/>{affordability.value>0&&<div className={`afford-result ${affordability.safe?'good':'warn'}`}><strong>{affordability.safe?'✓ Poți lua în calcul':'⚠️ Mai bine amână'}</strong><p>{affordability.safe?`După cheltuială ai avea ${money(affordability.after)}.`:'Această cheltuială depășește spațiul sigur calculat de SaveFlow.'}</p></div>}<button className="primary full" onClick={()=>setModal(null)}>Închide</button></>}
          {modal==='settings'&&<><div className="modal-head"><h2>{t.settings}</h2><button onClick={()=>setModal(null)}>×</button></div><label>{t.language}</label><select value={language} onChange={e=>savePreferences(e.target.value,currency)}><option value="ro">🇲🇩 Română</option><option value="en">🇬🇧 English</option><option value="ru">🇷🇺 Русский</option></select><label>{t.currency}</label><select value={currency} onChange={e=>savePreferences(language,e.target.value)}><option value="MDL">🇲🇩 MDL</option><option value="EUR">🇪🇺 EUR</option><option value="USD">🇺🇸 USD</option></select><button className="secondary full" onClick={async()=>{await supabase.auth.signOut();setModal(null)}}>{t.signOut}</button></>}
        </div></div>}
      </div>
    </div>
  )
}

export default App
