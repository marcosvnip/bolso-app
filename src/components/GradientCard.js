import { StyleSheet, View } from 'react-native';
import { shadow, useTheme } from '../constants/theme';

// Cartão de destaque: fundo verde sólido com formas decorativas (sem gradiente)
export default function GradientCard({ children, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.gradient[0] }, shadow(theme), style]}>
      <View pointerEvents="none" style={[styles.blob, { backgroundColor: theme.accent }]} />
      <View pointerEvents="none" style={styles.ring} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  blob: { position: 'absolute', width: 150, height: 150, borderRadius: 75, right: -44, top: -54, opacity: 0.14 },
  ring: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 26,
    borderColor: 'rgba(255,255,255,0.04)',
    left: -70,
    bottom: -90,
  },
});
