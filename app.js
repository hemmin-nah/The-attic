(() => {
'use strict';
const W = window.PixelWorld;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const page = $('#page');
const overlay = $('#overlay');
const toastNode = $('#toast');

const ROOMS = {
  movies: { name: 'Películas', icon: '▶', desc: 'Tu pequeña sala de cine privada.' },
  series: { name: 'Series', icon: '▥', desc: 'Maratones, comfort shows y universos largos.' },
  books: { name: 'Libros', icon: '▤', desc: 'Tu biblioteca íntima del ático.' },
  games: { name: 'Videojuegos', icon: '◈', desc: 'Consolas, aventuras y mundos jugables.' },
  comics: { name: 'Cómics', icon: '☄', desc: 'Grapas, tomos y viñetas favoritas.' },
  manga: { name: 'Manga', icon: '漫', desc: 'Tu rincón de lectura más cosy.' },
  hobbies: { name: 'Hobbies', icon: '✂', desc: 'Manualidades, miniaturas y proyectos.' },
  memories: { name: 'Recuerdos', icon: '✦', desc: 'Entradas, momentos y pequeñas reliquias.' }
};

const JOURNAL_MOODS = ['Melancólica', 'Feliz', 'Inspirada', 'Tranquila', 'Nostálgica', 'Caótica'];
const PET_QUOTES = [
  'Este rincón hoy está especialmente bonito.',
  'Creo que deberíamos guardar otra historia.',
  'Prometo vigilar tus tesoros mientras no estás.',
  'Podríamos mirar un rato por la ventana.',
  'Tu mundo cada vez parece más vivo.'
];

const freshState = () => ({
  version: 2,
  setup: false,
  atticName: 'Mi ático',
  companionName: 'Pixel',
  theme: 'manhattan',
  pet: 'cat',
  windowTime: 'night',
  weather: true,
  items: [],
  journal: []
});

let state = load();
let view = state.setup ? 'home' : 'world';
let currentRoom = 'movies';
let toastTimer = null;
let roomSearch = '';
let roomFavorites = false;
let roomSort = 'recent';
let journalSearch = '';
let journalFavorites = false;
let petIndex = 0;

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem('the-attic-v2') || 'null');
    return sanitize(raw);
  } catch {
    return freshState();
  }
}
function save() {
  localStorage.setItem('the-attic-v2', JSON.stringify(state));
  document.body.dataset.theme = state.theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta && meta.setAttribute('content', themeColor(state.theme));
}
function sanitize(raw) {
  const base = freshState();
  if (!raw || typeof raw !== 'object') return base;
  base.setup = !!raw.setup;
  base.atticName = clean(raw.atticName, 40) || base.atticName;
  base.companionName = clean(raw.companionName, 30) || base.companionName;
  base.theme = W.THEMES[raw.theme] ? raw.theme : base.theme;
  base.pet = W.PETS[raw.pet] ? raw.pet : base.pet;
  base.windowTime = ['day', 'dusk', 'night'].includes(raw.windowTime) ? raw.windowTime : W.THEMES[base.theme].time || 'night';
  base.weather = raw.weather !== false;
  if (Array.isArray(raw.items)) base.items = raw.items.slice(0, 2000).map(sanitizeItem).filter(Boolean);
  if (Array.isArray(raw.journal)) base.journal = raw.journal.slice(0, 1000).map(sanitizeJournal).filter(Boolean);
  return base;
}
function sanitizeItem(x) {
  if (!x || typeof x !== 'object') return null;
  const type = ROOMS[x.type] ? x.type : 'movies';
  const title = clean(x.title, 160).trim();
  if (!title) return null;
  return {
    id: clean(x.id, 64) || uid(),
    type,
    title,
    rating: clampInt(x.rating, 0, 5),
    review: clean(x.review, 4000),
    favorite: !!x.favorite,
    detail: clean(x.detail, 180),
    date: validDate(x.date) ? x.date : '',
    status: ['wishlist', 'in-progress', 'done'].includes(x.status) ? x.status : 'done',
    cover: typeof x.cover === 'string' && x.cover.startsWith('data:image/') ? x.cover : '',
    createdAt: Number(x.createdAt) || Date.now()
  };
}
function sanitizeJournal(x) {
  if (!x || typeof x !== 'object') return null;
  const title = clean(x.title, 120).trim() || 'Entrada sin título';
  const content = clean(x.content, 5000).trim();
  if (!content) return null;
  return {
    id: clean(x.id, 64) || uid(),
    title,
    content,
    mood: JOURNAL_MOODS.includes(x.mood) ? x.mood : JOURNAL_MOODS[0],
    favorite: !!x.favorite,
    date: validDate(x.date) ? x.date : today(),
    createdAt: Number(x.createdAt) || Date.now()
  };
}
function clean(v, max = 1000) { return typeof v === 'string' ? v.slice(0, max) : ''; }
function clampInt(v, min, max) { const n = Math.round(Number(v) || 0); return Math.max(min, Math.min(max, n)); }
function validDate(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v || ''); }
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(v) { return validDate(v) ? `${v.slice(8,10)}/${v.slice(5,7)}/${v.slice(0,4)}` : 'Sin fecha'; }
function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function themeColor(key) { return ({ manhattan:'#1b2233', kyoto:'#a68873', igloo:'#74bcd2', cottage:'#4b5942', observatory:'#2f2947' })[key] || '#1b2233'; }
function toast(msg) {
  clearTimeout(toastTimer);
  toastNode.textContent = msg;
  toastNode.classList.add('show');
  toastTimer = setTimeout(() => toastNode.classList.remove('show'), 2800);
}

