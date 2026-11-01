(() => {
'use strict';

const THEMES = {
  manhattan: {
    name: 'Ático melancólico en Manhattan',
    short: 'Manhattan',
    country: 'Nueva York, EE. UU.',
    accent: '#7aa2ff',
    wall: '#33405a',
    wall2: '#41506c',
    floor: '#775c48',
    line: '#242a3f',
    window: '#15243c',
    rug: '#5a718d',
    rug2: '#7e96b1',
    trim: '#ccb08a',
    mood: 'Lluvia, neón suave y skyline azul.',
    time: 'night'
  },
  kyoto: {
    name: 'Ático folk en Japón',
    short: 'Kyoto',
    country: 'Kyoto, Japón',
    accent: '#d66f93',
    wall: '#d3c2a8',
    wall2: '#c6b394',
    floor: '#846348',
    line: '#5a4335',
    window: '#f2d5da',
    rug: '#8e6e5f',
    rug2: '#b78f73',
    trim: '#f4e5ca',
    mood: 'Madera antigua, tatami y flores de cerezo.',
    time: 'day'
  },
  igloo: {
    name: 'Iglú ártico con pingüino',
    short: 'Iglú',
    country: 'Ártico fantástico',
    accent: '#79d0e8',
    wall: '#c7edf5',
    wall2: '#d9f8fb',
    floor: '#e7f9fb',
    line: '#7eb4c5',
    window: '#91d8e9',
    rug: '#8fcde0',
    rug2: '#b8e7f0',
    trim: '#fff5ea',
    mood: 'Auroras, hielo suave y mantas cálidas.',
    time: 'night'
  },
  cottage: {
    name: 'Cabaña entre pinos',
    short: 'Cabaña',
    country: 'Bosque del norte',
    accent: '#7fc48d',
    wall: '#556149',
    wall2: '#667557',
    floor: '#7c6246',
    line: '#303a2b',
    window: '#304c3d',
    rug: '#607d5d',
    rug2: '#7d9b74',
    trim: '#dbc49a',
    mood: 'Lámparas cálidas, madera y un bosque infinito.',
    time: 'dusk'
  },
  observatory: {
    name: 'Observatorio nocturno',
    short: 'Observatorio',
    country: 'Cima estelar',
    accent: '#aa8fff',
    wall: '#322a4d',
    wall2: '#43365f',
    floor: '#5e4d68',
    line: '#181126',
    window: '#1d1430',
    rug: '#635885',
    rug2: '#8d7ab8',
    trim: '#e4d1a3',
    mood: 'Cúpula astral, telescopio y cielo profundo.',
    time: 'night'
  }
};

const PETS = {
  cat: { name: 'Gato' },
  dog: { name: 'Perro' },
  penguin: { name: 'Pingüino' },
  fox: { name: 'Zorro' },
  rabbit: { name: 'Conejo' },
  owl: { name: 'Búho' }
};

const ROOM_COLORS = {
  movies: '#d07f71',
  series: '#90a9c8',
  books: '#d1b178',
  games: '#7ec9c1',
  comics: '#df9d64',
  manga: '#d98bb5',
  hobbies: '#99bf87',
  memories: '#c6a0d8',
  journal: '#86a6db'
};

const ROOM_LABELS = {
  movies: 'Cine',
  series: 'Series',
  books: 'Biblioteca',
  games: 'Juegos',
  comics: 'Cómics',
  manga: 'Manga',
  hobbies: 'Hobbies',
  memories: 'Recuerdos',
  journal: 'Diario'
};

function px(ctx) {
  ctx.imageSmoothingEnabled = false;
}
function R(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function P(ctx, pts, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fill(); }
function C(ctx, x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function L(ctx, x1, y1, x2, y2, c, w = 1) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function star(ctx, x, y, c, s = 2) { R(ctx, x, y, s, s, c); R(ctx, x - 1, y + 1, s + 2, 1, c); R(ctx, x + 1, y - 1, 1, s + 2, c); }
function scale(ctx, canvas, W = 320, H = 240) {
  const sx = canvas.width / W;
  const sy = canvas.height / H;
  ctx.setTransform(sx, 0, 0, sy, 0, 0);
  px(ctx);
}

function landscape(ctx, themeKey, time = 'night', animate = false, W = 320, H = 180) {
  const t = THEMES[themeKey] || THEMES.manhattan;
  const night = time === 'night';
  const dusk = time === 'dusk';
  R(ctx, 0, 0, W, H, night ? '#101726' : dusk ? '#7a5470' : '#8cc6f6');
  if (themeKey === 'observatory') R(ctx, 0, 0, W, H, night ? '#120d1e' : '#34284f');
  if (themeKey === 'igloo') R(ctx, 0, 0, W, H, night ? '#125070' : '#7fdcf1');
  if (themeKey === 'cottage') R(ctx, 0, 0, W, H, dusk ? '#6a7b58' : night ? '#203526' : '#86b18c');
  if (themeKey === 'kyoto') R(ctx, 0, 0, W, H, night ? '#33496e' : '#c9d8ff');

  if (night || themeKey === 'observatory') {
    for (let i = 0; i < 36; i++) star(ctx, (i * 41) % W, 10 + (i * 17) % 65, i % 4 === 0 ? '#fff3a8' : '#ffffff', i % 5 === 0 ? 2 : 1);
  }

  if (themeKey === 'manhattan') {
    R(ctx, 0, 132, W, 48, '#19283f');
    const xs = [8, 36, 64, 92, 128, 164, 198, 234, 266, 290];
    const hs = [55, 70, 62, 84, 72, 95, 68, 88, 76, 63];
    xs.forEach((x, i) => {
      R(ctx, x, 132 - hs[i], 20 + (i % 3) * 6, hs[i], '#22334d');
      for (let wy = 0; wy < hs[i] - 10; wy += 9) {
        for (let wx = 3; wx < 16 + (i % 3) * 6; wx += 7) {
          if ((wx + wy + i) % 3) R(ctx, x + wx, 132 - hs[i] + 4 + wy, 3, 4, i % 2 ? '#f8d899' : '#f4f1d0');
        }
      }
    });
    R(ctx, 0, 132, W, 4, '#9db6d5');
    if (animate) for (let i = 0; i < 70; i++) R(ctx, (i * 29) % W, (i * 19) % H, 1, 5, '#d6e7ff88');
  }

  if (themeKey === 'kyoto') {
    R(ctx, 0, 125, W, 55, '#89b98d');
    R(ctx, 0, 135, W, 45, '#7aa57a');
    for (let i = 0; i < 5; i++) {
      const x = 18 + i * 62;
      R(ctx, x, 86, 6, 50, '#5e4936');
      C(ctx, x + 3, 74, 18, '#d48da9');
      C(ctx, x - 7, 81, 14, '#f0b2c5');
      C(ctx, x + 14, 82, 14, '#efb5c8');
    }
    R(ctx, 0, 144, W, 2, '#f1dcc3');
    for (let i = 0; i < 18; i++) if (animate) R(ctx, (i * 31) % W, 42 + (i * 14) % 110, 3, 2, i % 2 ? '#f4c5d0' : '#f7dbe0');
  }

  if (themeKey === 'igloo') {
    R(ctx, 0, 128, W, 52, '#d4f5fb');
    P(ctx, [[22, 136], [70, 88], [120, 136]], '#eafcff');
    P(ctx, [[90, 136], [150, 72], [220, 136]], '#f7ffff');
    P(ctx, [[188, 136], [260, 90], [320, 136]], '#dff7fc');
    C(ctx, 238, 40, 16, '#f4fbff');
    R(ctx, 52, 105, 56, 32, '#beeef7');
    C(ctx, 80, 105, 26, '#d9fbff');
    R(ctx, 74, 116, 14, 9, '#8ed4e3');
    if (animate) for (let i = 0; i < 40; i++) R(ctx, (i * 27) % W, (i * 17) % H, 2, 2, '#ffffff');
    if (night) {
      P(ctx, [[20, 35], [90, 18], [160, 38], [220, 16], [300, 32], [320, 42], [0, 42]], '#79dcb8');
      P(ctx, [[10, 45], [85, 30], [175, 50], [245, 24], [320, 40], [320, 58], [0, 58]], '#b08fff88');
    }
  }

  if (themeKey === 'cottage') {
    R(ctx, 0, 125, W, 55, '#466847');
    for (let i = 0; i < 8; i++) {
      const x = 15 + i * 38;
      P(ctx, [[x, 130], [x + 18, 90], [x + 36, 130]], i % 2 ? '#7eb57d' : '#6ca06e');
      R(ctx, x + 15, 126, 6, 18, '#54402d');
    }
    if (dusk) C(ctx, 255, 38, 12, '#ffd7a3');
    if (animate) for (let i = 0; i < 18; i++) R(ctx, (i * 23) % W, 60 + (i * 13) % 68, 2, 4, '#e8f8c4');
  }

  if (themeKey === 'observatory') {
    R(ctx, 0, 136, W, 44, '#1c1528');
    P(ctx, [[0, 135], [50, 120], [110, 138], [160, 118], [230, 136], [280, 126], [320, 136], [320, 180], [0, 180]], '#281e39');
    R(ctx, 120, 95, 86, 44, '#625979');
    C(ctx, 163, 95, 43, '#8278a0');
    R(ctx, 155, 75, 15, 22, '#c1b6d5');
    R(ctx, 150, 118, 25, 14, '#22182f');
  }
}

function drawPet(ctx, pet, x, y) {
  if (pet === 'cat') {
    R(ctx, x + 8, y + 8, 24, 16, '#7f8fa3');
    P(ctx, [[x + 10, y + 8], [x + 16, y], [x + 18, y + 8]], '#7f8fa3');
    P(ctx, [[x + 24, y + 8], [x + 30, y], [x + 32, y + 8]], '#7f8fa3');
    R(ctx, x + 13, y + 14, 3, 3, '#111'); R(ctx, x + 24, y + 14, 3, 3, '#111'); R(ctx, x + 19, y + 19, 4, 2, '#d69a9f');
    R(ctx, x + 30, y + 18, 9, 3, '#7f8fa3');
  } else if (pet === 'dog') {
    R(ctx, x + 8, y + 9, 26, 15, '#b99166'); R(ctx, x + 10, y + 3, 22, 14, '#cfaa7f');
    R(ctx, x + 6, y + 8, 6, 13, '#875f4f'); R(ctx, x + 31, y + 8, 6, 13, '#875f4f');
    R(ctx, x + 14, y + 14, 3, 3, '#111'); R(ctx, x + 25, y + 14, 3, 3, '#111'); R(ctx, x + 18, y + 19, 6, 3, '#ead7bd');
  } else if (pet === 'penguin') {
    R(ctx, x + 12, y + 3, 18, 30, '#263247'); R(ctx, x + 15, y + 8, 12, 19, '#edf5f3');
    R(ctx, x + 16, y + 13, 3, 3, '#111'); R(ctx, x + 24, y + 13, 3, 3, '#111'); R(ctx, x + 19, y + 18, 7, 3, '#e6a36e');
    R(ctx, x + 11, y + 31, 8, 3, '#e9b07f'); R(ctx, x + 23, y + 31, 8, 3, '#e9b07f');
  } else if (pet === 'fox') {
    R(ctx, x + 8, y + 8, 26, 16, '#c46c4d'); P(ctx, [[x + 11, y + 8], [x + 17, y], [x + 18, y + 8]], '#c46c4d'); P(ctx, [[x + 24, y + 8], [x + 30, y], [x + 31, y + 8]], '#c46c4d');
    R(ctx, x + 12, y + 15, 3, 3, '#111'); R(ctx, x + 25, y + 15, 3, 3, '#111'); R(ctx, x + 17, y + 20, 8, 3, '#f0dfc0'); R(ctx, x + 31, y + 18, 10, 5, '#c46c4d'); R(ctx, x + 38, y + 19, 3, 4, '#f0dfc0');
  } else if (pet === 'rabbit') {
    R(ctx, x + 12, y, 6, 18, '#ebe0d2'); R(ctx, x + 24, y, 6, 18, '#ebe0d2');
    R(ctx, x + 10, y + 12, 24, 16, '#f2e8da'); R(ctx, x + 14, y + 18, 3, 3, '#111'); R(ctx, x + 25, y + 18, 3, 3, '#111'); R(ctx, x + 19, y + 23, 4, 2, '#d79aa6');
  } else {
    R(ctx, x + 10, y + 5, 22, 20, '#4a4658'); R(ctx, x + 14, y, 6, 11, '#4a4658'); R(ctx, x + 22, y, 6, 11, '#4a4658');
    R(ctx, x + 16, y + 12, 3, 3, '#f6ebd1'); R(ctx, x + 23, y + 12, 3, 3, '#f6ebd1'); R(ctx, x + 17, y + 13, 1, 1, '#111'); R(ctx, x + 24, y + 13, 1, 1, '#111'); R(ctx, x + 18, y + 18, 8, 3, '#d7aa76');
  }
}

function drawInteriorBase(ctx, themeKey) {
  const t = THEMES[themeKey] || THEMES.manhattan;
  R(ctx, 0, 0, 320, 240, t.wall);
  R(ctx, 0, 0, 320, 12, t.wall2);
  R(ctx, 0, 160, 320, 80, t.floor);
  R(ctx, 0, 156, 320, 4, t.line);
  for (let x = 0; x < 320; x += 40) R(ctx, x, 160, 2, 80, t.line);
  for (let y = 175; y < 240; y += 21) R(ctx, 0, y, 320, 1, t.line);

  if (themeKey === 'manhattan') {
    for (let y = 18; y < 156; y += 18) L(ctx, 0, y, 320, y, '#4d5b75');
    R(ctx, 18, 18, 92, 70, '#273652'); R(ctx, 18, 18, 92, 4, '#90a6c4');
    landscape(ctx, themeKey, 'night', true, 88, 66); // decorative offscale not exact but okay? overwritten maybe.
  }
}

function drawWindowFrame(ctx, themeKey, time, x = 112, y = 26, w = 96, h = 72) {
  const t = THEMES[themeKey] || THEMES.manhattan;
  R(ctx, x - 6, y - 6, w + 12, h + 12, t.line);
  R(ctx, x - 2, y - 2, w + 4, h + 4, t.trim);
  // render landscape into clipped miniature canvas style
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const octx = off.getContext('2d');
  px(octx); landscape(octx, themeKey, time, true, w, h);
  ctx.drawImage(off, x, y, w, h);
  R(ctx, x + Math.floor(w / 2) - 2, y, 4, h, t.line);
  R(ctx, x, y + Math.floor(h / 2) - 2, w, 4, t.line);
}

function drawHub(canvas, themeKey, pet, counts = {}, time = 'night') {
  const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); scale(ctx, canvas, 320, 360);
  const t = THEMES[themeKey] || THEMES.manhattan;
  R(ctx, 0, 0, 320, 360, t.wall);
  R(ctx, 0, 0, 320, 170, t.wall2);
  R(ctx, 0, 170, 320, 190, t.floor);
  R(ctx, 0, 166, 320, 4, t.line);
  for (let y = 15; y < 164; y += themeKey === 'igloo' ? 20 : 18) L(ctx, 0, y, 320, y, themeKey === 'igloo' ? '#b7dde5' : themeKey === 'kyoto' ? '#c8b090' : themeKey === 'observatory' ? '#544671' : '#4f5c78');
  if (themeKey === 'kyoto') {
    for (let x = 18; x < 320; x += 74) R(ctx, x, 12, 5, 150, '#735844');
  }
  if (themeKey === 'cottage') {
    for (let x = 8; x < 320; x += 44) R(ctx, x, 0, 5, 166, '#4c4030');
  }
  if (themeKey === 'observatory') {
    for (let i = 0; i < 25; i++) star(ctx, (i * 37) % 320, 16 + (i * 13) % 120, i % 3 ? '#b6a5ff' : '#ffeb9d', 1);
  }
  drawWindowFrame(ctx, themeKey, time, 116, 20, 92, 76);

  // Big attic corners
  // left library tower
  R(ctx, 18, 36, 72, 146, '#44372e'); R(ctx, 22, 40, 64, 138, '#6c5547');
  for (let y = 70; y < 172; y += 30) R(ctx, 22, y, 64, 3, '#44372e');
  for (let i = 0; i < 22; i++) R(ctx, 28 + (i % 7) * 7, 48 + Math.floor(i / 7) * 31, 5, 20, ['#b67c6e','#d0b57c','#85a0b4','#93af7d','#c89db4','#9a7e6d','#5f788a'][i % 7]);

  // right cinema stack
  R(ctx, 230, 46, 68, 98, '#3b3042'); R(ctx, 236, 52, 56, 40, '#111923'); R(ctx, 240, 56, 48, 32, '#3a5975');
  R(ctx, 246, 60, 16, 12, '#c1c6b2'); R(ctx, 263, 60, 18, 20, '#78607f'); R(ctx, 234, 96, 58, 6, '#261d2a'); R(ctx, 246, 105, 34, 4, '#7f95a6');
  R(ctx, 245, 117, 40, 18, '#594c61'); R(ctx, 252, 123, 8, 6, '#d6b38f'); R(ctx, 265, 123, 14, 8, '#8aa7be');

  // center rug and hobby desk
  R(ctx, 72, 255, 176, 52, t.line); R(ctx, 76, 259, 168, 44, t.rug); R(ctx, 86, 268, 148, 25, t.rug2);
  R(ctx, 25, 188, 112, 10, '#46392f'); R(ctx, 30, 181, 104, 7, '#7f654f'); R(ctx, 40, 198, 9, 44, '#46392f'); R(ctx, 113, 198, 9, 44, '#46392f');
  R(ctx, 46, 174, 24, 11, '#94b6a0'); R(ctx, 74, 172, 8, 14, '#d2b49b'); R(ctx, 78, 168, 3, 5, '#6aa6a7');
  for (let i=0;i<4;i++) { R(ctx, 84+i*10, 175, 7, 9, ['#89a79c','#d29888','#d9c089','#9a91cb'][i]); R(ctx, 85+i*10, 172, 5, 3, '#efe2cd'); }

  // memory corkboard
  R(ctx, 112, 116, 94, 40, '#473a33'); R(ctx, 116, 120, 86, 32, '#bc9d76');
  R(ctx, 124, 126, 18, 12, '#f4efe8'); R(ctx, 148, 124, 12, 16, '#e4d4b2'); R(ctx, 165, 128, 17, 11, '#f0cad7'); R(ctx, 186, 123, 11, 16, '#d3e2ec');

  // gamer corner
  R(ctx, 208, 180, 90, 50, '#2d3045'); R(ctx, 214, 186, 36, 27, '#94a8bf'); R(ctx, 218, 190, 28, 19, '#24364a');
  R(ctx, 260, 192, 26, 13, '#cbc0b4'); R(ctx, 264, 206, 18, 5, '#4f5668'); R(ctx, 257, 216, 34, 8, '#6b7384');
  R(ctx, 218, 222, 13, 8, '#7a8d7c'); R(ctx, 235, 222, 13, 8, '#816a8f'); R(ctx, 252, 222, 13, 8, '#b58a63');

  // pet cushion
  R(ctx, 134, 298, 56, 25, '#4c4057'); R(ctx, 138, 302, 48, 17, t.rug2); drawPet(ctx, pet, 144, 278);

  // category markers/plaques
  const plaques = [
    ['books', 18, 184], ['hobbies', 32, 246], ['memories', 124, 159], ['movies', 244, 148], ['games', 248, 232], ['journal', 142, 220], ['series', 212, 146], ['comics', 20, 228], ['manga', 208, 146]
  ];
  plaques.forEach(([k, x, y]) => {
    R(ctx, x, y, 34, 11, ROOM_COLORS[k]);
    R(ctx, x + 1, y + 1, 32, 9, '#11111122');
  });
}

function drawRoom(canvas, themeKey, roomKey, pet, time = 'night') {
  const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); scale(ctx, canvas, 320, 220);
  const t = THEMES[themeKey] || THEMES.manhattan;
  R(ctx, 0, 0, 320, 220, t.wall);
  R(ctx, 0, 0, 320, 150, t.wall2);
  R(ctx, 0, 150, 320, 70, t.floor);
  R(ctx, 0, 146, 320, 4, t.line);
  if (themeKey === 'kyoto') for (let x = 0; x < 320; x += 64) { R(ctx, x, 0, 4, 146, '#7b5f46'); R(ctx, x, 44, 64, 2, '#e6d3b5'); }
  if (themeKey === 'cottage') for (let x = 0; x < 320; x += 32) R(ctx, x, 0, 2, 146, '#50412f');
  if (themeKey === 'observatory') for (let i = 0; i < 18; i++) star(ctx, (i * 47) % 320, 18 + (i * 19) % 65, i % 2 ? '#c9bcff' : '#fff1af', 1);
  drawWindowFrame(ctx, themeKey, time, 210, 24, 82, 62);
  R(ctx, 44, 170, 234, 28, '#00000020');

  switch (roomKey) {
    case 'books':
      R(ctx, 18, 18, 100, 128, '#4b3b2e'); R(ctx, 23, 23, 90, 118, '#705845');
      for (let y = 52; y < 138; y += 28) R(ctx, 23, y, 90, 3, '#4b3b2e');
      for (let i = 0; i < 34; i++) R(ctx, 30 + (i % 10) * 7, 30 + Math.floor(i / 10) * 30, 5, 18, ['#c9856f','#7ea2bd','#d4b378','#9ab783','#d1a1be','#936f5a'][i % 6]);
      R(ctx, 126, 118, 58, 24, '#a07d5b'); R(ctx, 131, 108, 48, 12, '#d6c6ac'); R(ctx, 136, 143, 38, 5, '#5b4635');
      break;
    case 'movies':
      R(ctx, 26, 28, 124, 76, '#2d2437'); R(ctx, 34, 36, 108, 60, '#ecdfd0'); R(ctx, 44, 46, 88, 40, '#819cb8');
      R(ctx, 168, 38, 42, 82, '#57464f'); R(ctx, 174, 44, 30, 67, '#201722'); R(ctx, 184, 117, 10, 28, '#57464f');
      R(ctx, 46, 125, 108, 20, '#755b68'); R(ctx, 55, 118, 90, 14, '#b8a0a4'); R(ctx, 70, 115, 15, 5, '#d8c189'); R(ctx, 103, 115, 21, 5, '#9e8298');
      break;
    case 'series':
      R(ctx, 28, 44, 96, 74, '#352a37'); R(ctx, 34, 50, 84, 58, '#9bacbf'); R(ctx, 40, 56, 72, 46, '#394d62');
      R(ctx, 150, 102, 52, 28, '#8b6a57'); R(ctx, 156, 92, 40, 12, '#e1c8a0'); R(ctx, 214, 56, 30, 50, '#4b5967'); R(ctx, 248, 56, 30, 50, '#4b5967');
      R(ctx, 204, 111, 84, 24, '#7f667a'); R(ctx, 212, 103, 68, 12, '#c6afc5');
      break;
    case 'games':
      R(ctx, 40, 48, 76, 56, '#2e2b3f'); R(ctx, 45, 53, 66, 46, '#8ea3ba'); R(ctx, 51, 59, 54, 34, '#203545');
      R(ctx, 135, 50, 46, 75, '#47344d'); R(ctx, 141, 58, 34, 55, '#6fc1c0'); R(ctx, 145, 62, 26, 20, '#264a53');
      R(ctx, 194, 118, 74, 14, '#d4c6bb'); R(ctx, 202, 132, 58, 8, '#5d6777'); R(ctx, 207, 121, 10, 5, '#f0cca5');
      R(ctx, 196, 98, 28, 16, '#7b8f7e'); R(ctx, 230, 98, 28, 16, '#9875aa');
      break;
    case 'comics':
      R(ctx, 28, 28, 80, 105, '#54433a'); R(ctx, 34, 34, 68, 92, '#cba77b');
      for (let i = 0; i < 8; i++) { R(ctx, 40 + (i % 4) * 15, 42 + Math.floor(i / 4) * 34, 12, 28, ['#d26f5c','#f2b36d','#78a4e0','#92b685','#d985b1','#87cad0','#cfa776','#b592d6'][i]); }
      R(ctx, 132, 52, 58, 78, '#f0e6d8'); R(ctx, 142, 62, 38, 8, '#e58c58'); R(ctx, 142, 76, 38, 8, '#6fa2de'); R(ctx, 142, 90, 23, 23, '#d5d1c2');
      break;
    case 'manga':
      R(ctx, 22, 106, 110, 20, '#725848'); R(ctx, 30, 91, 95, 18, '#f1e6d2'); R(ctx, 36, 72, 24, 19, '#d6c2ad');
      R(ctx, 170, 32, 60, 102, '#5e4a3f'); R(ctx, 176, 38, 48, 92, '#e8d9ca');
      for (let i = 0; i < 12; i++) R(ctx, 183 + (i % 4) * 9, 47 + Math.floor(i / 4) * 24, 6, 18, ['#f1adc8','#a5c3ec','#d8b37a','#8eb892'][i % 4]);
      R(ctx, 54, 34, 74, 58, '#f6d9e2'); R(ctx, 64, 44, 54, 38, '#cf7ca4');
      break;
    case 'hobbies':
      R(ctx, 22, 98, 118, 10, '#4b3b2f'); R(ctx, 28, 90, 106, 8, '#8b715b'); R(ctx, 36, 108, 8, 45, '#4b3b2f'); R(ctx, 118, 108, 8, 45, '#4b3b2f');
      R(ctx, 46, 72, 30, 18, '#89a69a'); R(ctx, 54, 66, 14, 8, '#dbc6ad'); R(ctx, 58, 58, 5, 8, '#7cb1a9');
      for (let i = 0; i < 5; i++) { R(ctx, 82 + i * 10, 76, 7, 14, ['#89a69a','#d08878','#d7bd83','#88a0cc','#9dbb88'][i]); R(ctx, 83 + i * 10, 71, 5, 5, '#ede3d1'); }
      R(ctx, 178, 42, 76, 96, '#4b3c33'); R(ctx, 183, 47, 66, 86, '#866b56'); R(ctx, 192, 57, 24, 24, '#9cb7ab'); R(ctx, 221, 58, 19, 17, '#caa690');
      break;
    case 'memories':
      R(ctx, 34, 30, 122, 88, '#483932'); R(ctx, 40, 36, 110, 76, '#b79771');
      const scraps = [[52,48,'#f2ebe2'],[80,44,'#dfc6a9'],[104,52,'#f0bfd0'],[127,44,'#d4e2f1'],[56,74,'#ede4d5'],[84,78,'#c2d6bb'],[111,80,'#f7d398']];
      scraps.forEach(([x,y,c])=>R(ctx,x,y,18,13,c));
      R(ctx, 176, 116, 68, 18, '#9a7b63'); R(ctx, 182, 102, 56, 14, '#d7c9b5'); R(ctx, 188, 93, 19, 10, '#eec7cf');
      break;
    case 'journal':
      R(ctx, 30, 106, 140, 12, '#4b3b30'); R(ctx, 37, 96, 126, 10, '#856852'); R(ctx, 49, 118, 8, 35, '#4b3b30'); R(ctx, 143, 118, 8, 35, '#4b3b30');
      R(ctx, 58, 66, 54, 34, '#efe4cf'); R(ctx, 63, 71, 44, 24, '#fbf5ea'); R(ctx, 69, 77, 30, 2, '#aec0d8'); R(ctx, 69, 83, 30, 2, '#aec0d8'); R(ctx, 69, 89, 25, 2, '#aec0d8');
      R(ctx, 121, 71, 10, 32, '#6f4f61'); R(ctx, 123, 63, 6, 10, '#d7c8a2'); R(ctx, 136, 83, 7, 16, '#d4b28b');
      break;
    default:
      break;
  }

  R(ctx, 42, 178, 180, 22, '#00000018');
  drawPet(ctx, pet, 248, 156);

  // plaque label area
  R(ctx, 12, 12, 88, 16, ROOM_COLORS[roomKey] || '#999');
  R(ctx, 14, 14, 84, 12, '#00000025');
}

function drawWindow(canvas, themeKey, time = 'night', weather = true) {
  const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); scale(ctx, canvas, 320, 300);
  const t = THEMES[themeKey] || THEMES.manhattan;
  R(ctx, 0, 0, 320, 300, t.wall2);
  R(ctx, 20, 20, 280, 260, t.line);
  R(ctx, 32, 32, 256, 236, t.trim);
  const off = document.createElement('canvas'); off.width = 248; off.height = 228; const octx = off.getContext('2d'); px(octx); landscape(octx, themeKey, time, weather, 248, 228);
  ctx.drawImage(off, 36, 36, 248, 228);
  R(ctx, 156, 36, 6, 228, t.line); R(ctx, 36, 148, 248, 6, t.line);
  // sill and details
  R(ctx, 28, 268, 264, 10, t.line); R(ctx, 36, 272, 248, 10, t.floor);
  if (themeKey === 'manhattan') { R(ctx, 46, 246, 12, 14, '#d7c0ad'); R(ctx, 50, 226, 4, 22, '#6ea28a'); R(ctx, 46, 230, 12, 9, '#7eb095'); }
  if (themeKey === 'kyoto') { R(ctx, 58, 238, 14, 22, '#cab191'); R(ctx, 54, 222, 21, 14, '#dfa6bc'); }
  if (themeKey === 'igloo') { drawPet(ctx, 'penguin', 238, 236); }
  if (themeKey === 'observatory') { R(ctx, 50, 242, 16, 18, '#6b5c7f'); star(ctx, 58, 250, '#fff1b5', 2); }
}

function themePreview(canvas, themeKey) {
  const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); scale(ctx, canvas, 160, 100);
  landscape(ctx, themeKey, THEMES[themeKey]?.time || 'night', true, 160, 100);
  R(ctx, 6, 68, 148, 22, '#00000055');
}

function roomPreview(canvas, themeKey, roomKey) {
  drawRoom(canvas, themeKey, roomKey, 'cat', THEMES[themeKey]?.time || 'night');
}

window.PixelWorld = { THEMES, PETS, ROOM_COLORS, ROOM_LABELS, drawHub, drawRoom, drawWindow, themePreview, roomPreview };
})();
