/* THE ATTIC · v1.0 | Offline, local-first, no accounts, no analytics. */
(() => {
'use strict';
const W = window.PixelWorld;
const $ = (sel,root=document) => root.querySelector(sel);
const $$ = (sel,root=document) => [...root.querySelectorAll(sel)];
const page = $('#page'), overlay = $('#overlay'), toastNode = $('#toast');
const TYPES = {
 movies:{name:'Películas',singular:'Película',glyph:'▶',desc:'Cada historia que te llevas del cine'},
 series:{name:'Series',singular:'Serie',glyph:'TV',desc:'Universos donde pasaste tantas horas'},
 books:{name:'Libros',singular:'Libro',glyph:'BK',desc:'Los que te han hecho vivir mil vidas'},
 games:{name:'Videojuegos',singular:'Videojuego',glyph:'◈',desc:'Mundos donde también has vivido'},
 comics:{name:'Cómics',singular:'Cómic',glyph:'CM',desc:'Viñetas que no quieres olvidar'},
 manga:{name:'Manga',singular:'Manga',glyph:'漫',desc:'Historias para colocar en tu estantería'},
 hobbies:{name:'Hobbies',singular:'Hobby / proyecto',glyph:'✎',desc:'Cosas que has creado con tus manos'},
 music:{name:'Música',singular:'Disco / canción',glyph:'♫',desc:'La banda sonora de tu vida'},
 memories:{name:'Recuerdos',singular:'Recuerdo',glyph:'✦',desc:'Entradas, viajes y días especiales'}
};
const quotes={manhattan:'Las mejores historias suceden con lluvia al otro lado del cristal.',kyoto:'Incluso las flores que caen dejan algo bonito.',igloo:'Fuera hace frío. Dentro está todo lo que te importa.',forest:'Hay lugares donde el tiempo se toma su tiempo.',observatory:'Cuántos universos caben en una sola habitación.'};
const fresh=()=>({version:1,theme:'manhattan',pet:'cat',petName:'Pixel',roomName:'Mi pequeño refugio',entries:[],windowTime:'night',weather:true,setup:false});
let data=fresh(), tab='home', activeType='all', query='',onlyFavorites=false,sort='recent', renderLoop=0, savePending=null, db=null, tempPhoto='',tempRating=0,tempFavorite=false,tempType='movies';
let toastTimeout=null, petPhrases=['Hoy me quedo aquí contigo.','¿Otra historia para nuestra colección?','Este rincón es más bonito cuando estás.','He guardado tu sitio favorito.','¿Miramos un ratito por la ventana?','Prometo no tirar nada de la estantería.'];
let petCounter=0;
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const plural=(type,n)=>`${n} ${n===1?(TYPES[type]?.singular||'cosa').toLowerCase():(TYPES[type]?.name||'cosas').toLowerCase()}`;
const entriesFor=type=>data.entries.filter(e=>e.type===type);
const validType=t=>Object.hasOwn(TYPES,t)?t:'memories';
const validTheme=t=>Object.hasOwn(W.THEMES,t)?t:'manhattan';
const validPet=t=>Object.hasOwn(W.PETS,t)?t:'cat';
const cleanText=(s,max=4000)=>typeof s==='string'?s.slice(0,max):'';
const formatDate=d=>{if(!d)return '';const y=String(d).slice(0,10);const parts=y.split('-');return parts.length===3?`${parts[2]}/${parts[1]}/${parts[0]}`:y;};
const id=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`e${Date.now()}${Math.random().toString(36).slice(2)}`;
function toast(msg){clearTimeout(toastTimeout);toastNode.textContent=msg;toastNode.classList.add('show');toastTimeout=setTimeout(()=>toastNode.classList.remove('show'),3200);}
function scrub(raw){
 const base=fresh();if(!raw||typeof raw!=='object'||Array.isArray(raw))return base;
 base.theme=validTheme(raw.theme);base.pet=validPet(raw.pet);base.petName=cleanText(raw.petName,24)||'Pixel';base.roomName=cleanText(raw.roomName,48)||base.roomName;
 base.windowTime=['day','dusk','night'].includes(raw.windowTime)?raw.windowTime:'night';base.weather=raw.weather!==false;base.setup=!!raw.setup;
 if(Array.isArray(raw.entries))base.entries=raw.entries.slice(0,20000).filter(x=>x&&typeof x==='object'&&typeof x.title==='string'&&x.title.trim()).map(x=>({
  id:cleanText(x.id,70)||id(), type:validType(x.type), title:cleanText(x.title,180).trim(),
  rating:Number.isFinite(Number(x.rating))?Math.max(0,Math.min(5,Math.round(Number(x.rating)))):0,
  review:cleanText(x.review,4000),detail:cleanText(x.detail,160),status:['pending','active','done'].includes(x.status)?x.status:'done',
  favorite:!!x.favorite,date:/^\d{4}-\d{2}-\d{2}$/.test(x.date||'')?x.date:'',
  cover:typeof x.cover==='string'&&/^data:image\/(png|jpeg|webp);base64,/.test(x.cover)&&x.cover.length<3000000?x.cover:'',
  createdAt:Number(x.createdAt)||Date.now()
 }));
 return base;
}
function openDB(){return new Promise(resolve=>{
 if(!('indexedDB' in window)){resolve(null);return;}
 let req;
 try{req=indexedDB.open('the-attic-data',1);}catch{resolve(null);return;}
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('save'))req.result.createObjectStore('save');};
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);req.onblocked=()=>resolve(null);
});}
function dbGet(d){return new Promise(resolve=>{if(!d){resolve(null);return;}try{const tx=d.transaction('save','readonly'),req=tx.objectStore('save').get('profile');req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null);}catch{resolve(null);}});}
function dbSet(d,val){return new Promise((resolve,reject)=>{if(!d){reject(new Error('Sin base de datos'));return;}try{const tx=d.transaction('save','readwrite');tx.objectStore('save').put(val,'profile');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);}catch(e){reject(e);}});}
async function saveNow(){clearTimeout(savePending);savePending=null;try{
 if(db){await dbSet(db,data);}else{localStorage.setItem('the-attic-fallback',JSON.stringify(data));}
}catch(e){console.error('Error al guardar',e);toast('No se pudo guardar. Exporta una copia desde Mi mundo.');}}
function save(){clearTimeout(savePending);savePending=setTimeout(saveNow,180);}
function updateTheme(){document.body.dataset.theme=data.theme;$('meta[name="theme-color"]').setAttribute('content',getComputedStyle(document.body).getPropertyValue('--bg').trim()||'#141c2b');}
function navigate(next,opts={}){
 if(next==='library'&&opts.type){activeType=opts.type;query='';onlyFavorites=false;}
 tab=next;
 $$('.tab').forEach(b=>{let selected=b.dataset.tab===next;b.classList.toggle('active',selected);b.setAttribute('aria-current',selected?'page':'false');});
 render();window.scrollTo({top:0,behavior:'instant'});
}
function render(){cancelAnimationFrame(renderLoop);renderLoop=0;updateTheme();
 if(tab==='home')renderHome();else if(tab==='library')renderLibrary();else if(tab==='window')renderWindow();else renderSettings();
}
function typeTile(key){const t=TYPES[key],count=entriesFor(key).length;return `<button class="category-tile" data-type-open="${key}"><span class="symbol">${t.glyph}</span><strong>${esc(t.name)}</strong><small>${count} en tu mundo</small></button>`;}
function sceneButton({name,x,y,w,h,act}){return `<button class="hotspot ${act==='pet'?'pet-hotspot':''}" data-scene="${act}" aria-label="${esc(name)}" title="${esc(name)}" style="left:${(x/240*100).toFixed(2)}%;top:${(y/270*100).toFixed(2)}%;width:${(w/240*100).toFixed(2)}%;height:${(h/270*100).toFixed(2)}%"></button>`;}
function counts(){const a={};for(const t of Object.keys(TYPES))a[t]=entriesFor(t).length;return a;}
function renderHome(){
 const total=data.entries.length,faves=data.entries.filter(x=>x.favorite).length;
 page.innerHTML=`<section class="page-intro"><div class="eyebrow">✦ ESTÁS EN CASA</div><h1>${esc(data.roomName)}</h1><p class="subhead">${esc(W.THEMES[data.theme].place)}. ${esc(data.petName)} te estaba esperando.</p></section>
 <div class="scene-wrap"><div class="scene-inner"><canvas id="roomCanvas" width="240" height="270" aria-label="Habitación pixelada ${esc(W.THEMES[data.theme].name)}"></canvas>
 <div class="scene-caption">${esc(W.THEMES[data.theme].name.toUpperCase())}<small>Toca cualquier objeto marcado con +</small></div>
 ${sceneButton({name:'Abrir estantería de libros',x:10,y:24,w:77,h:138,act:'books'})}
 ${sceneButton({name:'Mirar por la ventana',x:89,y:20,w:86,h:98,act:'window'})}
 ${sceneButton({name:'Abrir mis películas',x:164,y:97,w:72,h:70,act:'movies'})}
 ${sceneButton({name:'Ver mi mesa de hobbies',x:8,y:145,w:105,h:67,act:'hobbies'})}
 ${sceneButton({name:'Ver videojuegos',x:175,y:169,w:61,h:53,act:'games'})}
 ${sceneButton({name:'Acariciar a ${esc(data.petName)}',x:90,y:205,w:59,h:45,act:'pet'})}
 </div></div>
 <p class="hint">Un rincón para tus historias, tus aficiones y las cosas que no quieres olvidar.</p>
 <div class="snapshot"><div class="stat"><strong>${total}</strong><span>pequeños tesoros</span></div><div class="stat"><strong>${faves}</strong><span>favoritos del corazón</span></div><div class="stat"><strong>${Object.values(counts()).filter(Boolean).length}</strong><span>rincones habitados</span></div></div>
 <div class="section-header"><h2>Los rincones de tu ático</h2><button class="text-link" id="addFromHome">+ Guardar algo</button></div>
 <div class="category-grid">${Object.keys(TYPES).map(typeTile).join('')}</div>
 <div class="section-header"><h2>Últimas historias</h2><button class="text-link" id="seeAll">Ver colección →</button></div>
 ${total?`<div class="card-list">${data.entries.slice().sort((a,b)=>b.createdAt-a.createdAt).slice(0,3).map(entryCard).join('')}</div>`:`<div class="mini-note"><span class="spark">✦</span><span>Tu ático está esperando su primera historia. ¿Una película que adoras? ¿El último juego que terminaste?</span></div>`}
 `;
 W.room($('#roomCanvas'),data.theme,data.pet,counts(),data.windowTime,0);
 $$('[data-scene]',page).forEach(el=>el.addEventListener('click',()=>{let act=el.dataset.scene;if(act==='pet'){toast(`${data.petName}: «${petPhrases[petCounter++%petPhrases.length]}»`);}else if(act==='window')navigate('window');else navigate('library',{type:act});}));
 $$('[data-type-open]',page).forEach(el=>el.addEventListener('click',()=>navigate('library',{type:el.dataset.typeOpen})));
 $('#addFromHome').addEventListener('click',()=>showEditor());$('#seeAll').addEventListener('click',()=>{activeType='all';navigate('library');});wireCards();
}
function ratingText(n){return n?`<span class="stars" aria-label="${n} de 5 estrellas">${'★'.repeat(n)}${'☆'.repeat(5-n)}</span>`:`<span style="color:var(--muted)">Sin valorar</span>`;}
function coverHTML(item){if(item.cover)return `<span class="cover"><img alt="" src="${item.cover}"></span>`;
 return `<span class="cover"><span class="cover-glyph">${TYPES[item.type].glyph}</span></span>`;
}
function statusText(s){return {pending:'Pendiente',active:'En curso',done:'Terminado'}[s]||'Terminado';}
function entryCard(e){return `<button type="button" class="entry-card" data-entry-id="${esc(e.id)}">${coverHTML(e)}<span class="entry-copy"><strong>${esc(e.title)} ${e.favorite?'<span class="heart" aria-label="Favorito">♥</span>':''}</strong><p>${esc(TYPES[e.type].singular)} · ${statusText(e.status)}${e.detail?' · '+esc(e.detail):''}</p><span class="entry-bottom">${ratingText(e.rating)}</span></span><span style="color:var(--muted);font-size:18px">›</span></button>`;}
function filteredEntries(){let arr=data.entries.filter(e=>(activeType==='all'||e.type===activeType)&&(!onlyFavorites||e.favorite)&&(!query||`${e.title} ${e.review} ${e.detail}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))));
 if(sort==='title')arr.sort((a,b)=>a.title.localeCompare(b.title,'es'));else if(sort==='rating')arr.sort((a,b)=>b.rating-a.rating||b.createdAt-a.createdAt);else arr.sort((a,b)=>b.createdAt-a.createdAt);return arr;}
function renderLibrary(){
 page.innerHTML=`<div class="page-intro"><div class="eyebrow">✦ TUS PEQUEÑOS TESOROS</div><h1>La colección</h1><p class="subhead">Un museo de cosas que te han hecho sentir algo.</p></div>
 <input id="searchEntries" class="search" type="search" placeholder="Busca una historia, un recuerdo..." aria-label="Buscar en la colección" value="${esc(query)}">
 <div class="filter-scroll" aria-label="Filtrar por categoría">${[['all','Todo'],...Object.entries(TYPES).map(([key,o])=>[key,o.name])].map(([k,v])=>`<button class="chip ${k===activeType?'selected':''}" data-filter="${k}">${esc(v)}</button>`).join('')}</div>
 <div class="library-meta"><label style="display:flex;align-items:center;gap:6px;"><input id="favoriteOnly" type="checkbox" ${onlyFavorites?'checked':''}> Solo favoritos ♥</label><select id="sortEntries" aria-label="Ordenar colección"><option value="recent" ${sort==='recent'?'selected':''}>Más recientes</option><option value="title" ${sort==='title'?'selected':''}>Por título</option><option value="rating" ${sort==='rating'?'selected':''}>Mejor valorados</option></select></div>
 <div id="libraryList"></div><div class="float-add"><button class="button" id="addFromLibrary">+ AÑADIR TESORO</button></div>`;
 $('#searchEntries').addEventListener('input',e=>{query=e.target.value;renderLibraryList();});
 $('#favoriteOnly').addEventListener('change',e=>{onlyFavorites=e.target.checked;renderLibraryList();});
 $('#sortEntries').addEventListener('change',e=>{sort=e.target.value;renderLibraryList();});
 $$('[data-filter]',page).forEach(b=>b.addEventListener('click',()=>{activeType=b.dataset.filter;$$('[data-filter]',page).forEach(x=>x.classList.toggle('selected',x===b));renderLibraryList();}));
 $('#addFromLibrary').addEventListener('click',()=>showEditor(null,activeType==='all'?'movies':activeType));renderLibraryList();
}
function renderLibraryList(){const arr=filteredEntries(),list=$('#libraryList');if(!list)return;
 list.innerHTML=`<div class="library-meta"><span>${arr.length} ${arr.length===1?'tesoro encontrado':'tesoros encontrados'}</span></div>${arr.length?`<div class="card-list">${arr.map(entryCard).join('')}</div>`:`<div class="empty"><div class="empty-symbol">✧</div><h3>Aquí todavía no hay nada</h3><p>${query||onlyFavorites?'Prueba otra búsqueda o cambia los filtros.':'Una estantería vacía es una invitación. Guarda algo que merezca su sitio aquí.'}</p><button class="button small" id="emptyAdd">+ Guardar algo</button></div>`}`;
 wireCards(list);$('#emptyAdd',list)?.addEventListener('click',()=>showEditor(null,activeType==='all'?'movies':activeType));
}
function wireCards(scope=page){$$('[data-entry-id]',scope).forEach(b=>b.addEventListener('click',()=>showDetail(b.dataset.entryId)));}
function renderWindow(){
 page.innerHTML=`<section class="page-intro"><div class="eyebrow">✦ EL MUNDO SIGUE AHÍ FUERA</div><h1>Un rato en la ventana</h1><p class="subhead">${esc(W.THEMES[data.theme].place)}. No tienes que hacer nada más.</p></section>
 <div class="window-frame"><canvas id="landscapeCanvas" width="240" height="305" aria-label="Paisaje pixel art de ${esc(W.THEMES[data.theme].name)}"></canvas></div>
 <div class="window-controls"><div style="display:flex;gap:6px;flex-wrap:wrap;">${[['day','Día'],['dusk','Atardecer'],['night','Noche']].map(([v,l])=>`<button class="chip ${data.windowTime===v?'selected':''}" data-time="${v}">${l}</button>`).join('')}</div><button class="chip ${data.weather?'selected':''}" id="weatherToggle">${data.weather?'✦ Ambiente: sí':'✦ Ambiente: no'}</button></div>
 <div class="letter">«${esc(quotes[data.theme])}»<div style="color:var(--muted);margin-top:9px;font-size:11px">El paisaje también puede ser una postal para guardar o compartir.</div></div>
 <div class="toolbar"><button class="button secondary" id="savePostcard">↓ Guardar postal PNG</button><button class="button ghost" id="changeScenery">Cambiar de escenario</button></div>`;
 $$('[data-time]',page).forEach(b=>b.addEventListener('click',()=>{data.windowTime=b.dataset.time;save();renderWindow();}));
 $('#weatherToggle').addEventListener('click',()=>{data.weather=!data.weather;save();renderWindow();});
 $('#savePostcard').addEventListener('click',downloadPostcard);
 $('#changeScenery').addEventListener('click',()=>navigate('settings'));
 let frame=0,last=0;
 const canvas=$('#landscapeCanvas');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const loop=t=>{if(tab!=='window'||!canvas.isConnected)return; if(t-last>(reduced?1000:180)){last=t;W.landscape(canvas,data.theme,data.windowTime,data.weather,frame++);}renderLoop=requestAnimationFrame(loop);};
 // An initial frame makes the scenery visible even while the page is not animating.
 W.landscape(canvas,data.theme,data.windowTime,data.weather,0);
 if(!reduced){renderLoop=requestAnimationFrame(loop);}
}
function drawThemePreviews(root=page){$$('canvas[data-theme-preview]',root).forEach(c=>W.themePreview(c,c.dataset.themePreview));}
function drawPetPreviews(root=page){$$('canvas[data-pet-preview]',root).forEach(c=>W.petPreview(c,c.dataset.petPreview));}
function themeChoices(){return Object.entries(W.THEMES).map(([key,val])=>`<button class="theme-option ${data.theme===key?'selected':''}" data-change-theme="${key}" aria-pressed="${data.theme===key}"><canvas data-theme-preview="${key}" width="240" height="150" aria-hidden="true"></canvas><strong>${esc(val.name)}</strong><span>${esc(val.place)}</span></button>`).join('');}
function petChoices(){return Object.entries(W.PETS).map(([key,val])=>`<button class="pet-option ${data.pet===key?'selected':''}" data-change-pet="${key}" aria-pressed="${data.pet===key}"><canvas data-pet-preview="${key}" width="66" height="66" aria-hidden="true"></canvas><strong>${esc(val)}</strong></button>`).join('');}
function wireThemePet(root=page,redraw=()=>{}){
 const refresh=()=>{
   updateTheme();
   $$('[data-change-theme]',root).forEach(el=>{let yes=el.dataset.changeTheme===data.theme;el.classList.toggle('selected',yes);el.setAttribute('aria-pressed',String(yes));});
   $$('[data-change-pet]',root).forEach(el=>{let yes=el.dataset.changePet===data.pet;el.classList.toggle('selected',yes);el.setAttribute('aria-pressed',String(yes));});
   redraw();
 };
 $$('[data-change-theme]',root).forEach(b=>b.addEventListener('click',()=>{data.theme=b.dataset.changeTheme;data.windowTime=({manhattan:'night',kyoto:'day',igloo:'night',forest:'dusk',observatory:'night'})[data.theme];save();refresh();}));
 $$('[data-change-pet]',root).forEach(b=>b.addEventListener('click',()=>{data.pet=b.dataset.changePet;save();refresh();}));
}
function renderSettings(){
 page.innerHTML=`<section class="page-intro"><div class="eyebrow">✦ TU RINCÓN. TUS REGLAS.</div><h1>Hazlo tuyo</h1><p class="subhead">Tu pequeño universo puede parecerse a ti. O a un lugar en el que te gustaría vivir.</p></section>
 <div class="section-header"><h2>Elige dónde vivir</h2></div><div class="theme-grid">${themeChoices()}</div>
 <div class="section-header"><h2>Tu compañero de piso</h2></div><div class="pet-grid">${petChoices()}</div>
 <div class="settings-panel"><div class="field"><label for="petName">¿Cómo se llama?</label><input maxlength="24" id="petName" value="${esc(data.petName)}" placeholder="Pixel"></div><div class="field"><label for="roomName">Nombre de tu refugio</label><input maxlength="48" id="roomName" value="${esc(data.roomName)}" placeholder="Mi pequeño refugio"></div><button class="button small" id="saveNames">Guardar nombres</button></div>
 <div class="section-header"><h2>Tu mundo es tuyo</h2></div>
 <div class="settings-panel"><h3>Guardar una copia</h3><p>Todo se guarda en este dispositivo. Puedes exportar tus colecciones con fotos y recuperarlas más adelante. Haz copias de vez en cuando: borrar los datos del navegador podría hacerte perder el ático.</p><button class="button secondary full" id="exportData">↓ Descargar copia de seguridad</button><button class="button ghost full" id="importData">↑ Recuperar una copia</button><input type="file" id="importInput" accept=".json,application/json" hidden></div>
 <div class="settings-panel"><h3>Instalar en tu iPhone</h3><p>Abre la web en Safari, pulsa Compartir y elige «Añadir a pantalla de inicio». Una vez cargada, puede funcionar sin internet. No necesitas cuenta.</p></div>
 <div class="settings-panel"><h3>Empezar de cero</h3><p>Elimina tu habitación, tus colecciones y la configuración de este dispositivo. Esta acción no se puede deshacer.</p><button class="button danger small" id="resetData">Borrar mi ático</button></div>
 <div style="text-align:center;color:var(--muted);font:10px ui-monospace,monospace;margin:20px">THE ATTIC · V1.0 · HECHO PARA QUEDARSE UN RATO</div>`;
 drawThemePreviews();drawPetPreviews();wireThemePet();
 $('#saveNames').addEventListener('click',()=>{data.petName=$('#petName').value.trim().slice(0,24)||'Pixel';data.roomName=$('#roomName').value.trim().slice(0,48)||'Mi pequeño refugio';save();toast('Ahora sí que parece tuyo ♥');});
 $('#exportData').addEventListener('click',downloadBackup);$('#importData').addEventListener('click',()=>$('#importInput').click());$('#importInput').addEventListener('change',importBackup);
 $('#resetData').addEventListener('click',()=>{if(confirm('¿Seguro que quieres borrar TODO tu ático? Antes puedes descargar una copia.')){data=fresh();saveNow();activeType='all';query='';navigate('home');showWelcome();toast('Has empezado un ático nuevo.');}});
}
function modalHTML(title,body){overlay.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><h2>${esc(title)}</h2><button type="button" class="close" id="closeModal" aria-label="Cerrar">×</button></div>${body}</section>`;
 document.body.style.overflow='hidden';$('#closeModal',overlay).addEventListener('click',closeModal);
 $('#closeModal',overlay).focus({preventScroll:true});
}
function closeModal(){overlay.innerHTML='';document.body.style.overflow='';tempPhoto='';}
function showEditor(entry=null,type='movies'){
 const editing=!!entry;const e=entry||{title:'',rating:0,review:'',detail:'',status:'done',favorite:false,date:'',cover:'',type:validType(type)};
 tempPhoto=e.cover||'';tempRating=e.rating||0;tempFavorite=!!e.favorite;tempType=e.type;
 modalHTML(editing?'Editar mi tesoro':'Guardar algo bonito',`<p class="modal-sub">Tu ático no es una lista de deberes. Guarda lo que merece quedarse.</p>
 <form id="entryForm"><div class="field"><label>¿En qué rincón lo guardamos?</label><div class="type-picker" id="typePicker">${Object.entries(TYPES).map(([key,v])=>`<button type="button" class="chip ${tempType===key?'selected':''}" data-type-pick="${key}">${esc(v.name)}</button>`).join('')}</div></div>
 <div class="field"><label for="entryTitle">Nombre *</label><input id="entryTitle" maxlength="180" required placeholder="El nombre de esa historia..." value="${esc(e.title)}"></div>
 <div class="field"><label>¿Cuántas estrellas se merece?</label><div class="rate-row" id="ratingRow">${[1,2,3,4,5].map(n=>`<button type="button" class="rate-star ${n<=tempRating?'on':''}" aria-label="${n} estrellas" aria-pressed="${n===tempRating}" data-star="${n}">★</button>`).join('')}</div><small>Si aún no lo has terminado, puedes dejarlo sin valorar.</small></div>
 <div class="field"><label for="entryReview">¿Qué te ha hecho sentir?</label><textarea id="entryReview" maxlength="4000" placeholder="Tu opinión, una escena, un recuerdo, unas palabras...">${esc(e.review)}</textarea></div>
 <button type="button" id="favoriteToggle" class="favorite-toggle ${tempFavorite?'on':''}"><span class="heart">${tempFavorite?'♥':'♡'}</span> ${tempFavorite?'Esto vive en mi corazón':'Marcar como favorito del corazón'}</button>
 <div class="field"><label for="entryStatus">En qué punto estás</label><select id="entryStatus"><option value="pending" ${e.status==='pending'?'selected':''}>Por descubrir / pendiente</option><option value="active" ${e.status==='active'?'selected':''}>Lo estoy viviendo</option><option value="done" ${e.status==='done'?'selected':''}>Ya lo he vivido / terminado</option></select></div>
 <div class="field"><label for="entryDetail">Un detalle más <span style="font-weight:400;color:var(--muted)">(opcional)</span></label><input id="entryDetail" maxlength="160" placeholder="Autor, plataforma, lugar, con quién..." value="${esc(e.detail)}"></div>
 <div class="field"><label for="entryDate">Fecha especial <span style="font-weight:400;color:var(--muted)">(opcional)</span></label><input id="entryDate" type="date" value="${esc(e.date)}"></div>
 <div class="field"><label>Una portada o fotografía <span style="font-weight:400;color:var(--muted)">(opcional)</span></label><div class="upload-box"><div id="photoPreview">${tempPhoto?`<img src="${tempPhoto}" alt="Foto elegida">`:'<span class="cover"><span class="cover-glyph">✧</span></span>'}</div><div style="display:grid;gap:7px"><button type="button" class="button secondary small" id="choosePhoto">Elegir foto</button><button type="button" class="text-link" id="removePhoto" ${tempPhoto?'':'hidden'}>Quitar imagen</button></div></div><input id="photoInput" type="file" accept="image/*" hidden><small>La imagen se reduce para que se guarde sin conexión.</small></div>
 <div class="form-footer"><button type="button" class="button secondary" id="cancelEntry">Cancelar</button><button type="submit" class="button">${editing?'Guardar cambios':'Guardar tesoro'} ♥</button></div></form>`);
 $$('[data-type-pick]',overlay).forEach(b=>b.addEventListener('click',()=>{tempType=b.dataset.typePick;$$('[data-type-pick]',overlay).forEach(x=>x.classList.toggle('selected',x===b));}));
 $$('[data-star]',overlay).forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.star);tempRating=tempRating===n?0:n;$$('[data-star]',overlay).forEach(x=>{x.classList.toggle('on',Number(x.dataset.star)<=tempRating);x.setAttribute('aria-pressed',String(Number(x.dataset.star)===tempRating));});}));
 $('#favoriteToggle',overlay).addEventListener('click',()=>{tempFavorite=!tempFavorite;const b=$('#favoriteToggle',overlay);b.classList.toggle('on',tempFavorite);b.innerHTML=`<span class="heart">${tempFavorite?'♥':'♡'}</span> ${tempFavorite?'Esto vive en mi corazón':'Marcar como favorito del corazón'}`;});
 $('#choosePhoto',overlay).addEventListener('click',()=>$('#photoInput',overlay).click());
 $('#photoInput',overlay).addEventListener('change',async evt=>{const file=evt.target.files?.[0];if(!file)return;
 try{tempPhoto=await compressImage(file);$('#photoPreview',overlay).innerHTML=`<img src="${tempPhoto}" alt="Foto elegida">`;$('#removePhoto',overlay).hidden=false;toast('Foto añadida ♥');}catch(err){toast('No hemos podido leer esa foto. Prueba con JPG o PNG.');}
 });
 $('#removePhoto',overlay).addEventListener('click',()=>{tempPhoto='';$('#photoPreview',overlay).innerHTML='<span class="cover"><span class="cover-glyph">✧</span></span>';$('#removePhoto',overlay).hidden=true;});
 $('#cancelEntry',overlay).addEventListener('click',closeModal);
 $('#entryForm',overlay).addEventListener('submit',async ev=>{ev.preventDefault();let title=$('#entryTitle',overlay).value.trim();if(!title){toast('Pon un nombre a tu tesoro.');return;}
 const next={id:entry?.id||id(),type:tempType,title:title.slice(0,180),rating:tempRating,review:$('#entryReview',overlay).value.trim().slice(0,4000),detail:$('#entryDetail',overlay).value.trim().slice(0,160),status:$('#entryStatus',overlay).value,favorite:tempFavorite,date:$('#entryDate',overlay).value,cover:tempPhoto,createdAt:entry?.createdAt||Date.now()};
 if(entry){const pos=data.entries.findIndex(x=>x.id===entry.id);if(pos<0)return;data.entries[pos]=next;}else data.entries.push(next);
 await saveNow();closeModal();render();toast(entry?'Cambios guardados en tu ático ♥':'Un tesoro más en casa ♥');
 });
}
function compressImage(file){return new Promise((resolve,reject)=>{
 if(!file.type.startsWith('image/')){reject(new Error('No es imagen'));return;}
 if(file.size>25*1024*1024){reject(new Error('Archivo demasiado grande'));return;}
 const url=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{try{let scale=Math.min(1,300/img.naturalWidth,400/img.naturalHeight),cw=Math.max(1,Math.round(img.naturalWidth*scale)),ch=Math.max(1,Math.round(img.naturalHeight*scale));
 const c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(img,0,0,cw,ch);const result=c.toDataURL('image/jpeg',.68);URL.revokeObjectURL(url);resolve(result);}catch(err){URL.revokeObjectURL(url);reject(err);}};
 img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('No se puede leer'));};img.src=url;
 });}
