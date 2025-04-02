import { Platform } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
});

export const lightTheme = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#D1D5DB',
  shadow: '#000000',
  surface: '#F5F5F5',
  surfaceSecondary: '#F3F4F6',
  fonts: {
    regular: {
      fontFamily: systemFont,
    },
  },
};

export const darkTheme = {
  background: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  border: '#404040',
  shadow: '#000000',
  surface: '#2D2D2D',
  surfaceSecondary: '#333333',
  fonts: {
    regular: {
      fontFamily: systemFont,
    },
  },
}; 