import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SHADOW } from '../constants/colors';
import { formatDate, formatMoney } from '../util/date';

export default function ExpenseItem({ description, amount, date, category, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{category}</Text>
        </View>
      </View>
      <View style={styles.amountBox}>
        <Text style={styles.amount}>{formatMoney(amount)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...SHADOW,
  },
  pressed: { opacity: 0.75 },
  info: { flex: 1, gap: 4 },
  description: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  date: { color: COLORS.textSecondary, fontSize: 13 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  tagText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  amountBox: { marginLeft: 12 },
  amount: { fontSize: 17, fontWeight: '800', color: COLORS.primaryDark },
});
