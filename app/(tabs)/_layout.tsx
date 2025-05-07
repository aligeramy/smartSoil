import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

// Simple TabBarIcon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].primary;
  const bgColor = Colors[colorScheme ?? 'light'].background;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
          shadowOpacity: 0,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="analytics" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
      <Tabs.Screen
        name="privacy"
        options={{
          title: 'Privacy',
          tabBarIcon: ({ color }) => <TabBarIcon name="shield-checkmark" color={color} />,
          href: null, // Hide from tab bar but accessible via direct navigation
        }}
      />
      <Tabs.Screen
        name="terms"
        options={{
          title: 'Terms',
          tabBarIcon: ({ color }) => <TabBarIcon name="document-text" color={color} />,
          href: null, // Hide from tab bar but accessible via direct navigation
        }}
      />
      {/* Add any additional screens here */}
    </Tabs>
  );
}
