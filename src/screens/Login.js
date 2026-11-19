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
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import Logo from '../components/Logo';
import { friendlyAuthError, useAuth } from '../store/auth-context';
import { APP_TAGLINE } from '../constants/app';
import { useTheme } from '../constants/theme';

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
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('entrar');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [info, setInfo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === 'cadastro';

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError('');
    setInfo('');
  }

  function toggleMode() {
    setMode(isSignUp ? 'entrar' : 'cadastro');
    setErrors({});
    setFormError('');
    setInfo('');
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

  async function handleForgot() {
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setErrors({ email: 'Digite seu e-mail para receber o link de redefinição.' });
      return;
    }
    try {
      await resetPassword(form.email);
      setInfo('Enviamos um link para redefinir a senha. Confira seu e-mail.');
    } catch (error) {
      setFormError(friendlyAuthError(error));
    }
  }

  function field(icon, error, children) {
    return (
      <View style={[styles.field, error && styles.fieldError]}>
        <Ionicons name={icon} size={20} color={theme.textSecondary} />
        {children}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBox}>
          <Logo stacked size={72} />
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        </View>

        <Text style={styles.title}>{isSignUp ? 'Criar conta' : 'Bem-vindo de volta'}</Text>

        {isSignUp ? (
          <>
            {field(
              'person-outline',
              errors.name,
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Seu nome"
                placeholderTextColor={theme.textSecondary}
              />
            )}
            {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
          </>
        ) : null}

        {field(
          'mail-outline',
          errors.email,
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="E-mail"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        {field(
          'lock-closed-outline',
          errors.password,
          <>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
              placeholder="Senha"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.textSecondary} />
            </Pressable>
          </>
        )}
        {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

        {!isSignUp ? (
          <Pressable onPress={handleForgot} style={styles.forgot}>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </Pressable>
        ) : null}

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}

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
            <Text style={styles.link}>{isSignUp ? 'Entrar' : 'Cadastre-se'}</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    container: { flexGrow: 1, padding: 28, paddingTop: 64, justifyContent: 'center', maxWidth: 480, width: '100%', alignSelf: 'center' },
    logoBox: { alignItems: 'center', gap: 10, marginBottom: 36 },
    tagline: { color: t.textSecondary, fontSize: 14, textAlign: 'center' },
    title: { fontSize: 26, fontWeight: '900', color: t.primary, letterSpacing: -0.6, marginBottom: 18 },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: t.card,
      borderWidth: 1.5,
      borderColor: t.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      marginTop: 12,
    },
    fieldError: { borderColor: t.error },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: t.text },
    error: { color: t.error, marginTop: 6, fontSize: 13 },
    forgot: { alignSelf: 'flex-end', marginTop: 12 },
    link: { color: t.primary, fontWeight: '800' },
    formError: {
      color: t.error,
      backgroundColor: t.errorSoft,
      borderRadius: 12,
      padding: 12,
      marginTop: 16,
      fontWeight: '700',
    },
    info: {
      color: t.success,
      backgroundColor: t.primarySoft,
      borderRadius: 12,
      padding: 12,
      marginTop: 16,
      fontWeight: '700',
    },
    switch: { alignItems: 'center', marginTop: 22 },
    switchText: { color: t.textSecondary },
  });
