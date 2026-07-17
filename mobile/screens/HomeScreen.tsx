import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/theme';
import { supabase } from '../lib/supabase';

// Datos de ejemplo — el próximo paso después de esto es reemplazarlos por una consulta
// real: supabase.from('invoices').select('*').eq('client_id', session.user.id)
const cuentasPorCobrar = [
  { cliente: 'Constructora ABC', factura: 'F-1042', monto: '$4.200.000', vence: '25-07-2026', estado: 'pendiente' },
  { cliente: 'Minera Sur', factura: 'F-1043', monto: '$6.800.000', vence: '19-08-2026', estado: 'pagada' },
  { cliente: 'Constructora ABC', factura: 'F-1039', monto: '$2.100.000', vence: '02-07-2026', estado: 'vencida' },
];

const estadoColor: Record<string, string> = {
  pendiente: colors.yellow,
  pagada: colors.greenLight,
  vencida: colors.red,
};

const estadoTexto: Record<string, string> = {
  pendiente: 'Pendiente',
  pagada: 'Pagada',
  vencida: 'Vencida',
};

export default function HomeScreen({ email }: { email: string }) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.topbar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.dot} />
            <Text style={styles.brand}>ARGOS INSIGHTS</Text>
          </View>
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <Text style={styles.logout}>Salir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.greet}>Hola,</Text>
        <Text style={styles.greetName}>{email}</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo proyectado · 90 días</Text>
          <Text style={styles.balanceValue}>$12.800.000</Text>
        </View>

        <Text style={styles.sectionTitle}>Cuentas por cobrar</Text>

        {cuentasPorCobrar.map((f, i) => (
          <View key={i} style={styles.invoiceCard}>
            <View>
              <Text style={styles.invoiceName}>{f.cliente}</Text>
              <Text style={styles.invoiceMeta}>{f.factura} · vence {f.vence}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.invoiceAmount}>{f.monto}</Text>
              <Text style={[styles.badge, { color: estadoColor[f.estado] }]}>
                {estadoTexto[f.estado]}
              </Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green },
  brand: { color: colors.white, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },
  logout: { color: colors.muted, fontSize: 12 },
  greet: { color: colors.muted, fontSize: 12 },
  greetName: { color: colors.white, fontSize: 18, fontWeight: '700', marginBottom: 18 },
  balanceCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  balanceLabel: { color: colors.muted, fontSize: 11, marginBottom: 6 },
  balanceValue: { color: colors.greenLight, fontSize: 26, fontWeight: '700' },
  sectionTitle: { color: colors.white, fontSize: 14, fontWeight: '700', marginBottom: 10 },
  invoiceCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceName: { color: colors.white, fontSize: 13, fontWeight: '600', marginBottom: 3 },
  invoiceMeta: { color: colors.muted2, fontSize: 10.5 },
  invoiceAmount: { color: colors.white, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  badge: { fontSize: 10.5, fontWeight: '700' },
});
