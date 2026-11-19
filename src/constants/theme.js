import { useColorScheme } from 'react-native';

export const LIGHT = {
  dark: false,
  primary: '#0f5c3f',
  primaryDark: '#0a4530',
  primarySoft: '#e2efe7',
  gradient: ['#0f5c3f', '#0f5c3f'],
  accent: '#c8f169',
  onAccent: '#10231a',
  background: '#f5f2ea',
  card: '#ffffff',
  text: '#10231a',
  textSecondary: '#66756b',
  border: '#e7e2d5',
  error: '#d9483b',
  errorSoft: '#fdecea',
  success: '#1f9d62',
  warning: '#e8a317',
};

export const DARK = {
  dark: true,
  primary: '#22a868',
  primaryDark: '#1a8552',
  primarySoft: '#17261e',
  gradient: ['#14532d', '#14532d'],
  accent: '#c8f169',
  onAccent: '#10231a',
  background: '#0b0f0c',
  card: '#141a16',
  text: '#f2f5ef',
  textSecondary: '#8c9a90',
  border: '#232c26',
  error: '#ff7a6e',
  errorSoft: '#2d1815',
  success: '#4ade80',
  warning: '#f5b73b',
};

export function useTheme() {
  return useColorScheme() === 'dark' ? DARK : LIGHT;
}

export function shadow(theme) {
  return {
    shadowColor: theme.dark ? '#000000' : '#10231a',
    shadowOpacity: theme.dark ? 0.35 : 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  };
}
