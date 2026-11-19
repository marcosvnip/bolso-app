import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadow, useTheme } from '../constants/theme';

export default function FAB({ onPress }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: theme.accent },
        shadow(theme),
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="add" size={34} color={theme.onAccent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { transform: [{ scale: 0.94 }] },
});
