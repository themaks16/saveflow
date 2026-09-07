import { useEffect, useMemo, useState } from 'react'
import './App.css'
import './ReferenceTheme.css'

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
const dateKey = (value) => String(value || '').slice(0, 10)
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
  const [hoveredTrend, setHoveredTrend] = useState(null)
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

  const deleteGoal = async (goalId) => {
    const goal = data.goals.find(g => g.id === goalId)
    if (!goal) return
    const confirmed = window.confirm(ui(`Ștergi obiectivul „${goal.name}”? Contribuțiile salvate pentru acest obiectiv vor fi șterse și ele.`, `Delete “${goal.name}”? Savings contributions for this goal will also be removed.`, `Удалить «${goal.name}»? Накопления по этой цели также будут удалены.`))
    if (!confirmed) return
    setLoading(true)
    setError('')
    const { error: contributionError } = await supabase.from('savings_contributions').delete().eq('goal_id', goalId).eq('user_id', session.user.id)
    if (contributionError) { setError(contributionError.message); setLoading(false); return }
    const { error: goalError } = await supabase.from('savings_goals').delete().eq('id', goalId).eq('user_id', session.user.id)
    if (goalError) { setError(goalError.message); setLoading(false); return }
    setSelectedGoalId('')
    setModal(null)
    await load()
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
  const currentMonthKey = todayKey().slice(0, 7)
  const monthExpenses = expenses.filter(x => dateKey(x.transaction_date || x.created_at).startsWith(currentMonthKey))
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
  const healthStatus = financialHealth >= 85
    ? { label: ui('Foarte sănătos', 'Very healthy', 'Очень здоровый'), tone: 'excellent' }
    : financialHealth >= 70
      ? { label: ui('Sănătos', 'Healthy', 'Здоровый'), tone: 'healthy' }
      : financialHealth >= 50
        ? { label: ui('Echilibrat', 'Balanced', 'Сбалансированный'), tone: 'balanced' }
        : financialHealth >= 30
          ? { label: ui('La risc', 'At risk', 'Под угрозой'), tone: 'risk' }
          : { label: ui('Critic', 'Critical', 'Критический'), tone: 'critical' }
  const healthLabel = healthStatus.label
  const weekStart = new Date(); weekStart.setHours(0,0,0,0); weekStart.setDate(weekStart.getDate()-6)
  const previousWeekStart = new Date(weekStart); previousWeekStart.setDate(previousWeekStart.getDate()-7)
  const previousWeekEnd = new Date(weekStart); previousWeekEnd.setDate(previousWeekEnd.getDate()-1); previousWeekEnd.setHours(23,59,59,999)
  const previousWeekExpenses = expenses.filter(x => { const d=new Date(x.created_at); return d>=previousWeekStart && d<=previousWeekEnd }).reduce((s,x)=>s+Number(x.amount),0)
  const weeklyChange = previousWeekExpenses > 0 ? (weekTotal-previousWeekExpenses)/previousWeekExpenses*100 : 0
  const monthSavingsRate = profileMonthlyIncome > 0 ? totalSaved / profileMonthlyIncome * 100 : 0
  const dailyTrend = useMemo(() => Array.from({length:7},(_,i)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-6+i);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const value=expenses.filter(x=>dateKey(x.transaction_date || x.created_at)===key).reduce((s,x)=>s+Number(x.amount),0);return {key,label:d.toLocaleDateString(language==='en'?'en-US':language==='ru'?'ru-RU':'ro-MD',{weekday:'short'}),value}}),[expenses,language])
  const fixedItems = useMemo(() => [
    { key:'rent', label:t.rent, icon:'🏠', category:'Rent', planned:Number(onboardingData.rent||0) },
    { key:'bills', label:t.bills, icon:'💡', category:'Bills', planned:Number(onboardingData.bills||0) },
    { key:'food', label:t.food, icon:'🍔', category:'Food', planned:Number(onboardingData.food||0) },
    { key:'transport', label:t.transport, icon:'🚗', category:'Transport', planned:Number(onboardingData.transport||0) },
    { key:'subscriptions', label:t.subscriptions, icon:'📱', category:'Subscriptions', planned:Number(onboardingData.subscriptions||0) },
    { key:'other', label:t.otherCosts, icon:'＋', category:'Other', planned:Number(onboardingData.other||0) },
  ].map(item => ({ ...item, spent: monthExpenses.filter(x => x.category === item.category).reduce((sum, x) => sum + Number(x.amount), 0) })), [monthExpenses,onboardingData,t])
  const goalStats = useMemo(() => Object.fromEntries(data.goals.map(g=>[g.id,Number(g.current_amount||0)])),[data.goals])
  const estimateMonths = (goal) => { const remaining=Math.max(0,Number(goal.target_amount)-Number(goal.current_amount||0)); const own=data.savingsContributions.filter(x=>x.goal_id===goal.id && Date.now()-new Date(x.created_at).getTime()<=90*86400000).reduce((s,x)=>s+Number(x.amount||0),0)/3; const monthly=Math.max(1,own||targetMonthlySavings/Math.max(1,data.goals.length)); return remaining===0?0:Math.ceil(remaining/monthly) }
  const affordability = useMemo(()=>{const v=Number(affordAmount||0);return {value:v, safe:v>0&&v<=availableBalance&&v<=Math.max(0,safeDailySpend*3),after:Math.max(0,availableBalance-v)}},[affordAmount,availableBalance,safeDailySpend])
  const daysElapsed = Math.max(1, new Date().getDate())
  const projectedMonthSpend = monthTotal / daysElapsed * 30
  const spendingPace = projectedMonthSpend > discretionary ? 'high' : projectedMonthSpend > discretionary * .8 ? 'watch' : 'good'
  const smartAdvice = availableBalance < 0 ? ui('Ai depășit veniturile înregistrate. Oprește cheltuielile discreționare până revii pe plus.','Recorded spending is above income. Pause discretionary spending until you recover.','Расходы превышают доход. Приостановите необязательные траты.') : spendingPace === 'high' ? ui(`La ritmul actual ai cheltui aproximativ ${money(projectedMonthSpend)} până la final de lună — peste spațiul tău de ${money(discretionary)}. Redu cheltuielile flexibile în următoarele zile.`,`At this pace you may spend about ${money(projectedMonthSpend)} by month-end — above your ${money(discretionary)} safe space. Reduce flexible spending over the next few days.`,`При таком темпе вы потратите около ${money(projectedMonthSpend)} к концу месяца — больше безопасного лимита ${money(discretionary)}.`) : monthSavingsRate < targetRate ? ui(`Ai pus deoparte ${Math.round(monthSavingsRate)}% din venit. Ținta ta este ${targetRate}%. Încearcă să economisești imediat când primești salariul.`,`You saved ${Math.round(monthSavingsRate)}% of income. Your target is ${targetRate}%. Save first when income arrives.`,`Вы накопили ${Math.round(monthSavingsRate)}% дохода. Ваша цель — ${targetRate}%. Откладывайте сразу после получения дохода.`) : ui('Foarte bine. Ritmul actual de cheltuire și economisire este în linie cu planul tău.','Great. Your current spending and saving pace is in line with your plan.','Отлично. Текущий темп расходов и накоплений соответствует вашему плану.')

  const saveOnboarding = async () => {
    const income=Number(onboardingData.monthlyIncome); if(!income||income<=0){setError(ui('Introdu venitul lunar.','Enter monthly income.','Введите доход за месяц.'));return}
    const monthlyCosts=profileFixedCosts, recommendedWeekly=Math.max(1,(income-monthlyCosts-(income*targetRate/100))/4.345)
    const {error:e}=await supabase.from('profiles').update({monthly_income:income,rent:Number(onboardingData.rent||0),bills:Number(onboardingData.bills||0),food:Number(onboardingData.food||0),transport:Number(onboardingData.transport||0),subscriptions:Number(onboardingData.subscriptions||0),other_costs:Number(onboardingData.other||0),savings_target_percent:targetRate,onboarding_completed:true,monthly_budget:Math.max(1,income-monthlyCosts),weekly_budget:recommendedWeekly,updated_at:new Date().toISOString()}).eq('id',session.user.id)
    if(e){setError(e.message);return};setData(d=>({...d,monthlyBudget:Math.max(1,income-monthlyCosts),weeklyBudget:recommendedWeekly}));setOnboarding(false);setOnboardingStep(1)
  }

  const advanceOnboarding = () => {
    if (onboardingStep === 1 && (!Number(onboardingData.monthlyIncome) || Number(onboardingData.monthlyIncome) <= 0)) {
      setError(ui('Introdu venitul lunar pentru a continua.', 'Enter your monthly income to continue.', 'Введите ежемесячный доход, чтобы продолжить.'))
      return
    }
    setError('')
    setOnboardingStep(step => step + 1)
  }

  const saveMonthlyPlan = async () => {
    const income = Number(onboardingData.monthlyIncome)
    if (!income || income <= 0) { setError(ui('Introdu venitul lunar.', 'Enter monthly income.', 'Введите доход за месяц.')); return }
    const monthlyCosts = profileFixedCosts
    const recommendedWeekly = Math.max(1, (income - monthlyCosts - (income * targetRate / 100)) / 4.345)
    const { error: e } = await supabase.from('profiles').update({
      monthly_income: income, rent: Number(onboardingData.rent || 0), bills: Number(onboardingData.bills || 0),
      food: Number(onboardingData.food || 0), transport: Number(onboardingData.transport || 0),
      subscriptions: Number(onboardingData.subscriptions || 0), other_costs: Number(onboardingData.other || 0),
      savings_target_percent: targetRate, monthly_budget: Math.max(1, income - monthlyCosts), weekly_budget: recommendedWeekly,
      updated_at: new Date().toISOString(),
    }).eq('id', session.user.id)
    if (e) { setError(e.message); return }
    setData(d => ({ ...d, monthlyBudget: Math.max(1, income - monthlyCosts), weeklyBudget: recommendedWeekly }))
    setModal(null)
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
    <div className="app-shell saveflow-v3">
      <div className="app">
        <header className="topbar">
          <div className="brand-lockup"><div className="brand-mark">S</div><div><span className="eyebrow">{t.finances}</span><h1>Save<span>Flow</span></h1></div></div>
          <button className="avatar" onClick={() => setModal('settings')}>{(session.user.email||'U')[0].toUpperCase()}</button>
        </header>
        {error && <div className="tip animate-pop">⚠ {error}</div>}
        {loading && <div className="tip">{t.syncing}</div>}

        {tab === 'home' && <>
          <section className="hero-card v3-hero animate-in">
            <div><span>VENIT DISPONIBIL</span><h2>{money(availableBalance)}</h2><p>{ui('Venituri înregistrate','Recorded income','Зарегистрированный доход')}: {money(totalIncome)}</p></div>
            <div className={`health-badge health-${healthStatus.tone}`}><span>FINANCIAL HEALTH</span><div className="health-badge-ring" style={{'--p':`${financialHealth*3.6}deg`}}><b>{financialHealth}</b></div><small>/100 · {healthLabel}</small></div>
          </section>
          <section className="income-cta card animate-in" onClick={()=>setModal('income')}><div className="income-icon">＋</div><div><span className="eyebrow">{t.addIncome}</span><h2>{ui('Adaugă venit','Add income','Добавить доход')}</h2><p>{ui('Salariu, freelance, bonus sau orice alt venit.','Salary, freelance, bonus or any other income.','Зарплата, фриланс, бонус или другой доход.')}</p></div><b>→</b></section>
          <div className="stats-grid home-stats">
            <section className="card stat"><span>VENIT LUNAR</span><h3>{money(profileMonthlyIncome||totalIncome)}</h3><small>{ui('planificat','planned','запланировано')}</small></section>
            <section className="card stat"><span>ECONOMII</span><h3>{money(totalSaved)}</h3><small>{Math.round(monthSavingsRate)}% {ui('din venit','of income','от дохода')}</small></section>
            <section className="card stat"><span>CHELTUIT LUNA</span><h3>{money(monthTotal)}</h3><small>{money(avgDay)} / zi</small></section>
            <section className="card stat"><span>RĂMAS</span><h3>{money(Math.max(0,(profileMonthlyIncome||totalIncome)-monthTotal-totalSaved))}</h3><small>{ui('după economii','after savings','после накоплений')}</small></section>
          </div>
          <section className="card savings-card animate-in"><div className="section-title"><div><span className="eyebrow">ECONOMII</span><h2>{ui('Economii','Savings','Накопления')}</h2></div></div><div className="savings-pill"><span>🛡️ {ui('Economii generale','General savings','Общие накопления')}</span><b>{money(generalSavings)}</b></div><div className="savings-pill"><span>🎯 {ui('Pentru obiective','For goals','На цели')}</span><b>{money(Math.max(0,totalSaved-generalSavings))}</b></div><button className="savings-add" onClick={()=>{setSavingAmount('');setSavingDestination('general');setSelectedGoalId('');setModal('saving')}}>＋ {ui('Adaugă economii','Add savings','Добавить накопления')}</button></section>
          <section className={`card smart-advice-card animate-in pace-${spendingPace}`}><div className="advice-icon">✦</div><div><span className="eyebrow">{t.smartAdvice}</span><h3>{spendingPace==='high'?ui('Atenție la ritmul de cheltuire','Watch your spending pace','Следите за темпом расходов'):t.healthyPlan}</h3><p>{smartAdvice}</p><div className="advice-metrics"><div><span>{t.safeToSpend}</span><b>{money(safeDailySpend)}</b><small>/ zi</small></div><div><span>{ui('PROIECȚIE LUNARĂ','MONTHLY FORECAST','ПРОГНОЗ НА МЕСЯЦ')}</span><b>{money(projectedMonthSpend)}</b><small>{spendingPace==='good'?ui('în limite','on track','в норме'):ui('urmărește','watch','следи')}</small></div></div></div></section>
          <section className="card animate-in"><div className="section-title"><div><span className="eyebrow">THIS WEEK</span><h2>{ui('Raport săptămânal','Weekly report','Недельный отчёт')}</h2></div><strong className={weeklyChange<=0?'positive':'negative'}>{weeklyChange===0?'—':`${weeklyChange>0?'+':''}${Math.round(weeklyChange)}%`}</strong></div><div className="report-grid"><div><span>Cheltuit</span><b>{money(weekTotal)}</b></div><div><span>Economisit</span><b>{money(weekSaved)}</b></div><div><span>Venit</span><b>{money(weekIncome)}</b></div><div><span>Scor</span><b>{financialHealth}/100</b></div></div><button className="link-button" onClick={()=>setTab('statistics')}>Vezi raportul complet →</button></section>
        </>}

        {tab === 'expenses' && <>
          <section className="page-heading"><span className="eyebrow">TRANZACȚII</span><h2>{t.expenses}</h2><p>{ui('Fiecare cheltuială cu data și ora.','Every expense with date and time.','Каждый расход с датой и временем.')}</p></section>
          <button className="primary full expense-add" onClick={()=>setModal('expense')}>＋ {ui('Adaugă cheltuială','Add expense','Добавить расход')}</button>
          <section className="card expense-list">{expenses.length ? expenses.map(x=>{const c=categoryList.find(y=>y[0]===x.category)||['Other','📦','other'];return <div className="expense v3-expense" key={x.id}><div className="expense-icon">{c[1]}</div><div className="expense-name"><strong>{x.note}</strong><span>{t[c[2]]} · {x.payment_method==='cash'?'💵 Cash':'💳 Card'}</span><small>{dateTime(x.created_at)}</small></div><b>-{money(x.amount)}</b></div>}) : <div className="empty">{t.noData}</div>}</section>
        </>}

        {tab === 'statistics' && <>
          <section className="page-heading"><span className="eyebrow">TRANSPARENȚĂ</span><h2>{ui('Statistici','Statistics','Статистика')}</h2><p>{ui('Tot ce se întâmplă cu banii tăi, într-un singur loc.','Everything happening with your money, in one place.','Все движения денег в одном месте.')}</p></section>
          <section className={`health-card card health-${healthStatus.tone}`}><div className="health-top"><div><span className="eyebrow">FINANCIAL HEALTH</span><h2>{financialHealth}<small>/100</small></h2><p>{healthLabel}</p></div><div className="health-ring" aria-label={`${healthLabel}: ${financialHealth} din 100`} style={{'--p':`${financialHealth*3.6}deg`}}><span><b>{financialHealth}</b><small>SCOR</small></span></div></div><div className="health-scale" aria-label={ui('Scală sănătate financiară','Financial health scale','Шкала финансового здоровья')}><span className={financialHealth<30?'active':''}>{ui('Critic','Critical','Критично')}</span><span className={financialHealth>=30&&financialHealth<50?'active':''}>{ui('La risc','At risk','Риск')}</span><span className={financialHealth>=50&&financialHealth<70?'active':''}>{ui('Echilibrat','Balanced','Баланс')}</span><span className={financialHealth>=70&&financialHealth<85?'active':''}>{ui('Sănătos','Healthy','Здорово')}</span><span className={financialHealth>=85?'active':''}>{ui('Foarte sănătos','Very healthy','Отлично')}</span></div></section>
          <section className="card fixed-cost-card"><div className="section-title"><div><span className="eyebrow">CHELTUIELI FIXE · {new Intl.DateTimeFormat(language==='en'?'en-US':language==='ru'?'ru-RU':'ro-MD',{month:'long'}).format(new Date())}</span><h2>{ui('Lunar de bază','Monthly essentials','Ежемесячные базовые')}</h2></div><div className="fixed-cost-actions"><strong>{money(profileFixedCosts)}</strong><button className="icon-button" onClick={()=>setModal('monthlyPlan')} aria-label={ui('Editează cheltuielile fixe','Edit fixed costs','Изменить постоянные расходы')}>✎</button></div></div><p className="fixed-cost-note">{ui('Progresul se completează automat din tranzacțiile din luna curentă.','Progress fills automatically from this month’s transactions.','Прогресс автоматически заполняется операциями за этот месяц.')}</p><div className="fixed-cost-list">{fixedItems.map(item=>{const pct=item.planned?Math.min(100,item.spent/item.planned*100):0;return <div className="fixed-cost fixed-cost-progress" key={item.key}><div className="fixed-cost-head"><span>{item.icon} {item.label}</span><b>{money(item.spent)} <small>/ {money(item.planned)}</small></b></div><div className="fixed-progress-track" aria-label={`${item.label}: ${Math.round(pct)}%`}><div className={item.spent>item.planned?'over':''} style={{width:`${pct}%`}}/></div><small className="fixed-progress-copy">{item.planned?ui(`${Math.round(pct)}% achitat luna aceasta`,` ${Math.round(pct)}% paid this month`,`Оплачено ${Math.round(pct)}%`):ui('Adaugă un buget lunar','Add a monthly budget','Добавьте бюджет на месяц')}</small></div>})}</div><button className="text-action" onClick={()=>setModal('monthlyPlan')}>{ui('Editează planul acestei luni →','Edit this month’s plan →','Изменить план на месяц →')}</button></section>
          <section className="card chart-card"><div className="section-title"><div><span className="eyebrow">ULTIMELE 7 ZILE</span><h2>{ui('Trend cheltuieli','Spending trend','Динамика расходов')}</h2></div><strong>{money(weekTotal)}</strong></div><p className="chart-helper">{ui('Atinge sau treci cursorul peste puncte pentru detalii.','Hover or tap a point for details.','Наведите или коснитесь точки для деталей.')}</p><div className="spark-chart" onPointerLeave={()=>setHoveredTrend(null)}><div className="spark-grid"><i/><i/><i/></div><svg viewBox="0 0 350 130" preserveAspectRatio="none" className="spark-svg" role="img" aria-label={ui('Grafic interactiv al cheltuielilor din ultimele 7 zile','Interactive spending chart for the last 7 days','Интерактивный график расходов за 7 дней')} onPointerMove={e=>{const rect=e.currentTarget.getBoundingClientRect();setHoveredTrend(Math.max(0,Math.min(6,Math.round(((e.clientX-rect.left)/rect.width)*6))))}}><defs><linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="currentColor" stopOpacity=".36"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path d={`M 3,125 L ${dailyTrend.map((d,i)=>`${i*58.3+3},${125-Math.min(105,(d.value/Math.max(...dailyTrend.map(x=>x.value),1))*105)}`).join(' L ')} L 353,125 Z`} className="spark-area"/>
              <polyline points={dailyTrend.map((d,i)=>`${i*58.3+3},${125-Math.min(105,(d.value/Math.max(...dailyTrend.map(x=>x.value),1))*105)}`).join(' ')} fill="none" pathLength="1" className="spark-line"/>{dailyTrend.map((d,i)=>{const y=125-Math.min(105,(d.value/Math.max(...dailyTrend.map(x=>x.value),1))*105);return <g key={d.key} className={hoveredTrend===i?'trend-point active':'trend-point'} onPointerEnter={()=>setHoveredTrend(i)}><circle cx={i*58.3+3} cy={y} r="10" className="spark-hit"/><circle cx={i*58.3+3} cy={y} r="3.8" className="spark-dot"/></g>})}</svg>{hoveredTrend!==null&&<div className="chart-tooltip" style={{left:`${hoveredTrend/6*100}%`}}><b>{dailyTrend[hoveredTrend].label}</b><span>{money(dailyTrend[hoveredTrend].value)}</span></div>}</div><div className="trend-labels">{dailyTrend.map((d,i)=><button key={d.key} className={hoveredTrend===i?'active':''} onClick={()=>setHoveredTrend(i)}>{d.label}</button>)}</div></section>
          <section className="card"><div className="section-title"><div><span className="eyebrow">CATEGORII</span><h2>{ui('Unde se duc banii','Where money goes','Куда уходят деньги')}</h2></div><strong>{money(monthTotal)}</strong></div>{categoryTotals.length?categoryTotals.slice(0,7).map(([cat,value])=>{const item=categoryList.find(x=>x[0]===cat)||['Other','📦','other'];const pct=monthTotal?value/monthTotal*100:0;return <div className="cat-bar" key={cat}><div className="cat-row"><span>{item[1]} {t[item[2]]}</span><b>{money(value)}</b></div><div className="cat-track"><div style={{width:`${pct}%`}}/></div></div>}):<div className="empty">{t.noData}</div>}</section>
          <section className="card payment-mix-card"><div className="section-title"><div><span className="eyebrow">PAYMENT MIX</span><h2>Cash vs Card</h2></div><strong>{money(cashSpend+cardSpend)}</strong></div><div className="donut-wrap"><div className="donut" style={{'--cash':`${cashSpend/Math.max(cashSpend+cardSpend,1)*100}%`}}><span>{Math.round(cashSpend/Math.max(cashSpend+cardSpend,1)*100)}%</span></div><div className="donut-legend"><div className="payment-row"><span className="payment-name">💵 Cash</span><b>{money(cashSpend)}</b></div><div className="payment-row"><span className="payment-name">💳 Card</span><b>{money(cardSpend)}</b></div></div></div></section>
          <section className="card weekly-report"><div className="section-title"><div><span className="eyebrow">WEEKLY REPORT</span><h2>{ui('Raportul săptămânii','This week','Эта неделя')}</h2></div><strong>{financialHealth}/100</strong></div><div className="report-grid"><div><span>Cheltuit</span><b>{money(weekTotal)}</b></div><div><span>Săptămâna trecută</span><b>{money(previousWeekExpenses)}</b></div><div><span>Economisit</span><b>{money(weekSaved)}</b></div><div><span>Venit</span><b>{money(weekIncome)}</b></div></div><div className={`weekly-verdict ${weeklyChange<=0?'good':'warn'}`}>{weeklyChange<=0?'🌱 Ai cheltuit mai puțin sau la fel ca săptămâna trecută.':'⚠️ Cheltuielile au crescut față de săptămâna trecută.'}</div><p className="muted">{ui(`Scorul este ${financialHealth}/100 și se bazează transparent pe economisire, cheltuieli și respectarea bugetului.`,`Your score is ${financialHealth}/100 and transparently reflects savings, spending and budget discipline.`,`Ваш балл ${financialHealth}/100 прозрачно учитывает накопления, расходы и бюджет.`)}</p></section>
        </>}

        {tab === 'goals' && <>
          <section className="page-heading"><span className="eyebrow">OBIECTIVE</span><h2>{t.goals}</h2><p>{ui('Spune-i lui SaveFlow ce vrei să cumperi.','Tell SaveFlow what you want to buy.','Скажите SaveFlow, что хотите купить.')}</p></section>
          <section className="card"><h3>{t.suggested}</h3><div className="goal-suggestions">{goalSuggestions.map(([key,icon])=><button className="goal-chip" key={key} onClick={()=>{setGoalName(t[key]);setModal('goal')}}>{icon} {t[key]}</button>)}</div></section>
          {data.goals.map(g=>{const pct=Math.min(100,Number(g.current_amount||0)/Math.max(Number(g.target_amount),1)*100);const months=estimateMonths(g);return <section className="card goal-card" key={g.id}><div className="goal-head"><div className="goal-title"><span className="eyebrow">TARGET</span><h2>{g.name}</h2></div><div className="goal-head-actions"><strong>{Math.round(pct)}%</strong><button className="goal-delete" title={ui('Șterge obiectivul','Delete goal','Удалить цель')} aria-label={ui('Șterge obiectivul','Delete goal','Удалить цель')} onClick={()=>deleteGoal(g.id)}>×</button></div></div><div className="progress-track"><div className="progress-bar savings" style={{width:`${pct}%`}}/></div><div className="budget-row"><span>{money(g.current_amount)} / {money(g.target_amount)}</span><span>{months===0?ui('Atins! 🎉','Completed! 🎉','Готово! 🎉'):`~${months} ${ui('luni','months','мес.')}`}</span></div><button className="secondary full" onClick={()=>{setSelectedGoalId(g.id);setModal('goalSaving')}}>{ui('＋ Adaugă bani la obiectiv','＋ Add to goal','＋ Добавить к цели')}</button></section>})}
          <button className="primary full" onClick={()=>setModal('goal')}>＋ {t.goalAdd}</button>
        </>}

        <nav className="bottom-nav"><button className={tab==='home'?'active':''} onClick={()=>setTab('home')}>⌂<span>{t.home}</span></button><button className={tab==='statistics'?'active':''} onClick={()=>setTab('statistics')}>▥<span>{t.statistics}</span></button><button className={tab==='goals'?'active':''} onClick={()=>setTab('goals')}>◎<span>{t.goals}</span></button><button className={tab==='expenses'?'active':''} onClick={()=>setTab('expenses')}>↘<span>{t.expenses}</span></button><button onClick={()=>setModal('settings')}>◉<span>{ui('Profil','Profile','Профиль')}</span></button></nav>

        {onboarding && <div className="overlay onboarding-overlay"><div className="modal onboarding-modal animate-modal"><div className="onboarding-progress"><span className={onboardingStep>=1?'on':''}/><span className={onboardingStep>=2?'on':''}/><span className={onboardingStep>=3?'on':''}/></div><div className="modal-head"><div><span className="eyebrow">{t.healthyPlan}</span><h2>{t.onboardingTitle}</h2></div></div><p className="onboarding-subtitle">{t.onboardingSubtitle}</p>{error&&<div className="tip onboarding-error" role="alert">⚠ {error}</div>}{onboardingStep===1&&<><label>{t.monthlyIncome} ({currency})</label><input className="big-input" type="number" value={onboardingData.monthlyIncome} onChange={e=>{setError('');setOnboardingData(d=>({...d,monthlyIncome:e.target.value}))}} placeholder="0" autoFocus/><p className="muted">{ui('Venitul lunar este general. Cash/Card vor fi folosite doar la cheltuieli.','Monthly income is general. Cash/Card are used only for expenses.','Доход общий. Наличные/карта используются только для расходов.')}</p></>}{onboardingStep===2&&<><label>{t.fixedCosts}</label><div className="onboarding-grid">{[['rent',t.rent],['bills',t.bills],['food',t.food],['transport',t.transport],['subscriptions',t.subscriptions],['other',t.otherCosts]].map(([key,label])=><div className="onboarding-field" key={key}><label>{label}</label><input type="number" value={onboardingData[key]} onChange={e=>setOnboardingData(d=>({...d,[key]:e.target.value}))} placeholder="0"/></div>)}</div></>}{onboardingStep===3&&<><label>{t.savingsTarget} (%)</label><input className="big-input" type="number" min="5" max="30" value={onboardingData.savingsTarget} onChange={e=>setOnboardingData(d=>({...d,savingsTarget:e.target.value}))}/><div className="onboarding-preview"><div><span>{t.monthlyIncome}</span><b>{money(profileMonthlyIncome)}</b></div><div><span>{t.fixedCosts}</span><b>{money(profileFixedCosts)}</b></div><div><span>{t.projectedSavings}</span><b>{money(targetMonthlySavings)}</b></div><div><span>{t.safeToSpend}</span><b>{money(safeDailySpend)}</b></div></div></>}<div className="onboarding-actions">{onboardingStep>1&&<button className="secondary" onClick={()=>{setError('');setOnboardingStep(s=>s-1)}}>←</button>}{onboardingStep<3?<button className="primary full" onClick={advanceOnboarding}>{t.next} →</button>:<button className="primary full" onClick={saveOnboarding}>{t.finish} ✓</button>}</div></div></div>}

        {modal && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setModal(null)}><div className="modal animate-modal">
          {modal==='expense'&&<><div className="modal-head"><div><span className="eyebrow">CHELTUIALĂ</span><h2>{ui('Adaugă cheltuială','Add expense','Добавить расход')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{t.amount} ({currency})</label><input className="big-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" autoFocus/><label>{t.category}</label><select value={category} onChange={e=>setCategory(e.target.value)}>{categoryList.map(([v,icon,key])=><option key={v} value={v}>{icon} {t[key]}</option>)}</select><label>{t.payment}</label><div className="payment-choice"><button className={paymentMethod==='cash'?'selected':''} onClick={()=>setPaymentMethod('cash')}>💵 {t.cash}</button><button className={paymentMethod==='card'?'selected':''} onClick={()=>setPaymentMethod('card')}>💳 {t.card}</button></div><label>{t.note}</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder={t.expenseNote}/><button className="primary full" onClick={addExpense}>{t.save}</button></>}
          {modal==='income'&&<><div className="modal-head"><div><span className="eyebrow">VENIT GENERAL</span><h2>{ui('Adaugă venit','Add income','Добавить доход')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{ui('Suma primită','Amount received','Полученная сумма')} ({currency})</label><input className="big-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0" autoFocus/><label>{ui('Sursă','Source','Источник')}</label><input value={incomeSource} onChange={e=>setIncomeSource(e.target.value)} placeholder="Salariu"/><div className="save-from-income"><div><strong>{ui('Pune o parte deoparte','Set some aside','Отложите часть')}</strong><span>{ui('Opțional: economii generale sau un obiectiv.','Optional: general savings or a goal.','Необязательно: общие накопления или цель.')}</span></div><input className="big-input" type="number" value={savingAmount} onChange={e=>setSavingAmount(e.target.value)} placeholder="0"/></div><label>{ui('Unde merg economiile?','Where should savings go?','Куда направить накопления?')}</label><div className="destination-grid"><button className={savingDestination==='general'?'selected':''} onClick={()=>{setSavingDestination('general');setSelectedGoalId('')}}><span className="destination-icon">🛡️</span><span><b>{ui('Economii generale','General savings','Общие накопления')}</b><small>{ui('Fond flexibil, fără obiectiv','Flexible fund, no goal','Гибкий фонд без цели')}</small></span></button>{data.goals.map(g=><button key={g.id} className={savingDestination===g.id?'selected':''} onClick={()=>{setSavingDestination(g.id);setSelectedGoalId(g.id)}}><span className="destination-icon">🎯</span><span><b>{g.name}</b><small>{ui('Obiectiv selectat','Selected goal','Выбранная цель')}</small></span></button>)}</div><button className="primary full" onClick={addIncome}>{t.save}</button></>}
          {modal==='saving'&&<><div className="modal-head"><div><span className="eyebrow">ECONOMII</span><h2>{ui('Adaugă economii','Add savings','Добавить накопления')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><label>{ui('Sumă','Amount','Сумма')} ({currency})</label><input className="big-input" type="number" value={savingAmount} onChange={e=>setSavingAmount(e.target.value)} placeholder="0" autoFocus/><label>{ui('Alege destinația','Choose a destination','Выберите назначение')}</label><div className="destination-grid"><button className={savingDestination==='general'?'selected':''} onClick={()=>{setSavingDestination('general');setSelectedGoalId('')}}><span className="destination-icon">🛡️</span><span><b>{ui('Economii generale','General savings','Общие накопления')}</b><small>{ui('Fond flexibil, fără obiectiv','Flexible fund, no goal','Гибкий фонд без цели')}</small></span></button>{data.goals.map(g=><button key={g.id} className={savingDestination===g.id?'selected':''} onClick={()=>{setSavingDestination(g.id);setSelectedGoalId(g.id)}}><span className="destination-icon">🎯</span><span><b>{g.name}</b><small>{ui('Obiectiv selectat','Selected goal','Выбранная цель')}</small></span></button>)}</div><p className="muted">{ui('Economiile sunt separate de cheltuielile Cash/Card.','Savings are separate from Cash/Card expenses.','Накопления отделены от расходов наличными/картой.')}</p><button className="primary full" onClick={()=>savingDestination==='general'?addGeneralSaving():addGoalContribution()}>{ui('Adaugă economii','Add savings','Добавить накопления')}</button></>}
          {modal==='monthlyPlan'&&<><div className="modal-head"><div><span className="eyebrow">PLAN LUNAR</span><h2>{ui('Cheltuieli fixe','Fixed costs','Постоянные расходы')}</h2></div><button onClick={()=>setModal(null)}>×</button></div><p className="muted">{ui('Modifică planul pentru luna curentă când facturile se schimbă. Tranzacțiile înregistrate nu sunt modificate.','Update this month’s plan when bills change. Recorded transactions are never changed.','Меняйте план текущего месяца при изменении счетов. Записанные операции не изменяются.')}</p><label>{t.monthlyIncome} ({currency})</label><input className="big-input" type="number" value={onboardingData.monthlyIncome} onChange={e=>setOnboardingData(d=>({...d,monthlyIncome:e.target.value}))} placeholder="0"/><div className="onboarding-grid monthly-plan-grid">{[['rent',t.rent],['bills',t.bills],['food',t.food],['transport',t.transport],['subscriptions',t.subscriptions],['other',t.otherCosts]].map(([key,label])=><div className="onboarding-field" key={key}><label>{label} ({currency})</label><input type="number" value={onboardingData[key]} onChange={e=>setOnboardingData(d=>({...d,[key]:e.target.value}))} placeholder="0"/></div>)}</div><label>{t.savingsTarget} (%)</label><input type="number" min="5" max="30" value={onboardingData.savingsTarget} onChange={e=>setOnboardingData(d=>({...d,savingsTarget:e.target.value}))}/><button className="primary full" onClick={saveMonthlyPlan}>{ui('Salvează planul lunii','Save monthly plan','Сохранить план месяца')}</button></>}
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
