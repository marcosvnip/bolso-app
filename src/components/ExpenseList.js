import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseItem from './ExpenseItem';
import { COLORS, SHADOW } from '../constants/colors';
import { formatMoney } from '../util/date';

export default function ExpenseList({ expenses, periodLabel, loading, error, emptyText, onItemPress }) {
  const total = expenses.reduce((acc, item) => acc + item.amount, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.muted}>Carregando despesas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline" size={48} color={COLORS.error} />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>{periodLabel}</Text>
            <Text style={styles.summaryCount}>
              {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
            </Text>
          </View>
          <Text style={styles.summaryTotal}>{formatMoney(total)}</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Ionicons name="wallet-outline" size={52} color={COLORS.textSecondary} />
          <Text style={styles.muted}>{emptyText}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <ExpenseItem {...item} onPress={() => onItemPress(item.id)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  muted: { color: COLORS.textSecondary, textAlign: 'center' },
  error: { color: COLORS.error, textAlign: 'center' },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...SHADOW,
  },
  summaryLabel: { color: '#e4e0ff', fontWeight: '700' },
  summaryCount: { color: '#e4e0ff', marginTop: 2, fontSize: 13 },
  summaryTotal: { color: '#fff', fontSize: 28, fontWeight: '800' },
});
