import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text } from '../components/Text';
import { colors } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { CashFlowMonth, formatCLP, nombreMes, saldoFinal } from '../lib/format';

const anchoPantalla = Dimensions.get('window').width;

export default function CajaScreen({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [meses, setMeses] = useState<CashFlowMonth[]>([]);

  async function cargar() {
    const { data } = await supabase
      .from('cash_flow_months')
      .select('*')
      .eq('client_id', userId)
      .order('mes', { ascending: true });
    setMeses((data as CashFlowMonth[]) ?? []);
  }

  useEffect(() => {
    cargar().finally(() => setLoading(false));
  }, [userId]);

  async function onRefresh() {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.green} />
      </View>
    );
  }

  const saldos = meses.map(saldoFinal);
  const ultimo = saldos[saldos.length - 1] ?? null;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />}
      >
        <Text style={styles.title}>Caja</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Saldo proyectado (último mes cargado)</Text>
          <Text style={styles.totalValue}>{ultimo != null ? formatCLP(ultimo) : 'Sin datos'}</Text>
        </View>

        {meses.length === 0 ? (
          <Text style={styles.empty}>Todavía no hay flujo de caja cargado.</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Evolución</Text>
            <View style={styles.chartCard}>
              <LineChart
                data={{
                  labels: meses.map((m) => nombreMes(m.mes)),
                  datasets: [{ data: saldos.length ? saldos : [0] }],
                }}
                width={anchoPantalla - 72}
                height={190}
                withInnerLines={false}
                withOuterLines={false}
                withShadow={false}
                bezier
                chartConfig={{
                  backgroundColor: colors.card,
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                  color: () => colors.green,
                  labelColor: () => colors.muted,
                  propsForDots: { r: '4', strokeWidth: '2', stroke: colors.greenLight },
                  propsForLabels: { fontSize: 10 },
                  formatYLabel: (v) => `${(Number(v) / 1000000).toFixed(0)}M`,
                }}
                style={{ borderRadius: 14 }}
              />
            </View>

            <Text style={styles.sectionTitle}>Detalle por mes</Text>
            {meses.map((mes, i) => (
              <View key={i} style={styles.mesCard}>
                <Text style={styles.mesNombre}>{nombreMes(mes.mes)}</Text>
                <View style={styles.mesRow}>
                  <Text style={styles.mesLabel}>Saldo inicial</Text>
                  <Text style={styles.mesValor}>{formatCLP(mes.saldo_inicial)}</Text>
                </View>
                <View style={styles.mesRow}>
                  <Text style={styles.mesLabel}>Cobros esperados</Text>
                  <Text style={[styles.mesValor, { color: colors.greenLight }]}>
                    +{formatCLP(mes.cobros_esperados)}
                  </Text>
                </View>
                <View style={styles.mesRow}>
                  <Text style={styles.mesLabel}>Otros ingresos</Text>
                  <Text style={[styles.mesValor, { color: colors.greenLight }]}>
                    +{formatCLP(mes.otros_ingresos)}
                  </Text>
                </View>
                <View style={styles.mesRow}>
                  <Text style={styles.mesLabel}>Egresos</Text>
                  <Text style={[styles.mesValor, { color: colors.red }]}>
                    -{formatCLP(mes.egresos_fijos + mes.egresos_variables)}
                  </Text>
                </View>
                <View style={[styles.mesRow, { marginTop: 4 }]}>
                  <Text style={[styles.mesLabel, { fontWeight: '700', color: colors.white }]}>Saldo final</Text>
                  <Text style={[styles.mesValor, { fontWeight: '700', color: colors.greenLight }]}>
                    {formatCLP(saldoFinal(mes))}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { color: colors.white, fontSize: 20, fontWeight: '700', marginBottom: 16 },
  totalCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  totalLabel: { color: colors.muted, fontSize: 11, marginBottom: 6 },
  totalValue: { color: colors.greenLight, fontSize: 24, fontWeight: '700' },
  empty: { color: colors.muted2, fontSize: 12 },
  sectionTitle: { color: colors.white, fontSize: 14, fontWeight: '700', marginBottom: 10, marginTop: 6 },
  chartCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  mesCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  mesNombre: { color: colors.white, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  mesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  mesLabel: { color: colors.muted, fontSize: 11.5 },
  mesValor: { color: colors.white, fontSize: 11.5, fontWeight: '600' },
});
