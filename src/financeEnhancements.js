import { supabase } from './lib/supabase'

const STYLE_ID = 'saveflow-v4-tools-style'
const PANEL_ID = 'saveflow-v4-tools'

const css = `
#${PANEL_ID}{margin:14px 0 90px;padding:0;}
.sf4-card{background:#fff;border:1px solid rgba(13,67,48,.08);border-radius:22px;padding:18px;box-shadow:0 12px 35px rgba(14,55,43,.07);}
.sf4-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.sf4-head h3{margin:3px 0;font-size:20px;color:#12382c}.sf4-head span{font-size:11px;letter-spacing:.12em;font-weight:800;color:#6d857b}.sf4-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.sf4-btn{border:1px solid #e4ece8;background:#f7faf9;border-radius:15px;padding:12px;text-align:left;font:inherit;color:#183d31;cursor:pointer}.sf4-btn b{display:block;font-size:13px;margin-bottom:4px}.sf4-btn small{display:block;color:#71847d;font-size:11px;line-height:1.35}.sf4-kpi{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #edf2ef}.sf4-kpi:last-child{border-bottom:0}.sf4-kpi span{color:#71847d;font-size:12px}.sf4-kpi b{color:#163c30}.sf4-alert{padding:12px 14px;border-radius:14px;background:#fff8e7;margin-top:10px;color:#654d13;font-size:12px;line-height:1.45}.sf4-good{background:#edf9f2;color:#155b3d}.sf4-warn{background:#fff0ef;color:#8a3128}.sf4-modal{position:fixed;inset:0;background:rgba(8,25,20,.42);display:flex;align-items:center;justify-content:center;padding:18px;z-index:9999}.sf4-modal-box{width:min(520px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:24px;padding:20px;box-shadow:0 30px 80px rgba(0,0,0,.25)}.sf4-modal-box h3{margin:0 0 14px;color:#12382c}.sf4-close{float:right;border:0;background:#eef4f1;border-radius:10px;width:34px;height:34px;font-size:20px;cursor:pointer}.sf4-input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #dbe6e1;border-radius:12px;margin:6px 0 12px;font:inherit}.sf4-primary{width:100%;border:0;background:#19d98b;color:#073b28;border-radius:13px;padding:12px;font-weight:800;cursor:pointer}.sf4-list{margin-top:10px}.sf4-rec{padding:12px 0;border-bottom:1px solid #edf2ef;display:flex;justify-content:space-between;gap:10px}.sf4-rec b{font-size:13px;color:#173b30}.sf4-rec small{display:block;color:#74867f;margin-top:3px}.sf4-danger{border:0;background:#fff0ef;color:#9b352c;border-radius:9px;padding:7px 9px;cursor:pointer}.sf4-month{display:flex;gap:8px;align-items:center;margin-bottom:14px}.sf4-month button{border:0;background:#eef4f1;border-radius:9px;width:34px;height:34px;cursor:pointer}.sf4-month strong{flex:1;text-align:center;color:#173b30}.sf4-export{margin-top:12px}
@media(max-width:520px){.sf4-grid{grid-template-columns:1fr}.sf4-card{border-radius:18px;padding:15px}.sf4-modal{padding:10px}.sf4-modal-box{border-radius:20px;padding:16px}}
`

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))
const localKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
const money = (v, currency = 'MDL') => new Intl.NumberFormat('ro-MD',{style:'currency',currency,maximumFractionDigits:0}).format(Number(v||0))

async function getContext(){
  const {data:{session}} = await supabase.auth.getSession()
  if(!session) return null
  const uid=session.user.id
  const [{data:tx},{data:profile},{data:recurring}] = await Promise.all([
    supabase.from('transactions').select('id,type,amount,category,note,payment_method,transaction_date,created_at').eq('user_id',uid).order('created_at',{ascending:false}),
    supabase.from('profiles').select('currency,monthly_income,monthly_budget,weekly_budget,savings_target_percent').eq('id',uid).maybeSingle(),
    supabase.from('recurring_expenses').select('*').eq('user_id',uid).eq('active',true).order('next_date',{ascending:true}),
  ])
  return {uid,tx:tx||[],profile:profile||{},recurring:recurring||[]}
}

