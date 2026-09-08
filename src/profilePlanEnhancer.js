import { supabase } from './lib/supabase'

const tr=(ro,en,ru,lang)=>lang==='en'?en:lang==='ru'?ru:ro

document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-plan]')
  if(!b)return
  e.preventDefault();e.stopPropagation()
  const {data:{session}}=await supabase.auth.getSession();if(!session?.user)return
  const {data:p}=await supabase.from('profiles').select('language,monthly_income,rent,bills,food,transport,subscriptions,other_costs,savings_target_percent').eq('id',session.user.id).maybeSingle()
  const lang=p?.language||'ro'
  const ask=(label,value)=>{const v=prompt(label,String(value??0));return v===null?null:Number(v)}
  const income=ask(tr('Venit lunar:','Monthly income:','Доход в месяц:',lang),p?.monthly_income||0);if(income===null)return
  const rent=ask(tr('Chirie:','Rent:','Аренда:',lang),p?.rent||0);if(rent===null)return
  const bills=ask(tr('Facturi:','Bills:','Счета:',lang),p?.bills||0);if(bills===null)return
  const food=ask(tr('Mâncare:','Food:','Еда:',lang),p?.food||0);if(food===null)return
  const transport=ask(tr('Transport:','Transport:','Транспорт:',lang),p?.transport||0);if(transport===null)return
  const subscriptions=ask(tr('Abonamente:','Subscriptions:','Подписки:',lang),p?.subscriptions||0);if(subscriptions===null)return
  const other_costs=ask(tr('Alte cheltuieli:','Other costs:','Другие расходы:',lang),p?.other_costs||0);if(other_costs===null)return
  const savings_target_percent=ask(tr('Ținta de economisire (%):','Savings target (%):','Цель накоплений (%):',lang),p?.savings_target_percent||10);if(savings_target_percent===null)return
  if(!income||income<0||savings_target_percent<5||savings_target_percent>30){alert(tr('Verifică valorile. Ținta de economisire trebuie să fie între 5% și 30%.','Check the values. Savings target must be between 5% and 30%.','Проверьте значения. Цель накоплений должна быть от 5% до 30%.'));return}
  const fixed=rent+bills+food+transport+subscriptions+other_costs
  const weekly=Math.max(1,(income-fixed-income*savings_target_percent/100)/4.345)
  const {error}=await supabase.from('profiles').update({monthly_income:income,rent,bills,food,transport,subscriptions,other_costs,savings_target_percent,monthly_budget:Math.max(1,income-fixed),weekly_budget:weekly,updated_at:new Date().toISOString()}).eq('id',session.user.id)
  if(error)alert(error.message);else{alert(tr('Planul financiar a fost actualizat.','Financial plan updated.','Финансовый план обновлён.'));location.reload()}
},true)
