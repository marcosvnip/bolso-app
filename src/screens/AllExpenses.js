import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExpenseList from '../components/ExpenseList';
import FAB from '../components/FAB';
import { useExpenses } from '../store/expenses-context';
import { CATEGORIES, getCategoryMeta } from '../constants/colors';
import { useTheme } from '../constants/theme';

export default function AllExpenses({ navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { transactions, loading, error } = useExpenses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions
      .filter((item) => {
        if (category === 'Todas') return true;
        if (category === 'Receitas') return item.type === 'receita';
        return item.type !== 'receita' && item.category === category;
      })
      .filter((item) => item.description.toLowerCase().includes(term));
  }, [transactions, search, category]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pela descrição"
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}
      >
        {['Todas', 'Receitas', ...CATEGORIES].map((cat) => {
          const active = cat === category;
          const meta = getCategoryMeta(cat, theme.primary);
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
            >
              {cat !== 'Todas' && cat !== 'Receitas' ? (
                <Ionicons name={meta.icon} size={15} color={active ? '#ffffff' : meta.color} />
              ) : null}
              {cat === 'Receitas' ? <Ionicons name="arrow-down-circle" size={15} color={active ? '#ffffff' : theme.success} /> : null}
              <Text style={[styles.chipText, active && { color: '#ffffff' }]}>{cat}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ExpenseList
        expenses={filtered}
        periodLabel={category === 'Todas' ? 'Todos os lançamentos' : category}
        loading={loading}
        error={error}
        emptyText="Nenhum lançamento encontrado. Toque no + para adicionar."
        onItemPress={(id) => navigation.navigate('ManageExpense', { expenseId: id })}
      />
      <FAB onPress={() => navigation.navigate('ManageExpense')} />
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { flex: 1 },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: t.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: t.border,
      marginHorizontal: 16,
      marginTop: 8,
      paddingHorizontal: 14,
    },
    searchInput: { flex: 1, paddingVertical: 13, fontSize: 16, color: t.text },
    chips: { flexGrow: 0, marginTop: 12 },
    chipsContent: { paddingHorizontal: 16, gap: 8 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: t.card,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: t.border,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    chipText: { color: t.text, fontWeight: '700' },
  });
