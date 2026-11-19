import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { friendlyAuthError, useAuth } from '../store/auth-context';
import { shadow, useTheme } from '../constants/theme';

function validate(mode, values) {
  const errors = {};
  if (mode === 'cadastro' && values.name.trim().length < 3) {
    errors.name = 'Informe seu nome (mínimo 3 letras).';
  }
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }
  if (values.password.length < 6) {
    errors.password = 'A senha precisa ter pelo menos 6 caracteres.';
  }
  return errors;
}

export default function Login() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('entrar');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === 'cadastro';

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError('');
  }

  function toggleMode() {
    setMode(isSignUp ? 'entrar' : 'cadastro');
    setErrors({});
    setFormError('');
  }

  async function handleSubmit() {
    const found = validate(mode, form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(form.name, form.email, form.password);
      } else {
        await signIn(form.email, form.password);
      }
    } catch (error) {
      setFormError(friendlyAuthError(error));
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={theme.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="wallet" size={38} color="#ffffff" />
          </View>
          <Text style={styles.brand}>Bolso</Text>
          <Text style={styles.tagline}>Suas finanças, simples e no seu bolso.</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.title}>{isSignUp ? 'Criar conta' : 'Bem-vindo de volta'}</Text>

          {isSignUp ? (
            <>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Seu nome"
                placeholderTextColor={theme.textSecondary}
              />
              {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
            </>
          ) : null}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="voce@email.com"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            onSubmitEditing={handleSubmit}
          />
          {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <View style={{ marginTop: 22 }}>
            <AppButton
              title={isSignUp ? 'Criar conta' : 'Entrar'}
              icon={isSignUp ? 'person-add' : 'log-in'}
              onPress={handleSubmit}
              loading={loading}
            />
          </View>

          <Pressable onPress={toggleMode} style={styles.switch}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Já tem conta? ' : 'Ainda não tem conta? '}
              <Text style={styles.switchLink}>{isSignUp ? 'Entrar' : 'Cadastre-se'}</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 20, paddingTop: 56, gap: 20, justifyContent: 'center' },
    hero: { borderRadius: 28, padding: 28, alignItems: 'center', gap: 8, overflow: 'hidden' },
    logo: {
      width: 72,
      height: 72,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.16)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    brand: { color: '#ffffff', fontSize: 42, fontWeight: '900', letterSpacing: -1.5 },
    tagline: { color: 'rgba(255,255,255,0.88)', fontSize: 15, textAlign: 'center' },
    card: {
      backgroundColor: t.card,
      borderRadius: 28,
      padding: 22,
      borderWidth: 1,
      borderColor: t.border,
      ...shadow(t),
    },
    title: { fontSize: 22, fontWeight: '900', color: t.text },
    label: { fontSize: 14, fontWeight: '800', color: t.text, marginTop: 16, marginBottom: 8 },
    input: {
      backgroundColor: t.background,
      borderWidth: 1.5,
      borderColor: t.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: t.text,
    },
    inputError: { borderColor: t.error },
    error: { color: t.error, marginTop: 6, fontSize: 13 },
    formError: {
      color: t.error,
      backgroundColor: t.errorSoft,
      borderRadius: 12,
      padding: 12,
      marginTop: 16,
      fontWeight: '700',
    },
    switch: { alignItems: 'center', marginTop: 18 },
    switchText: { color: t.textSecondary },
    switchLink: { color: t.primary, fontWeight: '800' },
  });
