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
  primary: '#2b94e6',
  primaryDark: '#1f76ba',
  primarySoft: '#26364b',
  gradient: ['#243247', '#243247'],
  accent: '#4cc3ff',
  onAccent: '#06121f',
  background: '#141c28',
  card: '#1e2938',
  text: '#eaf2fb',
  textSecondary: '#8da0b8',
  border: '#2d3c52',
  error: '#ff6b6b',
  errorSoft: '#3a2127',
  success: '#34d399',
  warning: '#fbbf24',
};

// O app usa sempre o painel escuro (visual de dashboard)
export function useTheme() {
  return DARK;
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
