// ============================================================
//  APP.JS — New York Trip Planner | Rafa & Noemi 🗽
//  Toda la lógica: navegación, itinerario, checklist, notas
// ============================================================

// ─── STATE ────────────────────────────────────────────────
let currentView    = 'home';
let currentDayId   = 1;
let checklistState = {};
let notesState     = {};

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderHome();
  renderDaySelector();
  renderDayDetail(currentDayId);
  renderInfoView();
  setupNavigation();
  setupPdfModal();
  startCountdown();
});

// ─── STORAGE ──────────────────────────────────────────────
function loadFromStorage() {
  try {
    const cl = localStorage.getItem('ny_checklist');
    if (cl) checklistState = JSON.parse(cl);

    const nt = localStorage.getItem('ny_notes');
    if (nt) notesState = JSON.parse(nt);
  } catch(e) {}
}

function saveChecklist() {
  localStorage.setItem('ny_checklist', JSON.stringify(checklistState));
}

function saveNotes() {
  localStorage.setItem('ny_notes', JSON.stringify(notesState));
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
      <div class="countdown-cell">
        <div class="num">${String(n).padStart(2,'0')}</div>
        <div class="lbl">${l}</div>
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
      <div class="next-label">Próximo evento</div>
      <div class="next-title">${nextEvent.icon} ${nextEvent.title}</div>
      <div class="next-desc">${nextDay.label} · ${nextDay.dayName} ${nextDay.date.slice(5).replace('-','/')} · ${nextEvent.time}</div>
      <div class="next-desc" style="margin-top:4px">${nextEvent.desc}</div>
    `;
  }

  // Day strip on home
  const strip = document.getElementById('home-day-strip');
  if (!strip) return;
  strip.innerHTML = TRIP.days.map(d => `
    <div class="day-chip ${d.special ? 'special' : ''}" onclick="goToDay(${d.id})">
      <span class="d-emoji">${d.emoji}</span>
      <span class="d-num">${d.label}</span>
      <span class="d-date">${formatShortDate(d.date)}</span>
    </div>
  `).join('');
}

function goToDay(dayId) {
  currentDayId = dayId;
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
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;

  const container = document.getElementById('day-detail-container');
  if (!container) return;

  const note = notesState[`day_${dayId}`] || '';

  // Color gradient for banner based on day theme
  const bannerBg = `linear-gradient(135deg, ${day.color}22 0%, ${day.color}11 100%)`;

  container.innerHTML = `
    <div class="day-detail">
      <!-- Banner -->
      <div class="day-banner" style="background:${bannerBg}; border-color:${day.color}44; color:#fff;">
        ${day.special ? `<div class="special-badge">${day.specialText}</div>` : ''}
        <span class="day-banner-emoji">${day.emoji}</span>
        <div class="day-banner-label" style="color:${day.color}">${day.label} · ${day.dayName} ${formatLongDate(day.date)}</div>
        <div class="day-banner-title">${day.title}</div>
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
  transport: '🚇', hotel: '🏨', landmark: '🏛️', park: '🌳',
  restaurant: '🍽️', bar: '🍸', shop: '🛍️', museum: '🏛️',
  neighborhood: '📍', theater: '🎭'
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
  switchView('map');
  setTimeout(() => {
    filterMapByDay(dayId);
    // Sync map filter pills
    document.querySelectorAll('.map-filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.day === String(dayId));
    });
  }, 300);
}

// ─── INFO VIEW ────────────────────────────────────────────
function renderInfoView() {
  renderChecklist();
  renderTransport();
  renderApps();
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
  const catLabels = { documentos: '🪪 Documentos', equipaje: '🧳 Equipaje', internet: '📱 Internet & Apps', extras: '⭐ Extras' };

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
  showToast(checklistState[id] ? '✓ Marcado' : 'Desmarcado');
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

function applyMapFilter(el, dayId) {
  document.querySelectorAll('.map-filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  filterMapByDay(dayId === 'all' ? 'all' : Number(dayId));
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

  let allDaysHtml = '<div class="print-header"><h1>🗽 Nueva York — Rafa & Noemi</h1><p>28 Abril – 5 Mayo 2026</p></div>';

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
});
