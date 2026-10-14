import {services,boundedCount,deletionQuote,managementQuote} from './pricing.mjs';
const $=s=>document.querySelector(s);
const menu=$('.menu-toggle'),nav=$('#main-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}});
const euro=n=>`${n.toLocaleString('de-DE')} €`;
function read(id){return boundedCount($('#'+id)?.value);}
function updateCalculators(){
 if($('#requested')){
  const q=deletionQuote(read('requested'),read('successful'));
  $('#successful').max=String(q.count);$('#successful').value=q.successes;
  $('#deletion-total').textContent=euro(q.total);
  $('#deletion-detail').textContent=`${q.successes} erfolgreiche Löschungen × ${q.unit} €. Für die ${q.unpaid} übrigen Bewertungen: 0 €.`;
  $('#deletion-minimum').hidden=!q.individual;
 }
 if($('#positive')){
  const q=managementQuote(read('positive'),read('negative'));
  $('#monthly-total').textContent=`${q.count} neue Bewertungen insgesamt. Für die Preisstufe zählen alle Sterne zusammen.`;
  $('#receipt-count').textContent=q.count;$('#receipt-tier').textContent=`Stufe: ${q.tier} Bewertungen / Monat`;$('#monthly-price').textContent=euro(q.price);
  const existing=$('#include-existing').checked;
  $('#existing-control').hidden=!existing;$('#existing-receipt').hidden=!existing;
  const d=deletionQuote(read('existing'));
  $('#receipt-existing-count').textContent=d.count;
  $('#receipt-existing-unit').textContent=d.individual?'Individuell':euro(d.unit);
  $('#receipt-existing-unit').nextElementSibling.textContent=d.individual?'Angebot nach Prüfung':'/ erfolgreicher Löschung';
  $('#calculator-announcement').textContent=`${q.count} neue Bewertungen: ${q.price} Euro pro Monat, zuzüglich Mehrwertsteuer.`;
 }
}
document.querySelectorAll('.stepper input').forEach(el=>{el.addEventListener('input',updateCalculators);el.addEventListener('change',()=>{el.value=boundedCount(el.value);updateCalculators();});});
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{const i=$('#'+b.dataset.for);i.value=Math.min(Number(i.max),Math.max(Number(i.min),boundedCount(i.value)+Number(b.dataset.step)));updateCalculators();}));
$('#include-existing')?.addEventListener('change',updateCalculators);updateCalculators();
const dialog=$('#inquiry'),form=$('#inquiry-form');let step=1,opener=null,quote=null,sending=false;
const selected=()=>[...form.querySelectorAll('[name=services]:checked')].map(i=>i.value);
function fail(message,field){$('#form-error').textContent=message;$('#form-error').hidden=false;if(field){field.setAttribute('aria-invalid','true');field.focus();}else $('#form-error').scrollIntoView({block:'nearest'});}
function clearError(){$('#form-error').hidden=true;form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));}
function showStep(n){
 step=n;clearError();form.querySelectorAll('[data-panel]').forEach(p=>p.hidden=Number(p.dataset.panel)!==n);
 const titles=['Was braucht<br>Ihr Betrieb?','Wo sind Sie<br>zu finden?','Wie erreichen<br>wir Sie?'];
 const descriptions=['Wählen Sie, wobei wir Sie unterstützen dürfen. Mehrfachauswahl ist möglich.','Damit wir das richtige Google-Profil prüfen können.','Wir melden uns persönlich mit einer Einschätzung und dem passenden nächsten Schritt.'];
 $('#inquiry-title').innerHTML=titles[n-1];$('#step-description').textContent=descriptions[n-1];$('#step-label').textContent=`0${n} / ${['Ihr Anliegen','Ihr Betrieb','Ihr Kontakt'][n-1]}`;
 $('#form-back').hidden=n===1;$('#form-next').textContent=n===3?'Anfrage kostenlos senden':'Weiter';$('#step-count').textContent=`Schritt ${n} von 3`;
 $('#selection-summary').replaceChildren();const strong=document.createElement('strong');strong.textContent='Ihr Interesse';const span=document.createElement('span');span.textContent=selected().map(s=>services[s]).join(' · ');$('#selection-summary').append(strong,span);
 if(n===2){$('#form-quote').hidden=!quote;if(quote){$('#form-quote').textContent=quote.type==='management'?`Ihr Rechenbeispiel: ${quote.positive} positive und ${quote.negative} negative neue Bewertungen / Monat. ${managementQuote(quote.positive,quote.negative).price} € monatlich zzgl. MwSt.${quote.existing!==undefined?` Zusätzlich ${quote.existing} bestehende Bewertungen zur Prüfung.`:''}`:`Ihr Rechenbeispiel: ${quote.requested} Bewertungen zur Prüfung. Abrechnung nur bei erfolgreicher Löschung.`;}}
 dialog.scrollTop=0;$('#inquiry-title').focus({preventScroll:true});
}
function openInquiry(trigger){
 opener=trigger;form.reset();sending=false;quote=null;form.hidden=false;$('#inquiry-intro').hidden=false;$('#inquiry-success').hidden=true;$('#form-next').disabled=false;
 const chosen=trigger.dataset.inquiry;
 if(chosen)form.querySelector(`[name=services][value="${chosen}"]`).checked=true;
 if(trigger.hasAttribute('data-management-quote')){quote={type:'management',positive:read('positive'),negative:read('negative'),...($('#include-existing').checked?{existing:read('existing')}:{})};if(quote.existing!==undefined)form.querySelector('[value=deletion]').checked=true;}
 if(trigger.hasAttribute('data-deletion-quote'))quote={type:'deletion',requested:read('requested')};
 dialog.showModal();showStep(1);
}
document.querySelectorAll('[data-inquiry]').forEach(b=>b.addEventListener('click',()=>openInquiry(b)));
function close(){if(!sending)dialog.close();}
dialog.querySelectorAll('.close-modal').forEach(b=>b.addEventListener('click',close));
dialog.addEventListener('cancel',e=>{if(sending)e.preventDefault();});
dialog.addEventListener('close',()=>opener?.focus());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close();});
$('#form-back').addEventListener('click',()=>showStep(step-1));
form.addEventListener('input',clearError);
form.addEventListener('submit',async e=>{
 e.preventDefault();if(sending)return;clearError();
 const f=form.elements;
 if(step===1){if(!selected().length)return fail('Bitte wählen Sie mindestens ein Anliegen aus.',form.querySelector('[name=services]'));showStep(2);return;}
 if(step===2){if(!f.betrieb.value.trim())return fail('Bitte geben Sie den Namen Ihres Betriebs an.',f.betrieb);if(!f.ort.value.trim()&&!f.googleLink.value.trim())return fail('Bitte geben Sie den Ort oder einen Google-Maps-Link an.',f.ort);showStep(3);return;}
 if(!f.name.value.trim())return fail('Bitte geben Sie Ihren Namen an.',f.name);
 if(!f.email.value.trim()||!f.email.validity.valid)return fail('Bitte geben Sie eine gültige E-Mail-Adresse an.',f.email);
 if(!f.consent.checked)return fail('Bitte bestätigen Sie die Datenschutzhinweise.',f.consent);
 const payload=Object.fromEntries(['betrieb','ort','googleLink','standorte','name','email','telefon','nachricht','website'].map(k=>[k,f[k].value.trim()]));
 payload.services=selected();payload.antwortService=payload.services.includes('management');
 // A quote belongs only to the products still selected at submission.
 if(quote?.type==='management'&&payload.services.includes('management'))payload.calculator={positive:quote.positive,negative:quote.negative,...(payload.services.includes('deletion')&&quote.existing!==undefined?{existing:quote.existing}:{})};
 if(quote?.type==='deletion'&&payload.services.includes('deletion'))payload.calculator={existing:quote.requested};
 sending=true;$('#form-next').disabled=true;$('#form-back').disabled=true;$('#form-next').textContent='Wird gesendet …';form.setAttribute('aria-busy','true');
 try{
  const response=await fetch('/api/anfrage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(55000)});
  const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.reason||'failed');
  form.hidden=true;$('#inquiry-intro').hidden=true;$('#inquiry-success').hidden=false;dialog.scrollTop=0;$('#inquiry-success h2').focus();
 }catch{fail('Die Anfrage konnte gerade nicht bestätigt werden. Bitte versuchen Sie es erneut oder schreiben Sie an info@webwerk-design.de. Ihre Eingaben bleiben erhalten.');}
 finally{sending=false;$('#form-next').disabled=false;$('#form-back').disabled=false;$('#form-next').textContent='Anfrage kostenlos senden';form.removeAttribute('aria-busy');}
});
