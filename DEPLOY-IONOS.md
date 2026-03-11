# Deploy en IONOS sin PHP

## Arquitectura

- Frontend SPA estatica en IONOS
- Login con Supabase Auth
- Documentos en Supabase Storage
- Metadatos en tablas de Supabase

## 1. Configurar Supabase

1. Abre el SQL Editor.
2. Ejecuta `supabase/schema.sql`.
3. En `Authentication > Users`, crea los usuarios que vayais a usar vosotros.

## 2. Subida a IONOS

Sube estos archivos y carpetas al subdirectorio deseado de `noraapp.es`:

- `.htaccess`
- `index.html`
- `404.html`
- `css/`
- `js/`
- `supabase/` solo si quieres conservar el SQL en el servidor

## 3. Hosting

No necesitas PHP ni base de datos en IONOS.
Solo hosting estatico normal.

## 4. URL final

Si lo subes a:

`https://noraapp.es/viaje-ny/`

la app funcionara con rutas relativas.

## 5. Privacidad

- La `anon key` puede ir en frontend.
- La `service_role` no debe ir en frontend.
- La privacidad real la da Supabase Auth + RLS, no `noindex`.
