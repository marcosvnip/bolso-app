import { StyleSheet, Text, View } from 'react-native';
import { LogoMark } from './Logo';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../constants/theme';

// Marca pequena (símbolo + nome) exibida no cabeçalho de todas as telas
export default function Brand() {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <LogoMark size={26} />
      <Text style={[styles.name, { color: theme.text }]}>
        {APP_NAME.slice(0, 2)}
        <Text style={{ color: theme.primary, fontWeight: '900' }}>{APP_NAME.slice(2)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 16 },
  name: { fontSize: 16, fontWeight: '300', letterSpacing: -0.5 },
});
