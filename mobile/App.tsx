import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './constants/theme';
import { supabase } from './lib/supabase';
import MainTabs from './navigation/MainTabs';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al abrir la app, revisa si ya había una sesión guardada (para no pedir
    // login cada vez que se abre la app).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) cargarRol(data.session.user.id);
      else setLoading(false);
    });

    // Se ejecuta cada vez que el usuario entra o sale (login/logout).
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) cargarRol(newSession.user.id);
      else setEsAdmin(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function cargarRol(userId: string) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    setEsAdmin(data?.role === 'admin');
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {session ? (
        <MainTabs userId={session.user.id} email={session.user.email ?? ''} esAdmin={esAdmin} />
      ) : (
        <LoginScreen />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
