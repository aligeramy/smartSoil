import Colors from '@/constants/Colors';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import React, { ReactNode, createContext, useContext } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Define theme context
type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeType;
  colors: typeof Colors.light | typeof Colors.dark;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: Colors.light,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  forcedTheme?: ColorSchemeName;
}

export function ThemeProvider({ children, forcedTheme }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const colorScheme = forcedTheme || systemColorScheme || 'light';
  
  // Create custom themes using our color palette
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.card,
      text: Colors.light.text,
      border: Colors.light.border,
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.card,
      text: Colors.dark.text,
      border: Colors.dark.border,
    },
  };
  
  const theme = colorScheme === 'dark' ? 'dark' : 'light' as ThemeType;
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  const themeContextValue: ThemeContextType = {
    theme,
    colors,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
          {children}
        </NavigationThemeProvider>
      </GestureHandlerRootView>
    </ThemeContext.Provider>
  );
} 