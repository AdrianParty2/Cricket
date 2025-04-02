// theme.ts
import { Appearance } from 'react-native';

export const lightTheme = {
  primary: '#007AFF',
  background: '#F5FCFF',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  border: '#DDDDDD',
  secondaryText: '#666666',
  trophy: '#FFA500',
  danger: '#EF4444',
};

export const darkTheme = {
  primary: '#64B5F6',
  background: '#1A1A1A',
  cardBackground: '#2D2D2D',
  text: '#FFFFFF',
  border: '#444444',
  secondaryText: '#AAAAAA',
  trophy: '#FFD700',
  danger: '#DC2626',
};

export const getTheme = () => Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;