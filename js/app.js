// ============================================================
//  APP.JS — New York Trip Planner | Rafa & Noemi 🗽
//  Toda la lógica: navegación, itinerario, checklist, notas
// ============================================================

// ─── STATE ────────────────────────────────────────────────
let currentView    = 'home';
let currentDayId   = 1;
let checklistState = {};
let notesState     = {};
let personalItems  = [];
let personalFilesDbPromise = null;
let authState = {
  ready: false,
  session: null,
  user: null
};

const PERSONAL_ITEM_KEY = 'ny_personal_items';
const PERSONAL_KIND_META = {
  documento: { icon: '📄', label: 'Documento' },
  pasaporte: { icon: '🛂', label: 'Pasaporte' },
  seguro:    { icon: '🛡️', label: 'Seguro' },
  hotel:     { icon: '🏨', label: 'Hotel' },
  vuelo:     { icon: '✈️', label: 'Vuelo' },
  reserva:   { icon: '🎟️', label: 'Reserva' },
  otro:      { icon: '✨', label: 'Otro' }
};

// ─── INIT ─────────────────────────────────────────────────
const DAY_THEMES = {
  travel: {
    label: 'Sky arrival',
    mood: 'Azules de terminal, cristal y cielo de llegada.',
    vars: {
      '--bg': '#eef4fb',
      '--bg2': '#f6f9fd',
      '--bg3': '#e6eef8',
      '--card': '#ffffff',
      '--card2': '#f2f7fd',
      '--border': '#d7e2f0',
      '--border2': '#e7eef7',
      '--pink': '#547db2',
      '--pink-light': '#86a7d0',
      '--pink-dim': 'rgba(84,125,178,0.10)',
      '--rose': '#2f5f99',
      '--gold': '#c58c47',
      '--gold-light': '#e0ab6d',
      '--gold-dim': 'rgba(197,140,71,0.12)',
      '--lavender': '#7f96c9',
      '--lav-dim': 'rgba(127,150,201,0.12)',
      '--teal': '#4e90a0',
      '--green': '#4d9a7e',
      '--text': '#1e3552',
      '--text2': '#5b7390',
      '--text3': '#8ca0b8',
      '--shadow': '0 10px 30px rgba(70,108,153,0.14)',
      '--shadow-sm': '0 4px 16px rgba(70,108,153,0.09)',
      '--header-bg': 'rgba(238,244,251,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.95)',
      '--nav-shadow': '0 -8px 28px rgba(70,108,153,0.12)',
      '--hero-grad-1': '#e7f0fb',
      '--hero-grad-2': '#f8fbff',
      '--hero-grad-3': '#fbeedc',
      '--next-card-grad-1': '#edf4ff',
      '--next-card-grad-2': '#eef2ff',
      '--day-selector-bg': 'rgba(238,244,251,0.95)',
      '--banner-special-1': '#edf5ff',
      '--banner-special-2': '#f2f6ff',
      '--banner-special-3': '#fff2e2',
      '--banner-regular-1': '#f5f9ff',
      '--banner-regular-2': '#edf4ff',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(84,125,178,0.12) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(127,150,201,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(197,140,71,0.06) 0%, transparent 70%)',
      '--ambient-a': 'rgba(84,125,178,0.16)',
      '--ambient-b': 'rgba(127,150,201,0.16)',
      '--map-base': '#dfe9f4',
      '--lift-shadow': '0 8px 24px rgba(84,125,178,0.20)',
      '--accent-glow': '0 4px 16px rgba(84,125,178,0.28)',
      '--accent-strong-shadow': '0 8px 24px rgba(84,125,178,0.32)'
    }
  },
  birthday: {
    label: 'Birthday lights',
    mood: 'Champan, rosa neoyorquino y rooftop nocturno.',
    vars: {
      '--bg': '#fff5f8',
      '--bg2': '#fffafd',
      '--bg3': '#ffeef5',
      '--card': '#ffffff',
      '--card2': '#fff5f7',
      '--border': '#f3d8e4',
      '--border2': '#f9e7ef',
      '--pink': '#cf5c8f',
      '--pink-light': '#e797bc',
      '--pink-dim': 'rgba(207,92,143,0.10)',
      '--rose': '#a33467',
      '--gold': '#d7a144',
      '--gold-light': '#efc16f',
      '--gold-dim': 'rgba(215,161,68,0.14)',
      '--lavender': '#b37ad5',
      '--lav-dim': 'rgba(179,122,213,0.12)',
      '--teal': '#5ca9a6',
      '--green': '#5cb98f',
      '--text': '#38182f',
      '--text2': '#86536f',
      '--text3': '#b38ca1',
      '--shadow': '0 10px 30px rgba(207,92,143,0.14)',
      '--shadow-sm': '0 4px 16px rgba(207,92,143,0.09)',
      '--header-bg': 'rgba(255,245,248,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(207,92,143,0.12)',
      '--hero-grad-1': '#ffe9f4',
      '--hero-grad-2': '#fff6ff',
      '--hero-grad-3': '#fff3df',
      '--next-card-grad-1': '#ffeef6',
      '--next-card-grad-2': '#f8efff',
      '--day-selector-bg': 'rgba(255,245,248,0.95)',
      '--banner-special-1': '#fff0f7',
      '--banner-special-2': '#f9f0ff',
      '--banner-special-3': '#fff7e4',
      '--banner-regular-1': '#fff7fb',
      '--banner-regular-2': '#f9f3ff',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(207,92,143,0.12) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(179,122,213,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(215,161,68,0.07) 0%, transparent 70%)',
      '--ambient-a': 'rgba(207,92,143,0.16)',
      '--ambient-b': 'rgba(179,122,213,0.16)',
      '--map-base': '#f2dde8',
      '--lift-shadow': '0 8px 24px rgba(207,92,143,0.20)',
      '--accent-glow': '0 4px 16px rgba(207,92,143,0.28)',
      '--accent-strong-shadow': '0 8px 24px rgba(207,92,143,0.34)'
    }
  },
  explore: {
    label: 'Downtown wander',
    mood: 'SoHo, neones suaves y energia de barrio.',
    vars: {
      '--bg': '#f7f3fb',
      '--bg2': '#fcf9ff',
      '--bg3': '#f1ebfa',
      '--card': '#ffffff',
      '--card2': '#f7f0ff',
      '--border': '#e3d9f1',
      '--border2': '#eee7f7',
      '--pink': '#8a4db2',
      '--pink-light': '#b285d2',
      '--pink-dim': 'rgba(138,77,178,0.10)',
      '--rose': '#6b3290',
      '--gold': '#d4934c',
      '--gold-light': '#e8b06f',
      '--gold-dim': 'rgba(212,147,76,0.12)',
      '--lavender': '#c06da4',
      '--lav-dim': 'rgba(192,109,164,0.12)',
      '--teal': '#4e9e9c',
      '--green': '#57a471',
      '--text': '#2f1f44',
      '--text2': '#705687',
      '--text3': '#9f8ab4',
      '--shadow': '0 10px 30px rgba(138,77,178,0.14)',
      '--shadow-sm': '0 4px 16px rgba(138,77,178,0.09)',
      '--header-bg': 'rgba(247,243,251,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(138,77,178,0.12)',
      '--hero-grad-1': '#f0e7fb',
      '--hero-grad-2': '#fff7fd',
      '--hero-grad-3': '#fff1e5',
      '--next-card-grad-1': '#f5efff',
      '--next-card-grad-2': '#fff1f8',
      '--day-selector-bg': 'rgba(247,243,251,0.95)',
      '--banner-special-1': '#f8f0ff',
      '--banner-special-2': '#fff3fb',
      '--banner-special-3': '#fff6e9',
      '--banner-regular-1': '#faf5ff',
      '--banner-regular-2': '#f8f1ff',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(138,77,178,0.12) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(192,109,164,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(212,147,76,0.06) 0%, transparent 70%)',
      '--ambient-a': 'rgba(138,77,178,0.16)',
      '--ambient-b': 'rgba(192,109,164,0.14)',
      '--map-base': '#e8e0f3',
      '--lift-shadow': '0 8px 24px rgba(138,77,178,0.20)',
      '--accent-glow': '0 4px 16px rgba(138,77,178,0.28)',
      '--accent-strong-shadow': '0 8px 24px rgba(138,77,178,0.34)'
    }
  },
  culture: {
    label: 'Museum garden',
    mood: 'Verde parque, piedra noble y calma cultural.',
    vars: {
      '--bg': '#f4faf5',
      '--bg2': '#fbfdf9',
      '--bg3': '#edf5eb',
      '--card': '#ffffff',
      '--card2': '#f5fbf4',
      '--border': '#d9e7d8',
      '--border2': '#e9f1e5',
      '--pink': '#5a8f63',
      '--pink-light': '#87b38d',
      '--pink-dim': 'rgba(90,143,99,0.10)',
      '--rose': '#3f6f47',
      '--gold': '#bc9a5a',
      '--gold-light': '#d9ba7e',
      '--gold-dim': 'rgba(188,154,90,0.12)',
      '--lavender': '#769f90',
      '--lav-dim': 'rgba(118,159,144,0.12)',
      '--teal': '#4f9e92',
      '--green': '#4ca370',
      '--text': '#203329',
      '--text2': '#5d7667',
      '--text3': '#8ca18f',
      '--shadow': '0 10px 30px rgba(90,143,99,0.14)',
      '--shadow-sm': '0 4px 16px rgba(90,143,99,0.09)',
      '--header-bg': 'rgba(244,250,245,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(90,143,99,0.12)',
      '--hero-grad-1': '#edf7eb',
      '--hero-grad-2': '#f7fbf2',
      '--hero-grad-3': '#f7f1e4',
      '--next-card-grad-1': '#eef8ed',
      '--next-card-grad-2': '#f7f7ed',
      '--day-selector-bg': 'rgba(244,250,245,0.95)',
      '--banner-special-1': '#eef8ee',
      '--banner-special-2': '#f6faf2',
      '--banner-special-3': '#f7f1e6',
      '--banner-regular-1': '#f6fbf5',
      '--banner-regular-2': '#eef5ef',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(90,143,99,0.12) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(118,159,144,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(188,154,90,0.05) 0%, transparent 70%)',
      '--ambient-a': 'rgba(90,143,99,0.16)',
      '--ambient-b': 'rgba(118,159,144,0.16)',
      '--map-base': '#e0ebde',
      '--lift-shadow': '0 8px 24px rgba(90,143,99,0.20)',
      '--accent-glow': '0 4px 16px rgba(90,143,99,0.28)',
      '--accent-strong-shadow': '0 8px 24px rgba(90,143,99,0.32)'
    }
  },
  iconic: {
    label: 'Skyline icons',
    mood: 'Acero azul, miradores y atardecer sobre el puente.',
    vars: {
      '--bg': '#f1f7fd',
      '--bg2': '#f8fbff',
      '--bg3': '#e9f1fb',
      '--card': '#ffffff',
      '--card2': '#f1f7ff',
      '--border': '#d7e5f3',
      '--border2': '#e7eff8',
      '--pink': '#2d7dc6',
      '--pink-light': '#6fa9db',
      '--pink-dim': 'rgba(45,125,198,0.10)',
      '--rose': '#1d5d97',
      '--gold': '#e09b4e',
      '--gold-light': '#f0bb77',
      '--gold-dim': 'rgba(224,155,78,0.12)',
      '--lavender': '#5f8dd4',
      '--lav-dim': 'rgba(95,141,212,0.12)',
      '--teal': '#4a9fb0',
      '--green': '#4ea47a',
      '--text': '#1c3550',
      '--text2': '#587694',
      '--text3': '#8ca6bd',
      '--shadow': '0 10px 30px rgba(45,125,198,0.14)',
      '--shadow-sm': '0 4px 16px rgba(45,125,198,0.09)',
      '--header-bg': 'rgba(241,247,253,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(45,125,198,0.12)',
      '--hero-grad-1': '#e6f1ff',
      '--hero-grad-2': '#f5f9ff',
      '--hero-grad-3': '#fff1df',
      '--next-card-grad-1': '#edf5ff',
      '--next-card-grad-2': '#eef6ff',
      '--day-selector-bg': 'rgba(241,247,253,0.95)',
      '--banner-special-1': '#edf5ff',
      '--banner-special-2': '#f2f7ff',
      '--banner-special-3': '#fff3e3',
      '--banner-regular-1': '#f4f9ff',
      '--banner-regular-2': '#edf4ff',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(45,125,198,0.12) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(95,141,212,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(224,155,78,0.07) 0%, transparent 70%)',
      '--ambient-a': 'rgba(45,125,198,0.16)',
      '--ambient-b': 'rgba(95,141,212,0.16)',
      '--map-base': '#dce8f4',
      '--lift-shadow': '0 8px 24px rgba(45,125,198,0.20)',
      '--accent-glow': '0 4px 16px rgba(45,125,198,0.28)',
      '--accent-strong-shadow': '0 8px 24px rgba(45,125,198,0.34)'
    }
  },
  broadway: {
    label: 'Broadway glow',
    mood: 'Marquesinas doradas, rojo teatro y noche grande.',
    vars: {
      '--bg': '#fff6ef',
      '--bg2': '#fffbf6',
      '--bg3': '#fff0e4',
      '--card': '#ffffff',
      '--card2': '#fff6ef',
      '--border': '#f2dfd2',
      '--border2': '#f8eade',
      '--pink': '#cf6c2c',
      '--pink-light': '#e9a063',
      '--pink-dim': 'rgba(207,108,44,0.10)',
      '--rose': '#a44b17',
      '--gold': '#d9a533',
      '--gold-light': '#ecc15a',
      '--gold-dim': 'rgba(217,165,51,0.14)',
      '--lavender': '#b65b46',
      '--lav-dim': 'rgba(182,91,70,0.12)',
      '--teal': '#558d8d',
      '--green': '#5d9d6c',
      '--text': '#442518',
      '--text2': '#865843',
      '--text3': '#b08c79',
      '--shadow': '0 10px 30px rgba(207,108,44,0.14)',
      '--shadow-sm': '0 4px 16px rgba(207,108,44,0.09)',
      '--header-bg': 'rgba(255,246,239,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(207,108,44,0.12)',
      '--hero-grad-1': '#fff0e2',
      '--hero-grad-2': '#fff9f0',
      '--hero-grad-3': '#fff4d8',
      '--next-card-grad-1': '#fff2e8',
      '--next-card-grad-2': '#fff5e6',
      '--day-selector-bg': 'rgba(255,246,239,0.95)',
      '--banner-special-1': '#fff2e8',
      '--banner-special-2': '#fff9f0',
      '--banner-special-3': '#fff5db',
      '--banner-regular-1': '#fff8f2',
      '--banner-regular-2': '#fff2e7',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(207,108,44,0.12) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(182,91,70,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(217,165,51,0.08) 0%, transparent 70%)',
      '--ambient-a': 'rgba(207,108,44,0.16)',
      '--ambient-b': 'rgba(182,91,70,0.14)',
      '--map-base': '#f0ddd1',
      '--lift-shadow': '0 8px 24px rgba(207,108,44,0.20)',
      '--accent-glow': '0 4px 16px rgba(207,108,44,0.28)',
      '--accent-strong-shadow': '0 8px 24px rgba(207,108,44,0.34)'
    }
  },
  relax: {
    label: 'Quiet museum',
    mood: 'Tonos suaves, cafe largo y paseo sin prisa.',
    vars: {
      '--bg': '#f7f4ef',
      '--bg2': '#fcfaf6',
      '--bg3': '#f0ebe2',
      '--card': '#ffffff',
      '--card2': '#f8f4ec',
      '--border': '#e4dccf',
      '--border2': '#eee7dd',
      '--pink': '#8c6e54',
      '--pink-light': '#b1967d',
      '--pink-dim': 'rgba(140,110,84,0.10)',
      '--rose': '#6f543d',
      '--gold': '#b89a63',
      '--gold-light': '#d1b47e',
      '--gold-dim': 'rgba(184,154,99,0.12)',
      '--lavender': '#8a8f6e',
      '--lav-dim': 'rgba(138,143,110,0.12)',
      '--teal': '#6d9a92',
      '--green': '#73956d',
      '--text': '#382b22',
      '--text2': '#756354',
      '--text3': '#a19184',
      '--shadow': '0 10px 30px rgba(140,110,84,0.14)',
      '--shadow-sm': '0 4px 16px rgba(140,110,84,0.09)',
      '--header-bg': 'rgba(247,244,239,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(140,110,84,0.12)',
      '--hero-grad-1': '#f3eee7',
      '--hero-grad-2': '#fbf8f1',
      '--hero-grad-3': '#f4efdf',
      '--next-card-grad-1': '#f7f2ea',
      '--next-card-grad-2': '#f3eee5',
      '--day-selector-bg': 'rgba(247,244,239,0.95)',
      '--banner-special-1': '#f6f1ea',
      '--banner-special-2': '#fbf8f1',
      '--banner-special-3': '#f4efdf',
      '--banner-regular-1': '#fbf8f3',
      '--banner-regular-2': '#f3eee7',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(140,110,84,0.10) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(138,143,110,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(184,154,99,0.06) 0%, transparent 70%)',
      '--ambient-a': 'rgba(140,110,84,0.14)',
      '--ambient-b': 'rgba(138,143,110,0.14)',
      '--map-base': '#e8e0d5',
      '--lift-shadow': '0 8px 24px rgba(140,110,84,0.18)',
      '--accent-glow': '0 4px 16px rgba(140,110,84,0.24)',
      '--accent-strong-shadow': '0 8px 24px rgba(140,110,84,0.28)'
    }
  },
  return: {
    label: 'Homebound calm',
    mood: 'Bruma azul, despedida suave y vuelta ordenada.',
    vars: {
      '--bg': '#f2f6f8',
      '--bg2': '#f8fbfc',
      '--bg3': '#e9eff3',
      '--card': '#ffffff',
      '--card2': '#f2f6f8',
      '--border': '#d8e2e8',
      '--border2': '#e8eef2',
      '--pink': '#5f7c8c',
      '--pink-light': '#89a2b0',
      '--pink-dim': 'rgba(95,124,140,0.10)',
      '--rose': '#43606f',
      '--gold': '#c49b68',
      '--gold-light': '#dbb383',
      '--gold-dim': 'rgba(196,155,104,0.12)',
      '--lavender': '#7d8ea4',
      '--lav-dim': 'rgba(125,142,164,0.12)',
      '--teal': '#5d9aa0',
      '--green': '#6ca08d',
      '--text': '#243945',
      '--text2': '#617988',
      '--text3': '#91a6b3',
      '--shadow': '0 10px 30px rgba(95,124,140,0.14)',
      '--shadow-sm': '0 4px 16px rgba(95,124,140,0.09)',
      '--header-bg': 'rgba(242,246,248,0.92)',
      '--nav-bg': 'rgba(255,255,255,0.96)',
      '--nav-shadow': '0 -8px 28px rgba(95,124,140,0.12)',
      '--hero-grad-1': '#ebf2f6',
      '--hero-grad-2': '#f8fafc',
      '--hero-grad-3': '#f6efe5',
      '--next-card-grad-1': '#eef4f7',
      '--next-card-grad-2': '#eef2f6',
      '--day-selector-bg': 'rgba(242,246,248,0.95)',
      '--banner-special-1': '#eef4f7',
      '--banner-special-2': '#f6f9fb',
      '--banner-special-3': '#f6efe5',
      '--banner-regular-1': '#f6fafb',
      '--banner-regular-2': '#edf3f6',
      '--bg-orb-1': 'radial-gradient(ellipse at 10% 0%, rgba(95,124,140,0.10) 0%, transparent 55%)',
      '--bg-orb-2': 'radial-gradient(ellipse at 90% 100%, rgba(125,142,164,0.10) 0%, transparent 55%)',
      '--bg-orb-3': 'radial-gradient(ellipse at 50% 50%, rgba(196,155,104,0.05) 0%, transparent 70%)',
      '--ambient-a': 'rgba(95,124,140,0.14)',
      '--ambient-b': 'rgba(125,142,164,0.14)',
      '--map-base': '#dfe8ed',
      '--lift-shadow': '0 8px 24px rgba(95,124,140,0.18)',
      '--accent-glow': '0 4px 16px rgba(95,124,140,0.24)',
      '--accent-strong-shadow': '0 8px 24px rgba(95,124,140,0.28)'
    }
  }
};

