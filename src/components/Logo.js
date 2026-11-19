import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../constants/theme';

// Símbolo da marca: um "M" dentro de um quadrado verde, com uma moeda lima no canto
export function LogoMark({ size = 44 }) {
  const theme = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Rect width="48" height="48" rx="14" fill={theme.primary} />
      <Path
        d="M12 34 V16 L24 27 L36 16 V34"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="38" cy="10" r="5.5" fill={theme.accent} />
    </Svg>
  );
}

// Logo completa: símbolo + nome ("My" leve e "Pocket" forte)
export default function Logo({ stacked = false, size = 56 }) {
  const theme = useTheme();
  const fontSize = stacked ? 36 : size * 0.5;
  return (
    <View style={[styles.row, stacked && styles.stacked]}>
      <LogoMark size={size} />
      <Text style={{ fontSize, letterSpacing: -1.2 }}>
        <Text style={{ color: theme.text, fontWeight: '300' }}>{APP_NAME.slice(0, 2)}</Text>
        <Text style={{ color: theme.primary, fontWeight: '900' }}>{APP_NAME.slice(2)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stacked: { flexDirection: 'column', gap: 12 },
});
