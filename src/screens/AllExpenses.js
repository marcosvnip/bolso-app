import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseList from '../components/ExpenseList';
import { useExpenses } from '../store/expenses-context';
import { CATEGORIES, COLORS } from '../constants/colors';

export default function AllExpenses({ navigation }) {
  const { expenses, loading, error } = useExpenses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return expenses
      .filter((item) => category === 'Todas' || item.category === category)
      .filter((item) => item.description.toLowerCase().includes(term));
  }, [expenses, search, category]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pela descrição"
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsContent}>
        {['Todas', ...CATEGORIES].map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.chip, cat === category && styles.chipActive]}
          >
            <Text style={[styles.chipText, cat === category && styles.chipTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ExpenseList
        expenses={filtered}
        periodLabel={category === 'Todas' ? 'Todas as despesas' : category}
        loading={loading}
        error={error}
        emptyText="Nenhuma despesa encontrada. Toque em + para adicionar."
        onItemPress={(id) => navigation.navigate('ManageExpense', { expenseId: id })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: COLORS.text },
  chips: { flexGrow: 0, marginTop: 12 },
  chipsContent: { paddingHorizontal: 16, gap: 8 },
  chip: {
    backgroundColor: COLORS.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
