import { router } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Custom hook to handle Android hardware back button
 * @param customAction Optional custom function to run instead of default behavior
 * @returns void
 */
export const useAndroidBackButton = (customAction?: () => boolean) => {
  useEffect(() => {
    const backAction = () => {
      // If a custom action is provided, use it
      if (customAction) {
        return customAction();
      }

      // Default behavior - check if we can go back in router history
      if (router.canGoBack()) {
        router.back();
        return true; // Event handled
      }

      // If we're on the home screen or dashboard, let the default back behavior happen
      // which will minimize the app
      return false;
    };

    // Add event listener for hardware back press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Clean up event listener on component unmount
    return () => backHandler.remove();
  }, [customAction]);
}; 