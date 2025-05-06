import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TutorialLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#063B1D',
          },
          animation: 'fade',
        }}
      />
    </>
  );
} 