function go(next) {
  view = next;
  $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.view === next));
  render();
  window.scrollTo(0, 0);
}

function render() {
  document.body.dataset.theme = state.theme;
  if (view === 'home') renderHome();
  else if (view === 'room') renderRoomPage();
  else if (view === 'journal') renderJournal();
  else if (view === 'window') renderWindowPage();
  else renderWorld();
}

function renderHome() {
  const countRooms = Object.keys(ROOMS).map(k => ({ key: k, n: itemsOf(k).length }));
  const total = state.items.length;
  const favorites = state.items.filter(x => x.favorite).length + state.journal.filter(x => x.favorite).length;

  page.innerHTML = `
    <section class="hero card">
      <div class="eyebrow">✦ TU UNIVERSO</div>
      <h1>${esc(state.atticName)}</h1>
      <p class="lead">${esc(W.THEMES[state.theme].name)} · ${esc(W.THEMES[state.theme].mood)}</p>
      <canvas id="hubCanvas" class="hub-canvas pixel"></canvas>
      <div class="pet-line">${esc(state.companionName)} te acompaña hoy: “${PET_QUOTES[petIndex++ % PET_QUOTES.length]}”</div>
      <div class="stats">
        <div><strong>${total}</strong><span>tesoros</span></div>
        <div><strong>${state.journal.length}</strong><span>páginas</span></div>
        <div><strong>${favorites}</strong><span>favoritos</span></div>
      </div>
    </section>

    <section class="section-head">
      <div>
        <div class="eyebrow">RINCONES DEL ÁTICO</div>
        <h2>Cada tesoro tiene su propio espacio</h2>
      </div>
      <button class="ghost-btn" id="openWindowFromHome">Mirar la ventana</button>
    </section>

    <section class="room-grid">
      ${Object.entries(ROOMS).map(([key, room]) => roomTile(key, room)).join('')}
      ${journalTile()}
    </section>
  `;

  const hub = $('#hubCanvas');
  hub.width = 320; hub.height = 360;
  W.drawHub(hub, state.theme, state.pet, countsByRoom(), state.windowTime);

  $$('.room-card').forEach(card => {
    const key = card.dataset.room;
    const canvas = $('canvas', card);
    canvas.width = 320; canvas.height = 220;
    if (key === 'journal') W.drawRoom(canvas, state.theme, 'journal', state.pet, state.windowTime);
    else W.drawRoom(canvas, state.theme, key, state.pet, state.windowTime);
    card.addEventListener('click', () => {
      if (key === 'journal') go('journal');
      else { currentRoom = key; go('room'); }
    });
  });
  $('#openWindowFromHome').addEventListener('click', () => go('window'));
}