function getDayById(dayId) {
  return TRIP.days.find(day => day.id === Number(dayId)) || TRIP.days[0];
}

function getThemeConfig(dayId) {
  const day = getDayById(dayId);
  return DAY_THEMES[day.theme] || DAY_THEMES.travel;
}

function applyDayTheme(dayId) {
  const day = getDayById(dayId);
  const themeConfig = getThemeConfig(dayId);
  const root = document.documentElement;

  Object.entries(themeConfig.vars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  document.body.dataset.dayTheme = day.theme || 'travel';

  const metaTheme = document.querySelector('meta[name=\"theme-color\"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', themeConfig.vars['--bg']);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  loadFromStorage();
  applyDayTheme(currentDayId);
  renderHome();
  renderDaySelector();
  renderDayDetail(currentDayId);
  renderInfoView();
  setupNavigation();
  setupPdfModal();
  setupAuthUi();
  await initializeAuth();
  await initializePersonalHub();
  startCountdown();
});

// ─── STORAGE ──────────────────────────────────────────────
function loadFromStorage() {
  try {
    const cl = localStorage.getItem('ny_checklist');
    if (cl) checklistState = JSON.parse(cl);

    const nt = localStorage.getItem('ny_notes');
    if (nt) notesState = JSON.parse(nt);

    const pi = localStorage.getItem(PERSONAL_ITEM_KEY);
    if (pi) personalItems = JSON.parse(pi);
  } catch(e) {}
}

