import { TutorialProvider } from '@/app/context/TutorialContext';
import { ResponsiveProvider } from '@/components/ui/ResponsiveLayout';
import { ThemeProvider } from '@/components/ui/theme';
import { AppPermissions, isAndroid, requestMultiplePermissions } from '@/lib/androidPermissions';
import { AntDesign, Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Function to load icon fonts for web
const loadWebIconFonts = () => {
  if (Platform.OS !== 'web') return;
  
  // List of icon font CSS URLs
  const iconFontUrls = [
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Ionicons.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/MaterialIcons.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/MaterialCommunityIcons.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Brands.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Regular.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Solid.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Feather.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Entypo.css',
    'https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/AntDesign.css',
  ];
  
  // Add font CSS to document head
  iconFontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });
  
  // Add global scrolling styles for web
  const style = document.createElement('style');
  style.textContent = `
    /* Global scrolling styles */
    .scrollable-content {
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      height: 100%;
    }
    
    /* Fix for WateringDecisionTool */
    .watering-decision-container {
      overflow-y: auto;
      max-height: 80vh;
      padding-bottom: 50px;
    }
    
    /* Responsive styles for web */
    @media (min-width: 768px) {
      body {
        overflow-x: hidden;
      }
      
      /* Center content on large screens */
      #root {
        display: flex;
        justify-content: center;
      }
      
      /* Max width container for large screens */
      .max-width-container {
        max-width: 1024px;
        margin: 0 auto;
        height: 100%;
      }
      
      /* Increase font sizes on tablet and desktop */
      body {
        font-size: 16px;
      }
    }
    
    /* Desktop specific styles */
    @media (min-width: 1024px) {
      body {
        font-size: 18px;
      }
      
      /* Tablet layout for desktop */
      .desktop-container {
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  `;
  document.head.appendChild(style);
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
    ...Feather.font,
    ...Entypo.font,
    ...AntDesign.font,
  });

  // Load web icon fonts
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        loadWebIconFonts();
      } catch (error) {
        console.error('Error loading web icon fonts:', error);
      }
    }
  }, []);

  // Check Android permissions on first launch
  useEffect(() => {
    if (isAndroid) {
      const checkAndroidPermissions = async () => {
        await requestMultiplePermissions([
          AppPermissions.INTERNET,
          AppPermissions.NETWORK_STATE,
          AppPermissions.WIFI_STATE
        ]);
      };
      
      checkAndroidPermissions();
    }
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ResponsiveProvider>
      <ThemeProvider>
        <TutorialProvider>
          <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar 
              barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
              backgroundColor={isAndroid ? '#063B1D' : 'transparent'}
              translucent={Platform.OS === 'ios'}
            />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 250,
                // iOS modal presentation style
                presentation: Platform.OS === 'ios' ? 'card' : undefined,
                // Android navigator bar color
                navigationBarColor: isAndroid ? '#063B1D' : undefined,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="tutorial/intro" />
              <Stack.Screen name="tutorial/lesson1" />
              <Stack.Screen name="tutorial/lesson2" />
              <Stack.Screen name="tutorial/lesson3" />
            </Stack>
          </NavigationThemeProvider>
        </TutorialProvider>
      </ThemeProvider>
    </ResponsiveProvider>
  );
}
