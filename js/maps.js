// ============================================================
//  MAPS - Leaflet.js + OpenStreetMap
// ============================================================

const PLACE_COLORS = {
  transport: '#5b9ea0',
  hotel: '#c9892e',
  landmark: '#c96fa0',
  park: '#4caf82',
  restaurant: '#e87a5a',
  bar: '#9b7fc7',
  shop: '#d4789c',
  museum: '#7b8c6f',
  neighborhood: '#b07fa8',
  theater: '#c96fa0'
};

const PLACE_LABELS = {
  transport: 'Transporte',
  hotel: 'Hotel',
  landmark: 'Monumento',
  park: 'Parque',
  restaurant: 'Restaurante',
  bar: 'Bar',
  shop: 'Tienda',
  museum: 'Museo',
  neighborhood: 'Barrio',
  theater: 'Teatro'
};

const PLACE_ICONS = {
  transport: '🚇',
  hotel: '🏨',
  landmark: '🌸',
  park: '🌿',
  restaurant: '🍽️',
  bar: '🔮',
  shop: '✨',
  museum: '🏛️',
  neighborhood: '💫',
  theater: '🎭'
};

let mapInstance = null;
let allMarkers = [];
let currentDayFilter = 'all';
let currentTypeFilter = 'all';

function initMap() {
  if (mapInstance) return;

  mapInstance = L.map('map-container', {
    center: [40.7445, -73.9485],
    zoom: 12,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(mapInstance);

  L.control.attribution({
    prefix: '<a href="https://leafletjs.com" style="color:#c96fa0">Leaflet</a> | © <a href="https://carto.com" style="color:#c96fa0">CARTO</a>'
  }).addTo(mapInstance);

  loadAllMarkers();
  applyMapFilters(false);
}

function makeMarkerIcon(type, color) {
  const emoji = PLACE_ICONS[type] || '📍';
  return L.divIcon({
    html: `<div style="
      background:${color};
      width:34px;height:34px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2.5px solid rgba(255,255,255,0.85);
      box-shadow:0 3px 12px rgba(0,0,0,0.18);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38]
  });
}

function loadAllMarkers() {
  allMarkers.forEach(entry => entry.marker.remove());
  allMarkers = [];

  TRIP.days.forEach(day => {
    day.places.forEach(place => {
      const color = PLACE_COLORS[place.type] || '#c96fa0';
      const icon = makeMarkerIcon(place.type, color);
      const marker = L.marker(place.coords, { icon }).addTo(mapInstance);

      const popupHtml = `
        <div class="popup-name">${place.name}</div>
        <div class="popup-day">${day.emoji} ${day.label} - ${day.title}</div>
        <a class="popup-link" href="${place.gmaps}" target="_blank" rel="noopener">
          🗺️ Abrir en Google Maps
        </a>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 220 });

      allMarkers.push({
        id: `marker_${allMarkers.length + 1}`,
        marker,
        dayId: day.id,
        dayLabel: `${day.emoji} ${day.label}`,
        dayTitle: day.title,
        type: place.type,
        color,
        place
      });
    });
  });
}

function filterMapByDay(dayId) {
  currentDayFilter = dayId;
  applyMapFilters(true);
}

function filterMapByType(type) {
  currentTypeFilter = type;
  applyMapFilters(true);
}

function applyMapFilters(shouldFit) {
  const visibleMarkers = getVisibleMarkers();

  allMarkers.forEach(entry => {
    if (visibleMarkers.includes(entry)) {
      entry.marker.addTo(mapInstance);
    } else {
      entry.marker.remove();
    }
  });

  updateMapSummary(visibleMarkers);
  renderVisiblePlaces(visibleMarkers);

  if (shouldFit) {
    focusMapOnVisible();
  }
}

function getVisibleMarkers() {
  return allMarkers.filter(entry => {
    const matchesDay = currentDayFilter === 'all' || entry.dayId === currentDayFilter;
    const matchesType = currentTypeFilter === 'all' || entry.type === currentTypeFilter;
    return matchesDay && matchesType;
  });
}

function updateMapSummary(visibleMarkers) {
  const summary = document.getElementById('map-results-summary');
  const count = document.getElementById('map-places-count');

  if (count) {
    count.textContent = `${visibleMarkers.length} visibles`;
  }

  if (!summary) return;

  const dayText = currentDayFilter === 'all'
    ? 'todos los dias'
    : (TRIP.days.find(day => day.id === currentDayFilter)?.label || 'dia filtrado');

  const typeText = currentTypeFilter === 'all'
    ? 'todos los tipos'
    : (PLACE_LABELS[currentTypeFilter] || currentTypeFilter);

  summary.textContent = `${visibleMarkers.length} lugares · ${dayText} · ${typeText}`;
}

function renderVisiblePlaces(visibleMarkers) {
  const container = document.getElementById('map-places-list');
  if (!container) return;

  if (!visibleMarkers.length) {
    container.innerHTML = `
      <div class="map-place-empty">
        No hay lugares para ese filtro. Prueba otro dia o otro tipo.
      </div>
    `;
    return;
  }

  container.innerHTML = visibleMarkers.map(entry => `
    <div class="map-place-card">
      <div class="map-place-top">
        <div>
          <div class="map-place-name">${escapeHtml(entry.place.name)}</div>
          <div class="map-place-meta">${escapeHtml(entry.dayLabel)} · ${escapeHtml(entry.dayTitle)}</div>
        </div>
        <div class="map-place-badge" style="background:${entry.color}">${PLACE_LABELS[entry.type] || entry.type}</div>
      </div>
      <div class="map-place-actions">
        <button class="map-place-btn primary" type="button" onclick="focusMapMarker('${entry.id}')">Ver en mapa</button>
        <a class="map-place-btn" href="${entry.place.gmaps}" target="_blank" rel="noopener">Google Maps</a>
      </div>
    </div>
  `).join('');
}

function focusMapMarker(markerId) {
  const entry = allMarkers.find(item => item.id === markerId);
  if (!entry || !mapInstance) return;

  mapInstance.flyTo(entry.place.coords, 16, { duration: 0.9 });
  setTimeout(() => entry.marker.openPopup(), 300);
}

function focusMapOnVisible() {
  if (!mapInstance) return;

  const visibleMarkers = getVisibleMarkers();
  if (!visibleMarkers.length) return;

  const coords = visibleMarkers.map(entry => entry.place.coords);
  if (coords.length === 1) {
    mapInstance.flyTo(coords[0], 15, { duration: 1 });
    return;
  }

  mapInstance.flyToBounds(L.latLngBounds(coords), { padding: [36, 36], duration: 1 });
}

function focusMapOnHotel() {
  if (!mapInstance) return;

  const hotelEntry = allMarkers.find(entry => entry.type === 'hotel');
  if (!hotelEntry) {
    if (typeof showToast === 'function') showToast('No hay hotel en el mapa');
    return;
  }

  mapInstance.flyTo(hotelEntry.place.coords, 16, { duration: 1 });
  setTimeout(() => hotelEntry.marker.openPopup(), 300);
}

function resizeMap() {
  if (mapInstance) {
    setTimeout(() => mapInstance.invalidateSize(), 100);
  }
}