function saveChecklist() {
  localStorage.setItem('ny_checklist', JSON.stringify(checklistState));
}

function saveNotes() {
  localStorage.setItem('ny_notes', JSON.stringify(notesState));
}

function savePersonalItems() {
  localStorage.setItem(PERSONAL_ITEM_KEY, JSON.stringify(personalItems));
}

function useSupabaseSync() {
  return Boolean(window.APP_CONFIG?.supabaseUrl && window.APP_CONFIG?.supabaseAnonKey);
}

function getSupabaseBucket() {
  return window.APP_CONFIG?.supabaseBucket || 'trip-docs';
}

function getAllowedEmails() {
  return (window.APP_CONFIG?.allowedEmails || []).map(email => String(email).toLowerCase());
}

function isAllowedTripUser(email) {
  if (!useSupabaseSync()) return true;
  return getAllowedEmails().includes(String(email || '').toLowerCase());
}

function setupAuthUi() {
  document.body.classList.add('auth-locked');

  const form = document.getElementById('auth-form');
  if (!form || form.dataset.ready === 'true') return;

  form.dataset.ready = 'true';
  form.addEventListener('submit', handleAuthSubmit);
}

async function initializeAuth() {
  if (!useSupabaseSync()) {
    setAuthUnlocked();
    authState.ready = true;
    return;
  }

  showAuthMessage('Conectando con Supabase...');

  try {
    const supabase = await window.supabaseReady;
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    applyAuthSession(session);

    supabase.auth.onAuthStateChange((_event, sessionValue) => {
      applyAuthSession(sessionValue);
    });
  } catch (error) {
    showAuthMessage(formatAuthError(error, 'signin'), true);
  } finally {
    authState.ready = true;
  }
}

