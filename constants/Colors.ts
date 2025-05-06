/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  forestGreen: '#013B1A',
  forestGreenTint: '#184421',
  leafGreen: '#A8C64A',
  accentGreen: '#34C759',
  ivory: '#F5F5F7',
  charcoal: '#1C1C1E',
  white: '#FFFFFF',
};

export default {
  light: {
    text: Colors.charcoal,
    background: Colors.ivory,
    primary: Colors.accentGreen,
    secondary: Colors.leafGreen,
    accent: Colors.forestGreen,
    card: Colors.white,
    border: 'rgba(28, 28, 30, 0.1)',
  },
  dark: {
    text: Colors.white,
    background: Colors.charcoal,
    primary: Colors.accentGreen,
    secondary: Colors.leafGreen,
    accent: Colors.forestGreenTint,
    card: Colors.forestGreenTint,
    border: 'rgba(255, 255, 255, 0.15)',
  },
};
