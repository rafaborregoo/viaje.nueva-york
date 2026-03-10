// ============================================================
//  DATOS DEL VIAJE — Rafa & Noemi en Nueva York 🗽
// ============================================================

const TRIP = {
  couple: { p1: 'Rafa', p2: 'Noemi' },
  departureDate: '2026-04-28T11:00:00',
  returnDate: '2026-05-05T20:45:00',
  flightOut: { from: 'Fuengirola/Casablanca', to: 'JFK', departure: '2026-04-28', arrival: '18:45 NY' },
  flightReturn: { from: 'JFK T1', to: 'Casablanca', departure: '20:45', date: '2026-05-05' },
  hotel: { name: 'Hotel Long Island City', area: 'Long Island City, Queens', coords: [40.7442, -73.9485] },

  // ─── CHECKLIST ────────────────────────────────────────────
  checklist: [
    { id: 'c1', cat: 'documentos', text: 'DNI', done: false },
    { id: 'c2', cat: 'documentos', text: 'Pasaporte', done: false },
    { id: 'c3', cat: 'documentos', text: 'Itinerario impreso', done: false },
    { id: 'c4', cat: 'documentos', text: 'ESTA (formulario EEUU) impreso', done: false },
    { id: 'c5', cat: 'equipaje', text: 'Equipaje de mano (máx. 55x35x25 cm, ≤10 kg cabina)', done: false },
    { id: 'c6', cat: 'equipaje', text: 'Maleta facturada (máx. 23 kg)', done: false },
    { id: 'c7', cat: 'equipaje', text: 'Accesorio personal (máx. 40x30x15 cm, ≤2 kg)', done: false },
    { id: 'c8', cat: 'internet', text: 'Configurar eSIM Holafly en el aeropuerto', done: false },
    { id: 'c9', cat: 'internet', text: 'Descargar Citymapper / Google Maps offline NY', done: false },
    { id: 'c10', cat: 'extras', text: 'Tarjeta de crédito/débito contactless para el metro', done: false },
    { id: 'c11', cat: 'extras', text: 'Ropa abrigada (abril NY puede ser frío)', done: false },
    { id: 'c12', cat: 'extras', text: 'Confirmar reserva Her Name Is Han (Día 2)', done: false },
    { id: 'c13', cat: 'extras', text: 'Tickets The Lion King (Día 6)', done: false },
    { id: 'c14', cat: 'extras', text: 'Tickets One World Observatory (Día 5)', done: false },
  ],

  // ─── TRANSPORTE ───────────────────────────────────────────
  transport: [
    { icon: '🚇', title: 'Metro & Bus NYC', desc: '3,00 $ por trayecto con tarjeta contactless. Tope automático de 35 $/persona en 7 días — después viajan GRATIS.' },
    { icon: '✈️', title: 'AirTrain JFK', desc: '8,75 $ por trayecto. No entra en el tope semanal. JFK → Jamaica Station → Metro.' },
    { icon: '📱', title: 'Pago contactless', desc: 'Sin abono físico necesario. Usar siempre el mismo método de pago para acumular el tope.' },
    { icon: '🚕', title: 'Uber / Lyft', desc: 'Para trayectos cortos con maletas o llegada nocturna al hotel.' },
  ],

  // ─── APPS ÚTILES ──────────────────────────────────────────
  apps: [
    { icon: '🗺️', name: 'Citymapper', desc: 'Metro, bus y rutas a pie en NY. Mejor que Google Maps para transporte público.' },
    { icon: '📍', name: 'Google Maps', desc: 'Navegación y búsqueda de restaurantes. Descargar mapa offline de Manhattan.' },
    { icon: '🚕', name: 'Uber / Lyft', desc: 'Taxis bajo demanda. Útil con maletas o a altas horas.' },
    { icon: '🌤️', name: 'The Weather Channel', desc: 'Previsión meteorológica detallada para Nueva York.' },
    { icon: '💱', name: 'XE Currency', desc: 'Conversor EUR ↔ USD en tiempo real.' },
  ],

  // ─── DÍAS DEL VIAJE ───────────────────────────────────────
  days: [
    {
      id: 1,
      date: '2026-04-28',
      label: 'Día 1',
      dayName: 'Martes',
      title: 'Viaje de Ida',
      emoji: '✈️',
      color: '#6c757d',
      theme: 'travel',
      description: 'El gran día ha llegado. Fuengirola → Casablanca → Nueva York 🗽',
      activities: [
        { time: '11:00', icon: '🚶', title: 'Salida de casa', desc: 'Todo preparado. Nos vamos al cercanías de Fuengirola.' },
        { time: '11:20', icon: '🚂', title: 'Cercanías Fuengirola', desc: 'Cogemos el tren hacia el aeropuerto.' },
        { time: '15:30', icon: '🛫', title: 'Aeropuerto de Casablanca', desc: 'Llegada a las 15:30 (14:30 hora local). Salir de T1 y dirigirse a T2 directamente.' },
        { time: '18:45', icon: '🗽', title: '¡Llegamos a Nueva York!', desc: 'JFK Airport. Seguir carteles AirTrain → Jamaica Station → Metro → Long Island City.', highlight: true },
        { time: 'Noche', icon: '🏨', title: 'Check-in en el hotel', desc: 'Instalarse y descansar. ¡Mañana empieza la aventura!', highlight: true }
      ],
      places: [
        { name: 'JFK Airport', coords: [40.6413, -73.7781], type: 'transport', gmaps: 'https://maps.google.com/?q=JFK+Airport+New+York' },
        { name: 'Jamaica Station', coords: [40.7019, -73.8083], type: 'transport', gmaps: 'https://maps.google.com/?q=Jamaica+Station+Queens+NY' },
        { name: 'Hotel (Long Island City)', coords: [40.7442, -73.9485], type: 'hotel', gmaps: 'https://maps.google.com/?q=Long+Island+City+Queens+New+York' }
      ]
    },
    {
      id: 2,
      date: '2026-04-29',
      label: 'Día 2',
      dayName: 'Miércoles',
      title: 'Midtown & Cumpleaños Noemi',
      emoji: '🎂',
      color: '#e91e63',
      theme: 'birthday',
      special: true,
      specialText: '🎂 ¡Feliz Cumpleaños Noemi!',
      description: 'Un día muy especial recorriendo lo mejor de Midtown para celebrar el cumple de Noemi.',
      activities: [
        { time: '10:15', icon: '☕', title: 'Desayuno y salida', desc: 'Desayuno tranquilo en el hotel. Salida hacia Midtown.' },
        { time: 'Mañana', icon: '🏛️', title: 'Grand Central Terminal', desc: 'El templo del viaje. Arquitectura impresionante en pleno corazón de Midtown.' },
        { time: 'Mañana', icon: '📚', title: 'NY Public Library + Bryant Park', desc: 'Pausa para un café con calma rodeados de uno de los parques más bonitos de la ciudad.' },
        { time: 'Tarde', icon: '⭐', title: 'Rockefeller Center', desc: 'El centro del mundo. Reconocible al instante.' },
        { time: 'Tarde', icon: '⛪', title: 'St. Patrick\'s Cathedral', desc: 'La catedral neogótica más famosa de Nueva York. Imponente entre rascacielos.' },
        { time: '19:00', icon: '🍽️', title: 'Cena: Her Name Is Han', desc: '¡Cena especial de cumpleaños! Restaurante coreano con platos que no se olvidan.', highlight: true },
        { time: '21:00', icon: '🌃', title: '230 Fifth Rooftop Bar', desc: 'Copa con las mejores vistas nocturnas de Manhattan. El Empire State a tiro de piedra.', highlight: true }
      ],
      places: [
        { name: 'Grand Central Terminal', coords: [40.7527, -73.9772], type: 'landmark', gmaps: 'https://maps.google.com/?q=Grand+Central+Terminal+New+York' },
        { name: 'NY Public Library', coords: [40.7532, -73.9822], type: 'landmark', gmaps: 'https://maps.google.com/?q=New+York+Public+Library' },
        { name: 'Bryant Park', coords: [40.7536, -73.9836], type: 'park', gmaps: 'https://maps.google.com/?q=Bryant+Park+New+York' },
        { name: 'Rockefeller Center', coords: [40.7587, -73.9787], type: 'landmark', gmaps: 'https://maps.google.com/?q=Rockefeller+Center+New+York' },
        { name: 'St. Patrick\'s Cathedral', coords: [40.7582, -73.9760], type: 'landmark', gmaps: 'https://maps.google.com/?q=St+Patrick+Cathedral+New+York' },
        { name: 'Her Name Is Han', coords: [40.7451, -73.9888], type: 'restaurant', gmaps: 'https://maps.google.com/?q=Her+Name+Is+Han+New+York' },
        { name: '230 Fifth Rooftop', coords: [40.7454, -73.9884], type: 'bar', gmaps: 'https://maps.google.com/?q=230+Fifth+Rooftop+Bar+New+York' }
      ]
    },
    {
      id: 3,
      date: '2026-04-30',
      label: 'Día 3',
      dayName: 'Jueves',
      title: 'SoHo · Nolita · Little Italy · Chinatown',
      emoji: '🛍️',
      color: '#9c27b0',
      theme: 'explore',
      description: 'Del SoHo con estilo hasta el caos colorido de Chinatown. Un día para perderse.',
      activities: [
        { time: '10:15', icon: '☕', title: 'Desayuno y salida', desc: 'Desayuno en el hotel y rumbo a SoHo.' },
        { time: 'Mañana', icon: '☕', title: 'Fast Times Coffee', desc: 'Café specialty en SoHo para arrancar el día con energía.' },
        { time: 'Mañana', icon: '💄', title: 'Glossier — 72 Spring Street', desc: 'La flagship store de Glossier en SoHo. Una parada bonita para descansar en el paseo.', highlight: true },
        { time: 'Mediodía', icon: '🍔', title: '7th Street Burger — 250 Mulberry St', desc: 'La hamburguesería de Bad Bunny x Ibai. Imprescindible.', highlight: true },
        { time: 'Tarde', icon: '🇮🇹', title: 'Little Italy', desc: 'Paseo por el barrio italiano de Manhattan. Perfecta para fotos y ambiente.' },
        { time: 'Tarde', icon: '🏮', title: 'Chinatown', desc: 'Perderse entre calles, tiendas y rincones con personalidad. La vibra es única.' },
        { time: 'Noche', icon: '🍜', title: 'Cena tranquila', desc: 'Cenar en la zona y vuelta al hotel.' }
      ],
      places: [
        { name: 'Glossier (72 Spring St)', coords: [40.7237, -74.0023], type: 'shop', gmaps: 'https://maps.google.com/?q=Glossier+72+Spring+Street+SoHo+New+York' },
        { name: '7th Street Burger (250 Mulberry)', coords: [40.7215, -73.9963], type: 'restaurant', gmaps: 'https://maps.google.com/?q=7th+Street+Burger+250+Mulberry+Street+New+York' },
        { name: 'Little Italy', coords: [40.7191, -73.9974], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=Little+Italy+Manhattan+New+York' },
        { name: 'Chinatown', coords: [40.7158, -73.9970], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=Chinatown+Manhattan+New+York' },
        { name: 'SoHo', coords: [40.7245, -74.0008], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=SoHo+Manhattan+New+York' }
      ]
    },
    {
      id: 4,
      date: '2026-05-01',
      label: 'Día 4',
      dayName: 'Viernes',
      title: 'Central Park + The Met',
      emoji: '🌳',
      color: '#4caf50',
      theme: 'culture',
      description: 'Mañana en el pulmón verde de Nueva York y tarde entre obras de arte del mundo entero.',
      activities: [
        { time: 'Mañana', icon: '🌳', title: 'Central Park', desc: 'Paseo sin itinerario cerrado. Disfrutar del ambiente, los lagos y los caminos a vuestro ritmo.' },
        { time: 'Mañana', icon: '🍪', title: 'Levain Bakery', desc: 'Las cookies más famosas de Nueva York. Parada obligatoria antes o después del parque.', highlight: true },
        { time: 'Mediodía', icon: '🥗', title: 'Whole Foods cerca del parque', desc: 'Opción práctica para platos preparados o picoteo decente antes del museo.' },
        { time: 'Tarde', icon: '🏛️', title: 'The Metropolitan Museum of Art', desc: 'Uno de los museos más grandes del mundo. A vuestro propio ritmo, sin prisa.', highlight: true },
        { time: 'Atardecer', icon: '🌆', title: 'Upper East / West Side', desc: 'Paseo tranquilo por los barrios residenciales más elegantes de Manhattan.' },
        { time: 'Noche', icon: '🍽️', title: 'Cena y vuelta al hotel', desc: 'Descansar tras un día intenso de cultura.' }
      ],
      places: [
        { name: 'Central Park', coords: [40.7851, -73.9683], type: 'park', gmaps: 'https://maps.google.com/?q=Central+Park+New+York' },
        { name: 'Levain Bakery', coords: [40.7835, -73.9791], type: 'restaurant', gmaps: 'https://maps.google.com/?q=Levain+Bakery+New+York' },
        { name: 'The Metropolitan Museum of Art', coords: [40.7794, -73.9632], type: 'museum', gmaps: 'https://maps.google.com/?q=Metropolitan+Museum+of+Art+New+York' },
        { name: 'Upper East Side', coords: [40.7736, -73.9566], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=Upper+East+Side+Manhattan+New+York' }
      ]
    },
    {
      id: 5,
      date: '2026-05-02',
      label: 'Día 5',
      dayName: 'Sábado',
      title: 'Downtown + Estatua + Brooklyn',
      emoji: '🌉',
      color: '#2196f3',
      theme: 'iconic',
      description: 'De Wall Street al Brooklyn Bridge al atardecer. El día más icónico del viaje.',
      activities: [
        { time: 'Mañana', icon: '🐂', title: 'Wall Street + Charging Bull', desc: 'El corazón financiero del mundo. Foto imprescindible con el toro.' },
        { time: 'Mañana', icon: '🏙️', title: 'One World Observatory', desc: 'Vista de 360° sobre Manhattan desde la torre más alta de América.', highlight: true },
        { time: '14:15', icon: '🍽️', title: 'Comida en Downtown', desc: 'Pausa para comer en la zona.' },
        { time: 'Tarde', icon: '⛴️', title: 'Staten Island Ferry', desc: 'GRATIS. La mejor vista de la Estatua de la Libertad desde el agua.', highlight: true },
        { time: 'Atardecer', icon: '🌉', title: 'Brooklyn Bridge', desc: 'Cruzar el puente al atardecer. Una de las imágenes más románticas del viaje.', highlight: true },
        { time: 'Noche', icon: '🍷', title: 'Cena romántica en DUMBO', desc: 'El rincón más bonito de Brooklyn. Vistas al puente y ambiente perfecto para la ocasión.', highlight: true }
      ],
      places: [
        { name: 'Wall Street', coords: [40.7074, -74.0113], type: 'landmark', gmaps: 'https://maps.google.com/?q=Wall+Street+New+York' },
        { name: 'Charging Bull', coords: [40.7056, -74.0134], type: 'landmark', gmaps: 'https://maps.google.com/?q=Charging+Bull+New+York' },
        { name: 'One World Observatory', coords: [40.7128, -74.0134], type: 'landmark', gmaps: 'https://maps.google.com/?q=One+World+Observatory+New+York' },
        { name: 'Staten Island Ferry Terminal', coords: [40.6437, -74.0173], type: 'transport', gmaps: 'https://maps.google.com/?q=Staten+Island+Ferry+Terminal+Manhattan' },
        { name: 'Brooklyn Bridge', coords: [40.7061, -73.9969], type: 'landmark', gmaps: 'https://maps.google.com/?q=Brooklyn+Bridge+New+York' },
        { name: 'DUMBO, Brooklyn', coords: [40.7033, -73.9894], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=DUMBO+Brooklyn+New+York' }
      ]
    },
    {
      id: 6,
      date: '2026-05-03',
      label: 'Día 6',
      dayName: 'Domingo',
      title: 'Vivir la Ciudad + The Lion King 🎭',
      emoji: '🎭',
      color: '#ff9800',
      theme: 'broadway',
      description: 'Un día para vivir Nueva York a vuestro ritmo y terminar con una noche mágica en Broadway.',
      activities: [
        { time: 'Mañana', icon: '🌿', title: 'Greenwich Village', desc: 'El barrio con más encanto para caminar sin rumbo, tomar un café y disfrutar del ambiente.' },
        { time: 'Mediodía', icon: '☕', title: 'Café largo y comida tranquila', desc: 'Sin prisa. Este día es para disfrutarlo.' },
        { time: 'Tarde', icon: '🍫', title: 'Hershey\'s/REESE\'S Chocolate World Times Square', desc: '701 Seventh Avenue. La experiencia REESE\'s Stuff Your Cup. Parada divertida antes de Broadway.', highlight: true },
        { time: 'Tarde', icon: '🍗', title: 'Raising Cane\'s Times Square', desc: 'Cena rápida y deliciosa antes del espectáculo.' },
        { time: 'Opción', icon: '🏨', title: 'Descanso en el hotel', desc: 'Opción de volver, ducharse y arreglarse bien antes de la gran noche.' },
        { time: 'Noche', icon: '🎭', title: 'THE LION KING — Broadway', desc: '¡El espectáculo más especial del viaje! Una experiencia que no se olvida.', highlight: true }
      ],
      places: [
        { name: 'Greenwich Village', coords: [40.7335, -74.0027], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=Greenwich+Village+Manhattan+New+York' },
        { name: 'Hershey\'s Times Square', coords: [40.7580, -73.9855], type: 'shop', gmaps: 'https://maps.google.com/?q=Hershey+Chocolate+World+Times+Square+New+York' },
        { name: 'Raising Cane\'s Times Square', coords: [40.7577, -73.9857], type: 'restaurant', gmaps: 'https://maps.google.com/?q=Raising+Canes+Times+Square+New+York' },
        { name: 'Minskoff Theatre (The Lion King)', coords: [40.7572, -73.9859], type: 'theater', gmaps: 'https://maps.google.com/?q=Minskoff+Theatre+New+York' }
      ]
    },
    {
      id: 7,
      date: '2026-05-04',
      label: 'Día 7',
      dayName: 'Lunes',
      title: 'Museo de Historia Natural + Tarde Libre',
      emoji: '🦕',
      color: '#795548',
      theme: 'relax',
      description: 'Dinosaurios por la mañana y libertad total por la tarde. El día más relajado del viaje.',
      activities: [
        { time: 'Mañana', icon: '🦕', title: 'American Museum of Natural History', desc: 'Uno de los museos más emblemáticos del mundo. Salas de dinosaurios, cosmos y culturas del mundo.', highlight: true },
        { time: 'Mediodía', icon: '🍽️', title: 'Comida relajada + café largo', desc: 'Sin prisa. Que el día fluya a ritmo suave.' },
        { time: 'Tarde', icon: '🛍️', title: 'Tarde libre', desc: 'Compras, repetir vuestro barrio favorito, o simplemente un paseo tranquilo sin plan.' },
        { time: 'Noche', icon: '🍽️', title: 'Cena y vuelta al hotel', desc: 'Último plato de la última noche completa en NY. Hacedlo memorable.' }
      ],
      places: [
        { name: 'American Museum of Natural History', coords: [40.7813, -73.9740], type: 'museum', gmaps: 'https://maps.google.com/?q=American+Museum+of+Natural+History+New+York' },
        { name: 'Upper West Side', coords: [40.7870, -73.9754], type: 'neighborhood', gmaps: 'https://maps.google.com/?q=Upper+West+Side+Manhattan+New+York' }
      ]
    },
    {
      id: 8,
      date: '2026-05-05',
      label: 'Día 8',
      dayName: 'Martes',
      title: 'Viaje de Vuelta',
      emoji: '🏠',
      color: '#607d8b',
      theme: 'return',
      description: 'El último día. Maletas, recuerdos y el vuelo de vuelta a casa.',
      activities: [
        { time: 'Mañana', icon: '☕', title: 'Último desayuno en NY', desc: 'Desayunar tranquilos en el hotel. Que no haya prisas.' },
        { time: 'Mañana', icon: '🧳', title: 'Hacer maletas', desc: 'Todo cerrado y listo con tiempo de sobra.' },
        { time: '16:15-16:30', icon: '🚶', title: 'Salida del hotel', desc: 'Partir hacia Jamaica Station en metro.' },
        { time: '~17:00', icon: '🚂', title: 'Metro → Jamaica Station', desc: 'Desde Long Island City a Jamaica Station. Allí seguir señales AirTrain JFK.' },
        { time: '~17:30', icon: '✈️', title: 'AirTrain a JFK Terminal 1', desc: '8,75 $ por persona. Dirección Terminal 1.' },
        { time: '17:45-18:00', icon: '🛂', title: 'Check-in y facturación', desc: 'Llegar con margen suficiente para vuelos internacionales. T1.' },
        { time: '20:45', icon: '🛫', title: 'Vuelo JFK → Casablanca', desc: '¡Hasta la próxima aventura! 💙', highlight: true }
      ],
      places: [
        { name: 'Hotel (Long Island City)', coords: [40.7442, -73.9485], type: 'hotel', gmaps: 'https://maps.google.com/?q=Long+Island+City+Queens+New+York' },
        { name: 'Jamaica Station', coords: [40.7019, -73.8083], type: 'transport', gmaps: 'https://maps.google.com/?q=Jamaica+Station+Queens+NY' },
        { name: 'JFK Airport T1', coords: [40.6413, -73.7781], type: 'transport', gmaps: 'https://maps.google.com/?q=JFK+Airport+Terminal+1+New+York' }
      ]
    }
  ]
};
