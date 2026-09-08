const HOME_UX_ID = 'saveflow-home-ux'

function findHome(){
  return document.querySelector('.saveflow-v3 .app') && document.querySelector('.v3-hero')
}

function mountHomeUx(){
  if(!findHome() || document.getElementById(HOME_UX_ID)) return
  const hero=document.querySelector('.v3-hero')
  const quick=document.createElement('section')
  quick.id=HOME_UX_ID
  quick.className='home-quick-actions'
  quick.innerHTML=`
    <button class="home-quick-action income" type="button"><span>＋</span><b>Venit</b></button>
    <button class="home-quick-action expense" type="button"><span>−</span><b>Cheltuială</b></button>
    <button class="home-quick-action saving" type="button"><span>↗</span><b>Economii</b></button>`
  hero.insertAdjacentElement('afterend',quick)

  const today=document.createElement('section')
  today.className='card home-today-card'
  today.innerHTML=`
    <div class="today-head">
      <div><span class="eyebrow">AZI</span><h3>Bugetul de azi</h3></div>
      <div class="today-icon">📅</div>
    </div>
    <p class="muted" style="margin:0;font-size:11px;line-height:1.45">Vezi cât ai cheltuit azi și ritmul recomandat pentru restul zilei.</p>
    <button class="today-action" type="button">Vezi bugetul de azi →</button>`
  quick.insertAdjacentElement('afterend',today)

  quick.querySelector('.income').onclick=()=>document.querySelector('.income-cta')?.click()
  quick.querySelector('.saving').onclick=()=>document.querySelector('.savings-add')?.click()
  quick.querySelector('.expense').onclick=()=>{
    const nav=[...document.querySelectorAll('.bottom-nav button')][3]
    nav?.click()
    setTimeout(()=>document.querySelector('.expense-add')?.click(),80)
  }
  today.querySelector('.today-action').onclick=()=>document.querySelector('[data-tool="today"]')?.click()
}

function syncHomeUx(){
  const mounted=document.getElementById(HOME_UX_ID)
  const home=!!findHome()
  if(home && !mounted) mountHomeUx()
  if(!home && mounted){
    const today=mounted.nextElementSibling?.classList.contains('home-today-card') ? mounted.nextElementSibling : null
    mounted.remove(); today?.remove()
  }
}

const observer=new MutationObserver(syncHomeUx)
observer.observe(document.body,{childList:true,subtree:true})
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',syncHomeUx)
else syncHomeUx()
