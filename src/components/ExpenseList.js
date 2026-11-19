import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseItem from './ExpenseItem';
import GradientCard from './GradientCard';
import Reveal from './Reveal';
import { useTheme } from '../constants/theme';
import { formatMoney } from '../util/date';

export default function ExpenseList({ expenses, periodLabel, loading, error, emptyText, onItemPress }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const spent = expenses.filter((item) => item.type !== 'receita').reduce((acc, item) => acc + item.amount, 0);
  const earned = expenses.filter((item) => item.type === 'receita').reduce((acc, item) => acc + item.amount, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.muted}>Carregando lançamentos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline" size={52} color={theme.error} />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <GradientCard style={styles.summary}>
          <Text style={styles.summaryLabel}>{periodLabel}</Text>
          <Text style={styles.summaryTotal}>{formatMoney(spent)}</Text>
          <Text style={styles.summaryCount}>
            {expenses.length} {expenses.length === 1 ? 'lançamento' : 'lançamentos'}
            {earned > 0 ? ` · Receitas ${formatMoney(earned)}` : ''}
          </Text>
        </GradientCard>
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <View style={styles.emptyCircle}>
            <Ionicons name="wallet-outline" size={40} color={theme.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nada por aqui</Text>
          <Text style={styles.muted}>{emptyText}</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <Reveal delay={Math.min(index, 8) * 45}>
          <ExpenseItem {...item} onPress={() => onItemPress(item.id)} />
        </Reveal>
      )}
    />
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    list: { padding: 16, paddingBottom: 120 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
    muted: { color: t.textSecondary, textAlign: 'center' },
    error: { color: t.error, textAlign: 'center' },
    summary: { marginBottom: 18, gap: 4 },
    summaryLabel: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 14 },
    summaryTotal: { color: '#ffffff', fontSize: 38, fontWeight: '900' },
    summaryCount: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
    emptyCircle: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: t.primarySoft,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: t.text },
  });
