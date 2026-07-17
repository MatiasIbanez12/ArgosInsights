// Cliente de Supabase para la app móvil.
// Se conecta a la misma base de datos que usará la web — mismo usuario, mismos datos.
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Estas dos variables se leen del archivo .env (ver .env.example).
// EXPO_PUBLIC_* significa que Expo las deja disponibles en el código del celular.
// No son secretas: la "anon key" está protegida por las reglas de RLS en la base de datos,
// no por estar oculta.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
