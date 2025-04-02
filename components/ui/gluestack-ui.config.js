// gluestack-ui.config.js
import { lightTheme, darkTheme } from '../../utils/theme';

export const config = {
  light: {
    ...lightTheme,
    colors: lightTheme,
    fonts: lightTheme.fonts
  },
  dark: {
    ...darkTheme,
    colors: darkTheme,
    fonts: darkTheme.fonts
  }
};