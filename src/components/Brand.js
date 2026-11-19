import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../constants/theme';

// Marca pequena (ícone + nome) exibida no cabeçalho de todas as telas
export default function Brand() {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: theme.accent }]}>
        <Ionicons name="wallet" size={14} color={theme.onAccent} />
      </View>
      <Text style={[styles.name, { color: theme.text }]}>{APP_NAME}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 16 },
  icon: { width: 24, height: 24, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '900', letterSpacing: -0.4 },
});
