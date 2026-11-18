import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow, useTheme } from '../constants/theme';

export default function GradientCard({ children, style }) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={theme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, shadow(theme), style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 28, padding: 22 },
});
