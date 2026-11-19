import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';

export default function AppButton({ title, icon, onPress, variant = 'primary', loading = false }) {
  const theme = useTheme();
  const background =
    variant === 'primary' ? theme.primary : variant === 'danger' ? theme.errorSoft : theme.primarySoft;
  const color = variant === 'primary' ? '#ffffff' : variant === 'danger' ? theme.error : theme.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, { backgroundColor: background }, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={color} /> : null}
          <Text style={[styles.text, { color }]}>{title}</Text>
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
    borderRadius: 18,
  },
  pressed: { opacity: 0.75 },
  text: { fontSize: 16, fontWeight: '800' },
});
