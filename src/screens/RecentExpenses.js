import { useMemo } from 'react';
import { View } from 'react-native';
import ExpenseList from '../components/ExpenseList';
import FAB from '../components/FAB';
import { useExpenses } from '../store/expenses-context';
import { daysAgoISO } from '../util/date';

export default function RecentExpenses({ navigation }) {
  const { expenses, loading, error } = useExpenses();

  const recent = useMemo(() => {
    const limit = daysAgoISO(7);
    return expenses.filter((item) => item.date >= limit);
  }, [expenses]);

  return (
    <View style={{ flex: 1 }}>
      <ExpenseList
        expenses={recent}
        periodLabel="Últimos 7 dias"
        loading={loading}
        error={error}
        emptyText="Nenhuma despesa nos últimos 7 dias. Toque no + para adicionar."
        onItemPress={(id) => navigation.navigate('ManageExpense', { expenseId: id })}
      />
      <FAB onPress={() => navigation.navigate('ManageExpense')} />
    </View>
  );
}
