import './Profile.css'
import { supabase } from './lib/supabase'

const tr = (ro, en, ru, lang) => lang === 'en' ? en : lang === 'ru' ? ru : ro
const money = (v, currency) => new Intl.NumberFormat(currency === 'EUR' ? 'de-DE' : currency === 'USD' ? 'en-US' : 'ro-MD', { style:'currency', currency, maximumFractionDigits:0 }).format(Number(v||0) / ({MDL:1,EUR:19.5,USD:17.5}[currency] || 1))
const prefKey = 'saveflow_profile_notifications'
const getPrefs = () => { try { return {weekly:true,overspend:true,goals:true,monthly:true,...JSON.parse(localStorage.getItem(prefKey)||'{}')} } catch { return {weekly:true,overspend:true,goals:true,monthly:true} } }
const savePrefs = p => localStorage.setItem(prefKey, JSON.stringify(p))

async function openProfile(){
  document.querySelector('.sf-profile-overlay')?.remove()
  const {data:{session}} = await supabase.auth.getSession(); if(!session?.user) return
  const uid=session.user.id
  const [{data:p},{data:tx},{data:goals},{data:sav}] = await Promise.all([
    supabase.from('profiles').select('language,currency,monthly_income,rent,bills,food,transport,subscriptions,other_costs,savings_target_percent').eq('id',uid).maybeSingle(),
    supabase.from('transactions').select('id,type,amount').eq('user_id',uid),
    supabase.from('savings_goals').select('id,name,target_amount,current_amount').eq('user_id',uid),
    supabase.from('savings_contributions').select('id,goal_id,amount').eq('user_id',uid)
  ])
  const lang=p?.language||'ro', currency=p?.currency||'MDL', name=session.user.user_metadata?.full_name||session.user.email?.split('@')[0]||'SaveFlow'
  const income=(tx||[]).filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount||0),0)
  const expenses=(tx||[]).filter(x=>x.type==='expense').reduce((s,x)=>s+Number(x.amount||0),0)
  const saved=(sav||[]).reduce((s,x)=>s+Number(x.amount||0),0)
  const monthly=Number(p?.monthly_income||income), target=Number(p?.savings_target_percent||10), rate=monthly?Math.round(saved/monthly*100):0
  const fixed=['rent','bills','food','transport','subscriptions','other_costs'].reduce((s,k)=>s+Number(p?.[k]||0),0)
  const health=Math.max(0,Math.min(100,Math.round(35*Math.min(1,saved/Math.max(monthly,1))+35*(1-Math.min(1,expenses/Math.max(monthly,1)))+30)))
  const prefs=getPrefs()
  const o=document.createElement('div'); o.className='sf-profile-overlay'
  o.innerHTML=`<div class="sf-profile-panel">
    <header class="sf-profile-header"><button class="sf-icon-btn" data-close>←</button><div><span>PROFILE</span><h2>${tr('Profilul meu','My profile','Мой профиль',lang)}</h2></div><div class="sf-avatar">${name[0]?.toUpperCase()||'U'}</div></header>
    <section class="sf-profile-card sf-profile-user"><div class="sf-user-avatar">${name[0]?.toUpperCase()||'U'}</div><div class="sf-user-info"><strong>${name}</strong><span>${session.user.email||''}</span><small>${tr('Membru SaveFlow','SaveFlow member','Пользователь SaveFlow',lang)}</small></div><button class="sf-edit-btn" data-name>✎</button></section>
    <section class="sf-profile-card sf-health-card"><div class="sf-card-title"><div><span>FINANCIAL PROFILE</span><h3>${tr('Profil financiar','Financial profile','Финансовый профиль',lang)}</h3></div><b>${health}/100</b></div><div class="sf-health-line"><i style="width:${health}%"></i></div><div class="sf-profile-metrics"><div><span>${tr('Economisire','Savings','Накопления',lang)}</span><b>${rate}%</b></div><div><span>${tr('Ținta','Target','Цель',lang)}</span><b>${target}%</b></div><div><span>${tr('Obiective','Goals','Цели',lang)}</span><b>${(goals||[]).length}</b></div></div><button class="sf-wide-btn" data-plan>✦ ${tr('Editează planul financiar','Edit financial plan','Изменить финансовый план',lang)}</button></section>
    <section class="sf-profile-card"><div class="sf-card-title"><div><span>PREFERENCES</span><h3>${tr('Preferințe','Preferences','Настройки',lang)}</h3></div></div><div class="sf-setting-row"><div><b>🌐 ${tr('Limbă','Language','Язык',lang)}</b></div><select data-language><option value="ro" ${lang==='ro'?'selected':''}>🇲🇩 Română</option><option value="en" ${lang==='en'?'selected':''}>🇬🇧 English</option><option value="ru" ${lang==='ru'?'selected':''}>🇷🇺 Русский</option></select></div><div class="sf-setting-row"><div><b>💰 ${tr('Monedă','Currency','Валюта',lang)}</b></div><select data-currency><option value="MDL" ${currency==='MDL'?'selected':''}>🇲🇩 MDL</option><option value="EUR" ${currency==='EUR'?'selected':''}>🇪🇺 EUR</option><option value="USD" ${currency==='USD'?'selected':''}>🇺🇸 USD</option></select></div><div class="sf-setting-row"><div><b>🌙 ${tr('Aspect','Appearance','Вид',lang)}</b></div><button class="sf-toggle" data-theme><i></i></button></div></section>
    <section class="sf-profile-card"><div class="sf-card-title"><div><span>NOTIFICATIONS</span><h3>${tr('Notificări','Notifications','Уведомления',lang)}</h3></div></div>${[['weekly','📊',tr('Rezumat săptămânal','Weekly summary','Недельный отчёт',lang)],['overspend','⚠️',tr('Alerte cheltuieli','Spending alerts','Алерты расходов',lang)],['goals','🎯',tr('Obiective','Goals','Цели',lang)],['monthly','📅',tr('Raport lunar','Monthly report','Месячный отчёт',lang)]].map(([k,i,l])=>`<div class="sf-setting-row"><div><b>${i} ${l}</b></div><button class="sf-toggle ${prefs[k]?'on':''}" data-notify="${k}"><i></i></button></div>`).join('')}</section>
    <section class="sf-profile-card"><div class="sf-card-title"><div><span>YOUR DATA</span><h3>${tr('Datele mele','My data','Мои данные',lang)}</h3></div></div><button class="sf-action-row" data-export>📥 <span>${tr('Exportă datele','Export data','Экспорт данных',lang)}</span><b>→</b></button><button class="sf-action-row" data-report>📊 <span>${tr('Rezumat financiar','Financial summary','Финансовый отчёт',lang)}</span><b>→</b></button></section>
    <section class="sf-profile-card"><div class="sf-card-title"><div><span>SECURITY</span><h3>${tr('Securitate','Security','Безопасность',lang)}</h3></div></div><button class="sf-action-row" data-password>🔒 <span>${tr('Resetare parolă prin email','Password reset by email','Сброс пароля по email',lang)}</span><b>→</b></button><button class="sf-action-row" data-email>📧 <span>${tr('Schimbă emailul','Change email','Изменить email',lang)}</span><b>→</b></button></section>
    <div class="sf-about"><strong>Save<span>Flow</span></strong><small>v1.0 · ${tr('Pași mici. Rezultate mari.','Small steps. Big results.','Маленькие шаги. Большие результаты.',lang)}</small></div><button class="sf-signout" data-signout>↪ ${tr('Ieșire din cont','Sign out','Выйти',lang)}</button>
  </div>`
  document.body.appendChild(o)
  const close=()=>o.remove(); o.querySelector('[data-close]').onclick=close; o.addEventListener('click',e=>{if(e.target===o)close()})
  o.querySelector('[data-name]').onclick=async()=>{const n=prompt(tr('Noul nume:','New name:','Новое имя:',lang),name);if(!n?.trim())return;const r=await supabase.auth.updateUser({data:{full_name:n.trim()}});if(r.error)alert(r.error.message);else openProfile()}
  o.querySelector('[data-plan]').onclick=()=>{close();const x=document.querySelector('.onboarding-overlay');if(x)x.style.display='flex'}
  o.querySelector('[data-language]').onchange=async e=>{await supabase.from('profiles').update({language:e.target.value,updated_at:new Date().toISOString()}).eq('id',uid);location.reload()}
  o.querySelector('[data-currency]').onchange=async e=>{await supabase.from('profiles').update({currency:e.target.value,updated_at:new Date().toISOString()}).eq('id',uid);location.reload()}
  o.querySelector('[data-theme]').onclick=()=>{document.body.classList.toggle('sf-dark');localStorage.setItem('saveflow_theme',document.body.classList.contains('sf-dark')?'dark':'light')}
  o.querySelectorAll('[data-notify]').forEach(b=>b.onclick=()=>{const p=getPrefs();p[b.dataset.notify]=!p[b.dataset.notify];savePrefs(p);b.classList.toggle('on',p[b.dataset.notify])})
  o.querySelector('[data-export]').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),profile:p,transactions:tx||[],goals:goals||[],savings:sav||[]},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`saveflow-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)}
  o.querySelector('[data-report]').onclick=()=>{const text=`SaveFlow\nHealth: ${health}/100\nIncome: ${money(income,currency)}\nExpenses: ${money(expenses,currency)}\nSavings: ${money(saved,currency)}\nFixed costs: ${money(fixed,currency)}\nGoals: ${(goals||[]).length}`;const blob=new Blob([text],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='saveflow-report.txt';a.click();URL.revokeObjectURL(a.href)}
  o.querySelector('[data-password]').onclick=async()=>{const r=await supabase.auth.resetPasswordForEmail(session.user.email,{redirectTo:location.origin});alert(r.error?r.error.message:tr('Emailul pentru resetarea parolei a fost trimis.','Password reset email sent.','Письмо для сброса пароля отправлено.',lang))}
  o.querySelector('[data-email]').onclick=async()=>{const n=prompt(tr('Noul email:','New email:','Новый email:',lang),session.user.email||'');if(!n||n===session.user.email)return;const r=await supabase.auth.updateUser({email:n.trim()});alert(r.error?r.error.message:tr('Verifică noul email.','Check the new email for confirmation.','Проверьте новый email для подтверждения.',lang))}
  o.querySelector('[data-signout]').onclick=async()=>{await supabase.auth.signOut();location.reload()}
}

if(localStorage.getItem('saveflow_theme')==='dark')document.body.classList.add('sf-dark')
document.addEventListener('click',e=>{const b=e.target.closest('.bottom-nav button:last-child,.avatar');if(!b)return;e.preventDefault();e.stopPropagation();openProfile()},true)
