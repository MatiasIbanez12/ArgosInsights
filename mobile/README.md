# Argos Insights — App móvil (Expo)

App de clientes en React Native / Expo. Comparte backend (Supabase) con la web en `/web`.

## Cómo correrla la primera vez

1. Instalá Node.js si no lo tenés (nodejs.org, versión LTS).
2. Instalá la app **Expo Go** en tu celular (App Store / Play Store) — sirve para ver la app
   en tu propio teléfono mientras programás, sin instalar nada más.
3. En esta carpeta (`/mobile`), corré:
   ```
   npm install
   ```
   Esto descarga todas las librerías (tarda unos minutos la primera vez).
4. Copiá `.env.example` a `.env` (no hace falta cambiar nada, ya tiene los valores reales
   de Supabase — son públicos y están protegidos por las reglas de la base de datos).
5. Corré:
   ```
   npx expo start
   ```
   Te va a aparecer un código QR en la terminal. Escaneálo con la cámara del celular
   (Android) o con la app Expo Go (iOS) y la app se abre en tu teléfono.

## Estructura

```
mobile/
├── App.tsx              # pantalla principal (por ahora, todo en un archivo)
├── constants/theme.ts    # colores de la marca — debe coincidir con /design-tokens.json
├── lib/supabase.ts       # conexión a la base de datos compartida
└── .env.example           # variables de conexión (no secretas)
```

## Estado actual

La pantalla de inicio muestra datos de ejemplo (hardcodeados en `App.tsx`). Todavía falta:
- [ ] Login de cliente (Supabase Auth)
- [ ] Traer los datos reales desde las tablas `invoices`, `cash_flow_months`, `document_cycle`
- [ ] Pantallas de Cobros, Caja y Perfil (por ahora solo existe Inicio)
