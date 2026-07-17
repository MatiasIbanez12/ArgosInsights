# Argos Insights — Web (dashboard de clientes)

Esta carpeta es para el dashboard web de clientes (login + ver sus datos financieros).
Comparte backend (Supabase) con la app móvil en `/mobile`.

## Antes de arrancar

- **Colores/tipografía**: usá `/design-tokens.json` (raíz del repo) como referencia — así la
  web y la app se ven consistentes.
- **Backend**: proyecto Supabase ya creado y con tablas (`profiles`, `invoices`,
  `cash_flow_months`, `document_cycle`), todas con RLS activo.
  - URL: `https://xdeoioppyxztritdtuyy.supabase.co`
  - Anon/publishable key: `sb_publishable_hR8VS4xmSWlhLr7KDydVJw_jEMjOUss`
    (no es secreta, está protegida por las políticas de RLS de cada tabla)
- **Referencia visual**: `mockup-web-vs-app.html` en la raíz del repo muestra cómo se ve la
  versión web del dashboard con datos de ejemplo.

## Sugerencia de stack

Next.js + Tailwind + `@supabase/supabase-js` — así el código se despliega directo en Vercel
(la cuenta ya está enlazada a este proyecto) y usa el mismo cliente de Supabase que la app
móvil, solo que para navegador.

## Estado actual

Todavía no hay código acá — carpeta lista para que arranque el proyecto.