function addStyle(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent=css;document.head.appendChild(s)}
function closeModal(){document.querySelector('.sf4-modal')?.remove()}
function modal(html){closeModal();const wrap=document.createElement('div');wrap.className='sf4-modal';wrap.innerHTML=`<div class="sf4-modal-box" onclick="event.stopPropagation()">${html}</div>`;wrap.addEventListener('click',e=>{if(e.target===wrap)closeModal()});document.body.appendChild(wrap)}
function mount(){
  addStyle();
  if(document.getElementById(PANEL_ID))return;
  const app=document.querySelector('.app'); if(!app)return;
  const nav=app.querySelector('.bottom-nav');
  const el=document.createElement('section');el.id=PANEL_ID;el.innerHTML=`<div class="sf4-card"><div class="sf4-head"><div><span>SMART TOOLS</span><h3>SaveFlow Plus</h3></div><span>V4</span></div><div class="sf4-grid"><button class="sf4-btn" data-tool="month"><b>📊 Luna mea</b><small>Raport lunar și comparație</small></button><button class="sf4-btn" data-tool="alerts"><b>🔔 Smart Alerts</b><small>Vezi riscurile și limitele</small></button><button class="sf4-btn" data-tool="streak"><b>🔥 No-Spend Streak</b><small>Zile fără cheltuieli</small></button><button class="sf4-btn" data-tool="afford"><b>🧠 Îți permiți?</b><small>Verifică o cumpărătură</small></button><button class="sf4-btn" data-tool="recurring"><b>🔁 Recurente</b><small>Chirie, abonamente, facturi</small></button><button class="sf4-btn" data-tool="csv"><b>⬇️ Export CSV</b><small>Descarcă tranzacțiile</small></button></div></div>`;
  if(nav) app.insertBefore(el,nav); else app.appendChild(el);
  el.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>runTool(b.dataset.tool)));
}

