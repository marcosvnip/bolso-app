import { useMemo } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientCard from '../components/GradientCard';
import AppButton from '../components/AppButton';
import Reveal from '../components/Reveal';
import { useAuth } from '../store/auth-context';
import { useExpenses } from '../store/expenses-context';
import { shadow, useTheme } from '../constants/theme';
import { formatMoney } from '../util/date';

function confirmSignOut(onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm('Deseja sair da sua conta?')) onConfirm();
    return;
  }
  Alert.alert('Sair da conta', 'Deseja sair da sua conta?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function Profile() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { user, signOut } = useAuth();
  const { transactions, expenses, incomes, budget } = useExpenses();

  const name = user.displayName || 'Sem nome';
  const initial = name.trim().charAt(0).toUpperCase();
  const totalSpent = expenses.reduce((acc, item) => acc + item.amount, 0);
  const totalEarned = incomes.reduce((acc, item) => acc + item.amount, 0);

  const rows = [
    { icon: 'list', label: 'Lançamentos', value: String(transactions.length) },
    { icon: 'arrow-down-circle', label: 'Total de receitas', value: formatMoney(totalEarned) },
    { icon: 'arrow-up-circle', label: 'Total de despesas', value: formatMoney(totalSpent) },
    { icon: 'flag', label: 'Meta mensal', value: budget > 0 ? formatMoney(budget) : 'Não definida' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Reveal>
        <GradientCard style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </GradientCard>
      </Reveal>

      <Reveal delay={80}>
        <View style={styles.card}>
          {rows.map((row) => (
            <View key={row.label} style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name={row.icon} size={18} color={theme.primary} />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </Reveal>

      <Reveal delay={160}>
        <AppButton title="Sair da conta" icon="log-out" variant="danger" onPress={() => confirmSignOut(signOut)} />
      </Reveal>
    </ScrollView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { padding: 16, paddingBottom: 40, gap: 16 },
    hero: { alignItems: 'center', gap: 6 },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    avatarText: { color: '#ffffff', fontSize: 34, fontWeight: '900' },
    name: { color: '#ffffff', fontSize: 24, fontWeight: '900' },
    email: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
    card: {
      backgroundColor: t.card,
      borderRadius: 24,
      padding: 18,
      gap: 14,
      borderWidth: 1,
      borderColor: t.border,
      ...shadow(t),
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: t.primarySoft, justifyContent: 'center', alignItems: 'center' },
    rowLabel: { flex: 1, color: t.textSecondary, fontWeight: '700' },
    rowValue: { color: t.text, fontWeight: '800' },
  });
