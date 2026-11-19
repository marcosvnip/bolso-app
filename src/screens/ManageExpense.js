import { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import AppButton from '../components/AppButton';
import { useExpenses } from '../store/expenses-context';
import { CATEGORIES, INCOME_CATEGORIES, getCategoryMeta } from '../constants/colors';
import { useTheme } from '../constants/theme';
import { formatDate, toISODate, todayISO } from '../util/date';

function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function confirmDelete(onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm('Deseja realmente excluir este lançamento?')) onConfirm();
    return;
  }
  Alert.alert('Excluir lançamento', 'Deseja realmente excluir este lançamento?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: onConfirm },
  ]);
}

function validate(values) {
  const errors = {};
  if (values.description.trim().length < 3) {
    errors.description = 'A descrição precisa ter no mínimo 3 caracteres.';
  }
  const amount = parseFloat(values.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.amount = 'Informe um valor maior que zero.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || isNaN(new Date(values.date).getTime())) {
    errors.date = 'Data inválida. Use AAAA-MM-DD.';
  } else if (values.date > todayISO()) {
    errors.date = 'A data não pode ser futura.';
  }
  if (!values.category) {
    errors.category = 'Escolha uma categoria.';
  }
  return errors;
}

export default function ManageExpense({ route, navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const expenseId = route.params?.expenseId;
  const isEditing = Boolean(expenseId);
  const { transactions, addExpense, updateExpense, deleteExpense } = useExpenses();
  const current = transactions.find((item) => item.id === expenseId);

  const [form, setForm] = useState({
    type: current?.type ?? 'despesa',
    description: current?.description ?? '',
    amount: current ? String(current.amount) : '',
    date: current?.date ?? todayISO(),
    category: current?.category ?? '',
  });
  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);

  useLayoutEffect(() => {
    const noun = form.type === 'receita' ? 'receita' : 'despesa';
    navigation.setOptions({ title: isEditing ? `Editar ${noun}` : `Nova ${noun}` });
  }, [navigation, isEditing, form.type]);

  const isIncome = form.type === 'receita';
  const categoryList = isIncome ? INCOME_CATEGORIES : CATEGORIES;

  function handleType(type) {
    setForm((prev) => ({ ...prev, type, category: '' }));
    setErrors({});
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleAmount(text) {
    const clean = text.replace(',', '.');
    if (/^\d*\.?\d{0,2}$/.test(clean)) handleChange('amount', clean);
  }

  function handlePicker(event, selected) {
    setShowPicker(Platform.OS === 'ios');
    if (selected) handleChange('date', toISODate(selected));
  }

  function handleSave() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = {
      type: form.type,
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      date: form.date,
      category: form.category,
    };

    const request = isEditing ? updateExpense(expenseId, data) : addExpense(data);
    request.catch(() => notify('Erro', 'Não foi possível salvar. Tente novamente.'));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    navigation.goBack();
  }

  function handleDelete() {
    confirmDelete(() => {
      deleteExpense(expenseId).catch(() => notify('Erro', 'Não foi possível excluir.'));
      navigation.goBack();
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.segment}>
          {[
            { key: 'despesa', label: 'Despesa', icon: 'arrow-up-circle' },
            { key: 'receita', label: 'Receita', icon: 'arrow-down-circle' },
          ].map((option) => {
            const active = form.type === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => handleType(option.key)}
                style={[styles.segmentItem, active && { backgroundColor: option.key === 'receita' ? theme.success : theme.primary }]}
              >
                <Ionicons name={option.icon} size={18} color={active ? '#ffffff' : theme.textSecondary} />
                <Text style={[styles.segmentText, active && { color: '#ffffff' }]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, errors.description && styles.inputError]}
          value={form.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder={isIncome ? 'Ex.: Salário de novembro' : 'Ex.: Almoço'}
          placeholderTextColor={theme.textSecondary}
        />
        {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={[styles.input, errors.amount && styles.inputError]}
          value={form.amount}
          onChangeText={handleAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.textSecondary}
        />
        {errors.amount ? <Text style={styles.error}>{errors.amount}</Text> : null}

        <Text style={styles.label}>Data</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            value={form.date}
            onChangeText={(text) => handleChange('date', text)}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={theme.textSecondary}
          />
        ) : (
          <>
            <Pressable style={[styles.input, errors.date && styles.inputError]} onPress={() => setShowPicker(true)}>
              <Text style={styles.dateText}>{formatDate(form.date)}</Text>
            </Pressable>
            {showPicker ? (
              <DateTimePicker
                value={new Date(`${form.date}T12:00:00`)}
                mode="date"
                maximumDate={new Date()}
                onChange={handlePicker}
              />
            ) : null}
          </>
        )}
        {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chips}>
          {categoryList.map((cat) => {
            const active = cat === form.category;
            const meta = getCategoryMeta(cat, theme.primary);
            return (
              <Pressable
                key={cat}
                onPress={() => handleChange('category', cat)}
                style={[styles.chip, active && { backgroundColor: meta.color, borderColor: meta.color }]}
              >
                <Ionicons name={meta.icon} size={16} color={active ? '#ffffff' : meta.color} />
                <Text style={[styles.chipText, active && { color: '#ffffff' }]}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

        <View style={styles.actions}>
          <AppButton title="Salvar" icon="checkmark" onPress={handleSave} />
          {isEditing ? <AppButton title="Excluir" icon="trash" variant="danger" onPress={handleDelete} /> : null}
          <AppButton title="Cancelar" variant="soft" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { padding: 20, paddingBottom: 40 },
    label: { fontSize: 14, fontWeight: '800', color: t.text, marginTop: 18, marginBottom: 8 },
    input: {
      backgroundColor: t.card,
      borderWidth: 1.5,
      borderColor: t.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: t.text,
    },
    inputError: { borderColor: t.error },
    dateText: { fontSize: 16, color: t.text },
    error: { color: t.error, marginTop: 6, fontSize: 13 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: t.card,
      borderWidth: 1.5,
      borderColor: t.border,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    chipText: { color: t.text, fontWeight: '700' },
    actions: { marginTop: 28, gap: 12 },
    segment: { flexDirection: 'row', backgroundColor: t.card, borderRadius: 999, padding: 4, borderWidth: 1, borderColor: t.border },
    segmentItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 999 },
    segmentText: { fontWeight: '800', color: t.textSecondary },
  });