function applyAuthSession(session) {
  authState.session = session;
  authState.user = session?.user || null;

  const logoutBtn = document.getElementById('auth-logout-btn');
  if (logoutBtn) {
    logoutBtn.style.display = authState.user ? 'inline-flex' : 'none';
  }

  if (authState.user && !isAllowedTripUser(authState.user.email)) {
    signOutTripApp(true);
    showAuthMessage('Ese email no esta autorizado para esta app', true);
    return;
  }

  if (authState.user) {
    setAuthUnlocked();
    showAuthMessage('');
    loadPersonalItemsFromSupabase();
  } else {
    document.body.classList.add('auth-locked');
    document.getElementById('auth-overlay')?.classList.remove('hidden');
    showAuthMessage('Inicia sesión para desbloquear la app');
    personalItems = [];
    renderPersonalItems();
  }
}

function setAuthUnlocked() {
  document.body.classList.remove('auth-locked');
  document.getElementById('auth-overlay')?.classList.add('hidden');
}

function showAuthMessage(message, isError = false) {
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? 'var(--red)' : 'var(--text2)';
}

function getAuthSubmitMode(event) {
  return event.submitter?.dataset.authMode || 'signin';
}

function getAuthRedirectUrl() {
  return window.location.href.split('#')[0];
}