function roomTile(key, room) {
  return `
    <button class="room-card card" data-room="${key}">
      <canvas class="room-thumb pixel"></canvas>
      <div class="room-meta">
        <div class="room-top"><strong>${esc(room.name)}</strong><span class="pill">${itemsOf(key).length}</span></div>
        <p>${esc(room.desc)}</p>
      </div>
    </button>
  `;
}
function journalTile() {
  return `
    <button class="room-card card" data-room="journal">
      <canvas class="room-thumb pixel"></canvas>
      <div class="room-meta">
        <div class="room-top"><strong>Diario</strong><span class="pill">${state.journal.length}</span></div>
        <p>Tu escritorio personal para escribir y recordar.</p>
      </div>
    </button>
  `;
}

function renderRoomPage() {
  const meta = ROOMS[currentRoom];
  const list = filteredRoomItems();
  page.innerHTML = `
    <section class="hero card compact">
      <button class="back-link" id="backHome">← Volver al ático</button>
      <div class="eyebrow">RINCÓN TEMÁTICO</div>
      <h1>${esc(meta.name)}</h1>
      <p class="lead">${esc(meta.desc)}</p>
      <canvas id="roomScene" class="scene-canvas pixel"></canvas>
    </section>

    <section class="controls card">
      <div class="controls-row">
        <input id="roomSearch" class="text-input" placeholder="Buscar en ${meta.name.toLowerCase()}" value="${escAttr(roomSearch)}">
        <button id="addItemBtn" class="primary-btn">＋ Añadir</button>
      </div>
      <div class="controls-row compact-row">
        <label class="toggle"><input type="checkbox" id="favOnly" ${roomFavorites ? 'checked' : ''}><span>Solo favoritos</span></label>
        <select id="sortItems" class="select-input">
          <option value="recent" ${roomSort==='recent'?'selected':''}>Más recientes</option>
          <option value="title" ${roomSort==='title'?'selected':''}>Título A-Z</option>
          <option value="rating" ${roomSort==='rating'?'selected':''}>Mejor valoradas</option>
        </select>
      </div>
    </section>

    <section class="items-list">
      ${list.length ? list.map(itemCard).join('') : emptyState(`Aún no has guardado nada en ${meta.name.toLowerCase()}.`)}
    </section>
  `;
  const scene = $('#roomScene'); scene.width = 320; scene.height = 220;
  W.drawRoom(scene, state.theme, currentRoom, state.pet, state.windowTime);
  $('#backHome').addEventListener('click', () => go('home'));
  $('#roomSearch').addEventListener('input', e => { roomSearch = e.target.value; renderRoomPage(); });
  $('#favOnly').addEventListener('change', e => { roomFavorites = e.target.checked; renderRoomPage(); });
  $('#sortItems').addEventListener('change', e => { roomSort = e.target.value; renderRoomPage(); });
  $('#addItemBtn').addEventListener('click', () => openItemEditor());
  wireItemActions();
}

function renderJournal() {
  const list = filteredJournal();
  page.innerHTML = `
    <section class="hero card compact">
      <div class="eyebrow">CUADERNO PERSONAL</div>
      <h1>Diario del ático</h1>
      <p class="lead">Un rincón para anotar pensamientos, días importantes o pequeñas escenas de tu vida.</p>
      <canvas id="journalScene" class="scene-canvas pixel"></canvas>
    </section>

    <section class="controls card">
      <div class="controls-row">
        <input id="journalSearch" class="text-input" placeholder="Buscar en el diario" value="${escAttr(journalSearch)}">
        <button id="addJournalBtn" class="primary-btn">＋ Escribir</button>
      </div>
      <div class="controls-row compact-row">
        <label class="toggle"><input type="checkbox" id="journalFav" ${journalFavorites ? 'checked' : ''}><span>Solo favoritas</span></label>
        <span class="small-meta">${state.journal.length} páginas guardadas</span>
      </div>
    </section>

    <section class="items-list">
      ${list.length ? list.map(journalCard).join('') : emptyState('Tu diario todavía está en blanco.')}
    </section>
  `;
  const scene = $('#journalScene'); scene.width = 320; scene.height = 220;
  W.drawRoom(scene, state.theme, 'journal', state.pet, state.windowTime);
  $('#journalSearch').addEventListener('input', e => { journalSearch = e.target.value; renderJournal(); });
  $('#journalFav').addEventListener('change', e => { journalFavorites = e.target.checked; renderJournal(); });
  $('#addJournalBtn').addEventListener('click', () => openJournalEditor());
  wireJournalActions();
}

