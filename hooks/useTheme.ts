import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

export const useTheme = () => {
  const colorScheme = Appearance.getColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return {
    isDark,
    theme,
    colorScheme
  };
}; 