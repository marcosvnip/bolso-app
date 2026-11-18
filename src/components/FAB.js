import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { shadow, useTheme } from '../constants/theme';

export default function FAB({ onPress }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, shadow(theme), pressed && styles.pressed]}
    >
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fab}
      >
        <Ionicons name="add" size={34} color="#ffffff" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 20, bottom: 22, borderRadius: 32 },
  pressed: { transform: [{ scale: 0.94 }] },
  fab: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
});
