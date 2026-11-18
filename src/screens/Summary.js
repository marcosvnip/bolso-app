import { useMemo, useState } from 'react';
import { Alert, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientCard from '../components/GradientCard';
import AppButton from '../components/AppButton';
import Reveal from '../components/Reveal';
import { useExpenses } from '../store/expenses-context';
import { CATEGORIES, getCategoryMeta } from '../constants/colors';
import { shadow, useTheme } from '../constants/theme';
import { currentMonthLabel, formatDate, formatMoney, todayISO } from '../util/date';

function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function Summary() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { expenses, budget, loading, setBudget } = useExpenses();
  const [draft, setDraft] = useState('');

  const data = useMemo(() => {
    const month = todayISO().slice(0, 7);
    const list = expenses.filter((item) => item.date.startsWith(month));
    const total = list.reduce((acc, item) => acc + item.amount, 0);
    const byCategory = CATEGORIES.map((cat) => ({
      cat,
      value: list.filter((item) => item.category === cat).reduce((acc, item) => acc + item.amount, 0),
    }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value);
    const biggest = list.reduce((max, item) => (!max || item.amount > max.amount ? item : max), null);
    return { list, total, byCategory, biggest, average: total / new Date().getDate() };
  }, [expenses]);

  const ratio = budget > 0 ? data.total / budget : 0;
  const barColor = ratio >= 1 ? theme.error : ratio >= 0.7 ? theme.warning : theme.success;

  function handleSaveBudget() {
    const value = parseFloat(draft.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      notify('Meta inválida', 'Informe um valor maior que zero.');
      return;
    }
    setBudget(value).catch(() => notify('Erro', 'Não foi possível salvar a meta.'));
    setDraft('');
    Keyboard.dismiss();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Reveal>
        <GradientCard style={styles.hero}>
          <Text style={styles.heroLabel}>{currentMonthLabel()}</Text>
          <Text style={styles.heroTotal}>{loading ? '...' : formatMoney(data.total)}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroPill}>
              <Ionicons name="receipt-outline" size={14} color="#ffffff" />
              <Text style={styles.heroPillText}>{data.list.length} despesas</Text>
            </View>
            <View style={styles.heroPill}>
              <Ionicons name="trending-up" size={14} color="#ffffff" />
              <Text style={styles.heroPillText}>{formatMoney(data.average)}/dia</Text>
            </View>
          </View>
        </GradientCard>
      </Reveal>

      <Reveal delay={80}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={18} color={theme.primary} />
            <Text style={styles.cardTitle}>Meta mensal</Text>
          </View>
          {budget > 0 ? (
            <>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.min(ratio, 1) * 100}%`, backgroundColor: barColor }]} />
              </View>
              <Text style={styles.muted}>
                {formatMoney(data.total)} de {formatMoney(budget)} ({Math.round(ratio * 100)}%)
              </Text>
              {ratio >= 1 ? <Text style={styles.alert}>Você passou da meta deste mês.</Text> : null}
            </>
          ) : (
            <Text style={styles.muted}>Defina quanto você quer gastar por mês.</Text>
          )}
          <View style={styles.budgetRow}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              keyboardType="decimal-pad"
              placeholder={budget > 0 ? `Atual: ${budget}` : 'Ex.: 800'}
              placeholderTextColor={theme.textSecondary}
            />
            <View style={{ flexShrink: 0 }}>
              <AppButton title="Salvar" onPress={handleSaveBudget} />
            </View>
          </View>
        </View>
      </Reveal>

      <Reveal delay={160}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="pie-chart" size={18} color={theme.primary} />
            <Text style={styles.cardTitle}>Gastos por categoria</Text>
          </View>
          {data.byCategory.length === 0 ? (
            <Text style={styles.muted}>Sem despesas neste mês ainda.</Text>
          ) : (
            data.byCategory.map((row) => {
              const meta = getCategoryMeta(row.cat, theme.primary);
              const pct = data.total > 0 ? row.value / data.total : 0;
              return (
                <View key={row.cat} style={styles.catRow}>
                  <View style={[styles.catIcon, { backgroundColor: `${meta.color}26` }]}>
                    <Ionicons name={meta.icon} size={18} color={meta.color} />
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={styles.catTop}>
                      <Text style={styles.catName}>{row.cat}</Text>
                      <Text style={styles.catValue}>{formatMoney(row.value)}</Text>
                    </View>
                    <View style={styles.trackSmall}>
                      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: meta.color }]} />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </Reveal>

      {data.biggest ? (
        <Reveal delay={240}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={18} color={theme.primary} />
              <Text style={styles.cardTitle}>Maior gasto do mês</Text>
            </View>
            <Text style={styles.bigName}>{data.biggest.description}</Text>
            <Text style={styles.muted}>
              {data.biggest.category} · {formatDate(data.biggest.date)}
            </Text>
            <Text style={styles.bigValue}>{formatMoney(data.biggest.amount)}</Text>
          </View>
        </Reveal>
      ) : null}
    </ScrollView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { padding: 16, paddingBottom: 40, gap: 16 },
    hero: { gap: 6 },
    heroLabel: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 14 },
    heroTotal: { color: '#ffffff', fontSize: 44, fontWeight: '900' },
    heroRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
    heroPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    heroPillText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
    card: {
      backgroundColor: t.card,
      borderRadius: 24,
      padding: 18,
      gap: 12,
      borderWidth: 1,
      borderColor: t.border,
      ...shadow(t),
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: t.text },
    muted: { color: t.textSecondary },
    alert: { color: t.error, fontWeight: '700' },
    track: { height: 12, borderRadius: 6, backgroundColor: t.primarySoft, overflow: 'hidden' },
    trackSmall: { height: 8, borderRadius: 4, backgroundColor: t.primarySoft, overflow: 'hidden' },
    fill: { height: '100%', borderRadius: 6 },
    budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    input: {
      flex: 1,
      backgroundColor: t.background,
      borderWidth: 1.5,
      borderColor: t.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: t.text,
    },
    catRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    catIcon: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
    catTop: { flexDirection: 'row', justifyContent: 'space-between' },
    catName: { fontWeight: '700', color: t.text },
    catValue: { fontWeight: '800', color: t.text },
    bigName: { fontSize: 20, fontWeight: '800', color: t.text },
    bigValue: { fontSize: 28, fontWeight: '900', color: t.primary },
  });
