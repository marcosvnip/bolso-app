import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function AppButton({ title, icon, onPress, variant = 'primary', loading = false }) {
  const textColor = variant === 'primary' ? '#fff' : variant === 'danger' ? COLORS.error : COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={textColor} /> : null}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  primary: { backgroundColor: COLORS.primary },
  soft: { backgroundColor: COLORS.primarySoft },
  danger: { backgroundColor: COLORS.errorSoft },
  pressed: { opacity: 0.75 },
  text: { fontSize: 16, fontWeight: '700' },
});