function formatAuthError(error, mode) {
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('failed to fetch')) {
    return 'No se puede conectar con Supabase. Revisa la Project URL y la anon key en js/config.js';
  }

  if (code === 'invalid_credentials') {
    return 'Email o contrasena incorrectos';
  }

  if (code === 'email_not_confirmed') {
    return 'Revisa el email y confirma la cuenta antes de entrar';
  }

  if (code === 'user_already_exists' || message.includes('already registered')) {
    return 'Ese email ya tiene cuenta. Usa Entrar';
  }

  if (message.includes('signup is disabled')) {
    return 'El registro por email esta desactivado en Supabase';
  }

  if (mode === 'signup') {
    return 'No se pudo crear la cuenta';
  }

  return 'No se pudo iniciar sesion';
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('auth-email')?.value.trim();
  const password = document.getElementById('auth-password')?.value;
  const mode = getAuthSubmitMode(event);

  if (!email || !password) {
    showAuthMessage('Introduce email y contrasena', true);
    return;
  }

  if (!isAllowedTripUser(email)) {
    showAuthMessage('Ese email no esta autorizado para esta app', true);
    return;
  }

  if (password.length < 6) {
    showAuthMessage('La contrasena debe tener al menos 6 caracteres', true);
    return;
  }

  showAuthMessage(mode === 'signup' ? 'Creando cuenta...' : 'Entrando...');

  try {
    const supabase = await window.supabaseReady;

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl()
        }
      });

      if (error) throw error;

      if (data?.user?.identities && data.user.identities.length === 0) {
        showAuthMessage('Ese email ya tiene cuenta. Usa Entrar', true);
        return;
      }

      if (data?.session) {
        showAuthMessage('Cuenta creada y sesion iniciada');
        return;
      }

      showAuthMessage('Cuenta creada. Revisa vuestro email si Supabase pide confirmacion');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  } catch (error) {
    showAuthMessage(formatAuthError(error, mode), true);
  }
}

async function signOutTripApp(silent = false) {
  if (!useSupabaseSync()) return;

  try {
    const supabase = await window.supabaseReady;
    await supabase.auth.signOut();
    if (!silent) {
      showToast('Sesion cerrada');
    }
  } catch (error) {
    if (!silent) {
      showToast('No se pudo cerrar sesión');
    }
  }
}

// ─── NAVIGATION ───────────────────────────────────────────
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
    });
  });
}

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const viewEl = document.getElementById(`view-${view}`);
  const navEl  = document.querySelector(`.nav-item[data-view="${view}"]`);

  if (viewEl) viewEl.classList.add('active');
  if (navEl)  navEl.classList.add('active');

  currentView = view;

  if (view === 'map') {
    if (!mapInstance) initMap();
    else resizeMap();
  }

  window.scrollTo({ top: 0 });
}

// ─── COUNTDOWN ────────────────────────────────────────────
function startCountdown() {
  function tick() {
    const now    = new Date();
    const target = new Date(TRIP.departureDate);
    const diff   = target - now;

    const el = document.getElementById('countdown-grid');
    if (!el) return;

    if (diff <= 0) {
      el.innerHTML = '';
      const done = document.getElementById('countdown-done');
      if (done) done.style.display = 'block';
      return;
    }

    const days    = Math.floor(diff / (1000*60*60*24));
    const hours   = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);

    el.innerHTML = [
      { n: days,    l: 'Días' },
      { n: hours,   l: 'Horas' },
      { n: minutes, l: 'Min' },
      { n: seconds, l: 'Seg' }
    ].map(({ n, l }) => `
      <div class="countdown-box">
        <div class="countdown-num">${String(n).padStart(2,'0')}</div>
        <div class="countdown-lbl">${l}</div>
      </div>
    `).join('');
  }

  tick();
  setInterval(tick, 1000);
}

// ─── HOME VIEW ────────────────────────────────────────────
function renderHome() {
  // Find next upcoming event
  const now = new Date();
  let nextEvent = null;
  let nextDay   = null;

  outer: for (const day of TRIP.days) {
    const dayDate = new Date(day.date);
    if (dayDate >= now) {
      for (const act of day.activities) {
        nextEvent = act;
        nextDay   = day;
        break outer;
      }
    }
  }

  // Next event card
  const nc = document.getElementById('next-event-card');
  if (nc && nextDay) {
    nc.innerHTML = `
      <div class="next-card-label">✨ Próximo momento especial</div>
      <div class="next-card-title">${nextEvent.icon} ${nextEvent.title}</div>
      <div class="next-card-time">${nextDay.label} · ${nextDay.dayName} · ${nextEvent.time}</div>
      <div class="next-card-time" style="margin-top:4px;font-style:italic">${nextEvent.desc}</div>
    `;
  } else if (nc) {
    nc.innerHTML = '<div class="next-card-empty">🌸 El viaje ya comenzó. ¡Disfrutadlo!</div>';
  }

  // Day strip on home
  const strip = document.getElementById('home-day-strip');
  if (!strip) return;
  strip.innerHTML = TRIP.days.map(d => `
    <div class="day-mini-card ${d.special ? 'special' : ''}" onclick="goToDay(${d.id})">
      <div class="day-mini-emoji">${d.emoji}</div>
      <div class="day-mini-label">${d.label}</div>
      <div class="day-mini-title">${formatShortDate(d.date)}</div>
    </div>
  `).join('');
}

