// Un <Text> que automáticamente usa la tipografía Poppins según el fontWeight que le pongas
// en el style (por ej. fontWeight: '700' → usa la variante Bold de Poppins).
// Así en las pantallas seguimos escribiendo fontWeight normal y no hay que tocar cada estilo.
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

const pesoAFuente: Record<string, string> = {
  '300': 'Poppins_300Light',
  '400': 'Poppins_400Regular',
  normal: 'Poppins_400Regular',
  '500': 'Poppins_500Medium',
  '600': 'Poppins_600SemiBold',
  '700': 'Poppins_700Bold',
  bold: 'Poppins_700Bold',
};

export function Text({ style, ...props }: TextProps) {
  const plano = StyleSheet.flatten(style) || {};
  const peso = String(plano.fontWeight ?? '400');
  const fontFamily = pesoAFuente[peso] ?? 'Poppins_400Regular';
  return <RNText {...props} style={[{ fontFamily }, style]} />;
}