function renderWindowPage() {
  page.innerHTML = `
    <section class="hero card compact">
      <div class="eyebrow">PAISAJE</div>
      <h1>La ventana del ático</h1>
      <p class="lead">${esc(W.THEMES[state.theme].country)} · ${esc(W.THEMES[state.theme].mood)}</p>
      <canvas id="windowCanvas" class="window-canvas pixel"></canvas>
    </section>

    <section class="controls card">
      <div class="controls-row triple">
        <button class="ghost-btn time-btn ${state.windowTime==='day'?'is-active':''}" data-time="day">Día</button>
        <button class="ghost-btn time-btn ${state.windowTime==='dusk'?'is-active':''}" data-time="dusk">Tarde</button>
        <button class="ghost-btn time-btn ${state.windowTime==='night'?'is-active':''}" data-time="night">Noche</button>
      </div>
      <div class="controls-row compact-row">
        <label class="toggle"><input type="checkbox" id="toggleWeather" ${state.weather ? 'checked' : ''}><span>Efectos animados</span></label>
        <button class="primary-btn" id="savePostcard">Guardar postal PNG</button>
      </div>
    </section>
  `;
  const canvas = $('#windowCanvas'); canvas.width = 320; canvas.height = 300;
  W.drawWindow(canvas, state.theme, state.windowTime, state.weather);
  $$('.time-btn').forEach(btn => btn.addEventListener('click', () => { state.windowTime = btn.dataset.time; save(); renderWindowPage(); }));
  $('#toggleWeather').addEventListener('change', e => { state.weather = e.target.checked; save(); renderWindowPage(); });
  $('#savePostcard').addEventListener('click', () => downloadCanvas(canvas, `the-attic-${state.theme}-${state.windowTime}.png`));
}

function renderWorld() {
  page.innerHTML = `
    <section class="hero card compact">
      <div class="eyebrow">PERSONALIZA</div>
      <h1>Mi mundo</h1>
      <p class="lead">Elige la ambientación, tu compañero y los nombres de tu pequeño universo.</p>
    </section>

    <section class="card form-card">
      <label class="field"><span>Nombre del ático</span><input id="atticName" class="text-input" maxlength="40" value="${escAttr(state.atticName)}"></label>
      <label class="field"><span>Nombre de tu compañero</span><input id="companionName" class="text-input" maxlength="30" value="${escAttr(state.companionName)}"></label>
    </section>

    <section class="section-head slim"><div><div class="eyebrow">ESTÉTICAS</div><h2>Elige tu escenario</h2></div></section>
    <section class="theme-grid">
      ${Object.entries(W.THEMES).map(([key, t]) => `
        <button class="theme-card card ${state.theme===key?'selected':''}" data-theme="${key}">
          <canvas class="theme-preview pixel"></canvas>
          <strong>${esc(t.short)}</strong>
          <small>${esc(t.country)}</small>
        </button>
      `).join('')}
    </section>

    <section class="section-head slim"><div><div class="eyebrow">COMPAÑERO</div><h2>Elige mascota</h2></div></section>
    <section class="pet-grid">
      ${Object.entries(W.PETS).map(([key,p]) => `<button class="pet-pill ${state.pet===key?'selected':''}" data-pet="${key}">${esc(p.name)}</button>`).join('')}
    </section>

    <section class="card form-card">
      <div class="field-buttons">
        <button id="exportBtn" class="ghost-btn">Exportar copia</button>
        <label class="ghost-btn file-btn">Importar<input type="file" id="importFile" accept="application/json" hidden></label>
      </div>
      <div class="field-buttons">
        <button id="saveWorldBtn" class="primary-btn">Guardar cambios</button>
        <button id="resetBtn" class="danger-btn">Reiniciar</button>
      </div>
      ${!state.setup ? `<p class="onboarding-note">Cuando guardes por primera vez, este será tu mundo inicial.</p>` : ''}
    </section>
  `;

  $$('.theme-card').forEach(card => {
    const key = card.dataset.theme;
    const canvas = $('canvas', card); canvas.width = 160; canvas.height = 100; W.themePreview(canvas, key);
    card.addEventListener('click', () => { state.theme = key; state.windowTime = W.THEMES[key].time || 'night'; save(); renderWorld(); });
  });
  $$('.pet-pill').forEach(btn => btn.addEventListener('click', () => { state.pet = btn.dataset.pet; save(); renderWorld(); }));
  $('#saveWorldBtn').addEventListener('click', () => {
    state.atticName = clean($('#atticName').value, 40) || 'Mi ático';
    state.companionName = clean($('#companionName').value, 30) || 'Pixel';
    state.setup = true;
    save();
    toast('Tu mundo está listo.');
    go('home');
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('¿Seguro que quieres borrar The Attic por completo?')) return;
    state = freshState(); save(); roomSearch=''; journalSearch=''; roomFavorites=false; journalFavorites=false; go('world');
  });
  $('#exportBtn').addEventListener('click', exportData);
  $('#importFile').addEventListener('change', importData);
}