function goToDay(dayId) {
  currentDayId = dayId;
  applyDayTheme(dayId);
  renderDayDetail(dayId);
  switchView('days');

  // Sync pill selector
  document.querySelectorAll('.day-pill').forEach(p => {
    p.classList.toggle('active', Number(p.dataset.day) === dayId);
  });

  // Scroll pill into view
  const activePill = document.querySelector(`.day-pill[data-day="${dayId}"]`);
  if (activePill) activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// ─── DAY SELECTOR BAR ─────────────────────────────────────
function renderDaySelector() {
  const bar = document.getElementById('day-pills-bar');
  if (!bar) return;

  bar.innerHTML = TRIP.days.map((d, i) => `
    <button
      class="day-pill ${d.special ? 'special-pill' : ''} ${i === 0 ? 'active' : ''}"
      data-day="${d.id}"
      onclick="selectDay(${d.id})"
    >${d.emoji} ${d.label}</button>
  `).join('');
}

function selectDay(dayId) {
  currentDayId = dayId;
  applyDayTheme(dayId);
  document.querySelectorAll('.day-pill').forEach(p => {
    p.classList.toggle('active', Number(p.dataset.day) === dayId);
    if (p.classList.contains('special-pill')) {
      p.classList.toggle('active', Number(p.dataset.day) === dayId);
    }
  });
  renderDayDetail(dayId);
}

// ─── DAY DETAIL ───────────────────────────────────────────
function renderDayDetail(dayId) {
  const day = getDayById(dayId);
  if (!day) return;

  const container = document.getElementById('day-detail-container');
  if (!container) return;

  const note = notesState[`day_${dayId}`] || '';

  const themeConfig = getThemeConfig(dayId);

  container.innerHTML = `
    <div class="day-detail">
      <!-- Banner -->
      <div class="day-banner ${day.special ? 'day-banner-special' : ''}">
        ${day.special ? `<div class="day-banner-special-tag">🎉 ${day.specialText}</div>` : ''}
        <div class="day-theme-tag">${themeConfig.label} · ${themeConfig.mood}</div>
        <div class="day-banner-header">
          <div class="day-banner-emoji">${day.emoji}</div>
          <div>
            <div class="day-banner-label">${day.label} · ${day.dayName} · ${formatLongDate(day.date)}</div>
            <div class="day-banner-title">${day.title}</div>
          </div>
        </div>
        <div class="day-banner-desc">${day.description}</div>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        ${day.activities.map((act, i) => `
          <div class="tl-item ${act.highlight ? 'highlight' : ''}" style="animation-delay:${i*0.05}s">
            <div class="tl-dot"></div>
            <div class="tl-card">
              <div class="tl-time">${act.time}</div>
              <div class="tl-head">
                <span class="tl-icon">${act.icon}</span>
                <span class="tl-title">${act.title}</span>
              </div>
              <div class="tl-desc">${act.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Places -->
      <div style="margin-top:20px">
        <div class="notes-label">📍 Lugares del día</div>
        <div class="places-grid">
          ${day.places.map(p => `
            <a class="place-tag" href="${p.gmaps}" target="_blank" rel="noopener">
              ${PLACE_ICONS_INLINE[p.type] || '📍'} ${p.name}
            </a>
          `).join('')}
        </div>
        <button class="btn-secondary mt-8" onclick="goToMapDay(${day.id})">
          🗺️ Ver en el mapa
        </button>
      </div>

      <!-- Notes -->
      <div class="notes-section">
        <div class="notes-label">📝 Notas personales</div>
        <textarea
          class="notes-input"
          placeholder="Escribe aquí ideas, recordatorios, reservas confirmadas..."
          id="notes-day-${dayId}"
          onInput="saveNoteDay(${dayId}, this.value)"
        >${note}</textarea>
        <div class="notes-saved" id="notes-saved-${dayId}">✓ Guardado</div>
      </div>
    </div>
  `;
}

const PLACE_ICONS_INLINE = {
  transport: '🚇', hotel: '🏨', landmark: '🌸', park: '🌿',
  restaurant: '🍽️', bar: '🔮', shop: '✨', museum: '🏛️',
  neighborhood: '💫', theater: '🎭'
};

function saveNoteDay(dayId, value) {
  notesState[`day_${dayId}`] = value;
  saveNotes();

  const saved = document.getElementById(`notes-saved-${dayId}`);
  if (saved) {
    saved.classList.add('show');
    clearTimeout(saved._timer);
    saved._timer = setTimeout(() => saved.classList.remove('show'), 2000);
  }
}

function goToMapDay(dayId) {
  currentDayId = dayId;
  applyDayTheme(dayId);
  switchView('map');
  setTimeout(() => {
    filterMapByDay(dayId);
    // Sync map filter pills
    document.querySelectorAll('#map-filter-bar .map-filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.day === String(dayId));
    });
  }, 300);
}

// ─── INFO VIEW ────────────────────────────────────────────
function renderInfoView() {
  renderChecklist();
  renderTransport();
  renderApps();
  renderPersonalItems();
}

function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;

  // Apply saved state
  const items = TRIP.checklist.map(item => ({
    ...item,
    done: checklistState[item.id] !== undefined ? checklistState[item.id] : item.done
  }));

  const cats = [...new Set(items.map(i => i.cat))];
  const catLabels = { documentos: '🌸 Documentos', equipaje: '✨ Equipaje', internet: '🔮 Internet & Apps', extras: '💫 Extras' };

  const doneCount = items.filter(i => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  let html = `
    <div class="progress-label">${doneCount} de ${items.length} completados</div>
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" style="width:${pct}%"></div>
    </div>
  `;

  cats.forEach(cat => {
    html += `<div class="checklist-cat-label">${catLabels[cat] || cat}</div>`;
    items.filter(i => i.cat === cat).forEach(item => {
      html += `
        <div class="check-item ${item.done ? 'checked' : ''}" onclick="toggleCheck('${item.id}')" id="ci-${item.id}">
          <div class="check-box">${item.done ? '✓' : ''}</div>
          <div class="check-text">${item.text}</div>
        </div>
      `;
    });
  });

  container.innerHTML = html;
}

function toggleCheck(id) {
  const items = TRIP.checklist.map(item => ({
    ...item,
    done: checklistState[item.id] !== undefined ? checklistState[item.id] : item.done
  }));

  const item = items.find(i => i.id === id);
  if (!item) return;

  checklistState[id] = !item.done;
  saveChecklist();
  renderChecklist();
  showToast(checklistState[id] ? '🌸 ¡Listo!' : 'Desmarcado');
}

function renderTransport() {
  const container = document.getElementById('transport-container');
  if (!container) return;

  container.innerHTML = TRIP.transport.map(t => `
    <div class="transport-card">
      <div class="transport-icon">${t.icon}</div>
      <div>
        <div class="transport-title">${t.title}</div>
        <div class="transport-desc">${t.desc}</div>
      </div>
    </div>
  `).join('');
}

function renderApps() {
  const container = document.getElementById('apps-container');
  if (!container) return;

  container.innerHTML = TRIP.apps.map(a => `
    <div class="app-item">
      <div class="app-icon">${a.icon}</div>
      <div>
        <div class="app-name">${a.name}</div>
        <div class="app-desc">${a.desc}</div>
      </div>
    </div>
  `).join('');
}

async function initializePersonalHub() {
  setupPersonalForm();
  renderPersonalItems();

  if (useSupabaseSync()) {
    if (authState.user) {
      await loadPersonalItemsFromSupabase();
    }
    return;
  }

  try {
    await getPersonalFilesDb();
  } catch (error) {
    showToast('Archivos locales no disponibles en este navegador');
  }
}

async function loadPersonalItemsFromSupabase() {
  if (!authState.user) return;

  try {
    const supabase = await window.supabaseReady;
    const [{ data: items, error: itemsError }, { data: files, error: filesError }] = await Promise.all([
      supabase.from('trip_items').select('id,item_type,title,notes,link,created_at').order('created_at', { ascending: false }),
      supabase.from('trip_files').select('id,item_id,original_name,mime_type,size_bytes,storage_path,created_at').order('created_at', { ascending: true })
    ]);

    if (itemsError) throw itemsError;
    if (filesError) throw filesError;

    const filesByItem = {};
    (files || []).forEach(file => {
      filesByItem[file.item_id] ||= [];
      filesByItem[file.item_id].push({
        id: file.id,
        name: file.original_name,
        type: file.mime_type,
        size: file.size_bytes,
        storagePath: file.storage_path
      });
    });

    personalItems = (items || []).map(item => ({
      id: item.id,
      kind: item.item_type,
      title: item.title,
      notes: item.notes || '',
      link: item.link || '',
      attachments: filesByItem[item.id] || [],
      createdAt: item.created_at
    }));
    renderPersonalItems();
  } catch (error) {
    showToast('No se pudieron cargar los documentos');
  }
}

function setupPersonalForm() {
  const form = document.getElementById('personal-item-form');
  if (!form || form.dataset.ready === 'true') return;

  form.dataset.ready = 'true';
  form.addEventListener('submit', handlePersonalItemSubmit);
}

async function handlePersonalItemSubmit(event) {
  event.preventDefault();

  const kindEl = document.getElementById('personal-item-kind');
  const titleEl = document.getElementById('personal-item-title');
  const linkEl = document.getElementById('personal-item-link');
  const notesEl = document.getElementById('personal-item-notes');
  const filesEl = document.getElementById('personal-item-files');

  const title = titleEl.value.trim();
  const kind = kindEl.value;
  const link = linkEl.value.trim();
  const notes = notesEl.value.trim();
  const files = Array.from(filesEl.files || []);

  if (!title) {
    showToast('Pon un titulo');
    return;
  }

  if (useSupabaseSync()) {
    try {
      const supabase = await window.supabaseReady;
      const { data: item, error: itemError } = await supabase
        .from('trip_items')
        .insert({
          item_type: kind,
          title,
          notes: notes || null,
          link: link || null,
          created_by: authState.user?.id || null
        })
        .select('id')
        .single();

      if (itemError) throw itemError;

      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          throw new Error('file-too-large');
        }

        const storagePath = `shared/${item.id}/${Date.now()}_${slugifyFilename(file.name)}`;
        const { error: uploadError } = await supabase.storage
          .from(getSupabaseBucket())
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/octet-stream'
          });

        if (uploadError) throw uploadError;

        const { error: fileError } = await supabase
          .from('trip_files')
          .insert({
            item_id: item.id,
            original_name: file.name,
            mime_type: file.type || 'application/octet-stream',
            size_bytes: file.size,
            storage_path: storagePath,
            created_by: authState.user?.id || null
          });

        if (fileError) throw fileError;
      }

      await loadPersonalItemsFromSupabase();
      resetPersonalForm();
      showToast('Guardado');
    } catch (error) {
      showToast(error?.message === 'file-too-large' ? 'Maximo 15 MB por archivo' : 'No se pudo guardar');
    }

    return;
  }

  const attachments = [];

  if (files.length > 0) {
    try {
      for (const file of files) {
        const savedFile = await savePersonalFile(file);
        attachments.push(savedFile);
      }
    } catch (error) {
      showToast('No se pudieron guardar los archivos');
      return;
    }
  }

  personalItems.unshift({
    id: `item_${Date.now()}`,
    kind,
    title,
    link,
    notes,
    attachments,
    createdAt: new Date().toISOString()
  });

  savePersonalItems();
  renderPersonalItems();
  resetPersonalForm();
  showToast('Guardado');
}

function resetPersonalForm() {
  const form = document.getElementById('personal-item-form');
  if (!form) return;
  form.reset();
  const kind = document.getElementById('personal-item-kind');
  if (kind) kind.value = 'documento';
}

function renderPersonalItems() {
  const container = document.getElementById('personal-items-list');
  if (!container) return;

  if (useSupabaseSync() && !authState.user) {
    container.innerHTML = `
      <div class="personal-empty">
        Inicia sesión para ver y sincronizar vuestros documentos y reservas.
      </div>
    `;
    return;
  }

  if (!personalItems.length) {
    container.innerHTML = `
      <div class="personal-empty">
        Aqui apareceran vuestros pasaportes, seguro, hotel, reservas y cualquier enlace o archivo que querais guardar.
      </div>
    `;
    return;
  }

  container.innerHTML = personalItems.map(item => {
    const meta = PERSONAL_KIND_META[item.kind] || PERSONAL_KIND_META.otro;
    const notesHtml = item.notes ? `<div class="personal-item-meta">${escapeHtml(item.notes).replace(/\n/g, '<br/>')}</div>` : '';
    const linkHtml = item.link ? `<a class="personal-link-btn" href="${escapeAttribute(item.link)}" target="_blank" rel="noopener">🔗 Abrir enlace</a>` : '';
    const attachmentsHtml = (item.attachments || []).map(file => `
      <button class="personal-attachment-btn" type="button" onclick="openPersonalAttachment('${item.id}','${file.id}')">
        📎 ${escapeHtml(file.name)}
      </button>
    `).join('');

    return `
      <div class="personal-item-card">
        <div class="personal-item-head">
          <div>
            <div class="personal-item-title">${escapeHtml(item.title)}</div>
            <div class="personal-item-kind">${meta.icon} ${meta.label}</div>
          </div>
          <button class="personal-delete-btn" type="button" onclick="deletePersonalItem('${item.id}')">Eliminar</button>
        </div>
        ${notesHtml}
        <div class="personal-attachments">
          ${linkHtml}
          ${attachmentsHtml}
        </div>
      </div>
    `;
  }).join('');
}

async function deletePersonalItem(itemId) {
  if (useSupabaseSync()) {
    try {
      const supabase = await window.supabaseReady;
      const item = personalItems.find(entry => entry.id === itemId);
      const paths = (item?.attachments || []).map(file => file.storagePath).filter(Boolean);

      if (paths.length) {
        const { error: storageError } = await supabase.storage.from(getSupabaseBucket()).remove(paths);
        if (storageError) throw storageError;
      }

      const { error: filesError } = await supabase.from('trip_files').delete().eq('item_id', itemId);
      if (filesError) throw filesError;

      const { error: itemError } = await supabase.from('trip_items').delete().eq('id', itemId);
      if (itemError) throw itemError;

      await loadPersonalItemsFromSupabase();
      showToast('Eliminado');
    } catch (error) {
      showToast('No se pudo eliminar');
    }

    return;
  }

  const item = personalItems.find(entry => entry.id === itemId);
  if (!item) return;

  try {
    await Promise.all((item.attachments || []).map(file => deletePersonalFile(file.id)));
  } catch (error) {}

  personalItems = personalItems.filter(entry => entry.id !== itemId);
  savePersonalItems();
  renderPersonalItems();
  showToast('Eliminado');
}

async function openPersonalAttachment(itemId, fileId) {
  if (useSupabaseSync()) {
    try {
      const item = personalItems.find(entry => entry.id === itemId);
      const file = item?.attachments?.find(entry => entry.id === fileId);

      if (!file?.storagePath) {
        showToast('Archivo no encontrado');
        return;
      }

      const supabase = await window.supabaseReady;
      const { data, error } = await supabase.storage.from(getSupabaseBucket()).download(file.storagePath);
      if (error) throw error;

      const fileUrl = URL.createObjectURL(data);
      window.open(fileUrl, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch (error) {
      showToast('No se pudo abrir el archivo');
    }

    return;
  }

  try {
    const fileRecord = await getPersonalFile(fileId);
    if (!fileRecord) {
      showToast('Archivo no encontrado');
      return;
    }

    const fileUrl = URL.createObjectURL(fileRecord.blob);
    window.open(fileUrl, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
  } catch (error) {
    showToast('No se pudo abrir el archivo');
  }
}

function slugifyFilename(filename) {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

function getPersonalFilesDb() {
  if (personalFilesDbPromise) return personalFilesDbPromise;

  personalFilesDbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('indexeddb-unavailable'));
      return;
    }

    const request = window.indexedDB.open('ny-trip-files', 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('indexeddb-open-failed'));
  });

  return personalFilesDbPromise;
}

async function savePersonalFile(file) {
  const db = await getPersonalFilesDb();
  const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  await new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').put({
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      blob: file
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('indexeddb-write-failed'));
  });

  return { id, name: file.name, type: file.type, size: file.size };
}

async function getPersonalFile(fileId) {
  const db = await getPersonalFilesDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readonly');
    const request = tx.objectStore('files').get(fileId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('indexeddb-read-failed'));
  });
}

async function deletePersonalFile(fileId) {
  const db = await getPersonalFilesDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').delete(fileId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('indexeddb-delete-failed'));
  });
}

// ─── MAP FILTER PILLS ─────────────────────────────────────
function renderMapFilterPills() {
  const bar = document.getElementById('map-filter-bar');
  if (!bar) return;

  let html = `<button class="map-filter-pill active" data-day="all" onclick="applyMapFilter(this, 'all')">🗺️ Todos</button>`;
  TRIP.days.forEach(d => {
    html += `<button class="map-filter-pill" data-day="${d.id}" onclick="applyMapFilter(this, ${d.id})">${d.emoji} ${d.label}</button>`;
  });

  bar.innerHTML = html;
}

function renderMapTypePills() {
  const bar = document.getElementById('map-type-bar');
  if (!bar) return;

  const types = [...new Set(TRIP.days.flatMap(day => day.places.map(place => place.type)))];
  let html = `<button class="map-filter-pill active" data-type="all" onclick="applyMapTypeFilter(this, 'all')">Todo tipo</button>`;

  types.forEach(type => {
    const label = PLACE_LABELS[type] || type;
    const icon = PLACE_ICONS[type] || '📍';
    html += `<button class="map-filter-pill" data-type="${type}" onclick="applyMapTypeFilter(this, '${type}')">${icon} ${label}</button>`;
  });

  bar.innerHTML = html;
}

function applyMapFilter(el, dayId) {
  document.querySelectorAll('#map-filter-bar .map-filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');

  if (dayId === 'all') {
    filterMapByDay('all');
    return;
  }

  currentDayId = Number(dayId);
  applyDayTheme(currentDayId);
  renderDayDetail(currentDayId);
  filterMapByDay(currentDayId);
}

function applyMapTypeFilter(el, type) {
  document.querySelectorAll('#map-type-bar .map-filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  filterMapByType(type);
}

// ─── PDF MODAL ────────────────────────────────────────────
function setupPdfModal() {
  const overlay = document.getElementById('pdf-modal');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePdfModal();
  });
}

function openPdfModal() {
  const modal = document.getElementById('pdf-modal');
  if (modal) modal.classList.add('open');
}

function closePdfModal() {
  const modal = document.getElementById('pdf-modal');
  if (modal) modal.classList.remove('open');
}

function printItinerary() {
  // Show all day details for print
  const container = document.getElementById('day-detail-container');
  const originalContent = container.innerHTML;

  let allDaysHtml = '<div class="print-header"><h1>🗽 Nueva York — Rafa & Noemi</h1><p>18 Abril – 25 Abril 2026</p></div>';

  TRIP.days.forEach(day => {
    const note = notesState[`day_${day.id}`] || '';
    const bannerBg = `background:#f5f5f5`;

    allDaysHtml += `
      <div class="day-detail" style="page-break-after:always">
        <div class="day-banner" style="${bannerBg}; color:#111; border:2px solid #ddd;">
          <span class="day-banner-emoji">${day.emoji}</span>
          <div class="day-banner-label" style="color:${day.color}">${day.label} · ${day.dayName} ${formatLongDate(day.date)}</div>
          <div class="day-banner-title" style="color:#111">${day.title}</div>
          <div class="day-banner-desc" style="color:#444">${day.description}</div>
        </div>
        <div class="timeline">
          ${day.activities.map(act => `
            <div class="tl-item ${act.highlight ? 'highlight' : ''}">
              <div class="tl-dot"></div>
              <div class="tl-card">
                <div class="tl-time">${act.time}</div>
                <div class="tl-head">
                  <span class="tl-icon">${act.icon}</span>
                  <span class="tl-title" style="color:#111">${act.title}</span>
                </div>
                <div class="tl-desc" style="color:#444">${act.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ${note ? `<div style="margin-top:16px;padding:12px;background:#fffde7;border-radius:8px;font-size:0.82rem;color:#444"><strong>📝 Notas:</strong> ${note}</div>` : ''}
      </div>
    `;
  });

  container.innerHTML = allDaysHtml;

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      container.innerHTML = originalContent;
      closePdfModal();
      // Re-render current day
      renderDayDetail(currentDayId);
    }, 500);
  }, 200);
}

// ─── UTILS ────────────────────────────────────────────────
function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

function formatLongDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ─── MAP FILTER INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderMapFilterPills();
  renderMapTypePills();
});
