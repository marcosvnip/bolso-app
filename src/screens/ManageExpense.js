import { useLayoutEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import AppButton from '../components/AppButton';
import { useExpenses } from '../store/expenses-context';
import { CATEGORIES, COLORS } from '../constants/colors';
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
    if (window.confirm('Deseja realmente excluir esta despesa?')) onConfirm();
    return;
  }
  Alert.alert('Excluir despesa', 'Deseja realmente excluir esta despesa?', [
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
  const expenseId = route.params?.expenseId;
  const isEditing = Boolean(expenseId);
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const current = expenses.find((item) => item.id === expenseId);

  const [form, setForm] = useState({
    description: current?.description ?? '',
    amount: current ? String(current.amount) : '',
    date: current?.date ?? todayISO(),
    category: current?.category ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Editar despesa' : 'Nova despesa' });
  }, [navigation, isEditing]);

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

  async function handleSave() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const data = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      date: form.date,
      category: form.category,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await updateExpense(expenseId, data);
      } else {
        await addExpense(data);
      }
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
      navigation.goBack();
    } catch (e) {
      notify('Erro', 'Não foi possível salvar. Tente novamente.');
      setSaving(false);
    }
  }

  function handleDelete() {
    confirmDelete(async () => {
      try {
        await deleteExpense(expenseId);
        navigation.goBack();
      } catch (e) {
        notify('Erro', 'Não foi possível excluir.');
      }
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, errors.description && styles.inputError]}
          value={form.description}
          onChangeText={(t) => handleChange('description', t)}
          placeholder="Ex.: Almoço"
          placeholderTextColor={COLORS.textSecondary}
        />
        {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={[styles.input, errors.amount && styles.inputError]}
          value={form.amount}
          onChangeText={handleAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={COLORS.textSecondary}
        />
        {errors.amount ? <Text style={styles.error}>{errors.amount}</Text> : null}

        <Text style={styles.label}>Data</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            value={form.date}
            onChangeText={(t) => handleChange('date', t)}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={COLORS.textSecondary}
          />
        ) : (
          <>
            <Pressable
              style={[styles.input, errors.date && styles.inputError]}
              onPress={() => setShowPicker(true)}
            >
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
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => handleChange('category', cat)}
              style={[styles.chip, cat === form.category && styles.chipActive]}
            >
              <Text style={[styles.chipText, cat === form.category && styles.chipTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </View>
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

        <View style={styles.actions}>
          <AppButton title="Salvar" icon="checkmark" onPress={handleSave} loading={saving} />
          {isEditing ? <AppButton title="Excluir" icon="trash" variant="danger" onPress={handleDelete} /> : null}
          <AppButton title="Cancelar" variant="soft" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.error },
  dateText: { fontSize: 16, color: COLORS.text },
  error: { color: COLORS.error, marginTop: 6, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  actions: { marginTop: 28, gap: 12 },
});
