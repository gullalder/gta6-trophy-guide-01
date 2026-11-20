'use strict';
const data = window.TROPHY_DATA;
const trophies = data.trophies;
const storageKey = 'leonida-ledger-v1';
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const validIds = new Set(trophies.map(t => t.id));
let earned = new Set();
let spoilers = false;
let storageAvailable = true;
let selectedId = Number(params.get('selected')) || 30;
let currentView = 'trophies';
let stageFilter = null;
let toastTimer;
const revealed = new Set();
const trophyIcon = '<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M7 3h14v8c0 5-3 8-7 8s-7-3-7-8V3Z M7 6H3v5c0 3 2 5 6 5 M21 6h4v5c0 3-2 5-6 5 M14 19v7 M9 27h10v3H9z"/></svg>';
const kindLabels = {story:'Story',collectible:'Collectible',grind:'Grind',side:'Side mission',activity:'Activity',other:'Completion'};
const stages = [
 {title:'Play the story',time:'35–60 h · estimate',intro:'Follow the chapter milestones, not an invented mission order.',steps:['Begin with Gone Fishing. Complete Chapters 1, 2, 3 and 4 in sequence.','Along the narrative: Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown and Operation Savage Glory. Their chapter placement is unverified.','Before the final mission, keep a separate save and review stage 02. Finish the finale for the gold trophy.']},
 {title:'Check the loose ends',time:'10–25 h · estimate',intro:'A save precaution for contacts and partner-dependent objectives.',steps:['Finish Andy, Kenton, Billy, Randy and Tyrone’s final missions. Complete eight stranger strands; check Bret’s hunt as it appears.','While your partner is available: escape four stars together and rob three shops without losing your Wanted Level.','No confirmed lock times are supplied. Check these between chapters and keep earlier saves; the sequence here is advisory.']},
 {title:'Sweep Leonida',time:'25–60 h · estimate',intro:'Group exploration and repeatable objectives into regional sessions.',steps:['Finish three Collectible Card sets, WAiNK It at 100 locations and meditate at every spot. Explore all of Leonida.','Complete 250 stunts, gold every Shooting Range challenge, win at every Top Fun venue and win 20 different races.','Complete 50 challenges, discover 100 vehicles, handle robberies, register ten vehicles and build funds for shops and garages.']},
 {title:'Claim your legacy',time:'5–15 h · estimate',intro:'Audit the game’s own completion record, then the remaining trophies.',steps:['Reach the in-game 100% completion requirement for A Long Road. The exact completion checklist is not established by the descriptions.','Review cryptic and unfinished trophies individually. Consult a verified unlock method where this guide marks one unknown.','Earn all 54 non-platinum trophies. Confirm Vice Got a Price! on your PS5, then mark your platinum earned here.']}
];
function escapeHtml(value) {
 return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function notify(message) {
 $('toast').textContent = message;
 $('toast').classList.add('show');
 clearTimeout(toastTimer);
 toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3500);
}
function loadProgress() {
 try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (saved && Array.isArray(saved.earned)) earned = new Set(saved.earned.filter(id => validIds.has(id)));
  spoilers = saved?.spoilers === true;
 } catch { storageAvailable = false; }
 $('spoilers').checked = spoilers;
}
function saveProgress() {
 try {
  localStorage.setItem(storageKey, JSON.stringify({version:1,game:'gta6',earned:[...earned].sort((a,b)=>a-b),spoilers}));
  storageAvailable = true;
 } catch { storageAvailable = false; notify('Browser storage unavailable. Export your progress to keep it.'); }
 updateProgress();
}
function isMasked(t) { return t.spoiler && !spoilers && !earned.has(t.id) && !revealed.has(t.id); }
function updateProgress() {
 const percentage = Math.round(earned.size / trophies.length * 100);
 $('percent').textContent = percentage + '%';
 $('ring').style.setProperty('--progress', percentage + '%');
 $('earned-count').textContent = earned.size;
 $('grade-counts').innerHTML = ['platinum','gold','silver','bronze'].map(grade => {
  const group = trophies.filter(t => t.grade === grade);
  return `<div><b class="${grade}">◆</b>${group.filter(t=>earned.has(t.id)).length}/${group.length}<span class="sr-only"> ${grade}</span></div>`;
 }).join('');
 $('save-state').textContent = storageAvailable ? 'Progress saved on this device' : 'Storage unavailable · export to save';
}
function matchesFilters(t) {
 if (stageFilter && t.stage !== stageFilter) return false;
 const grade = $('grade').value, kind = $('kind').value, status = $('status').value;
 if (grade !== 'all' && t.grade !== grade) return false;
 if (kind === 'watch' ? !t.watch : kind !== 'all' && t.kind !== kind) return false;
 if (status === 'earned' && !earned.has(t.id) || status === 'todo' && earned.has(t.id)) return false;
 const query = $('search').value.trim().toLocaleLowerCase();
 // Masked story text must not leak through searching either.
 const searchable = isMasked(t) ? `${t.grade} ${kindLabels[t.kind]} hidden story trophy` : `${t.name} ${t.description} ${t.guide} ${kindLabels[t.kind]}`;
 return !query || searchable.toLocaleLowerCase().includes(query);
}
function renderList() {
 const visible = trophies.filter(matchesFilters);
 if (!visible.some(t=>t.id===selectedId) && visible.length) selectedId = visible[0].id;
 $('results').textContent = `${visible.length} / 55 TROPHIES${stageFilter ? ' · STAGE 0'+stageFilter : ''}`;
 $('trophy-list').innerHTML = visible.length ? visible.map(t => {
  const masked = isMasked(t), done = earned.has(t.id);
  const name = masked ? 'Hidden story trophy' : t.name;
  return `<article class="trophy-row ${selectedId===t.id?'selected':''} ${done?'earned-row':''}"><input class="trophy-check" type="checkbox" data-check="${t.id}" aria-label="Mark ${escapeHtml(name)} earned" ${done?'checked':''}><div class="trophy-icon ${t.grade}" title="${t.grade}">${trophyIcon}</div><button class="row-open" data-select="${t.id}" aria-pressed="${selectedId===t.id}"><span class="row-title">${masked?'◇ &nbsp; ':''}${escapeHtml(name)}</span><span class="row-desc">${escapeHtml(masked?'Story details protected. Earn it to reveal.':t.description)}</span><span class="row-bottom"><span class="${t.grade}">${t.grade}</span><span>· ${kindLabels[t.kind]}</span>${t.watch?'<span class="watch-badge">△ Save precaution</span>':''}${done?'<span>✓ Earned</span>':''}</span></button><span class="row-arrow">↗</span></article>`;
 }).join('') : '<div class="empty">No trophies match this combination.<button id="empty-reset">Clear filters</button></div>';
 if (visible.length) renderGuide();
 else $('guide-panel').innerHTML = '<div class="guide-label">NOTHING IN THIS VIEW</div><p class="guide-text">Try another grade, kind or progress filter to continue exploring.</p>';
}
function renderGuide() {
 const t = trophies.find(t => t.id === selectedId) || trophies[0];
 const masked = isMasked(t);
 const done = earned.has(t.id);
 $('guide-panel').innerHTML = `<div class="guide-kicker"><span>FIELD GUIDE / ${String(t.id).padStart(2,'0')}</span><span>PS5</span></div><div class="guide-trophy ${t.grade}">${trophyIcon}</div><h3>${escapeHtml(masked?'A story yet to unfold.':t.name)}</h3><div class="official">${escapeHtml(masked?'This trophy’s name, objective and guide are hidden until you earn it or choose to reveal spoilers.':t.description)}</div><div class="guide-tags"><span class="tag ${t.grade}">${t.grade}</span><span class="tag">${kindLabels[t.kind]}</span>${t.watch?'<span class="tag caution">△ Save precaution</span>':''}</div>${masked?'<div class="spoiler-box"><div class="guide-label">SPOILER PROTECTION IS ON</div><p>Your story, at your own pace.</p><button class="reveal-button" id="reveal-one">Reveal this trophy</button></div>':`<div class="guide-label">THE PLAN</div><p class="guide-text">${escapeHtml(t.guide)}</p><div class="guide-lock"><b>${t.watch?'MISSABLE WATCH':'AVAILABILITY'}</b><br>${escapeHtml(t.lock)}</div><div class="guide-sources"><div class="source-heading">SOURCE NOTES · ${escapeHtml(t.guideConfidence)}</div>${t.sources.map(id=>`<a href="${escapeHtml(data.sources[id].url)}" target="_blank" rel="noopener noreferrer">${escapeHtml({'kit-list':'Kit snapshot',exophase:'Exophase',psnprofiles:'PSNProfiles'}[id])} ↗</a>`).join('')}<small>Kit-supplied; live listings blocked (403).</small></div>`}<button class="mark-button" id="mark-selected">${done?'✓ Earned · mark as not earned':'+ Mark as earned'}</button>`;
 $('mark-selected').onclick = () => toggleEarned(t.id, !done);
 if (masked) $('reveal-one').onclick = () => {revealed.add(t.id);renderList();};
}
function toggleEarned(id, checked) {
 if (!validIds.has(id)) return;
 if (checked) earned.add(id); else earned.delete(id);
 saveProgress(); renderList();
}
function setView(view) {
 if (!['trophies','roadmap','sources'].includes(view)) view='trophies';
 currentView=view;
 document.body.dataset.view=view;
 for (const name of ['trophies','roadmap','sources']) $(name+'-view').hidden=name!==view;
 document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
 const url = new URL(location.href);
 url.searchParams.set('view',view);
 try {history.replaceState(null,'',url);} catch {}
}
function clearFilters() {
 stageFilter=null;
 $('search').value='';
 for (const key of ['grade','kind','status']) $(key).value='all';
 renderList();
}
function renderRoadmap() {
 $('roadmap').innerHTML=stages.map((stage,index)=>`<article class="stage" id="stage-${index+1}"><div class="stage-top"><span class="stage-number">0${index+1}</span><span class="estimate">${stage.time}</span></div><h3>${stage.title}</h3><p>${stage.intro}</p><ol>${stage.steps.map(step=>`<li>${escapeHtml(step)}</li>`).join('')}</ol><button class="view-stage" data-stage-filter="${index+1}">Explore this stage’s trophies →</button></article>`).join('');
}
function exportProgress() {
 const payload={format:'leonida-ledger',version:1,game:'gta6',exportedAt:new Date().toISOString(),earned:[...earned].sort((a,b)=>a-b),spoilers};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='leonida-progress.json';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 notify('Progress exported. Keep the JSON file as your backup.');
}
async function importProgress(file) {
 if(!file)return;
 try {
  if(file.size>1024*1024)throw new Error('File is too large. Choose a progress JSON under 1 MB.');
  const payload=JSON.parse(await file.text());
  if(payload.format!=='leonida-ledger'||payload.version!==1||payload.game!=='gta6'||!Array.isArray(payload.earned)||payload.earned.some(id=>!Number.isInteger(id)||!validIds.has(id))||typeof payload.spoilers!=='boolean')throw new Error('Not a valid Leonida Ledger progress file. Nothing was changed.');
  const imported=new Set(payload.earned);
  if(!confirm(`Replace this device’s ${earned.size} earned trophies with ${imported.size} from the backup? Export first if you need to keep the current checklist.`))return;
  earned=imported;spoilers=payload.spoilers;revealed.clear();$('spoilers').checked=spoilers;
  saveProgress();renderList();notify(`Imported ${earned.size} earned trophies.`);
 }catch(error){notify(error instanceof SyntaxError?'Invalid JSON. Nothing was changed.':error.message);}
 finally{$('import-file').value='';}
}
loadProgress();
for(const key of ['grade','kind','status']) {
 if([...$(key).options].some(option=>option.value===params.get(key)))$(key).value=params.get(key);
 $(key).addEventListener('change',()=>{stageFilter=null;renderList();});
}
$('search').addEventListener('input',renderList);
$('spoilers').addEventListener('change',()=>{spoilers=$('spoilers').checked;revealed.clear();saveProgress();renderList();});
$('clear').onclick=clearFilters;
$('trophy-list').addEventListener('change',event=>{if(event.target.matches('[data-check]'))toggleEarned(Number(event.target.dataset.check),event.target.checked);});
$('trophy-list').addEventListener('click',event=>{const button=event.target.closest('[data-select]');if(button){selectedId=Number(button.dataset.select);renderList();}if(event.target.id==='empty-reset')clearFilters();});
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>setView(button.dataset.view));
document.querySelectorAll('[data-step]').forEach(button=>button.onclick=()=>{setView('roadmap');$('stage-'+button.dataset.step).scrollIntoView({behavior:'smooth',block:'start'});});
$('roadmap').addEventListener('click',event=>{const button=event.target.closest('[data-stage-filter]');if(button){clearFilters();stageFilter=Number(button.dataset.stageFilter);setView('trophies');renderList();$('trophies-view').scrollIntoView({behavior:'smooth'});}});
$('export').onclick=exportProgress;
$('import').onclick=()=>$('import-file').click();
$('import-file').onchange=()=>importProgress($('import-file').files[0]);
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();setView('trophies');$('search').focus();}});
$('source-links').innerHTML=Object.values(data.sources).map(source=>`<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} ↗</a>`).join('');
renderRoadmap();updateProgress();renderList();setView(params.get('view')||'trophies');
