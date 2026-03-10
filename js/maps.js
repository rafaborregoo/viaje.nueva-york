// ============================================================
//  MAPS — Leaflet.js + OpenStreetMap · Princess & Mystic Theme
// ============================================================

const PLACE_COLORS = {
  transport:    '#5b9ea0',
  hotel:        '#c9892e',
  landmark:     '#c96fa0',
  park:         '#4caf82',
  restaurant:   '#e87a5a',
  bar:          '#9b7fc7',
  shop:         '#d4789c',
  museum:       '#7b8c6f',
  neighborhood: '#b07fa8',
  theater:      '#c96fa0'
};

const PLACE_ICONS = {
  transport:    '🚇',
  hotel:        '🏨',
  landmark:     '🌸',
  park:         '🌿',
  restaurant:   '🍽️',
  bar:          '🔮',
  shop:         '✨',
  museum:       '🏛️',
  neighborhood: '💫',
  theater:      '🎭'
};

let mapInstance = null;
let allMarkers = [];
let currentDayFilter = 'all';

function initMap() {
  if (mapInstance) return;

  mapInstance = L.map('map-container', {
    center: [40.7445, -73.9485],
    zoom: 12,
    zoomControl: true,
    attributionControl: false
  });

  // Warm/light tile layer — CartoDB Voyager (bright, warm)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(mapInstance);

  L.control.attribution({
    prefix: '<a href="https://leafletjs.com" style="color:#c96fa0">Leaflet</a> | © <a href="https://carto.com" style="color:#c96fa0">CARTO</a>'
  }).addTo(mapInstance);

  loadAllMarkers();
}

function makeMarkerIcon(type, color) {
  const emoji = PLACE_ICONS[type] || '💫';
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
  allMarkers.forEach(m => m.marker.remove());
  allMarkers = [];

  TRIP.days.forEach(day => {
    day.places.forEach(place => {
      const color = PLACE_COLORS[place.type] || '#c96fa0';
      const icon = makeMarkerIcon(place.type, color);
      const marker = L.marker(place.coords, { icon }).addTo(mapInstance);

      const popupHtml = `
        <div class="popup-name">${place.name}</div>
        <div class="popup-day">${day.emoji} ${day.label} — ${day.title}</div>
        <a class="popup-link" href="${place.gmaps}" target="_blank" rel="noopener">
          🗺️ Abrir en Google Maps
        </a>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 220 });
      allMarkers.push({ marker, dayId: day.id, type: place.type });
    });
  });
}

function filterMapByDay(dayId) {
  currentDayFilter = dayId;

  allMarkers.forEach(({ marker, dayId: mDayId }) => {
    if (dayId === 'all' || mDayId === dayId) {
      marker.addTo(mapInstance);
    } else {
      marker.remove();
    }
  });

  if (dayId !== 'all') {
    const day = TRIP.days.find(d => d.id === dayId);
    if (day && day.places.length > 0) {
      const coords = day.places.map(p => p.coords);
      if (coords.length === 1) {
        mapInstance.flyTo(coords[0], 15, { duration: 1 });
      } else {
        const bounds = L.latLngBounds(coords);
        mapInstance.flyToBounds(bounds, { padding: [40, 40], duration: 1 });
      }
    }
  } else {
    mapInstance.flyTo([40.7445, -73.9485], 12, { duration: 1 });
  }
}

function resizeMap() {
  if (mapInstance) setTimeout(() => mapInstance.invalidateSize(), 100);
}
