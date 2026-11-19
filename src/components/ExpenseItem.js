import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadow, useTheme } from '../constants/theme';
import { getCategoryMeta } from '../constants/colors';
import { formatDate, formatMoney } from '../util/date';

export default function ExpenseItem({ description, amount, date, category, type, onPress }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const meta = getCategoryMeta(category, theme.primary);
  const isIncome = type === 'receita';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.iconCircle, { backgroundColor: `${meta.color}26` }]}>
        <Ionicons name={meta.icon} size={24} color={meta.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
        <Text style={styles.sub}>{category} · {formatDate(date)}</Text>
      </View>
      <Text style={[styles.amount, isIncome && { color: theme.success }]}>
        {isIncome ? '+ ' : ''}{formatMoney(amount)}
      </Text>
    </Pressable>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: t.card,
      borderRadius: 24,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: t.border,
      ...shadow(t),
    },
    pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
    iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    info: { flex: 1, gap: 3 },
    description: { fontSize: 16, fontWeight: '800', color: t.text },
    sub: { fontSize: 13, color: t.textSecondary },
    amount: { fontSize: 16, fontWeight: '800', color: t.text },
  });
