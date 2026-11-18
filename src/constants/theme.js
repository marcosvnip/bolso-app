import { useColorScheme } from 'react-native';

export const LIGHT = {
  dark: false,
  primary: '#6c5ce7',
  primaryDark: '#4b3fc4',
  primarySoft: '#ece9ff',
  gradient: ['#6c5ce7', '#a855f7'],
  background: '#f6f5fb',
  card: '#ffffff',
  text: '#14142b',
  textSecondary: '#6e6e87',
  border: '#ebebf3',
  error: '#e5484d',
  errorSoft: '#ffeceb',
  success: '#12b886',
  warning: '#f59f00',
};

export const DARK = {
  dark: true,
  primary: '#8b7dff',
  primaryDark: '#6c5ce7',
  primarySoft: '#2a2650',
  gradient: ['#5b4bd6', '#a855f7'],
  background: '#0e0e1a',
  card: '#1a1a2c',
  text: '#f4f4ff',
  textSecondary: '#9a9ab5',
  border: '#2a2a42',
  error: '#ff6b70',
  errorSoft: '#3a1d22',
  success: '#3ddc97',
  warning: '#ffb938',
};

export function useTheme() {
  return useColorScheme() === 'dark' ? DARK : LIGHT;
}

export function shadow(theme) {
  return {
    shadowColor: theme.dark ? '#000000' : '#2b2457',
    shadowOpacity: theme.dark ? 0.4 : 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  };
}