function itemCard(item) {
  return `
    <article class="entry card" data-id="${item.id}">
      <div class="entry-cover">${item.cover ? `<img src="${item.cover}" alt="Portada de ${escAttr(item.title)}">` : `<span>${ROOMS[item.type].icon}</span>`}</div>
      <div class="entry-body">
        <div class="entry-head">
          <strong>${esc(item.title)}</strong>
          <button class="mini-fav ${item.favorite ? 'active' : ''}" data-action="fav-item">♥</button>
        </div>
        <div class="entry-sub">${stars(item.rating)} · ${statusLabel(item.status)} · ${fmtDate(item.date)}</div>
        ${item.detail ? `<div class="entry-detail">${esc(item.detail)}</div>` : ''}
        ${item.review ? `<p>${esc(item.review)}</p>` : ''}
        <div class="entry-actions">
          <button class="link-btn" data-action="edit-item">Editar</button>
          <button class="link-btn danger" data-action="delete-item">Borrar</button>
        </div>
      </div>
    </article>
  `;
}
function journalCard(item) {
  return `
    <article class="entry card journal-entry" data-journal-id="${item.id}">
      <div class="entry-cover diary-cover"><span>✎</span></div>
      <div class="entry-body">
        <div class="entry-head">
          <strong>${esc(item.title)}</strong>
          <button class="mini-fav ${item.favorite ? 'active' : ''}" data-action="fav-journal">♥</button>
        </div>
        <div class="entry-sub">${esc(item.mood)} · ${fmtDate(item.date)}</div>
        <p>${esc(item.content).replace(/\n/g, '<br>')}</p>
        <div class="entry-actions">
          <button class="link-btn" data-action="edit-journal">Editar</button>
          <button class="link-btn danger" data-action="delete-journal">Borrar</button>
        </div>
      </div>
    </article>
  `;
}
function emptyState(text) { return `<div class="empty card"><div class="empty-icon">✦</div><p>${esc(text)}</p></div>`; }

function itemsOf(type) { return state.items.filter(x => x.type === type); }
function countsByRoom() { const o = {}; Object.keys(ROOMS).forEach(k => o[k] = itemsOf(k).length); return o; }
function filteredRoomItems() {
  let list = itemsOf(currentRoom).filter(x => !roomSearch || `${x.title} ${x.review} ${x.detail}`.toLowerCase().includes(roomSearch.toLowerCase()));
  if (roomFavorites) list = list.filter(x => x.favorite);
  if (roomSort === 'title') list.sort((a,b) => a.title.localeCompare(b.title, 'es'));
  else if (roomSort === 'rating') list.sort((a,b) => b.rating - a.rating || b.createdAt - a.createdAt);
  else list.sort((a,b) => b.createdAt - a.createdAt);
  return list;
}
function filteredJournal() {
  let list = state.journal.filter(x => !journalSearch || `${x.title} ${x.content}`.toLowerCase().includes(journalSearch.toLowerCase()));
  if (journalFavorites) list = list.filter(x => x.favorite);
  list.sort((a,b) => b.createdAt - a.createdAt);
  return list;
}
function statusLabel(v) { return ({ wishlist:'Pendiente', 'in-progress':'Ahora mismo', done:'Terminado / guardado' })[v] || 'Guardado'; }