function showDetail(entryId){let e=data.entries.find(x=>x.id===entryId);if(!e)return;
 modalHTML('Una pequeña historia',`<div class="detail-header">${coverHTML(e)}<div><span class="detail-label">${esc(TYPES[e.type].singular)}</span><h2>${esc(e.title)} ${e.favorite?'<span class="heart">♥</span>':''}</h2>${ratingText(e.rating)}<p class="subhead">${statusText(e.status)} ${e.date?'· '+formatDate(e.date):''}</p></div></div>
 ${e.detail?`<div class="mini-note" style="margin-bottom:13px"><span class="spark">✦</span><span>${esc(e.detail)}</span></div>`:''}
 <h3 style="margin:12px 0 8px">Lo que quiero recordar</h3><div class="review-box">${e.review?esc(e.review):'<span style="color:var(--muted)">Aún no has escrito nada sobre esto. También está bien.</span>'}</div>
 <div class="detail-actions"><button class="button secondary" id="editEntry">✎ Editar</button><button class="button ${e.favorite?'secondary':'ghost'}" id="flipFavorite">${e.favorite?'♥ Favorito':'♡ Favorito'}</button></div><div style="margin-top:14px;text-align:center"><button class="text-link" style="color:#efa9a9" id="deleteEntry">Eliminar este tesoro</button></div>`);
 $('#editEntry',overlay).addEventListener('click',()=>showEditor(e));
 $('#flipFavorite',overlay).addEventListener('click',async()=>{e.favorite=!e.favorite;await saveNow();render();showDetail(entryId);});
 $('#deleteEntry',overlay).addEventListener('click',async()=>{if(confirm(`¿Eliminar «${e.title}» de tu ático?`)){data.entries=data.entries.filter(x=>x.id!==e.id);await saveNow();closeModal();render();toast('Tesoro retirado de la colección.');}});
}
function showWelcome(){
 modalHTML('Estás en casa',`<div class="welcome-head"><canvas id="welcomeCanvas" width="240" height="220" aria-label="Previsualización de un ático pixelado"></canvas><h2>THE ATTIC</h2><p>Tu museo de películas, libros, videojuegos, creaciones, músicas y recuerdos. Sin deberes. Sin prisas. Solo cosas que te encantan.</p></div>
 <h3>Primero, ¿a qué lugar te escapas?</h3><div class="theme-grid">${themeChoices()}</div>
 <h3>¿Quién te hace compañía?</h3><div class="pet-grid">${petChoices()}</div>
 <button class="button full" id="enterAttic">ENTRAR EN MI ÁTICO ✦</button>`);
 const draw=()=>{W.room($('#welcomeCanvas',overlay),data.theme,data.pet,counts(),data.windowTime,0);drawThemePreviews(overlay);drawPetPreviews(overlay);};
 draw();wireThemePet(overlay,()=>W.room($('#welcomeCanvas',overlay),data.theme,data.pet,counts(),data.windowTime,0));
 $('#enterAttic',overlay).addEventListener('click',()=>{data.setup=true;saveNow();closeModal();render();toast('¡Ya estás en tu pequeño universo! ♥');});
}
function downloadFile(blob,filename){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);}
function downloadBackup(){downloadFile(new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}),`the-attic-copia-${new Date().toISOString().slice(0,10)}.json`);toast('Copia descargada ♥');}
function importBackup(ev){let f=ev.target.files?.[0];if(!f)return;ev.target.value='';if(f.size>40*1024*1024){toast('Esta copia es demasiado grande.');return;}
 const r=new FileReader();r.onload=async()=>{try{const raw=JSON.parse(r.result);if(!raw||!Array.isArray(raw.entries))throw new Error('formato');
 const clean=scrub(raw);if(!confirm(`¿Recuperar la copia con ${clean.entries.length} tesoros? Esto sustituirá la colección actual.`))return;
 data=clean;data.setup=true;await saveNow();activeType='all';query='';navigate('home');toast('¡Tu ático ha vuelto a casa! ♥');
 }catch(e){toast('El archivo no parece una copia válida de The Attic.');}};r.onerror=()=>toast('No hemos podido leer ese archivo.');r.readAsText(f);
}
function downloadPostcard(){const source=$('#landscapeCanvas');if(!source)return;
 const scale=4,c=document.createElement('canvas');c.width=source.width*scale;c.height=source.height*scale;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(source,0,0,c.width,c.height);
 c.toBlob(blob=>{if(blob)downloadFile(blob,`postal-${data.theme}-${data.windowTime}.png`);else toast('No hemos podido guardar la postal.');},'image/png');
}
async function init(){
 $$('.tab').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.tab)));
 $('#brandHome').addEventListener('click',()=>navigate('home'));$('#openSettings').addEventListener('click',()=>navigate('settings'));
 overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.innerHTML)closeModal();});
 db=await openDB();let saved=await dbGet(db);if(!saved){try{saved=JSON.parse(localStorage.getItem('the-attic-fallback'));}catch{saved=null;}}
 if(saved)data=scrub(saved);render();if(!data.setup)showWelcome();
 if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Sin servicio offline:',err));
}
init();
})();