async function runTool(tool){
  const c=await getContext(); if(!c)return;
  const currency=c.profile.currency||'MDL';
  if(tool==='csv')return exportCsv(c);
  if(tool==='streak')return showStreak(c,currency);
  if(tool==='alerts')return showAlerts(c,currency);
  if(tool==='month')return showMonth(c,currency);
  if(tool==='afford')return showAfford(c,currency);
  if(tool==='recurring')return showRecurring(c,currency);
}
function expenses(c){return c.tx.filter(x=>x.type==='expense')}
function showStreak(c,currency){
  const ex=expenses(c), days=new Set(ex.map(x=>String(x.transaction_date||x.created_at).slice(0,10)));let cur=0;const d=new Date();d.setHours(12,0,0,0);while(cur<365&&!days.has(localKey(d))){cur++;d.setDate(d.getDate()-1)}
  let best=0,run=0;for(let i=364;i>=0;i--){const x=new Date();x.setHours(12,0,0,0);x.setDate(x.getDate()-i);if(!days.has(localKey(x)))run++;else{best=Math.max(best,run);run=0}}best=Math.max(best,run);
  modal(`<button class="sf4-close" onclick="this.closest('.sf4-modal').remove()">×</button><h3>🔥 No-Spend Streak</h3><div class="sf4-kpi"><span>Streak curent</span><b>${cur} zile</b></div><div class="sf4-kpi"><span>Record în ultimele 365 zile</span><b>${best} zile</b></div><div class="sf4-alert sf4-good">O zi fără cheltuieli este numărată când nu există nicio tranzacție de tip expense pentru ziua respectivă.</div>`)
}
function showAlerts(c,currency){
  const ex=expenses(c), now=new Date(), mk=monthKey(now), month=ex.filter(x=>String(x.transaction_date||x.created_at).slice(0,7)===mk).reduce((s,x)=>s+Number(x.amount),0), budget=Number(c.profile.monthly_budget||0), weekStart=new Date(now);weekStart.setDate(now.getDate()-6);const week=ex.filter(x=>new Date(x.created_at)>=weekStart).reduce((s,x)=>s+Number(x.amount),0), weekly=Number(c.profile.weekly_budget||0);const alerts=[];
  if(budget&&month>=budget*.8)alerts.push(`Ai folosit ${Math.round(month/budget*100)}% din bugetul lunar (${money(month,currency)} / ${money(budget,currency)}).`);
  if(weekly&&week>=weekly*.8)alerts.push(`Ai folosit ${Math.round(week/weekly*100)}% din bugetul săptămânal.`);
  const by={};ex.filter(x=>String(x.transaction_date||x.created_at).slice(0,7)===mk).forEach(x=>by[x.category||'Other']=(by[x.category||'Other']||0)+Number(x.amount));const top=Object.entries(by).sort((a,b)=>b[1]-a[1])[0];if(top&&month&&top[1]/month>.4)alerts.push(`${top[0]} reprezintă ${Math.round(top[1]/month*100)}% din cheltuielile lunii.`);
  modal(`<button class="sf4-close" onclick="this.closest('.sf4-modal').remove()">×</button><h3>🔔 Smart Alerts</h3>${alerts.length?alerts.map(a=>`<div class="sf4-alert sf4-warn">⚠️ ${esc(a)}</div>`).join(''):'<div class="sf4-alert sf4-good">✓ Nu există alerte importante acum. Continuă ritmul actual.</div>'}`)
}
function showMonth(c,currency){
  const now=new Date(),mk=monthKey(now), ex=expenses(c).filter(x=>String(x.transaction_date||x.created_at).slice(0,7)===mk), inc=c.tx.filter(x=>x.type==='income'&&String(x.transaction_date||x.created_at).slice(0,7)===mk).reduce((s,x)=>s+Number(x.amount),0), spent=ex.reduce((s,x)=>s+Number(x.amount),0), by={};ex.forEach(x=>by[x.category||'Other']=(by[x.category||'Other']||0)+Number(x.amount));const top=Object.entries(by).sort((a,b)=>b[1]-a[1])[0];
  modal(`<button class="sf4-close" onclick="this.closest('.sf4-modal').remove()">×</button><h3>📊 Raportul lunii</h3><div class="sf4-kpi"><span>Venituri</span><b>${money(inc,currency)}</b></div><div class="sf4-kpi"><span>Cheltuieli</span><b>${money(spent,currency)}</b></div><div class="sf4-kpi"><span>Rată cheltuire</span><b>${inc?Math.round(spent/inc*100):0}%</b></div><div class="sf4-kpi"><span>Cea mai mare categorie</span><b>${top?esc(top[0]):'—'}</b></div><div class="sf4-kpi"><span>Sold din luna curentă</span><b>${money(inc-spent,currency)}</b></div><button class="sf4-primary sf4-export" data-export>Exportă luna în CSV</button>`);document.querySelector('[data-export]')?.addEventListener('click',()=>exportCsv(c,mk))
}
function showAfford(c,currency){
  const ex=expenses(c), income=c.tx.filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount),0), spent=ex.reduce((s,x)=>s+Number(x.amount),0), saved=0;const balance=Math.max(0,income-spent-saved),daily=Number(c.profile.monthly_budget||0)/30||balance/30;
  modal(`<button class="sf4-close" onclick="this.closest('.sf4-modal').remove()">×</button><h3>🧠 Îți permiți?</h3><label>Sumă (${currency})</label><input class="sf4-input" id="sf4-afford-input" type="number" min="0" placeholder="ex. 800"><div id="sf4-afford-result"></div><button class="sf4-primary" id="sf4-afford-btn">Verifică</button>`);document.getElementById('sf4-afford-btn').onclick=()=>{const v=Number(document.getElementById('sf4-afford-input').value||0),safe=v>0&&v<=balance&&v<=daily*3;document.getElementById('sf4-afford-result').innerHTML=v?`<div class="sf4-alert ${safe?'sf4-good':'sf4-warn'}">${safe?'✓':'⚠️'} ${safe?'Poți lua în calcul această cheltuială.':'Mai bine amână. Depășește spațiul sigur estimat.'}<br>Sold după cumpărare: <b>${money(Math.max(0,balance-v),currency)}</b></div>`:''}
}
function showRecurring(c,currency){
  const list=c.recurring||[];modal(`<button class="sf4-close" onclick="this.closest('.sf4-modal').remove()">×</button><h3>🔁 Cheltuieli recurente</h3><div class="sf4-list">${list.length?list.map(r=>`<div class="sf4-rec"><div><b>${esc(r.name)}</b><small>${money(r.amount,currency)} · ${esc(r.frequency)} · următoarea: ${esc(r.next_date)}</small></div><button class="sf4-danger" data-del="${r.id}">Șterge</button></div>`).join(''):'<div class="sf4-alert">Nu ai cheltuieli recurente configurate încă.</div>'}</div><hr><label>Nume</label><input class="sf4-input" id="sf4-r-name" placeholder="Netflix / Chirie"><label>Sumă (${currency})</label><input class="sf4-input" id="sf4-r-amount" type="number" placeholder="0"><label>Următoarea dată</label><input class="sf4-input" id="sf4-r-date" type="date" value="${localKey()}"><label>Frecvență</label><select class="sf4-input" id="sf4-r-freq"><option value="monthly">Lunar</option><option value="weekly">Săptămânal</option><option value="yearly">Anual</option></select><button class="sf4-primary" id="sf4-r-add">Adaugă</button>`);document.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{await supabase.from('recurring_expenses').delete().eq('id',b.dataset.del).eq('user_id',c.uid);showRecurring(await getContext(),currency)});document.getElementById('sf4-r-add').onclick=async()=>{const name=document.getElementById('sf4-r-name').value.trim(),amount=Number(document.getElementById('sf4-r-amount').value),next_date=document.getElementById('sf4-r-date').value,frequency=document.getElementById('sf4-r-freq').value;if(!name||!amount||!next_date)return;const {error}=await supabase.from('recurring_expenses').insert({user_id:c.uid,name,amount,category:'Other',payment_method:'card',frequency,next_date});if(error)alert(error.message);else showRecurring(await getContext(),currency)}
}
function exportCsv(c,filterMonth=null){
  const rows=c.tx.filter(x=>!filterMonth||String(x.transaction_date||x.created_at).slice(0,7)===filterMonth);const header=['Date','Type','Amount_MDL','Category','Payment_Method','Note'];const lines=[header,...rows.map(x=>[x.transaction_date||String(x.created_at).slice(0,10),x.type,x.amount,x.category||'',x.payment_method||'',x.note||''])].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(','));const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`saveflow-${filterMonth||'transactions'}.csv`;a.click();URL.revokeObjectURL(url)
}

let timer=null
function boot(){
  clearTimeout(timer);timer=setTimeout(async()=>{try{const c=await getContext();if(c)mount()}catch(e){console.warn('SaveFlow V4 tools:',e)}},350)
}
boot();new MutationObserver(boot).observe(document.body,{childList:true,subtree:true})