function wireItemActions() {
  $$('.entry[data-id]').forEach(card => {
    const id = card.dataset.id;
    const item = state.items.find(x => x.id === id);
    if (!item) return;
    $$('[data-action]', card).forEach(btn => btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'edit-item') openItemEditor(item);
      if (action === 'delete-item') {
        if (confirm(`¿Borrar “${item.title}”?`)) { state.items = state.items.filter(x => x.id !== id); save(); renderRoomPage(); }
      }
      if (action === 'fav-item') { item.favorite = !item.favorite; save(); renderRoomPage(); }
    }));
  });
}
function wireJournalActions() {
  $$('.entry[data-journal-id]').forEach(card => {
    const id = card.dataset.journalId;
    const item = state.journal.find(x => x.id === id);
    if (!item) return;
    $$('[data-action]', card).forEach(btn => btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'edit-journal') openJournalEditor(item);
      if (action === 'delete-journal') {
        if (confirm(`¿Borrar la entrada “${item.title}”?`)) { state.journal = state.journal.filter(x => x.id !== id); save(); renderJournal(); }
      }
      if (action === 'fav-journal') { item.favorite = !item.favorite; save(); renderJournal(); }
    }));
  });
}

function openItemEditor(item = null) {
  const edit = !!item;
  const data = item ? { ...item } : { id: uid(), type: currentRoom, title:'', rating:0, review:'', favorite:false, detail:'', date: today(), status:'done', cover:'', createdAt: Date.now() };
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><strong>${edit ? 'Editar' : 'Añadir'} ${esc(ROOMS[data.type].name.slice(0,-1) || ROOMS[data.type].name)}</strong><button class="icon-btn close-modal">×</button></div>
      <div class="modal-body">
        <label class="field"><span>Título</span><input id="itemTitle" class="text-input" maxlength="160" value="${escAttr(data.title)}"></label>
        <label class="field"><span>Detalle breve</span><input id="itemDetail" class="text-input" maxlength="180" placeholder="Saga, edición, plataforma, autor..." value="${escAttr(data.detail)}"></label>
        <div class="field two-col">
          <label><span>Estado</span><select id="itemStatus" class="select-input"><option value="wishlist" ${data.status==='wishlist'?'selected':''}>Pendiente</option><option value="in-progress" ${data.status==='in-progress'?'selected':''}>Ahora mismo</option><option value="done" ${data.status==='done'?'selected':''}>Terminado / guardado</option></select></label>
          <label><span>Fecha</span><input id="itemDate" class="text-input" type="date" value="${escAttr(data.date || today())}"></label>
        </div>
        <label class="field"><span>Valoración</span><div id="starPicker" class="star-picker">${[1,2,3,4,5].map(n => `<button type="button" class="star-btn ${n<=data.rating?'on':''}" data-star="${n}">★</button>`).join('')}</div></label>
        <label class="field"><span>Opinión</span><textarea id="itemReview" class="text-area" rows="5" maxlength="4000">${esc(data.review)}</textarea></label>
        <label class="field file-field"><span>Portada / foto</span><input id="itemFile" type="file" accept="image/*"><small>La imagen se reducirá para que quepa en la app.</small></label>
        <label class="toggle"><input id="itemFavorite" type="checkbox" ${data.favorite ? 'checked' : ''}><span>Marcar como favorito</span></label>
      </div>
      <div class="modal-actions"><button class="ghost-btn close-modal">Cancelar</button><button id="saveItem" class="primary-btn">Guardar</button></div>
    </div>
  `;
  let rating = data.rating;
  let cover = data.cover;
  $$('.close-modal', overlay).forEach(btn => btn.addEventListener('click', closeOverlay));
  $$('.star-btn', overlay).forEach(btn => btn.addEventListener('click', () => {
    rating = Number(btn.dataset.star);
    $$('.star-btn', overlay).forEach(b => b.classList.toggle('on', Number(b.dataset.star) <= rating));
  }));
  $('#itemFile').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { cover = await fileToDataURL(file, 220, 220); toast('Imagen añadida.'); }
    catch { toast('No pude leer esa imagen.'); }
  });
  $('#saveItem').addEventListener('click', () => {
    const obj = sanitizeItem({
      ...data,
      title: $('#itemTitle').value,
      detail: $('#itemDetail').value,
      status: $('#itemStatus').value,
      date: $('#itemDate').value,
      rating,
      review: $('#itemReview').value,
      favorite: $('#itemFavorite').checked,
      cover,
      createdAt: data.createdAt
    });
    if (!obj) { toast('Ponle al menos un título.'); return; }
    if (edit) state.items = state.items.map(x => x.id === obj.id ? obj : x);
    else state.items.unshift(obj);
    save(); closeOverlay(); renderRoomPage(); toast(edit ? 'Tesoro actualizado.' : 'Tesoro guardado.');
  });
}

function openJournalEditor(item = null) {
  const edit = !!item;
  const data = item ? { ...item } : { id: uid(), title:'', content:'', mood:JOURNAL_MOODS[0], favorite:false, date: today(), createdAt: Date.now() };
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><strong>${edit ? 'Editar' : 'Nueva'} entrada</strong><button class="icon-btn close-modal">×</button></div>
      <div class="modal-body">
        <label class="field"><span>Título</span><input id="journalTitle" class="text-input" maxlength="120" value="${escAttr(data.title)}"></label>
        <div class="field two-col">
          <label><span>Fecha</span><input id="journalDate" class="text-input" type="date" value="${escAttr(data.date || today())}"></label>
          <label><span>Estado de ánimo</span><select id="journalMood" class="select-input">${JOURNAL_MOODS.map(m => `<option ${data.mood===m?'selected':''}>${esc(m)}</option>`).join('')}</select></label>
        </div>
        <label class="field"><span>Contenido</span><textarea id="journalContent" class="text-area" rows="8" maxlength="5000">${esc(data.content)}</textarea></label>
        <label class="toggle"><input id="journalFavorite" type="checkbox" ${data.favorite?'checked':''}><span>Marcar como favorita</span></label>
      </div>
      <div class="modal-actions"><button class="ghost-btn close-modal">Cancelar</button><button id="saveJournal" class="primary-btn">Guardar</button></div>
    </div>
  `;
  $$('.close-modal', overlay).forEach(btn => btn.addEventListener('click', closeOverlay));
  $('#saveJournal').addEventListener('click', () => {
    const obj = sanitizeJournal({
      ...data,
      title: $('#journalTitle').value,
      content: $('#journalContent').value,
      mood: $('#journalMood').value,
      date: $('#journalDate').value,
      favorite: $('#journalFavorite').checked,
      createdAt: data.createdAt
    });
    if (!obj) { toast('Escribe algo antes de guardar.'); return; }
    if (edit) state.journal = state.journal.map(x => x.id === obj.id ? obj : x);
    else state.journal.unshift(obj);
    save(); closeOverlay(); renderJournal(); toast(edit ? 'Página actualizada.' : 'Página guardada.');
  });
}

function closeOverlay() { overlay.classList.add('hidden'); overlay.innerHTML = ''; }

async function fileToDataURL(file, maxW, maxH) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
function downloadCanvas(canvas, filename) {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = filename;
  a.click();
}
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'the-attic-backup.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
async function importData(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const raw = JSON.parse(text);
    state = sanitize(raw); save(); toast('Copia importada.'); render();
  } catch {
    toast('Ese archivo no parece una copia válida.');
  }
  e.target.value = '';
}

function esc(v = '') { return String(v).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
function escAttr(v = '') { return esc(v).replace(/`/g, '&#96;'); }

function bindGlobal() {
  $('#brandHome').addEventListener('click', () => go(state.setup ? 'home' : 'world'));
  $('#quickAdd').addEventListener('click', () => {
    if (!state.setup) return go('world');
    if (view === 'journal') openJournalEditor();
    else if (view === 'room') openItemEditor();
    else { currentRoom = 'movies'; go('room'); setTimeout(() => openItemEditor(), 60); }
  });
  $$('.tab').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.view)));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
}

save();
bindGlobal();
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
})();
