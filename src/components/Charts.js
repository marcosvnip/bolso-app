import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../constants/theme';

// Gráfico de rosca: cada fatia é um círculo desenhado com "strokeDasharray"
export function DonutChart({ data, centerLabel, centerValue, size = 170, stroke = 26 }) {
  const theme = useTheme();
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={center} cy={center} r={radius} stroke={theme.primarySoft} strokeWidth={stroke} fill="none" />
        {total > 0
          ? data.map((item) => {
              const length = (item.value / total) * circumference;
              const circle = (
                <Circle
                  key={item.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={stroke}
                  fill="none"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={-offset}
                  rotation={-90}
                  origin={`${center}, ${center}`}
                />
              );
              offset += length;
              return circle;
            })
          : null}
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.centerBox}>
          <Text style={[styles.centerLabel, { color: theme.textSecondary }]}>{centerLabel}</Text>
          <Text style={[styles.centerValue, { color: theme.text }]}>{centerValue}</Text>
        </View>
      </View>
    </View>
  );
}

// Barras dos últimos meses: receitas (verde) e despesas (cor principal)
export function MonthBars({ data, height = 130 }) {
  const theme = useTheme();
  const max = Math.max(1, ...data.flatMap((item) => [item.income, item.expense]));

  return (
    <View>
      <View style={[styles.barsRow, { height }]}>
        {data.map((item) => (
          <View key={item.key} style={styles.barGroup}>
            <View style={styles.barPair}>
              <View style={[styles.bar, { height: Math.max(3, (item.income / max) * (height - 8)), backgroundColor: theme.success }]} />
              <View style={[styles.bar, { height: Math.max(3, (item.expense / max) * (height - 8)), backgroundColor: theme.primary }]} />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.labelsRow}>
        {data.map((item) => (
          <Text key={item.key} style={[styles.monthLabel, { color: theme.textSecondary }]}>
            {item.label}
          </Text>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.success }]} />
          <Text style={{ color: theme.textSecondary }}>Receitas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          <Text style={{ color: theme.textSecondary }}>Despesas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerLabel: { fontSize: 12, fontWeight: '700' },
  centerValue: { fontSize: 18, fontWeight: '900' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  barGroup: { flex: 1, alignItems: 'center' },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bar: { width: 12, borderRadius: 6 },
  labelsRow: { flexDirection: 'row', marginTop: 8 },
  monthLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
